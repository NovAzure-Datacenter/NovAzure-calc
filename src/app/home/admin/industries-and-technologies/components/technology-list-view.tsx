"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import type { Technology, Industry } from "../types";
import { Edit, MoreHorizontal, Trash2, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechnologyDetailDialog } from "./technology-detail-dialog";
import { toast } from "sonner";
import { deleteTechnology } from "@/lib/actions/technology/technology";

interface TechnologyListProps {
	technologies: Technology[];
	industries: Industry[];
	onTechnologyDeleted?: () => Promise<void>;
	onTechnologyUpdated?: () => Promise<void>;
}

const statusColors = {
	pending: "bg-yellow-100 text-yellow-800",
	verified: "bg-green-100 text-green-800",
};

export function TechnologyList({ technologies, industries, onTechnologyDeleted, onTechnologyUpdated }: TechnologyListProps) {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

	const getApplicableIndustryIcons = (tech: Technology) => {
		if (!tech.applicableIndustries) return [];

		return tech.applicableIndustries
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

	const handleDropdownButtonClick = (e: React.MouseEvent, techName: string) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === techName ? null : techName);
	};

	const handleDropdownItemClick = async (action: string, techName: string) => {
		setOpenDropdown(null);
		const tech = technologies.find((t) => t.name === techName);
		if (!tech) return;

		if (action === "View") {
			setSelectedTechnology(tech);
			setIsEditMode(false);
			setIsDialogOpen(true);
		} else if (action === "Edit") {
			setSelectedTechnology(tech);
			setIsEditMode(true);
			setIsDialogOpen(true);
		} else if (action === "Remove") {
			setSelectedTechnology(tech);
			setIsConfirmingRemove(true);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openDropdown]);

	return (
		<>
			<div className="h-[calc(100vh-200px)] overflow-y-auto">
				<Card className="rounded-md border p-2">
					<TooltipProvider>
						<Table>
							<TableHeader>
								<TableRow className="border-b">
									<TableHead className="h-8 px-2 py-1 text-xs font-medium">
										Icon
									</TableHead>
									<TableHead className="h-8 px-2 py-1 text-xs font-medium">
										Name
									</TableHead>
									<TableHead className="h-8 px-2 py-1 text-xs font-medium">
										Description
									</TableHead>
									<TableHead className="h-8 px-2 py-1 text-xs font-medium">
										Applicable Industries
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
								{technologies.map((tech) => {
									const applicableIndustries = getApplicableIndustryIcons(tech);

									return (
										<TableRow
											key={tech.id}
											className="hover:bg-muted/50"
										>
											<TableCell className="h-10 px-2 py-1">
												<div className="flex items-center justify-center bg-gray-100 rounded">
													<tech.icon className="h-4 w-4 text-gray-600" />
												</div>
											</TableCell>
											<TableCell className="h-10 px-2 py-1 font-medium text-sm">
												{tech.name}
											</TableCell>
											<TableCell className="h-10 px-2 py-1 max-w-xs truncate text-sm text-muted-foreground">
												<Tooltip>
													<TooltipTrigger asChild>
														<span>{tech.description}</span>
													</TooltipTrigger>
													<TooltipContent className="max-w-xs">
														<p className="text-sm">{tech.description}</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>
											<TableCell className="h-10 px-2 py-1">
												<div className="flex items-center gap-1">
													{applicableIndustries
														.slice(0, 3)
														.map((industry, index) => (
															<Tooltip key={index}>
																<TooltipTrigger asChild>
																	<div className="p-1 bg-gray-100 rounded">
																		<industry.icon className="h-3 w-3 text-gray-600" />
																	</div>
																</TooltipTrigger>
																<TooltipContent>
																	<p className="text-xs">{industry.name}</p>
																</TooltipContent>
															</Tooltip>
														))}
													{applicableIndustries.length > 3 && (
														<Tooltip>
															<TooltipTrigger asChild>
																<div className="p-1 bg-gray-100 rounded text-xs font-medium">
																	+{applicableIndustries.length - 3}
																</div>
															</TooltipTrigger>
															<TooltipContent>
																<div className="text-xs">
																	{applicableIndustries
																		.slice(3)
																		.map((industry, index) => (
																			<div key={index}>{industry.name}</div>
																		))}
																</div>
															</TooltipContent>
														</Tooltip>
													)}
												</div>
											</TableCell>
											<TableCell className="h-10 px-2 py-1">
												{tech.status && (
													<Badge
														variant="outline"
														className={`text-xs px-2 py-0.5 ${
															statusColors[tech.status]
														}`}
													>
														{tech.status}
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
															handleDropdownButtonClick(e, tech.name)
														}
													>
														<MoreHorizontal className="h-3 w-3" />
													</Button>

													{openDropdown === tech.name && (
														<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("View", tech.name)
																}
															>
																<Eye className="h-3 w-3" />
																View
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("Edit", tech.name)
																}
															>
																<Edit className="h-3 w-3" />
																Edit
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
																onClick={() =>
																	handleDropdownItemClick("Remove", tech.name)
																}
																disabled={isRemoving === tech.id}
															>
																<Trash2 className="h-3 w-3" />
																{isRemoving === tech.id
																	? "Removing..."
																	: "Remove"}
															</button>
														</div>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TooltipProvider>
				</Card>
			</div>

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
