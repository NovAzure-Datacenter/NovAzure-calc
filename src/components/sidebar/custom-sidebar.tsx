"use client";

import * as React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

import {
	BadgeCheck,
	Bell,
	ChevronRight,
	ChevronsUpDown,
	Folder,
	Forward,
	HeadsetIcon,
	LogOut,
	MoonIcon,
	MoreHorizontal,
	SunIcon,
	Trash2,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	Sidebar,
	SidebarContent,
	SidebarHeader,
	useSidebar,
	SidebarMenuAction,
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

import { SidebarItem as MenuItem, Project } from "./sidebar-items-types";
import { UserData, useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "next-themes";
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
	activeTab,
	setActiveTab,
	...props
}: {
	activeTab: string;
	setActiveTab: (component: string) => void;
} & React.ComponentProps<typeof Sidebar>) {
	const [sideBarType, setSideBarType] = useState<SidebarType>("buyer");
	const { user, isLoading: isUserLoading } = useUser();
	const sidebarTools = getSidebarTools(sideBarType);
	const [companyDetails, setCompanyDetails] = useState<{
		name: string;
		logo: string;
	} | null>(null);
	const [isCompanyLoading, setIsCompanyLoading] = useState(true);
	const [isMenuItemHovered, setIsMenuItemHovered] = useState<string | null>(
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
						<div className="relative h-14 w-14 overflow-hidden rounded-full border border-border dark:bg-white">
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
					<NavDefault setActiveTab={setActiveTab} activeTab={activeTab} />
					<NavMain
						items={sidebarTools.items}
						setActiveTab={setActiveTab}
						activeTab={activeTab}
					/>
					<NavSecond projects={sidebarTools.projects} />
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
						user && <NavUser user={user} setActiveTab={setActiveTab} />
					)}
				</SidebarFooter>
			</>
		</Sidebar>
	);
}

