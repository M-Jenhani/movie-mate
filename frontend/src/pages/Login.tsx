import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLoggedIn }: { onLoggedIn?: ()=>void }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const submit = async ()=>{
    try{
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      onLoggedIn && onLoggedIn()
    }catch(e:any){ setErr(e?.response?.data?.error || 'Login failed') }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <div className="space-y-2">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className="w-full p-2 rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" className="w-full p-2 rounded" />
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
        {err && <div className="text-red-500">{err}</div>}
      </div>
    </div>
  )
}
