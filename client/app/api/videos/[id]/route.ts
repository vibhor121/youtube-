import { NextRequest, NextResponse } from 'next/server'
import { makeAuthenticatedRequest } from '@/lib/auth-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/videos/${params.id}`)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Video fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/videos/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Video update error:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/videos/${params.id}`, {
      method: 'DELETE',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Video delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}

