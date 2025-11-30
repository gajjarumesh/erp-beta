import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/src/modules/core/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, companyName } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { message: 'Email and password are required' } },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: { message: 'Password must be at least 8 characters' } },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { message: 'An account with this email already exists' } },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create company if company name provided
    let company = null
    if (companyName) {
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if slug exists
      const existingCompany = await prisma.company.findUnique({
        where: { slug },
      })

      if (existingCompany) {
        return NextResponse.json(
          { success: false, error: { message: 'A company with this name already exists' } },
          { status: 400 }
        )
      }

      company = await prisma.company.create({
        data: {
          name: companyName,
          slug,
        },
      })
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        role: company ? 'ADMIN' : 'USER', // First user of company is admin
        companyId: company?.id || null,
      },
      include: {
        company: true,
      },
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
        token,
        company: companies[0] || null,
        companies,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'An error occurred during registration' } },
      { status: 500 }
    )
  }
}
