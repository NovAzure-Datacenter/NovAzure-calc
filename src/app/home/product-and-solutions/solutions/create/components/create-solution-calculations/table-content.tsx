"use client";

import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Edit, Save, X, Plus } from "lucide-react";
import { Calculation } from "@/app/home/product-and-solutions/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomCalculationCategory } from "./calculation-color-utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface TableContentProps {
	calculations: Calculation[];
	editingCalculation: string | null;
	editData: {
		name: string;
		formula: string;
		units: string;
		description: string;
		category: string;
		output: boolean;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			formula: string;
			units: string;
			description: string;
			category: string;
			output: boolean;
		}>
	>;
	handleEditCalculation: (calculation: Calculation) => void;
	handleSaveCalculation: (calculationId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteCalculation: (calculationId: string) => void;
	insertIntoFormula: (text: string) => void;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	getCategoryColor: (category: string) => string;
	getStatusColor: (status: string) => string;
	groupedParameters: Record<string, any[]>;
	// Add calculation props
	isAddingCalculation: boolean;
	newCalculationData: {
		name: string;
		description: string;
		formula: string;
		units: string;
		category: string;
		output: boolean;
	};
	setNewCalculationData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			description: string;
			formula: string;
			units: string;
			category: string;
			output: boolean;
		}>
	>;
	handleSaveNewCalculation: () => void;
	handleCancelAddCalculation: () => void;
	handleAddCalculation: () => void;
	allCategories: string[];
	customCategories: CustomCalculationCategory[];
}

