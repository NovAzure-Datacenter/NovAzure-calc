import { IndustrySectionProps } from "@/features/solution-builder/types/types";
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
 * IndustrySection component - Renders the industry selection section
 */
export default function IndustrySection(props: IndustrySectionProps) {
	const {
		selectedIndustry,
		clientSelectedIndustries,
		otherIndustries,
		availableIndustries,
		isLoadingIndustries,
		onIndustrySelect,
		openAccordion,
		setOpenAccordion,
		getSelectedIndustry,
		renderSelectionCard,
	} = props;
	return (
		<div className="space-y-4">
			{/* Industry Progress Indicator */}
			<div className="flex items-center gap-2 mb-2">
				<div
					className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
						selectedIndustry
							? "bg-green-500 text-white"
							: "bg-muted text-muted-foreground"
					}`}
				>
					{selectedIndustry ? <Check className="h-3 w-3" /> : "1"}
				</div>
				<span className={`text-sm ${selectedIndustry ? "font-medium" : ""}`}>
					Industry Selection
				</span>
			</div>

			{/* Collapsed State - When industry is selected */}
			{selectedIndustry ? (
				<div className="p-3 border-2 border-green-200 rounded-md bg-green-50">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Check className="h-4 w-4 text-green-600" />
							<div className="flex items-center gap-2">
								{getSelectedIndustry()?.icon &&
									stringToIconComponent(getSelectedIndustry()?.icon) && (
										<div className="h-4 w-4">
											{React.createElement(
												stringToIconComponent(getSelectedIndustry()?.icon),
												{
													className: "h-4 w-4",
												}
											)}
										</div>
									)}
								<span className="font-medium text-sm">
									{getSelectedIndustry()?.name}
								</span>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onIndustrySelect("")}
							className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
						>
							Change
						</Button>
					</div>
				</div>
			) : (
				/* Expanded State - When no industry is selected */
				<>
					<div>
						<p className="text-xs text-muted-foreground mb-3">
							Choose the industry that best fits your solution, some additional
							global parameters will be provided to you based on this selection
						</p>
					</div>

					{/* Client's Selected Industries */}
					{clientSelectedIndustries.length > 0 && (
						<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Your Organization&apos;s Industries
							</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedIndustries.map((industryId: string) => {
									const industry = availableIndustries.find(
										(i) => i.id === industryId
									);
									if (!industry) return null;
									return (
										<React.Fragment key={industryId}>
											{renderSelectionCard(
												industry,
												industryId,
												selectedIndustry === industryId,
												onIndustrySelect
											)}
										</React.Fragment>
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
