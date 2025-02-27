from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import pickle
import os

app = Flask(__name__)

# เปิด CORS สำหรับทุกต้นทาง
CORS(app)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})


# ใช้ path แบบเต็มเพื่อให้สามารถเข้าถึงไฟล์ได้
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "Model", "sentiment_model.keras")
TOKENIZER_PATH = os.path.join(BASE_DIR, "Model", "tokenizer.pickle")

# โหลดโมเดลและ Tokenizer
model = keras.models.load_model(MODEL_PATH)
with open(TOKENIZER_PATH, "rb") as handle:
    tokenizer = pickle.load(handle)

# ค่าพารามิเตอร์จากการเทรน
max_length = 150

# ฟังก์ชันทำนาย Sentiment
def predict_sentiment(text):
    sequence = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequence, maxlen=max_length, padding='post')
    prediction = model.predict(padded)
    label_index = np.argmax(prediction)
    
    label_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
    return label_map[label_index], prediction.tolist()

# สร้าง API รับข้อความจาก React
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    sentiment, confidence = predict_sentiment(text)
    return jsonify({"sentiment": sentiment, "confidence": confidence})

# รันเซิร์ฟเวอร์
if __name__ == '__main__':
    app.run(debug=True, port=5000)
