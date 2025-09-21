import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      session: session ? {
        user: session.user,
        hasAccessToken: !!session.accessToken,
        accessToken: session.accessToken ? 'Present' : 'Missing',
        hasRefreshToken: !!session.refreshToken,
        refreshToken: session.refreshToken ? 'Present' : 'Missing'
      } : null
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed' },
      { status: 500 }
    )
  }
}


