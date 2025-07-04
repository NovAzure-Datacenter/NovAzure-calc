"use client";

import * as React from "react";
import _Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	ChevronDown,
	HeadsetIcon,
	LogOut,
	UsersIcon,
	Package,
	Plus,
	Search,
	FileText,
	FilesIcon,
	Activity,
	Building2,
	Settings,
	BarChart3,
	Database,
	Server,
	Leaf,
	HomeIcon,
	BookOpenIcon,
} from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	Sidebar,
	SidebarContent,
	SidebarHeader,
	useSidebar,
	SidebarFooter,
} from "@/components/ui/sidebar";

import {
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	getQuickActionsByAccountType,
	getRecentItemsByAccountType,
} from "./sidebar-Items";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

import { UserData, useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getCompanyDetails } from "@/lib/actions/company/company";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarDebugPanel } from "@/components/debug/sidebar-debug-panel";

// Import the separated navigation components
import {
	NavMain,
	NavProductsAndSolutions,
	NavScenarios,
	NavQuickActions,
	NavRecentItems,
	NavAdmin,
	NavUser,
} from "./components";

type AccountType =
	| "novazure-superuser"
	| "novazure-user"
	| "company-admin"
	| "company-user";

const getAccountTypeDisplayName = (accountType: AccountType) => {
	switch (accountType) {
		case "novazure-superuser":
			return "NovAzure Super User";
		case "novazure-user":
			return "NovAzure User";
		case "company-admin":
			return "Company Administrator";
		case "company-user":
			return "Company User";
		default:
			return "User";
	}
};

// Function to validate and map account types
const validateAccountType = (accountType: string): AccountType => {
	switch (accountType) {
		case "novazure-superuser":
		case "super-admin":
			return "novazure-superuser";
		case "novazure-user":
			return "novazure-user";
		case "company-admin":
		case "admin":
			return "company-admin";
		case "company-user":
		case "user":
			return "company-user";
		default:
			return "company-user";
	}
};

export default function CustomSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const _router = useRouter();
	const pathname = usePathname();
	const [accountType, setAccountType] = useState<AccountType>("company-user");
	const { user, isLoading: isUserLoading } = useUser();
	const [companyDetails, setCompanyDetails] = useState<{
		name: string;
		logo: string;
	} | null>(null);
	const [isCompanyLoading, setIsCompanyLoading] = useState(true);
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);

	useEffect(() => {
		if (user?.account_type) {
			const validatedAccountType = validateAccountType(user.account_type);
			setAccountType(validatedAccountType);
		}
	}, [user, isUserLoading]);

	useEffect(() => {
		async function fetchCompanyDetails() {
			setIsCompanyLoading(true);
			if (user?.company_id) {
				const result = await getCompanyDetails(user.company_id);
				if (result.success && result.company) {
					setCompanyDetails({
						name: result.company.name,
						logo: result.company.logo,
					});
				}
			}
			setIsCompanyLoading(false);
		}
		fetchCompanyDetails();
	}, [user?.company_id]);

	const quickActions = getQuickActionsByAccountType(accountType);
	const recentItems = getRecentItemsByAccountType(accountType);

	return (
		<>
			<SidebarDebugPanel
				sideBarType={accountType}
				setSideBarType={setAccountType}
				originalAccountType={user?.account_type}
			/>

			<Sidebar
				collapsible="none"
				{...props}
				variant="sidebar"
				className="border-r border-border w-[18rem] max-w-[18rem] "
			>
				<>
					<SidebarHeader className="px-4 py-6">
						<div className="flex items-center gap-4">
							<div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-blue-500 to-purple-600">
								{isCompanyLoading ? (
									<Skeleton className="h-12 w-12 rounded-xl" />
								) : (
									<Avatar className="h-12 w-12 rounded-xl">
										<AvatarImage
											src={
												companyDetails?.logo ||
												"/images/profile/default-profile-pic.png"
											}
											alt="Company Logo"
											className="object-cover"
										/>
										<AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
											{companyDetails?.name?.charAt(0) || "N"}
										</AvatarFallback>
									</Avatar>
								)}
							</div>
							<div className="flex flex-col min-w-0 flex-1">
								{isCompanyLoading ? (
									<Skeleton className="h-5 w-24 mb-1" />
								) : (
									<span className="font-semibold text-sm truncate">
										{companyDetails?.name || "NovAzure"}
									</span>
								)}
								{isCompanyLoading ? (
									<Skeleton className="h-3 w-16" />
								) : (
									<span className="text-xs text-muted-foreground">
										{getAccountTypeDisplayName(accountType)}
									</span>
								)}
							</div>
						</div>
					</SidebarHeader>

					<Separator className="mb-2" />

					<SidebarContent className="space-y-3 px-2">
						{/* Main Navigation */}
						<NavMain pathname={pathname} user={user} />

						{/* Products & Solutions Section */}
						<NavProductsAndSolutions
							pathname={pathname}
							user={user}
							accountType={accountType}
						/>

						{/* Scenarios Section */}
						<NavScenarios pathname={pathname} user={user} />

						{/* Admin Tools - Only show for admin users */}
						{(accountType === "novazure-superuser" ||
							accountType === "novazure-user" ||
							accountType === "company-admin") && (
							<NavAdmin
								pathname={pathname}
								user={user}
								accountType={accountType}
							/>
						)}

						{/* Quick Actions */}
						<NavQuickActions quickActions={quickActions} pathname={pathname} />

						{/* Recent Items */}
						<NavRecentItems recentItems={recentItems} pathname={pathname} />
					</SidebarContent>

					<Separator className="mb-2" />
					
					<SidebarFooter className="px-2">
						{isUserLoading ? (
							<div className="p-4">
								<div className="flex items-center gap-4">
									<Skeleton className="h-8 w-8 rounded-lg" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-24" />
									</div>
								</div>
							</div>
						) : (
							user && <NavUser user={user} />
						)}
					</SidebarFooter>
				</>
			</Sidebar>
		</>
	);
}
