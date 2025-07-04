"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Building2 } from "lucide-react";
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
import { toast } from "sonner";
import type { ClientData } from "@/lib/actions/client/client";
import { createClient } from "@/lib/actions/client/client";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { updateIndustryCompanies } from "@/lib/actions/industry/industry";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import React from "react";
import {
	CompanyLogoSection,
	ContactInformationSection,
	CompanyDetailsSection,
	IndustryTechnologySection,
	AddressSection,
	AdditionalSettingsSection,
} from "./create-client-dialogs";

interface CreateClientDialogProps {
	onCreate: (client: ClientData) => void;
}

// Memoized child components 
const MemoizedCompanyLogoSection = React.memo(CompanyLogoSection);
const MemoizedContactInformationSection = React.memo(ContactInformationSection);
const MemoizedCompanyDetailsSection = React.memo(CompanyDetailsSection);
const MemoizedIndustryTechnologySection = React.memo(IndustryTechnologySection);
const MemoizedAddressSection = React.memo(AddressSection);
const MemoizedAdditionalSettingsSection = React.memo(AdditionalSettingsSection);

export function CreateClientDialog({ onCreate }: CreateClientDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);
	const [availableIndustries, setAvailableIndustries] = useState<
		Array<{
			id: string;
			name: string;
			icon: React.ComponentType<{ className?: string }>;
		}>
	>([]);
	const [availableTechnologies, setAvailableTechnologies] = useState<
		Array<{
			id: string;
			name: string;
			icon: React.ComponentType<{ className?: string }>;
		}>
	>([]);

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


	useEffect(() => {
		if (open) {
			loadAvailableIndustries();
			loadAvailableTechnologies();
		}
	}, [open]);

	const loadAvailableIndustries = useCallback(async () => {
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
	}, []);

	const loadAvailableTechnologies = useCallback(async () => {
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
				icon: technology.icon
					? stringToIconComponent(technology.icon)
					: Building2,
			}));

			setAvailableTechnologies(technologies);
		} catch (error) {
			console.error("Error loading technologies:", error);
			toast.error("Failed to load available technologies");
		} finally {
			setIsLoadingTechnologies(false);
		}
	}, []);

	const toggleIndustrySelection = useCallback((industryId: string) => {
		setFormData((prev) => ({
			...prev,
			selectedIndustries: prev.selectedIndustries.includes(industryId)
				? prev.selectedIndustries.filter((id) => id !== industryId)
				: [...prev.selectedIndustries, industryId],
		}));
	}, []);

	const toggleTechnologySelection = useCallback((technologyId: string) => {
		setFormData((prev) => ({
			...prev,
			selectedTechnologies: prev.selectedTechnologies.includes(technologyId)
				? prev.selectedTechnologies.filter((id) => id !== technologyId)
				: [...prev.selectedTechnologies, technologyId],
		}));
	}, []);

	// Generate login email based on contact name and company
	const generateLoginEmail = useCallback(() => {
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
	}, [
		formData.mainContactFirstName,
		formData.mainContactLastName,
		formData.companyName,
	]);

	const loginEmail = useMemo(() => generateLoginEmail(), [generateLoginEmail]);

	const handleInputChange = useCallback((field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
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
				if (
					clientData.selectedIndustries &&
					clientData.selectedIndustries.length > 0
				) {
					const updateResult = await updateIndustryCompanies(
						clientData.selectedIndustries,
						result.clientId!
					);
					if (updateResult.error) {
						console.error(
							"Warning: Failed to update industries with new company:",
							updateResult.error
						);
						
					} else {
						toast.success(
							`Client created successfully! A user account has been created for ${clientData.mainContactFirstName} ${clientData.mainContactLastName} with login email: ${loginEmail}`
						);
					}
				} else {
					toast.success(
						`Client created successfully! A user account has been created for ${clientData.mainContactFirstName} ${clientData.mainContactLastName} with login email: ${loginEmail}`
					);
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
		},
		[formData, loginEmail, onCreate]
	);

	const resetForm = useCallback(() => {
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
	}, []);

	const isFormValid = useMemo(
		() =>
			formData.companyName.trim() &&
			formData.website.trim() &&
			formData.mainContactEmail.trim() &&
			formData.mainContactFirstName.trim() &&
			formData.mainContactLastName.trim(),
		[
			formData.companyName,
			formData.website,
			formData.mainContactEmail,
			formData.mainContactFirstName,
			formData.mainContactLastName,
		]
	);

	// Memoized form data objects
	const companyLogoFormData = useMemo(
		() => ({
			logo: formData.logo,
			companyName: formData.companyName,
			website: formData.website,
		}),
		[formData.logo, formData.companyName, formData.website]
	);

	const contactFormData = useMemo(
		() => ({
			mainContactFirstName: formData.mainContactFirstName,
			mainContactLastName: formData.mainContactLastName,
			mainContactEmail: formData.mainContactEmail,
			mainContactPhone: formData.mainContactPhone,
			techContactFirstName: formData.techContactFirstName,
			techContactLastName: formData.techContactLastName,
			techContactEmail: formData.techContactEmail,
			techContactPhone: formData.techContactPhone,
		}),
		[
			formData.mainContactFirstName,
			formData.mainContactLastName,
			formData.mainContactEmail,
			formData.mainContactPhone,
			formData.techContactFirstName,
			formData.techContactLastName,
			formData.techContactEmail,
			formData.techContactPhone,
		]
	);

	const companyDetailsFormData = useMemo(
		() => ({
			companyIndustry: formData.companyIndustry,
			companySize: formData.companySize,
		}),
		[formData.companyIndustry, formData.companySize]
	);

	const industryTechFormData = useMemo(
		() => ({
			selectedIndustries: formData.selectedIndustries,
			selectedTechnologies: formData.selectedTechnologies,
		}),
		[formData.selectedIndustries, formData.selectedTechnologies]
	);

	const addressFormData = useMemo(
		() => ({
			street: formData.street,
			city: formData.city,
			stateProvince: formData.stateProvince,
			zipcodePostalCode: formData.zipcodePostalCode,
			country: formData.country,
		}),
		[
			formData.street,
			formData.city,
			formData.stateProvince,
			formData.zipcodePostalCode,
			formData.country,
		]
	);

	const additionalSettingsFormData = useMemo(
		() => ({
			timezone: formData.timezone,
			clientStatus: formData.clientStatus,
			additionalNotes: formData.additionalNotes,
		}),
		[formData.timezone, formData.clientStatus, formData.additionalNotes]
	);

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
							<MemoizedCompanyLogoSection
								formData={companyLogoFormData}
								onInputChange={handleInputChange}
								loginEmail={loginEmail}
							/>

							{/* Contact Information */}
							<MemoizedContactInformationSection
								formData={contactFormData}
								onInputChange={handleInputChange}
							/>

							{/* Company Details */}
							<MemoizedCompanyDetailsSection
								formData={companyDetailsFormData}
								onInputChange={handleInputChange}
							/>

							{/* Industry and Technology Selection */}
							<MemoizedIndustryTechnologySection
								formData={industryTechFormData}
								availableIndustries={availableIndustries}
								availableTechnologies={availableTechnologies}
								isLoadingIndustries={isLoadingIndustries}
								isLoadingTechnologies={isLoadingTechnologies}
								onToggleIndustry={toggleIndustrySelection}
								onToggleTechnology={toggleTechnologySelection}
							/>

							{/* Address Information */}
							<MemoizedAddressSection
								formData={addressFormData}
								onInputChange={handleInputChange}
							/>

							{/* Additional Settings */}
							<MemoizedAdditionalSettingsSection
								formData={additionalSettingsFormData}
								onInputChange={handleInputChange}
							/>
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
