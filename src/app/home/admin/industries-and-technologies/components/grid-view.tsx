"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Industry } from "../types";
import { TechnologyIcons, CompanyIcons } from "./icons";
import { IndustryDetailDialog } from "./industry-detail-dialog";

export function GridView({ data }: { data: Industry[] }) {
	const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	// Close dropdown when clicking outside
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

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "cost":
				return "bg-param-cost text-param-cost";
			case "performance":
				return "bg-param-performance text-param-performance";
			case "environmental":
				return "bg-param-environmental text-param-environmental";
			case "operational":
				return "bg-param-operational text-param-operational";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getParameterSummary = (parameters: Industry["parameters"]) => {
		if (!parameters || parameters.length === 0) return null;

		const categories = parameters.reduce((acc, param) => {
			acc[param.category] = (acc[param.category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return categories;
	};

	const handleCardClick = (industry: Industry) => {
		setSelectedIndustry(industry);
		setIsDialogOpen(true);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedIndustry(null);
	};

	const handleDropdownButtonClick = (
		e: React.MouseEvent,
		industryName: string
	) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === industryName ? null : industryName);
	};

	const handleDropdownItemClick = (action: string, industryName: string) => {
		setOpenDropdown(null);
	};

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
									className="p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
									onClick={() => handleCardClick(industry)}
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
												<CompanyIcons companies={industry.companies} />
											</div>
										</div>

										{/* Parameters Summary */}
										{parameterSummary && (
											<>
												<Separator />
												<div>
													<h4 className="text-xs font-medium text-muted-foreground mb-2">
														Parameters ({industry.parameters?.length || 0})
													</h4>
													<div className="flex flex-wrap gap-1">
														{Object.entries(parameterSummary).map(
															([category, count]) => (
																<Badge
																	key={category}
																	className={`text-xs px-2 py-0.5 ${getCategoryColor(
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
											<Badge
												variant={
													industry.status === "verified"
														? "default"
														: "secondary"
												}
											>
												{industry.status}
											</Badge>

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
													<div className="absolute right-9 -top-1 mt-1 bg-white border border-gray-200 rounded-md shadow-lg  min-w-[120px]">
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={() =>
																handleDropdownItemClick("Add", industry.name)
															}
														>
															<Plus className="h-4 w-4" />
															Add
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={() =>
																handleDropdownItemClick("Edit", industry.name)
															}
														>
															<Edit className="h-4 w-4" />
															Edit
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={() =>
																handleDropdownItemClick("Remove", industry.name)
															}
														>
															<Trash2 className="h-4 w-4" />
															Remove
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
			/>
		</>
	);
}
