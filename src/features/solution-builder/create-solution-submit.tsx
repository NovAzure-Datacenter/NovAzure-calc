"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save, Send, AlertTriangle, Building2, Cpu, Package, Layers, Info } from "lucide-react";
import { Parameter, Calculation } from "@/types/types";
import {
	CreateSolutionSubmitProps,
	ConfigurationItem,
	SolutionSummaryProps,
	SummaryCardProps,
	AdditionalDetailsProps,
	ConfigurationTableProps,
	ConfigurationTableHeaderProps,
	ConfigurationTableBodyProps,
	ConfigurationTableRowProps,
	ActionCardsProps,
	ActionCardProps,
	WarningMessageProps,
	LoadingSpinnerProps,
} from "./types/types";

/**
 * CreateSolutionStep6 component - Final review step for solution creation
 * Displays a comprehensive summary of the solution with parameters and calculations
 * Provides options to save as draft or submit for review
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
	// Helper functions
	const getCategoryColor = (category: any, type: 'parameter' | 'calculation') => {
		if (!category) return "bg-gray-50 text-gray-700 border-gray-200";
		
		if (type === 'parameter') {
			if (!category.color) return "bg-gray-50 text-gray-700 border-gray-200";
			
			switch (category.color.toLowerCase()) {
				case "green":
					return "bg-green-50 text-green-700 border-green-200";
				case "blue":
					return "bg-blue-50 text-blue-700 border-blue-200";
				case "yellow":
					return "bg-yellow-50 text-yellow-700 border-yellow-200";
				case "purple":
					return "bg-purple-50 text-purple-700 border-purple-200";
				case "red":
					return "bg-red-50 text-red-700 border-red-200";
				case "orange":
					return "bg-orange-50 text-orange-700 border-orange-200";
				case "pink":
					return "bg-pink-50 text-pink-700 border-pink-200";
				case "indigo":
					return "bg-indigo-50 text-indigo-700 border-indigo-200";
				default:
					return "bg-gray-50 text-gray-700 border-gray-200";
			}
		} else {
			// Calculation category colors
			const categoryName = typeof category === "string" ? category : category.name;
			
			switch (categoryName.toLowerCase()) {
				case "financial":
					return "bg-green-50 text-green-700 border-green-200";
				case "performance":
					return "bg-blue-50 text-blue-700 border-blue-200";
				case "efficiency":
					return "bg-yellow-50 text-yellow-700 border-yellow-200";
				case "operational":
					return "bg-purple-50 text-purple-700 border-purple-200";
				default:
					return "bg-gray-50 text-gray-700 border-gray-200";
			}
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "valid":
				return "bg-green-50 text-green-700 border-green-200";
			case "error":
				return "bg-red-50 text-red-700 border-red-200";
			case "pending":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};



	const createConfigurationItems = (parameters: Parameter[], calculations: Calculation[]): ConfigurationItem[] => {
		const items: ConfigurationItem[] = [
			// Add parameters
			...parameters.map((param): ConfigurationItem => ({
				id: param.id,
				name: param.name,
				category: param.category,
				description: param.description,
				units: param.unit,
				type: 'parameter',
				value: param.value,
				test_value: param.test_value,
				user_interface: param.user_interface,
			})),
			// Add calculations
			...calculations.map((calc): ConfigurationItem => ({
				id: calc.id,
				name: calc.name,
				category: calc.category,
				description: calc.description,
				units: calc.units,
				type: 'calculation',
				formula: calc.formula,
				result: calc.result,
				status: calc.status,
				output: calc.output,
				level: calc.level || 2,
			})),
		];

		// Sort items: parameters first, then calculations by level
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'parameter' ? -1 : 1;
			}
			if (a.type === 'calculation' && b.type === 'calculation') {
				return (a.level || 1) - (b.level || 1);
			}
			return 0;
		});
	};

	const configurationItems = createConfigurationItems(formData.parameters, formData.calculations);

	return (
		<div className="space-y-6 w-full max-w-full overflow-hidden">
			<div className="w-full max-w-full overflow-hidden">
				<SolutionSummary
					formData={formData}
					showCustomSolutionType={showCustomSolutionType}
					showCustomSolutionVariant={showCustomSolutionVariant}
					getSelectedIndustryName={getSelectedIndustryName}
					getSelectedTechnologyName={getSelectedTechnologyName}
					getSelectedSolutionType={getSelectedSolutionType}
					getSelectedSolutionVariant={getSelectedSolutionVariant}
				/>

				<ConfigurationTable
					configurationItems={configurationItems}
					parametersCount={formData.parameters.length}
					calculationsCount={formData.calculations.length}
				/>

				<ActionCards
					isSubmitting={isSubmitting}
					isExistingSolutionLoaded={isExistingSolutionLoaded}
					onSaveAsDraft={onSaveAsDraft}
					onSubmitForReview={onSubmitForReview}
				/>

				<WarningMessage />
			</div>
		</div>
	);
}

/**
 * SolutionSummary component - Displays solution overview with cards
 */
