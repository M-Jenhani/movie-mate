# MovieMate

MovieMate is a full-stack movie recommendation platform with personalized recommendations.

## Components
- `backend/` — Node.js + TypeScript + Express + Prisma + JWT auth
- `recommender/` — FastAPI + PyTorch + scikit-learn hybrid recommender
- `frontend/` — React + TypeScript + Vite + Tailwind UI

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services with Docker Compose
docker-compose up --build

# Seed the database (first time only)
docker-compose exec backend npm run seed

# Train the recommender (optional)
docker-compose exec backend npx ts-node src/scripts/train_recommender.ts
```

Access the app at http://localhost:3000

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

### Option 2: Manual Setup (PowerShell)

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

