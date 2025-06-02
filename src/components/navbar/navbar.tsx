"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import NavbarText from "./navbar-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import {
	User,
	Settings,
	LayoutDashboard,
	Bell,
	HelpCircle,
	LogOut,
	Building2,
	Users2,
} from "lucide-react";

interface UserData {
	name: string;
	account_type: string;
	profile_image: string;
}

export default function Navbar() {
	const { companyName, menuItems, ctaButton } = NavbarText;
	const { user, updateUser, isUserLoggedIn, isLoading } = useUser();
	const router = useRouter();

	const handleLogout = () => {
		updateUser(null);
		router.push("/");
	};

	return (
		<header className="border-b bg-background fixed top-0 left-0 right-0 z-50 h-12">
			<div className="w-full px-6">
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
					<div className="flex items-center gap-4">
						{!isLoading && (
							<>
								{isUserLoggedIn ? (
									<NavBarDropdown
										user={user}
										router={router}
										handleLogout={handleLogout}
									/>
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
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

function NavBarDropdown({
	user,
	router,
	handleLogout,
}: {
	user: UserData | null;
	router: ReturnType<typeof useRouter>;
	handleLogout: () => void;
}) {
	if (!user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-3 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1">
				<p className="text-sm text-muted-foreground">
					DEMO: {user.account_type.toUpperCase()}
				</p>
				<div className="flex items-center gap-3">
					<div className="text-sm text-right">
						<p className="font-medium">{user.name}</p>
					</div>
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.profile_image} alt={user.name} />
						<AvatarFallback>
							{user.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => router.push("/profile")}>
						<User className="mr-2 h-4 w-4" />
						Profile
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => router.push("/dashboard")}>
						<LayoutDashboard className="mr-2 h-4 w-4" />
						Dashboard
						<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => router.push("/settings")}>
						<Settings className="mr-2 h-4 w-4" />
						Settings
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => router.push("/notifications")}>
						<Bell className="mr-2 h-4 w-4" />
						Notifications
						<DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => router.push("/support")}>
						<HelpCircle className="mr-2 h-4 w-4" />
						Support
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout} className="text-red-600">
					<LogOut className="mr-2 h-4 w-4" />
					Log out
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
