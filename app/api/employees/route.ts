import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/src/modules/core/lib/auth'

// GET /api/employees - List employees with filtering and pagination
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
    const departmentId = searchParams.get('departmentId')
    const isActive = searchParams.get('isActive')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    const where = {
      companyId: payload.companyId,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { employeeId: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(departmentId && { departmentId }),
      ...(isActive !== null && { isActive: isActive === 'true' }),
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: { department: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: employees,
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
    console.error('Get employees error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch employees' } },
      { status: 500 }
    )
  }
}

// POST /api/employees - Create a new employee
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
    const { 
      employeeId, firstName, lastName, email, phone, address, city, country, 
      dateOfBirth, hireDate, jobTitle, departmentId, salary, isActive 
    } = body

    if (!employeeId || !firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: { message: 'Employee ID, first name, last name, and email are required' } },
        { status: 400 }
      )
    }

    // Check if employee ID already exists
    const existingEmployeeId = await prisma.employee.findUnique({ where: { employeeId } })
    if (existingEmployeeId) {
      return NextResponse.json(
        { success: false, error: { message: 'An employee with this ID already exists' } },
        { status: 400 }
      )
    }

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        jobTitle,
        departmentId,
        salary: salary || 0,
        isActive: isActive !== false,
        companyId: payload.companyId,
      },
      include: { department: true },
    })

    return NextResponse.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    console.error('Create employee error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create employee' } },
      { status: 500 }
    )
  }
}
