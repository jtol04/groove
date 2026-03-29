# https://pylearnai.com/machine-learning/deploy-scikit-learn-models-fastapi/

from fastapi import FastAPI
from pydantic import BaseModel 
import joblib
import numpy as np


app = FastAPI(
    title = "Groove Classifier API",
    description = "An API that predicts whether a user would like a given song or not",
    version = "1.0.0"
)


model = joblib.load("groove_model.pkl")
scaler = joblib.load("scaler.pkl")
class GrooveInput(BaseModel):
    features: list

    class Config:
        schema_extra = {
            "example": {
               "features": [0.72, 0.65, 0.08, 0.15, 0.0, 0.12, 0.55, 120.0, -6.5]
            }
        }
    
@app.post("/predict")
def predict(input: GrooveInput):
    """
    Make a prediction using the trained model
    """
    scaled = scaler.transform([input.features])
    prediction = model.predict(scaled)
    probability = model.predict_proba(scaled)[0][1]
    return {
        "prediction": int(prediction[0]),
        "like_probability": round(float(probability), 4)                              
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the Groove Classifier API"}