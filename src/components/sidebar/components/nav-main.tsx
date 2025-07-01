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
import { Badge } from "@/components/ui/badge";
import { UserData } from "@/hooks/useUser";
import { getMainNavigationItems } from "../navigation-items";

interface NavMainProps {
	pathname: string;
	user: UserData | null;
}

export function NavMain({ pathname, user: _user }: NavMainProps) {
	const router = useRouter();
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);
	const [isExpanded, setIsExpanded] = useState(true);

	const mainItems = getMainNavigationItems();

	return (
		<SidebarGroup>
			<SidebarGroupLabel 
				className="text-xs font-medium text-muted-foreground px-2 flex items-center justify-between cursor-pointer hover:text-foreground transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span>Main Navigation</span>
				<ChevronDown 
					className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
				/>
			</SidebarGroupLabel>
			{isExpanded && (
				<SidebarMenu>
					{mainItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								size="sm"
								asChild={item.isActive !== false}
								onClick={(e) => {
									if (item.isActive === false) {
										e.preventDefault();
										return;
									}
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
								<a
									href={item.url}
									className={`relative flex items-center justify-between ${
										item.isActive === false 
											? 'opacity-50 cursor-not-allowed pointer-events-none' 
											: ''
									}`}
								>
									<div className="flex items-center gap-3">
										{item.icon && <item.icon className="h-4 w-4" />}
										<span className="text-xs">{item.title}</span>
									</div>
									{item.badge && (
										<Badge variant="secondary" className="h-5 px-1.5 text-xs">
											{item.badge}
										</Badge>
									)}
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			)}
		</SidebarGroup>
	);
} 