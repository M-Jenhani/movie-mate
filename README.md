# MovieMate

MovieMate is a full-stack movie recommendation platform (scaffold).

Components:
- `backend/` — Node.js + TypeScript + Express + Prisma + JWT auth
- `recommender/` — FastAPI + PyTorch + scikit-learn hybrid recommender
- `frontend/` — React + TypeScript + Vite + Tailwind UI

See each folder's README and `.env.example` for run instructions.

Quick start (PowerShell):

1. Start Postgres and set `DATABASE_URL` in `backend/.env`.
2. In `backend/`:

```powershell
cd backend; npm install; cp .env.example .env; npm run prisma:generate; npm run prisma:migrate; npm run seed
```

3. In `recommender/`:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

4. In `frontend/`:

```powershell
cd frontend; npm install; npm run dev
```

