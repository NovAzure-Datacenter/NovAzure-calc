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
		<div className="space-y-6">
			{/* Solution Summary */}
			<div className="p-4 border rounded-lg bg-muted/30">
				<h3 className="font-semibold mb-3">Solution Summary</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div className="space-y-2">
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
									? formData.solutionName
									: getSelectedSolutionType()?.name}
							</p>
						</div>
						<div>
							<span className="text-muted-foreground">Solution Variant:</span>
							<p className="font-medium">
								{showCustomSolutionVariant
									? formData.solutionDescription
									: formData.solutionName === ""
									? "None selected"
									: getSelectedSolutionVariant()?.name || "None selected"}
							</p>
						</div>
					</div>
					<div className="space-y-2">
						<div>
							<span className="text-muted-foreground">Solution Name:</span>
							<p className="font-medium">{formData.solutionName}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Description:</span>
							<p className="font-medium line-clamp-2">
								{formData.solutionDescription}
							</p>
						</div>
						<div>
							<span className="text-muted-foreground">
								Parameters Overridden:
							</span>
							<p className="font-medium">
								{
									formData.parameters.filter(
										(p) => p.overrideValue !== null
									).length
								}{" "}
								/ {formData.parameters.length}
							</p>
						</div>
						<div>
							<span className="text-muted-foreground">Calculations:</span>
							<p className="font-medium">
								{
									formData.calculations.filter(
										(c) => c.status === "valid"
									).length
								}{" "}
								valid / {formData.calculations.length} total
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Action Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Save as Draft */}
				<Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 bg-blue-100 rounded-full">
								<Save className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<h3 className="font-semibold">Save as Draft</h3>
								<p className="text-sm text-muted-foreground">
									Save your progress and continue later
								</p>
							</div>
						</div>
						<ul className="text-xs text-muted-foreground space-y-1 mb-4">
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
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
									Saving...
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-2" />
									Save as Draft
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				{/* Submit for Review */}
				<Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 bg-green-100 rounded-full">
								<Send className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<h3 className="font-semibold">Submit for Review</h3>
								<p className="text-sm text-muted-foreground">
									Submit your solution for approval
								</p>
							</div>
						</div>
						<ul className="text-xs text-muted-foreground space-y-1 mb-4">
							<li>• Solution will be reviewed by administrators</li>
							<li>• You'll be notified of approval status</li>
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
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
									Submitting...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Submit for Review
								</>
							)}
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Validation Warnings */}
			{formData.parameters.filter((p) => p.overrideValue !== null).length === 0 && (
				<div className="p-3 border border-yellow-200 rounded-md bg-yellow-50">
					<div className="flex items-center gap-2 text-yellow-800">
						<AlertTriangle className="h-4 w-4" />
						<span className="text-sm font-medium">No parameters overridden</span>
					</div>
					<p className="text-xs text-yellow-700 mt-1">
						Consider reviewing and adjusting parameters for better solution
						optimization.
					</p>
				</div>
			)}

			{formData.calculations.filter((c) => c.status === "error").length > 0 && (
				<div className="p-3 border border-red-200 rounded-md bg-red-50">
					<div className="flex items-center gap-2 text-red-800">
						<AlertTriangle className="h-4 w-4" />
						<span className="text-sm font-medium">Calculation errors detected</span>
					</div>
					<p className="text-xs text-red-700 mt-1">
						Some calculations have errors. Review and fix them before submitting.
					</p>
				</div>
			)}
		</div>
	);
} 