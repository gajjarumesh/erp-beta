import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/src/modules/core/lib/auth'

// GET /api/leads - List leads with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = getTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.companyId) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid token or no company' } },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    const where = {
      companyId: payload.companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status: status as 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST' }),
      ...(source && { source: source as 'WEBSITE' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'EMAIL_CAMPAIGN' | 'COLD_CALL' | 'TRADE_SHOW' | 'OTHER' }),
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: leads,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Get leads error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch leads' } },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = getTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.companyId) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid token or no company' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, company, source, status, expectedValue, probability, notes, assignedTo } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: { message: 'Name is required' } },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        source: source || 'OTHER',
        status: status || 'NEW',
        expectedValue,
        probability: probability || 0,
        notes,
        assignedTo,
        companyId: payload.companyId,
      },
    })

    return NextResponse.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    console.error('Create lead error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create lead' } },
      { status: 500 }
    )
  }
}
