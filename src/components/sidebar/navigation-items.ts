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

// Main Navigation Items (same for all users)
export const getMainNavigationItems = (): NavigationItem[] => [
	{
		title: "Dashboard",
		icon: HomeIcon,
		url: "/home/dashboard",
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

// Products & Solutions Navigation Items
export const getProductsAndSolutionsItems = (
	accountType: AccountType
): NavigationItem[] => {
	const baseItems: NavigationItem[] = [
		{
			title: "View Solutions",
			icon: Package,
			url: "/home/solutions",
			isActive: true,
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
			url: "/home/solutions/create",
			isActive: false,
		});
	}

	return baseItems;
};

// Tools &Scenarios Navigation Items (same for all users)
export const getScenariosItems = (): NavigationItem[] => [
	
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
				title: "Manage Market Parameters",
				icon: BarChart3,
				url: "/home/admin/market-parameters",
				isActive: false,
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

	return adminItems;
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
			items: getMainNavigationItems(),
		},
		{
			title: "Products & Solutions",
			items: getProductsAndSolutionsItems(accountType),
		},
		{
			title: "Scenarios",
			items: getScenariosItems(),
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
