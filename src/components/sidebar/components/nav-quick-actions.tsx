"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavQuickActionsProps {
	quickActions: Array<{ title: string; icon: any; url: string }>;
	pathname: string;
}

export function NavQuickActions({ quickActions, pathname }: NavQuickActionsProps) {
	const router = useRouter();
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);
	const [isExpanded, setIsExpanded] = useState(true);

	return (
		<SidebarGroup>
			<SidebarGroupLabel 
				className="text-xs font-medium text-muted-foreground px-2 flex items-center justify-between cursor-pointer hover:text-foreground transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span>Quick Actions</span>
				<ChevronDown 
					className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
				/>
			</SidebarGroupLabel>
			{isExpanded && (
				<SidebarMenu>
					{quickActions.map((action) => (
						<SidebarMenuItem key={action.title}>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<SidebarMenuButton
										size="sm"
											asChild
											onClick={(e) => {
												e.preventDefault();
												router.push(action.url);
											}}
											className={
												_isMenuItemHovered === action.title
													? "bg-accent"
													: pathname === action.url
													? "bg-accent"
													: ""
											}
											onMouseEnter={() => _setIsMenuItemHovered(action.title)}
											onMouseLeave={() => _setIsMenuItemHovered(null)}
										>
											<a href={action.url} className="flex items-center gap-3">
												<action.icon className="h-4 w-4" />
												<span className="text-xs">{action.title}</span>
											</a>
										</SidebarMenuButton>
									</TooltipTrigger>
									<TooltipContent side="right">
										<p>{action.title}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			)}
		</SidebarGroup>
	);
} 