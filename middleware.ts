import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  console.log(session);

  if (request.nextUrl.pathname === "/profile") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  // matcher: 여기에 적은 곳에서만 middleware 실행할 수 있게 함
  // matcher: ["/", "/profile", "/create-account", "/user/:path*"],
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
