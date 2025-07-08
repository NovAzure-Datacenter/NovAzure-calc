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
	// Get client's selected technologies
	const clientSelectedTechnologies = clientData?.selected_technologies || [];
	
	// Get all other technologies (excluding client's selected ones)
	const otherTechnologies = availableTechnologies.filter(
		(technology) => !clientSelectedTechnologies.includes(technology.id)
	);

	// Helper function to render technology card
	const renderTechnologyCard = (technology: any, technologyId: string) => (
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

	return (
		<div className="h-full max-h-[calc(100vh-200px)] flex flex-col">
			{isLoadingTechnologies ? (
				<div className="flex items-center justify-center py-6">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
					<span className="ml-2 text-sm">Loading technologies...</span>
				</div>
			) : (
				<>
					{/* Client's Selected Technologies Section */}
					<div className="flex-shrink-0 mb-6">
						<Label className="text-sm font-medium">Your Organization's Technologies</Label>
						<p className="text-xs text-muted-foreground mb-2">
							Select from your organization's available technologies
						</p>
						{clientSelectedTechnologies.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedTechnologies.map((technologyId: string) => {
									const technology = availableTechnologies.find(
										(t) => t.id === technologyId
									);
									if (!technology) return null;

									return renderTechnologyCard(technology, technologyId);
								})}
							</div>
						) : (
							<div className="text-sm text-muted-foreground py-4 text-center">
								No technologies selected for your organization
							</div>
						)}
					</div>

					{/* All Available Technologies Section */}
					<div className="flex-1 min-h-0">
						<Label className="text-sm font-medium">All Available Technologies</Label>
						<p className="text-xs text-muted-foreground mb-2">
							Select from all available technologies if needed
						</p>
						{otherTechnologies.length > 0 ? (
							<div className="h-full max-h-[600px] overflow-y-auto pr-2">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{otherTechnologies.map((technology) => 
										renderTechnologyCard(technology, technology.id)
									)}
								</div>
							</div>
						) : (
							<div className="text-sm text-muted-foreground py-4 text-center">
								No additional technologies available
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
} 