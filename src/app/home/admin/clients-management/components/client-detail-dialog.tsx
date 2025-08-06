import React, { useState, useEffect, useCallback } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Edit,
	Trash2,
	Save,
	X,
} from "lucide-react";
import {
	stringToIconComponent,
} from "@/lib/icons/lucide-icons";
import type { ClientData } from "@/lib/actions/clients/clients";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { updateClient } from "@/lib/actions/clients/clients";
import { toast } from "sonner";
import { getStatusVariant } from "../utils/constants";
import { ClientCompanyOverview } from "./client-dialogs/client-company-overview";
import { ClientContactInformation } from "./client-dialogs/client-contact-information";
import { ClientCompanyDetails } from "./client-dialogs/client-company-details";
import { ClientAddressInformation } from "./client-dialogs/client-address-information";
import { ClientIndustryTechnologyFocus } from "./client-dialogs/client-industry-technology-focus";
import { ClientPlatformStatistics } from "./client-dialogs/client-platform-statistics";
import { ClientAdditionalInformation } from "./client-dialogs/client-additional-information";
import { ClientRecordInformation } from "./client-dialogs/client-record-information";
import { ClientRemoveConfirmationDialog } from "./client-dialogs/client-remove-confirmation-dialog";
import { ClientIconSelectorDialog } from "./client-dialogs/client-icon-selector-dialog";

interface ClientsDetailDialogProps {
	client: ClientData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onClientDeleted?: () => Promise<void>;
	onClientUpdated?: () => Promise<void>;
	initialEditMode?: boolean;
}

interface IndustryData {
	id: string;
	name: string;
	icon: string;
}

interface TechnologyData {
	id: string;
	name: string;
	icon: string;
}

