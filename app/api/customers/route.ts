import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/src/modules/core/lib/auth'

// GET /api/customers - List customers with filtering and pagination
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
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    const where = {
      companyId: payload.companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: customers,
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
    console.error('Get customers error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch customers' } },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create a new customer
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
    const { name, email, phone, address, city, country, taxId } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: { message: 'Name is required' } },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        country,
        taxId,
        companyId: payload.companyId,
      },
    })

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create customer' } },
      { status: 500 }
    )
  }
}
