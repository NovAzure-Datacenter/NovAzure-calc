"use client";

import { useState, useEffect } from "react";
import {
	Plus,
	X,
	Building2,
	ChevronDown,
	Zap,
	Wind,
	Droplets,
	Server,
	Wrench,
	Recycle,
	Car,
	Fuel,
	Chrome,
	Shell,
	Home,
	Factory,
	Hospital,
	Sprout,
	Building,
	ShoppingBag,
	Ship,
	Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import type { ClientData } from "@/lib/actions/client/client";
import { createClient } from "@/lib/actions/client/client";
import { iconOptions, iconComponentToString, stringToIconComponent } from "@/lib/icons/lucide-icons";
import { countryOptions } from "@/lib/constants/country-options";
import React from "react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { updateIndustryCompanies } from "@/lib/actions/industry/industry";

interface CreateClientDialogProps {
	onCreate: (client: ClientData) => void;
}

// Custom PhoneInput wrapper with Tailwind styling
function PhoneInputWrapper({ value, onChange, placeholder, ...props }: any) {
	return (
		<div className="relative">
			<PhoneInput
				{...props}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="flex items-center border border-input bg-background text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md h-8 [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:gap-1 [&_.PhoneInputCountry]:px-2 [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountrySelect]:text-xs [&_.PhoneInputCountrySelect]:font-medium [&_.PhoneInputCountrySelect]:text-foreground [&_.PhoneInputCountrySelectArrow]:text-muted-foreground [&_.PhoneInputCountrySelectArrow]:ml-1 [&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-8 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:px-2 [&_.PhoneInputInput]:text-xs [&_.PhoneInputInput]:ring-offset-background [&_.PhoneInputInput]:placeholder:text-muted-foreground [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputInput]:focus-visible:ring-0 [&_.PhoneInputInput]:focus-visible:ring-offset-0 [&_.PhoneInputInput]:disabled:cursor-not-allowed [&_.PhoneInputInput]:disabled:opacity-50 [&_.PhoneInputCountryFlag]:w-4 [&_.PhoneInputCountryFlag]:h-4 [&_.PhoneInputCountryIcon]:w-4 [&_.PhoneInputCountryIcon]:h-4"
			/>
		</div>
	);
}

const companySizeOptions = [
	{ value: "1-10", label: "1-10 employees" },
	{ value: "11-50", label: "11-50 employees" },
	{ value: "51-100", label: "51-100 employees" },
	{ value: "101-250", label: "101-250 employees" },
	{ value: "251-500", label: "251-500 employees" },
	{ value: "500+", label: "500+ employees" },
];

const clientStatusOptions = [
	{ value: "active", label: "Active" },
	{ value: "prospect", label: "Prospect" },
	{ value: "on-hold", label: "On Hold" },
	{ value: "inactive", label: "Inactive" },
];

const timezoneOptions = [
	{ value: "UTC", label: "UTC" },
	{ value: "EST", label: "Eastern Standard Time" },
	{ value: "CST", label: "Central Standard Time" },
	{ value: "MST", label: "Mountain Standard Time" },
	{ value: "PST", label: "Pacific Standard Time" },
	{ value: "GMT", label: "Greenwich Mean Time" },
	{ value: "CET", label: "Central European Time" },
	{ value: "EET", label: "Eastern European Time" },
	{ value: "JST", label: "Japan Standard Time" },
	{ value: "AEST", label: "Australian Eastern Standard Time" },
];

export function CreateClientDialog({ onCreate }: CreateClientDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [countrySearch, setCountrySearch] = useState("");
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);
	const [availableIndustries, setAvailableIndustries] = useState<Array<{ id: string; name: string; icon: React.ComponentType<{ className?: string }> }>>([]);
	const [availableTechnologies, setAvailableTechnologies] = useState<Array<{ id: string; name: string; icon: React.ComponentType<{ className?: string }> }>>([]);

	// Form data
	const [formData, setFormData] = useState({
		// Mandatory fields
		logo: "Building2" as string,
		companyName: "",
		website: "",

		// Contact Information
		mainContactFirstName: "",
		mainContactLastName: "",
		mainContactEmail: "",
		mainContactPhone: "",
		techContactFirstName: "",
		techContactLastName: "",
		techContactEmail: "",
		techContactPhone: "",

		// Optional fields
		companyIndustry: "",
		companySize: "",
		street: "",
		city: "",
		stateProvince: "",
		zipcodePostalCode: "",
		country: "",
		timezone: "",
		clientStatus: "prospect" as string,
		additionalNotes: "",
		selectedIndustries: [] as string[],
		selectedTechnologies: [] as string[],
	});

	// Filter countries based on search
	const filteredCountries = countryOptions.filter((country) =>
		country.label.toLowerCase().includes(countrySearch.toLowerCase())
	);

	// Load industries and technologies when dialog opens
	useEffect(() => {
		if (open) {
			loadAvailableIndustries();
			loadAvailableTechnologies();
		}
	}, [open]);

	const loadAvailableIndustries = async () => {
		try {
			setIsLoadingIndustries(true);
			const result = await getIndustries();

			if (result.error) {
				toast.error(result.error);
				return;
			}

			const industries = (result.industries || []).map((industry) => ({
				id: industry.id,
				name: industry.name,
				icon: industry.icon ? stringToIconComponent(industry.icon) : Building2,
			}));

			setAvailableIndustries(industries);
		} catch (error) {
			console.error("Error loading industries:", error);
			toast.error("Failed to load available industries");
		} finally {
			setIsLoadingIndustries(false);
		}
	};

	const loadAvailableTechnologies = async () => {
		try {
			setIsLoadingTechnologies(true);
			const result = await getTechnologies();

			if (result.error) {
				toast.error(result.error);
				return;
			}

			const technologies = (result.technologies || []).map((technology) => ({
				id: technology.id,
				name: technology.name,
				icon: technology.icon ? stringToIconComponent(technology.icon) : Building2,
			}));

			setAvailableTechnologies(technologies);
		} catch (error) {
			console.error("Error loading technologies:", error);
			toast.error("Failed to load available technologies");
		} finally {
			setIsLoadingTechnologies(false);
		}
	};

	const toggleIndustrySelection = (industryId: string) => {
		setFormData(prev => ({
			...prev,
			selectedIndustries: prev.selectedIndustries.includes(industryId)
				? prev.selectedIndustries.filter(id => id !== industryId)
				: [...prev.selectedIndustries, industryId]
		}));
	};

	const toggleTechnologySelection = (technologyId: string) => {
		setFormData(prev => ({
			...prev,
			selectedTechnologies: prev.selectedTechnologies.includes(technologyId)
				? prev.selectedTechnologies.filter(id => id !== technologyId)
				: [...prev.selectedTechnologies, technologyId]
		}));
	};

	// Generate login email based on contact name and company
	const generateLoginEmail = () => {
		const firstName = formData.mainContactFirstName.trim();
		const lastName = formData.mainContactLastName.trim();
		const companyName = formData.companyName.trim();

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

	const loginEmail = generateLoginEmail();

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleIconChange = (iconName: string) => {
		setFormData((prev) => ({ ...prev, logo: iconName }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.companyName.trim() ||
			!formData.website.trim() ||
			!formData.mainContactEmail.trim() ||
			!formData.mainContactFirstName.trim() ||
			!formData.mainContactLastName.trim()
		) {
			toast.error("Please fill in all mandatory fields");
			return;
		}

		setIsSubmitting(true);

		try {
			const clientData = {
				logo: formData.logo,
				companyName: formData.companyName.trim(),
				website: formData.website.trim(),
				mainContactEmail: formData.mainContactEmail.trim(),
				mainContactFirstName: formData.mainContactFirstName.trim(),
				mainContactLastName: formData.mainContactLastName.trim(),
				mainContactPhone: formData.mainContactPhone,
				techContactFirstName: formData.techContactFirstName,
				techContactLastName: formData.techContactLastName,
				techContactEmail: formData.techContactEmail,
				techContactPhone: formData.techContactPhone,
				companyIndustry: formData.companyIndustry,
				companySize: formData.companySize,
				street: formData.street,
				city: formData.city,
				stateProvince: formData.stateProvince,
				zipcodePostalCode: formData.zipcodePostalCode,
				country: formData.country,
				timezone: formData.timezone,
				clientStatus: formData.clientStatus,
				additionalNotes: formData.additionalNotes,
				selectedIndustries: formData.selectedIndustries,
				selectedTechnologies: formData.selectedTechnologies,
				userCount: 0,
				productCount: 0,
				productPendingCount: 0,
				scenarioCount: 0,
			};

			const result = await createClient(clientData);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			// Create the client object for the callback
			const newClient: ClientData = {
				id: result.clientId!,
				...clientData,
			};

			// Update industries with the new company ID if any industries were selected
			if (clientData.selectedIndustries && clientData.selectedIndustries.length > 0) {
				const updateResult = await updateIndustryCompanies(clientData.selectedIndustries, result.clientId!);
				if (updateResult.error) {
					console.error("Warning: Failed to update industries with new company:", updateResult.error);
					// Don't fail the entire operation, just log the warning
				} else {
					toast.success(`Client created and added to ${clientData.selectedIndustries.length} industry(s)!`);
				}
			} else {
				toast.success("Client created successfully!");
			}

			onCreate(newClient);
			setOpen(false);
			resetForm();
		} catch (error) {
			console.error("Error creating client:", error);
			toast.error("Failed to create client. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({
			logo: "Building2",
			companyName: "",
			website: "",
			mainContactFirstName: "",
			mainContactLastName: "",
			mainContactEmail: "",
			mainContactPhone: "",
			techContactFirstName: "",
			techContactLastName: "",
			techContactEmail: "",
			techContactPhone: "",
			companyIndustry: "",
			companySize: "",
			street: "",
			city: "",
			stateProvince: "",
			zipcodePostalCode: "",
			country: "",
			timezone: "",
			clientStatus: "prospect",
			additionalNotes: "",
			selectedIndustries: [],
			selectedTechnologies: [],
		});
		setCountrySearch("");
	};

	const isFormValid =
		formData.companyName.trim() &&
		formData.website.trim() &&
		formData.mainContactEmail.trim() &&
		formData.mainContactFirstName.trim() &&
		formData.mainContactLastName.trim();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="text-xs">
					<Plus className="h-4 w-4 mr-2" />
					New Client
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
				<DialogHeader className="pb-4 px-6 pt-6">
					<DialogTitle className="text-lg">Create New Client</DialogTitle>
					<DialogDescription className="text-sm">
						Add a new client with their contact information and company details.
					</DialogDescription>
				</DialogHeader>
				
				<div className="flex-1 overflow-y-auto px-6">
					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="space-y-8">
							{/* Company Logo and Basic Information */}
							<div className="space-y-4">
								<div>
									<Label className="text-xs font-medium">Company Logo</Label>
									<div className="flex items-center gap-2 mt-1">
										<div className="flex items-center justify-center w-8 h-8 border rounded-md bg-gray-50">
											{React.createElement(
												iconOptions.find((opt) => opt.value === formData.logo)
													?.icon || Building2,
												{ className: "h-4 w-4 text-gray-600" }
											)}
										</div>
										<Select
											onValueChange={handleIconChange}
											value={formData.logo}
										>
											<SelectTrigger className="text-xs h-8 flex-1">
												<SelectValue placeholder="Select an icon" />
											</SelectTrigger>
											<SelectContent>
												{iconOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														<div className="flex items-center gap-2">
															<option.icon className="h-4 w-4" />
															<span>{option.label}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Mandatory Fields */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="companyName" className="text-xs font-medium">
											Company Name <span className="text-red-500">*</span>
										</Label>
										<Input
											id="companyName"
											value={formData.companyName}
											onChange={(e) =>
												handleInputChange("companyName", e.target.value)
											}
											placeholder="Enter company name..."
											className="text-xs h-8"
											required
										/>
									</div>
									<div>
										<Label htmlFor="website" className="text-xs font-medium">
											Website <span className="text-red-500">*</span>
										</Label>
										<Input
											id="website"
											value={formData.website}
											onChange={(e) =>
												handleInputChange("website", e.target.value)
											}
											placeholder="https://www.example.com"
											className="text-xs h-8"
											required
										/>
									</div>
								</div>

								{/* Login Email Display */}
								{loginEmail && (
									<div>
										<Label className="text-xs font-medium text-gray-600">
											Client Login Email
										</Label>
										<div className="flex items-center gap-2 mt-1">
											<Input
												value={loginEmail}
												readOnly
												className="text-xs h-8 bg-gray-50 text-gray-700 cursor-not-allowed"
											/>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="text-xs h-8 px-2"
												onClick={() => {
													navigator.clipboard.writeText(loginEmail);
													toast.success("Login email copied to clipboard!");
												}}
											>
												Copy
											</Button>
										</div>
										<p className="text-xs text-gray-500 mt-1">
											This email will be used for client login access
										</p>
									</div>
								)}
							</div>

							{/* Contact Information */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium text-gray-700">
									Contact Information
								</h3>

								{/* Main Contact */}
								<div className="space-y-3">
									<h4 className="text-xs font-medium text-gray-600">
										Main Contact
									</h4>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label
												htmlFor="mainContactFirstName"
												className="text-xs font-medium"
											>
												First Name <span className="text-red-500">*</span>
											</Label>
											<Input
												id="mainContactFirstName"
												value={formData.mainContactFirstName}
												onChange={(e) =>
													handleInputChange(
														"mainContactFirstName",
														e.target.value
													)
												}
												placeholder="First name"
												className="text-xs h-8"
												required
											/>
										</div>
										<div>
											<Label
												htmlFor="mainContactLastName"
												className="text-xs font-medium"
											>
												Last Name <span className="text-red-500">*</span>
											</Label>
											<Input
												id="mainContactLastName"
												value={formData.mainContactLastName}
												onChange={(e) =>
													handleInputChange("mainContactLastName", e.target.value)
												}
												placeholder="Last name"
												className="text-xs h-8"
												required
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label
												htmlFor="mainContactEmail"
												className="text-xs font-medium"
											>
												Email <span className="text-red-500">*</span>
											</Label>
											<Input
												id="mainContactEmail"
												value={formData.mainContactEmail}
												onChange={(e) =>
													handleInputChange("mainContactEmail", e.target.value)
												}
												placeholder="contact@company.com"
												className="text-xs h-8"
												type="email"
												required
											/>
										</div>
										<div>
											<Label
												htmlFor="mainContactPhone"
												className="text-xs font-medium"
											>
												Phone
											</Label>
											<PhoneInputWrapper
												international
												defaultCountry="US"
												value={formData.mainContactPhone}
												onChange={(value: string) =>
													handleInputChange("mainContactPhone", value || "")
												}
												placeholder="Enter phone number"
											/>
										</div>
									</div>
								</div>

								{/* Tech Contact */}
								<div className="space-y-3">
									<h4 className="text-xs font-medium text-gray-600">
										Technical Contact
									</h4>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label
												htmlFor="techContactFirstName"
												className="text-xs font-medium"
											>
												First Name
											</Label>
											<Input
												id="techContactFirstName"
												value={formData.techContactFirstName}
												onChange={(e) =>
													handleInputChange(
														"techContactFirstName",
														e.target.value
													)
												}
												placeholder="First name"
												className="text-xs h-8"
											/>
										</div>
										<div>
											<Label
												htmlFor="techContactLastName"
												className="text-xs font-medium"
											>
												Last Name
											</Label>
											<Input
												id="techContactLastName"
												value={formData.techContactLastName}
												onChange={(e) =>
													handleInputChange("techContactLastName", e.target.value)
												}
												placeholder="Last name"
												className="text-xs h-8"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label
												htmlFor="techContactEmail"
												className="text-xs font-medium"
											>
												Email
											</Label>
											<Input
												id="techContactEmail"
												value={formData.techContactEmail}
												onChange={(e) =>
													handleInputChange("techContactEmail", e.target.value)
												}
												placeholder="tech@company.com"
												className="text-xs h-8"
												type="email"
											/>
										</div>
										<div>
											<Label
												htmlFor="techContactPhone"
												className="text-xs font-medium"
											>
												Phone
											</Label>
											<PhoneInputWrapper
												international
												defaultCountry="US"
												value={formData.techContactPhone}
												onChange={(value: string) =>
													handleInputChange("techContactPhone", value || "")
												}
												placeholder="Enter phone number"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Company Details */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium text-gray-700">
									Company Details
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label
											htmlFor="companyIndustry"
											className="text-xs font-medium"
										>
											Company Industry
										</Label>
										<Input
											id="companyIndustry"
											value={formData.companyIndustry}
											onChange={(e) =>
												handleInputChange("companyIndustry", e.target.value)
											}
											placeholder="e.g., Technology, Healthcare"
											className="text-xs h-8"
										/>
									</div>
									<div>
										<Label htmlFor="companySize" className="text-xs font-medium">
											Company Size
										</Label>
										<Select
											value={formData.companySize}
											onValueChange={(value) =>
												handleInputChange("companySize", value)
											}
										>
											<SelectTrigger className="text-xs h-8">
												<SelectValue placeholder="Select company size" />
											</SelectTrigger>
											<SelectContent>
												{companySizeOptions.map((option) => (
													<SelectItem key={option.value} value={option.value} className="text-xs">
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Industry and Technology Selection */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium text-gray-700">
									Industry & Technology Focus
								</h3>
								
								{/* Industries Selection */}
								<div>
									<Label className="text-xs font-medium">Applicable Industries</Label>
									<div className="space-y-2 mt-1">
										<Collapsible>
											<CollapsibleTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-between h-8 text-xs"
													disabled={isLoadingIndustries}
												>
													<span>
														{isLoadingIndustries
															? "Loading industries..."
															: `Select Industries (${formData.selectedIndustries.length} selected)`}
													</span>
													<ChevronDown className="h-3 w-3" />
												</Button>
											</CollapsibleTrigger>
											<CollapsibleContent className="mt-1">
												<div className="border rounded-md p-2 bg-gray-50">
													{isLoadingIndustries ? (
														<div className="flex items-center justify-center py-4">
															<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
															<span className="ml-2 text-xs text-muted-foreground">
																Loading industries...
															</span>
														</div>
													) : (
														<div className="grid grid-cols-2 gap-1 max-h-[150px] overflow-y-auto">
															{availableIndustries.map((industry) => {
																const isSelected = formData.selectedIndustries.includes(industry.id);
																return (
																	<div
																		key={industry.id}
																		className="flex items-center space-x-2 p-1 rounded hover:bg-white"
																	>
																		<Checkbox
																			id={`industry-${industry.id}`}
																			checked={isSelected}
																			onCheckedChange={() => toggleIndustrySelection(industry.id)}
																			className="h-3 w-3"
																		/>
																		<label
																			htmlFor={`industry-${industry.id}`}
																			className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
																		>
																			<div className="flex items-center gap-1">
																				<industry.icon className="h-3 w-3" />
																				<span className="truncate">
																					{industry.name}
																				</span>
																			</div>
																		</label>
																	</div>
																);
															})}
														</div>
													)}
												</div>
											</CollapsibleContent>
										</Collapsible>

										{/* Selected industries display */}
										{formData.selectedIndustries.length > 0 && (
											<div className="space-y-1">
												<div className="text-xs font-medium text-gray-700">
													Selected Industries:
												</div>
												<div className="flex flex-wrap gap-1">
													{formData.selectedIndustries.map((industryId) => {
														const industry = availableIndustries.find(
															(i) => i.id === industryId
														);
														return (
															<Badge
																key={industryId}
																variant="secondary"
																className="flex items-center gap-1 text-xs px-2 py-1"
															>
																{industry?.icon && <industry.icon className="h-3 w-3" />}
																<span className="truncate max-w-[100px]">
																	{industry?.name || industryId}
																</span>
																<button
																	type="button"
																	onClick={() => toggleIndustrySelection(industryId)}
																	className="ml-1 hover:text-destructive"
																>
																	<X className="h-3 w-3" />
																</button>
															</Badge>
														);
													})}
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Technologies Selection */}
								<div>
									<Label className="text-xs font-medium">Applicable Technologies</Label>
									<div className="space-y-2 mt-1">
										<Collapsible>
											<CollapsibleTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-between h-8 text-xs"
													disabled={isLoadingTechnologies}
												>
													<span>
														{isLoadingTechnologies
															? "Loading technologies..."
															: `Select Technologies (${formData.selectedTechnologies.length} selected)`}
													</span>
													<ChevronDown className="h-3 w-3" />
												</Button>
											</CollapsibleTrigger>
											<CollapsibleContent className="mt-1">
												<div className="border rounded-md p-2 bg-gray-50">
													{isLoadingTechnologies ? (
														<div className="flex items-center justify-center py-4">
															<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
															<span className="ml-2 text-xs text-muted-foreground">
																Loading technologies...
															</span>
														</div>
													) : (
														<div className="grid grid-cols-2 gap-1 max-h-[150px] overflow-y-auto">
															{availableTechnologies.map((technology) => {
																const isSelected = formData.selectedTechnologies.includes(technology.id);
																return (
																	<div
																		key={technology.id}
																		className="flex items-center space-x-2 p-1 rounded hover:bg-white"
																	>
																		<Checkbox
																			id={`technology-${technology.id}`}
																			checked={isSelected}
																			onCheckedChange={() => toggleTechnologySelection(technology.id)}
																			className="h-3 w-3"
																		/>
																		<label
																			htmlFor={`technology-${technology.id}`}
																			className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
																		>
																			<div className="flex items-center gap-1">
																				<technology.icon className="h-3 w-3" />
																				<span className="truncate">
																					{technology.name}
																				</span>
																			</div>
																		</label>
																	</div>
																);
															})}
														</div>
													)}
												</div>
											</CollapsibleContent>
										</Collapsible>

										{/* Selected technologies display */}
										{formData.selectedTechnologies.length > 0 && (
											<div className="space-y-1">
												<div className="text-xs font-medium text-gray-700">
													Selected Technologies:
												</div>
												<div className="flex flex-wrap gap-1">
													{formData.selectedTechnologies.map((technologyId) => {
														const technology = availableTechnologies.find(
															(t) => t.id === technologyId
														);
														return (
															<Badge
																key={technologyId}
																variant="secondary"
																className="flex items-center gap-1 text-xs px-2 py-1"
															>
																{technology?.icon && <technology.icon className="h-3 w-3" />}
																<span className="truncate max-w-[100px]">
																	{technology?.name || technologyId}
																</span>
																<button
																	type="button"
																	onClick={() => toggleTechnologySelection(technologyId)}
																	className="ml-1 hover:text-destructive"
																>
																	<X className="h-3 w-3" />
																</button>
															</Badge>
														);
													})}
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Address Information */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium text-gray-700">
									Address Information
								</h3>
								<div>
									<Label htmlFor="street" className="text-xs font-medium">
										Street Address
									</Label>
									<Input
										id="street"
										value={formData.street}
										onChange={(e) => handleInputChange("street", e.target.value)}
										placeholder="123 Main Street"
										className="text-xs h-8"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="city" className="text-xs font-medium">
											City
										</Label>
										<Input
											id="city"
											value={formData.city}
											onChange={(e) => handleInputChange("city", e.target.value)}
											placeholder="City"
											className="text-xs h-8"
										/>
									</div>
									<div>
										<Label
											htmlFor="stateProvince"
											className="text-xs font-medium"
										>
											State/Province
										</Label>
										<Input
											id="stateProvince"
											value={formData.stateProvince}
											onChange={(e) =>
												handleInputChange("stateProvince", e.target.value)
											}
											placeholder="State/Province"
											className="text-xs h-8"
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label
											htmlFor="zipcodePostalCode"
											className="text-xs font-medium"
										>
											ZIP/Postal Code
										</Label>
										<Input
											id="zipcodePostalCode"
											value={formData.zipcodePostalCode}
											onChange={(e) =>
												handleInputChange("zipcodePostalCode", e.target.value)
											}
											placeholder="12345"
											className="text-xs h-8"
										/>
									</div>
									<div>
										<Label htmlFor="country" className="text-xs font-medium">
											Country
										</Label>
										<Select
											value={formData.country}
											onValueChange={(value) =>
												handleInputChange("country", value)
											}
										>
											<SelectTrigger className="text-xs h-8">
												<SelectValue placeholder="Select country" />
											</SelectTrigger>
											<SelectContent className="max-h-[300px]">
												<div className="flex items-center px-3 py-2 border-b">
													<Search className="h-4 w-4 text-muted-foreground mr-2" />
													<input
														placeholder="Search countries..."
														value={countrySearch}
														onChange={(e) => setCountrySearch(e.target.value)}
														className="flex-1 bg-transparent border-none outline-none text-xs placeholder:text-muted-foreground"
														onClick={(e) => e.stopPropagation()}
													/>
												</div>
												<div className="max-h-[250px] overflow-y-auto">
													{filteredCountries.length > 0 ? (
														filteredCountries.map((option) => (
															<SelectItem key={option.value} value={option.value} className="text-xs">
																{option.label}
															</SelectItem>
														))
													) : (
														<div className="px-3 py-2 text-xs text-muted-foreground">
															No countries found
														</div>
													)}
												</div>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Additional Settings */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium text-gray-700">
									Additional Settings
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="timezone" className="text-xs font-medium">
											Timezone
										</Label>
										<Select
											value={formData.timezone}
											onValueChange={(value) =>
												handleInputChange("timezone", value)
											}
										>
											<SelectTrigger className="text-xs h-8">
												<SelectValue placeholder="Select timezone" />
											</SelectTrigger>
											<SelectContent>
												{timezoneOptions.map((option) => (
													<SelectItem key={option.value} value={option.value} className="text-xs">
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor="clientStatus" className="text-xs font-medium">
											Client Status
										</Label>
										<Select
											value={formData.clientStatus}
											onValueChange={(value) =>
												handleInputChange("clientStatus", value)
											}
										>
											<SelectTrigger className="text-xs h-8">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{clientStatusOptions.map((option) => (
													<SelectItem key={option.value} value={option.value} className="text-xs">
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Additional Notes */}
							<div>
								<Label htmlFor="additionalNotes" className="text-xs font-medium">
									Additional Notes
								</Label>
								<Textarea
									id="additionalNotes"
									value={formData.additionalNotes}
									onChange={(e) =>
										handleInputChange("additionalNotes", e.target.value)
									}
									placeholder="Any additional information about the client..."
									rows={3}
									className="text-xs"
								/>
							</div>
						</div>
					</form>
				</div>
				
				<DialogFooter className="px-6 py-4 border-t bg-background">
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(false)}
						className="text-xs h-8"
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={!isFormValid || isSubmitting}
						className="text-xs h-8"
						onClick={handleSubmit}
					>
						{isSubmitting ? "Creating..." : "Create Client"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
