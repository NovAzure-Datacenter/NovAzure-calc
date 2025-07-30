import {
	HomeIcon,
	BookOpenIcon,
	Package,
	Plus,
	FilesIcon,
	UsersIcon,
	Building2,
	Database,
	BarChart3,
	Activity,
	Search,
	Calculator,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { hasRoutePermission, UserRole } from "@/lib/auth/route-permissions";

export type AccountType =
	| "novazure-superuser"
	| "novazure-user"
	| "company-admin"
	| "company-user";

export interface NavigationItem {
	title: string;
	icon: LucideIcon;
	url: string;
	badge?: string;
	isActive?: boolean;
}

export interface NavigationSection {
	title: string;
	items: NavigationItem[];
}

// Helper function to map account types to UserRole
function mapAccountTypeToUserRole(accountType: AccountType): UserRole {
	switch (accountType) {
		case "novazure-superuser":
			return "super-admin";
		case "novazure-user":
		case "company-admin":
			return "admin";
		case "company-user":
		default:
			return "user";
	}
}

// Helper function to filter navigation items based on route permissions
function filterNavigationItemsByPermission(
	items: NavigationItem[],
	userRole: UserRole
): NavigationItem[] {
	return items.filter((item) => {
		if (!item.url) return true;
		return hasRoutePermission(item.url, userRole);
	});
}

// Main Navigation Items (same for all users)
export const getMainNavigationItems = (
	accountType: AccountType
): NavigationItem[] => {
	const items: NavigationItem[] = [
		{
			title: "Dashboard",
			icon: HomeIcon,
			url: "/home/dashboard",
			isActive: true,
		},
		{
			title: "My Clients",
			icon: UsersIcon,
			url: "/home/leads",
			isActive: true,
		},
		{
			title: "News & Updates",
			icon: BookOpenIcon,
			url: "/home/news",
			badge: "2",
			isActive: true,
		},
	];

	const userRole = mapAccountTypeToUserRole(accountType);
	return filterNavigationItemsByPermission(items, userRole);
};

// Products & Solutions Navigation Items
export const getProductsAndSolutionsItems = (
	accountType: AccountType
): NavigationItem[] => {
	const baseItems: NavigationItem[] = [
		{
			title: "View Solutions",
			icon: Package,
			url: "/home/product-and-solutions/solutions",
			isActive: true,
		},
		{
			title: "View Products",
			icon: Package,
			url: "/home/product-and-solutions/products",
			isActive: false,
		},
	];

	// Add Create Solution for admin users
	if (
		accountType === "novazure-superuser" ||
		accountType === "novazure-user" ||
		accountType === "company-admin"
	) {
		baseItems.push({
			title: "Create Solution",
			icon: Plus,
			url: "/home/product-and-solutions/solutions/create",
			isActive: true,
		},
		{
			title: "Add Product",
			icon: Plus,
			url: "/home/product-and-solutions/products/create",
			isActive: true,
		});
	}

	const userRole = mapAccountTypeToUserRole(accountType);
	return filterNavigationItemsByPermission(baseItems, userRole);
};

// Tools &Scenarios Navigation Items (same for all users)
export const getScenariosItems = (
	accountType: AccountType
): NavigationItem[] => {
	const items: NavigationItem[] = [
		{
			title: "Value Calculator",
			icon: Calculator,
			url: "/home/tools-and-scenarios/value-calculator",
			isActive: true,
		},
		{
			title: "View Scenarios",
			icon: FilesIcon,
			url: "/home/tools-and-scenarios/scenarios",
			isActive: true,
		},
	];

	const userRole = mapAccountTypeToUserRole(accountType);
	return filterNavigationItemsByPermission(items, userRole);
};

// Admin Navigation Items
export const getAdminItems = (accountType: AccountType): NavigationItem[] => {
	const adminItems: NavigationItem[] = [
		{
			title: "User Management",
			icon: UsersIcon,
			url: "/home/admin/users-management",
			isActive: true,
		},
	];

	// Add NovAzure-specific admin items
	if (accountType === "novazure-superuser" || accountType === "novazure-user") {
		adminItems.push(
			{
				title: "Client Management",
				icon: Building2,
				url: "/home/admin/clients-management",
				isActive: true,
			},
			{
				title: "Manage Industries & Technologies",
				icon: Database,
				url: "/home/admin/industries-and-technologies",
				isActive: true,
			},
			{
				title: "Manage Global Parameters",
				icon: BarChart3,
				url: "/home/admin/global-parameters",
				isActive: true,
			}
		);
	}

	// Add Activity Logs for all admin users
	adminItems.push({
		title: "Activity Logs",
		icon: Activity,
		url: "/home/logs",
		isActive: false,
	});

	const userRole = mapAccountTypeToUserRole(accountType);
	return filterNavigationItemsByPermission(adminItems, userRole);
};

// Quick Actions
export const getQuickActionsByAccountType = (accountType: AccountType) => {
	const baseActions = [
		{ title: "Search Solution", icon: Search, url: "/home/solutions" },
	];

	switch (accountType) {
		case "novazure-superuser":
		case "novazure-user":
			return [
				{
					title: "New Solution",
					icon: Plus,
					url: "/home/solutions/create",
				},
				...baseActions,
				{ title: "Add User", icon: UsersIcon, url: "/home/users/new" },
			];
		case "company-admin":
			return [
				{
					title: "New Solution",
					icon: Plus,
					url: "/home/solutions/create",
				},
				...baseActions,
				{ title: "Add User", icon: UsersIcon, url: "/home/users/new" },
			];
		case "company-user":
			return baseActions;
		default:
			return baseActions;
	}
};

// Recent Items
export const getRecentItemsByAccountType = (accountType: AccountType) => {
	const baseItems = [
		{
			title: "Recent Solutions",
			type: "solution",
			url: "/home/solutions/recent",
		},
		{
			title: "Latest Scenarios",
			type: "scenario",
			url: "/home/scenarios/recent",
		},
	];

	switch (accountType) {
		case "novazure-superuser":
		case "novazure-user":
			return [
				...baseItems,
				{ title: "User Management", type: "admin", url: "/home/users" },
				{
					title: "Client Management",
					type: "admin",
					url: "/home/clients",
				},
			];
		case "company-admin":
			return [
				...baseItems,
				{ title: "User Management", type: "admin", url: "/home/users" },
			];
		case "company-user":
			return baseItems;
		default:
			return baseItems;
	}
};

// Helper function to get all navigation sections for a user type
export const getAllNavigationSections = (
	accountType: AccountType
): NavigationSection[] => {
	const sections: NavigationSection[] = [
		{
			title: "Main Navigation",
			items: getMainNavigationItems(accountType),
		},
		{
			title: "Products & Solutions",
			items: getProductsAndSolutionsItems(accountType),
		},
		{
			title: "Scenarios",
			items: getScenariosItems(accountType),
		},
	];

	// Add Admin Tools for admin users
	if (
		accountType === "novazure-superuser" ||
		accountType === "novazure-user" ||
		accountType === "company-admin"
	) {
		sections.push({
			title: "Admin Tools",
			items: getAdminItems(accountType),
		});
	}

	return sections;
};

// User permission helpers
export const canCreateSolutions = (accountType: AccountType): boolean => {
	return (
		accountType === "novazure-superuser" ||
		accountType === "novazure-user" ||
		accountType === "company-admin"
	);
};

export const canManageUsers = (accountType: AccountType): boolean => {
	return (
		accountType === "novazure-superuser" ||
		accountType === "novazure-user" ||
		accountType === "company-admin"
	);
};

export const canManageClients = (accountType: AccountType): boolean => {
	return (
		accountType === "novazure-superuser" || accountType === "novazure-user"
	);
};

export const canManageSystemSettings = (accountType: AccountType): boolean => {
	return (
		accountType === "novazure-superuser" || accountType === "novazure-user"
	);
};