function NavDefault({
	setActiveTab,
	activeTab,
}: {
	setActiveTab: (tab: string) => void;
	activeTab: string;
} & React.ComponentProps<typeof Sidebar>) {
	const [isMenuItemHovered, setIsMenuItemHovered] = useState<string | null>(
		null
	);

	return (
		<SidebarGroup>
			<SidebarMenu>
				{defautlSideBarItems.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton
							asChild
							onClick={(e) => {
								e.preventDefault();
								setActiveTab(item.url);
							}}
							className={isMenuItemHovered === item.title ? "bg-accent" : ""}
							onMouseEnter={() => setIsMenuItemHovered(item.title)}
							onMouseLeave={() => setIsMenuItemHovered(null)}
						>
							<a href={item.url} className="relative">
								{item.icon && <item.icon className="h-4 w-4" />}
								<span>{item.title}</span>
								{item.title.toLowerCase() === "news" && (
									<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center min-w-[20px] h-5 rounded-full bg-custom-dark-blue text-primary-foreground text-xs font-medium">
										3
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

function NavMain({
	items,
	setActiveTab,
	activeTab,
}: {
	items: MenuItem[];
	setActiveTab: (tab: string) => void;
	activeTab: string;
}) {
	const [openItem, setOpenItem] = useState<string | null>(null);
	const [isMenuItemHovered, setIsMenuItemHovered] = useState<string | null>(
		null
	);

	// Filter out inactive items
	const activeItems = items.filter((item) => item.isActive !== false);

	const handleItemClick = (url: string, e: React.MouseEvent) => {
		e.preventDefault();
		setActiveTab(url);
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Tools</SidebarGroupLabel>
			<SidebarMenu>
				{activeItems.map((item) =>
					item.items ? (
						<Collapsible
							key={item.title}
							asChild
							open={openItem === item.title}
							onOpenChange={(isOpen) => {
								setOpenItem(isOpen ? item.title : null);
							}}
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										tooltip={item.title}
										className={
											isMenuItemHovered === item.title ? "bg-accent" : ""
										}
										onMouseEnter={() => setIsMenuItemHovered(item.title)}
										onMouseLeave={() => setIsMenuItemHovered(null)}
									>
										{item.icon && <item.icon className="h-4 w-4" />}
										<span>{item.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 h-4 w-4" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												{subItem.items ? (
													<Collapsible asChild>
														<CollapsibleTrigger asChild>
															<SidebarMenuSubButton
																className={
																	isMenuItemHovered === subItem.title
																		? "bg-accent"
																		: ""
																}
																onMouseEnter={() =>
																	setIsMenuItemHovered(subItem.title)
																}
																onMouseLeave={() => setIsMenuItemHovered(null)}
															>
																<span>{subItem.title}</span>
																<ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
															</SidebarMenuSubButton>
														</CollapsibleTrigger>
														<CollapsibleContent>
															<SidebarMenuSub className="pl-4">
																{subItem.items.map((nestedItem) => (
																	<SidebarMenuSubItem key={nestedItem.title}>
																		<SidebarMenuSubButton
																			onClick={(e) =>
																				handleItemClick(nestedItem.url, e)
																			}
																			className={
																				isMenuItemHovered === nestedItem.title
																					? "bg-accent"
																					: ""
																			}
																			onMouseEnter={() =>
																				setIsMenuItemHovered(nestedItem.title)
																			}
																			onMouseLeave={() =>
																				setIsMenuItemHovered(null)
																			}
																		>
																			<span>{nestedItem.title}</span>
																		</SidebarMenuSubButton>
																	</SidebarMenuSubItem>
																))}
															</SidebarMenuSub>
														</CollapsibleContent>
													</Collapsible>
												) : (
													<SidebarMenuSubButton
														asChild
														onClick={(e) => handleItemClick(subItem.url, e)}
														className={
															isMenuItemHovered === subItem.title
																? "bg-accent"
																: ""
														}
														onMouseEnter={() =>
															setIsMenuItemHovered(subItem.title)
														}
														onMouseLeave={() => setIsMenuItemHovered(null)}
													>
														<a
															href={subItem.url}
															className="text-xs items-center "
														>
															{subItem.icon && (
																<subItem.icon className="h-4 w-4" />
															)}
															<span>{subItem.title}</span>
															{subItem.description && (
																<span className="text-xs text-muted-foreground">
																	{subItem.description}
																</span>
															)}
														</a>
													</SidebarMenuSubButton>
												)}
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					) : (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								onClick={(e) =>
									handleItemClick(item.url || `/${item.title.toLowerCase()}`, e)
								}
								className={isMenuItemHovered === item.title ? "bg-accent" : ""}
								onMouseEnter={() => setIsMenuItemHovered(item.title)}
								onMouseLeave={() => setIsMenuItemHovered(null)}
							>
								<a href={item.url}>
									{item.icon && <item.icon className="h-4 w-4" />}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavSecond({ projects }: { projects: Project[] }) {
	const { isMobile } = useSidebar();
	const [isMenuItemHovered, setIsMenuItemHovered] = useState<string | null>(
		null
	);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Saved Projects</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton
							asChild
							className={isMenuItemHovered === item.name ? "bg-accent" : ""}
							onMouseEnter={() => setIsMenuItemHovered(item.name)}
							onMouseLeave={() => setIsMenuItemHovered(null)}
						>
							<a href={item.url}>
								<item.icon className="h-4 w-4" />
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem>
									<Folder className="text-muted-foreground" />
									<span>View Project</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Forward className="text-muted-foreground" />
									<span>Share Project</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Trash2 className="text-muted-foreground" />
									<span>Delete Project</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavUser({
	user,
	setActiveTab,
}: {
	user: UserData;
	setActiveTab: (tab: string) => void;
}) {
	const { isMobile } = useSidebar();
	const { theme, setTheme } = useTheme();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{/* Suppert & Theme */}
				<SidebarMenuItem>
					<SidebarMenuButton>
						<HeadsetIcon className="h-4 w-4" />
						<span>Support</span>
					</SidebarMenuButton>
					<SidebarMenuButton
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{theme === "dark" ? (
							<SunIcon className="h-4 w-4" />
						) : (
							<MoonIcon className="h-4 w-4" />
						)}
						<span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
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
									onClick={() => setActiveTab("/dashboard/account/settings")}
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
							<DropdownMenuItem
								onClick={() => {
									signOut({ callbackUrl: "/login" });
								}}
							>
								<LogOut />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
