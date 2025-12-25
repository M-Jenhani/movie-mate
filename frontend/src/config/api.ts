// API configuration based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const RECOMMENDER_URL = import.meta.env.VITE_RECOMMENDER_URL || 'http://localhost:8001'

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  RECOMMENDER: RECOMMENDER_URL,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  USERS_ME: `${API_BASE_URL}/api/users/me`,
  MOVIES: `${API_BASE_URL}/api/movies`,
  MOVIE_RATE: (movieId: string) => `${API_BASE_URL}/api/movies/${movieId}/rate`,
  MOVIE_WATCHLIST: (movieId: string) => `${API_BASE_URL}/api/movies/${movieId}/watchlist`,
  RECOMMEND: (userId: string) => `${RECOMMENDER_URL}/recommend/${userId}`
}
