import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value
  const { pathname } = request.nextUrl

  // 1. ยกเว้นไฟล์ static, api และไฟล์ระบบต่างๆ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|txt|xml|json)$/) ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Debug log เฉพาะหน้าหลักๆ เพื่อลด noise ใน production
  console.log(`[Middleware] Path: ${pathname} | Token: ${token ? '✅' : '❌'}`)

  // 2. จัดการหน้า Public
  const isAuthPage = pathname === '/page/login' || pathname === '/page/sign-up'
  // อนุญาตให้เข้าถึงหน้า login, sign-up, หน้า / (root) และ folder /public
  const isPublicPath = isAuthPage || pathname === '/' || pathname.startsWith('/public')

  // 3. ถ้ามี Token และพยายามเข้าหน้า Login หรือ Sign-up -> ดีดไป Dashboard
  if (token && isAuthPage) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/page/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // 4. ถ้าไม่มี Token และไม่ใช่หน้า Public -> ดีดไป Login
  if (!token && !isPublicPath) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/page/login'
    loginUrl.search = '' // ป้องกัน redirect loop จาก query params (_rsc)
    return NextResponse.redirect(loginUrl)
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
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}