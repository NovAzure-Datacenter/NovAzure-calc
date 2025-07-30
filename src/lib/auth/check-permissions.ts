import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { hasRoutePermission, UserRole } from "./route-permissions";

export async function checkRoutePermission(pathname: string) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	const userRole = session.user.role as UserRole;
	if (!hasRoutePermission(pathname, userRole)) {
		redirect("/home/unauthorized");
	}

	return session;
}
