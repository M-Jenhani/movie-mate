import express from 'express'
import prisma from '../prismaClient'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = express.Router()

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    include: { 
      ratings: { include: { movie: true } }, 
      watchlist: { 
        include: { 
          movie: {
            include: {
              ratings: { where: { userId } }
            }
          }
        } 
      } 
    } 
  })
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const user = await prisma.user.findUnique({ where: { id }, include: { ratings: true, watchlist: true } })
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

export default router
