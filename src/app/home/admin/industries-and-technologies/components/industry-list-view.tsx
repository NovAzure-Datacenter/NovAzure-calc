"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
	MoreHorizontal,
	Plus,
	Edit,
	Trash2,
	DollarSign,
	Zap,
	Leaf,
	Settings,
	Building2,
	Eye,
	AlertTriangle,
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
import { toast } from "sonner";
import { Industry } from "../types";
import { TechnologyIcons, CompanyIcons } from "@/components/icons/technology-company-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndustryDetailDialog } from "./industry-detail-dialog";
import { deleteIndustry } from "@/lib/actions/industry/industry";
import { getClients, ClientData } from "@/lib/actions/client/client";

interface IndustryDetailDialogProps {
	industry: Industry | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onIndustryDeleted?: () => Promise<void>;
	isEditMode: boolean;
}

export function TableView({
	data,
	onIndustryDeleted,
}: {
	data: Industry[];
	onIndustryDeleted?: () => Promise<void>;
}) {
	const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [clients, setClients] = useState<ClientData[]>([]);

	const statusColors = {
		pending: "bg-yellow-100 text-yellow-800",
		verified: "bg-green-100 text-green-800",
	};


	const loadClients = async () => {
		try {
			const result = await getClients();
			if (result.clients) {
				setClients(result.clients);
			}
		} catch (error) {
			console.error("Error loading clients:", error);
		}
	};



	useEffect(() => {
		loadClients();
	}, []);

	useEffect(() => {
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

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedIndustry(null);
		setIsEditMode(false);
	};

	const handleDropdownButtonClick = (
		e: React.MouseEvent,
		industryName: string
	) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === industryName ? null : industryName);
	};

	const handleDropdownItemClick = async (
		action: string,
		industryName: string
	) => {
		setOpenDropdown(null);

		const industry = data.find((ind) => ind.name === industryName);
		if (!industry) return;

		if (action === "View") {
			setSelectedIndustry(industry);
			setIsEditMode(false);
			setIsDialogOpen(true);
		} else if (action === "Edit") {
			setSelectedIndustry(industry);
			setIsEditMode(true);
			setIsDialogOpen(true);
		} else if (action === "Remove") {
			setSelectedIndustry(industry);
			setIsConfirmingRemove(true);
		}
	};

	// Transform clients data to match CompanyIcons expected format
	const transformedClients = clients.map(client => ({
		id: client.id,
		companyName: client.company_name,
		logo: client.logo
	}));

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
									Name
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Description
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Technologies
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Companies
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Status
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((industry) => (
								<TableRow key={industry.id} className="hover:bg-muted/50">
									<TableCell className="h-10 px-2 py-1">
										<div className="flex items-center justify-center bg-gray-100 rounded">
											<industry.logo className="h-4 w-4 text-gray-600" />
										</div>
									</TableCell>

									<TableCell className="h-10 px-2 py-1 font-medium text-sm">
										{industry.name}
									</TableCell>
									<TableCell className="h-10 px-2 py-1 max-w-xs truncate text-sm text-muted-foreground">
										<Tooltip>
											<TooltipTrigger asChild>
												<span>{industry.description}</span>
											</TooltipTrigger>
											<TooltipContent className="max-w-xs">
												<p className="text-sm">{industry.description}</p>
											</TooltipContent>
										</Tooltip>
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										<TechnologyIcons technologies={industry.technologies} />
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										<CompanyIcons
											companies={industry.companies}
											clients={transformedClients}
										/>
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										<Badge
											variant="outline"
											className={`text-xs px-2 py-0.5 ${
												statusColors[industry.status]
											}`}
										>
											{industry.status}
										</Badge>
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										{/* Custom Simple Dropdown */}
										<div className="relative dropdown-container">
											<Button
												variant="ghost"
												className="h-6 w-6 p-0"
												onClick={(e) =>
													handleDropdownButtonClick(e, industry.name)
												}
											>
												<MoreHorizontal className="h-3 w-3" />
											</Button>

											{openDropdown === industry.name && (
												<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
													<button
														className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
														onClick={() =>
															handleDropdownItemClick("View", industry.name)
														}
													>
														<Eye className="h-3 w-3" />
														View
													</button>
													<button
														className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
														onClick={() =>
															handleDropdownItemClick("Edit", industry.name)
														}
													>
														<Edit className="h-3 w-3" />
														Edit
													</button>
													<button
														className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
														onClick={() =>
															handleDropdownItemClick("Remove", industry.name)
														}
														disabled={isRemoving === industry.id}
													>
														<Trash2 className="h-3 w-3" />
														{isRemoving === industry.id
															? "Removing..."
															: "Remove"}
													</button>
												</div>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TooltipProvider>
			</Card>

			<IndustryDetailDialog
				industry={selectedIndustry}
				open={isDialogOpen}
				onOpenChange={handleDialogClose}
				onIndustryDeleted={onIndustryDeleted}
				isEditMode={isEditMode}
			/>

			{/* Confirmation Dialog for Remove */}
			{isConfirmingRemove && selectedIndustry && (
				<Dialog open={isConfirmingRemove} onOpenChange={setIsConfirmingRemove}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
								Remove Industry
							</DialogTitle>
							<DialogDescription className="space-y-2">
								<p>
									Are you sure you want to remove{" "}
									<strong>"{selectedIndustry.name}"</strong>?
								</p>
								<p className="text-sm text-muted-foreground">
									This will permanently delete the industry
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
								disabled={isRemoving === selectedIndustry.id}
							>
								Cancel
							</Button>
							<Button
								onClick={async () => {
									setIsRemoving(selectedIndustry.id);
									try {
										const result = await deleteIndustry(selectedIndustry.id);

										if (result.error) {
											toast.error(result.error);
										} else {
											toast.success("Industry removed successfully!");
											setIsConfirmingRemove(false);
											if (onIndustryDeleted) {
												await onIndustryDeleted();
											}
										}
									} catch (error) {
										toast.error(
											"An unexpected error occurred while removing the industry"
										);
									} finally {
										setIsRemoving(null);
									}
								}}
								size="sm"
								variant="destructive"
								disabled={isRemoving === selectedIndustry.id}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving === selectedIndustry.id
									? "Removing..."
									: "Remove Industry"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
