import express from 'express'
import prisma from '../prismaClient'
import { requireAuth, AuthRequest } from '../middleware/auth'
import axios from 'axios'

const router = express.Router()

// Helper function to retrain recommender
async function retrainRecommender() {
  try {
    const movies = await prisma.movie.findMany()
    const ratings = await prisma.rating.findMany()
    
    const movieData = movies.map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview || '',
      posterPath: m.posterPath || ''
    }))
    
    const ratingData = ratings.map(r => ({
      userId: r.userId,
      movieId: r.movieId,
      score: r.score
    }))
    
    console.log('RECOMMENDER_URL test :', process.env.RECOMMENDER_URL);
    const recommenderUrl = (process.env.RECOMMENDER_URL || 'http://localhost:8001').replace(/\/$/, '')
    await axios.post(`${recommenderUrl}/train`, {
      movies: movieData,
      ratings: ratingData
    })
    
    console.log('✓ Recommender retrained successfully')
  } catch (error) {
    console.error('Failed to retrain recommender:', error)
  }
}

router.get('/', async (req, res) => {
  // Optional: include user's ratings if authenticated
  const token = req.headers.authorization?.replace('Bearer ', '')
  let userId: number | undefined
  
  if (token) {
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      userId = decoded.sub  // Token uses 'sub' not 'userId'
      console.log('✓ User authenticated, userId:', userId)
    } catch (error) {
      console.error('Token verification failed:', error)
    }
  } else {
    console.log('No token provided')
  }

  const movies = await prisma.movie.findMany({ 
    take: 100,
    include: {
      ratings: userId ? { where: { userId } } : false,
      watchlist: userId ? { where: { userId } } : false
    }
  })
  
  console.log('Sending movies, first movie has ratings:', movies[0]?.ratings)
  res.json(movies)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const m = await prisma.movie.findUnique({ where: { id } })
  if (!m) return res.status(404).json({ error: 'Not found' })
  res.json(m)
})

router.post('/:id/rate', requireAuth, async (req: AuthRequest, res) => {
  const movieId = Number(req.params.id)
  const userId = req.userId!
  const score = Number(req.body.score)
  if (!score || score < 1 || score > 10) return res.status(400).json({ error: 'Score 1-10' })
  const up = await prisma.rating.upsert({
    where: { userId_movieId: { userId, movieId } },
    update: { score },
    create: { userId, movieId, score }
  })
  
  // Retrain recommender with new rating (non-blocking)
  retrainRecommender().catch(err => console.error('Retrain error:', err))
  
  res.json({ ...up, message: 'Rating saved! Recommendations updating...' })
})

router.post('/:id/watchlist', requireAuth, async (req: AuthRequest, res) => {
  const movieId = Number(req.params.id)
  const userId = req.userId!
  try {
    const entry = await prisma.watchlist.create({ data: { userId, movieId } })
    res.json(entry)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id/watchlist', requireAuth, async (req: AuthRequest, res) => {
  const movieId = Number(req.params.id)
  const userId = req.userId!
  try {
    await prisma.watchlist.deleteMany({ where: { userId, movieId } })
    res.json({ message: 'Removed from watchlist' })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
