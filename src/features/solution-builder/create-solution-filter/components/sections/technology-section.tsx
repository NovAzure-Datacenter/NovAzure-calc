import { TechnologySectionProps } from "@/features/solution-builder/types/types";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import React from "react";

/**
 * TechnologySection component - Renders the technology selection section
 */
export default function TechnologySection(props: TechnologySectionProps) {
	const {
		selectedTechnology,
		clientSelectedTechnologies,
		otherTechnologies,
		technologiesForSelectedIndustry,
		canSelectTechnology,
		isLoadingTechnologies,
		onTechnologySelect,
		getSelectedIndustry,
		getSelectedTechnology,
		renderSelectionCard,
	} = props;
	return (
		<div className="space-y-4">
			{/* Technology Progress Indicator */}
			<div className="flex items-center gap-2 mb-2">
				<div
					className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
						selectedTechnology
							? "bg-green-500 text-white"
							: canSelectTechnology
							? "bg-muted text-muted-foreground"
							: "bg-gray-200 text-gray-400"
					}`}
				>
					{selectedTechnology ? (
						<Check className="h-3 w-3" />
					) : canSelectTechnology ? (
						"2"
					) : (
						"2"
					)}
				</div>
				<span
					className={`text-sm ${
						selectedTechnology
							? "font-medium"
							: canSelectTechnology
							? ""
							: "text-muted-foreground"
					}`}
				>
					Technology Selection
				</span>
			</div>

			{/* Collapsed State - When technology is selected */}
			{selectedTechnology ? (
				<div className="p-3 border-2 border-green-200 rounded-md bg-green-50">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Check className="h-4 w-4 text-green-600" />
							<div className="flex items-center gap-2">
								{getSelectedTechnology()?.icon &&
									stringToIconComponent(getSelectedTechnology()?.icon) && (
										<div className="h-4 w-4">
											{React.createElement(
												stringToIconComponent(getSelectedTechnology()?.icon),
												{
													className: "h-4 w-4",
												}
											)}
										</div>
									)}
								<span className="font-medium text-sm">
									{getSelectedTechnology()?.name}
								</span>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onTechnologySelect("")}
							className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
						>
							Change
						</Button>
					</div>
				</div>
			) : (
				/* Expanded State - When no technology is selected */
				<>
					<div>
						<p className="text-xs text-muted-foreground mb-3">
							{canSelectTechnology
								? `Choose the technology that applies to ${
										getSelectedIndustry()?.name || "your selected industry"
								  }`
								: "Please select an industry first to choose available technologies"}
						</p>
					</div>

					{/* Client's Selected Technologies */}
					{clientSelectedTechnologies.length > 0 && canSelectTechnology && (
						<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Your Organization&apos;s Technologies
							</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedTechnologies.map((technologyId: string) => {
									const technology = technologiesForSelectedIndustry.find(
										(t) => t.id === technologyId
									);
									if (!technology) return null;
									return renderSelectionCard(
										technology,
										technologyId,
										selectedTechnology === technologyId,
										onTechnologySelect
									);
								})}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
