import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function getJwtToken(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      console.error('No valid session or access token found')
      return null
    }

    // Get JWT token from backend
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: session.accessToken
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Failed to get JWT token:', errorData)
      return null
    }

    const data = await response.json()
    return data.accessToken || null
  } catch (error) {
    console.error('Error getting JWT token:', error)
    return null
  }
}

export async function makeAuthenticatedRequest(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const jwtToken = await getJwtToken()
  
  if (!jwtToken) {
    throw new Error('No valid JWT token available')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`,
    ...options.headers
  }

  return fetch(url, {
    ...options,
    headers
  })
}


