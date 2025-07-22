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
import CalculationCategoryTabs from "./calculation-category-tabs";
import { CustomCalculationCategory } from "./calculation-color-utils";
import { Calculation } from "@/app/home/product-and-solutions/types";
import { TableContent } from "./table-content";

// Mock data for calculations
const mockCalculations: Calculation[] = [
	{
		id: "calc-001",
		name: "Total Energy Consumption",
		description: "Calculates the total energy consumption in kilowatt-hours",
		formula: "power_rating * operating_hours * efficiency_factor",
		result: "2,450 kWh",
		units: "kWh",
		output: true,
		level: 1,
		status: "valid",
		category: {
			name: "operational",
			color: "purple",
		},
	},
	{
		id: "calc-002",
		name: "Cost per Unit",
		description: "Determines the cost per unit of energy produced",
		formula: "total_cost / energy_output",
		result: "$0.12",
		units: "$/kWh",
		output: true,
		level: 2,
		status: "valid",
		category: {
			name: "financial",
			color: "green",
		},
	},
	{
		id: "calc-003",
		name: "Efficiency Ratio",
		description: "Measures the efficiency of the system",
		formula: "actual_output / theoretical_maximum",
		result: "85.5%",
		units: "%",
		output: false,
		level: 1,
		status: "valid",
		category: {
			name: "efficiency",
			color: "yellow",
		},
	},
	{
		id: "calc-004",
		name: "Carbon Footprint",
		description: "Calculates the carbon emissions in metric tons",
		formula: "energy_consumption * emission_factor",
		result: "1.2 tCO2",
		units: "tCO2",
		output: true,
		level: 3,
		status: "valid",
		category: {
			name: "operational",
			color: "purple",
		},
	},
	{
		id: "calc-005",
		name: "ROI Calculation",
		description: "Return on investment percentage",
		formula: "(net_profit / total_investment) * 100",
		result: "23.4%",
		units: "%",
		output: true,
		level: 2,
		status: "valid",
		category: {
			name: "financial",
			color: "green",
		},
	},
	{
		id: "calc-006",
		name: "Maintenance Cost",
		description: "Annual maintenance costs",
		formula: "base_maintenance + (operating_hours * hourly_rate)",
		result: "$15,750",
		units: "$",
		output: false,
		level: 1,
		status: "valid",
		category: {
			name: "operational",
			color: "purple",
		},
	},
	{
		id: "calc-007",
		name: "Peak Load Capacity",
		description: "Maximum load the system can handle",
		formula: "rated_capacity * safety_factor",
		result: "500 kW",
		units: "kW",
		output: true,
		level: 2,
		status: "valid",
		category: {
			name: "performance",
			color: "blue",
		},
	},
	{
		id: "calc-008",
		name: "Uptime Percentage",
		description: "System availability percentage",
		formula: "(operating_hours / total_hours) * 100",
		result: "98.7%",
		units: "%",
		output: true,
		level: 1,
		status: "valid",
		category: {
			name: "performance",
			color: "blue",
		},
	},
];

// Mock categories data
const mockCategories = [
	{
		name: "financial",
		color: "green",
	},
	{
		name: "performance",
		color: "blue",
	},
	{
		name: "efficiency",
		color: "yellow",
	},
	{
		name: "operational",
		color: "purple",
	},
];

// Export mock data and conversion function for external use
export { mockCalculations, mockCategories, convertMockToCalculation };

interface CalculationsConfigurationProps {
	calculations: Calculation[];
	onCalculationsChange: (calculations: Calculation[]) => void;
	parameters: any[]; 
}

