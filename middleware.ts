import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
)

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/crm',
  '/sales',
  '/inventory',
  '/purchase',
  '/accounting',
  '/expenses',
  '/hr',
  '/payroll',
  '/projects',
  '/website',
  '/reports',
  '/settings',
]

// Auth routes (redirect to dashboard if authenticated)
const authRoutes = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookie or header
  const token = request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  let isAuthenticated = false

  if (token) {
    try {
      await jwtVerify(token, secret)
      isAuthenticated = true
    } catch {
      // Token is invalid or expired
      isAuthenticated = false
    }
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if trying to access auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
