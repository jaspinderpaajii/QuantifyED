import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname.startsWith("/admin/login");
  const isAdmin = request.auth?.user?.role === "ADMIN";

  if (!isLoginRoute && pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
