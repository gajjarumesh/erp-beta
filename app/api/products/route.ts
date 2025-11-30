import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/src/modules/core/lib/auth'

// GET /api/products - List products with filtering and pagination
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
    const categoryId = searchParams.get('categoryId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    const where = {
      companyId: payload.companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(categoryId && { categoryId }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
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
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch products' } },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
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
    const { name, sku, description, categoryId, price, cost, quantity, minQuantity, unit, isActive } = body

    if (!name || !sku || price === undefined) {
      return NextResponse.json(
        { success: false, error: { message: 'Name, SKU, and price are required' } },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({ where: { sku } })
    if (existingSku) {
      return NextResponse.json(
        { success: false, error: { message: 'A product with this SKU already exists' } },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        categoryId,
        price,
        cost: cost || 0,
        quantity: quantity || 0,
        minQuantity: minQuantity || 0,
        unit: unit || 'unit',
        isActive: isActive !== false,
        companyId: payload.companyId,
      },
      include: { category: true },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create product' } },
      { status: 500 }
    )
  }
}
