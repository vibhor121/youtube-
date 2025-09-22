import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasAccessToken: !!(session as any)?.accessToken,
      userEmail: session?.user?.email
    })
    
    if (!session) {
      return NextResponse.json(
        { error: 'No session found. Please sign in first.' },
        { status: 401 }
      )
    }
    
    const googleToken = (session as any).accessToken || (session as any).idToken
    
    if (!googleToken) {
      return NextResponse.json(
        { error: 'No Google token found. Please sign in with Google again.' },
        { status: 401 }
      )
    }

    console.log('Using Google token:', googleToken.substring(0, 20) + '...')

    // Send the Google token to the server to get JWT tokens
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: googleToken
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json(data)
    } else {
      console.error('Backend auth error:', data)
      return NextResponse.json(data, { status: response.status })
    }
  } catch (error) {
    console.error('JWT token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate JWT token' },
      { status: 500 }
    )
  }
}

