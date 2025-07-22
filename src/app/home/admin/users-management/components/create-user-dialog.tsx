"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Mail, Copy } from "lucide-react";
import { toast } from "sonner";
import { createUserForCurrentCompany, getCurrentUserClientId } from "@/lib/actions/user/user";
import { PhoneInputWrapper } from "../../clients-management/components/phone-input-wrapper";
import { getClientDetails } from "@/lib/actions/clients/clients";

interface CreateUserDialogProps {
	onCreate: () => Promise<void>;
}

export function CreateUserDialog({ onCreate }: CreateUserDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [generatedLoginEmail, setGeneratedLoginEmail] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [isLoadingCompanyName, setIsLoadingCompanyName] = useState(false);
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		mobile_number: "",
		role: "",
		timezone: "UTC",
	});

	const roles = [
		"admin",
		"user",
	];

	const timezones = [
		"UTC",
		"EST",
		"CST",
		"MST",
		"PST",
		"GMT",
		"BST",
		"CET",
		"EET",
		"JST",
		"AEST",
		"NZST",
	];

	// Function to generate login email (same logic as server-side)
	const generateLoginEmail = (firstName: string, lastName: string, companyName: string): string => {
		if (!firstName || !lastName || !companyName) {
			return "";
		}

		// Clean and normalize inputs
		const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, "").toLowerCase();
		const cleanLastName = lastName.replace(/[^a-zA-Z]/g, "").toLowerCase();
		const cleanCompanyName = companyName
			.replace(/[^a-zA-Z0-9]/g, "")
			.replace(/\s+/g, "")
			.toLowerCase();

		if (!cleanFirstName || !cleanLastName || !cleanCompanyName) {
			return "";
		}

		// Generate email: firstLetter + lastName + "-" + companyName + "@novazure.com"
		const firstLetter = cleanFirstName.charAt(0).toUpperCase();
		const email = `${firstLetter}${cleanLastName}-${cleanCompanyName}@novazure.com`;

		return email;
	};

	// Load company name when dialog opens
	useEffect(() => {
		if (open) {
			loadCompanyName();
		}
	}, [open]);

	const loadCompanyName = async () => {
		setIsLoadingCompanyName(true);
		try {
			const currentClientId = await getCurrentUserClientId();
			if (currentClientId) {
				const result = await getClientDetails(currentClientId);
				if (result.success && result.client) {
					setCompanyName(result.client.name);
				}
			}
		} catch (error) {
			console.error("Error loading company name:", error);
		} finally {
			setIsLoadingCompanyName(false);
		}
	};

	// Update generated login email when form data changes
	useEffect(() => {
		if (formData.first_name && formData.last_name) {
			if (companyName) {
				// If we have company name, generate the full email
				const loginEmail = generateLoginEmail(formData.first_name, formData.last_name, companyName);
				setGeneratedLoginEmail(loginEmail);
			} else if (!isLoadingCompanyName) {
				// If company name is not loading (meaning it failed or is empty), show a placeholder
				const cleanFirstName = formData.first_name.replace(/[^a-zA-Z]/g, "").toLowerCase();
				const cleanLastName = formData.last_name.replace(/[^a-zA-Z]/g, "").toLowerCase();
				if (cleanFirstName && cleanLastName) {
					const firstLetter = cleanFirstName.charAt(0).toUpperCase();
					setGeneratedLoginEmail(`${firstLetter}${cleanLastName}-[company]@novazure.com`);
				}
			}
		} else {
			setGeneratedLoginEmail("");
		}
	}, [formData.first_name, formData.last_name, companyName, isLoadingCompanyName]);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Login email copied to clipboard");
		} catch (error) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validate required fields
			if (
				!formData.first_name ||
				!formData.last_name ||
				!formData.email ||
				!formData.role
			) {
				toast.error("Please fill in all required fields");
				return;
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(formData.email)) {
				toast.error("Please enter a valid email address");
				return;
			}

			// Create user using MongoDB function
			const result = await createUserForCurrentCompany({
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				mobile_number: formData.mobile_number,
				role: formData.role as "admin" | "user",
				timezone: formData.timezone,
			});

			if ('error' in result) {
				toast.error(result.error);
				return;
			}

			if ('success' in result && result.success) {
				toast.success(`User created successfully! Login email: ${result.user?.email}`);
				await onCreate();
				setOpen(false);
				resetForm();
			} else {
				toast.error("Failed to create user");
			}
		} catch (error) {
			console.error("Error creating user:", error);
			toast.error("Failed to create user");
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			first_name: "",
			last_name: "",
			email: "",
			mobile_number: "",
			role: "",
			timezone: "UTC",
		});
		setGeneratedLoginEmail("");
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			resetForm();
		}
		setOpen(newOpen);
	};

	const isFormValid =
		formData.first_name.trim() &&
		formData.last_name.trim() &&
		formData.email.trim() &&
		formData.role;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size="sm" className="text-xs">
					<Plus className="h-4 w-4 mr-2" />
					Create User
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
				<DialogHeader className="pb-4 px-6 pt-6">
					<DialogTitle className="text-lg">Create New User</DialogTitle>
					<DialogDescription className="text-sm">
						Add a new user to your account. Fill in the required information
						below.
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6">
					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="space-y-8">
							{/* Basic Information */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Basic Information</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first_name" className="text-xs">
											First Name *
										</Label>
										<Input
											id="first_name"
											value={formData.first_name}
											onChange={(e) =>
												setFormData({ ...formData, first_name: e.target.value })
											}
											placeholder="Enter first name"
											className="h-8 text-xs"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="last_name" className="text-xs">
											Last Name *
										</Label>
										<Input
											id="last_name"
											value={formData.last_name}
											onChange={(e) =>
												setFormData({ ...formData, last_name: e.target.value })
											}
											placeholder="Enter last name"
											className="h-8 text-xs"
											required
										/>
									</div>
								</div>

								{/* Generated Login Email - Right below first and last name */}
								{(generatedLoginEmail || (formData.first_name && formData.last_name && isLoadingCompanyName)) && (
									<div className="space-y-2">
										<Label className="text-xs">Generated Login Email</Label>
										<div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
											<Mail className="h-3 w-3 text-muted-foreground" />
											<div className="flex-1">
												{isLoadingCompanyName ? (
													<div className="flex items-center gap-2">
														<Loader2 className="h-3 w-3 animate-spin" />
														<p className="text-xs text-muted-foreground">Loading company name...</p>
													</div>
												) : (
													<p className="text-xs text-muted-foreground">{generatedLoginEmail}</p>
												)}
											</div>
											{generatedLoginEmail && !isLoadingCompanyName && (
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => copyToClipboard(generatedLoginEmail)}
													className="h-6 text-xs"
												>
													<Copy className="h-3 w-3 mr-1" />
													Copy
												</Button>
											)}
										</div>
									</div>
								)}
							</div>

							{/* Contact Information */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Contact Information</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="email" className="text-xs">
											Contact Email *
										</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											placeholder="Enter contact email"
											className="h-8 text-xs"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="mobile_number" className="text-xs">
											Phone Number
										</Label>
										<PhoneInputWrapper
											value={formData.mobile_number}
											onChange={(value) =>
												setFormData({ ...formData, mobile_number: value })
											}
											placeholder="Enter phone number"
										/>
									</div>
								</div>
							</div>

							{/* Role & Settings */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Role & Settings</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="role" className="text-xs">
											Role *
										</Label>
										<Select
											value={formData.role}
											onValueChange={(value) =>
												setFormData({ ...formData, role: value })
											}
										>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue placeholder="Select role" />
											</SelectTrigger>
											<SelectContent>
												{roles.map((role) => (
													<SelectItem key={role} value={role}>
														{role}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="timezone" className="text-xs">
											Timezone
										</Label>
										<Select
											value={formData.timezone}
											onValueChange={(value) =>
												setFormData({ ...formData, timezone: value })
											}
										>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue placeholder="Select timezone" />
											</SelectTrigger>
											<SelectContent>
												{timezones.map((timezone) => (
													<SelectItem key={timezone} value={timezone}>
														{timezone}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>

				<DialogFooter className="px-6 py-4 border-t bg-background">
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={isLoading}
						size="sm"
						className="text-xs h-8"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						onClick={handleSubmit}
						disabled={!isFormValid || isLoading}
						size="sm"
						className="text-xs h-8"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Creating...
							</>
						) : (
							"Create User"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
