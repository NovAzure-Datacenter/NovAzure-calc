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
import { UserData } from "@/hooks/useUser";
import { getScenariosItems, type AccountType } from "../navigation-items";

interface NavScenariosProps {
	pathname: string;
	user: UserData | null;
	accountType: AccountType;
}

export function NavScenarios({
	pathname,
	user: _user,
	accountType,
}: NavScenariosProps) {
	const router = useRouter();
	const [_isMenuItemHovered, _setIsMenuItemHovered] = useState<string | null>(
		null
	);
	const [isExpanded, setIsExpanded] = useState(true);

	const scenarioItems = getScenariosItems(accountType);

	return (
		<SidebarGroup>
			<SidebarGroupLabel
				className="text-xs font-medium text-muted-foreground px-2 flex items-center justify-between cursor-pointer hover:text-foreground transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span>Scenarios</span>
				<ChevronDown
					className={`h-3 w-3 transition-transform duration-200 ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</SidebarGroupLabel>
			{isExpanded && (
				<SidebarMenu>
					{scenarioItems.map((item) => (
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
									className={`flex items-center gap-3 ${
										item.isActive === false
											? "opacity-50 cursor-not-allowed pointer-events-none"
											: ""
									}`}
								>
									{item.icon && <item.icon className="h-4 w-4" />}
									<span className="text-xs">{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			)}
		</SidebarGroup>
	);
}
