import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ForYou(){
  const [recs, setRecs] = useState<any[]>([])
  useEffect(()=>{
    axios.get('http://localhost:8001/recommend/1?topk=10').then(r=>setRecs(r.data.results)).catch(()=>{})
  },[])
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recs.map((m:any, i:number)=> (
          <div key={i} className="bg-white dark:bg-gray-800 rounded shadow p-3">
            <div className="font-bold">{m.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{m.overview}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{m.explanation}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
