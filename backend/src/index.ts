import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import movieRoutes from './routes/movies'
import prisma from './prismaClient'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/movies', movieRoutes)

app.get('/health', (req, res) => res.json({ ok: true }))

const port = process.env.PORT || 4000
app.listen(port, () => console.log('Backend listening on', port))

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0) })
