import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/${params.commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}

