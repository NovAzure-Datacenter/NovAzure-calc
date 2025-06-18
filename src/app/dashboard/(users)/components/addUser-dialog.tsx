import { User } from "../page";
import { CompanyData } from "../../(account)/settings/components/types";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { timeZones } from "@/lib/globalConst";
import { currencies } from "@/lib/globalConst";
import { unitSystems } from "@/lib/globalConst";
import { FormEvent } from "react";
import { createUser } from "@/lib/actions/user/user";
import { toast } from "sonner";

const ROLE_OPTIONS = [
	{ value: "admin", label: "Admin" },
	{ value: "user", label: "User" },
	{ value: "seller", label: "Seller" },
	{ value: "buyer", label: "Buyer" },
] as const;

export default function AddUserDialog({
	onAddUser,
	companyData,
}: {
	onAddUser: (user: User) => void;
	companyData: CompanyData | null;
}) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		role: "" as "admin" | "user" | "seller" | "buyer" | "",
		company_name: companyData?.companyName || "",
		mobile_number: "",
		work_number: "",
		timezone: "",
		currency: "",
		unit_system: "metric" as "metric" | "imperial",
		profile_image: "",
		created_at: new Date().toISOString(),
	});

	const isFormValid =
		formData.first_name.trim() !== "" &&
		formData.last_name.trim() !== "" &&
		formData.email.trim() !== "" &&
		formData.role.trim() !== "" &&
		Boolean(companyData?.companyName);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!isFormValid || !companyData?.companyId) return;

		try {
			setIsLoading(true);
			const result = await createUser({
				...formData,
				company_id: companyData.companyId,
				role: formData.role as "admin" | "user" | "seller" | "buyer",
			});

			if (result.error) {
				toast.error(result.error);
				return;
			}

			if (result.success && result.user) {
				onAddUser(result.user);
				toast.success("User created successfully");
				setFormData({
					first_name: "",
					last_name: "",
					email: "",
					role: "",
					company_name: companyData.companyName,
					mobile_number: "",
					work_number: "",
					timezone: "",
					currency: "",
					unit_system: "metric",
					profile_image: "",
					created_at: new Date().toISOString(),
				});
				setOpen(false);
			}
		} catch (error) {
			console.error("Error creating user:", error);
			toast.error("Failed to create user");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			first_name: "",
			last_name: "",
			email: "",
			role: "",
			company_name: companyData?.companyName || "",
			mobile_number: "",
			work_number: "",
			timezone: "",
			currency: "",
			unit_system: "metric",
			profile_image: "",
			created_at: "",
		});
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add New User
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New User</DialogTitle>
					<DialogDescription>
						Create a new user account. Fields marked with * are required.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="first_name">First Name *</Label>
							<Input
								id="first_name"
								value={formData.first_name}
								onChange={(e) =>
									handleInputChange("first_name", e.target.value)
								}
								placeholder="Enter first name"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="last_name">Last Name *</Label>
							<Input
								id="last_name"
								value={formData.last_name}
								onChange={(e) => handleInputChange("last_name", e.target.value)}
								placeholder="Enter last name"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email *</Label>
						<p className="text-sm text-muted-foreground">
							Email will be used to login to the system.
							<br />A verification email will be sent to the user.
						</p>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							placeholder="Enter email address"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="role">Role *</Label>
							<Select
								value={formData.role}
								onValueChange={(value) => handleInputChange("role", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									{ROLE_OPTIONS.map((role) => (
										<SelectItem key={role.value} value={role.value}>
											{role.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="company_name">Company Name</Label>
							<div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
								{companyData?.companyName}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="mobile_number">Mobile Number</Label>
							<Input
								id="mobile_number"
								value={formData.mobile_number}
								onChange={(e) =>
									handleInputChange("mobile_number", e.target.value)
								}
								placeholder="Enter mobile number"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="work_number">Work Number</Label>
							<Input
								id="work_number"
								value={formData.work_number}
								onChange={(e) =>
									handleInputChange("work_number", e.target.value)
								}
								placeholder="Enter work number"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="timezone">Timezone</Label>
							<Select
								value={formData.timezone}
								onValueChange={(value) => handleInputChange("timezone", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select timezone" />
								</SelectTrigger>
								<SelectContent>
									{timeZones.map((timezone) => (
										<SelectItem key={timezone} value={timezone}>
											{timezone.replace("_", " ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="currency">Currency</Label>
							<Select
								value={formData.currency}
								onValueChange={(value) => handleInputChange("currency", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select currency" />
								</SelectTrigger>
								<SelectContent>
									{currencies.map((currency) => (
										<SelectItem key={currency} value={currency}>
											{currency}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="unit_system">Unit System</Label>
						<Select
							value={formData.unit_system}
							onValueChange={(value) => handleInputChange("unit_system", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select unit system" />
							</SelectTrigger>
							<SelectContent>
								{unitSystems.map((system) => (
									<SelectItem key={system} value={system}>
										{system.charAt(0).toUpperCase() + system.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!isFormValid || isLoading}>
							{isLoading ? "Creating..." : "Create User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
