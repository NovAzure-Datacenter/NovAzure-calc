import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, X } from "lucide-react";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import type { ClientData } from "@/lib/actions/client/client";

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

interface ClientIndustryTechnologyFocusProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
	industries: IndustryData[];
	technologies: TechnologyData[];
	availableIndustries: IndustryData[];
	availableTechnologies: TechnologyData[];
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
}

export function ClientIndustryTechnologyFocus({
	client,
	isEditing,
	onFieldChange,
	industries,
	technologies,
	availableIndustries,
	availableTechnologies,
	isLoadingIndustries,
	isLoadingTechnologies,
}: ClientIndustryTechnologyFocusProps) {
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
		const currentSelected = client.selectedIndustries || [];
		const isSelected = currentSelected.includes(industryId);

		const newSelected = isSelected
			? currentSelected.filter((id) => id !== industryId)
			: [...currentSelected, industryId];

		onFieldChange("selectedIndustries", newSelected);
	};

	const toggleTechnologySelection = (technologyId: string) => {
		const currentSelected = client.selectedTechnologies || [];
		const isSelected = currentSelected.includes(technologyId);

		const newSelected = isSelected
			? currentSelected.filter((id) => id !== technologyId)
			: [...currentSelected, technologyId];

		onFieldChange("selectedTechnologies", newSelected);
	};

	if (
		!client.selectedIndustries?.length &&
		!client.selectedTechnologies?.length &&
		!isEditing
	) {
		return null;
	}

	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<h4 className="font-medium text-sm mb-3">
					Industry & Technology Focus
				</h4>
				<div className="space-y-4">
					{/* Industries Section */}
					<div>
						<Label className="text-xs font-medium">Applicable Industries</Label>
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
															client.selectedIndustries?.length || 0
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
															client.selectedIndustries?.includes(
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
																		{stringToIconComponent(industry.icon) && (
																			<div className="h-3 w-3">
																				{React.createElement(
																					stringToIconComponent(industry.icon),
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
							{client.selectedIndustries?.length && (
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
											client.selectedIndustries.map((industryId, index) => (
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
											))
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
															client.selectedTechnologies?.length || 0
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
															client.selectedTechnologies?.includes(
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
																		toggleTechnologySelection(technology.id)
																	}
																	className="h-3 w-3"
																/>
																<label
																	htmlFor={`technology-${technology.id}`}
																	className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
																>
																	<div className="flex items-center gap-1">
																		{stringToIconComponent(technology.icon) && (
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
							{client.selectedTechnologies?.length && (
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
											client.selectedTechnologies.map((technologyId, index) => (
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
																toggleTechnologySelection(technologyId)
															}
															className="ml-1 hover:text-destructive"
														>
															<X className="h-3 w-3" />
														</button>
													)}
												</Badge>
											))
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
