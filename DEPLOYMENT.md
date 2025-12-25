# MovieMate Deployment Guide

## Free Hosting Stack

- **Frontend:** Vercel (auto-deploys from GitHub)
- **Backend + Database:** Railway
- **Recommender:** Railway
- **Database:** PostgreSQL (Railway)

## Step 1: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Import this repository
3. In the project settings, add environment variable:
   - `VITE_API_URL` = `https://moviemate-backend-yourname.railway.app` (Railway backend URL)
4. Deploy! (automatic)

**Frontend URL:** https://moviemate-yourname.vercel.app

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign up
2. Create new project → Deploy from GitHub repo
3. Select `backend` folder as root directory
4. Add environment variables:
   - `DATABASE_URL` = (Railway will create Postgres, get URL from Postgres plugin)
   - `JWT_SECRET` = `your-secure-random-string-here`
   - `TMDB_API_KEY` = your TMDB API key
   - `NODE_ENV` = `production`
   - `RECOMMENDER_URL` = `https://moviemate-recommender-yourname.railway.app`

5. Add Postgres plugin to project
6. Deploy!

**Backend URL:** https://moviemate-backend-yourname.railway.app

## Step 3: Deploy Recommender to Railway

1. In Railway, create another service in the same project
2. Deploy from GitHub → select `recommender` folder
3. Add environment variables:
   - `BACKEND_URL` = `https://moviemate-backend-yourname.railway.app`

4. Deploy!

**Recommender URL:** https://moviemate-recommender-yourname.railway.app

## Step 4: Update URLs

After deployment, update:
1. **Backend .env** with Recommender URL
2. **Recommender .env** with Backend URL
3. **Vercel frontend** with Backend URL
4. Redeploy all services

## Step 5: Seed Database

Run via Railway terminal:
```bash
npm run seed
```

Or SSH into Railway backend container and run the command.

## Cost

- **Frontend (Vercel):** FREE
- **Backend (Railway):** FREE tier ($5/month credits, usually sufficient)
- **Recommender (Railway):** FREE tier (shared with backend)
- **Database (Railway):** Included in Railway free tier

**Total: FREE (or ~$5/month if you exceed credits)**

## Troubleshooting

If services can't connect:
1. Ensure DATABASE_URL is correct in Railway
2. Check CORS is enabled in backend
3. Verify API URLs in environment variables
4. Check Railway logs for errors

## Next Steps

- Set custom domain on Vercel (optional)
- Monitor Railway usage to stay within free tier
- Set up GitHub Actions for CI/CD (optional)
