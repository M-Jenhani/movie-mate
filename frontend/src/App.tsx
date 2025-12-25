import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from './config/api'
import Home from './pages/Home'
import ForYou from './pages/ForYou'
import Login from './pages/Login'
import Register from './pages/Register'
import Watchlist from './pages/Watchlist'

export default function App(){
  const [page, setPage] = useState<'home'|'foryou'|'watchlist'|'login'|'register'>('home')
  const [dark, setDark] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    
    // Fetch user email if logged in
    if (token) {
      fetch(API_ENDPOINTS.USERS_ME, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUserEmail(data.email))
      .catch(() => {})
    }
  }, [page])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setPage('home')
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Sticky Navbar */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform" onClick={()=>setPage('home')}>
              🎬 MovieMate
            </h1>
            <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
              <button 
                onClick={()=>setPage('home')} 
                className={`text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 ${page==='home' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'hover:text-purple-600 dark:hover:text-purple-400 hover:scale-105'}`}
              >
                Discover
              </button>
              <button 
                onClick={()=>setPage('foryou')} 
                className={`text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 ${page==='foryou' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'hover:text-purple-600 dark:hover:text-purple-400 hover:scale-105'}`}
              >
                For You
              </button>
              <button 
                onClick={()=>setPage('watchlist')} 
                className={`text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 ${page==='watchlist' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'hover:text-purple-600 dark:hover:text-purple-400 hover:scale-105'}`}
              >
                Watchlist
              </button>
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={()=>setPage('login')} 
                    className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Login
                  </button>
                  <button 
                    onClick={()=>setPage('register')} 
                    className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-all"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                      {userEmail ? userEmail[0].toUpperCase() : 'U'}
                    </div>
                    <svg className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium truncate">{userEmail}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setShowProfileMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button 
                onClick={()=>setDark(d=>!d)} 
                className="px-2 sm:px-3 py-1 sm:py-2 text-lg sm:text-xl rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-indigo-500 dark:to-purple-600 hover:scale-110 transition-all shadow-md hover:shadow-lg"
              >
                {dark ? '☀️' : '🌙'}
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {page === 'home' && <Home />}
          {page === 'foryou' && <ForYou onLoginRequired={() => setPage('login')} />}
          {page === 'watchlist' && <Watchlist onLoginRequired={() => setPage('login')} />}
          {page === 'login' && <Login onLoggedIn={()=>{setPage('foryou'); setIsLoggedIn(true)}} />}
          {page === 'register' && <Register onRegistered={()=>setPage('login')} />}
        </main>

        {/* Footer */}
        <footer className="mt-8 sm:mt-16 py-6 sm:py-8 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t-2 border-purple-200 dark:border-purple-800">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 text-center">
            <p className="text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MovieMate © 2025 - Discover, Rate, and Get Personalized Movie Recommendations
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
