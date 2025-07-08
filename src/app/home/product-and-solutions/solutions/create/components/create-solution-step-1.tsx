"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";

interface CreateSolutionStep1Props {
	clientData: any;
	availableIndustries: any[];
	isLoadingIndustries: boolean;
	selectedIndustry: string;
	onIndustrySelect: (industryId: string) => void;
}

export function CreateSolutionStep1({
	clientData,
	availableIndustries,
	isLoadingIndustries,
	selectedIndustry,
	onIndustrySelect,
}: CreateSolutionStep1Props) {
	// Get client's selected industries
	const clientSelectedIndustries = clientData?.selected_industries || [];
	
	// Get all other industries (excluding client's selected ones)
	const otherIndustries = availableIndustries.filter(
		(industry) => !clientSelectedIndustries.includes(industry.id)
	);

	// Helper function to render industry card
	const renderIndustryCard = (industry: any, industryId: string) => (
		<div
			key={industryId}
			className={`p-3 border rounded-md cursor-pointer transition-colors ${
				selectedIndustry === industryId
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onIndustrySelect(industryId)}
		>
			<div className="flex items-center gap-2">
				<Checkbox
					checked={selectedIndustry === industryId}
					onCheckedChange={() => onIndustrySelect(industryId)}
				/>
				<div className="flex items-center gap-2">
					{industry.icon &&
						stringToIconComponent(industry.icon) && (
							<div className="h-4 w-4">
								{React.createElement(
									stringToIconComponent(industry.icon),
									{ className: "h-4 w-4" }
								)}
							</div>
						)}
					<span className="font-medium text-sm">
						{industry.name}
					</span>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6">
				{industry.description}
			</p>
		</div>
	);

	return (
		<div className="h-full max-h-[calc(100vh-200px)] flex flex-col">
			{isLoadingIndustries ? (
				<div className="flex items-center justify-center py-6">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
					<span className="ml-2 text-sm">Loading industries...</span>
				</div>
			) : (
				<>
					{/* Client's Selected Industries Section */}
					<div className="flex-shrink-0 mb-6">
						<Label className="text-sm font-medium">Your Organization's Industries</Label>
						<p className="text-xs text-muted-foreground mb-2">
							Select from your organization's available industries
						</p>
						{clientSelectedIndustries.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedIndustries.map((industryId: string) => {
									const industry = availableIndustries.find(
										(i) => i.id === industryId
									);
									if (!industry) return null;

									return renderIndustryCard(industry, industryId);
								})}
							</div>
						) : (
							<div className="text-sm text-muted-foreground py-4 text-center">
								No industries selected for your organization
							</div>
						)}
					</div>

					{/* All Available Industries Section */}
					<div className="flex-1 min-h-0">
						<Label className="text-sm font-medium">All Available Industries</Label>
						<p className="text-xs text-muted-foreground mb-2">
							Select from all available industries if needed
						</p>
						{otherIndustries.length > 0 ? (
							<div className="h-full max-h-[600px] overflow-y-auto pr-2">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{otherIndustries.map((industry) => 
										renderIndustryCard(industry, industry.id)
									)}
								</div>
							</div>
						) : (
							<div className="text-sm text-muted-foreground py-4 text-center">
								No additional industries available
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
} 