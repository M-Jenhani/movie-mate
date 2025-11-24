import dotenv from 'dotenv'
import prisma from './prismaClient'

dotenv.config()

async function main(){
  // Create a couple of sample movies
  const m1 = await prisma.movie.upsert({ where: { tmdbId: 1 }, update: {}, create: { tmdbId: 1, title: 'Example Movie', overview: 'A sample movie for MovieMate', posterPath: null, genres: 'Drama', releaseDate: '2020-01-01' } })
  const m2 = await prisma.movie.upsert({ where: { tmdbId: 2 }, update: {}, create: { tmdbId: 2, title: 'Another Movie', overview: 'Another sample movie', posterPath: null, genres: 'Action', releaseDate: '2021-05-05' } })
  console.log('seeded movies', m1.id, m2.id)
}

main().then(()=>process.exit(0)).catch((e)=>{console.error(e); process.exit(1)})
