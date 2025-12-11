import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (token) {
      if (
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/signup"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // If user is authenticated and account is unverified
    if (token?.user?.accountStatus === "unverified") {
      // Allow access to email-unverified page
      if (req.nextUrl.pathname === "/email-unverified") {
        return NextResponse.next();
      }
      // Redirect to email-unverified page for any other route
      return NextResponse.redirect(new URL("/email-unverified", req.url));
    }

    // If account is verified or user is not on a protected route, continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard(.*)", "/email-unverified", "/login", "/signup"],
};
