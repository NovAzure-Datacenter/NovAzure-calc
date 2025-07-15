"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Send, AlertTriangle } from "lucide-react";
import { type Parameter, type Calculation } from "../../../mock-data";

interface CreateSolutionStep6Props {
	formData: {
		solutionName: string;
		solutionDescription: string;
		solutionVariant: string;
		customSolutionVariant: string;
		customSolutionVariantDescription: string;
		parameters: Parameter[];
		calculations: Calculation[];
	};
	showCustomSolutionType: boolean;
	showCustomSolutionVariant: boolean;
	isSubmitting: boolean;
	onSaveAsDraft: () => void;
	onSubmitForReview: () => void;
	getSelectedIndustryName: () => string;
	getSelectedTechnologyName: () => string;
	getSelectedSolutionType: () => any;
	getSelectedSolutionVariant: () => any;
}

export function CreateSolutionStep6({
	formData,
	showCustomSolutionType,
	showCustomSolutionVariant,
	isSubmitting,
	onSaveAsDraft,
	onSubmitForReview,
	getSelectedIndustryName,
	getSelectedTechnologyName,
	getSelectedSolutionType,
	getSelectedSolutionVariant,
}: CreateSolutionStep6Props) {
	return (
		<div className="space-y-4">
			{/* Solution Summary */}
			<div className="p-3 border rounded-md bg-muted/30">
				<h3 className="font-semibold mb-2 text-sm">Solution Summary</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
					<div className="space-y-1">
						<div>
							<span className="text-muted-foreground">Industry:</span>
							<p className="font-medium">{getSelectedIndustryName()}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Technology:</span>
							<p className="font-medium">{getSelectedTechnologyName()}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Solution Type:</span>
							<p className="font-medium">
								{showCustomSolutionType
									? formData.solutionName || "New Solution"
									: getSelectedSolutionType()?.name || "Not selected"}
							</p>
						</div>
						<div>
							<span className="text-muted-foreground">Solution Variant:</span>
							<p className="font-medium">
								{showCustomSolutionVariant
									? formData.customSolutionVariant || "New Variant"
									: formData.solutionVariant === ""
									? "None selected"
									: getSelectedSolutionVariant()?.name || "None selected"}
							</p>
						</div>
						{showCustomSolutionVariant && formData.customSolutionVariantDescription && (
							<div>
								<span className="text-muted-foreground">Variant Description:</span>
								<p className="font-medium line-clamp-2">
									{formData.customSolutionVariantDescription}
								</p>
							</div>
						)}
					</div>
					<div className="space-y-1">
						{showCustomSolutionType && (
							<>
								<div>
									<span className="text-muted-foreground">New Solution Name:</span>
									<p className="font-medium">{formData.solutionName}</p>
								</div>
								<div>
									<span className="text-muted-foreground">New Solution Description:</span>
									<p className="font-medium line-clamp-2">{formData.solutionDescription}</p>
								</div>
							</>
						)}
						<div>
							<span className="text-muted-foreground">Parameters:</span>
							<p className="font-medium">{formData.parameters.length} configured</p>
						</div>
						<div>
							<span className="text-muted-foreground">Calculations:</span>
							<p className="font-medium">{formData.calculations.length} configured</p>
						</div>
					</div>
				</div>
			</div>

			{/* Action Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Save as Draft Card */}
				<Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="p-1.5 bg-blue-100 rounded-full">
								<Save className="h-4 w-4 text-blue-600" />
							</div>
							<div>
								<h3 className="font-semibold text-sm">Save as Draft</h3>
								<p className="text-xs text-muted-foreground">
									Save your progress and continue later
								</p>
							</div>
						</div>
						<ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
							<li>• Solution will be saved as incomplete</li>
							<li>• You can edit and continue later</li>
							<li>• No review process required</li>
						</ul>
						<Button
							onClick={onSaveAsDraft}
							disabled={isSubmitting}
							variant="outline"
							className="w-full"
							size="sm"
						>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
									Saving...
								</>
							) : (
								<>
									<Save className="h-3 w-3 mr-2" />
									Save as Draft
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				{/* Submit for Review Card */}
				<Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="p-1.5 bg-green-100 rounded-full">
								<Send className="h-4 w-4 text-green-600" />
							</div>
							<div>
								<h3 className="font-semibold text-sm">Submit for Review</h3>
								<p className="text-xs text-muted-foreground">
									Submit your solution for approval
								</p>
							</div>
						</div>
						<ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
							<li>• Solution will be reviewed by administrators</li>
							<li>• You&apos;ll be notified of approval status</li>
							<li>• Changes may be required before approval</li>
						</ul>
						<Button
							onClick={onSubmitForReview}
							disabled={isSubmitting}
							className="w-full"
							size="sm"
						>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
									Submitting...
								</>
							) : (
								<>
									<Send className="h-3 w-3 mr-2" />
									Submit for Review
								</>
							)}
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Warning */}
			<div className="flex items-start gap-2 p-3 border rounded-md bg-yellow-50 border-yellow-200">
				<AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
				<div className="text-xs text-yellow-800">
					<p className="font-medium">Review your solution before submitting</p>
					<p className="mt-1">
						Once submitted for review, your solution will be evaluated by our team. 
						You can save as draft to continue editing later.
					</p>
				</div>
			</div>
		</div>
	);
} 