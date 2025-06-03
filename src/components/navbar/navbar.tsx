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
	ChevronsUpDown,
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

export default function Navbar() {
	const { companyName, menuItems, ctaButton } = NavbarText;
	const { isUserLoggedIn, isLoading, updateUser, user } = useUser();
	const router = useRouter();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	const handleLogout = () => {
		updateUser(null);
		router.push("/");
	};

	const handleDashboardClick = () => {
		router.push(`/${user?.company_name || "home"}`);
	};

	const isMainPage = pathname === "/";

	return (
		<header className="border-b bg-background fixed top-0 left-0 right-0 z-50 h-12">
			<div className="w-full pl-4">
				<div className="flex h-12 items-center justify-between">
					<div className="flex items-center gap-6">
						<Link href="/" className="font-semibold text-xl">
							{companyName}
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
						<div className="flex items-center pr-4">
							{isMainPage && (
								<Button
									size="sm"
									variant="ghost"
									onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
									className="flex items-center gap-2"
								>
									{theme === "dark" ? (
										<Sun className="h-4 w-4" />
									) : (
										<Moon className="h-4 w-4" />
									)}
								</Button>
							)}
							{isUserLoggedIn ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="relative h-8 w-8 rounded-full"
										>
											<Avatar className="h-8 w-8 rounded-full">
												<AvatarImage
													src={user?.profile_image}
													alt={user?.name}
												/>
												<AvatarFallback className="rounded-full">
													{user?.name?.charAt(0) || "U"}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-56"
										align="end"
										sideOffset={4}
									>
										<DropdownMenuLabel className="p-0 font-normal">
											<div className="flex items-center gap-2 px-2 py-1.5">
												<Avatar className="h-8 w-8 rounded-full">
													<AvatarImage
														src={user?.profile_image}
														alt={user?.name}
													/>
													<AvatarFallback className="rounded-full">
														{user?.name?.charAt(0) || "U"}
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight">
													<span className="font-medium">{user?.name}</span>
												</div>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={handleDashboardClick}>
											<LayoutDashboard className="mr-2 h-4 w-4" />
											Dashboard
										</DropdownMenuItem>
										<DropdownMenuGroup>
											<DropdownMenuItem>
												<BadgeCheck className="mr-2 h-4 w-4" />
												Account
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Bell className="mr-2 h-4 w-4" />
												Notifications
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={handleLogout}>
											<LogOut className="mr-2 h-4 w-4" />
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<>
									<Link
										href="/login"
										className="text-sm font-medium text-muted-foreground hidden sm:block"
									>
										Log in
									</Link>
									<Button size="sm">{ctaButton}</Button>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
