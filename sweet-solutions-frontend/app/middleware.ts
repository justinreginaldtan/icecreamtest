import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login']
  
  // Protected routes that require authentication
  const protectedRoutes = ['/schedule', '/employees', '/requests', '/payroll', '/settings']
  
  // Manager-only routes
  const managerRoutes = ['/payroll', '/settings']

  // Check if user is trying to access a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check if user is trying to access manager-only routes
  if (managerRoutes.some(route => pathname.startsWith(route))) {
    // In a real app, you'd decode the JWT token to check the role
    // For now, we'll let the component handle role checking
  }

  // Redirect authenticated users away from login page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url))
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
