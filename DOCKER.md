# MovieMate - Docker Setup

This guide explains how to run the entire MovieMate platform using Docker Compose.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Docker Compose v2.0+

## Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd MovieMate
```

### 2. Create environment file (optional)
The docker-compose.yml already has default values, but you can customize them:

```bash
# Create .env file in root directory
cp .env.example .env
```

### 3. Start all services
```bash
docker-compose up --build
```

Or run in detached mode:
```bash
docker-compose up -d --build
```

### 4. Seed the database (first time only)
After all services are running, seed the database with movies:

```bash
docker-compose exec backend npm run seed
```

### 5. Train the recommender (optional)
```bash
docker-compose exec backend npx ts-node src/scripts/train_recommender.ts
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Recommender API**: http://localhost:8001
- **PostgreSQL**: localhost:5432

Default PostgreSQL credentials:
- Username: `moviemate`
- Password: `moviemate123`
- Database: `moviemate`

## Useful Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f recommender
docker-compose logs -f frontend
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (clean slate)
```bash
docker-compose down -v
```

### Rebuild a specific service
```bash
docker-compose up -d --build backend
```

### Run commands in containers
```bash
# Backend commands
docker-compose exec backend npm install <package>
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma studio

# Recommender commands
docker-compose exec recommender pip install <package>

# Frontend commands
docker-compose exec frontend npm install <package>
```

### Access container shell
```bash
docker-compose exec backend sh
docker-compose exec recommender bash
docker-compose exec frontend sh
```

## Architecture

The Docker Compose setup includes:

1. **PostgreSQL** - Database for users, movies, ratings, and watchlist
2. **Backend** - Node.js + Express API with Prisma ORM
3. **Recommender** - FastAPI + PyTorch hybrid recommendation engine
4. **Frontend** - React + Vite UI

All services are connected via a custom Docker network `moviemate-network`.

## Development Workflow

The containers are configured with volume mounts for hot-reloading:

- **Backend**: Changes to `./backend` automatically reload the server
- **Recommender**: Changes to `./recommender` automatically reload FastAPI
- **Frontend**: Changes to `./frontend` trigger Vite hot module replacement

## Troubleshooting

### Database connection issues
```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U moviemate

# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose up -d backend
docker-compose exec backend npm run seed
```

### Port already in use
If ports 3000, 4000, 5432, or 8001 are already in use, edit `docker-compose.yml` to change the port mappings.

### Rebuild from scratch
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
docker-compose exec backend npm run seed
```

### View service status
```bash
docker-compose ps
```

## Production Deployment

For production, you should:

1. Change database credentials in `docker-compose.yml`
2. Set strong `JWT_SECRET` in backend environment
3. Use production builds for frontend (modify Dockerfile)
4. Add reverse proxy (nginx) for SSL/HTTPS
5. Use managed database service instead of containerized PostgreSQL
6. Set up proper logging and monitoring

## Notes

- The PostgreSQL data is persisted in a Docker volume named `postgres_data`
- First startup takes longer due to downloading images and building
- Backend waits for PostgreSQL to be healthy before starting
- Migrations run automatically on backend startup
