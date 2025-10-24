# app.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
import numpy as np

# ----------------------
# 1. Initialize FastAPI
# ----------------------
app = FastAPI()

# Allow CORS for local React dev
origins = [
    "http://localhost:3000",
    "https://your-frontend-url.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# 2. Input Schema
# ----------------------
class TextInput(BaseModel):
    text: str

# ----------------------
# 3. Load model + tokenizer
# ----------------------
MODEL_PATH = "./roberta_ai_vs_human_tf"  # folder containing saved model & tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = TFAutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

MAX_LENGTH = 256

# ----------------------
# 4. Predict function
# ----------------------
def predict(text):
    enc = tokenizer(
        text,
        max_length=MAX_LENGTH,
        padding="max_length",
        truncation=True,
        return_tensors="tf"
    )
    logits = model(enc).logits
    pred = tf.argmax(logits, axis=1).numpy()[0]
    return "Human-written text" if pred == 0 else "AI-Generated text"

# ----------------------
# 5. API Route
# ----------------------
@app.post("/predict")
def predict_text(input: TextInput):
    result = predict(input.text)
    return {"prediction": result}
