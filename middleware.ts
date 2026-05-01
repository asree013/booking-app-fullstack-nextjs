import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value
  const { pathname } = request.nextUrl

  // 1. ยกเว้นไฟล์ static และ api ต่างๆ ออกไปก่อน
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. จัดการหน้า Public
  const isLoginPage = pathname === '/page/login'
  const isPublicPath = isLoginPage || pathname.startsWith('/public')

  // 3. ถ้ามี Token และพยายามเข้าหน้า Login -> ดีดไป Dashboard
  if (token && isLoginPage) {
    // ใช้ request.nextUrl.clone() เพื่อคง protocol/host ที่ถูกต้องไว้
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/page/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // 4. ถ้าไม่มี Token และไม่ใช่หน้า Public -> ดีดไป Login
  if (!token && !isPublicPath) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/page/login'
    // ล้าง query parameters ออกให้หมดเพื่อป้องกันการวนลูปของ _rsc
    loginUrl.search = ''
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // ใช้ matcher ที่มีประสิทธิภาพมากขึ้น (ตัดพวกไฟล์รูปและ static ออก)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}