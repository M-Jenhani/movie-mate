# Backend (Node + TypeScript + Prisma)

Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies: `npm install` in `backend/`.
3. Generate Prisma client: `npm run prisma:generate`.
4. Run migrations: `npm run prisma:migrate` (requires Postgres running).
5. optional : Seed sample data: `npm run seed`. 
6. Fetch movies from TMBD : `npx ts-node src/scripts/fetch_tmdb.ts`
7. Start dev server: `npm run dev` (runs on `4000`).

APIs: `/api/auth`, `/api/users`, `/api/movies`
