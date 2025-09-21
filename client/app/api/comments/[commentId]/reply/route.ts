import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/api/comments/${params.commentId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    )
  }
}

