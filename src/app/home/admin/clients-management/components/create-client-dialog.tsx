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
import type { ClientData } from "@/lib/actions/clients/clients";
import { createClient } from "@/lib/actions/clients/clients";
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
		company_name: "",
		website: "",

		// Contact Information
		main_contact_first_name: "",
		main_contact_last_name: "",
		main_contact_email: "",
		main_contact_phone: "",
		tech_contact_first_name: "",
		tech_contact_last_name: "",
		tech_contact_email: "",
		tech_contact_phone: "",

		// Optional fields
		company_industry: "",
		company_size: "",
		street: "",
		city: "",
		state_province: "",
		zipcode_postal_code: "",
		country: "",
		timezone: "",
		client_status: "prospect" as string,
		additional_notes: "",
		selected_industries: [] as string[],
		selected_technologies: [] as string[],
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
			selected_industries: prev.selected_industries.includes(industryId)
				? prev.selected_industries.filter((id) => id !== industryId)
				: [...prev.selected_industries, industryId],
		}));
	}, []);

	const toggleTechnologySelection = useCallback((technologyId: string) => {
		setFormData((prev) => ({
			...prev,
			selected_technologies: prev.selected_technologies.includes(technologyId)
				? prev.selected_technologies.filter((id) => id !== technologyId)
				: [...prev.selected_technologies, technologyId],
		}));
	}, []);

	const handleInputChange = useCallback((field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (
				!formData.company_name.trim() ||
				!formData.website.trim() ||
				!formData.main_contact_email.trim() ||
				!formData.main_contact_first_name.trim() ||
				!formData.main_contact_last_name.trim()
			) {
				toast.error("Please fill in all mandatory fields");
				return;
			}

			setIsSubmitting(true);

			try {
				const clientData = {
					logo: formData.logo,
					company_name: formData.company_name.trim(),
					website: formData.website.trim(),
					main_contact_email: formData.main_contact_email.trim(),
					main_contact_first_name: formData.main_contact_first_name.trim(),
					main_contact_last_name: formData.main_contact_last_name.trim(),
					main_contact_phone: formData.main_contact_phone,
					tech_contact_first_name: formData.tech_contact_first_name,
					tech_contact_last_name: formData.tech_contact_last_name,
					tech_contact_email: formData.tech_contact_email,
					tech_contact_phone: formData.tech_contact_phone,
					company_industry: formData.company_industry,
					company_size: formData.company_size,
					street: formData.street,
					city: formData.city,
					state_province: formData.state_province,
					zipcode_postal_code: formData.zipcode_postal_code,
					country: formData.country,
					timezone: formData.timezone,
					client_status: formData.client_status,
					additional_notes: formData.additional_notes,
					selected_industries: formData.selected_industries,
					selected_technologies: formData.selected_technologies,
					user_count: 0,
					product_count: 0,
					product_pending_count: 0,
					scenario_count: 0,
					login_email: "", 
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
					login_email: result.loginEmail!, // Use the login email from the backend response
				};

				// Update industries with the new company ID if any industries were selected
				if (
					clientData.selected_industries &&
					clientData.selected_industries.length > 0
				) {
					const updateResult = await updateIndustryCompanies(
						clientData.selected_industries,
						result.clientId!
					);
					if (updateResult.error) {
						console.error(
							"Warning: Failed to update industries with new company:",
							updateResult.error
						);
						
					} else {
						toast.success(
							`Client created successfully! A user account has been created for ${clientData.main_contact_first_name} ${clientData.main_contact_last_name} with login email: ${newClient.login_email}`
						);
					}
				} else {
					toast.success(
						`Client created successfully! A user account has been created for ${clientData.main_contact_first_name} ${clientData.main_contact_last_name} with login email: ${newClient.login_email}`
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
		[formData, onCreate]
	);

	const resetForm = useCallback(() => {
		setFormData({
			logo: "Building2",
			company_name: "",
			website: "",
			main_contact_first_name: "",
			main_contact_last_name: "",
			main_contact_email: "",
			main_contact_phone: "",
			tech_contact_first_name: "",
			tech_contact_last_name: "",
			tech_contact_email: "",
			tech_contact_phone: "",
			company_industry: "",
			company_size: "",
			street: "",
			city: "",
			state_province: "",
			zipcode_postal_code: "",
			country: "",
			timezone: "",
			client_status: "prospect",
			additional_notes: "",
			selected_industries: [],
			selected_technologies: [],
		});
	}, []);

	const isFormValid = useMemo(
		() =>
			formData.company_name.trim() &&
			formData.website.trim() &&
			formData.main_contact_email.trim() &&
			formData.main_contact_first_name.trim() &&
			formData.main_contact_last_name.trim(),
		[
			formData.company_name,
			formData.website,
			formData.main_contact_email,
			formData.main_contact_first_name,
			formData.main_contact_last_name,
		]
	);

	// Memoized form data objects
	const companyLogoFormData = useMemo(
		() => ({
			logo: formData.logo,
			company_name: formData.company_name,
			website: formData.website,
			main_contact_first_name: formData.main_contact_first_name,
			main_contact_last_name: formData.main_contact_last_name,
		}),
		[formData.logo, formData.company_name, formData.website, formData.main_contact_first_name, formData.main_contact_last_name]
	);

	const contactFormData = useMemo(
		() => ({
			main_contact_first_name: formData.main_contact_first_name,
			main_contact_last_name: formData.main_contact_last_name,
			main_contact_email: formData.main_contact_email,
			main_contact_phone: formData.main_contact_phone,
			tech_contact_first_name: formData.tech_contact_first_name,
			tech_contact_last_name: formData.tech_contact_last_name,
			tech_contact_email: formData.tech_contact_email,
			tech_contact_phone: formData.tech_contact_phone,
		}),
		[
			formData.main_contact_first_name,
			formData.main_contact_last_name,
			formData.main_contact_email,
			formData.main_contact_phone,
			formData.tech_contact_first_name,
			formData.tech_contact_last_name,
			formData.tech_contact_email,
			formData.tech_contact_phone,
		]
	);

	const companyDetailsFormData = useMemo(
		() => ({
			company_industry: formData.company_industry,
			company_size: formData.company_size,
		}),
		[formData.company_industry, formData.company_size]
	);

	const industryTechFormData = useMemo(
		() => ({
			selected_industries: formData.selected_industries,
			selected_technologies: formData.selected_technologies,
		}),
		[formData.selected_industries, formData.selected_technologies]
	);

	const addressFormData = useMemo(
		() => ({
			street: formData.street,
			city: formData.city,
			state_province: formData.state_province,
			zipcode_postal_code: formData.zipcode_postal_code,
			country: formData.country,
		}),
		[
			formData.street,
			formData.city,
			formData.state_province,
			formData.zipcode_postal_code,
			formData.country,
		]
	);

	const additionalSettingsFormData = useMemo(
		() => ({
			timezone: formData.timezone,
			client_status: formData.client_status,
			additional_notes: formData.additional_notes,
		}),
		[formData.timezone, formData.client_status, formData.additional_notes]
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
