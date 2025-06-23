"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import NavbarText from "./navbar-text";
import { useUser } from "@/hooks/useUser";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

type Role = "Seller" | "Buyer" | "Admin";

export default function Navbar() {
	const { menuItems, ctaButton } = NavbarText;
	const { isUserLoggedIn, isLoading, logout, user } = useUser();
	const pathname = usePathname();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await logout();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};



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
								<div className="flex items-center gap-2">
									<Link href="/dashboard">
										<Button size="sm" variant="default" className="hidden sm:flex">
											Go to Dashboard
										</Button>
									</Link>
									<Button
										size="sm"
										variant="outline"
										onClick={handleLogout}
										disabled={isLoggingOut}
										className="hidden sm:flex items-center gap-2"
									>
										<LogOut className="h-4 w-4" />
										{isLoggingOut ? "Logging out..." : "Log out"}
									</Button>
								</div>
							) : (
								<div className="flex flex-row items-center gap-4">
									{pathname !== "/login" && (
										<Link
											href="/login"
											className="text-sm font-medium text-muted-foreground hidden sm:block"
										>
											Log in
										</Link>
									)}
									<Button size="sm">{ctaButton}</Button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
