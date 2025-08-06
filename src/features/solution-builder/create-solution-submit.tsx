"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Send, AlertTriangle, Info } from "lucide-react";

/**
 * CreateSolutionSubmitTest component - Test version with just ActionCards and WarningMessage
 */
export function CreateSolutionSubmit({
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
	isExistingSolutionLoaded,
}: {
	formData: {
		solutionName: string;
		solutionDescription: string;
		solutionVariant: string;
		customSolutionVariant: string;
		customSolutionVariantDescription: string;
		parameters: any[];
		calculations: any[];
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
	isExistingSolutionLoaded?: boolean;
}) {
	return (
		<div
			className="w-full max-w-[calc(100vw-18rem)] min-h-[500px] h-[600px] overflow-hidden bg-red-900 p-4 rounded border-4 border-red-800"
			style={{
				backgroundColor: "red !important",
				border: "4px solid red !important",
				padding: "16px",
				margin: "16px",
			}}
		>
			<div className="text-white font-bold text-lg mb-4">
				TEST: PARENT CONTAINER - DARK RED BACKGROUND
			</div>
			<div className="w-full h-full overflow-y-auto overflow-x-hidden space-y-3 p-2">
				<div className="bg-green-600 p-2 rounded"></div>

				<div className="bg-pink-600 p-2 rounded">
					<ActionCards
						isSubmitting={isSubmitting}
						isExistingSolutionLoaded={isExistingSolutionLoaded || false}
						onSaveAsDraft={onSaveAsDraft}
						onSubmitForReview={onSubmitForReview}
					/>
				</div>

				<div className="bg-yellow-600 p-2 rounded">
					<WarningMessage />
				</div>
			</div>
		</div>
	);
}

/**
 * ActionCards component - Displays action cards for save/submit
 */
function ActionCards({
	isSubmitting,
	isExistingSolutionLoaded,
	onSaveAsDraft,
	onSubmitForReview,
}: {
	isSubmitting: boolean;
	isExistingSolutionLoaded: boolean;
	onSaveAsDraft: () => void;
	onSubmitForReview: () => void;
}) {
	const saveAsDraftCard = {
		icon: <Save className="h-4 w-4 text-blue-600" />,
		title: "Save as Draft",
		description: "Save your progress and continue later",
		benefits: [
			"Solution will be saved as incomplete",
			"You can edit and continue later",
			"No review process required",
		],
		buttonText: "Save as Draft",
		buttonVariant: "outline" as const,
		onClick: onSaveAsDraft,
		isSubmitting,
		submittingText: "Saving...",
		bgColor: "bg-blue-100",
		iconColor: "text-blue-600",
	};

	const submitForReviewCard = {
		icon: <Send className="h-4 w-4 text-green-600" />,
		title: isExistingSolutionLoaded
			? "Confirm Edits and Submit for Review"
			: "Submit for Review",
		description: isExistingSolutionLoaded
			? "Submit your edited solution for approval"
			: "Submit your solution for approval",
		benefits: isExistingSolutionLoaded
			? [
					"Your edits to the existing solution will be reviewed",
					"You'll be notified of approval status",
					"Changes may be required before approval",
			  ]
			: [
					"Solution will be reviewed by administrators",
					"You'll be notified of approval status",
					"Changes may be required before approval",
			  ],
		buttonText: isExistingSolutionLoaded
			? "Confirm Edits and Submit for Review"
			: "Submit for Review",
		buttonVariant: "default" as const,
		onClick: onSubmitForReview,
		isSubmitting,
		submittingText: "Submitting...",
		bgColor: "bg-green-100",
		iconColor: "text-green-600",
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-full overflow-hidden bg-pink-100 p-2 rounded">
			<ActionCard {...saveAsDraftCard} />
			<ActionCard {...submitForReviewCard} />
		</div>
	);
}

/**
 * ActionCard component - Individual action card
 */
function ActionCard({
	icon,
	title,
	description,
	benefits,
	buttonText,
	buttonVariant,
	onClick,
	isSubmitting,
	submittingText,
	bgColor,
	iconColor,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	benefits: string[];
	buttonText: string;
	buttonVariant: "outline" | "default";
	onClick: () => void;
	isSubmitting: boolean;
	submittingText: string;
	bgColor: string;
	iconColor: string;
}) {
	return (
		<Card className="border-dashed border-2 hover:border-primary/50 transition-colors w-full max-w-full overflow-hidden">
			<CardContent className="p-3 w-full max-w-full overflow-hidden">
				<div className="flex items-center gap-2 mb-2 w-full max-w-full overflow-hidden">
					<div className={`p-1.5 ${bgColor} rounded-full flex-shrink-0`}>
						{icon}
					</div>
					<div className="min-w-0 flex-1 overflow-hidden">
						<h3 className="font-semibold text-sm truncate">{title}</h3>
						<p className="text-xs text-muted-foreground truncate">
							{description}
						</p>
					</div>
				</div>
				<ul className="text-xs text-muted-foreground space-y-0.5 mb-2 w-full max-w-full overflow-hidden">
					{benefits.map((benefit, index) => (
						<li key={index} className="truncate">
							• {benefit}
						</li>
					))}
				</ul>
				<Button
					onClick={onClick}
					disabled={isSubmitting}
					variant={buttonVariant}
					className="w-full"
					size="sm"
				>
					{isSubmitting ? (
						<>
							<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
							{submittingText}
						</>
					) : (
						<>
							{icon}
							{buttonText}
						</>
					)}
				</Button>
			</CardContent>
		</Card>
	);
}

/**
 * WarningMessage component - Displays warning about review process
 */
function WarningMessage() {
	return (
		<div className="flex items-start gap-2 p-2 border rounded-md bg-yellow-50 border-yellow-200 w-full max-w-full overflow-hidden bg-yellow-100 p-2 rounded">
			<AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
			<div className="text-xs text-yellow-800 w-full max-w-full overflow-hidden">
				<p className="font-medium truncate">
					Review your solution before submitting
				</p>
				<p className="mt-1 truncate">
					Once submitted for review, your solution will be evaluated by our
					team. You can save as draft to continue editing later.
				</p>
			</div>
		</div>
	);
}
