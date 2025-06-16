"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Card } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, CreditCard, User, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccountType } from "@/contexts/account-type-context-debug";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/actions/user/user";
import { getCompanyDetails } from "@/lib/actions/company/company";
import CompanySettingsTab from "./components/company-settings-tab";
import BillingInformationTab from "./components/billing-settings-tab";
import PersonalProfileTab from "./components/personal-settings-tab";
import { Separator } from "@/components/ui/separator";
import { CompanyData, PersonalData, BillingData } from "./components/types";



export default function AccountSettingsPage() {
	const { accountType } = useAccountType();
	const { user, updateUser } = useUser();
	const [companyName, setCompanyName] = useState<string>("");
	const [isEditingPersonal, setIsEditingPersonal] = useState(false);
	const [isEditingCompany, setIsEditingCompany] = useState(false);
	const [isEditingBilling, setIsEditingBilling] = useState(false);

	// Personal profile state
	const [personalData, setPersonalData] = useState<PersonalData>({
		first_name: "",
		last_name: "",
		email: "",
		timezone: "",
		currency: "",
		unit_system: "",
		profile_image: "",
		mobile_number: "",
		work_number: "",
		role: "",
	});

	// Company data state
	const [companyData, setCompanyData] = useState<CompanyData>({
		companyName: "",
		companyAddress: "",
		companyPhone: "",
		website: "",
		currency: "",
		logo: "",
		industry: "",
		contactEmail: "",
		country: "",
	});

	// Billing data state
	const [billingData, setBillingData] = useState<BillingData>({
		plan: "Professional",
		renewalDate: "2024-12-15",
		paymentMethod: "•••• •••• •••• 4242",
		billingEmail: "",
	});

	const timeZones = [
		"America/New_York",
		"America/Chicago",
		"America/Denver",
		"America/Los_Angeles",
		"Europe/London",
		"Europe/Paris",
		"Asia/Tokyo",
	];
	const unitSystems = ["metric", "imperial"];
	const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"];

	useEffect(() => {
		if (user) {
			setPersonalData({
				first_name: user.first_name || "",
				last_name: user.last_name || "",
				email: user.email || "",
				timezone: user.timezone || "",
				currency: user.currency || "",
				unit_system: user.unit_system || "",
				profile_image: user.profile_image || "",
				mobile_number: user.mobile_number || "",
				work_number: user.work_number || "",
				role: user.role || "",
			});

			const fetchCompanyDetails = async () => {
				if (user.company_id) {
					const result = await getCompanyDetails(user.company_id);
					if (result.success && result.company) {
						setCompanyName(result.company.name);
						setCompanyData({
							companyName: result.company.name || "",
							companyAddress: result.company.address || "",
							companyPhone: result.company.contact_number || "",
							website: result.company.website || "",
							logo: result.company.logo || "",
							industry: result.company.industry || "",
							contactEmail: result.company.contact_email || "",
							country: result.company.country || "",
							currency: result.company.currency || "",
						});
					}
				}
			};
			fetchCompanyDetails();
		}
	}, [user]);

	const handlePersonalSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const result = await updateUserProfile(user?._id || "", {
				first_name: personalData.first_name,
				last_name: personalData.last_name,
				email: personalData.email,
				timezone: personalData.timezone,
				currency: personalData.currency,
				unit_system: personalData.unit_system,
				profile_image: personalData.profile_image,
				mobile_number: personalData.mobile_number,
				work_number: personalData.work_number,
			});

			if (result.error) {
				toast.error("Update Failed", {
					description: result.error,
				});
				return;
			}

			if (result.success && result.user) {
				updateUser(result.user);
				toast.success("Profile Updated", {
					description: "Your profile has been updated successfully.",
				});
				setIsEditingPersonal(false);
			}
		} catch (error) {
			toast.error("Error", {
				description: "An unexpected error occurred",
			});
		}
	};

	//remove this in production
	// useEffect(() => {
	// 	if (user) {
	// 		setPersonalData({
	// 			first_name: user.first_name || "",
	// 			last_name: user.last_name || "",
	// 			email: user.email || "",
	// 			timezone: user.timezone || "",
	// 			currency: user.currency || "",
	// 			unit_system: user.unit_system || "",
	// 			profile_image: user.profile_image || "",
	// 			mobile_number: user.mobile_number || "",
	// 			work_number: user.work_number || "",
	// 			role: user.role || "",
	// 		});
	// 	}
	// }, [accountType, user]);

	const handleCompanySubmit = (e: FormEvent) => {
		e.preventDefault();
		setIsEditingCompany(false);
	};

	const handleBillingSubmit = (e: FormEvent) => {
		e.preventDefault();
		setIsEditingBilling(false);
	};

	

	return (
		<div className="space-y-6">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Header */}
				<div className="space-y-2 mt-6">
					<h1 className="text-3xl font-bold tracking-tight">
						Account Settings
					</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences.
					</p>
					{/* Profile Card */}
					<Card className="p-6 ">
						<div className="flex flex-col space-y-6 md:flex-row md:items-center md:space-x-6 md:space-y-0">
							<div className="relative">
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
							</div>
							<div className="flex flex-1 flex-col space-y-4">
								<div className="space-y-1">
									<h2 className="text-2xl font-semibold tracking-tight">
										{personalData.first_name} {personalData.last_name}
									</h2>
									<p className="text-sm text-muted-foreground">
										{companyName || "No company assigned"}
									</p>
									<p className="text-sm text-muted-foreground">
										{personalData.email}
									</p>
								</div>
								<div className="flex flex-wrap gap-4">
									<div className="flex items-center space-x-2">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">
											{personalData.mobile_number || "No mobile number"}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<Building2 className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">
											{personalData.work_number || "No work number"}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
				<Separator />

				{personalData.role === "super-admin" ? (
					<Tabs defaultValue="personal">
						<TabsList className="grid w-auto grid-cols-3 h-12">
							<TabsTrigger
								value="personal"
								className="flex items-center gap-2"
								onClick={() => {
									setIsEditingPersonal(false);
									setIsEditingCompany(false);
									setIsEditingBilling(false);
								}}
							>
								<User className="h-4 w-4" />
								Personal Profile
							</TabsTrigger>
							<TabsTrigger value="company" className="flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								Company Settings
							</TabsTrigger>
							<TabsTrigger value="billing" className="flex items-center gap-2">
								<CreditCard className="h-4 w-4" />
								Billing Information
							</TabsTrigger>
						</TabsList>

						<TabsContent value="personal">
							<PersonalProfileTab
								personalData={personalData}
								setPersonalData={setPersonalData}
								handlePersonalSubmit={handlePersonalSubmit}
								timeZones={timeZones}
								currencies={currencies}
								unitSystems={unitSystems}
								isEditing={isEditingPersonal}
								setIsEditing={setIsEditingPersonal}
							/>
						</TabsContent>

						<TabsContent value="company">
							<CompanySettingsTab
								companyData={companyData}
								setCompanyData={setCompanyData}
								handleCompanySubmit={handleCompanySubmit}
								isEditing={isEditingCompany}
								setIsEditing={setIsEditingCompany}
							/>
						</TabsContent>

						<TabsContent value="billing">
							<BillingInformationTab
								billingData={billingData}
								setBillingData={setBillingData}
								handleBillingSubmit={handleBillingSubmit}
								isEditing={isEditingBilling}
								setIsEditing={setIsEditingBilling}
							/>
						</TabsContent>
					</Tabs>
				) : (
					<PersonalProfileTab
						personalData={personalData}
						setPersonalData={setPersonalData}
						handlePersonalSubmit={handlePersonalSubmit}
						timeZones={timeZones}
						currencies={currencies}
						unitSystems={unitSystems}
						isEditing={isEditingPersonal}
						setIsEditing={setIsEditingPersonal}
					/>
				)}
			</div>
		</div>
	);
}
