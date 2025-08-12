"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Send, AlertTriangle } from "lucide-react";
import { CreateSolutionSubmitProps } from "./types/types";

/**
 * CreateSolutionSubmit component - Review and submit solution
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
}: CreateSolutionSubmitProps) {
	return (
		<div className="w-full h-full overflow-y-auto space-y-4 p-4">
			{/* Solution Summary Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Solution Summary</h3>
				{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<SummaryCard
						icon={<div className="w-4 h-4 bg-blue-500 rounded" />}
						title="Industry"
						value={getSelectedIndustryName()}
						bgColor="bg-blue-50"
						iconColor="text-blue-600"
					/>
					<SummaryCard
						icon={<div className="w-4 h-4 bg-green-500 rounded" />}
						title="Technology"
						value={getSelectedTechnologyName()}
						bgColor="bg-green-50"
						iconColor="text-green-600"
					/>
				</div> */}
			</div>

			{/* Configuration Summary */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Configuration</h3>
				{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<SummaryCard
						icon={<div className="w-4 h-4 bg-purple-500 rounded" />}
						title="Parameters"
						value={`${formData.parameters.length} configured`}
						bgColor="bg-purple-50"
						iconColor="text-purple-600"
					/>
					<SummaryCard
						icon={<div className="w-4 h-4 bg-orange-500 rounded" />}
						title="Calculations"
						value={`${formData.calculations.length} configured`}
						bgColor="bg-orange-50"
						iconColor="text-orange-600"
					/>
				</div> */}
			</div>

			{/* Action Cards */}
			<ActionCards
				isSubmitting={isSubmitting}
				isExistingSolutionLoaded={isExistingSolutionLoaded || false}
				onSaveAsDraft={onSaveAsDraft}
				onSubmitForReview={onSubmitForReview}
			/>

			{/* Warning Message */}
			<WarningMessage />
		</div>
	);
}

/**
 * SummaryCard component - Displays summary information
 */
function SummaryCard({
	icon,
	title,
	value,
	bgColor,
	iconColor,
}: {
	icon: React.ReactNode;
	title: string;
	value: string;
	bgColor: string;
	iconColor: string;
}) {
	return (
		<Card className="border">
			<CardContent className="p-4">
				<div className="flex items-center gap-3">
					<div className={`p-2 ${bgColor} rounded-lg`}>
						<div className={iconColor}>{icon}</div>
					</div>
					<div className="flex-1">
						<h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
						<p className="font-semibold text-sm">{value}</p>
					</div>
				</div>
			</CardContent>
		</Card>
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
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
		<Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
			<CardContent className="p-4">
				<div className="flex items-center gap-3 mb-3">
					<div className={`p-2 ${bgColor} rounded-lg`}>
						<div className={iconColor}>{icon}</div>
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-sm">{title}</h3>
						<p className="text-xs text-muted-foreground">{description}</p>
					</div>
				</div>
				<ul className="text-xs text-muted-foreground space-y-1 mb-3">
					{benefits.map((benefit, index) => (
						<li key={index}>• {benefit}</li>
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
		<div className="flex items-start gap-3 p-3 border rounded-md bg-yellow-50 border-yellow-200">
			<AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
			<div className="text-xs text-yellow-800">
				<p className="font-medium">Review your solution before submitting</p>
				<p className="mt-1">
					Once submitted for review, your solution will be evaluated by our
					team. You can save as draft to continue editing later.
				</p>
			</div>
		</div>
	);
}
