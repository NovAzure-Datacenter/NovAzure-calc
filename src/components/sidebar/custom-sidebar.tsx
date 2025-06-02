"use client";

import * as React from "react";
import Image from "next/image";

import {
	BookOpenIcon,
	ChevronRight,
	Folder,
	Forward,
	HomeIcon,
	MoreHorizontal,
	SearchIcon,
	Trash2,
	type LucideIcon,
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
	SidebarRail,
	useSidebar,
	SidebarMenuAction,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";

import {
	DropdownMenuContent,
	DropdownMenuItem,
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
}: {} & React.ComponentProps<typeof Sidebar>) {
	const [activeTab, setActiveTab] = useState<string>("Dashboard");
	const [sideBarType, setSideBarType] = useState<SidebarType>("buyer");
	const { user, isLoading } = useUser();
	const sidebarTools = getSidebarTools(sideBarType);

	React.useEffect(() => {
		if (user?.account_type) {
			setSideBarType(user.account_type as SidebarType);
		}
	}, [user, isLoading]);

	return (
	    <Sidebar collapsible="none" {...props} variant="sidebar" className="pt-12 border-r border-border w-[16rem] max-w-[16rem] overflow-hidden">
			{isLoading ? (
				<SidebarSkeleton />
			) : (
				<>
					<SidebarHeader className="pt-8 px-4 full">
						<div className="flex items-center gap-3">
							<div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-muted">
								<Image
									src="/images/logos/logo-sample.png"
									alt="Company Logo"
									fill
									className="object-cover"
									sizes="(max-width: 40px) 100vw"
								/>
							</div>
							<div className="flex flex-col">
								<span className="font-semibold">
									{sideBarType === "seller" && user?.company_name
										? user.company_name
										: "Lorem Ipsum"}
								</span>
							</div>
						</div>
						<Separator className="my-4" />
					</SidebarHeader>

					<SidebarContent>
						<NavDefault setActiveTab={setActiveTab} activeTab={activeTab} />
						<NavMain
							items={sidebarTools.items}
							setActiveTab={setActiveTab}
							activeTab={activeTab}
						/>
						<NavSecond projects={sidebarTools.projects} />
					</SidebarContent>
				</>
			)}
		</Sidebar>
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
																		<SidebarMenuSubButton>
																			<span>{nestedItem.title}</span>
																		</SidebarMenuSubButton>
																	</SidebarMenuSubItem>
																))}
															</SidebarMenuSub>
														</CollapsibleContent>
													</Collapsible>
												) : (
													<SidebarMenuSubButton asChild>
														<a href={subItem.url} className="text-xs">
															{subItem.icon && (
																<subItem.icon className="mr-2 h-4 w-4" />
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
							<SidebarMenuButton asChild>
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

function NavDefault({
	setActiveTab,
	activeTab,
	...props
}: {
	setActiveTab: (tab: string) => void;
	activeTab: string;
} & React.ComponentProps<typeof Sidebar>) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{defautlSideBarItems.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild>
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

function SidebarSkeleton() {
	return (
		<div className="flex flex-col h-full w-[12rem]">
			<SidebarHeader className="pt-8 px-4">
				<div className="flex items-center gap-3">
					<Skeleton className="h-14 w-14 rounded-full" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-5 w-32" />
					</div>
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
