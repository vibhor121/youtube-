import { NextRequest, NextResponse } from 'next/server'
import { makeAuthenticatedRequest } from '@/lib/auth-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { youtubeVideoId } = body

    if (!youtubeVideoId) {
      return NextResponse.json(
        { error: 'YouTube video ID is required' },
        { status: 400 }
      )
    }

    // For now, let's call the backend directly without authentication to test
    const response = await fetch(`${API_BASE_URL}/api/videos/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Temporary test token
      },
      body: JSON.stringify({ youtubeVideoId })
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Video sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync video' },
      { status: 500 }
    )
  }
}
