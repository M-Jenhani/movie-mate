import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import MovieCard from '../components/MovieCard'

// TMDB Genre ID to Name mapping
const GENRE_MAP: Record<string, string> = {
  '28': 'Action',
  '12': 'Adventure',
  '16': 'Animation',
  '35': 'Comedy',
  '80': 'Crime',
  '99': 'Documentary',
  '18': 'Drama',
  '10751': 'Family',
  '14': 'Fantasy',
  '36': 'History',
  '27': 'Horror',
  '10402': 'Music',
  '9648': 'Mystery',
  '10749': 'Romance',
  '878': 'Science Fiction',
  '10770': 'TV Movie',
  '53': 'Thriller',
  '10752': 'War',
  '37': 'Western'
}

export default function Home(){
  const [movies, setMovies] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState('title')
  const [refresh, setRefresh] = useState(0)

  useEffect(()=>{ 
    const fetchMovies = async () => {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      try {
        const response = await axios.get(API_ENDPOINTS.MOVIES, { headers })
        console.log('Movies fetched:', response.data.length, 'First movie ratings:', response.data[0]?.ratings)
        setMovies(response.data)
      } catch(error) {
        console.error('Failed to fetch movies:', error)
      }
    }
    fetchMovies()
  },[refresh])

  const filteredMovies = movies
    .filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    .filter(m => !genre || m.genres?.includes(genre))
    .sort((a,b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'date') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      return 0
    })

  // Extract unique genre IDs and map to readable names
  const allGenreIds = [...new Set(movies.flatMap(m => {
    if (!m.genres) return []
    const genreStr = String(m.genres)
    return genreStr.split(',').map((g:string) => g.trim())
  }))]
  
  const readableGenres = allGenreIds
    .map(id => ({ id, name: GENRE_MAP[id] || id }))
    .filter(g => g.name !== g.id) // Only show mapped genres
    .sort((a,b) => a.name.localeCompare(b.name))

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
        <span>🎬</span> Discover Movies
      </h2>
      
      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="🔍 Search movies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 text-sm sm:text-base border-2 border-purple-200 dark:border-purple-800 rounded-xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
        />
        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          className="px-4 py-3 text-sm sm:text-base border-2 border-purple-200 dark:border-purple-800 rounded-xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm font-medium"
        >
          <option value="">All Genres</option>
          {readableGenres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-3 text-sm sm:text-base border-2 border-purple-200 dark:border-purple-800 rounded-xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm font-medium"
        >
          <option value="title">Sort by Title</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {filteredMovies.map(m => (
          <MovieCard key={m.id} movie={m} onRate={() => setRefresh(r => r + 1)} />
        ))}
      </div>
    </div>
  )
}
