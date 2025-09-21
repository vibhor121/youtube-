import { NextRequest, NextResponse } from 'next/server'
import { makeAuthenticatedRequest } from '@/lib/auth-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/notes/video/${params.videoId}`)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Notes fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

