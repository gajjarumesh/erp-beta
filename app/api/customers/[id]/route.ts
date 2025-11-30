import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/src/modules/core/lib/auth'

// GET /api/customers/[id] - Get a single customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        companyId: payload.companyId,
      },
      include: {
        salesOrders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: { message: 'Customer not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch customer' } },
      { status: 500 }
    )
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if customer exists and belongs to user's company
    const existing = await prisma.customer.findFirst({
      where: { id, companyId: payload.companyId },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Customer not found' } },
        { status: 404 }
      )
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        country,
        taxId,
      },
    })

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update customer' } },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if customer exists and belongs to user's company
    const existing = await prisma.customer.findFirst({
      where: { id, companyId: payload.companyId },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Customer not found' } },
        { status: 404 }
      )
    }

    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Customer deleted successfully' },
    })
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to delete customer' } },
      { status: 500 }
    )
  }
}
