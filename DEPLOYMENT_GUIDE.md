# MovieMate - Complete Deployment Guide

Your project is now configured for FREE deployment! Everything is set up and committed to GitHub.

## Current Setup Status

✅ **Environment Configuration** - All files configured for production  
✅ **API Endpoints** - Dynamic URLs via environment variables  
✅ **GitHub Ready** - Latest changes pushed to [https://github.com/M-Jenhani/movie-mate](https://github.com/M-Jenhani/movie-mate)  
✅ **Deployment Files** - Procfiles and env configs for easy deployment

## Deploy Now (5 minutes per service)

### Step 1: Deploy Frontend to Vercel (2 minutes)

**Why Vercel?** Free, auto-deploys on git push, optimized for React/Vite

1. Go to https://vercel.com/signup (sign up with GitHub)
2. Click "Import Project"
3. Select your MovieMate repository
4. **Framework preset:** Vite
5. **Root directory:** `frontend/`
6. **Environment Variables:** Add one variable:
   - Name: `VITE_API_URL`
   - Value: (leave blank for now, will update after backend is deployed)
7. Click **Deploy**

**Result:** Your app will be live at `https://moviemate-yourname.vercel.app`

> Note: It will show an error until you update `VITE_API_URL` in next step.

---

### Step 2: Deploy Backend + Database to Railway (3 minutes)

**Why Railway?** Free tier, includes PostgreSQL, easy multi-service setup

1. Go to https://railway.app/login (sign up with GitHub)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your MovieMate repository
4. Railway will auto-detect services; configure these:

**For Backend Service:**
- Root directory: `backend/`
- Name: `moviemate-backend`
- Environment Variables (add these):
  ```
  NODE_ENV=production
  PORT=4000
  DATABASE_URL=postgresql://... (Railway will auto-fill after adding Postgres)
  JWT_SECRET=your-very-secure-random-string-here-use-32-chars
  TMDB_API_KEY=your-tmdb-api-key-from-tmdb-api
  RECOMMENDER_URL=https://moviemate-recommender-yourname.railway.app
  ```

**Add PostgreSQL to your project:**
- In Railway dashboard, click **+ Add**
- Select **PostgreSQL**
- Railway will auto-populate `DATABASE_URL`

**For Recommender Service:**
- Create separate service
- Root directory: `recommender/`
- Name: `moviemate-recommender`
- Environment Variables:
  ```
  PORT=8001
  BACKEND_URL=https://moviemate-backend-yourname.railway.app
  ```

5. Deploy each service

**Result:** 
- Backend: `https://moviemate-backend-yourname.railway.app`
- Recommender: `https://moviemate-recommender-yourname.railway.app`
- Database: PostgreSQL running

---

### Step 3: Update URLs and Redeploy

Now update all the URLs:

**1. Update Backend Environment in Railway:**
- Add your actual `RECOMMENDER_URL` (from Step 2)
- Redeploy backend

**2. Update Recommender Environment in Railway:**
- Add your actual `BACKEND_URL` (from Step 2)
- Redeploy recommender

**3. Update Frontend Environment in Vercel:**
- Go to Vercel project settings
- Environment Variables → `VITE_API_URL`
- Set to: `https://moviemate-backend-yourname.railway.app`
- Trigger redeploy

**4. Seed the Database:**
- SSH into Railway backend container
- Run: `npm run seed`
- This populates database with TMDB movies

---

### Step 4: Test Everything

Your app is now LIVE at: `https://moviemate-yourname.vercel.app`

Test:
1. ✅ Go to /discover page - should load movies
2. ✅ Register a new account
3. ✅ Log in
4. ✅ Rate a movie - should save
5. ✅ Click "For You" - should show recommendations
6. ✅ Add to watchlist - should save
7. ✅ Check watchlist

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Vercel (Frontend)                      │
│                                                              │
│  React + Vite + Tailwind                                    │
│  https://moviemate-yourname.vercel.app                      │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
┌────────▼──────────────┐ ┌──────▼─────────────────┐
│ Railway Backend       │ │ Railway Recommender    │
│ (Node + Express)      │ │ (FastAPI + PyTorch)    │
│ Port: 4000           │ │ Port: 8001             │
│ /api/auth            │ │ /recommend             │
│ /api/movies          │ │ /train                 │
│ /api/users           │ │                        │
│ /api/ratings         │ │                        │
│ /api/watchlist       │ │                        │
└────────┬─────────────┘ └──────────────────────┘
         │
    ┌────▼────────────┐
    │ Railway Database │
    │ PostgreSQL 15    │
    │ (movies, users,  │
    │  ratings,        │
    │  watchlist)      │
    └─────────────────┘
```

---

## Cost Breakdown

| Service | Cost | Details |
|---------|------|---------|
| **Vercel Frontend** | FREE | Unlimited deploys, 100GB bandwidth |
| **Railway Backend** | FREE | $5/month credits (~500 API calls) |
| **Railway Database** | FREE | Included in Railway credits |
| **Railway Recommender** | FREE | Included in Railway credits |
| **TMDB API** | FREE | 40 requests/10 seconds |
| **TOTAL** | **FREE** (or ~$5/month if you exceed) |

---

## Troubleshooting

### "API requests failing - 502 Bad Gateway"
- Check that `VITE_API_URL` in Vercel is correct
- Verify backend service is running in Railway (check logs)
- Ensure `DATABASE_URL` is set correctly

### "Database connection error"
- Add PostgreSQL to Railway project
- Copy `DATABASE_URL` from Railway Postgres plugin
- Set in backend environment variables
- Redeploy backend

### "Recommendations not loading"
- Ensure `RECOMMENDER_URL` is set in backend env
- Ensure `BACKEND_URL` is set in recommender env
- Run `npm run seed` to populate database
- Check recommender logs in Railway

### "Movies not showing on homepage"
- Check that `npm run seed` completed successfully
- Verify `TMDB_API_KEY` is valid and set in backend
- Check backend logs for errors

---

## Next Steps

1. **Custom Domain** (optional)
   - Vercel: Add custom domain in project settings
   - Point your domain's DNS to Vercel

2. **Monitoring** (optional)
   - Railway: Check logs regularly
   - Vercel: Monitor performance in dashboard

3. **Updates**
   - Just `git push` to main branch
   - Vercel auto-redeploys frontend
   - Railway auto-redeploys services

4. **Database Backups** (optional)
   - Use `pg_dump` to backup PostgreSQL
   - Store backups securely

---

## Quick Reference: Service URLs

Once deployed, bookmark these:

| Service | URL |
|---------|-----|
| **Frontend** | https://moviemate-yourname.vercel.app |
| **Backend API** | https://moviemate-backend-yourname.railway.app/api |
| **Recommender API** | https://moviemate-recommender-yourname.railway.app |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Railway Dashboard** | https://railway.app/project/... |

---

## Support

If deployment fails:
1. Check error logs in Vercel/Railway dashboards
2. Verify all environment variables are set
3. Ensure GitHub repo is up to date (`git push`)
4. Redeploy service
5. Check browser console for frontend errors

**You've got this! 🚀**
