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
import { useUser } from "@/hooks/useUser";

export default function CustomSidebar({
	setActiveTab,
	activeTab,
	...props
}: {
	setActiveTab: (tab: string) => void;
	activeTab: string;
} & React.ComponentProps<typeof Sidebar>) {
	const [sideBarType, setSideBarType] = useState<"seller" | "buyer" | "admin">(
		"buyer"
	);
	const { user } = useUser();

	React.useEffect(() => {
		setSideBarType(
			(user?.account_type as "seller" | "buyer" | "admin") || "buyer"
		);
		console.log("User account type:", user?.account_type);
	}, [user]);

	return (
		<>
			{sideBarType === "buyer" && (
				<BuyerSideBar
					setActiveTab={setActiveTab}
					activeTab={activeTab}
					{...props}
				/>
			)}
			{sideBarType === "seller" && (
				<SellerSideBar
					setActiveTab={setActiveTab}
					activeTab={activeTab}
					{...props}
				/>
			)}
			{sideBarType === "admin" && (
				<AdminSideBar
					setActiveTab={setActiveTab}
					activeTab={activeTab}
					{...props}
				/>
			)}
		</>
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
							className="group/collapsible"
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
														<a href={subItem.url}>
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

function BuyerSideBar({
	setActiveTab,
	activeTab,
	...props
}: {
	setActiveTab: (tab: string) => void;
	activeTab: string;
} & React.ComponentProps<typeof Sidebar>) {
	return (
		<div className=" border-r border-border">
			<Sidebar collapsible="none" variant="sidebar" {...props}>
				<SidebarHeader className="pt-8 px-4">
					<div className="flex items-center gap-3">
						<div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-muted">
							<Image
								src="/images/logos/logo-sample.png"
								alt="Company Logo"
								fill
								className="object-cover "
								sizes="(max-width: 40px) 100vw"
							/>
						</div>
						<div className="flex flex-col">
							<span className="font-semibold">Lorem Ipsum</span>
						</div>
					</div>
					<Separator className="my-4" />
				</SidebarHeader>

				<SidebarContent>
					<NavDefault setActiveTab={setActiveTab} activeTab={activeTab} />
					<NavMain
						items={buyerSidebarTools.items}
						setActiveTab={setActiveTab}
						activeTab={activeTab}
					/>
					<NavSecond projects={buyerSidebarTools.projects} />
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
		</div>
	);
}

function SellerSideBar({
	setActiveTab,
	activeTab,
	...props
}: {
	setActiveTab: (tab: string) => void;
	activeTab: string;
} & React.ComponentProps<typeof Sidebar>) {
	return (
		<div className=" border-r border-border">
			<Sidebar collapsible="none" variant="sidebar" {...props}>
				<SidebarHeader className="pt-8 px-4">
					<div className="flex items-center gap-3">
						<div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-muted">
							<Image
								src="/images/logos/logo-sample.png"
								alt="Company Logo"
								fill
								className="object-cover "
								sizes="(max-width: 40px) 100vw"
							/>
						</div>
						<div className="flex flex-col">
							<span className="font-semibold">Lorem Ipsum</span>
						</div>
					</div>
					<Separator className="my-4" />
				</SidebarHeader>

				<SidebarContent>
					<NavDefault setActiveTab={setActiveTab} activeTab={activeTab} />
					<NavMain
						items={sellerSideBarTools.items}
						setActiveTab={setActiveTab}
						activeTab={activeTab}
					/>
					<NavSecond projects={sellerSideBarTools.projects} />
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
		</div>
	);
}

function AdminSideBar({
	setActiveTab,
	activeTab,
	...props
}: {
	setActiveTab: (tab: string) => void;
	activeTab: string;
} & React.ComponentProps<typeof Sidebar>) {
	return (
		<div className=" border-r border-border">
			<Sidebar collapsible="none" variant="sidebar" {...props}>
				<SidebarHeader className="pt-8 px-4">
					<div className="flex items-center gap-3">
						<div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-muted">
							<Image
								src="/images/logos/logo-sample.png"
								alt="Company Logo"
								fill
								className="object-cover "
								sizes="(max-width: 40px) 100vw"
							/>
						</div>
						<div className="flex flex-col">
							<span className="font-semibold">Lorem Ipsum</span>
						</div>
					</div>
					<Separator className="my-4" />
				</SidebarHeader>

				<SidebarContent>
					<NavDefault setActiveTab={setActiveTab} activeTab={activeTab} />
					<NavMain
						items={adminSideBarTools.items}
						setActiveTab={setActiveTab}
						activeTab={activeTab}
					/>
					<NavSecond projects={adminSideBarTools.projects} />
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
		</div>
	);
}

function NavSecond({ projects }: { projects: Project[] }) {
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
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
