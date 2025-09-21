'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SimpleTestPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signIn('google', { 
        callbackUrl: 'http://localhost:3000/dashboard',
        redirect: true
      })
      
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Google Sign-in Test</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Client ID:</strong> {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'Not set'}</p>
          <p><strong>Callback URL:</strong> http://localhost:3000/api/auth/callback/google</p>
        </div>
      </div>
    </div>
  )
}

