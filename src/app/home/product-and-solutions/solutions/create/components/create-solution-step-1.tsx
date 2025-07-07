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
	return (
		<div className="space-y-3">
			<div>
				<Label className="text-sm font-medium">Available Industries</Label>
				<p className="text-xs text-muted-foreground mb-2">
					Select from your organization's available industries
				</p>
				{isLoadingIndustries ? (
					<div className="flex items-center justify-center py-6">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
						<span className="ml-2 text-sm">Loading industries...</span>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						{clientData?.selected_industries?.map((industryId: string) => {
							const industry = availableIndustries.find(
								(i) => i.id === industryId
							);
							if (!industry) return null;

							return (
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
						})}
					</div>
				)}
			</div>
		</div>
	);
} 