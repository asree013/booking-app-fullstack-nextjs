import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. ดึง Token จาก Cookie
  const token = request.cookies.get('jwt')?.value
  const { pathname } = request.nextUrl

  // 2. กำหนด Path ที่เป็นหน้า Login
  const isLoginPage = pathname === '/page/login'

  if (pathname === "/health" || pathname === "/health/" || pathname === "/healthz") {
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  const publicPaths = [
    "/page/dashboard",
    "/page/product",
    "/page/user-management",
    "/public",
    "/_next",
    "/favicon.ico",
    "/api",
  ];

  for (const p of publicPaths) {
    if (pathname === p || pathname.startsWith(p + "/")) {
      console.debug(`[middleware] allowing public path: ${pathname} matches ${p}`);
      return NextResponse.next();
    }
  }

  // 3. ถ้าไม่มี Token และพยายามเข้าหน้าอื่นที่ไม่ใช่ Login -> ไล่กลับไปหน้า Login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/page/login', request.url))
  }

  // 4. ถ้ามี Token แล้วแต่ยังจะเข้าหน้า Login -> ส่งไปหน้า Dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/page/dashboard', request.url))
  }

  return NextResponse.next()
}

// 5. กำหนดว่าจะให้ Middleware ทำงานที่ Path ไหนบ้าง
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }

export const config = {
  matcher: ["/:path*"],
};