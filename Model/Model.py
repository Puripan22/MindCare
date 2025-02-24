import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.layers import Embedding, LSTM, Bidirectional, Dense, Dropout, BatchNormalization
import numpy as np
import pandas as pd
import pickle

# โหลด Dataset
df = pd.read_csv("expanded_sentiment_dataset.csv")

# แยกข้อความและ labels
texts = df["text"].tolist()
labels = df["label"].values

# Tokenization
max_words = 20000  # เพิ่มจำนวนคำสูงสุดใน Tokenizer
max_length = 150   # เพิ่มความยาวข้อความ (Padding)
tokenizer = Tokenizer(num_words=max_words, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded_sequences = pad_sequences(sequences, maxlen=max_length, padding='post')

# แปลง labels เป็น numpy array
labels = np.array(labels)

# ปรับปรุงโมเดล
model = keras.Sequential([
    Embedding(max_words, 128, input_length=max_length),  # เพิ่มขนาด embedding
    Bidirectional(LSTM(64, return_sequences=True)),  # ใช้ BiLSTM + return_sequences
    Dropout(0.3),  # ป้องกัน overfitting
    Bidirectional(LSTM(32)),  # LSTM ชั้นที่สอง
    BatchNormalization(),  # Normalization
    Dense(32, activation='relu'),
    Dropout(0.3),
    Dense(3, activation='softmax')  # 3 คลาส (Negative, Neutral, Positive)
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# เทรนโมเดล
model.fit(padded_sequences, labels, epochs=15, batch_size=64, verbose=2, validation_split=0.1)

# บันทึกโมเดล
model.save("sentiment_model.keras")

# บันทึก tokenizer
with open("tokenizer.pickle", "wb") as handle:
    pickle.dump(tokenizer, handle)

print("Model and tokenizer saved successfully!")

# ==============================
# ✅ โหลดโมเดล + ทดสอบ
# ==============================

# โหลดโมเดล
model = keras.models.load_model("sentiment_model.keras")

# โหลด tokenizer
with open("tokenizer.pickle", "rb") as handle:
    tokenizer = pickle.load(handle)

# ฟังก์ชันทดสอบข้อความใหม่
def predict_sentiment(text):
    sequence = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequence, maxlen=max_length, padding='post')
    prediction = model.predict(padded)
    label_index = np.argmax(prediction)
    
    label_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
    return label_map[label_index], prediction.tolist()

# ==============================
#  ทดสอบโมเดล
# ==============================

test_sentences = [
    "I absolutely love this!",  # ควรเป็น Positive
    "It's okay, but nothing special.",  # ควรเป็น Neutral
    "I hate this so much.",  # ควรเป็น Negative
]

for sentence in test_sentences:
    sentiment, confidence = predict_sentiment(sentence)
    print(f" Text: {sentence}")
    print(f" Sentiment: {sentiment}")
    print(f" Confidence: {confidence}\n")
