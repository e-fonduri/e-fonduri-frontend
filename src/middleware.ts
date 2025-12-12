import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Check if token exists and doesn't have an error flag
    // Note: We don't check expiresIn here because the JWT callback handles refresh
    const hasValidToken = token && !token.error;

    if (hasValidToken) {
      if (
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/signup"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // If user is authenticated and account is unverified
    if (hasValidToken && token?.user?.accountStatus === "unverified") {
      // Allow access to email-unverified page
      if (req.nextUrl.pathname === "/email-unverified") {
        return NextResponse.next();
      }
      // Redirect to email-unverified page for any other route
      return NextResponse.redirect(new URL("/email-unverified", req.url));
    }

    if (hasValidToken && token?.user?.accountStatus === "verified") {
      // Allow access to email-unverified page
      if (req.nextUrl.pathname === "/email-unverified") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // If account is verified or user is not on a protected route, continue
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const publicRoutes = ["/login", "/signup", "/"];
        if (publicRoutes.includes(req.nextUrl.pathname)) return true;

        if (!token) return false;
        if (token.error) return false;

        // Check if token is expired
        const expiresIn = (token as any).backendToken?.expiresIn;
        if (expiresIn && new Date().getTime() >= expiresIn) {
          return false;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard(.*)", "/email-unverified", "/login", "/signup", "/"],
};
