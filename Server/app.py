from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import pickle
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# ===== PATHS =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "Model", "sentiment_model.keras")
TOKENIZER_PATH = os.path.join(BASE_DIR, "Model", "tokenizer.pickle")
LOG_FILE = os.path.join(BASE_DIR, "Model", "prediction_logs.jsonl")

# ===== LOAD MODEL AND TOKENIZER =====
model = keras.models.load_model(MODEL_PATH)
with open(TOKENIZER_PATH, "rb") as handle:
    tokenizer = pickle.load(handle)

# ===== CONSTANTS =====
max_length = 150
label_map = {0: "Negative", 1: "Neutral", 2: "Positive"}

# ===== SENTIMENT PREDICTION FUNCTION =====
def predict_sentiment(text):
    sequence = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequence, maxlen=max_length, padding='post')
    prediction = model.predict(padded)
    label_index = np.argmax(prediction)
    return label_map[label_index], prediction.tolist()

# ===== API: Predict Sentiment =====
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    sentiment, confidence = predict_sentiment(text)

    # ==== Save to log ====
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "text": text,
        "sentiment": sentiment,
        "confidence": confidence
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")

    return jsonify({"sentiment": sentiment, "confidence": confidence})

# ===== API: Get All Logs =====
@app.route('/logs', methods=['GET'])
def get_logs():
    try:
        logs = []
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    logs.append(json.loads(line))
        return jsonify(logs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===== RUN SERVER =====
if __name__ == '__main__':
    app.run(debug=True, port=5000)
