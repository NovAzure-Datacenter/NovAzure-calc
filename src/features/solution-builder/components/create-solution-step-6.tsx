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
import { type Parameter, type Calculation } from "../../../types";

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
	isExistingSolutionLoaded?: boolean;
}

// Combined item type for unified table
type ConfigurationItem = {
	id: string;
	name: string;
	category: any;
	description: string;
	units?: string;
	type: 'parameter' | 'calculation';
	// Parameter specific fields
	value?: string;
	test_value?: string;
	user_interface?: "input" | "static" | "not_viewable" | {
		type: "input" | "static" | "not_viewable";
		category: string;
		is_advanced: boolean;
	};
	// Calculation specific fields
	formula?: string;
	result?: any;
	status?: string;
	output?: boolean;
	level?: number;
};

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
	isExistingSolutionLoaded,
}: CreateSolutionStep6Props) {
	// Helper function to get category color
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

	// Helper function to get status color for calculations
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

	// Combine parameters and calculations into unified items
	const configurationItems: ConfigurationItem[] = [
		// Add parameters
		...formData.parameters.map((param): ConfigurationItem => ({
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
		...formData.calculations.map((calc): ConfigurationItem => ({
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
			level: typeof calc.category === "string"
				? 1
				: calc.category?.name === "financial"
				? 1
				: calc.category?.name === "performance"
				? 2
				: calc.category?.name === "efficiency"
				? 2
				: calc.category?.name === "operational"
				? 3
				: 1,
		})),
	];

	// Sort items: parameters first, then calculations by level
	configurationItems.sort((a, b) => {
		if (a.type !== b.type) {
			return a.type === 'parameter' ? -1 : 1;
		}
		if (a.type === 'calculation' && b.type === 'calculation') {
			return (a.level || 1) - (b.level || 1);
		}
		return 0;
	});

	return (
		<div className="space-y-6 w-full max-w-full overflow-hidden">
			<div className="w-full max-w-full overflow-hidden">
				{/* Solution Summary */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold">Solution Summary</h3>
						<Badge variant="secondary" className="text-xs">
							Ready for Review
						</Badge>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
						{/* Industry Card */}
						<Card className="border border-border hover:border-primary/50 transition-colors">
							<CardContent className="p-3">
								<div className="flex items-center gap-2 mb-2">
									<div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
										<Building2 className="h-3 w-3 text-blue-600" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-xs text-muted-foreground">Industry</p>
										<p className="font-medium text-sm truncate">{getSelectedIndustryName()}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Technology Card */}
						<Card className="border border-border hover:border-primary/50 transition-colors">
							<CardContent className="p-3">
								<div className="flex items-center gap-2 mb-2">
									<div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
										<Cpu className="h-3 w-3 text-green-600" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-xs text-muted-foreground">Technology</p>
										<p className="font-medium text-sm truncate">{getSelectedTechnologyName()}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Solution Type Card */}
						<Card className="border border-border hover:border-primary/50 transition-colors">
							<CardContent className="p-3">
								<div className="flex items-center gap-2 mb-2">
									<div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
										<Package className="h-3 w-3 text-purple-600" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-xs text-muted-foreground">Solution Type</p>
										<p className="font-medium text-sm truncate">
											{showCustomSolutionType
												? formData.solutionName || "New Solution"
												: getSelectedSolutionType()?.name || "Not selected"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Solution Variant Card */}
						<Card className="border border-border hover:border-primary/50 transition-colors">
							<CardContent className="p-3">
								<div className="flex items-center gap-2 mb-2">
									<div className="p-1.5 bg-orange-100 rounded-lg flex-shrink-0">
										<Layers className="h-3 w-3 text-orange-600" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-xs text-muted-foreground">Solution Variant</p>
										<p className="font-medium text-sm truncate">
											{showCustomSolutionVariant
												? formData.customSolutionVariant || "New Variant"
												: formData.solutionVariant === ""
												? "None selected"
												: getSelectedSolutionVariant()?.name || "None selected"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Additional Details */}
					{(showCustomSolutionType || showCustomSolutionVariant) && (
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
					)}
				</div>

				{/* Unified Configuration Table */}
				{configurationItems.length > 0 && (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Configuration Summary</h3>
							<div className="flex items-center gap-4">
								<Badge variant="outline" className="text-xs">
									{formData.parameters.length} Parameters
								</Badge>
								<Badge variant="outline" className="text-xs">
									{formData.calculations.length} Calculations
								</Badge>
							</div>
						</div>

						<Card className="border border-border">
							<CardContent className="p-4">
								<div className="border rounded-md overflow-hidden">
									<div className="max-h-[35vh] overflow-auto min-w-0">
										<TooltipProvider>
											<Table className="min-w-full table-fixed">
												<TableHeader className="sticky top-0 bg-background z-10">
													<TableRow>
														<TableHead className="w-16 bg-background">
															<Tooltip>
																<TooltipTrigger asChild>
																	<div className="flex items-center gap-1 cursor-help">
																		Type
																		<Info className="h-3 w-3 text-muted-foreground" />
																	</div>
																</TooltipTrigger>
																<TooltipContent>
																	<p className="text-sm">Item type (Parameter or Calculation)</p>
																</TooltipContent>
															</Tooltip>
														</TableHead>
														<TableHead className="w-16 bg-background">
															<Tooltip>
																<TooltipTrigger asChild>
																	<div className="flex items-center gap-1 cursor-help">
																		Level
																		<Info className="h-3 w-3 text-muted-foreground" />
																	</div>
																</TooltipTrigger>
																<TooltipContent>
																	<p className="text-sm">Priority level for calculations</p>
																</TooltipContent>
															</Tooltip>
														</TableHead>
														<TableHead className="w-32 bg-background">Name</TableHead>
														<TableHead className="w-24 bg-background">Category</TableHead>
														<TableHead className="w-48 bg-background">
															<Tooltip>
																<TooltipTrigger asChild>
																	<div className="flex items-center gap-1 cursor-help">
																		Formula/Value
																		<Info className="h-3 w-3 text-muted-foreground" />
																	</div>
																</TooltipTrigger>
																<TooltipContent>
																	<p className="text-sm">Formula for calculations, value for parameters</p>
																</TooltipContent>
															</Tooltip>
														</TableHead>
														<TableHead className="w-32 bg-background">Description</TableHead>
														<TableHead className="w-32 bg-background">
															<Tooltip>
																<TooltipTrigger asChild>
																	<div className="flex items-center gap-1 cursor-help">
																		Result/Test
																		<Info className="h-3 w-3 text-muted-foreground" />
																	</div>
																</TooltipTrigger>
																<TooltipContent>
																	<p className="text-sm">Calculated result or test value</p>
																</TooltipContent>
															</Tooltip>
														</TableHead>
														<TableHead className="w-16 bg-background">Unit</TableHead>
														<TableHead className="w-24 bg-background">Details</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{configurationItems.map((item) => (
														<TableRow key={`${item.type}-${item.id}`} className="h-12">
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
													))}
												</TableBody>
											</Table>
										</TooltipProvider>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Action Cards */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{/* Save as Draft Card */}
					<Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="p-1.5 bg-blue-100 rounded-full flex-shrink-0">
									<Save className="h-4 w-4 text-blue-600" />
								</div>
								<div className="min-w-0 flex-1">
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
								<div className="p-1.5 bg-green-100 rounded-full flex-shrink-0">
									<Send className="h-4 w-4 text-green-600" />
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="font-semibold text-sm">
										{isExistingSolutionLoaded ? "Confirm Edits and Submit for Review" : "Submit for Review"}
									</h3>
									<p className="text-xs text-muted-foreground">
										{isExistingSolutionLoaded 
											? "Submit your edited solution for approval"
											: "Submit your solution for approval"
										}
									</p>
								</div>
							</div>
							<ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
								{isExistingSolutionLoaded ? (
									<>
										<li>• Your edits to the existing solution will be reviewed</li>
										<li>• You'll be notified of approval status</li>
										<li>• Changes may be required before approval</li>
									</>
								) : (
									<>
										<li>• Solution will be reviewed by administrators</li>
										<li>• You'll be notified of approval status</li>
										<li>• Changes may be required before approval</li>
									</>
								)}
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
										{isExistingSolutionLoaded ? "Confirm Edits and Submit for Review" : "Submit for Review"}
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
		</div>
	);
} 