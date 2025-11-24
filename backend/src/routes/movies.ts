import express from 'express'
import prisma from '../prismaClient'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = express.Router()

router.get('/', async (req, res) => {
  const q = await prisma.movie.findMany({ take: 50 })
  res.json(q)
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
  res.json(up)
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

export default router
