'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function TestAuthPage() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      const result = await signIn('google', { 
        callbackUrl: 'http://localhost:3000/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        setError(result.error)
      } else {
        console.log('Sign in successful:', result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Status:</h2>
          <p className="text-gray-700">{status}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Session:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        {error && (
          <div className="bg-red-100 p-4 rounded">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Error:</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold"
          >
            Sign in with Google
          </button>
          
          <div className="text-sm text-gray-600">
            <p>If this doesn't work, the issue is with the Google OAuth configuration.</p>
            <p>Make sure the redirect URI in Google Cloud Console is exactly:</p>
            <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:3000/api/auth/callback/google</code>
          </div>
        </div>
      </div>
    </div>
  )
}
