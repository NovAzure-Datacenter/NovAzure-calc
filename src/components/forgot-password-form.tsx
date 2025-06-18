"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { requestPasswordReset, verifyResetCode, updatePassword } from "@/lib/actions/password/password";
import { cn } from "@/lib/utils";

type Step = "email" | "code" | "new-password";

export function ForgotPasswordForm() {
    const [step, setStep] = useState<Step>("email");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const router = useRouter();

    async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await requestPasswordReset({ email });
            if (result.error) {
                toast.error("Error", {
                    description: result.error,
                });
                return;
            }

            setStep("code");
            toast.success("Success", {
                description: "Reset code sent to your email",
            });
        } catch (error) {
            toast.error("Error", {
                description: "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await verifyResetCode({ email, code });
            if (result.error) {
                toast.error("Error", {
                    description: result.error,
                });
                return;
            }

            setStep("new-password");
        } catch (error) {
            toast.error("Error", {
                description: "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setPasswordError(null);

        const formData = new FormData(e.currentTarget);
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // Password validation
        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        if (!/[0-9]/.test(newPassword)) {
            setPasswordError("Password must contain at least one number");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const result = await updatePassword({ email, code, newPassword });
            if (result.error) {
                toast.error("Error", {
                    description: result.error,
                });
                return;
            }

            toast.success("Success", {
                description: "Password updated successfully",
            });
            router.push("/login");
        } catch (error) {
            toast.error("Error", {
                description: "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    {step === "email" && "Enter your email to receive a reset code"}
                    {step === "code" && "Enter the reset code sent to your email"}
                    {step === "new-password" && "Enter your new password"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Reset Code"}
                        </Button>
                    </form>
                )}

                {step === "code" && (
                    <form onSubmit={handleCodeSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Reset Code</Label>
                            <Input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify Code"}
                        </Button>
                    </form>
                )}

                {step === "new-password" && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
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
                                required
                                disabled={isLoading}
                                className={cn(
                                    passwordError && "border-destructive focus-visible:ring-destructive"
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
                            {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
} 