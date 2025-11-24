import dotenv from 'dotenv'
import prisma from '../prismaClient'

dotenv.config()

const TMDB_KEY = process.env.TMDB_API_KEY
if (!TMDB_KEY) {
  console.error('TMDB_API_KEY not set in env')
  process.exit(1)
}

async function fetchPopular(page=1){
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`
    const res = await fetch(url)
    return res.json()
}

async function main(){
  for (let p=1;p<=2;p++){
    const data = await fetchPopular(p)
    for (const m of data.results){
      try{
        await prisma.movie.upsert({ where: { tmdbId: m.id }, update: {}, create: { tmdbId: m.id, title: m.title, overview: m.overview || '', posterPath: m.poster_path || '', genres: (m.genre_ids||[]).join(','), releaseDate: m.release_date || '' } })
      }catch(e){ console.warn('skip', e) }
    }
  }
  console.log('done')
}

main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})
