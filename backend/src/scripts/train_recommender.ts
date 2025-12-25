import dotenv from 'dotenv'
import prisma from '../prismaClient'

dotenv.config()

async function main() {
  // Fetch all movies
  const movies = await prisma.movie.findMany()
  console.log(`Found ${movies.length} movies`)

  // Fetch all ratings
  const ratings = await prisma.rating.findMany()
  console.log(`Found ${ratings.length} ratings`)

  // Format data for recommender
  const movieData = movies.map(m => ({
    id: m.id,
    title: m.title,
    overview: m.overview || ''
  }))

  const ratingData = ratings.map(r => ({
    userId: r.userId,
    movieId: r.movieId,
    score: r.score
  }))

  // Send to recommender
  const recommenderUrl = (process.env.RECOMMENDER_URL || 'http://localhost:8001').replace(/\/+$/, '');
  const res = await fetch(`${recommenderUrl}/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movies: movieData, ratings: ratingData })
  })

  const result = await res.json()
  console.log('Training result:', result)
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
