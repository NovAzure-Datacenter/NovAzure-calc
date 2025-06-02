"use client";

import * as React from "react";
import Image from "next/image";

import {
	ChevronRight,
	Folder,
	Forward,
	MoreHorizontal,
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
import { buyerSideBarItems } from "../../sidebar-Items";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface SubItem {
	title: string;
	url: string;
	description?: string;
	items?: SubItem[];
	icon?: LucideIcon;
}

interface MenuItem {
	title: string;
	icon: LucideIcon;
	component: React.ComponentType;
	isActive: boolean;
	items?: SubItem[];
}

interface Project {
	name: string;
	url: string;
	icon: LucideIcon;
}

interface SidebarItems {
	items: MenuItem[];
	projects: Project[];
}

function NavMain({ items }: { items: MenuItem[] }) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											{subItem.items ? (
												<Collapsible asChild>
													<>
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
																		<SidebarMenuSubButton asChild>
																			<a href={nestedItem.url}>
																				<span>{nestedItem.title}</span>
																			</a>
																		</SidebarMenuSubButton>
																	</SidebarMenuSubItem>
																))}
															</SidebarMenuSub>
														</CollapsibleContent>
													</>
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
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavProjects({ projects }: { projects: Project[] }) {
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<a href={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
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

export function BuyerSidebar({
	setActiveTab,
	activeTab,
	...props
}: {
	setActiveTab: (tab: string) => void;
	activeTab: string;
} & React.ComponentProps<typeof Sidebar>) {
	return (
		<div className=" border-r border-border">
			<Sidebar collapsible="none" {...props} variant="sidebar">
				<SidebarHeader className="p-4">
					<div className="flex items-center gap-3">
						<div className="relative h-10 w-10 overflow-hidden rounded-full">
							<Image
								src="/images/logos/logo-sample.png"
								alt="Company Logo"
								fill
								className="object-cover"
								sizes="(max-width: 40px) 100vw"
							/>
						</div>
						<div className="flex flex-col">
							<span className="font-semibold">Lorem Ipsum</span>
							<span className="text-sm text-muted-foreground">
								Buyer Account
							</span>
						</div>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<NavMain items={buyerSideBarItems.items} />
					<NavProjects projects={buyerSideBarItems.projects} />
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
		</div>
	);
}
