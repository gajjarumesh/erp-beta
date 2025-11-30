import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getTokenFromHeader } from '@/src/modules/core/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = getTokenFromHeader(authHeader)

    if (token) {
      // Delete session
      await prisma.session.deleteMany({
        where: { token },
      })
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Logged out successfully' },
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'An error occurred during logout' } },
      { status: 500 }
    )
  }
}
