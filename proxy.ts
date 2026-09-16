import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isCompanyRoute = req.nextUrl.pathname.startsWith("/company");
    
    // If accessing core app and has no default language
    if (isCompanyRoute && !token?.defaultLanguage) {
      return NextResponse.redirect(new URL("/onboarding/language", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only authenticated users can access protected routes
    },
  }
);

export const config = {
  matcher: ["/company/:path*"], // Apply to all /company/* routes
};
