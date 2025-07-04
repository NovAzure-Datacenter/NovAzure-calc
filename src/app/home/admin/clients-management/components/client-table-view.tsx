"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
	MoreHorizontal,
	Plus,
	Edit,
	Trash2,
	Eye,
	AlertTriangle,
	ExternalLink,
	Mail,
	ChevronDown,
	Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { ClientData } from "@/lib/actions/client/client";
import {
	getClients,
	deleteClient,
	updateClient,
} from "@/lib/actions/client/client";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import { ClientsDetailDialog } from "./client-detail-dialog";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";

interface ClientsTableViewProps {
	onClientDeleted?: () => Promise<void>;
	refreshTrigger?: number;
}

// Icon components for industries and technologies
function IndustryIcons({
	industryIds,
	industries,
	maxVisible = 3,
}: {
	industryIds: string[];
	industries: Array<{ id: string; name: string; icon: string }>;
	maxVisible?: number;
}) {
	const visibleIndustries = industryIds
		.map((id) => industries.find((ind) => ind.id === id))
		.filter(Boolean)
		.slice(0, maxVisible);
	const remainingCount = industryIds.length - maxVisible;

	return (
		<div className="flex items-center gap-1">
			{visibleIndustries.map((industry, index) => {
				if (!industry) return null;
				const IconComponent = stringToIconComponent(industry.icon);
				return (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<div className="p-1 bg-gray-100 rounded">
								<IconComponent className="h-3 w-3 text-gray-600" />
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p className="text-xs">{industry.name}</p>
						</TooltipContent>
					</Tooltip>
				);
			})}
			{remainingCount > 0 && (
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="p-1 bg-gray-100 rounded text-xs font-medium">
							+{remainingCount}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="text-xs">
							{industryIds
								.slice(maxVisible)
								.map((id) => {
									const industry = industries.find((ind) => ind.id === id);
									return industry ? industry.name : id;
								})
								.map((name, index) => (
									<div key={index}>{name}</div>
								))}
						</div>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}

function TechnologyIcons({
	technologyIds,
	technologies,
	maxVisible = 3,
}: {
	technologyIds: string[];
	technologies: Array<{ id: string; name: string; icon: string }>;
	maxVisible?: number;
}) {
	const visibleTechnologies = technologyIds
		.map((id) => technologies.find((tech) => tech.id === id))
		.filter(Boolean)
		.slice(0, maxVisible);
	const remainingCount = technologyIds.length - maxVisible;

	return (
		<div className="flex items-center gap-1">
			{visibleTechnologies.map((technology, index) => {
				if (!technology) return null;
				const IconComponent = stringToIconComponent(technology.icon);
				return (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<div className="p-1 bg-gray-100 rounded">
								<IconComponent className="h-3 w-3 text-gray-600" />
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p className="text-xs">{technology.name}</p>
						</TooltipContent>
					</Tooltip>
				);
			})}
			{remainingCount > 0 && (
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="p-1 bg-gray-100 rounded text-xs font-medium">
							+{remainingCount}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="text-xs">
							{technologyIds
								.slice(maxVisible)
								.map((id) => {
									const technology = technologies.find(
										(tech) => tech.id === id
									);
									return technology ? technology.name : id;
								})
								.map((name, index) => (
									<div key={index}>{name}</div>
								))}
						</div>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}

export function ClientsTableView({
	onClientDeleted,
	refreshTrigger,
}: ClientsTableViewProps) {
	const [clients, setClients] = useState<ClientData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
		null
	);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
	const [industries, setIndustries] = useState<
		Array<{ id: string; name: string; icon: string }>
	>([]);
	const [technologies, setTechnologies] = useState<
		Array<{ id: string; name: string; icon: string }>
	>([]);

	// Status options
	const statusOptions = [
		{ value: "active", label: "Active", variant: "default" },
		{ value: "prospect", label: "Prospect", variant: "secondary" },
		{ value: "on-hold", label: "On Hold", variant: "outline" },
		{ value: "inactive", label: "Inactive", variant: "destructive" },
	];

	// Load clients from MongoDB
	const loadClients = async () => {
		try {
			setIsLoading(true);
			const result = await getClients();

			if (result.error) {
				toast.error(result.error);
				return;
			}

			setClients(result.clients || []);
		} catch (error) {
			console.error("Error loading clients:", error);
			toast.error("Failed to load clients");
		} finally {
			setIsLoading(false);
		}
	};

	// Load industries and technologies data
	const loadIndustriesAndTechnologies = async () => {
		try {
			// Load industries
			const industriesResult = await getIndustries();
			if (industriesResult.industries) {
				setIndustries(industriesResult.industries);
			}

			// Load technologies
			const technologiesResult = await getTechnologies();
			if (technologiesResult.technologies) {
				setTechnologies(technologiesResult.technologies);
			}
		} catch (error) {
			console.error("Error loading industries and technologies:", error);
		}
	};

	useEffect(() => {
		loadClients();
		loadIndustriesAndTechnologies();
	}, [refreshTrigger]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				openDropdown &&
				!(event.target as Element).closest(".dropdown-container")
			) {
				setOpenDropdown(null);
			}
			if (
				openStatusDropdown &&
				!(event.target as Element).closest(".status-dropdown-container")
			) {
				setOpenStatusDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openDropdown, openStatusDropdown]);

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedClient(null);
		setIsEditMode(false);
	};

	const handleDropdownButtonClick = (e: React.MouseEvent, clientId: string) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === clientId ? null : clientId);
	};

	const handleDropdownItemClick = async (action: string, clientId: string) => {
		setOpenDropdown(null);

		const client = clients.find((c) => c.id === clientId);
		if (!client) return;

		if (action === "View") {
			setSelectedClient(client);
			setIsEditMode(false);
			setIsDialogOpen(true);
		} else if (action === "Edit") {
			setSelectedClient(client);
			setIsEditMode(true);
			setIsDialogOpen(true);
		} else if (action === "Remove") {
			setSelectedClient(client);
			setIsConfirmingRemove(true);
		}
	};

	const handleWebsiteClick = (website: string) => {
		window.open(website, "_blank");
	};

	const handleEmailClick = (email: string) => {
		window.open(`mailto:${email}`, "_blank");
	};

	const handleStatusDropdownClick = (e: React.MouseEvent, clientId: string) => {
		e.stopPropagation();
		setOpenStatusDropdown(openStatusDropdown === clientId ? null : clientId);
	};

	const handleStatusUpdate = async (clientId: string, newStatus: string) => {
		setOpenStatusDropdown(null);
		setIsUpdatingStatus(clientId);

		try {
			const result = await updateClient(clientId, { clientStatus: newStatus });

			if (result.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Client status updated successfully!");

			// Update the local state
			setClients((prevClients) =>
				prevClients.map((client) =>
					client.id === clientId
						? { ...client, clientStatus: newStatus }
						: client
				)
			);
		} catch (error) {
			console.error("Error updating client status:", error);
			toast.error("Failed to update client status");
		} finally {
			setIsUpdatingStatus(null);
		}
	};

	if (isLoading) {
		return (
			<div className="h-[calc(100vh-200px)] flex items-center justify-center">
				<div className="flex items-center gap-2">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
					<span className="text-sm text-muted-foreground">
						Loading clients...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="h-[calc(100vh-200px)] overflow-y-auto">
			<Card className="rounded-md border p-2">
				<TooltipProvider>
					<Table>
						<TableHeader>
							<TableRow className="border-b">
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Logo
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Company Name
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Main Contact
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Status
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Company Size
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Industries
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Technologies
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Website
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Contact Email
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Users
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Products
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Pending
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Scenarios
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{clients.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={14}
										className="text-center py-8 text-muted-foreground"
									>
										No clients found. Create your first client to get started.
									</TableCell>
								</TableRow>
							) : (
								clients.map((client) => {
									const IconComponent = stringToIconComponent(client.logo);
									const currentStatus =
										statusOptions.find(
											(option) => option.value === client.clientStatus
										) || statusOptions[0];

									return (
										<TableRow key={client.id} className="hover:bg-muted/50">
											<TableCell className="h-10 px-2 py-1">
												<div className="flex items-center justify-center bg-gray-100 rounded">
													<IconComponent className="h-4 w-4 text-gray-600" />
												</div>
											</TableCell>

											<TableCell className="h-10 px-2 py-1 font-medium text-sm">
												<div>
													<div className="font-medium">
														{client.companyName}
													</div>
													{client.companyIndustry && (
														<div className="text-xs text-muted-foreground">
															{client.companyIndustry}
														</div>
													)}
												</div>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<div>
													<div className="text-sm font-medium">
														{client.mainContactFirstName}{" "}
														{client.mainContactLastName}
													</div>
													{client.mainContactPhone && (
														<div className="text-xs text-muted-foreground">
															{client.mainContactPhone}
														</div>
													)}
												</div>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												{/* Status Dropdown */}
												<div className="relative status-dropdown-container">
													<Button
														variant="ghost"
														className="h-6 px-2 py-1 hover:bg-transparent"
														onClick={(e) =>
															handleStatusDropdownClick(e, client.id!)
														}
														disabled={isUpdatingStatus === client.id}
													>
														<Badge
															variant={currentStatus.variant as any}
															className="text-xs px-2 py-0.5 mr-1"
														>
															{currentStatus.label}
														</Badge>
														<ChevronDown className="h-3 w-3 text-muted-foreground" />
													</Button>

													{openStatusDropdown === client.id && (
														<div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[140px]">
															{statusOptions.map((status) => (
																<button
																	key={status.value}
																	className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
																	onClick={() =>
																		handleStatusUpdate(client.id!, status.value)
																	}
																>
																	<Badge
																		variant={status.variant as any}
																		className="text-xs px-2 py-0.5"
																	>
																		{status.label}
																	</Badge>
																	{client.clientStatus === status.value && (
																		<Check className="h-3 w-3 text-green-600" />
																	)}
																</button>
															))}
														</div>
													)}
												</div>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												{client.companySize ? (
													<span className="text-xs text-muted-foreground">
														{client.companySize}
													</span>
												) : (
													<span className="text-xs text-muted-foreground">
														-
													</span>
												)}
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<IndustryIcons
													industryIds={client.selectedIndustries || []}
													industries={industries}
												/>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<TechnologyIcons
													technologyIds={client.selectedTechnologies || []}
													technologies={technologies}
												/>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
															onClick={() => handleWebsiteClick(client.website)}
														>
															<ExternalLink className="h-3 w-3 mr-1" />
															{client.website ? (
																<span className="truncate max-w-[120px]">
																	{client.website.replace(/^https?:\/\//, "")}
																</span>
															) : (
																"Visit"
															)}
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm">
															{client.website || "No website"}
														</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
															onClick={() =>
																handleEmailClick(client.mainContactEmail)
															}
														>
															<Mail className="h-3 w-3 mr-1" />
															{client.mainContactEmail ? (
																<span className="truncate max-w-[120px]">
																	{client.mainContactEmail}
																</span>
															) : (
																"Email"
															)}
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm">
															{client.mainContactEmail || "No email"}
														</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Badge
													variant="outline"
													className="text-xs px-2 py-0.5"
												>
													{client.userCount || 0}
												</Badge>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Badge
													variant="outline"
													className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200"
												>
													{client.productCount || 0}
												</Badge>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Badge
													variant="outline"
													className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-700 border-yellow-200"
												>
													{client.productPendingCount || 0}
												</Badge>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Badge
													variant="outline"
													className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
												>
													{client.scenarioCount || 0}
												</Badge>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												{/* Custom Simple Dropdown */}
												<div className="relative dropdown-container">
													<Button
														variant="ghost"
														className="h-6 w-6 p-0"
														onClick={(e) =>
															handleDropdownButtonClick(e, client.id!)
														}
													>
														<MoreHorizontal className="h-3 w-3" />
													</Button>

													{openDropdown === client.id && (
														<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("View", client.id!)
																}
															>
																<Eye className="h-3 w-3" />
																View
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("Edit", client.id!)
																}
															>
																<Edit className="h-3 w-3" />
																Edit
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
																onClick={() =>
																	handleDropdownItemClick("Remove", client.id!)
																}
																disabled={isRemoving === client.id}
															>
																<Trash2 className="h-3 w-3" />
																{isRemoving === client.id
																	? "Removing..."
																	: "Remove"}
															</button>
														</div>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</TooltipProvider>
			</Card>

			{/* Client Detail Dialog */}
			{selectedClient && (
				<ClientsDetailDialog
					client={selectedClient}
					open={isDialogOpen}
					onOpenChange={handleDialogClose}
					onClientDeleted={loadClients}
					onClientUpdated={loadClients}
					initialEditMode={isEditMode}
				/>
			)}

			{/* Confirmation Dialog for Remove */}
			{isConfirmingRemove && selectedClient && (
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
									<strong>"{selectedClient.companyName}"</strong>?
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
								disabled={isRemoving === selectedClient.id}
							>
								Cancel
							</Button>
							<Button
								onClick={async () => {
									setIsRemoving(selectedClient.id!);
									try {
										const result = await deleteClient(selectedClient.id!);

										if (result.error) {
											toast.error(result.error);
											return;
										}

										toast.success("Client removed successfully!");
										setIsConfirmingRemove(false);

										// Close the dialog
										handleDialogClose();

										// Reload clients list
										await loadClients();

										if (onClientDeleted) {
											await onClientDeleted();
										}
									} catch (error) {
										toast.error(
											"An unexpected error occurred while removing the client"
										);
									} finally {
										setIsRemoving(null);
									}
								}}
								size="sm"
								variant="destructive"
								disabled={isRemoving === selectedClient.id}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving === selectedClient.id
									? "Removing..."
									: "Remove Client"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
