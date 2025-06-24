"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	verifyAccountToken,
	setupInitialPassword,
} from "@/lib/actions/auth/verify-account";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

export function VerifyAccountForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
	const [userInfo, setUserInfo] = useState<{
		firstName: string;
		lastName: string;
		email: string;
	} | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const verifyToken = useCallback(async () => {
		if (!token) return;

		try {
			const result = await verifyAccountToken(token);

			if (result.error) {
				toast.error("Verification Failed", {
					description: result.error,
				});
				setIsTokenValid(false);
				return;
			}

			if (result.success && result.user) {
				setIsTokenValid(true);
				setUserInfo({
					firstName: result.user.first_name,
					lastName: result.user.last_name,
					email: result.user.email,
				});
			}
		} catch (error) {
			console.error("Token verification error:", error);
			toast.error("Error", {
				description: "An unexpected error occurred during verification.",
			});
			setIsTokenValid(false);
		}
	}, [token]);

	useEffect(() => {
		if (!token) {
			toast.error("Invalid verification link", {
				description: "The verification link is missing or invalid.",
			});
			router.push("/login");
			return;
		}
		verifyToken();
	}, [token, router, verifyToken]);

	async function handlePasswordSetup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!token) return;

		setIsLoading(true);
		setPasswordError(null);

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		// Password validation
		if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters long");
			setIsLoading(false);
			return;
		}

		if (!/[0-9]/.test(password)) {
			setPasswordError("Password must contain at least one number");
			setIsLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			const result = await setupInitialPassword(token, password);

			if (result.error) {
				toast.error("Setup Failed", {
					description: result.error,
				});
				return;
			}

			if (result.success) {
				toast.success("Account Verified", {
					description:
						"Your account has been verified and password set successfully!",
				});

				const signInResult = await signIn("credentials", {
					email: userInfo?.email,
					password,
					redirect: false,
				});

				if (signInResult?.ok) {
					router.push("/dashboard");
				} else {
					router.push("/login");
				}
			}
		} catch (error) {
			console.error("Password setup error:", error);
			toast.error("Error", {
				description: "An unexpected error occurred during setup.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	if (isTokenValid === null) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Verifying Account</CardTitle>
					<CardDescription>
						Please wait while we verify your account...
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (isTokenValid === false) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Verification Failed</CardTitle>
					<CardDescription>
						The verification link is invalid or has expired.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button onClick={() => router.push("/login")} className="w-full">
						Go to Login
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Welcome to NovAzure</CardTitle>
				<CardDescription>
					Hello {userInfo?.firstName}! Please set up your
					password to complete your account verification.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handlePasswordSetup} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Enter your password"
							required
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="Confirm your password"
							required
							disabled={isLoading}
							className={cn(
								passwordError &&
									"border-destructive focus-visible:ring-destructive"
							)}
						/>
						{passwordError && (
							<p className="text-sm text-destructive mt-1">{passwordError}</p>
						)}
					</div>
					<div className="text-sm text-muted-foreground space-y-1">
						<p>Password must contain:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>At least 6 characters</li>
							<li>One number</li>
						</ul>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Setting up account..." : "Complete Setup"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
