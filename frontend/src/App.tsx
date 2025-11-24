import React, { useState } from 'react'
import Home from './pages/Home'
import ForYou from './pages/ForYou'
import Login from './pages/Login'

export default function App(){
  const [page, setPage] = useState<'home'|'foryou'|'login'>('home')
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <header className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">MovieMate</h1>
          <nav className="space-x-4">
            <button onClick={()=>setPage('home')} className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Home</button>
            <button onClick={()=>setPage('foryou')} className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">For You</button>
            <button onClick={()=>setPage('login')} className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Login</button>
            <button onClick={()=>setDark(d=>!d)} className="px-3 py-1 rounded">{dark? 'Light' : 'Dark'}</button>
          </nav>
        </header>
        <main className="p-4">
          {page === 'home' && <Home />}
          {page === 'foryou' && <ForYou />}
          {page === 'login' && <Login onLoggedIn={()=>setPage('foryou')} />}
        </main>
      </div>
    </div>
  )
}
