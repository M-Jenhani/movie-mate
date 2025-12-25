import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import MovieCard from '../components/MovieCard'

export default function ForYou({ onLoginRequired }: { onLoginRequired?: () => void }){
  const [recs, setRecs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const fetchRecommendations = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to see personalized recommendations')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    // First, get the user's ID from /api/users/me
    axios.get(API_ENDPOINTS.USERS_ME, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(userRes => {
      const userId = userRes.data.id
      // Now get recommendations for this specific user
      return axios.get(API_ENDPOINTS.RECOMMEND(userId))
    })
    .then(recRes => {
      setRecs(recRes.data.recommendations || recRes.data.results || [])
      setLoading(false)
    })
    .catch(err => {
      console.error('Error fetching recommendations:', err)
      setError('Failed to load recommendations')
      setLoading(false)
    })
  }
  
  useEffect(()=>{
    fetchRecommendations()
  },[])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">Recommended For You</h2>
        <p className="text-gray-500">Loading your personalized recommendations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">Recommended For You</h2>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Login Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please login to see your personalized recommendations based on your taste
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>✨</span> Recommended For You
        </h2>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      {recs.length === 0 ? (
        <div>
          <p className="text-black-500 mb-4">No recommendations yet. Start rating some movies to get personalized suggestions!</p>
          <button
            onClick={() => window.location.hash = 'home'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {recs.map((m:any, i:number)=> (
            <MovieCard key={i} movie={m} showActions={false} />
          ))}
        </div>
      )}
    </div>
  )
}
