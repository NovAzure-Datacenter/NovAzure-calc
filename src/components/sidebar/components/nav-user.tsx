"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { 
	ChevronsUpDown, 
	HeadsetIcon, 
	BadgeCheck, 
	Bell, 
	Settings, 
	LogOut 
} from "lucide-react";

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from "@/hooks/useUser";

interface NavUserProps {
	user: UserData;
}

export function NavUser({ user }: NavUserProps) {
	const router = useRouter();
	const { isMobile } = useSidebar();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isDropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownOpen]);

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
		<SidebarGroup >
			<SidebarMenu>
				{/* Support */}
				<SidebarMenuItem>
					<SidebarMenuButton size="sm">
						<HeadsetIcon className="h-4 w-4" />
						<span className="text-xs">Support</span>
					</SidebarMenuButton>
				</SidebarMenuItem>

				<SidebarMenuItem>
					<div className="relative dropdown-container">
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.profile_image}
									alt={user.first_name + " " + user.last_name}
								/>
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-xs leading-tight">
								<span className="truncate font-medium">
									{user.first_name + " " + user.last_name}
								</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.role || "User"}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
						
						{isDropdownOpen && (
							<div className={`absolute ${isMobile ? 'bottom-full mb-1' : 'left-full ml-1'} -top-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-56`}>
								{/* User Info */}
								<div className="p-3 border-b border-gray-100">
									<div className="flex items-center gap-2">
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
											<span className="truncate text-xs text-muted-foreground">
												{user.email}
											</span>
										</div>
									</div>
								</div>

								{/* Menu Items */}
								<div className="p-1">
									<button
										className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
										onClick={() => {
											router.push("/home/settings/account");
											setIsDropdownOpen(false);
										}}
									>
										<BadgeCheck className="h-4 w-4" />
										Account Settings
									</button>
									<button
										className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Bell className="h-4 w-4" />
										Notifications
									</button>
									<button
										className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Settings className="h-4 w-4" />
										Preferences
									</button>
								</div>

								{/* Separator */}
								<div className="border-t border-gray-100"></div>

								{/* Logout */}
								<div className="p-1">
									<button
										className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 disabled:opacity-50"
										onClick={handleLogout}
										disabled={isLoggingOut}
									>
										<LogOut className="h-4 w-4" />
										{isLoggingOut ? "Logging out..." : "Log out"}
									</button>
								</div>
							</div>
						)}
					</div>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
} 