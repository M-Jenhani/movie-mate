import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLoggedIn }: { onLoggedIn?: ()=>void }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const showToast = (message: string) => {
    const toast = document.createElement('div')
    toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-slide-in'
    toast.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      </svg>
      <span class="font-medium">${message}</span>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 4000)
  }

  const submit = async ()=>{
    try{
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      onLoggedIn && onLoggedIn()
    }catch(e:any){ 
      const errorMsg = e?.response?.data?.error || 'Login failed'
      if (errorMsg.includes('Invalid') || errorMsg.includes('wrong') || errorMsg.includes('not found')) {
        showToast('Invalid email or password. Please check your credentials and try again.')
      } else {
        showToast(errorMsg)
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Login to continue watching</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
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
            Login
          </button>
          {err && <div className="text-red-500 text-center text-sm">{err}</div>}
        </div>
      </div>
    </div>
  )
}