export function TableContent({
	calculations,
	editingCalculation,
	editData,
	setEditData,
	handleEditCalculation,
	handleSaveCalculation,
	handleCancelEdit,
	handleDeleteCalculation,
	insertIntoFormula,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	getCategoryColor,
	getStatusColor,
	groupedParameters,
	isAddingCalculation,
	newCalculationData,
	setNewCalculationData,
	handleSaveNewCalculation,
	handleCancelAddCalculation,
	handleAddCalculation,
	allCategories,
	customCategories,
}: TableContentProps) {
	const [isAddFormulaExpanded, setIsAddFormulaExpanded] = useState(false);
	const [expandedCalculations, setExpandedCalculations] = useState<Set<string>>(new Set());

	const toggleFormulaExpanded = (calculationId: string) => {
		setExpandedCalculations(prev => {
			const newSet = new Set(prev);
			if (newSet.has(calculationId)) {
				newSet.delete(calculationId);
			} else {
				newSet.add(calculationId);
			}
			return newSet;
		});
	};

	const setIsExpanded = (calculationId: string) => (expanded: boolean) => {
		setExpandedCalculations(prev => {
			const newSet = new Set(prev);
			if (expanded) {
				newSet.add(calculationId);
			} else {
				newSet.delete(calculationId);
			}
			return newSet;
		});
	};

	return (
		<div className="border rounded-md">
			<div className="max-h-[55vh] overflow-y-auto">
				<TooltipProvider>
					<Table>
						<TableHeader className="sticky top-0 bg-background z-10">
							<TableRow>
								<TableHead className="w-16 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Level
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												The calculation priority level based on category
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• <strong>Level 1:</strong> Financial calculations
												<br />• <strong>Level 2:</strong> Performance &
												Efficiency
												<br />• <strong>Level 3:</strong> Operational
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-32 bg-background">Name</TableHead>
								<TableHead className="w-24 bg-background">Category</TableHead>
								<TableHead className="w-80 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Formula
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												Mathematical expression using parameters and operators
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• Use parameter names as variables
												<br />• Supports +, -, *, /, **, ( )
												<br />• Real-time validation and preview
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-48 bg-background">
									Description
								</TableHead>
								<TableHead className="w-24 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Mock Result
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												Calculated result using current parameter values
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• <strong>Valid:</strong> Formula evaluates successfully
												<br />• <strong>Error:</strong> Formula has syntax
												issues
												<br />• <strong>Pending:</strong> Waiting for evaluation
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-16 bg-background">Unit</TableHead>
								<TableHead className="w-20 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Output
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												Whether this calculation is included in final results
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• <strong>Yes:</strong> Shows in value calculator
												<br />• <strong>No:</strong> Internal calculation only
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-20 bg-background">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{/* Add Calculation*/}
							{isAddingCalculation && (
								<TableRow className="bg-blue-50 border-2 border-blue-200 shadow-md">
									{/* Level */}
									<TableCell>
										<span className="text-sm text-muted-foreground">N/A</span>
									</TableCell>
									
									{/* If formula is expanded, only render level and formula columns */}
									{isAddFormulaExpanded ? (
										/* Formula - Expanded mode (spans all remaining columns) */
										<TableCell colSpan={8} className="p-0">
											<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-md">
												<div className="flex items-center justify-between mb-4">
													<h4 className="text-sm font-medium text-blue-900">
														Formula Editor - New Calculation
													</h4>
													<Button
														size="sm"
														variant="default"
														onClick={() => setIsAddFormulaExpanded(false)}
														className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
														title="Collapse formula editor"
													>
														<span className="mr-1">−</span>
														<span>Collapse</span>
													</Button>
												</div>
												
												{/* Formula Input */}
												<div className="flex items-center gap-3 mb-4">
													<Input
														value={newCalculationData.formula}
														onChange={(e) =>
															setNewCalculationData((prev) => ({
																...prev,
																formula: e.target.value,
															}))
														}
														className="h-10 text-sm font-mono flex-1"
														placeholder="Enter formula..."
													/>
													<Button
														size="sm"
														variant="outline"
														onClick={resetFormula}
														className="h-10 px-3 text-xs"
														title="Clear formula"
													>
														Clear
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={rewindFormula}
														className="h-10 px-3 text-xs"
														title="Remove last character"
													>
														←
													</Button>
												</div>

												{/* Formula Preview */}
												{newCalculationData.formula && (
													<div className="text-sm font-mono p-3 bg-white rounded border mb-4">
														<div className="text-muted-foreground mb-2 text-xs font-medium">Formula Preview:</div>
														<div className="flex flex-wrap gap-1">
															{getColorCodedFormula(newCalculationData.formula)}
														</div>
													</div>
												)}

												{/* Formula Editor Tools */}
												<div className="space-y-4">
													{/* Operators */}
													<div>
														<div className="text-sm font-medium mb-3 text-blue-900">Mathematical Operators:</div>
														<div className="flex flex-wrap gap-2">
															{[
																{ symbol: "+", label: "Add" },
																{ symbol: "-", label: "Subtract" },
																{ symbol: "*", label: "Multiply" },
																{ symbol: "/", label: "Divide" },
																{ symbol: "(", label: "Open Parenthesis" },
																{ symbol: ")", label: "Close Parenthesis" },
																{ symbol: "**", label: "Power" },
															].map((op) => (
																<button
																	key={op.symbol}
																	type="button"
																	onClick={() => insertIntoFormula(op.symbol)}
																	className="h-8 px-4 text-sm font-mono border rounded hover:bg-blue-100 transition-colors bg-white"
																	title={op.label}
																>
																	{op.symbol}
																</button>
															))}
														</div>
													</div>

													{/* Parameters by Category */}
													<div>
														<div className="text-sm font-medium mb-3 text-blue-900">Available Parameters:</div>
														<Accordion type="multiple" className="space-y-2 max-h-60 overflow-y-auto">
															{Object.entries(groupedParameters)
																.sort(([a], [b]) => {
																	// Put "Calculations" first, then sort others alphabetically
																	if (a === "Calculations") return -1;
																	if (b === "Calculations") return 1;
																	return a.localeCompare(b);
																})
																.map(([category, params]) => (
																<AccordionItem key={category} value={category} className="border rounded-md">
																	<AccordionTrigger className="p-2 text-left hover:bg-muted/50 transition-colors bg-white">
																		<span className="text-xs font-medium capitalize text-muted-foreground">
																			{category} ({params.length})
																		</span>
																	</AccordionTrigger>
																	<AccordionContent className="p-2 border-t bg-muted/20">
																		<div className="flex flex-wrap gap-2">
																			{(params as any[]).map((param: any) => {
																				// Get category color for the parameter
																				const getParameterCategoryColor = (paramCategory: any) => {
																					if (!paramCategory || !paramCategory.color) {
																						return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
																					}
																					
																					switch (paramCategory.color.toLowerCase()) {
																						case "green":
																							return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
																						case "blue":
																							return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
																						case "yellow":
																							return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
																						case "purple":
																							return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
																						case "red":
																							return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
																						case "orange":
																							return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
																						case "pink":
																							return "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100";
																						case "indigo":
																							return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
																						default:
																							return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
																					}
																				};

																				return (
																					<button
																						key={param.id}
																						type="button"
																						onClick={() => insertIntoFormula(param.name)}
																						className={`h-6 px-3 text-xs border rounded transition-colors ${getParameterCategoryColor(param.category)}`}
																						title={`${param.name}: ${param.description}`}
																					>
																						{param.name}
																					</button>
																				);
																			})}
																		</div>
																	</AccordionContent>
																</AccordionItem>
															))}
														</Accordion>
													</div>
												</div>
											</div>
										</TableCell>
									) : (
								
										<>
											{/* Name */}
											<TableCell>
												<Input
													value={newCalculationData.name}
													onChange={(e) =>
														setNewCalculationData((prev) => ({
															...prev,
															name: e.target.value,
														}))
													}
													className="h-8 text-sm"
													placeholder="Calculation name"
												/>
											</TableCell>
											{/* Category */}
											<TableCell>
												<Select
													value={newCalculationData.category}
													onValueChange={(value) =>
														setNewCalculationData((prev) => ({
															...prev,
															category: value,
														}))
													}
												>
													<SelectTrigger className="h-8">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{allCategories.map((category) => (
															<SelectItem key={category} value={category}>
																<div className="flex items-center gap-2">
																	<Badge
																		variant="outline"
																		className={`text-xs ${getCategoryColor(
																			category
																		)}`}
																	>
																		{category}
																	</Badge>
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</TableCell>
											{/* Formula */}
											<TableCell>
												<div className="space-y-3">
													{/* Formula Input with Expand Button */}
													<div className="flex items-center gap-2">
														<Input
															value={newCalculationData.formula}
															onChange={(e) =>
																setNewCalculationData((prev) => ({
																	...prev,
																	formula: e.target.value,
																}))
															}
															className="h-8 text-sm font-mono flex-1"
															placeholder="Enter formula..."
														/>
														<Button
															size="sm"
															variant="default"
															onClick={() => setIsAddFormulaExpanded(!isAddFormulaExpanded)}
															className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
															title={isAddFormulaExpanded ? "Collapse formula editor" : "Expand formula editor with operators and parameters"}
														>
															{isAddFormulaExpanded ? (
																<>
																	<span className="mr-1">−</span>
																	<span>Collapse</span>
																</>
															) : (
																<>
																	<span className="mr-1">+</span>
																	<span>Expand</span>
																</>
															)}
														</Button>
													</div>

													{/* Formula Preview - Always visible when there's a formula */}
													{newCalculationData.formula && (
														<div className="text-xs font-mono p-2 bg-muted/30 rounded border">
															<div className="text-muted-foreground mb-1 text-xs font-medium">Formula Preview:</div>
															<div className="flex flex-wrap gap-1">
																{getColorCodedFormula(newCalculationData.formula)}
															</div>
														</div>
													)}
												</div>
											</TableCell>
											{/* Description */}
											<TableCell>
												<Input
													value={newCalculationData.description}
													onChange={(e) =>
														setNewCalculationData((prev) => ({
															...prev,
															description: e.target.value,
														}))
													}
													className="h-8 text-sm"
													placeholder="Description"
												/>
											</TableCell>
											{/* Mock Result */}
											<TableCell>
												<span className="text-sm text-muted-foreground">-</span>
											</TableCell>
											{/* Unit */}
											<TableCell>
												<Input
													value={newCalculationData.units}
													onChange={(e) =>
														setNewCalculationData((prev) => ({
															...prev,
															units: e.target.value,
														}))
													}
													className="h-8 text-sm"
													placeholder="Units"
												/>
											</TableCell>
											{/* Output */}
											<TableCell>
												<div className="flex items-center space-x-2">
													<input
														type="checkbox"
														id="new-calculation-output"
														checked={newCalculationData.output}
														onChange={(e) =>
															setNewCalculationData((prev) => ({
																...prev,
																output: e.target.checked,
															}))
														}
														className="h-4 w-4"
													/>
													<label
														htmlFor="new-calculation-output"
														className="text-sm"
													>
														{newCalculationData.output ? "Yes" : "No"}
													</label>
												</div>
											</TableCell>
											{/* Actions */}
											<TableCell>
												<div className="flex items-center gap-1">
													<button
														onClick={handleSaveNewCalculation}
														disabled={
															!newCalculationData.name.trim() ||
															!newCalculationData.formula.trim()
														}
														className="h-6 w-6 p-0 text-green-600 hover:text-green-700 disabled:opacity-50"
													>
														<Save className="h-4 w-4" />
													</button>
													<button
														onClick={handleCancelAddCalculation}
														className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
													>
														<X className="h-4 w-4" />
													</button>
												</div>
											</TableCell>
										</>
									)}
								</TableRow>
							)}

							{calculations.map((calculation) => {
								const isEditing = editingCalculation === calculation.id;
								const isFormulaExpanded = expandedCalculations.has(calculation.id);

								// If formula is expanded, only render level and formula columns
								if (isFormulaExpanded) {
									return (
										<TableRow
											key={calculation.id}
											className="transition-all duration-200 bg-blue-50 border-2 border-blue-200 shadow-md"
										>

											
											{/* Formula - Expanded mode (spans all remaining columns) */}
											<TableCell colSpan={9} className="p-0">
												<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-md">
													<div className="flex items-center justify-between mb-4">
														<h4 className="text-sm font-medium text-blue-900">
															Formula Editor - {calculation.name}
														</h4>
														<Button
															size="sm"
															variant="default"
															onClick={() => toggleFormulaExpanded(calculation.id)}
															className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
															title="Collapse formula editor"
														>
															<span className="mr-1">−</span>
															<span>Collapse</span>
														</Button>
													</div>
													
													{/* Formula Input */}
													<div className="flex items-center gap-3 mb-4">
														<Input
															value={editData.formula}
															onChange={(e) =>
																setEditData((prev) => ({
																	...prev,
																	formula: e.target.value,
																}))
															}
															className="h-10 text-sm font-mono flex-1"
															placeholder="Enter formula..."
														/>
														<Button
															size="sm"
															variant="outline"
															onClick={resetFormula}
															className="h-10 px-3 text-xs"
															title="Clear formula"
														>
															Clear
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={rewindFormula}
															className="h-10 px-3 text-xs"
															title="Remove last character"
														>
															←
														</Button>
													</div>

													{/* Formula Preview */}
													{editData.formula && (
														<div className="text-sm font-mono p-3 bg-white rounded border mb-4">
															<div className="text-muted-foreground mb-2 text-xs font-medium">Formula Preview:</div>
															<div className="flex flex-wrap gap-1">
																{getColorCodedFormula(editData.formula)}
															</div>
														</div>
													)}

													{/* Formula Editor Tools */}
													<div className="space-y-4">
														{/* Operators */}
														<div>
															<div className="text-sm font-medium mb-3 text-blue-900">Mathematical Operators:</div>
															<div className="flex flex-wrap gap-2">
																{[
																	{ symbol: "+", label: "Add" },
																	{ symbol: "-", label: "Subtract" },
																	{ symbol: "*", label: "Multiply" },
																	{ symbol: "/", label: "Divide" },
																	{ symbol: "(", label: "Open Parenthesis" },
																	{ symbol: ")", label: "Close Parenthesis" },
																	{ symbol: "**", label: "Power" },
																].map((op) => (
																	<button
																		key={op.symbol}
																		type="button"
																		onClick={() => insertIntoFormula(op.symbol)}
																		className="h-8 px-4 text-sm font-mono border rounded hover:bg-blue-100 transition-colors bg-white"
																		title={op.label}
																	>
																		{op.symbol}
																	</button>
																))}
															</div>
														</div>

														{/* Parameters by Category */}
														<div>
															<div className="text-sm font-medium mb-3 text-blue-900">Available Parameters:</div>
															<Accordion type="multiple" className="space-y-2 max-h-60 overflow-y-auto">
																{Object.entries(groupedParameters)
																	.sort(([a], [b]) => {
																		// Put "Calculations" first, then sort others alphabetically
																		if (a === "Calculations") return -1;
																		if (b === "Calculations") return 1;
																		return a.localeCompare(b);
																	})
																	.map(([category, params]) => (
																	<AccordionItem key={category} value={category} className="border rounded-md">
																		<AccordionTrigger className="p-2 text-left hover:bg-muted/50 transition-colors bg-white">
																			<span className="text-xs font-medium capitalize text-muted-foreground">
																				{category} ({params.length})
																			</span>
																		</AccordionTrigger>
																		<AccordionContent className="p-2 border-t bg-muted/20">
																			<div className="flex flex-wrap gap-2">
																				{(params as any[]).map((param: any) => {
																					// Get category color for the parameter
																					const getParameterCategoryColor = (paramCategory: any) => {
																						if (!paramCategory || !paramCategory.color) {
																							return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
																						}
																						
																						switch (paramCategory.color.toLowerCase()) {
																							case "green":
																								return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
																							case "blue":
																								return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
																							case "yellow":
																								return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
																							case "purple":
																								return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
																							case "red":
																								return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
																							case "orange":
																								return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
																							case "pink":
																								return "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100";
																							case "indigo":
																								return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
																							default:
																								return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
																						}
																					};

																					return (
																						<button
																							key={param.id}
																							type="button"
																							onClick={() => insertIntoFormula(param.name)}
																							className={`h-6 px-3 text-xs border rounded transition-colors ${getParameterCategoryColor(param.category)}`}
																							title={`${param.name}: ${param.description}`}
																						>
																							{param.name}
																						</button>
																					);
																				})}
																			</div>
																		</AccordionContent>
																	</AccordionItem>
																))}
															</Accordion>
														</div>
													</div>
												</div>
											</TableCell>
										</TableRow>
									);
								}

								// Normal row rendering (not expanded)
								return (
									<TableRow
										key={calculation.id}
										className={`transition-all duration-200 ${
											isEditing
												? "bg-blue-50 border-2 border-blue-200 shadow-md"
												: ""
										} ${
											editingCalculation && !isEditing
												? "opacity-40 pointer-events-none"
												: ""
										}`}
									>
										{/* Level */}
										<TableCell>
											<span className="text-sm font-mono">
												{typeof calculation.category === "string"
													? "1"
													: calculation.category?.name === "financial"
													? "1"
													: calculation.category?.name === "performance"
													? "2"
													: calculation.category?.name === "efficiency"
													? "2"
													: calculation.category?.name === "operational"
													? "3"
													: "1"}
											</span>
										</TableCell>
										
										{/* Name */}
										<TableCell>
											{isEditing ? (
												<Input
													value={editData.name}
													onChange={(e) =>
														setEditData((prev) => ({
															...prev,
															name: e.target.value,
														}))
													}
													className="h-8 text-sm"
													placeholder="Calculation name"
												/>
											) : (
												<span className="font-medium text-sm">
													{calculation.name}
												</span>
											)}
										</TableCell>
										
										{/* Category */}
										<TableCell>
											{isEditing ? (
												<Select
													value={editData.category || calculation.category?.name || "financial"}
													onValueChange={(value) =>
														setEditData((prev) => ({
															...prev,
															category: value,
														}))
													}
												>
													<SelectTrigger className="h-8">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{allCategories.map((category) => (
															<SelectItem key={category} value={category}>
																<div className="flex items-center gap-2">
																	<Badge
																		variant="outline"
																		className={`text-xs ${getCategoryColor(
																			typeof calculation.category === "string"
																				? calculation.category
																				: calculation.category?.name || "unknown"
																		)}`}
																	>
																		{typeof calculation.category === "string"
																			? calculation.category
																			: calculation.category?.name || "Unknown"}
																	</Badge>
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											) : (
												<Badge
													variant="outline"
													className={`text-xs ${getCategoryColor(
														typeof calculation.category === "string"
															? calculation.category
															: calculation.category?.name || "unknown"
													)}`}
												>
													{typeof calculation.category === "string"
														? calculation.category
														: calculation.category?.name || "Unknown"}
												</Badge>
											)}
										</TableCell>
										
										{/* Formula - Normal mode */}
										<FormulaEditor
											isEditing={isEditing}
											calculation={calculation}
											editData={editData}
											setEditData={setEditData}
											resetFormula={resetFormula}
											rewindFormula={rewindFormula}
											getColorCodedFormula={getColorCodedFormula}
											groupedParameters={groupedParameters}
											insertIntoFormula={insertIntoFormula}
											isExpanded={isFormulaExpanded}
											setIsExpanded={setIsExpanded(calculation.id)}
										/>
										
										{/* Description */}
										<TableCell>
											{isEditing ? (
												<Input
													value={editData.description}
													onChange={(e) =>
														setEditData((prev) => ({
															...prev,
															description: e.target.value,
														}))
													}
													className="h-8 text-sm"
													placeholder="Description"
												/>
											) : (
												<span className="text-sm text-muted-foreground">
													{calculation.description}
												</span>
											)}
										</TableCell>
										
										{/* Mock Result */}
										<TableCell>
											<div className="flex items-center gap-2">
												<span
													className={`text-sm font-mono ${
														calculation.status === "error"
															? "text-red-600"
															: "text-green-600"
													}`}
												>
													{typeof calculation.result === "number"
														? calculation.result.toLocaleString()
														: calculation.result}
												</span>
												<Badge
													className={`text-xs ${getStatusColor(
														calculation.status
													)}`}
												>
													{calculation.status}
												</Badge>
											</div>
										</TableCell>
										
										{/* Unit */}
										<TableCell>
											{isEditing ? (
												<Input
													value={editData.units}
													onChange={(e) =>
														setEditData((prev) => ({
															...prev,
															units: e.target.value,
														}))
													}
													className="h-8 text-sm"
													placeholder="Units"
												/>
											) : (
												<span className="text-sm text-muted-foreground">
													{calculation.units}
												</span>
											)}
										</TableCell>
										
										{/* Output */}
										<TableCell>
											{isEditing ? (
												<div className="flex items-center space-x-2">
													<input
														type="checkbox"
														id={`output-${calculation.id}`}
														checked={editData.output !== undefined ? editData.output : calculation.output}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																output: e.target.checked,
															}))
														}
														className="h-4 w-4"
													/>
													<label htmlFor={`output-${calculation.id}`} className="text-sm">
														{editData.output !== undefined ? editData.output : calculation.output ? "Yes" : "No"}
													</label>
												</div>
											) : (
												<Badge
													variant="outline"
													className={`text-xs ${
														calculation.output
															? "bg-green-50 text-green-700 border-green-200"
															: "bg-gray-50 text-gray-700 border-gray-200"
													}`}
												>
													{calculation.output ? "Yes" : "No"}
												</Badge>
											)}
										</TableCell>
										
										{/* Actions */}
										<TableCell>
											<div className="flex items-center gap-1">
												{!isEditing ? (
													<>
														<button
															onClick={() => handleEditCalculation(calculation)}
															className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
															disabled={editingCalculation !== null}
														>
															<Edit className="h-4 w-4" />
														</button>
														<button
															onClick={() =>
																handleDeleteCalculation(calculation.id)
															}
															className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
															disabled={editingCalculation !== null}
														>
															<X className="h-4 w-4" />
														</button>
													</>
												) : (
													<>
														<button
															onClick={() =>
																handleSaveCalculation(calculation.id)
															}
															className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
														>
															<Save className="h-4 w-4" />
														</button>
														<button
															onClick={handleCancelEdit}
															className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
														>
															<X className="h-4 w-4" />
														</button>
													</>
												)}
											</div>
										</TableCell>
									</TableRow>
								);
							})}
							{!isAddingCalculation && (
								<TableRow className="border-t-2">
									<TableCell
										colSpan={9}
										className="text-center bg-muted/50 cursor-pointer py-2"
										onClick={
											isAddingCalculation
												? handleCancelAddCalculation
												: handleAddCalculation
										}
									>
										<div className="flex items-center gap-2 justify-center text-muted-foreground">
											<Plus className="h-3 w-3" />
											<span className="text-xs">Add Calculation</span>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TooltipProvider>
			</div>
		</div>
	);
}

interface FormulaEditorProps {
	isEditing: boolean;
	calculation: Calculation;
	editData: {
		name: string;
		formula: string;
		units: string;
		description: string;
		category: string;
		output: boolean;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			formula: string;
			units: string;
			description: string;
			category: string;
			output: boolean;
		}>
	>;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	groupedParameters: Record<string, any[]>;
	insertIntoFormula: (text: string) => void;
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
}

function FormulaEditor({
	isEditing,
	calculation,
	editData,
	setEditData,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	groupedParameters,
	insertIntoFormula,
	isExpanded,
	setIsExpanded,
}: FormulaEditorProps) {
	return (
		<TableCell>
			{isEditing ? (
				<div className="space-y-3">
					{/* Formula Input with Expand Button */}
					<div className="flex items-center gap-2">
						<Input
							value={editData.formula}
							onChange={(e) =>
								setEditData((prev) => ({
									...prev,
									formula: e.target.value,
								}))
							}
							className="h-8 text-sm font-mono flex-1"
							placeholder="Enter formula..."
						/>
						<Button
							size="sm"
							variant="default"
							onClick={() => setIsExpanded(!isExpanded)}
							className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
							title={isExpanded ? "Collapse formula editor" : "Expand formula editor with operators and parameters"}
						>
							{isExpanded ? (
								<>
									<span className="mr-1">−</span>
									<span>Collapse</span>
								</>
							) : (
								<>
									<span className="mr-1">+</span>
									<span>Expand</span>
								</>
							)}
						</Button>
					</div>

					{/* Formula Preview - Always visible when there's a formula */}
					{editData.formula && (
						<div className="text-xs font-mono p-2 bg-muted/30 rounded border">
							<div className="text-muted-foreground mb-1 text-xs font-medium">Formula Preview:</div>
							<div className="flex flex-wrap gap-1">
								{getColorCodedFormula(editData.formula)}
							</div>
						</div>
					)}

					{/* Expanded Formula Editor - Only when expanded */}
					{isExpanded && (
						<div className="border rounded-md p-3 bg-muted/20">
							<div className="text-xs font-medium mb-3 text-muted-foreground">
								Formula Editor
							</div>
							
							{/* Formula Input with Clear and Rewind in Expanded Mode */}
							<div className="flex items-center gap-2 mb-3">
								<Input
									value={editData.formula}
									onChange={(e) =>
										setEditData((prev) => ({
											...prev,
											formula: e.target.value,
										}))
									}
									className="h-8 text-sm font-mono flex-1"
									placeholder="Enter formula..."
								/>
								<Button
									size="sm"
									variant="outline"
									onClick={resetFormula}
									className="h-8 px-2 text-xs"
									title="Clear formula"
								>
									Clear
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={rewindFormula}
									className="h-8 px-2 text-xs"
									title="Remove last character"
								>
									←
								</Button>
							</div>
							
							{/* Operators */}
							<div className="mb-3">
								<div className="text-xs text-muted-foreground mb-2 font-medium">Mathematical Operators:</div>
								<div className="flex flex-wrap gap-2">
									{[
										{ symbol: "+", label: "Add" },
										{ symbol: "-", label: "Subtract" },
										{ symbol: "*", label: "Multiply" },
										{ symbol: "/", label: "Divide" },
										{ symbol: "(", label: "Open Parenthesis" },
										{ symbol: ")", label: "Close Parenthesis" },
										{ symbol: "**", label: "Power" },
									].map((op) => (
										<button
											key={op.symbol}
											type="button"
											onClick={() => insertIntoFormula(op.symbol)}
											className="h-7 px-3 text-sm font-mono border rounded hover:bg-muted transition-colors bg-white"
											title={op.label}
										>
											{op.symbol}
										</button>
									))}
								</div>
							</div>

							{/* Parameters by Category */}
							<div>
								<div className="text-xs text-muted-foreground mb-2 font-medium">Available Parameters:</div>
								<div className="space-y-3 max-h-60 overflow-y-auto">
									{Object.entries(groupedParameters)
										.sort(([a], [b]) => {
											// Put "Calculations" first, then sort others alphabetically
											if (a === "Calculations") return -1;
											if (b === "Calculations") return 1;
											return a.localeCompare(b);
										})
										.map(([category, params]) => (
										<div key={category} className="border-l-2 border-muted pl-3">
											<div className="text-xs text-muted-foreground mb-2 capitalize font-medium">
												{category}:
											</div>
											<div className="flex flex-wrap gap-2">
												{(params as any[]).map((param: any) => {
													// Get category color for the parameter
													const getParameterCategoryColor = (paramCategory: any) => {
														if (!paramCategory || !paramCategory.color) {
															return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
														}
														
														switch (paramCategory.color.toLowerCase()) {
															case "green":
																return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
															case "blue":
																return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
															case "yellow":
																return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
															case "purple":
																return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
															case "red":
																return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
															case "orange":
																return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
															case "pink":
																return "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100";
															case "indigo":
																return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
															default:
																return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
														}
													};

													return (
														<button
															key={param.id}
															type="button"
															onClick={() => insertIntoFormula(param.name)}
															className={`h-6 px-3 text-xs border rounded transition-colors ${getParameterCategoryColor(param.category)}`}
															title={`${param.name}: ${param.description}`}
														>
															{param.name}
														</button>
													);
												})}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="flex items-center gap-2">
					<div className="flex flex-wrap gap-1 min-w-0 flex-1">
						{getColorCodedFormula(calculation.formula)}
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							<p className="text-sm">Formula: {calculation.formula}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</TableCell>
	);
}
 