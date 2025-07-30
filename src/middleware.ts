import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { hasRoutePermission, UserRole } from "@/lib/auth/route-permissions";

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token;
		const pathname = req.nextUrl.pathname;

		// If no token, redirect to login (handled by withAuth)
		if (!token) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		// Check role-based access
		const userRole = token.role as UserRole;
		if (!hasRoutePermission(pathname, userRole)) {
			// Redirect to unauthorized page or dashboard
			return NextResponse.redirect(new URL("/home/unauthorized", req.url));
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: ["/home", "/home/:path*", "/api/protected/:path*"],
};
