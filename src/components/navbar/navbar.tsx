"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import NavbarText from "./navbar-text";
import { useUser } from "@/hooks/useUser";
import { useRouter, usePathname } from "next/navigation";
import {
	LogOut,
	LayoutDashboard,
	Sun,
	Moon,
	Bell,
	BadgeCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

type Role = "Seller" | "Buyer" | "Admin";

export default function Navbar() {
	const { menuItems, ctaButton } = NavbarText;
	const { isUserLoggedIn, isLoading, updateUser, user } = useUser();
	const router = useRouter();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const [selectedRole, setSelectedRole] = useState<Role>("Seller");

	const handleLogout = () => {
		updateUser(null);
		router.push("/");
	};

	const handleDashboardClick = (role: Role) => {
		setSelectedRole(role);
		router.push(`/${user?.company_name || "home"}`);
	};

	const getRoleLetter = (role: Role) => {
		return role.charAt(0);
	};

	const isMainPage = pathname === "/";

	return (
		<header className="border-b bg-background fixed top-0 left-0 right-0 z-50 h-12">
			<div className="w-full pl-4">
				<div className="flex h-12 items-center justify-between">
					<div className="flex items-center gap-6">
						<Link href="/" className="font-semibold text-xl">
							<Image
								src="/images/logos/logo_novazure.png"
								alt="Company Logo"
								width={40}
								height={40}
								className="inline-block  mr-2 py-2"
							/>
						</Link>

						{menuItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
							>
								{item.label}
							</Link>
						))}
					</div>
					{!isLoading && (
						<div className="flex items-center pr-4 gap-2">
							{isUserLoggedIn ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="relative h-8 w-8 rounded-full"
										>
											<Avatar className="h-8 w-8 rounded-full">
												<AvatarFallback className="rounded-full bg-custom-dark-blue text-primary-foreground">
													{getRoleLetter(selectedRole)}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-56"
										align="end"
										sideOffset={4}
									>
										<DropdownMenuItem onClick={() => handleDashboardClick("Seller")}>
											<div className="flex items-center gap-2 ">
												<Avatar className="h-6 w-6 rounded-full">
													<AvatarFallback className="rounded-full bg-custom-dark-blue text-primary-foreground">
														S
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight">
													Seller
												</div>
												<div className="text-sm text-muted-foreground">
													DEMO
												</div>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleDashboardClick("Buyer")}>
											<div className="flex items-center gap-2 ">
												<Avatar className="h-6 w-6 rounded-full">
													<AvatarFallback className="rounded-full bg-custom-dark-blue text-primary-foreground">
														B
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight">
													Buyer
												</div>
												<div className="text-sm text-muted-foreground">
													DEMO
												</div>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleDashboardClick("Admin")}>
											<div className="flex items-center gap-2 ">
												<Avatar className="h-6 w-6 rounded-full">
													<AvatarFallback className="rounded-full bg-custom-dark-blue text-primary-foreground">
														A
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight">
													Admin
												</div>
												<div className="text-sm text-muted-foreground">
													DEMO
												</div>
											</div>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={handleLogout}>
											<LogOut className="mr-2 h-4 w-4" />
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className="flex flex-row items-center gap-4">
									<Link
										href="/login"
										className="text-sm font-medium text-muted-foreground hidden sm:block"
									>
										Log in
									</Link>
									<Button size="sm">{ctaButton}</Button>
									{isMainPage && (
										<Button
											size="sm"
											variant="ghost"
											onClick={() =>
												setTheme(theme === "dark" ? "light" : "dark")
											}
											className="flex items-center 2"
										>
											{theme === "dark" ? (
												<Sun className="h-4 w-4" />
											) : (
												<Moon className="h-4 w-4" />
											)}
										</Button>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
