# https://pylearnai.com/machine-learning/deploy-scikit-learn-models-fastapi/
# dictionary and priority queue implementations

from fastapi import FastAPI
from pydantic import BaseModel 
import joblib
import numpy as np
import pandas as pd
import heapq
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title = "Groove Classifier API",
    description = "An API that predicts whether a user would like a given song or not",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("models/groove_model.pkl")
scaler = joblib.load("models/scaler.pkl")

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
    #probability = model.predict_proba(scaled)[0][1]
    return {
        "prediction": int(prediction[0]),
    #    "like_probability": round(float(probability), 4)                              
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the Groove Classifier API"}


class Song(BaseModel):
    track_id: str
    artists: str
    album_name: str
    track_name: str


df = pd.read_csv("../data/dataset.csv")

@app.get("/songs", response_model = list[Song])
def get_songs(limit: int = 5):
    batch = df.sample(n=limit)
    songs = []
    for _, row in batch.iterrows():
        songs.append(Song(
            track_id = str(row["track_id"]),
            artists = str(row["artists"]),
            album_name = str(row["album_name"]),
            track_name = str(row["track_name"])
            ))
    return songs

class Swipe(BaseModel):
    track_id: str
    liked: bool

# dictionary
user_swipes = {}

@app.post("/swipe")
def swipe(swipe: Swipe):
    user_swipes[swipe.track_id] = swipe.liked
    return {
        "track_id": swipe.track_id,
        "liked": swipe.liked,
        "total_swipes": len(user_swipes)
    }

audio_features = [
    "danceability", "energy", "speechiness", "acousticness",
    "instrumentalness", "liveness", "valence", "tempo", "loudness"
]

@app.get("/recommendations")
def get_recommendations(n: int = 8):

    filtered = df[~df["track_id"].isin(user_swipes)]

    X = filtered[audio_features].values
    X_scaled = scaler.transform(X)
    probabilities = model.predict_proba(X_scaled)[:, 1]

    # priority queue implementation
    top_n = heapq.nlargest(n, range(len(probabilities)), key = lambda i: probabilities[i])

    recs = []
    for i in top_n:
        row = filtered.iloc[i]
        recs.append({
            "track_name": row["track_name"],
            "artists": row["artists"],
            "match": probabilities[i]
        })
    
    return recs

@app.get("/profile")
def get_profile():
    return