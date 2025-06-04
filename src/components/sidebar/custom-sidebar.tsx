"use client";

import * as React from "react";
import Image from "next/image";

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
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

import { SidebarItem as MenuItem, Project } from "./sidebar-items-types";
import { UserData, useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "next-themes";

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
	const { user, isLoading } = useUser();
	const sidebarTools = getSidebarTools(sideBarType);

	React.useEffect(() => {
		if (user?.account_type) {
			setSideBarType(user.account_type as SidebarType);
		}
	}, [user, isLoading]);

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
							<Image
								src="/images/logos/logo_iceotope.png"
								alt="Company Logo"
								width={56}
								height={56}
								className="object-scale-down"
							/>
						</div>
						<div className="flex flex-col mr-8">
							<span className="font-semibold ">{"iceotope".toUpperCase()}</span>
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
				<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
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
									<SidebarMenuButton tooltip={item.title}>
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
															<SidebarMenuSubButton>
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

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Saved Projects</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
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

function NavUser({ user }: { user: UserData }) {
	const { isMobile } = useSidebar();
	const { theme, setTheme } = useTheme();

	return (
		<SidebarGroup>
			<SidebarMenu>
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
									<AvatarImage src={user.profile_image} alt={user.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
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
										<AvatarImage src={user.profile_image} alt={user.name} />
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{user.name}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />

							<DropdownMenuGroup>
								<DropdownMenuItem>
									<BadgeCheck />
									Account
								</DropdownMenuItem>

								<DropdownMenuItem>
									<Bell />
									Notifications
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
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

function SidebarSkeleton() {
	return (
		<div className="flex flex-col h-full w-[12rem]">
			<SidebarHeader className="pt-8 px-4">
				<div className="flex items-center gap-3">
					<Skeleton className="h-14 w-20 rounded-full" />

					<Skeleton className="h-5 w-32" />
				</div>
				<Separator className="my-4" />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{[1, 2, 3].map((i) => (
							<SidebarMenuItem key={i}>
								<div className="flex items-center gap-3 px-3 py-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-24" />
								</div>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>
						<Skeleton className="h-4 w-16" />
					</SidebarGroupLabel>
					<SidebarMenu>
						{[1, 2, 3, 4].map((i) => (
							<SidebarMenuItem key={i}>
								<div className="flex items-center gap-3 px-3 py-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-32" />
								</div>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>
						<Skeleton className="h-4 w-24" />
					</SidebarGroupLabel>
					<SidebarMenu>
						{[1, 2].map((i) => (
							<SidebarMenuItem key={i}>
								<div className="flex items-center gap-3 px-3 py-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-28" />
								</div>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</div>
	);
}
