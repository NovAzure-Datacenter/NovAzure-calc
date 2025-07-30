export type UserRole = "super-admin" | "admin" | "user" | "seller" | "buyer";

export interface RoutePermission {
	path: string;
	allowedRoles: UserRole[];
}

export const routePermissions: RoutePermission[] = [
	// All authenticated users can access
	{
		path: "/home",
		allowedRoles: ["super-admin", "admin", "user", "seller", "buyer"],
	},
	{
		path: "/home/dashboard",
		allowedRoles: ["super-admin", "admin", "user", "seller", "buyer"],
	},
	{
		path: "/home/news",
		allowedRoles: ["super-admin", "admin", "user", "seller", "buyer"],
	},
	{
		path: "/home/product-and-solutions",
		allowedRoles: ["super-admin", "admin", "user", "seller", "buyer"],
	},
	{
		path: "/home/tools-and-scenarios/value-calculator",
		allowedRoles: ["super-admin", "admin", "user", "seller", "buyer"],
	},

	// Admin-only routes
	{ path: "/home/admin", allowedRoles: ["super-admin", "admin"] },
	{
		path: "/home/admin/users-management",
		allowedRoles: ["super-admin", "admin"],
	},
	{
		path: "/home/admin/market-parameters",
		allowedRoles: ["super-admin", "admin"],
	},

	// Super-admin only routes
	{ path: "/home/admin/system-settings", allowedRoles: ["super-admin"] },
	{
		path: "/home/admin/industries-and-technologies",
		allowedRoles: ["super-admin"],
	},
	{ path: "/home/admin/clients-management", allowedRoles: ["super-admin"] },
];

export function hasRoutePermission(
	pathname: string,
	userRole: UserRole
): boolean {
	// Find the most specific route permission
	const permission = routePermissions
		.filter((route) => pathname.startsWith(route.path))
		.sort((a, b) => b.path.length - a.path.length)[0];

	if (!permission) {
		// If no specific permission found, deny access
		return false;
	}

	return permission.allowedRoles.includes(userRole);
}
