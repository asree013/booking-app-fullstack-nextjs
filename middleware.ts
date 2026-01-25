import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  if (["/health", "/health/", "/healthz"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  const publicPaths = [
    "/page/login",
    "/public",
    "/api",
    "/favicon.ico",
  ];

  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(path + "/")
  ) || pathname.startsWith('/_next');


  if (isPublicPath) {
    if (token && pathname === '/page/login') {
      return NextResponse.redirect(new URL('/page/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL('/page/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// export const config = {
//   // แนะนำให้ใช้ matcher ที่ตัดไฟล์ static ออกเพื่อลดการทำงานของ Middleware
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
//   ],
// };
export const config = {
  matcher: ["/:path*"],
};