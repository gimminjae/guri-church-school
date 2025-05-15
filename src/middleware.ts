import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('middleware')
  // const token = request.cookies.get('authStatus')?.value

  // console.log(token)

  // // 로그인 안 되어 있으면 "/"(홈)으로 리디렉션
  // if (!token) {
  //     return NextResponse.redirect(new URL('/', request.url))
  // }

  return NextResponse.next()
}

// 로그인 검사할 경로 지정 (matcher 사용)
export const config = {
  matcher: ['/todoprays', '/status'], // 보호할 경로 지정
}
