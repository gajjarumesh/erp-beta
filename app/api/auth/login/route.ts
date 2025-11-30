import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/src/modules/core/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { message: 'Email and password are required' } },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        company: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: { message: 'Account is deactivated' } },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    })

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
      },
    })

    // Get user's companies (for multi-company support)
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
        token,
        company: companies[0] || null,
        companies,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'An error occurred during login' } },
      { status: 500 }
    )
  }
}
