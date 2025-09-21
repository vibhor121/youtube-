import { NextRequest, NextResponse } from 'next/server'
import { makeAuthenticatedRequest } from '@/lib/auth-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function GET(request: NextRequest) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/videos`)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Videos fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/videos/sync`, {
      method: 'POST',
      body: JSON.stringify(body),
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

