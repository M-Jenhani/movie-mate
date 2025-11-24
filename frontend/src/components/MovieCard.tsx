import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface MovieCardProps {
  movie: any
  onRate?: ()=>void
  onWatchlist?: ()=>void
  showActions?: boolean
  hideWatchlistButton?: boolean
  showRemoveButton?: boolean
}

export default function MovieCard({ movie, onRate, onWatchlist, showActions = true, hideWatchlistButton = false, showRemoveButton = false }: MovieCardProps){
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [inWatchlist, setInWatchlist] = useState(showRemoveButton) // If showing remove button, it's in watchlist

  useEffect(() => {
    // Check if movie has user's existing rating
    if (movie.ratings && movie.ratings.length > 0) {
      console.log(`Movie ${movie.id} has rating:`, movie.ratings[0].score)
      setRating(movie.ratings[0].score)
    } else {
      setRating(0)
    }
    
    // Check if movie is in user's watchlist (or if showRemoveButton is true, it's definitely in watchlist)
    if (showRemoveButton || (movie.watchlist && movie.watchlist.length > 0)) {
      setInWatchlist(true)
    } else {
      setInWatchlist(false)
    }
  }, [movie.id, movie.ratings, movie.watchlist, showRemoveButton])

  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster'

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    const toast = document.createElement('div')
    const bgColor = type === 'error' ? 'from-red-500 to-red-600' : type === 'success' ? 'from-green-500 to-green-600' : 'from-blue-500 to-blue-600'
    const icon = type === 'error' 
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
      : type === 'success'
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    
    toast.className = `fixed top-20 right-4 bg-gradient-to-r ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3`
    toast.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg>
      <span class="font-medium">${message}</span>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 4000)
  }

  const handleRate = async (score: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Please login to rate movies and get personalized recommendations', 'info')
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(
        `http://localhost:4000/api/movies/${movie.id}/rate`,
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setRating(score)
      
      // Show success message if recommendations are updating
      if (response.data.message) {
        showToast('✓ Rating saved! Refresh "For You" page to see updated recommendations.', 'success')
      }
      
      onRate && onRate()
    } catch(e) {
      showToast('Failed to save rating. Please try again.', 'error')
    }
    setLoading(false)
  }

  const handleWatchlist = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Please login to manage your watchlist and save movies', 'info')
      return
    }
    setLoading(true)
    try {
      if (inWatchlist) {
        // Remove from watchlist
        await axios.delete(
          `http://localhost:4000/api/movies/${movie.id}/watchlist`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setInWatchlist(false)
        showToast('Removed from watchlist', 'success')
      } else {
        // Add to watchlist
        await axios.post(
          `http://localhost:4000/api/movies/${movie.id}/watchlist`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setInWatchlist(true)
        showToast('Added to watchlist', 'success')
      }
      
      onWatchlist && onWatchlist()
    } catch(e:any) {
      if (e?.response?.data?.error?.includes('Unique')) {
        showToast('Already in watchlist', 'info')
      } else {
        showToast('Failed to update watchlist', 'error')
      }
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
      <img 
        src={posterUrl} 
        alt={movie.title}
        className="w-full h-48 sm:h-60 md:h-72 object-cover"
      />
      <div className="p-2 sm:p-3 md:p-4">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{movie.title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 line-clamp-2">{movie.overview}</p>
        
        {showActions && (
          <div className="space-y-2">
            {/* Star Rating */}
            <div className="flex items-center justify-center gap-0.5 overflow-x-auto pb-5">
              {[1,2,3,4,5,6,7,8,9,10].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  disabled={loading}
                  className="flex-shrink-0 text-yellow-400 hover:scale-125 transition-all duration-150 cursor-pointer touch-manipulation"
                  style={{ fontSize: '1.25rem', width: '24px', height: '24px', padding: '2px' }}
                  title={`Rate ${star}/10`}
                >
                  {(hover > 0 ? hover >= star : rating >= star) ? '★' : '☆'}
                </button>
              ))}
            </div>
            
            {/* Watchlist Button - Hide if hideWatchlistButton is true */}
            {!hideWatchlistButton && (
              <button
                onClick={handleWatchlist}
                disabled={loading}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded transition-all duration-200 font-medium ${
                  inWatchlist 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                {loading ? 'Loading...' : inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            )}
            
            {/* Remove from Watchlist Button - Show only if showRemoveButton is true */}
            {showRemoveButton && (
              <button
                onClick={handleWatchlist}
                disabled={loading}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-all duration-200 font-medium flex items-center justify-center gap-1"
              >
                {loading ? 'Removing...' : (
                  <>
                    <span>✕</span>
                    <span>Remove from Watchlist</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
        
        {movie.explanation && (
          <div className="relative group mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 cursor-help">
              {movie.explanation}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-normal max-w-xs z-10 pointer-events-none">
              <div className="text-center">{movie.explanation}</div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