function SolutionSummary({
	formData,
	showCustomSolutionType,
	showCustomSolutionVariant,
	getSelectedIndustryName,
	getSelectedTechnologyName,
	getSelectedSolutionType,
	getSelectedSolutionVariant,
}: SolutionSummaryProps) {
	const summaryCards = [
		{
			icon: <Building2 className="h-3 w-3 text-blue-600" />,
			title: "Industry",
			value: getSelectedIndustryName(),
			bgColor: "bg-blue-100",
			iconColor: "text-blue-600",
		},
		{
			icon: <Cpu className="h-3 w-3 text-green-600" />,
			title: "Technology",
			value: getSelectedTechnologyName(),
			bgColor: "bg-green-100",
			iconColor: "text-green-600",
		},
		{
			icon: <Package className="h-3 w-3 text-purple-600" />,
			title: "Solution Type",
			value: showCustomSolutionType
				? formData.solutionName || "New Solution"
				: getSelectedSolutionType()?.name || "Not selected",
			bgColor: "bg-purple-100",
			iconColor: "text-purple-600",
		},
		{
			icon: <Layers className="h-3 w-3 text-orange-600" />,
			title: "Solution Variant",
			value: showCustomSolutionVariant
				? formData.customSolutionVariant || "New Variant"
				: formData.solutionVariant === ""
				? "None selected"
				: getSelectedSolutionVariant()?.name || "None selected",
			bgColor: "bg-orange-100",
			iconColor: "text-orange-600",
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<h3 className="text-lg font-semibold">Solution Summary</h3>
				<Badge variant="secondary" className="text-xs">
					Ready for Review
				</Badge>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{summaryCards.map((card, index) => (
					<SummaryCard key={index} {...card} />
				))}
			</div>

			<AdditionalDetails
				showCustomSolutionType={showCustomSolutionType}
				showCustomSolutionVariant={showCustomSolutionVariant}
				formData={formData}
			/>
		</div>
	);
}

/**
 * SummaryCard component - Individual summary card
 */
function SummaryCard({ icon, title, value, bgColor, iconColor }: SummaryCardProps) {
	return (
		<Card className="border border-border hover:border-primary/50 transition-colors">
			<CardContent className="p-3">
				<div className="flex items-center gap-2 mb-2">
					<div className={`p-1.5 ${bgColor} rounded-lg flex-shrink-0`}>
						{icon}
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-xs text-muted-foreground">{title}</p>
						<p className="font-medium text-sm truncate">{value}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * AdditionalDetails component - Shows additional details for custom solutions/variants
 */
function AdditionalDetails({
	showCustomSolutionType,
	showCustomSolutionVariant,
	formData,
}: AdditionalDetailsProps) {
	if (!showCustomSolutionType && !showCustomSolutionVariant) return null;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{showCustomSolutionType && (
				<Card className="border border-border">
					<CardContent className="p-4">
						<h4 className="font-medium text-sm mb-3">New Solution Details</h4>
						<div className="space-y-2 text-sm">
							<div>
								<p className="text-xs text-muted-foreground">Name</p>
								<p className="font-medium">{formData.solutionName}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Description</p>
								<p className="font-medium line-clamp-2">{formData.solutionDescription}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{showCustomSolutionVariant && formData.customSolutionVariantDescription && (
				<Card className="border border-border">
					<CardContent className="p-4">
						<h4 className="font-medium text-sm mb-3">New Variant Details</h4>
						<div className="space-y-2 text-sm">
							<div>
								<p className="text-xs text-muted-foreground">Name</p>
								<p className="font-medium">{formData.customSolutionVariant}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Description</p>
								<p className="font-medium line-clamp-2">{formData.customSolutionVariantDescription}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

/**
 * ConfigurationTable component - Displays unified table of parameters and calculations
 */
function ConfigurationTable({
	configurationItems,
	parametersCount,
	calculationsCount,
}: ConfigurationTableProps) {
	if (configurationItems.length === 0) return null;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Configuration Summary</h3>
				<div className="flex items-center gap-4">
					<Badge variant="outline" className="text-xs">
						{parametersCount} Parameters
					</Badge>
					<Badge variant="outline" className="text-xs">
						{calculationsCount} Calculations
					</Badge>
				</div>
			</div>

			<Card className="border border-border">
				<CardContent className="p-4">
					<div className="border rounded-md overflow-hidden">
						<div className="max-h-[35vh] overflow-auto min-w-0">
							<TooltipProvider>
								<Table className="min-w-full table-fixed">
									<ConfigurationTableHeader />
									<ConfigurationTableBody configurationItems={configurationItems} />
								</Table>
							</TooltipProvider>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

/**
 * ConfigurationTableHeader component - Table header with tooltips
 */
function ConfigurationTableHeader({}: ConfigurationTableHeaderProps) {
	const headerColumns = [
		{ key: 'type', label: 'Type', width: 'w-16', hasTooltip: true, tooltip: 'Item type (Parameter or Calculation)' },
		{ key: 'level', label: 'Level', width: 'w-16', hasTooltip: true, tooltip: 'Priority level for calculations' },
		{ key: 'name', label: 'Name', width: 'w-32', hasTooltip: false },
		{ key: 'category', label: 'Category', width: 'w-24', hasTooltip: false },
		{ key: 'formula', label: 'Formula/Value', width: 'w-48', hasTooltip: true, tooltip: 'Formula for calculations, value for parameters' },
		{ key: 'description', label: 'Description', width: 'w-32', hasTooltip: false },
		{ key: 'result', label: 'Result/Test', width: 'w-32', hasTooltip: true, tooltip: 'Calculated result or test value' },
		{ key: 'unit', label: 'Unit', width: 'w-16', hasTooltip: false },
		{ key: 'details', label: 'Details', width: 'w-24', hasTooltip: false },
	];

	return (
		<TableHeader className="sticky top-0 bg-background z-10">
			<TableRow>
				{headerColumns.map(({ key, label, width, hasTooltip, tooltip }) => (
					<TableHead key={key} className={`${width} bg-background`}>
						{hasTooltip ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex items-center gap-1 cursor-help">
										{label}
										<Info className="h-3 w-3 text-muted-foreground" />
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-sm">{tooltip}</p>
								</TooltipContent>
							</Tooltip>
						) : (
							label
						)}
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	);
}

/**
 * ConfigurationTableBody component - Table body with configuration items
 */
function ConfigurationTableBody({ configurationItems }: ConfigurationTableBodyProps) {
	return (
		<TableBody>
			{configurationItems.map((item) => (
				<ConfigurationTableRow key={`${item.type}-${item.id}`} item={item} />
			))}
		</TableBody>
	);
}

/**
 * ConfigurationTableRow component - Individual table row
 */
function ConfigurationTableRow({ item }: ConfigurationTableRowProps) {
	const getCategoryColor = (category: any, type: 'parameter' | 'calculation') => {
		if (!category) return "bg-gray-50 text-gray-700 border-gray-200";
		
		if (type === 'parameter') {
			if (!category.color) return "bg-gray-50 text-gray-700 border-gray-200";
			
			switch (category.color.toLowerCase()) {
				case "green":
					return "bg-green-50 text-green-700 border-green-200";
				case "blue":
					return "bg-blue-50 text-blue-700 border-blue-200";
				case "yellow":
					return "bg-yellow-50 text-yellow-700 border-yellow-200";
				case "purple":
					return "bg-purple-50 text-purple-700 border-purple-200";
				case "red":
					return "bg-red-50 text-red-700 border-red-200";
				case "orange":
					return "bg-orange-50 text-orange-700 border-orange-200";
				case "pink":
					return "bg-pink-50 text-pink-700 border-pink-200";
				case "indigo":
					return "bg-indigo-50 text-indigo-700 border-indigo-200";
				default:
					return "bg-gray-50 text-gray-700 border-gray-200";
			}
		} else {
			// Calculation category colors
			const categoryName = typeof category === "string" ? category : category.name;
			
			switch (categoryName.toLowerCase()) {
				case "financial":
					return "bg-green-50 text-green-700 border-green-200";
				case "performance":
					return "bg-blue-50 text-blue-700 border-blue-200";
				case "efficiency":
					return "bg-yellow-50 text-yellow-700 border-yellow-200";
				case "operational":
					return "bg-purple-50 text-purple-700 border-purple-200";
				default:
					return "bg-gray-50 text-gray-700 border-gray-200";
			}
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "valid":
				return "bg-green-50 text-green-700 border-green-200";
			case "error":
				return "bg-red-50 text-red-700 border-red-200";
			case "pending":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	return (
		<TableRow className="h-12">
			{/* Type */}
			<TableCell className="py-2">
				<Badge
					variant="outline"
					className={`text-xs ${
						item.type === 'parameter'
							? "bg-blue-50 text-blue-700 border-blue-200"
							: "bg-green-50 text-green-700 border-green-200"
					}`}
				>
					{item.type === 'parameter' ? 'Param' : 'Calc'}
				</Badge>
			</TableCell>
			
			{/* Level */}
			<TableCell className="py-2">
				{item.type === 'calculation' ? (
					<span className="text-sm font-mono">{item.level}</span>
				) : (
					<span className="text-sm text-muted-foreground">-</span>
				)}
			</TableCell>
			
			{/* Name */}
			<TableCell className="py-2">
				<span className="font-medium text-sm truncate block">{item.name}</span>
			</TableCell>
			
			{/* Category */}
			<TableCell className="py-2">
				<Badge
					variant="outline"
					className={`text-xs ${getCategoryColor(item.category, item.type)}`}
				>
					{typeof item.category === "string"
						? item.category
						: item.category?.name || "Unknown"}
				</Badge>
			</TableCell>
			
			{/* Formula/Value */}
			<TableCell className="py-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="max-w-xs truncate cursor-help">
							<span className="text-sm font-mono">
								{item.type === 'calculation' ? item.formula : item.value}
							</span>
						</div>
					</TooltipTrigger>
					<TooltipContent className="max-w-xs">
						<p className="text-sm font-mono">
							{item.type === 'calculation' ? item.formula : item.value}
						</p>
					</TooltipContent>
				</Tooltip>
			</TableCell>
			
			{/* Description */}
			<TableCell className="py-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="max-w-xs truncate cursor-help">
							<span className="text-sm text-muted-foreground">
								{item.description}
							</span>
						</div>
					</TooltipTrigger>
					<TooltipContent className="max-w-xs">
						<p className="text-sm">{item.description}</p>
					</TooltipContent>
				</Tooltip>
			</TableCell>
			
			{/* Result/Test */}
			<TableCell className="py-2">
				{item.type === 'calculation' ? (
					<div className="flex items-center gap-1">
						<span
							className={`text-sm font-mono ${
								item.status === "error"
									? "text-red-600"
									: "text-green-600"
							}`}
						>
							{typeof item.result === "number"
								? item.result.toLocaleString()
								: item.result}
						</span>
						<Badge
							className={`text-xs ${getStatusColor(item.status || 'pending')}`}
						>
							{item.status || 'pending'}
						</Badge>
					</div>
				) : (
					<span className="text-sm font-mono">{item.test_value}</span>
				)}
			</TableCell>
			
			{/* Unit */}
			<TableCell className="py-2">
				<span className="text-sm text-muted-foreground">{item.units}</span>
			</TableCell>
			
			{/* Details */}
			<TableCell className="py-2">
				{item.type === 'parameter' ? (
					<div className="space-y-0.5">
						<Badge variant="outline" className="text-xs">
							{typeof item.user_interface === "string" 
								? item.user_interface 
								: item.user_interface?.type || "Unknown"
							}
						</Badge>
					</div>
				) : (
					<Badge
						variant="outline"
						className={`text-xs ${
							item.output
								? "bg-green-50 text-green-700 border-green-200"
								: "bg-gray-50 text-gray-700 border-gray-200"
						}`}
					>
						{item.output ? "Output" : "Internal"}
					</Badge>
				)}
			</TableCell>
		</TableRow>
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
}: ActionCardsProps) {
	const saveAsDraftCard: ActionCardProps = {
		icon: <Save className="h-4 w-4 text-blue-600" />,
		title: "Save as Draft",
		description: "Save your progress and continue later",
		benefits: [
			"Solution will be saved as incomplete",
			"You can edit and continue later",
			"No review process required"
		],
		buttonText: "Save as Draft",
		buttonVariant: "outline",
		onClick: onSaveAsDraft,
		isSubmitting,
		submittingText: "Saving...",
		bgColor: "bg-blue-100",
		iconColor: "text-blue-600",
	};

	const submitForReviewCard: ActionCardProps = {
		icon: <Send className="h-4 w-4 text-green-600" />,
		title: isExistingSolutionLoaded ? "Confirm Edits and Submit for Review" : "Submit for Review",
		description: isExistingSolutionLoaded 
			? "Submit your edited solution for approval"
			: "Submit your solution for approval",
		benefits: isExistingSolutionLoaded ? [
			"Your edits to the existing solution will be reviewed",
			"You'll be notified of approval status",
			"Changes may be required before approval"
		] : [
			"Solution will be reviewed by administrators",
			"You'll be notified of approval status",
			"Changes may be required before approval"
		],
		buttonText: isExistingSolutionLoaded ? "Confirm Edits and Submit for Review" : "Submit for Review",
		buttonVariant: "default",
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
}: ActionCardProps) {
	return (
		<Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
			<CardContent className="p-4">
				<div className="flex items-center gap-2 mb-2">
					<div className={`p-1.5 ${bgColor} rounded-full flex-shrink-0`}>
						{icon}
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="font-semibold text-sm">{title}</h3>
						<p className="text-xs text-muted-foreground">{description}</p>
					</div>
				</div>
				<ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
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
							<LoadingSpinner className="mr-2" />
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
function WarningMessage({}: WarningMessageProps) {
	return (
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
	);
}

/**
 * LoadingSpinner component - Reusable loading spinner
 */
function LoadingSpinner({ className }: LoadingSpinnerProps) {
	return (
		<div className={`animate-spin rounded-full h-3 w-3 border-b-2 border-current ${className || ''}`} />
	);
} 