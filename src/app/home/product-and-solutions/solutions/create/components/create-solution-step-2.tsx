"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";

interface CreateSolutionStep2Props {
	clientData: any;
	availableTechnologies: any[];
	isLoadingTechnologies: boolean;
	selectedTechnology: string;
	onTechnologySelect: (technologyId: string) => void;
}

export function CreateSolutionStep2({
	clientData,
	availableTechnologies,
	isLoadingTechnologies,
	selectedTechnology,
	onTechnologySelect,
}: CreateSolutionStep2Props) {
	return (
		<div className="space-y-3">
			<div>
				<Label className="text-sm font-medium">Available Technologies</Label>
				<p className="text-xs text-muted-foreground mb-2">
					Select from your organization's available technologies
				</p>
				{isLoadingTechnologies ? (
					<div className="flex items-center justify-center py-6">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
						<span className="ml-2 text-sm">Loading technologies...</span>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						{clientData?.selected_technologies?.map((technologyId: string) => {
							const technology = availableTechnologies.find(
								(t) => t.id === technologyId
							);
							if (!technology) return null;

							return (
								<div
									key={technologyId}
									className={`p-3 border rounded-md cursor-pointer transition-colors ${
										selectedTechnology === technologyId
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
									onClick={() => onTechnologySelect(technologyId)}
								>
									<div className="flex items-center gap-2">
										<Checkbox
											checked={selectedTechnology === technologyId}
											onCheckedChange={() => onTechnologySelect(technologyId)}
										/>
										<div className="flex items-center gap-2">
											{technology.icon &&
												stringToIconComponent(technology.icon) && (
													<div className="h-4 w-4">
														{React.createElement(
															stringToIconComponent(technology.icon),
															{ className: "h-4 w-4" }
														)}
													</div>
												)}
											<span className="font-medium text-sm">
												{technology.name}
											</span>
										</div>
									</div>
									<p className="text-xs text-muted-foreground mt-1 ml-6">
										{technology.description}
									</p>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
} 