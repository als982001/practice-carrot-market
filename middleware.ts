import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface IRouts {
  [key: string]: boolean;
}

const publicOnlyUrls: IRouts = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const exists = publicOnlyUrls[request.nextUrl.pathname];

  // 로그아웃 상태
  if (!session.id) {
    // 로그아웃 상태에서 못 가는 곳으로 진입하는 경우
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // 로그인을 한 상황에서 로그인 페이지로 진입하는 경우
  if (exists) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher: 여기에 적은 곳에서만 middleware 실행할 수 있게 함
  // matcher: ["/", "/profile", "/create-account", "/user/:path*"],
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
