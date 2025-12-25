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

// Database connection test with retry logic
async function testDatabaseConnection(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('✓ Database connected successfully')
      return true
    } catch (error) {
      console.error(`Database connection attempt ${i + 1}/${retries} failed:`, error instanceof Error ? error.message : error)
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  console.warn('✗ Could not connect to database after retries, but starting app anyway')
  return false
}

// Start server and attempt database connection
(async () => {
  try {
    await testDatabaseConnection()
  } catch (error) {
    console.error('Database test error:', error)
  }

  app.listen(port, () => console.log('Backend listening on', port))
})()

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0) })