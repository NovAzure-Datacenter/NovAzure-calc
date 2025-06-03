"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { updateUser } = useUser();

	async function onSubmit(event: React.FormEvent) {
		event.preventDefault();
		setIsLoading(true);

		const email = (event.target as HTMLFormElement).email.value;

		// Set user data based on email type
		const userData = email.toLowerCase().includes("seller")
			? {
					name: "John Doe",
					account_type: "seller",
					profile_image: "/images/profile/profile2.jpg",
					company_name: "Shell",
			  }
			: email.toLowerCase().includes("buyer")
			? {
					name: "Jane Doe",
					account_type: "buyer",
					profile_image: "/images/profile/profile1.jpg",
					company_name: "Tech Solutions Inc.",
			  }
			: null;

		if (userData) {
			updateUser(userData);
		}

		// Simulate login delay
		setTimeout(() => {
			setIsLoading(false);
			router.push("/home/");
		}, 1000);
	}

	return (
		<>
			<CardHeader className="space-y-2">
				<CardTitle className="text-3xl font-bold text-foreground">
					Welcome back
				</CardTitle>
				<CardDescription className="text-md text-muted-foreground">
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<form onSubmit={onSubmit}>
				<CardContent className="grid gap-5">
					<div className="grid gap-2">
						<Label htmlFor="email" className="text-foreground font-medium">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							disabled={isLoading}
							required
							className="p-3 border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition duration-200"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password" className="text-foreground font-medium">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							disabled={isLoading}
							required
							className="p-3 border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition duration-200"
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-6 pt-6">
					<Button
						className="w-full h-12 font-semibold py-3 px-6 rounded-md shadow-md transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</Button>
					<div className="text-sm text-muted-foreground text-center">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="hover:underline font-medium">
							Sign up
						</Link>
					</div>
				</CardFooter>
			</form>
		</>
	);
}
