import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/src/modules/core/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = getTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'No token provided' } },
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid or expired token' } },
        { status: 401 }
      )
    }

    // Check if session exists and is valid
    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: { message: 'Session expired' } },
        { status: 401 }
      )
    }

    // Get user with company
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        company: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: { message: 'User not found or inactive' } },
        { status: 401 }
      )
    }

    // Prepare companies array
    const companies = user.company ? [{
      id: user.company.id,
      name: user.company.name,
      slug: user.company.slug,
      logo: user.company.logo,
      currency: user.company.currency,
      timezone: user.company.timezone,
    }] : []

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          avatar: user.avatar,
        },
        company: companies[0] || null,
        companies,
      },
    })
  } catch (error) {
    console.error('Get me error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'An error occurred' } },
      { status: 500 }
    )
  }
}
