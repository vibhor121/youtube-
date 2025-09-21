'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test the auth endpoint
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        console.log('Session data:', data)
        if (data.error) {
          setError(data.error)
        }
      })
      .catch(err => {
        console.error('Auth error:', err)
        setError(err.message)
      })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Status:</h2>
          <p className="text-gray-600">{status}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Session:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        {error && (
          <div>
            <h2 className="text-lg font-semibold text-red-600">Error:</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div>
          <h2 className="text-lg font-semibold">Environment:</h2>
          <p>NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set'}</p>
          <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
        </div>
      </div>
    </div>
  )
}