export function ClientsDetailDialog({
	client,
	open,
	onOpenChange,
	onClientDeleted,
	onClientUpdated,
	initialEditMode = false,
}: ClientsDetailDialogProps) {
	const [isEditing, setIsEditing] = useState(initialEditMode);
	const [editedClient, setEditedClient] = useState<ClientData | null>(null);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
	const [industries, setIndustries] = useState<IndustryData[]>([]);
	const [technologies, setTechnologies] = useState<TechnologyData[]>([]);
	const [availableIndustries, setAvailableIndustries] = useState<
		IndustryData[]
	>([]);
	const [availableTechnologies, setAvailableTechnologies] = useState<
		TechnologyData[]
	>([]);
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);

	const loadIndustriesAndTechnologies = useCallback(async () => {
		// Load industries
		setIsLoadingIndustries(true);
		try {
			const result = await getIndustries();
			if (result.industries) {
				setIndustries(result.industries);
				setAvailableIndustries(result.industries);
			}
		} catch (error) {
			console.error("Error loading industries:", error);
		} finally {
			setIsLoadingIndustries(false);
		}

		// Load technologies
		setIsLoadingTechnologies(true);
		try {
			const result = await getTechnologies();
			if (result.technologies) {
				setTechnologies(result.technologies);
				setAvailableTechnologies(result.technologies);
			}
		} catch (error) {
			console.error("Error loading technologies:", error);
		} finally {
			setIsLoadingTechnologies(false);
		}
	}, []);

	// Load industries and technologies when dialog opens
	useEffect(() => {
		if (
			open &&
			client &&
			(client.selected_industries?.length || client.selected_technologies?.length)
		) {
			loadIndustriesAndTechnologies();
		}
	}, [open, client, loadIndustriesAndTechnologies]);

	// Initialize edited client when editing starts
	useEffect(() => {
		if (client && open) {
			setEditedClient({ ...client });
		}
	}, [client, open]);

	// Set initial edit mode when dialog opens
	useEffect(() => {
		if (open) {
			setIsEditing(initialEditMode);
		}
	}, [open, initialEditMode]);

	if (!client) return null;
	const IconComponent = stringToIconComponent(client.logo);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedClient({ ...client });
	};

	const handleSave = async () => {
		if (!editedClient || !client) return;

		setIsSaving(true);
		try {
			const updateData = {
				logo: editedClient.logo,
				company_name: editedClient.company_name,
				website: editedClient.website,
				main_contact_email: editedClient.main_contact_email,
				main_contact_first_name: editedClient.main_contact_first_name,
				main_contact_last_name: editedClient.main_contact_last_name,
				main_contact_phone: editedClient.main_contact_phone,
				tech_contact_first_name: editedClient.tech_contact_first_name,
				tech_contact_last_name: editedClient.tech_contact_last_name,
				tech_contact_email: editedClient.tech_contact_email,
				tech_contact_phone: editedClient.tech_contact_phone,
				company_industry: editedClient.company_industry,
				company_size: editedClient.company_size,
				street: editedClient.street,
				city: editedClient.city,
				state_province: editedClient.state_province,
				zipcode_postal_code: editedClient.zipcode_postal_code,
				country: editedClient.country,
				timezone: editedClient.timezone,
				client_status: editedClient.client_status,
				additional_notes: editedClient.additional_notes,
				selected_industries: editedClient.selected_industries,
				selected_technologies: editedClient.selected_technologies,
			};

			const result = await updateClient(client.id!, updateData);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			// Update the original client object
			Object.assign(client, editedClient);
			toast.success("Client updated successfully!");
			setIsEditing(false);

			if (onClientUpdated) {
				await onClientUpdated();
			}
		} catch (error) {
			console.error("Error updating client:", error);
			toast.error("Failed to update client. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedClient({ ...client });
	};

	const handleRemove = () => {
		setIsConfirmingRemove(true);
	};

	const handleFieldChange = (field: keyof ClientData, value: any) => {
		if (editedClient) {
			setEditedClient({
				...editedClient,
				[field]: value,
			});
		}
	};

	const handleIconChange = (iconName: string) => {
		if (editedClient) {
			setEditedClient({
				...editedClient,
				logo: iconName,
			});
		}
	};

	const currentClient = isEditing ? editedClient : client;

	if (!currentClient) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[900px] max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<IconComponent className="h-5 w-5" />
						{isEditing ? (
							<div> Edit Client</div>
						) : (
							<>
								<div>{currentClient.company_name}</div>{" "}
								<Badge
									variant={getStatusVariant(currentClient.client_status || "")}
									className="ml-2 text-xs"
								>
									{currentClient.client_status || "Unknown Status"}
								</Badge>
							</>
						)}
					</DialogTitle>
					<DialogDescription>
						Complete client details and information
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto space-y-4">
					{/* Company Overview Card */}
					<ClientCompanyOverview
						client={currentClient}
						isEditing={isEditing}
						onFieldChange={handleFieldChange}
						onIconClick={() => setIsIconSelectorOpen(true)}
					/>

					{/* Contact Information Card */}
					<ClientContactInformation
						client={currentClient}
						isEditing={isEditing}
						onFieldChange={handleFieldChange}
					/>

					{/* Company Details Card */}
					<ClientCompanyDetails
						client={currentClient}
						isEditing={isEditing}
						onFieldChange={handleFieldChange}
					/>

					{/* Address Card */}
					<ClientAddressInformation
						client={currentClient}
						isEditing={isEditing}
						onFieldChange={handleFieldChange}
					/>

					{/* Industry & Technology Focus */}
					<ClientIndustryTechnologyFocus
						client={currentClient}
						isEditing={isEditing}
						onFieldChange={handleFieldChange}
						industries={industries}
						technologies={technologies}
						availableIndustries={availableIndustries}
						availableTechnologies={availableTechnologies}
						isLoadingIndustries={isLoadingIndustries}
						isLoadingTechnologies={isLoadingTechnologies}
					/>

					{/* Statistics Card */}
					<ClientPlatformStatistics client={currentClient} />

					{/* Additional Settings */}
					<ClientAdditionalInformation
						client={currentClient}
						isEditing={isEditing}
						onFieldChange={handleFieldChange}
					/>

					{/* Timestamps */}
					<ClientRecordInformation client={currentClient} />
				</div>

				{/* Footer with Action Buttons - Always visible when editing */}
				{isEditing && (
					<div className="flex justify-end gap-3 pt-6 border-t mt-6 flex-shrink-0">
						<Button
							variant="outline"
							onClick={handleCancel}
							size="sm"
							disabled={isSaving}
						>
							<X className="h-4 w-4 mr-2" />
							Cancel
						</Button>
						<Button onClick={handleSave} size="sm" disabled={isSaving}>
							<Save className="h-4 w-4 mr-2" />
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				)}

				{/* Footer with Action Buttons - Only visible when not editing */}
				{!isEditing && (
					<div className="flex justify-end gap-3 pt-6 border-t mt-6 flex-shrink-0">
						<Button variant="destructive" onClick={handleRemove} size="sm">
							<Trash2 className="h-4 w-4 mr-2" />
							Remove Client
						</Button>
						<Button onClick={handleEdit} size="sm">
							<Edit className="h-4 w-4 mr-2" />
							Edit Client
						</Button>
					</div>
				)}
			</DialogContent>

			{/* Confirmation Dialog for Remove */}
			<ClientRemoveConfirmationDialog
				client={client}
				open={isConfirmingRemove}
				onOpenChange={setIsConfirmingRemove}
				onClientDeleted={onClientDeleted}
			/>

			{/* Icon Selector Dialog */}
			<ClientIconSelectorDialog
				open={isIconSelectorOpen}
				onOpenChange={setIsIconSelectorOpen}
				currentIcon={currentClient.logo}
				onIconChange={handleIconChange}
			/>
		</Dialog>
	);
}
