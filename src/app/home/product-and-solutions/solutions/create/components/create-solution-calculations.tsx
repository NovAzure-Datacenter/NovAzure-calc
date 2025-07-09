"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
	Edit,
	Save,
	X,
	Info,
	Plus,
	AlertTriangle,
	Calculator,
	Plus as PlusIcon,
	Minus,
	X as MultiplyIcon,
	Divide,
	Percent,
} from "lucide-react";

export interface Calculation {
	id: string;
	name: string;
	formula: string;
	result: number | string;
	units: string;
	description: string;
	status: "valid" | "error" | "pending";
	category: "financial" | "performance" | "efficiency" | "operational";
}

interface CalculationsConfigurationProps {
	calculations: Calculation[];
	onCalculationsChange: (calculations: Calculation[]) => void;
	parameters: any[]; // Parameters for formula evaluation
}

export function CalculationsConfiguration({
	calculations,
	onCalculationsChange,
	parameters,
}: CalculationsConfigurationProps) {
	const [editingCalculation, setEditingCalculation] = useState<string | null>(
		null
	);
	const [editData, setEditData] = useState<{
		name: string;
		formula: string;
		units: string;
		description: string;
	}>({
		name: "",
		formula: "",
		units: "",
		description: "",
	});

	// Evaluate formula and return result
	const evaluateFormula = (formula: string): number | string => {
		try {
			// Create a safe evaluation context with parameter values
			const context: { [key: string]: number } = {};

			// Add parameters to context
			parameters.forEach((param) => {
				const value =
					param.overrideValue !== null
						? param.overrideValue
						: param.defaultValue;
				context[param.id] = value;
				// Also add with spaces replaced by underscores for formula compatibility
				context[param.id.replace(/-/g, "_")] = value;
			});

			// Replace parameter names in formula with their values
			let evaluatedFormula = formula;
			Object.entries(context).forEach(([key, value]) => {
				const regex = new RegExp(`\\b${key}\\b`, "g");
				evaluatedFormula = evaluatedFormula.replace(regex, value.toString());
			});

			// Safe evaluation using Function constructor
			const result = new Function(
				...Object.keys(context),
				`return ${evaluatedFormula}`
			)(...Object.values(context));

			if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
				return parseFloat(result.toFixed(2));
			}
			return "Error";
		} catch (error) {
			return "Error";
		}
	};

	// Update calculation results
	useEffect(() => {
		const updatedCalculations = calculations.map((calc) => ({
			...calc,
			result: evaluateFormula(calc.formula),
			status:
				evaluateFormula(calc.formula) === "Error"
					? ("error" as const)
					: ("valid" as const),
		}));
		onCalculationsChange(updatedCalculations);
	}, [parameters]);

	const handleEditCalculation = (calculation: Calculation) => {
		setEditingCalculation(calculation.id);
		setEditData({
			name: calculation.name,
			formula: calculation.formula,
			units: calculation.units,
			description: calculation.description,
		});
	};

	const handleSaveCalculation = (calculationId: string) => {
		const updatedCalculations = calculations.map((calc) =>
			calc.id === calculationId
				? {
						...calc,
						name: editData.name,
						formula: editData.formula,
						units: editData.units,
						description: editData.description,
						result: evaluateFormula(editData.formula),
						status:
							evaluateFormula(editData.formula) === "Error"
								? ("error" as const)
								: ("valid" as const),
				  }
				: calc
		);
		onCalculationsChange(updatedCalculations);
		setEditingCalculation(null);
		setEditData({
			name: "",
			formula: "",
			units: "",
			description: "",
		});
	};

	const handleCancelEdit = () => {
		setEditingCalculation(null);
		setEditData({
			name: "",
			formula: "",
			units: "",
			description: "",
		});
	};

	const handleAddCalculation = () => {
		const newCalculation: Calculation = {
			id: `calc-${Date.now()}`,
			name: "New Calculation",
			formula: "",
			result: "Error",
			units: "",
			description: "",
			status: "error",
			category: "financial",
		};
		onCalculationsChange([...calculations, newCalculation]);
		setEditingCalculation(newCalculation.id);
		setEditData({
			name: "New Calculation",
			formula: "",
			units: "",
			description: "",
		});
	};

	const handleDeleteCalculation = (calculationId: string) => {
		const updatedCalculations = calculations.filter(
			(calc) => calc.id !== calculationId
		);
		onCalculationsChange(updatedCalculations);
	};

	// Function to insert parameter or operator into formula
	const insertIntoFormula = (text: string) => {
		setEditData((prev) => ({
			...prev,
			formula: prev.formula + text,
		}));
	};

	// Function to reset the entire formula
	const resetFormula = () => {
		setEditData((prev) => ({
			...prev,
			formula: "",
		}));
	};

	// Function to remove the last entry from formula
	const rewindFormula = () => {
		setEditData((prev) => ({
			...prev,
			formula: prev.formula.slice(0, -1),
		}));
	};

	// Function to get color-coded formula display
	const getColorCodedFormula = (formula: string) => {
		// Split formula into tokens for color coding
		const tokens = formula
			.split(/([+\-*/()]|\w+)/)
			.filter((token) => token.trim());

		return tokens.map((token, index) => {
			if (/^[+\-*/()]+$/.test(token)) {
				// Operators
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-blue-600 border-blue-200 bg-blue-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			} else if (/^\w+$/.test(token)) {
				// Parameters
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-gray-600 border-gray-200 bg-gray-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			} else if (/^\d+$/.test(token)) {
				// Numbers
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-purple-600 border-purple-200 bg-purple-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			} else {
				// Other characters
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-gray-500 border-gray-200 bg-gray-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			}
		});
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
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
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "valid":
				return "bg-green-100 text-green-800";
			case "error":
				return "bg-red-100 text-red-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Group parameters by category for better organization
	const groupedParameters = parameters.reduce((acc, param) => {
		if (!acc[param.category]) {
			acc[param.category] = [];
		}
		acc[param.category].push(param);
		return acc;
	}, {} as Record<string, (typeof parameters)[0][]>);

	return (
		<div className="space-y-4">
			{/* Header with Add Button */}
			<div className="flex justify-between items-center">
				<div>
					<Label className="text-sm font-medium">Calculations</Label>
					<p className="text-xs text-muted-foreground">
						Manage your calculation formulas and view results
					</p>
				</div>
				<Button
					onClick={handleAddCalculation}
					size="sm"
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					New Calculation
				</Button>
			</div>

			{/* Scrollable Table Container */}
			<div className="border rounded-md">
				<div className="max-h-[55vh] overflow-y-auto">
					<TooltipProvider>
						<Table>
							<TableHeader className="sticky top-0 bg-background z-10">
								<TableRow>
									<TableHead className="w-32 bg-background">Name</TableHead>
									<TableHead className="w-80 bg-background">Formula</TableHead>
									<TableHead className="w-24 bg-background">Result</TableHead>
									<TableHead className="w-16 bg-background">Units</TableHead>
									<TableHead className="w-20 bg-background">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{calculations.map((calculation) => {
									const isEditing = editingCalculation === calculation.id;

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
													<div className="flex items-center gap-2">
														<span className="font-medium text-sm">
															{calculation.name}
														</span>
														<Badge
															variant="outline"
															className={`text-xs ${getCategoryColor(
																calculation.category
															)}`}
														>
															{calculation.category}
														</Badge>
													</div>
												)}
											</TableCell>
											<TableCell>
												{isEditing ? (
													<div className="space-y-2">
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
																placeholder="Enter formula"
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
														{/* Color-coded formula preview */}
														{editData.formula && (
															<div className="text-xs font-mono p-2 bg-muted/30 rounded border">
																<div className="text-muted-foreground mb-1">
																	Preview:
																</div>
																<div className="flex flex-wrap gap-1">
																	{getColorCodedFormula(editData.formula)}
																</div>
															</div>
														)}
														{/* Parameter Picker */}
														<div className="border rounded-md p-2 bg-muted/30">
															<div className="text-xs font-medium mb-2 text-muted-foreground">
																Parameters & Operators
															</div>
															<div className="space-y-2">
																{/* Operators */}
																<div>
																	<div className="text-xs text-muted-foreground mb-1">
																		Operators:
																	</div>
																	<div className="flex flex-wrap gap-2">
																		{[
																			{ symbol: "+", label: "Add" },
																			{ symbol: "-", label: "Subtract" },
																			{ symbol: "*", label: "Multiply" },
																			{ symbol: "/", label: "Divide" },
																			{
																				symbol: "(",
																				label: "Open Parenthesis",
																			},
																			{
																				symbol: ")",
																				label: "Close Parenthesis",
																			},
																			{ symbol: "**", label: "Power" },
																		].map((op) => (
																			<Button
																				key={op.symbol}
																				size="sm"
																				variant="outline"
																				onClick={() =>
																					insertIntoFormula(op.symbol)
																				}
																				className="h-6 px-3 text-xs font-mono"
																				title={op.label}
																			>
																				{op.symbol}
																			</Button>
																		))}
																	</div>
																</div>
																{/* Parameters by Category */}
																{Object.entries(groupedParameters).map(
																	([category, params]) => (
																		<div key={category}>
																			<div className="text-xs text-muted-foreground mb-1 capitalize">
																				{category}:
																			</div>
																			<div className="flex flex-wrap gap-1">
																				{(params as any[]).map((param: any) => (
																					<Tooltip key={param.id}>
																						<TooltipTrigger asChild>
																							<Button
																								size="sm"
																								variant="outline"
																								onClick={() =>
																									insertIntoFormula(param.id)
																								}
																								className="h-6 px-2 text-xs"
																							>
																								{param.name}
																							</Button>
																						</TooltipTrigger>
																						<TooltipContent>
																							<div className="text-xs">
																								<div className="font-medium">
																									{param.name}
																								</div>
																								<div className="text-muted-foreground">
																									{param.description}
																								</div>
																								<div className="text-muted-foreground">
																									Value:{" "}
																									{param.overrideValue !== null
																										? param.overrideValue
																										: param.defaultValue}{" "}
																									{param.units}
																								</div>
																							</div>
																						</TooltipContent>
																					</Tooltip>
																				))}
																			</div>
																		</div>
																	)
																)}
															</div>
														</div>
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
																<p className="text-sm">
																	Formula: {calculation.formula}
																</p>
															</TooltipContent>
														</Tooltip>
													</div>
												)}
											</TableCell>
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
											<TableCell>
												<div className="flex items-center gap-1">
													{!isEditing ? (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	handleEditCalculation(calculation)
																}
																className="h-6 w-6 p-0"
																disabled={editingCalculation !== null}
															>
																<Edit className="h-3 w-3" />
															</Button>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	handleDeleteCalculation(calculation.id)
																}
																className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
																disabled={editingCalculation !== null}
															>
																<X className="h-3 w-3" />
															</Button>
														</>
													) : (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	handleSaveCalculation(calculation.id)
																}
																className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
															>
																<Save className="h-3 w-3" />
															</Button>
															<Button
																size="sm"
																variant="ghost"
																onClick={handleCancelEdit}
																className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
															>
																<X className="h-3 w-3" />
															</Button>
														</>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TooltipProvider>
				</div>
			</div>

			{/* Summary and Help */}
			<div className="flex justify-between items-center pt-3 border-t">
				<div className="text-sm text-muted-foreground">
					<span className="font-medium">{calculations.length}</span>{" "}
					calculations
					<span className="mx-2">•</span>
					<span className="font-medium">
						{calculations.filter((c) => c.status === "valid").length}
					</span>{" "}
					valid
					<span className="mx-2">•</span>
					<span className="font-medium text-red-600">
						{calculations.filter((c) => c.status === "error").length}
					</span>{" "}
					errors
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<Calculator className="h-3 w-3" />
					Click parameters to insert into formulas
				</div>
			</div>
		</div>
	);
}
