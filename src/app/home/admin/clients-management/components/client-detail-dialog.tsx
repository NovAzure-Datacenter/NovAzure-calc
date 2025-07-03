import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	ExternalLink,
	Mail,
	Phone,
	MapPin,
	Clock,
	Building2,
	Users,
	Package,
	FileText,
	Calendar,
	Edit,
	Trash2,
	Save,
	X,
	AlertTriangle,
	ChevronDown,
} from "lucide-react";
import {
	stringToIconComponent,
	iconOptions,
	iconComponentToString,
} from "@/lib/icons/lucide-icons";
import type { ClientData } from "@/lib/actions/client/client";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { updateClient, deleteClient } from "@/lib/actions/client/client";
import { toast } from "sonner";
import { countryOptions } from "@/lib/constants/country-options";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
	const [isRemoving, setIsRemoving] = useState(false);
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

	if (!client) return null;
	const IconComponent = stringToIconComponent(client.logo);

	// Load industries and technologies when dialog opens
	useEffect(() => {
		if (
			open &&
			(client.selectedIndustries?.length || client.selectedTechnologies?.length)
		) {
			loadIndustriesAndTechnologies();
		}
	}, [open, client]);

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

	const loadIndustriesAndTechnologies = async () => {
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
	};

	// Get industry name by ID
	const getIndustryName = (industryId: string) => {
		const industry = industries.find((i) => i.id === industryId);
		return industry?.name || industryId;
	};

	// Get technology name by ID
	const getTechnologyName = (technologyId: string) => {
		const technology = technologies.find((t) => t.id === technologyId);
		return technology?.name || technologyId;
	};

	const toggleIndustrySelection = (industryId: string) => {
		if (!editedClient) return;

		const currentSelected = editedClient.selectedIndustries || [];
		const isSelected = currentSelected.includes(industryId);

		const newSelected = isSelected
			? currentSelected.filter((id) => id !== industryId)
			: [...currentSelected, industryId];

		setEditedClient({
			...editedClient,
			selectedIndustries: newSelected,
		});
	};

	const toggleTechnologySelection = (technologyId: string) => {
		if (!editedClient) return;

		const currentSelected = editedClient.selectedTechnologies || [];
		const isSelected = currentSelected.includes(technologyId);

		const newSelected = isSelected
			? currentSelected.filter((id) => id !== technologyId)
			: [...currentSelected, technologyId];

		setEditedClient({
			...editedClient,
			selectedTechnologies: newSelected,
		});
	};

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
				companyName: editedClient.companyName,
				website: editedClient.website,
				mainContactEmail: editedClient.mainContactEmail,
				mainContactFirstName: editedClient.mainContactFirstName,
				mainContactLastName: editedClient.mainContactLastName,
				mainContactPhone: editedClient.mainContactPhone,
				techContactFirstName: editedClient.techContactFirstName,
				techContactLastName: editedClient.techContactLastName,
				techContactEmail: editedClient.techContactEmail,
				techContactPhone: editedClient.techContactPhone,
				companyIndustry: editedClient.companyIndustry,
				companySize: editedClient.companySize,
				street: editedClient.street,
				city: editedClient.city,
				stateProvince: editedClient.stateProvince,
				zipcodePostalCode: editedClient.zipcodePostalCode,
				country: editedClient.country,
				timezone: editedClient.timezone,
				clientStatus: editedClient.clientStatus,
				additionalNotes: editedClient.additionalNotes,
				selectedIndustries: editedClient.selectedIndustries,
				selectedTechnologies: editedClient.selectedTechnologies,
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

	// Generate login email if possible
	const loginEmail =
		client.mainContactFirstName &&
		client.mainContactLastName &&
		client.companyName
			? `${client.mainContactFirstName[0].toUpperCase()}${client.mainContactLastName.toLowerCase()}-${client.companyName
					.replace(/[^a-zA-Z0-9]/g, "")
					.toLowerCase()}@novazure.com`
			: undefined;

	// Format address
	const formatAddress = () => {
		const parts = [
			client.street,
			client.city,
			client.stateProvince,
			client.zipcodePostalCode,
			client.country,
		].filter(Boolean);
		return parts.length > 0 ? parts.join(", ") : "No address provided";
	};

	// Get status badge variant
	const getStatusVariant = (status: string) => {
		switch (status) {
			case "active":
				return "default";
			case "prospect":
				return "secondary";
			case "on-hold":
				return "outline";
			case "inactive":
				return "destructive";
			default:
				return "outline";
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
								<div>{currentClient.companyName}</div>{" "}
								<Badge
									variant={getStatusVariant(currentClient.clientStatus || "")}
									className="ml-2 text-xs"
								>
									{currentClient.clientStatus || "Unknown Status"}
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
					<Card>
						<CardContent className="pt-4 pb-4">
							<div className="flex items-start gap-4">
								<div className="flex items-center justify-center w-12 h-12 border rounded-lg bg-gray-50 relative">
									{isEditing ? (
										<button
											onClick={() => setIsIconSelectorOpen(true)}
											className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
											title="Click to change icon"
										>
											<IconComponent className="h-6 w-6 text-gray-600" />
										</button>
									) : (
										<IconComponent className="h-6 w-6 text-gray-600" />
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										{isEditing ? (
											<Input
												value={currentClient.companyName || ""}
												onChange={(e) =>
													handleFieldChange("companyName", e.target.value)
												}
												className="text-lg font-bold border-0 bg-transparent p-0 focus-visible:ring-0"
											/>
										) : (
											<h3 className="font-semibold text-lg">
												{currentClient.companyName}
											</h3>
										)}
										{currentClient.companyIndustry && (
											<Badge variant="outline" className="text-xs">
												{isEditing ? (
													<Input
														value={currentClient.companyIndustry || ""}
														onChange={(e) =>
															handleFieldChange(
																"companyIndustry",
																e.target.value
															)
														}
														className="text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
														placeholder="Industry"
													/>
												) : (
													currentClient.companyIndustry
												)}
											</Badge>
										)}
									</div>
									<div className="flex items-center gap-4 text-sm text-muted-foreground">
										{currentClient.website && (
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
												onClick={() =>
													window.open(currentClient.website, "_blank")
												}
											>
												<ExternalLink className="h-3 w-3 mr-1" />
												{isEditing ? (
													<Input
														value={currentClient.website || ""}
														onChange={(e) =>
															handleFieldChange("website", e.target.value)
														}
														className="text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
														placeholder="Website"
													/>
												) : (
													currentClient.website
												)}
											</Button>
										)}
										{currentClient.companySize && (
											<span className="flex items-center gap-1">
												<Users className="h-3 w-3" />
												{isEditing ? (
													<Select
														value={currentClient.companySize}
														onValueChange={(value) =>
															handleFieldChange("companySize", value)
														}
													>
														<SelectTrigger className="text-xs h-6 w-auto border-0 bg-transparent p-0">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{companySizeOptions.map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																	className="text-xs"
																>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												) : (
													currentClient.companySize
												)}
											</span>
										)}
									</div>
									{loginEmail && (
										<div className="flex items-center gap-2 mt-2">
											<span className="text-xs font-medium text-gray-600">
												Login Email:
											</span>
											<span className="text-xs bg-gray-100 rounded px-2 py-1 font-mono">
												{loginEmail}
											</span>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="text-xs h-6 px-2"
												onClick={() => {
													navigator.clipboard.writeText(loginEmail);
													toast.success("Login email copied to clipboard");
												}}
											>
												Copy
											</Button>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contact Information Card */}
					<Card>
						<CardContent className="pt-4 pb-4">
							<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
								<Mail className="h-4 w-4" />
								Contact Information
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Main Contact */}
								<div className="space-y-2">
									<div className="font-medium text-sm text-gray-700">
										Main Contact
									</div>
									<div className="bg-gray-50 rounded-lg p-3">
										{isEditing ? (
											<div className="space-y-2">
												<div className="grid grid-cols-2 gap-2">
													<Input
														value={currentClient.mainContactFirstName || ""}
														onChange={(e) =>
															handleFieldChange(
																"mainContactFirstName",
																e.target.value
															)
														}
														placeholder="First Name"
														className="text-sm h-8"
													/>
													<Input
														value={currentClient.mainContactLastName || ""}
														onChange={(e) =>
															handleFieldChange(
																"mainContactLastName",
																e.target.value
															)
														}
														placeholder="Last Name"
														className="text-sm h-8"
													/>
												</div>
												<Input
													value={currentClient.mainContactEmail || ""}
													onChange={(e) =>
														handleFieldChange(
															"mainContactEmail",
															e.target.value
														)
													}
													placeholder="Email"
													type="email"
													className="text-sm h-8"
												/>
												<PhoneInputWrapper
													international
													defaultCountry="US"
													value={currentClient.mainContactPhone || ""}
													onChange={(value: string) =>
														handleFieldChange("mainContactPhone", value || "")
													}
													placeholder="Phone"
												/>
											</div>
										) : (
											<>
												<div className="font-medium text-sm">
													{currentClient.mainContactFirstName}{" "}
													{currentClient.mainContactLastName}
												</div>
												<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
													<Mail className="h-3 w-3" />
													<Button
														variant="ghost"
														size="sm"
														className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
														onClick={() =>
															window.open(
																`mailto:${currentClient.mainContactEmail}`,
																"_blank"
															)
														}
													>
														{currentClient.mainContactEmail}
													</Button>
												</div>
												{currentClient.mainContactPhone && (
													<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
														<Phone className="h-3 w-3" />
														<Button
															variant="ghost"
															size="sm"
															className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
															onClick={() =>
																window.open(
																	`tel:${currentClient.mainContactPhone}`,
																	"_blank"
																)
															}
														>
															{currentClient.mainContactPhone}
														</Button>
													</div>
												)}
											</>
										)}
									</div>
								</div>

								{/* Technical Contact */}
								{(currentClient.techContactFirstName ||
									currentClient.techContactEmail ||
									isEditing) && (
									<div className="space-y-2">
										<div className="font-medium text-sm text-gray-700">
											Technical Contact
										</div>
										<div className="bg-gray-50 rounded-lg p-3">
											{isEditing ? (
												<div className="space-y-2">
													<div className="grid grid-cols-2 gap-2">
														<Input
															value={currentClient.techContactFirstName || ""}
															onChange={(e) =>
																handleFieldChange(
																	"techContactFirstName",
																	e.target.value
																)
															}
															placeholder="First Name"
															className="text-sm h-8"
														/>
														<Input
															value={currentClient.techContactLastName || ""}
															onChange={(e) =>
																handleFieldChange(
																	"techContactLastName",
																	e.target.value
																)
															}
															placeholder="Last Name"
															className="text-sm h-8"
														/>
													</div>
													<Input
														value={currentClient.techContactEmail || ""}
														onChange={(e) =>
															handleFieldChange(
																"techContactEmail",
																e.target.value
															)
														}
														placeholder="Email"
														type="email"
														className="text-sm h-8"
													/>
													<PhoneInputWrapper
														international
														defaultCountry="US"
														value={currentClient.techContactPhone || ""}
														onChange={(value: string) =>
															handleFieldChange("techContactPhone", value || "")
														}
														placeholder="Phone"
													/>
												</div>
											) : (
												<>
													<div className="font-medium text-sm">
														{currentClient.techContactFirstName}{" "}
														{currentClient.techContactLastName}
													</div>
													{currentClient.techContactEmail && (
														<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
															<Mail className="h-3 w-3" />
															<Button
																variant="ghost"
																size="sm"
																className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
																onClick={() =>
																	window.open(
																		`mailto:${currentClient.techContactEmail}`,
																		"_blank"
																	)
																}
															>
																{currentClient.techContactEmail}
															</Button>
														</div>
													)}
													{currentClient.techContactPhone && (
														<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
															<Phone className="h-3 w-3" />
															<Button
																variant="ghost"
																size="sm"
																className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
																onClick={() =>
																	window.open(
																		`tel:${currentClient.techContactPhone}`,
																		"_blank"
																	)
																}
															>
																{currentClient.techContactPhone}
															</Button>
														</div>
													)}
												</>
											)}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Company Details Card */}
					<Card>
						<CardContent className="pt-4 pb-4">
							<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								Company Details
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<div className="font-medium text-sm text-gray-700 mb-1">
										Industry
									</div>
									{isEditing ? (
										<Input
											value={currentClient.companyIndustry || ""}
											onChange={(e) =>
												handleFieldChange("companyIndustry", e.target.value)
											}
											placeholder="Industry"
											className="text-sm h-8"
										/>
									) : (
										<div className="text-sm">
											{currentClient.companyIndustry || "Not specified"}
										</div>
									)}
								</div>
								<div>
									<div className="font-medium text-sm text-gray-700 mb-1">
										Company Size
									</div>
									{isEditing ? (
										<Select
											value={currentClient.companySize || ""}
											onValueChange={(value) =>
												handleFieldChange("companySize", value)
											}
										>
											<SelectTrigger className="text-sm h-8">
												<SelectValue placeholder="Select size" />
											</SelectTrigger>
											<SelectContent>
												{companySizeOptions.map((option) => (
													<SelectItem
														key={option.value}
														value={option.value}
														className="text-xs"
													>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<div className="text-sm">
											{currentClient.companySize || "Not specified"}
										</div>
									)}
								</div>
								<div>
									<div className="font-medium text-sm text-gray-700 mb-1">
										Client Status
									</div>
									{isEditing ? (
										<Select
											value={currentClient.clientStatus || ""}
											onValueChange={(value) =>
												handleFieldChange("clientStatus", value)
											}
										>
											<SelectTrigger className="text-sm h-8">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{clientStatusOptions.map((option) => (
													<SelectItem
														key={option.value}
														value={option.value}
														className="text-xs"
													>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<Badge
											variant={getStatusVariant(
												currentClient.clientStatus || ""
											)}
											className="text-xs"
										>
											{currentClient.clientStatus || "Unknown"}
										</Badge>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Address Card */}
					<Card>
						<CardContent className="pt-4 pb-4">
							<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Address Information
							</h4>
							{isEditing ? (
								<div className="space-y-3">
									<Input
										value={currentClient.street || ""}
										onChange={(e) =>
											handleFieldChange("street", e.target.value)
										}
										placeholder="Street Address"
										className="text-sm h-8"
									/>
									<div className="grid grid-cols-2 gap-3">
										<Input
											value={currentClient.city || ""}
											onChange={(e) =>
												handleFieldChange("city", e.target.value)
											}
											placeholder="City"
											className="text-sm h-8"
										/>
										<Input
											value={currentClient.stateProvince || ""}
											onChange={(e) =>
												handleFieldChange("stateProvince", e.target.value)
											}
											placeholder="State/Province"
											className="text-sm h-8"
										/>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<Input
											value={currentClient.zipcodePostalCode || ""}
											onChange={(e) =>
												handleFieldChange("zipcodePostalCode", e.target.value)
											}
											placeholder="ZIP/Postal Code"
											className="text-sm h-8"
										/>
										<Select
											value={currentClient.country || ""}
											onValueChange={(value) =>
												handleFieldChange("country", value)
											}
										>
											<SelectTrigger className="text-sm h-8">
												<SelectValue placeholder="Select country" />
											</SelectTrigger>
											<SelectContent className="max-h-[300px]">
												{countryOptions.map((option) => (
													<SelectItem
														key={option.value}
														value={option.value}
														className="text-xs"
													>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							) : (
								<div className="text-sm">{formatAddress()}</div>
							)}
						</CardContent>
					</Card>

					{/* Industry & Technology Focus */}
					{(currentClient.selectedIndustries?.length ||
						currentClient.selectedTechnologies?.length ||
						isEditing) && (
						<Card>
							<CardContent className="pt-4 pb-4">
								<h4 className="font-medium text-sm mb-3">
									Industry & Technology Focus
								</h4>
								<div className="space-y-4">
									{/* Industries Section */}
									<div>
										<Label className="text-xs font-medium">
											Applicable Industries
										</Label>
										<div className="space-y-2 mt-1">
											{isEditing ? (
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
																	: `Select Industries (${
																			currentClient.selectedIndustries
																				?.length || 0
																	  } selected)`}
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
																		const isSelected =
																			currentClient.selectedIndustries?.includes(
																				industry.id
																			) || false;
																		return (
																			<div
																				key={industry.id}
																				className="flex items-center space-x-2 p-1 rounded hover:bg-white"
																			>
																				<Checkbox
																					id={`industry-${industry.id}`}
																					checked={isSelected}
																					onCheckedChange={() =>
																						toggleIndustrySelection(industry.id)
																					}
																					className="h-3 w-3"
																				/>
																				<label
																					htmlFor={`industry-${industry.id}`}
																					className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
																				>
																					<div className="flex items-center gap-1">
																						{stringToIconComponent(
																							industry.icon
																						) && (
																							<div className="h-3 w-3">
																								{React.createElement(
																									stringToIconComponent(
																										industry.icon
																									),
																									{ className: "h-3 w-3" }
																								)}
																							</div>
																						)}
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
											) : null}

											{/* Selected industries display */}
											{currentClient.selectedIndustries?.length && (
												<div className="space-y-1">
													<div className="text-xs font-medium text-gray-700">
														Selected Industries:
													</div>
													<div className="flex flex-wrap gap-1">
														{isLoadingIndustries ? (
															<div className="flex items-center gap-2 text-xs text-muted-foreground">
																<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
																Loading industries...
															</div>
														) : (
															currentClient.selectedIndustries.map(
																(industryId, index) => (
																	<Badge
																		key={index}
																		variant="secondary"
																		className="text-xs"
																	>
																		{getIndustryName(industryId)}
																		{isEditing && (
																			<button
																				type="button"
																				onClick={() =>
																					toggleIndustrySelection(industryId)
																				}
																				className="ml-1 hover:text-destructive"
																			>
																				<X className="h-3 w-3" />
																			</button>
																		)}
																	</Badge>
																)
															)
														)}
													</div>
												</div>
											)}
										</div>
									</div>

									{/* Technologies Section */}
									<div>
										<Label className="text-xs font-medium">
											Applicable Technologies
										</Label>
										<div className="space-y-2 mt-1">
											{isEditing ? (
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
																	: `Select Technologies (${
																			currentClient.selectedTechnologies
																				?.length || 0
																	  } selected)`}
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
																		const isSelected =
																			currentClient.selectedTechnologies?.includes(
																				technology.id
																			) || false;
																		return (
																			<div
																				key={technology.id}
																				className="flex items-center space-x-2 p-1 rounded hover:bg-white"
																			>
																				<Checkbox
																					id={`technology-${technology.id}`}
																					checked={isSelected}
																					onCheckedChange={() =>
																						toggleTechnologySelection(
																							technology.id
																						)
																					}
																					className="h-3 w-3"
																				/>
																				<label
																					htmlFor={`technology-${technology.id}`}
																					className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
																				>
																					<div className="flex items-center gap-1">
																						{stringToIconComponent(
																							technology.icon
																						) && (
																							<div className="h-3 w-3">
																								{React.createElement(
																									stringToIconComponent(
																										technology.icon
																									),
																									{ className: "h-3 w-3" }
																								)}
																							</div>
																						)}
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
											) : null}

											{/* Selected technologies display */}
											{currentClient.selectedTechnologies?.length && (
												<div className="space-y-1">
													<div className="text-xs font-medium text-gray-700">
														Selected Technologies:
													</div>
													<div className="flex flex-wrap gap-1">
														{isLoadingTechnologies ? (
															<div className="flex items-center gap-2 text-xs text-muted-foreground">
																<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
																Loading technologies...
															</div>
														) : (
															currentClient.selectedTechnologies.map(
																(technologyId, index) => (
																	<Badge
																		key={index}
																		variant="secondary"
																		className="text-xs"
																	>
																		{getTechnologyName(technologyId)}
																		{isEditing && (
																			<button
																				type="button"
																				onClick={() =>
																					toggleTechnologySelection(
																						technologyId
																					)
																				}
																				className="ml-1 hover:text-destructive"
																			>
																				<X className="h-3 w-3" />
																			</button>
																		)}
																	</Badge>
																)
															)
														)}
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Statistics Card */}
					<Card>
						<CardContent className="pt-4 pb-4">
							<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
								<Package className="h-4 w-4" />
								Platform Statistics
							</h4>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">
										{currentClient.userCount || 0}
									</div>
									<div className="text-xs text-muted-foreground">Users</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{currentClient.productCount || 0}
									</div>
									<div className="text-xs text-muted-foreground">Products</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-yellow-600">
										{currentClient.productPendingCount || 0}
									</div>
									<div className="text-xs text-muted-foreground">Pending</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">
										{currentClient.scenarioCount || 0}
									</div>
									<div className="text-xs text-muted-foreground">Scenarios</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Additional Settings */}
					{(currentClient.timezone ||
						currentClient.additionalNotes ||
						isEditing) && (
						<Card>
							<CardContent className="pt-4 pb-4">
								<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Additional Information
								</h4>
								<div className="space-y-3">
									{isEditing ? (
										<>
											<div>
												<div className="font-medium text-sm text-gray-700 mb-1">
													Timezone
												</div>
												<Select
													value={currentClient.timezone || ""}
													onValueChange={(value) =>
														handleFieldChange("timezone", value)
													}
												>
													<SelectTrigger className="text-sm h-8">
														<SelectValue placeholder="Select timezone" />
													</SelectTrigger>
													<SelectContent>
														{timezoneOptions.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
																className="text-xs"
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div>
												<div className="font-medium text-sm text-gray-700 mb-1">
													Additional Notes
												</div>
												<Textarea
													value={currentClient.additionalNotes || ""}
													onChange={(e) =>
														handleFieldChange("additionalNotes", e.target.value)
													}
													placeholder="Additional notes..."
													className="text-sm min-h-[80px]"
												/>
											</div>
										</>
									) : (
										<>
											{currentClient.timezone && (
												<div>
													<div className="font-medium text-sm text-gray-700 mb-1">
														Timezone
													</div>
													<div className="text-sm">
														{currentClient.timezone}
													</div>
												</div>
											)}
											{currentClient.additionalNotes && (
												<div>
													<div className="font-medium text-sm text-gray-700 mb-1">
														Additional Notes
													</div>
													<div className="text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-line">
														{currentClient.additionalNotes}
													</div>
												</div>
											)}
										</>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Timestamps */}
					<Card>
						<CardContent className="pt-4 pb-4">
							<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								Record Information
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<div className="font-medium text-gray-700 mb-1">Created</div>
									<div className="text-muted-foreground">
										{currentClient.createdAt
											? new Date(currentClient.createdAt).toLocaleDateString()
											: "Unknown"}
									</div>
								</div>
								<div>
									<div className="font-medium text-gray-700 mb-1">
										Last Updated
									</div>
									<div className="text-muted-foreground">
										{currentClient.updatedAt
											? new Date(currentClient.updatedAt).toLocaleDateString()
											: "Unknown"}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
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
			{isConfirmingRemove && (
				<Dialog open={isConfirmingRemove} onOpenChange={setIsConfirmingRemove}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
								Remove Client
							</DialogTitle>
							<DialogDescription className="space-y-2">
								<p>
									Are you sure you want to remove{" "}
									<strong>"{client.companyName}"</strong>?
								</p>
								<p className="text-sm text-muted-foreground">
									This will permanently delete the client and all associated
									data
								</p>
								<p className="text-sm font-medium text-destructive">
									This action cannot be undone.
								</p>
							</DialogDescription>
						</DialogHeader>
						<div className="flex justify-end gap-3 pt-6 border-t mt-6">
							<Button
								variant="outline"
								onClick={() => setIsConfirmingRemove(false)}
								size="sm"
								disabled={isRemoving}
							>
								Cancel
							</Button>
							<Button
								onClick={async () => {
									setIsRemoving(true);
									try {
										const result = await deleteClient(client.id!);

										if (result.error) {
											toast.error(result.error);
											return;
										}

										toast.success("Client removed successfully!");
										setIsConfirmingRemove(false);

										if (onClientDeleted) {
											await onClientDeleted();
										}
									} catch (error) {
										toast.error(
											"An unexpected error occurred while removing the client"
										);
									} finally {
										setIsRemoving(false);
									}
								}}
								size="sm"
								variant="destructive"
								disabled={isRemoving}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving ? "Removing..." : "Remove Client"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}

			{/* Icon Selector Dialog */}
			{isIconSelectorOpen && (
				<Dialog open={isIconSelectorOpen} onOpenChange={setIsIconSelectorOpen}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>Select Client Icon</DialogTitle>
							<DialogDescription>
								Choose an icon that best represents this client
							</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
							{iconOptions.map((option) => {
								const isSelected = option.value === currentClient.logo;
								return (
									<button
										key={option.value}
										onClick={() => {
											handleIconChange(option.value);
											setIsIconSelectorOpen(false);
										}}
										className={`p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
											isSelected
												? "border-primary bg-primary/10"
												: "border-border hover:border-primary/50"
										}`}
									>
										<div className="flex flex-col items-center gap-2">
											<option.icon
												className={`h-8 w-8 ${
													isSelected ? "text-primary" : "text-muted-foreground"
												}`}
											/>
										</div>
									</button>
								);
							})}
						</div>
						<div className="flex justify-end mt-4 pt-4 border-t">
							<Button
								onClick={() => setIsIconSelectorOpen(false)}
								variant="outline"
								size="sm"
							>
								Cancel
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</Dialog>
	);
}
