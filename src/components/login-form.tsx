"use client";
import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { login} from "@/lib/actions/auth/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { updateUser } = useUser();

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const formData = new FormData(e.currentTarget);
			const email = formData.get("email") as string;
			const password = formData.get("password") as string;

			const result = await login({ email, password });

			if (result.error) {
				toast.error("Login Failed", {
					description: result.error,
				});
				return;
			}

			if (result.success && result.user) {
				updateUser(result.user);
				toast.success("Login Successful", {
					description: "Welcome back!",
				});
				router.push("/dashboard");
			}
		} catch (error) {
			toast.error("Error", {
				description: "An unexpected error occurred",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
									disabled={isLoading}
								/>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<Link
										href="/forgot-password"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</Link>
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									required
									disabled={isLoading}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Logging in..." : "Login"}
								</Button>
								<Button variant="outline" className="w-full" disabled={true}>
									Login with Google
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
