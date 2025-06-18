import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Building2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormEvent } from "react";
import { CompanyData } from "./types";
import { updateCompanyDetails } from "@/lib/actions/company/company";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

interface CompanySettingsTabProps {
	companyData: CompanyData;
	setCompanyData: (data: CompanyData) => void;
	handleCompanySubmit: (e: FormEvent) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

export default function CompanySettingsTab({
	companyData,
	setCompanyData,
	handleCompanySubmit,
	isEditing,
	setIsEditing,
}: CompanySettingsTabProps) {
	const { user } = useUser();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!user?.company_id) return;

		try {
			const result = await updateCompanyDetails(user.company_id, {
				name: companyData.companyName,
				industry: companyData.industry,
				contact_email: companyData.contactEmail,
				contact_number: companyData.companyPhone,
				website: companyData.website,
				logo: companyData.logo,
				country: companyData.country,
				address: companyData.companyAddress,
				currency: companyData.currency,
			});

			if (result.error) {
				toast.error("Update Failed", {
					description: result.error,
				});
				return;
			}

			if (result.success && result.company) {
				toast.success("Company Updated", {
					description: "Your company details have been updated successfully.",
				});
				setIsEditing(false);
			}
		} catch (error) {
			toast.error("Error", {
				description: "An unexpected error occurred",
			});
		}
	};

	return (
		<Card>
			<CardHeader className="relative">
				<div className="flex items-center space-x-2">
					<Building2 className="h-5 w-5" />
					<CardTitle>Company Settings</CardTitle>
				</div>
				<CardDescription>
					Update your company&apos;s information and branding.
				</CardDescription>
				{!isEditing && (
					<Button
						className="absolute top-6 right-6"
						onClick={() => setIsEditing(true)}
					>
						<>
							<Edit className="mr-2 h-4 w-4" /> Edit
						</>
					</Button>
				)}
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<Separator />

					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="companyName" className="text-sm font-medium">
									Company Name
								</Label>
								<CardDescription className="text-xs">
									The legal name of your company.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="companyName"
									value={companyData.companyName}
									onChange={(e) =>
										setCompanyData({
											...companyData,
											companyName: e.target.value,
										})
									}
									placeholder="Your Company Name"
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="industry" className="text-sm font-medium">
									Industry
								</Label>
								<CardDescription className="text-xs">
									Your company&apos;s primary industry.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="industry"
									value={companyData.industry}
									onChange={(e) =>
										setCompanyData({
											...companyData,
											industry: e.target.value,
										})
									}
									placeholder="e.g., Technology, Healthcare"
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="companyAddress" className="text-sm font-medium">
									Company Address
								</Label>
								<CardDescription className="text-xs">
									The primary physical address of your company.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Textarea
									id="companyAddress"
									value={companyData.companyAddress}
									onChange={(e) =>
										setCompanyData({
											...companyData,
											companyAddress: e.target.value,
										})
									}
									placeholder="123 Main St, Anytown, USA"
									rows={3}
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="companyPhone" className="text-sm font-medium">
									Contact Number
								</Label>
								<CardDescription className="text-xs">
									The main contact number for your company.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="companyPhone"
									type="tel"
									value={companyData.companyPhone}
									onChange={(e) =>
										setCompanyData({
											...companyData,
											companyPhone: e.target.value,
										})
									}
									placeholder="+1 (555) 123-4567"
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="contactEmail" className="text-sm font-medium">
									Contact Email
								</Label>
								<CardDescription className="text-xs">
									The primary contact email for your company.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="contactEmail"
									type="email"
									value={companyData.contactEmail}
									onChange={(e) =>
										setCompanyData({
											...companyData,
											contactEmail: e.target.value,
										})
									}
									placeholder="contact@company.com"
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="website" className="text-sm font-medium">
									Website
								</Label>
								<CardDescription className="text-xs">
									Your company&apos;s official website URL.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="website"
									type="text"
									value={companyData.website}
									onChange={(e) => {
										let value = e.target.value;
										if (value && !value.match(/^https?:\/\//)) {
											value = `https://${value}`;
										}
										setCompanyData({ ...companyData, website: value });
									}}
									placeholder="www.yourcompany.com"
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="country" className="text-sm font-medium">
									Country
								</Label>
								<CardDescription className="text-xs">
									The country where your company is based.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="country"
									value={companyData.country}
									onChange={(e) =>
										setCompanyData({ ...companyData, country: e.target.value })
									}
									placeholder="e.g., United Kingdom"
									disabled={!isEditing}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="currency" className="text-sm font-medium">
									Default Currency
								</Label>
								<CardDescription className="text-xs">
									The default currency for company-wide transactions.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Select
									value={companyData.currency}
									onValueChange={(value) =>
										setCompanyData({ ...companyData, currency: value })
									}
									disabled={!isEditing}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{["USD", "EUR", "GBP", "CAD", "AUD", "JPY"].map(
											(currency: string) => (
												<SelectItem key={currency} value={currency}>
													{currency}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{isEditing && (
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsEditing(false)}>
								Cancel
							</Button>
							<Button type="submit">Save Company Settings</Button>
						</div>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
