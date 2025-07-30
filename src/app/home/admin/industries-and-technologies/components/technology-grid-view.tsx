"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
	MoreHorizontal,
	Edit,
	Trash2,
	DollarSign,
	Zap,
	Leaf,
	Clock,
	TrendingUp,
	Eye,
	AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Technology, Industry } from "../types";
import { TechnologyDetailDialog } from "./technology-detail-dialog";
import { deleteTechnology } from "@/lib/actions/technology/technology";
import { getTechnologyStatusColor } from "../utils/color-utils";

interface TechnologyGridViewProps {
	data: Technology[];
	industries: Industry[]; 
	onTechnologyDeleted?: () => Promise<void>;
	onTechnologyUpdated?: () => Promise<void>;
}

export function TechnologyGridView({ data, industries, onTechnologyDeleted, onTechnologyUpdated }: TechnologyGridViewProps) {
	const [selectedTechnology, setSelectedTechnology] =
		useState<Technology | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

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

	const getApplicableIndustries = (technology: Technology) => {
		if (!technology.applicableIndustries) return [];

		return technology.applicableIndustries
			.map((industryId) => {
				const industry = industries.find((ind) => ind.id === industryId);
				return industry ? { name: industry.name, icon: industry.logo } : null;
			})
			.filter(
				(
					item
				): item is {
					name: string;
					icon: React.ComponentType<{ className?: string }>;
				} => item !== null
			);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedTechnology(null);
		setIsEditMode(false);
	};

	const handleDropdownButtonClick = (
		e: React.MouseEvent,
		technologyName: string
	) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === technologyName ? null : technologyName);
	};

	const handleDropdownItemClick = async (
		action: string,
		technologyName: string
	) => {
		setOpenDropdown(null);
		const technology = data.find((tech) => tech.name === technologyName);
		if (!technology) return;

		if (action === "View") {
			setSelectedTechnology(technology);
			setIsEditMode(false);
			setIsDialogOpen(true);
		} else if (action === "Edit") {
			setSelectedTechnology(technology);
			setIsEditMode(true);
			setIsDialogOpen(true);
		} else if (action === "Remove") {
			setSelectedTechnology(technology);
			setIsConfirmingRemove(true);
		}
	};

	return (
		<>
			<Card className="h-[calc(100vh-200px)] relative">
				<CardContent className="h-full overflow-y-auto relative">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{data.map((technology) => {
							const applicableIndustries = getApplicableIndustries(technology);

							return (
								<Card
									key={technology.id}
									className="p-4 hover:shadow-md transition-shadow duration-200"
								>
									<CardContent className="p-0 space-y-4">
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3">
												<technology.icon className="h-8 w-8 flex-shrink-0" />
												<div className="min-w-0">
													<h3 className="font-semibold text-sm">
														{technology.name}
													</h3>
													<p className="text-xs text-muted-foreground line-clamp-2">
														{technology.description}
													</p>
												</div>
											</div>
										</div>

										{/* Applicable Industries */}
										{applicableIndustries.length > 0 && (
											<>
												<Separator />
												<div>
													<h4 className="text-xs font-medium text-muted-foreground mb-2">
														Industries ({applicableIndustries.length})
													</h4>
													<div className="flex flex-wrap gap-1">
														{applicableIndustries
															.slice(0, 3)
															.map((industry, index) => (
																<div
																	key={index}
																	className="flex items-center gap-1"
																>
																	<industry.icon className="h-3 w-3" />
																	<span className="text-xs text-muted-foreground">
																		{industry.name}
																	</span>
																</div>
															))}
														{applicableIndustries.length > 3 && (
															<span className="text-xs text-muted-foreground">
																+{applicableIndustries.length - 3} more
															</span>
														)}
													</div>
												</div>
											</>
										)}

										<Separator />

										<div className="flex items-center justify-between">
											<div className="flex gap-2">
												<Badge className={getTechnologyStatusColor(technology.status)}>
													{technology.status || "pending"}
												</Badge>
											</div>

											{/* Custom Simple Dropdown */}
											<div className="relative dropdown-container">
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) =>
														handleDropdownButtonClick(e, technology.name)
													}
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>

												{openDropdown === technology.name && (
													<div className="absolute right-9 -top-1 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[120px]">
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={(e) =>
																handleDropdownItemClick("View", technology.name)
															}
														>
															<Eye className="h-4 w-4" />
															View
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={(e) =>
																handleDropdownItemClick("Edit", technology.name)
															}
														>
															<Edit className="h-4 w-4" />
															Edit
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
															onClick={(e) =>
																handleDropdownItemClick(
																	"Remove",
																	technology.name
																)
															}
															disabled={isRemoving === technology.id}
														>
															<Trash2 className="h-4 w-4" />
															{isRemoving === technology.id
																? "Removing..."
																: "Remove"}
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

			<TechnologyDetailDialog
				technology={selectedTechnology}
				open={isDialogOpen}
				onOpenChange={handleDialogClose}
				industries={industries}
				onTechnologyDeleted={onTechnologyDeleted}
				onTechnologyUpdated={onTechnologyUpdated}
				isEditMode={isEditMode}
			/>

			{/* Confirmation Dialog for Remove */}
			{isConfirmingRemove && selectedTechnology && (
				<Dialog open={isConfirmingRemove} onOpenChange={setIsConfirmingRemove}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
								Remove Technology
							</DialogTitle>
							<DialogDescription className="space-y-2">
								<p>
									Are you sure you want to remove{" "}
									<strong>"{selectedTechnology.name}"</strong>?
								</p>
								<p className="text-sm text-muted-foreground">
									This will permanently delete the technology
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
								disabled={isRemoving === selectedTechnology.id}
							>
								Cancel
							</Button>
							<Button
								onClick={async () => {
									setIsRemoving(selectedTechnology.id || "");
									try {
										const result = await deleteTechnology(selectedTechnology.id || "");

										if (result.error) {
											toast.error(result.error);
										} else {
											toast.success("Technology removed successfully!");
											setIsConfirmingRemove(false);
											if (onTechnologyDeleted) {
												await onTechnologyDeleted();
											}
										}
									} catch (error) {
										toast.error("An unexpected error occurred while removing the technology");
									} finally {
										setIsRemoving(null);
									}
								}}
								size="sm"
								variant="destructive"
								disabled={isRemoving === selectedTechnology.id}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving === selectedTechnology.id ? "Removing..." : "Remove Technology"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
