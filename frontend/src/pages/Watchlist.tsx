import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import MovieCard from '../components/MovieCard'

export default function Watchlist({ onLoginRequired }: { onLoginRequired?: () => void }) {
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchWatchlist = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to view your watchlist')
      setLoading(false)
      return
    }

    setLoading(true)
    axios.get(API_ENDPOINTS.USERS_ME, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log('Watchlist response:', res.data)
      setWatchlist(res.data.watchlist || [])
      setLoading(false)
    })
    .catch((err) => {
      console.error('Watchlist error:', err)
      setError('Failed to load watchlist')
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchWatchlist()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">My Watchlist</h2>
        <p style={{ color: "black" }} className="text-black-500">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">My Watchlist</h2>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Login Required
            </h3>
            <p style={{ color: "black" }} className="text-black-600 dark:text-gray-400 mb-6">
              Please login to view your watchlist and manage your saved movies
            </p>
            <button
              onClick={() => onLoginRequired && onLoginRequired()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>📚</span> My Watchlist
        </h2>
        <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'}
        </span>
      </div>
      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Your watchlist is empty</p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
          >
            Browse Movies
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {watchlist.map((item:any) => (
            <MovieCard 
              key={item.movie.id} 
              movie={item.movie} 
              onWatchlist={fetchWatchlist}
              hideWatchlistButton={true}
              showRemoveButton={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
