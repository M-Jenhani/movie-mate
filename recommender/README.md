# Recommender (FastAPI + PyTorch + scikit-learn)

Setup

1. Create a Python virtualenv and install requirements: `pip install -r requirements.txt`.
2. Copy `.env.example` to `.env` and configure `BACKEND_URL`.
3. Run the app: `uvicorn app.main:app --reload --port 8001`.

Usage

- `POST /train` with a JSON body of movies and optional ratings trains the model.
- `GET /recommend/{user_id}` returns recommendations for a user.