// Function to convert mock calculations to Calculation format
const convertMockToCalculation = (mock: Calculation): Calculation => {
	return mock;
};

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
		category: string;
		output: boolean;
	}>({
		name: "",
		formula: "",
		units: "",
		description: "",
		category: "financial",
		output: false,
	});

	// State for category tabs and management
	const [activeTab, setActiveTab] = useState("all");
	const [customCategories, setCustomCategories] = useState<CustomCalculationCategory[]>([]);
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
		color: "blue",
	});

	// State for add calculation form
	const [isAddingCalculation, setIsAddingCalculation] = useState(false);
	const [newCalculationData, setNewCalculationData] = useState({
		name: "",
		description: "",
		formula: "",
		units: "",
		category: "financial",
		output: false,
	});
	const [hasInitialized, setHasInitialized] = useState(false);

	// Migrate old calculations to new format
	useEffect(() => {
		// If no calculations are provided, initialize with mock data
		if (calculations.length === 0 && !hasInitialized) {
			const initialCalculations = mockCalculations.map(convertMockToCalculation);
			onCalculationsChange(initialCalculations);
			setHasInitialized(true);
			return;
		}
		
		const needsMigration = calculations.some(calc => 
			typeof calc.category === 'string' || !calc.category
		);
		
		if (needsMigration) {
			const migratedCalculations = calculations.map(calc => {
				// If category is already in new format, return as is
				if (calc.category && typeof calc.category === 'object' && calc.category.name) {
					return calc;
				}
				
				// Migrate from old format
				const oldCategory = typeof calc.category === 'string' ? calc.category : 'financial';
				const defaultColors: Record<string, string> = {
					financial: "green",
					performance: "blue", 
					efficiency: "yellow",
					operational: "purple"
				};
				
				return {
					...calc,
					category: {
						name: oldCategory,
						color: defaultColors[oldCategory.toLowerCase()] || "gray"
					}
				};
			});
			
			onCalculationsChange(migratedCalculations);
		}
	}, [calculations, onCalculationsChange, hasInitialized]); 

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
		// Only update if we have calculations and they have formulas, and we've initialized
		if (calculations.length > 0 && hasInitialized) {
		const updatedCalculations = calculations.map((calc) => ({
			...calc,
			result: evaluateFormula(calc.formula),
			status:
				evaluateFormula(calc.formula) === "Error"
					? ("error" as const)
					: ("valid" as const),
		}));
		onCalculationsChange(updatedCalculations);
		}
	}, [parameters, hasInitialized]);

	const handleEditCalculation = (calculation: Calculation) => {
		setEditingCalculation(calculation.id);
		setEditData({
			name: calculation.name,
			formula: calculation.formula,
			units: calculation.units,
			description: calculation.description,
			category: typeof calculation.category === 'string' ? calculation.category : calculation.category?.name || "financial",
			output: calculation.output,
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
						category: {
							name: editData.category,
							color: getCategoryColor(editData.category),
						},
						output: editData.output,
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
			category: "financial",
			output: false,
		});
	};

	const handleCancelEdit = () => {
		setEditingCalculation(null);
		setEditData({
			name: "",
			formula: "",
			units: "",
			description: "",
			category: "financial",
			output: false,
		});
	};

	// Handle category management
	const handleAddCategory = () => {
		const newCategory: CustomCalculationCategory = {
			name: newCategoryData.name,
			color: newCategoryData.color,
		};
		setCustomCategories(prev => [...prev, newCategory]);
		setIsAddCategoryDialogOpen(false);
		setNewCategoryData({
			name: "",
			description: "",
			color: "blue",
		});
	};

	const handleRemoveCategory = (categoryName: string) => {
		setCustomCategories(prev => prev.filter(cat => cat.name !== categoryName));
		// If the active tab is being removed, switch to "all"
		if (activeTab === categoryName) {
			setActiveTab("all");
		}
	};

	// Handle calculation management
	const handleAddCalculation = () => {
		// Set the default category based on active tab
		const defaultCategory = activeTab === "all" ? "financial" : activeTab;
		setNewCalculationData({
			name: "",
			description: "",
			formula: "",
			units: "",
			category: defaultCategory,
			output: false,
		});
		setIsAddingCalculation(true);
	};

	const handleSaveNewCalculation = () => {
		// Validate required fields
		if (!newCalculationData.name.trim() || !newCalculationData.formula.trim()) {
			return;
		}

		// Determine the category color
		let categoryColor = "green";
		const customCategory = customCategories.find(cat => cat.name === newCalculationData.category);
		if (customCategory) {
			categoryColor = customCategory.color;
		} else {
			// Use default color mapping
			const defaultColors: Record<string, string> = {
				financial: "green",
				performance: "blue", 
				efficiency: "yellow",
				operational: "purple"
			};
			categoryColor = defaultColors[newCalculationData.category.toLowerCase()] || "gray";
		}

		const newCalculation: Calculation = {
			id: `calc-${Date.now()}`,
			name: newCalculationData.name,
			formula: newCalculationData.formula,
			result: "Error",
			units: newCalculationData.units,
			description: newCalculationData.description,
			status: "error",
			category: {
				name: newCalculationData.category,
				color: categoryColor,
			},
			output: newCalculationData.output,
			level: 1,
		};

		onCalculationsChange([newCalculation, ...calculations]);
		setIsAddingCalculation(false);
		setNewCalculationData({
			name: "",
			description: "",
			formula: "",
			units: "",
			category: "financial",
			output: false,
		});
	};

	const handleCancelAddCalculation = () => {
		setIsAddingCalculation(false);
		setNewCalculationData({
			name: "",
			description: "",
			formula: "",
			units: "",
			category: "financial",
			output: false,
		});
	};

	const handleDeleteCalculation = (calculationId: string) => {
		const updatedCalculations = calculations.filter(
			(calc) => calc.id !== calculationId
		);
		onCalculationsChange(updatedCalculations);
	};

	const insertIntoFormula = (text: string) => {
		if (isAddingCalculation) {
			setNewCalculationData((prev) => ({
				...prev,
				formula: prev.formula + text,
			}));
		} else {
		setEditData((prev) => ({
			...prev,
			formula: prev.formula + text,
		}));
		}
	};

	const resetFormula = () => {
		if (isAddingCalculation) {
			setNewCalculationData((prev) => ({
				...prev,
				formula: "",
			}));
		} else {
		setEditData((prev) => ({
			...prev,
			formula: "",
		}));
		}
	};

	const rewindFormula = () => {
		const getCurrentFormula = () => {
			if (isAddingCalculation) {
				return newCalculationData.formula;
			} else {
				return editData.formula;
			}
		};

		const setFormula = (newFormula: string) => {
			if (isAddingCalculation) {
				setNewCalculationData((prev) => ({
					...prev,
					formula: newFormula,
				}));
			} else {
				setEditData((prev) => ({
					...prev,
					formula: newFormula,
				}));
			}
		};

		const currentFormula = getCurrentFormula();
		
		if (!currentFormula.trim()) {
			return; // Nothing to remove
		}

		// Use the same tokenization logic as getColorCodedFormula
		const tokens: string[] = [];
		let currentToken = '';
		
		// Split by operators first, then process each part
		const parts = currentFormula.split(/([+\-*/()])/);
		
		for (const part of parts) {
			if (/^[+\-*/()]$/.test(part)) {
				// This is an operator, add it as a separate token
				if (currentToken.trim()) {
					tokens.push(currentToken.trim());
					currentToken = '';
				}
				tokens.push(part);
			} else {
				// This is a parameter or number, preserve spaces within it
				currentToken += part;
			}
		}
		
		// Add any remaining token
		if (currentToken.trim()) {
			tokens.push(currentToken.trim());
		}

		// Remove the last token
		if (tokens.length > 0) {
			tokens.pop();
		}

		// Reconstruct the formula from remaining tokens
		const newFormula = tokens.join(' ');
		setFormula(newFormula);
	};

	const getColorCodedFormula = (formula: string) => {
		// More sophisticated tokenization that preserves parameter names with spaces
		const tokens: string[] = [];
		let currentToken = '';
		let inParameter = false;
		
		// Split by operators first, then process each part
		const parts = formula.split(/([+\-*/()])/);
		
		for (const part of parts) {
			if (/^[+\-*/()]$/.test(part)) {
				// This is an operator, add it as a separate token
				if (currentToken.trim()) {
					tokens.push(currentToken.trim());
					currentToken = '';
				}
				tokens.push(part);
			} else {
				// This is a parameter or number, preserve spaces within it
				currentToken += part;
			}
		}
		
		// Add any remaining token
		if (currentToken.trim()) {
			tokens.push(currentToken.trim());
		}

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
			} else if (token.trim()) {
				// Parameters (including those with spaces)
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-gray-600 border-gray-200 bg-gray-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			} else {
				// Empty tokens (shouldn't happen with our logic)
				return null;
			}
		}).filter(Boolean);
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

	const groupedParameters = parameters.reduce((acc, param) => {
		const categoryName = param.category.name;
		if (!acc[categoryName]) {
			acc[categoryName] = [];
		}
		acc[categoryName].push(param);
		return acc;
	}, {} as Record<string, (typeof parameters)[0][]>);

	const getAllCategories = (): string[] => {
		const defaultCategories = ["financial", "performance", "efficiency", "operational"];
		const customCategoryNames = customCategories.map(cat => cat.name);
		return [...defaultCategories, ...customCategoryNames];
	};

	const getFilteredCalculations = (): Calculation[] => {
		if (activeTab === "all") {
			return calculations;
		}
		return calculations.filter(calc => {
			// Handle cases where category might be undefined or have the old structure
			if (!calc.category) {
				return false;
			}
			
			// Handle both old string format and new object format
			const categoryName = typeof calc.category === 'string' 
				? calc.category 
				: calc.category.name;
			
			return categoryName?.toLowerCase() === activeTab.toLowerCase();
		});
	};

	return (
		<div className="space-y-4">
			{/* Category Tabs */}
			<CalculationCategoryTabs
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				allCategories={getAllCategories()}
				handleRemoveCategory={handleRemoveCategory}
				setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
				newCategoryData={newCategoryData}
				setNewCategoryData={setNewCategoryData}
				handleAddCategory={handleAddCategory}
				isAddCategoryDialogOpen={isAddCategoryDialogOpen}
				handleAddCalculation={handleAddCalculation}
				isAddingCalculation={isAddingCalculation}
				editingCalculation={editingCalculation}
				handleCancelAddCalculation={handleCancelAddCalculation}
				calculations={calculations}
				customCategories={customCategories}
			/>

			{/* Table Content */}
			<TableContent
				calculations={getFilteredCalculations()}
				editingCalculation={editingCalculation}
				editData={editData}
				setEditData={setEditData}
				handleEditCalculation={handleEditCalculation}
				handleSaveCalculation={handleSaveCalculation}
				handleCancelEdit={handleCancelEdit}
				handleDeleteCalculation={handleDeleteCalculation}
				insertIntoFormula={insertIntoFormula}
				resetFormula={resetFormula}
				rewindFormula={rewindFormula}
				getColorCodedFormula={getColorCodedFormula}
				getCategoryColor={getCategoryColor}
				getStatusColor={getStatusColor}
				groupedParameters={groupedParameters}
				isAddingCalculation={isAddingCalculation}
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				handleSaveNewCalculation={handleSaveNewCalculation}
				handleCancelAddCalculation={handleCancelAddCalculation}
				handleAddCalculation={handleAddCalculation}
				allCategories={getAllCategories()}
				customCategories={customCategories}
			/>

			{/* Summary and Help */}
			<div className="flex justify-between items-center pt-3 border-t">
				<div className="text-sm text-muted-foreground">
					<span className="font-medium">{getFilteredCalculations().length}</span>{" "}
					calculations
					<span className="mx-2">•</span>
					<span className="font-medium">
						{getFilteredCalculations().filter((c) => c.status === "valid").length}
					</span>{" "}
					valid
					<span className="mx-2">•</span>
					<span className="font-medium text-red-600">
						{getFilteredCalculations().filter((c) => c.status === "error").length}
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
