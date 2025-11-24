import React, { useState } from 'react'
import axios from 'axios'

export default function Register({ onRegistered }: { onRegistered?: ()=>void }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState(false)

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    const toast = document.createElement('div')
    toast.className = `fixed top-20 right-4 ${type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-slide-in`
    toast.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'error' 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'}
      </svg>
      <span class="font-medium">${message}</span>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 4000)
  }

  const submit = async ()=>{
    setErr('')
    if (!email || !password) {
      showToast('Email and password are required')
      return
    }
    try{
      await axios.post('http://localhost:4000/api/auth/register', { email, password, name })
      setSuccess(true)
      setTimeout(() => {
        onRegistered && onRegistered()
      }, 1500)
    }catch(e:any){ 
      const errorMsg = e?.response?.data?.error || 'Registration failed'
      if (errorMsg.includes('Unique') || errorMsg.includes('already')) {
        showToast('This email is already registered. Please use a different email or login.')
      } else {
        showToast(errorMsg)
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-2 sm:px-4">
        <div className="text-center">
          <div className="text-4xl sm:text-6xl mb-4">✓</div>
          <div className="text-green-500 text-xl sm:text-2xl font-bold mb-2">Registration Successful!</div>
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Redirecting to login...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Join MovieMate
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Start discovering amazing movies</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="Name (optional)" 
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="Email" 
            type="email"
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={submit} 
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Sign Up
          </button>
          {err && <div className="text-red-500 text-center text-sm">{err}</div>}
        </div>
      </div>
    </div>
  )
}
