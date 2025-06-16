import { FormEvent, useState } from "react";
import { changePassword } from "@/lib/actions/password/password";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordChangeFormProps {
	userId: string;
}

export default function PasswordChangeForm({ userId }: PasswordChangeFormProps) {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const handlePasswordChange = async (e: FormEvent) => {
		e.preventDefault();
		setIsChangingPassword(true);
		setPasswordError(null);

		if (passwordData.newPassword.length < 6) {
			setPasswordError("Password must be at least 6 characters long");
			setIsChangingPassword(false);
			return;
		}

		if (!/[0-9]/.test(passwordData.newPassword)) {
			setPasswordError("Password must contain at least one number");
			setIsChangingPassword(false);
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordError("Passwords do not match");
			setIsChangingPassword(false);
			return;
		}

		try {
			const result = await changePassword({
				userId: userId,
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			});

			if (result.error) {
				toast.error("Password Change Failed", {
					description: result.error,
				});
			} else {
				toast.success("Password Changed", {
					description: "Your password has been updated successfully.",
				});
				setPasswordData({
					currentPassword: "",
					newPassword: "",
					confirmPassword: "",
				});
				setPasswordError(null);
			}
		} catch (error) {
			toast.error("Error", {
				description: "An unexpected error occurred",
			});
		} finally {
			setIsChangingPassword(false);
		}
	};

	return (
		<div className="space-y-4">
			<form onSubmit={handlePasswordChange} className="space-y-4">
				{passwordError && (
					<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
						{passwordError}
					</div>
				)}
				<div className="space-y-2">
					<Label htmlFor="currentPassword">Current Password</Label>
					<div className="relative">
						<Input
							id="currentPassword"
							type={showCurrentPassword ? "text" : "password"}
							value={passwordData.currentPassword}
							onChange={(e) =>
								setPasswordData({
									...passwordData,
									currentPassword: e.target.value,
								})
							}
							placeholder="Enter current password"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-2 top-1/2 -translate-y-1/2"
							onClick={() => setShowCurrentPassword(!showCurrentPassword)}
						>
							{showCurrentPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="newPassword">New Password</Label>
					<div className="relative">
						<Input
							id="newPassword"
							type={showNewPassword ? "text" : "password"}
							value={passwordData.newPassword}
							onChange={(e) =>
								setPasswordData({
									...passwordData,
									newPassword: e.target.value,
								})
							}
							placeholder="Enter new password"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-2 top-1/2 -translate-y-1/2"
							onClick={() => setShowNewPassword(!showNewPassword)}
						>
							{showNewPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="confirmPassword">Confirm New Password</Label>
					<div className="relative">
						<Input
							id="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							value={passwordData.confirmPassword}
							onChange={(e) =>
								setPasswordData({
									...passwordData,
									confirmPassword: e.target.value,
								})
							}
							placeholder="Confirm new password"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-2 top-1/2 -translate-y-1/2"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							{showConfirmPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={isChangingPassword}>
						{isChangingPassword ? "Changing Password..." : "Change Password"}
					</Button>
				</div>
			</form>
		</div>
	);
}
