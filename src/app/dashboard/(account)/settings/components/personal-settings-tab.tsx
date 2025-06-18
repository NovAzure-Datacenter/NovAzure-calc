import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { PersonalData } from "./types";
import { useUser } from "@/hooks/useUser";
import { FormEvent } from "react";
import { Lock, User } from "lucide-react";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera } from "lucide-react";
import PasswordChangeForm from "./password-change-form";
import { Label } from "@/components/ui/label";

interface PersonalProfileTabProps {
	personalData: PersonalData;
	setPersonalData: (data: PersonalData) => void;
	handlePersonalSubmit: (e: FormEvent) => Promise<void>;
	timeZones: string[];
	currencies: string[];
	unitSystems: string[];
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}


export default function PersonalProfileTab({
	personalData,
	setPersonalData,
	handlePersonalSubmit,
	timeZones,
	currencies,
	unitSystems,
	isEditing,
	setIsEditing,
}: PersonalProfileTabProps) {
	const { user } = useUser();

	return (
		<>
			<Card>
				<CardHeader className="relative">
					<div className="flex items-center space-x-2">
						<User className="h-5 w-5" />
						<CardTitle>Personal Profile</CardTitle>
					</div>
					<CardDescription>
						Update your personal information and preferences.
					{!isEditing && (
						<Button
							className="absolute top-0 right-6"
							onClick={() => {
								if (isEditing) {
									handlePersonalSubmit(
										new Event("submit") as unknown as FormEvent
									);
								} else {
									setIsEditing(true);
								}
							}}
						>
							<>
								<Edit className="mr-2 h-4 w-4" /> Edit
							</>
						</Button>
					)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handlePersonalSubmit} className="space-y-6">
						<Separator />

						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr] items-center">
								<div className="flex flex-col space-y-1 ">
									<Label
										htmlFor="profile-image"
										className="text-sm font-medium"
									>
										Profile Image
									</Label>
									<CardDescription className="text-xs">
										Upload a profile picture to personalize your account.
									</CardDescription>
								</div>
								<div className="space-y-2">
									<div className="relative inline-block">
										<Avatar className="h-24 w-24 border-2 border-border">
											<AvatarImage
												src={personalData.profile_image || "/placeholder.svg"}
												className="object-cover"
											/>
											<AvatarFallback className="text-xl">
												{personalData.first_name[0]}
												{personalData.last_name[0]}
											</AvatarFallback>
										</Avatar>
										<input
											type="file"
											id="profile-image"
											accept="image/*"
											className="hidden"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													const reader = new FileReader();
													reader.onloadend = () => {
														setPersonalData({
															...personalData,
															profile_image: reader.result as string,
														});
													};
													reader.readAsDataURL(file);
												}
											}}
											disabled={!isEditing}
										/>
										{isEditing && (
											<Button
												variant="secondary"
												size="icon"
												className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-background"
												onClick={() =>
													document.getElementById("profile-image")?.click()
												}
											>
												<Camera className="h-4 w-4" />
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
								<div className="flex flex-col space-y-1">
									<Label
										htmlFor="mobile_number"
										className="text-sm font-medium"
									>
										Mobile Number
									</Label>
									<CardDescription className="text-xs">
										Your primary contact number.
									</CardDescription>
								</div>
								<div className="space-y-2">
									<Input
										id="mobile_number"
										type="tel"
										value={personalData.mobile_number}
										onChange={(e) =>
											setPersonalData({
												...personalData,
												mobile_number: e.target.value,
											})
										}
										placeholder="+1 (555) 000-0000"
										disabled={!isEditing}
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
								<div className="flex flex-col space-y-1">
									<Label htmlFor="work_number" className="text-sm font-medium">
										Work Number
									</Label>
									<CardDescription className="text-xs">
										Your work contact number.
									</CardDescription>
								</div>
								<div className="space-y-2">
									<Input
										id="work_number"
										type="tel"
										value={personalData.work_number}
										onChange={(e) =>
											setPersonalData({
												...personalData,
												work_number: e.target.value,
											})
										}
										placeholder="+1 (555) 000-0000"
										disabled={!isEditing}
									/>
								</div>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
								<div className="flex flex-col space-y-1">
									<Label htmlFor="timezone" className="text-sm font-medium">
										Time Zone
									</Label>
									<CardDescription className="text-xs">
										Set your local time zone for accurate scheduling.
									</CardDescription>
								</div>
								<div className="space-y-2">
									<Select
										value={personalData.timezone}
										onValueChange={(value) =>
											setPersonalData({ ...personalData, timezone: value })
										}
										disabled={!isEditing}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{timeZones.map((tz: string) => (
												<SelectItem key={tz} value={tz}>
													{tz}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
								<div className="flex flex-col space-y-1">
									<Label htmlFor="currency" className="text-sm font-medium">
										Currency
									</Label>
									<CardDescription className="text-xs">
										Choose your preferred currency for transactions.
									</CardDescription>
								</div>
								<div className="space-y-2">
									<Select
										value={personalData.currency}
										onValueChange={(value) =>
											setPersonalData({ ...personalData, currency: value })
										}
										disabled={!isEditing}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{currencies.map((currency: string) => (
												<SelectItem key={currency} value={currency}>
													{currency}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
								<div className="flex flex-col space-y-1">
									<Label htmlFor="unit_system" className="text-sm font-medium">
										Unit System
									</Label>
									<CardDescription className="text-xs">
										Select your preferred unit system (metric or imperial).
									</CardDescription>
								</div>
								<div className="space-y-2">
									<Select
										value={personalData.unit_system}
										onValueChange={(value) =>
											setPersonalData({ ...personalData, unit_system: value })
										}
										disabled={!isEditing}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{unitSystems.map((system: string) => (
												<SelectItem key={system} value={system}>
													{system.charAt(0).toUpperCase() + system.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{isEditing && (
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsEditing(false)}>
									{" "}
									Cancel{" "}
								</Button>
								<Button type="submit">Save Personal Settings</Button>
							</div>
						)}
					</form>
				</CardContent>
			</Card>
			<Card className="mt-6">
				<CardHeader className="relative">
					<div className="flex items-center space-x-2">
						<Lock className="h-5 w-5" />
						<CardTitle>Change Password</CardTitle>
					</div>
					<CardDescription>
						Update your password to secure your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{user && <PasswordChangeForm userId={user._id} />}
				</CardContent>
			</Card>
		</>
	);
}
