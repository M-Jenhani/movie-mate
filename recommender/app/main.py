from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
from .model import SimpleHybridRecommender
import os
import requests

app = FastAPI(title='MovieMate Recommender')

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
rec = SimpleHybridRecommender()


class MovieItem(BaseModel):
    id: int
    title: str
    overview: str = ''
    posterPath: str = ''


@app.get('/health')
def health():
    return {'ok': True}


@app.post('/train')
def train(movies: List[MovieItem], ratings: List[dict] = []):
    # Fit content
    items = [{'id': m.id, 'title': m.title, 'overview': m.overview or '', 'posterPath': m.posterPath or '', 'text': (m.title + ' ' + (m.overview or ''))} for m in movies]
    rec.fit_content(items)
    rec.train_collaborative(ratings)
    return {'status': 'trained', 'movies': len(movies), 'ratings': len(ratings)}


@app.get('/recommend/{user_id}')
def recommend(user_id: int, topk: int = 10):
    if rec.movie_meta is None:
        raise HTTPException(status_code=400, detail='Model not trained')
    out = rec.recommend_for_user(user_id, topk=topk)
    # Ensure results are serializable
    return {'user': user_id, 'recommendations': out}


if __name__ == '__main__':
    uvicorn.run('app.main:app', host='0.0.0.0', port=int(os.getenv('PORT','8001')), reload=True)
