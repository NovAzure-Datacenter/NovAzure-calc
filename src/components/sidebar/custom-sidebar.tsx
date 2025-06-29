"use client";

import * as React from "react";
import _Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	HeadsetIcon,
	LogOut,
	UsersIcon,
	Package,
	CalculatorIcon,
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
	adminSideBarTools,
	buyerSidebarTools,
	defautlSideBarItems,
	sellerSideBarTools,
} from "./sidebar-Items";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

import { UserData, useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getCompanyDetails } from "@/lib/actions/company/company";
import { Skeleton } from "@/components/ui/skeleton";

type SidebarType = "seller" | "buyer" | "admin";

const getSidebarTools = (type: SidebarType) => {
	switch (type) {
		case "seller":
			return sellerSideBarTools;
		case "admin":
			return adminSideBarTools;
		case "buyer":
		default:
			return buyerSidebarTools;
	}
};

export default function CustomSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const _router = useRouter();
	const pathname = usePathname();
	const [sideBarType, setSideBarType] = useState<SidebarType>("buyer");
	const { user, isLoading: isUserLoading } = useUser();
	const _sidebarTools = getSidebarTools(sideBarType);
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
			setSideBarType(user.account_type as SidebarType);
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

	return (
		<Sidebar
			collapsible="none"
			{...props}
			variant="sidebar"
			className="border-r border-border w-[16rem] max-w-[16rem] "
		>
			<>
				<SidebarHeader className=" px-4 full">
					<div className="flex items-center gap-6">
						<div className="relative h-14 w-14 overflow-hidden rounded-full border border-border">
							{isCompanyLoading ? (
								<Skeleton className="h-14 w-14 rounded-full" />
							) : (
								<Avatar className="h-14 w-14 rounded-full">
									<AvatarImage
										src={
											companyDetails?.logo ||
											"/images/profile/default-profile-pic.png"
										}
										alt="Company Logo"
										className="object-cover"
									/>
									<AvatarFallback className="rounded-full">
										{companyDetails?.name?.charAt(0) || "C"}
									</AvatarFallback>
								</Avatar>
							)}
						</div>
						<div className="flex flex-col mr-8">
							{isCompanyLoading ? (
								<Skeleton className="h-5 w-24" />
							) : (
								<span className="font-semibold ">
									{companyDetails?.name || "No Company"}
								</span>
							)}
						</div>
					</div>
				</SidebarHeader>

				<Separator className="mb-4" />

				<SidebarContent className="space-y-4">
					<NavDefault pathname={pathname} user={user} />
					<NavProducts pathname={pathname} user={user} />
					{/* <NavMain items={sidebarTools.items} pathname={pathname} /> */}
					{/* <NavSecond projects={sidebarTools.projects} /> */}
					{user?.role === "admin" || user?.role === "super-admin" && (
						<NavAdmin pathname={pathname} user={user} />
					)}
				</SidebarContent>
				<SidebarFooter>
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
	);
}

function NavDefault({
	pathname,
	user: _user,
}: {
	pathname: string;
	user: UserData | null;
} & React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);

	// Filter out Users, Products, and TCO Calculator items since they're now handled by NavAdmin and NavProducts
	const filteredItems = defautlSideBarItems.filter((item) => {
		if (item.title === "Users" || item.title === "Products" || item.title === "TCO Calculator") {
			return false;
		}
		return true;
	});

	return (
		<SidebarGroup>
			<SidebarMenu>
				{filteredItems.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton
							asChild
							onClick={(e) => {
								e.preventDefault();
								router.push(item.url);
							}}
							className={
								_isMenuItemHovered === item.title
									? "bg-accent"
									: pathname === item.url
									? "bg-accent"
									: item.active
									? ""
									: "text-muted-foreground cursor-not-allowed"
							}
							onMouseEnter={() => _setIsMenuItemHovered(item.title)}
							onMouseLeave={() => _setIsMenuItemHovered(null)}
						>
							<a href={item.url} className="relative">
								{item.icon && <item.icon className="h-4 w-4" />}
								<span>{item.title}</span>
								{item.title.toLowerCase() === "news" && (
									<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center min-w-[20px] h-5 rounded-full bg-custom-dark-blue text-primary-foreground text-xs font-medium">
										2
									</div>
								)}
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavProducts({
	pathname,
	user: _user,
}: {
	pathname: string;
	user: UserData | null;
} & React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);

	const productItems = [
		{
			title: "Products",
			icon: Package,
			url: "/dashboard/products",
		},
		{
			title: "TCO Calculator",
			icon: CalculatorIcon,
			url: "/dashboard/calculator",
		},
	];

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Products & Tools</SidebarGroupLabel>
			<SidebarMenu>
				{productItems.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton
							asChild
							onClick={(e) => {
								e.preventDefault();
								router.push(item.url);
							}}
							className={
								_isMenuItemHovered === item.title
									? "bg-accent"
									: pathname === item.url
									? "bg-accent"
									: ""
							}
							onMouseEnter={() => _setIsMenuItemHovered(item.title)}
							onMouseLeave={() => _setIsMenuItemHovered(null)}
						>
							<a href={item.url}>
								{item.icon && <item.icon className="h-4 w-4" />}
								<span>{item.title}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavAdmin({
	pathname,
	user,
}: {
	pathname: string;
	user: UserData | null;
} & React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);

	// Check if user has admin or super-admin role
	const isAdminUser = user?.role === "admin" || user?.role === "super-admin";

	// Only render if user is admin
	if (!isAdminUser) {
		return null;
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						onClick={(e) => {
							e.preventDefault();
							router.push("/dashboard/users");
						}}
						className={
							_isMenuItemHovered === "Users"
								? "bg-accent"
								: pathname === "/dashboard/users"
								? "bg-accent"
								: ""
						}
						onMouseEnter={() => _setIsMenuItemHovered("Users")}
						onMouseLeave={() => _setIsMenuItemHovered(null)}
					>
						<a href="/dashboard/users">
							<UsersIcon className="h-4 w-4" />
							<span>Users</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavUser({ user }: { user: UserData }) {
	const router = useRouter();
	const { isMobile } = useSidebar();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await signOut({ callbackUrl: "/" });
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<SidebarGroup>
			<SidebarMenu>
				{/* Support */}
				<SidebarMenuItem>
					<SidebarMenuButton>
						<HeadsetIcon className="h-4 w-4" />
						<span>Support</span>
					</SidebarMenuButton>
				</SidebarMenuItem>

				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.profile_image}
										alt={user.first_name + " " + user.last_name}
									/>
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.first_name + " " + user.last_name}
									</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user.profile_image}
											alt={user.first_name + " " + user.last_name}
										/>
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{user.first_name + " " + user.last_name}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />

							<DropdownMenuGroup>
								<DropdownMenuItem
									onClick={() => router.push("/dashboard/account")}
								>
									<BadgeCheck />
									Account
								</DropdownMenuItem>

								<DropdownMenuItem>
									<Bell />
									Notifications
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
								<LogOut className="h-4 w-4" />
								{isLoggingOut ? "Logging out..." : "Log out"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
