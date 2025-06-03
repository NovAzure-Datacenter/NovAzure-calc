"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(event: React.FormEvent) {
		event.preventDefault();
		setIsLoading(true);

		try {
			// TODO: Add your API call for signup here
			// For now, we'll simulate a successful signup
			await new Promise(resolve => setTimeout(resolve, 1000));
			router.push('/dashboard'); // Redirect to dashboard after signup
		} catch (error) {
			console.error('Signup failed:', error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-2">
				<CardTitle className="text-3xl font-bold text-foreground">
					Create an account
				</CardTitle>
				<CardDescription className="text-md text-muted-foreground">
					Enter your email and password to get started
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
						{isLoading ? "Creating account..." : "Log in"}
					</Button>
					<div className="text-sm text-muted-foreground text-center">
						Already have an account?{" "}
						<Link
							href="/login"
							className="hover:underline font-medium"
						>
							Sign in
						</Link>
					</div>
				</CardFooter>
			</form>
		</Card>
	);
}
