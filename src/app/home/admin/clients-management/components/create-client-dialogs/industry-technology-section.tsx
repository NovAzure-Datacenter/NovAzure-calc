"use client";

import React from "react";
import { ChevronDown, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Building2 } from "lucide-react";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";

interface IndustryTechnologySectionProps {
	formData: {
		selectedIndustries: string[];
		selectedTechnologies: string[];
	};
	availableIndustries: Array<{ id: string; name: string; icon: React.ComponentType<{ className?: string }> }>;
	availableTechnologies: Array<{ id: string; name: string; icon: React.ComponentType<{ className?: string }> }>;
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
	onToggleIndustry: (industryId: string) => void;
	onToggleTechnology: (technologyId: string) => void;
}

export function IndustryTechnologySection({
	formData,
	availableIndustries,
	availableTechnologies,
	isLoadingIndustries,
	isLoadingTechnologies,
	onToggleIndustry,
	onToggleTechnology,
}: IndustryTechnologySectionProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700">
				Industry & Technology Focus
			</h3>
			
			{/* Industries Selection */}
			<div>
				<Label className="text-xs font-medium">Applicable Industries</Label>
				<div className="space-y-2 mt-1">
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
										: `Select Industries (${formData.selectedIndustries.length} selected)`}
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
											const isSelected = formData.selectedIndustries.includes(industry.id);
											return (
												<div
													key={industry.id}
													className="flex items-center space-x-2 p-1 rounded hover:bg-white"
												>
													<Checkbox
														id={`industry-${industry.id}`}
														checked={isSelected}
														onCheckedChange={() => onToggleIndustry(industry.id)}
														className="h-3 w-3"
													/>
													<label
														htmlFor={`industry-${industry.id}`}
														className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
													>
														<div className="flex items-center gap-1">
															<industry.icon className="h-3 w-3" />
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

					{/* Selected industries display */}
					{formData.selectedIndustries.length > 0 && (
						<div className="space-y-1">
							<div className="text-xs font-medium text-gray-700">
								Selected Industries:
							</div>
							<div className="flex flex-wrap gap-1">
								{formData.selectedIndustries.map((industryId) => {
									const industry = availableIndustries.find(
										(i) => i.id === industryId
									);
									return (
										<Badge
											key={industryId}
											variant="secondary"
											className="flex items-center gap-1 text-xs px-2 py-1"
										>
											{industry?.icon && <industry.icon className="h-3 w-3" />}
											<span className="truncate max-w-[100px]">
												{industry?.name || industryId}
											</span>
											<button
												type="button"
												onClick={() => onToggleIndustry(industryId)}
												className="ml-1 hover:text-destructive"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Technologies Selection */}
			<div>
				<Label className="text-xs font-medium">Applicable Technologies</Label>
				<div className="space-y-2 mt-1">
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
										: `Select Technologies (${formData.selectedTechnologies.length} selected)`}
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
											const isSelected = formData.selectedTechnologies.includes(technology.id);
											return (
												<div
													key={technology.id}
													className="flex items-center space-x-2 p-1 rounded hover:bg-white"
												>
													<Checkbox
														id={`technology-${technology.id}`}
														checked={isSelected}
														onCheckedChange={() => onToggleTechnology(technology.id)}
														className="h-3 w-3"
													/>
													<label
														htmlFor={`technology-${technology.id}`}
														className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
													>
														<div className="flex items-center gap-1">
															<technology.icon className="h-3 w-3" />
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

					{/* Selected technologies display */}
					{formData.selectedTechnologies.length > 0 && (
						<div className="space-y-1">
							<div className="text-xs font-medium text-gray-700">
								Selected Technologies:
							</div>
							<div className="flex flex-wrap gap-1">
								{formData.selectedTechnologies.map((technologyId) => {
									const technology = availableTechnologies.find(
										(t) => t.id === technologyId
									);
									return (
										<Badge
											key={technologyId}
											variant="secondary"
											className="flex items-center gap-1 text-xs px-2 py-1"
										>
											{technology?.icon && <technology.icon className="h-3 w-3" />}
											<span className="truncate max-w-[100px]">
												{technology?.name || technologyId}
											</span>
											<button
												type="button"
												onClick={() => onToggleTechnology(technologyId)}
												className="ml-1 hover:text-destructive"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
} 