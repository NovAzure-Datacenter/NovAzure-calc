"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Package, FilesIcon, Settings, FileText } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavRecentItemsProps {
	recentItems: Array<{ title: string; type: string; url: string }>;
	pathname: string;
}

export function NavRecentItems({ recentItems, pathname }: NavRecentItemsProps) {
	const router = useRouter();
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);
	const [isExpanded, setIsExpanded] = useState(true);

	const getIcon = (type: string) => {
		switch (type) {
			case "solution":
				return Package;
			case "scenario":
				return FilesIcon;
			case "admin":
				return Settings;
			default:
				return FileText;
		}
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel 
				className="text-xs font-medium text-muted-foreground px-2 flex items-center justify-between cursor-pointer hover:text-foreground transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span>Recent Items</span>
				<ChevronDown 
					className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
				/>
			</SidebarGroupLabel>
			{isExpanded && (
				<SidebarMenu>
					{recentItems.map((item) => {
						const IconComponent = getIcon(item.type);
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
								size="sm"
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
									<a href={item.url} className="flex items-center gap-3">
										<IconComponent className="h-4 w-4" />
										<span className="text-xs truncate">{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			)}
		</SidebarGroup>
	);
} 