import { NextRequest, NextResponse } from 'next/server'
import { makeAuthenticatedRequest } from '@/lib/auth-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}

