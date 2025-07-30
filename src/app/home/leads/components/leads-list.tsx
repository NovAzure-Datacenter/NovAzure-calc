"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	AlertTriangle,
	Mail,
	Phone,
	Calendar,
	User,
	MessageSquare,
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
import { mockLeads, type Lead } from "../mock-data";
import { getUserById } from "@/lib/actions/user/user";
import { type LeadData } from "@/lib/actions/clients-leads/clients-leads";

interface LeadsListProps {
	leads?: LeadData[];
	onLeadDeleted?: () => Promise<void>;
	refreshTrigger?: number;
}

interface UserData {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
}

export default function LeadsList({
	leads = [],
	onLeadDeleted,
	refreshTrigger,
}: LeadsListProps) {
	const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [userData, setUserData] = useState<Record<string, UserData>>({});

	// Status options for leads
	const statusOptions = [
		{
			value: "New",
			label: "New",
			variant: "default",
			color: "bg-blue-100 text-blue-800 border-blue-200",
		},
		{
			value: "Contacted",
			label: "Contacted",
			variant: "secondary",
			color: "bg-yellow-100 text-yellow-800 border-yellow-200",
		},
		{
			value: "Qualified",
			label: "Qualified",
			variant: "outline",
			color: "bg-green-100 text-green-800 border-green-200",
		},
		{
			value: "Converted",
			label: "Converted",
			variant: "destructive",
			color: "bg-purple-100 text-purple-800 border-purple-200",
		},
	];

	// Load user data for all leads
	useEffect(() => {
		const loadUserData = async () => {
			const uniqueUserIds = Array.from(
				new Set(leads.map((lead) => lead.created_by))
			);
			const userDataMap: Record<string, UserData> = {};

			for (const userId of uniqueUserIds) {
				try {
					const result = await getUserById(userId);
					if (result.success && result.user) {
						userDataMap[userId] = {
							id: result.user.id,
							first_name: result.user.first_name,
							last_name: result.user.last_name,
							email: result.user.email,
						};
					}
				} catch (error) {
					console.error(`Error loading user data for ${userId}:`, error);
				}
			}

			setUserData(userDataMap);
		};

		loadUserData();
	}, [leads]);

	// Helper function to format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Helper function to get time ago
	const getTimeAgo = (dateString: string) => {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now.getTime() - date.getTime();
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) return "Today";
		if (diffInDays === 1) return "Yesterday";
		if (diffInDays < 7) return `${diffInDays} days ago`;
		if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
		return `${Math.floor(diffInDays / 30)} months ago`;
	};

	// Helper function to get status display info
	const getStatusDisplay = (status: string) => {
		const statusOption = statusOptions.find(
			(option) => option.value.toLowerCase() === status?.toLowerCase()
		);
		return statusOption || statusOptions[0]; // Default to "New" if status not found
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedLead(null);
		setIsEditMode(false);
	};

	const handleDropdownButtonClick = (e: React.MouseEvent, leadId: string) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === leadId ? null : leadId);
	};

	const handleDropdownItemClick = async (action: string, leadId: string) => {
		setOpenDropdown(null);

		const lead = leads.find((l) => l.id === leadId);
		if (!lead) return;

		if (action === "View") {
			setSelectedLead(lead);
			setIsEditMode(false);
			setIsDialogOpen(true);
		} else if (action === "Edit") {
			setSelectedLead(lead);
			setIsEditMode(true);
			setIsDialogOpen(true);
		} else if (action === "Remove") {
			setSelectedLead(lead);
			setIsConfirmingRemove(true);
		}
	};

	const handleEmailClick = (email: string) => {
		window.open(`mailto:${email}`, "_blank");
	};

	const handlePhoneClick = (phone: string) => {
		window.open(`tel:${phone}`, "_blank");
	};

	// Close dropdown when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				openDropdown &&
				!(event.target as Element).closest(".dropdown-container")
			) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openDropdown]);

	//console.log(leads);
	return (
		<div className="h-[calc(100vh-200px)] overflow-y-auto">
			<Card className="rounded-md border p-2">
				<TooltipProvider>
					<Table>
						<TableHeader>
							<TableRow className="border-b">
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Status
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Name
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Contact Email
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Contact Phone
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Company Name
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Scenarios
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Notes
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Last Contacted
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Created By
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{leads.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={10}
										className="text-center py-8 text-muted-foreground"
									>
										No leads found. Create your first lead to get started.
									</TableCell>
								</TableRow>
							) : (
								leads.map((lead) => {
									const user = userData[lead.created_by];
									const statusDisplay = getStatusDisplay(lead.status || "New");
									return (
										<TableRow key={lead.id} className="hover:bg-muted/50">
											<TableCell className="h-10 px-2 py-1">
												<Badge
													className={`text-xs px-2 py-0.5 ${statusDisplay.color}`}
												>
													{statusDisplay.label}
												</Badge>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<div className="font-medium text-sm">
													{lead.first_name} {lead.last_name}
												</div>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-6 px-2 text-xs text-gray-600 hover:text-gray-800"
															onClick={() =>
																handleEmailClick(lead.contact_email)
															}
														>
															<Mail className="h-3 w-3 mr-1" />
															<span className="truncate max-w-[120px]">
																{lead.contact_email}
															</span>
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm">{lead.contact_email}</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-6 px-2 text-xs text-gray-600 hover:text-gray-800"
															onClick={() =>
																handlePhoneClick(lead.contact_phone)
															}
														>
															<Phone className="h-3 w-3 mr-1" />
															<span className="truncate max-w-[120px]">
																{lead.contact_phone}
															</span>
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm">{lead.contact_phone}</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Badge
													variant="secondary"
													className="text-xs px-2 py-0.5"
												>
													{lead.company_name || "Unknown Company"}
												</Badge>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Badge
													variant="outline"
													className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
												>
													{lead.associated_scenarios.length} scenarios
												</Badge>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="max-w-[200px]">
															<div className="text-xs text-muted-foreground truncate">
																{lead.notes}
															</div>
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm max-w-[300px]">
															{lead.notes}
														</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												<div>
													<div className="text-xs font-medium">
														{formatDate(lead.last_contacted)}
													</div>
													<div className="text-xs text-muted-foreground">
														{getTimeAgo(lead.last_contacted)}
													</div>
												</div>
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												{user ? (
													<Badge
														variant="outline"
														className="text-xs px-2 py-0.5"
													>
														<User className="h-3 w-3 mr-1" />
														{user.first_name} {user.last_name}
													</Badge>
												) : (
													<Badge
														variant="outline"
														className="text-xs px-2 py-0.5"
													>
														<User className="h-3 w-3 mr-1" />
														{lead.created_by}
													</Badge>
												)}
											</TableCell>

											<TableCell className="h-10 px-2 py-1">
												{/* Custom Simple Dropdown */}
												<div className="relative dropdown-container">
													<Button
														variant="ghost"
														className="h-6 w-6 p-0"
														onClick={(e) =>
															handleDropdownButtonClick(e, lead.id)
														}
													>
														<MoreHorizontal className="h-3 w-3" />
													</Button>

													{openDropdown === lead.id && (
														<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("View", lead.id)
																}
															>
																<Eye className="h-3 w-3" />
																View
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("Edit", lead.id)
																}
															>
																<Edit className="h-3 w-3" />
																Edit
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
																onClick={() =>
																	handleDropdownItemClick("Remove", lead.id)
																}
																disabled={isRemoving === lead.id}
															>
																<Trash2 className="h-3 w-3" />
																{isRemoving === lead.id
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

			{/* Confirmation Dialog for Remove */}
			{isConfirmingRemove && selectedLead && (
				<Dialog open={isConfirmingRemove} onOpenChange={setIsConfirmingRemove}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
								Remove Lead
							</DialogTitle>
							<DialogDescription className="space-y-2">
								<p>
									Are you sure you want to remove{" "}
									<strong>
										"{selectedLead.first_name} {selectedLead.last_name}"
									</strong>
									?
								</p>
								<p className="text-sm text-muted-foreground">
									This will permanently delete the lead and all associated data
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
								disabled={isRemoving === selectedLead.id}
							>
								Cancel
							</Button>
							<Button
								onClick={async () => {
									setIsRemoving(selectedLead.id);
									try {
										// Call the onLeadDeleted callback to refresh the data
										if (onLeadDeleted) {
											await onLeadDeleted();
										}

										toast.success("Lead removed successfully!");
										setIsConfirmingRemove(false);
									} catch (error) {
										toast.error(
											"An unexpected error occurred while removing the lead"
										);
									} finally {
										setIsRemoving(null);
									}
								}}
								size="sm"
								variant="destructive"
								disabled={isRemoving === selectedLead.id}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving === selectedLead.id ? "Removing..." : "Remove Lead"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
