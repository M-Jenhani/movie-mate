import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home(){
  const [movies, setMovies] = useState<any[]>([])
  useEffect(()=>{ axios.get('http://localhost:4000/api/movies').then(r=>setMovies(r.data)).catch(()=>{}) },[])
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Discover</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map(m=> (
          <div key={m.id} className="bg-white dark:bg-gray-800 rounded shadow p-3">
            <div className="font-bold">{m.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{m.overview}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
