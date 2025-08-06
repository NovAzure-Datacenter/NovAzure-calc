"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Edit, Trash2, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Industry } from "../types";
import { TechnologyIcons, CompanyIcons } from "@/components/icons/technology-company-icons";
import { IndustryDetailDialog } from "./industry-detail-dialog";
import { deleteIndustry } from "@/lib/actions/industry/industry";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getIndustryStatusColor, getParameterCategoryColor } from "../utils/color-utils";
import { getClients, ClientData } from "@/lib/actions/clients/clients";

export function GridView({ data, onIndustryDeleted }: { 
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

	// Load clients data to resolve company IDs to names
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

	const getParameterSummary = (parameters: Industry["parameters"]) => {
		if (!parameters || parameters.length === 0) return null;

		const categories = parameters.reduce((acc, param) => {
			acc[param.category] = (acc[param.category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return categories;
	};

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

	const handleDropdownItemClick = async (action: string, industryName: string) => {
		setOpenDropdown(null);
		
		const industry = data.find(ind => ind.name === industryName);
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
		<>
			<Card className="h-[calc(100vh-200px)] relative">
				<CardContent className="h-full overflow-y-auto relative">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{data.map((industry) => {
							const parameterSummary = getParameterSummary(industry.parameters);

							return (
								<Card
									key={industry.id}
									className="p-4 hover:shadow-md transition-shadow duration-200"
								>
									<CardContent className="p-0 space-y-4">
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3">
												<industry.logo className="h-8 w-8 flex-shrink-0" />
												<div className="min-w-0">
													<h3 className="font-semibold text-sm">
														{industry.name}
													</h3>
													<p className="text-xs text-muted-foreground line-clamp-2">
														{industry.description}
													</p>
												</div>
											</div>
										</div>

										<div className="flex items-center gap-4">
											<div className="flex-1">
												<TechnologyIcons technologies={industry.technologies} />
											</div>
											<Separator orientation="vertical" className="h-6" />
											<div className="flex-1">
												<CompanyIcons companies={industry.companies} clients={transformedClients} />
											</div>
										</div>

										{/* Parameters Summary */}
										{parameterSummary && (
											<>
												<Separator />
												<div className="h-16">
													<h4 className="text-xs font-medium text-muted-foreground mb-2">
														Parameters ({industry.parameters?.length || 0})
													</h4>
													<div className="flex flex-wrap gap-1">
														{Object.entries(parameterSummary).map(
															([category, count]) => (
																<Badge
																	key={category}
																	className={`text-xs px-2 py-0.5 ${getParameterCategoryColor(
																		category
																	)}`}
																>
																	{category.charAt(0).toUpperCase() +
																		category.slice(1)}
																	: {count}
																</Badge>
															)
														)}
													</div>
												</div>
											</>
										)}

										<Separator />

										<div className="flex items-center justify-between">
											<div className="flex gap-2">
												<Badge className={getIndustryStatusColor(industry.status)}>
													{industry.status || "pending"}
												</Badge>
											</div>

											{/* Custom Simple Dropdown */}
											<div className="relative dropdown-container">
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) =>
														handleDropdownButtonClick(e, industry.name)
													}
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>

												{openDropdown === industry.name && (
													<div className="absolute right-9 -top-1 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[120px]">
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={(e) =>
																handleDropdownItemClick("View", industry.name)
															}
														>
															<Eye className="h-4 w-4" />
															View
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={(e) =>
																handleDropdownItemClick("Edit", industry.name)
															}
														>
															<Edit className="h-4 w-4" />
															Edit
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
															onClick={(e) =>
																handleDropdownItemClick("Remove", industry.name)
															}
															disabled={isRemoving === industry.id}
														>
															<Trash2 className="h-4 w-4" />
															{isRemoving === industry.id ? "Removing..." : "Remove"}
														</button>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</CardContent>
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
									<strong>&quot;{selectedIndustry.name}&quot;</strong>?
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
										toast.error("An unexpected error occurred while removing the industry");
									} finally {
										setIsRemoving(null);
									}
								}}
								size="sm"
								variant="destructive"
								disabled={isRemoving === selectedIndustry.id}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving === selectedIndustry.id ? "Removing..." : "Remove Industry"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
