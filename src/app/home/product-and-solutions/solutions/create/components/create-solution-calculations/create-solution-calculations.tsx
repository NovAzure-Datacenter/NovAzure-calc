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
import PreviewDialog from "../create-solution-parameters/preview-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
		display_result: false,
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
		display_result: false,
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
		display_result: false,
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
		display_result: false,
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
		display_result: false,
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
		display_result: false,
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
		display_result: false,
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
		display_result: false,
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

// FilterOptionsEditor component
function FilterOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: {
	options: string[];
	onOptionsChange: (options: string[]) => void;
	isEditing: boolean;
}) {
	const addOption = () => {
		onOptionsChange([...options, ""]);
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		onOptionsChange(newOptions);
	};

	const removeOption = (index: number) => {
		onOptionsChange(options.filter((_, i) => i !== index));
	};

	if (!isEditing) {
		return (
			<div className="text-xs text-muted-foreground">
				{options.length > 0 ? (
					<div className="space-y-1">
						{options.map((option, index) => (
							<div key={index} className="flex items-center gap-1">
								<span>{option}</span>
							</div>
						))}
					</div>
				) : (
					<span>No filter options defined</span>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{options.map((option, index) => (
				<div key={index} className="flex items-center gap-1">
					<Input
						value={option}
						onChange={(e) => updateOption(index, e.target.value)}
						className="h-6 text-xs w-24"
						placeholder="UK, USA, UAE"
					/>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => removeOption(index)}
						className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			))}
			<Button
				size="sm"
				variant="outline"
				onClick={addOption}
				className="h-6 text-xs"
			>
				<Plus className="h-3 w-3 mr-1" />
				Add Filter Option
			</Button>
		</div>
	);
}

// DropdownOptionsEditor component
function DropdownOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: {
	options: Array<{ key: string; value: string }>;
	onOptionsChange: (options: Array<{ key: string; value: string }>) => void;
	isEditing: boolean;
}) {
	const addOption = () => {
		onOptionsChange([...options, { key: "", value: "" }]);
	};

	const updateOption = (index: number, field: "key" | "value", value: string) => {
		const newOptions = [...options];
		newOptions[index] = { ...newOptions[index], [field]: value };
		onOptionsChange(newOptions);
	};

	const removeOption = (index: number) => {
		onOptionsChange(options.filter((_, i) => i !== index));
	};

	if (!isEditing) {
		return (
			<div className="text-xs text-muted-foreground">
				{options.length > 0 ? (
					<div className="space-y-1">
						{options.map((option, index) => (
							<div key={index} className="flex items-center gap-1">
								<span className="font-medium">{option.key}:</span>
								<span>{option.value}</span>
							</div>
						))}
					</div>
				) : (
					<span>No options defined</span>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{options.map((option, index) => (
				<div key={index} className="flex items-center gap-1">
					<Input
						value={option.key}
						onChange={(e) => updateOption(index, "key", e.target.value)}
						className="h-6 text-xs w-20"
						placeholder="Location"
					/>
					<span className="text-xs">:</span>
					<Input
						value={option.value}
						onChange={(e) => updateOption(index, "value", e.target.value)}
						className="h-6 text-xs w-24"
						placeholder="UK, UAE, USA, Singapore"
					/>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => removeOption(index)}
						className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			))}
			<Button
				size="sm"
				variant="outline"
				onClick={addOption}
				className="h-6 text-xs"
			>
				<Plus className="h-3 w-3 mr-1" />
				Add Option
			</Button>
		</div>
	);
}

interface CalculationsConfigurationProps {
	calculations: Calculation[];
	onCalculationsChange: (calculations: Calculation[]) => void;
	parameters: any[];
	onParametersChange?: (parameters: any[]) => void;
	selectedIndustry?: string;
	selectedTechnology?: string;
	selectedSolutionId?: string;
	availableIndustries?: any[];
	availableTechnologies?: any[];
	availableSolutionTypes?: any[];
	customCategories?: Array<{ name: string; color: string }>;
	setCustomCategories?: React.Dispatch<
		React.SetStateAction<Array<{ name: string; color: string }>>
	>;
	isLoadingCalculations?: boolean;
}

// Function to convert mock calculations to Calculation format
const convertMockToCalculation = (mock: Calculation): Calculation => {
	return mock;
};

export function CalculationsConfiguration({
	calculations,
	onCalculationsChange,
	parameters,
	onParametersChange,
	selectedIndustry,
	selectedTechnology,
	selectedSolutionId,
	availableIndustries,
	availableTechnologies,
	availableSolutionTypes,
	customCategories = [],
	setCustomCategories,
	isLoadingCalculations = false,
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
		display_result: boolean;
	}>({
		name: "",
		formula: "",
		units: "",
		description: "",
		category: "financial",
		output: false,
		display_result: false,
	});

	// State for category tabs and management
	const [activeTab, setActiveTab] = useState("all");
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
		color: "blue",
	});
	// State for add parameter form
	const [isAddNewParameterDialogOpen, setIsAddNewParameterDialogOpen] = useState(false);
	const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

	// State for new parameter data
	const [newParameterData, setNewParameterData] = useState({
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		information: "",
		category: "",
		provided_by: "user",
		input_type: "simple",
		output: false,
		display_type: "simple" as "simple" | "dropdown" | "range" | "filter",
		dropdown_options: [] as Array<{ key: string; value: string }>,
		range_min: "",
		range_max: "",
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
		display_result: false,
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
			typeof calc.category === 'string' || !calc.category || calc.display_result === undefined
		);
		
		if (needsMigration) {
			const migratedCalculations = calculations.map(calc => {
				// If category is already in new format and display_result exists, return as is
				if (calc.category && typeof calc.category === 'object' && calc.category.name && calc.display_result !== undefined) {
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
					display_result: calc.display_result !== undefined ? calc.display_result : false,
					category: {
						name: oldCategory,
						color: defaultColors[oldCategory.toLowerCase()] || "gray"
					}
				};
			});
			
			onCalculationsChange(migratedCalculations);
		}
	}, [calculations, onCalculationsChange, hasInitialized]); 

	// Reset form when dialog opens
	useEffect(() => {
		if (isAddNewParameterDialogOpen) {
			resetNewParameterData();
		}
	}, [isAddNewParameterDialogOpen]);

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

			// Add calculations to context (for formulas that reference other calculations)
			calculations.forEach((calc) => {
				// Only include calculations that have valid results
				if (calc.result !== "Error" && typeof calc.result === "number") {
					context[calc.name] = calc.result;
					// Also add with spaces replaced by underscores for formula compatibility
					context[calc.name.replace(/\s+/g, "_")] = calc.result;
				}
			});

			// Replace parameter and calculation names in formula with their values
			let evaluatedFormula = formula;
			Object.entries(context).forEach(([key, value]) => {
				const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "g");
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
			// Create a temporary context for evaluation to avoid infinite loops
			const createEvaluationContext = () => {
				const context: { [key: string]: number } = {};

				// Add parameters to context
				parameters.forEach((param) => {
					const value =
						param.overrideValue !== null
							? param.overrideValue
							: param.defaultValue;
					context[param.id] = value;
					context[param.id.replace(/-/g, "_")] = value;
				});

				// Add calculations to context (for formulas that reference other calculations)
				calculations.forEach((calc) => {
					// Only include calculations that have valid results
					if (calc.result !== "Error" && typeof calc.result === "number") {
						context[calc.name] = calc.result;
						context[calc.name.replace(/\s+/g, "_")] = calc.result;
					}
				});

				return context;
			};

			const context = createEvaluationContext();
			
			const updatedCalculations = calculations.map((calc) => {
				try {
					// Check for self-reference
					const selfReference = calc.formula.includes(calc.name);
					if (selfReference) {
						return {
							...calc,
							result: "Error",
							status: "error" as const,
						};
					}

					// Replace parameter and calculation names in formula with their values
					let evaluatedFormula = calc.formula;
					Object.entries(context).forEach(([key, value]) => {
						const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "g");
						evaluatedFormula = evaluatedFormula.replace(regex, value.toString());
					});

					// Safe evaluation using Function constructor
					const result = new Function(
						...Object.keys(context),
						`return ${evaluatedFormula}`
					)(...Object.values(context));

					const finalResult = typeof result === "number" && !isNaN(result) && isFinite(result)
						? parseFloat(result.toFixed(2))
						: "Error";

					return {
						...calc,
						result: finalResult,
						status: finalResult === "Error" ? ("error" as const) : ("valid" as const),
					};
				} catch (error) {
					return {
						...calc,
						result: "Error",
						status: "error" as const,
					};
				}
			});
			
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
			display_result: calculation.display_result !== undefined ? calculation.display_result : false,
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
						display_result: editData.display_result,
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
			display_result: false,
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
			display_result: false,
		});
	};

	// Handle category management
	const handleAddCategory = () => {
		const newCategory: CustomCalculationCategory = {
			name: newCategoryData.name,
			color: newCategoryData.color,
		};
		setCustomCategories?.(prev => [...prev, newCategory]);
		setIsAddCategoryDialogOpen(false);
		setNewCategoryData({
			name: "",
			description: "",
			color: "blue",
		});
	};

	const handleRemoveCategory = (categoryName: string) => {
		setCustomCategories?.(prev => prev.filter(cat => cat.name !== categoryName));
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
			display_result: false,
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
			display_result: newCalculationData.display_result !== undefined ? newCalculationData.display_result : false,
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
			display_result: false,
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
			display_result: false,
		});
	};

	const handleDeleteCalculation = (calculationId: string) => {
		const updatedCalculations = calculations.filter(
			(calc) => calc.id !== calculationId
		);
		onCalculationsChange(updatedCalculations);
	};

	// Handle new parameter dialog
	const handleSaveNewParameter = () => {
		// Validate required fields
		if (!newParameterData.name.trim()) {
			toast.error("Parameter name is required");
			return;
		}
		
		if (!newParameterData.unit.trim()) {
			toast.error("Unit is required");
			return;
		}

		// Conditional validation based on provided_by and display_type
		if (newParameterData.provided_by === "company") {
			if (newParameterData.display_type === "simple" && !newParameterData.value.trim()) {
				toast.error("Value is required when provided by company");
				return;
			} else if (newParameterData.display_type === "range" && (!newParameterData.range_min.trim() || !newParameterData.range_max.trim())) {
				toast.error("Range min and max values are required when provided by company");
				return;
			} else if ((newParameterData.display_type === "dropdown" || newParameterData.display_type === "filter") && newParameterData.dropdown_options.length === 0) {
				toast.error("Options are required when provided by company");
				return;
			}
		}

		// Create new parameter
		const newParameter = {
			id: `param-${Date.now()}`,
			name: newParameterData.name,
			value: newParameterData.value,
			test_value: newParameterData.test_value,
			unit: newParameterData.unit,
			description: newParameterData.description,
			information: newParameterData.information,
			category: {
				name: newParameterData.category,
				color: "gray", // Default color
			},
			provided_by: newParameterData.provided_by,
			input_type: newParameterData.input_type,
			output: newParameterData.output,
			display_type: newParameterData.display_type,
			dropdown_options: newParameterData.dropdown_options,
			range_min: newParameterData.range_min,
			range_max: newParameterData.range_max,
		};

		// Add to parameters list if onParametersChange is provided
		if (onParametersChange) {
			onParametersChange([newParameter, ...parameters]);
			toast.success("Parameter added successfully!");
		}

		// Close dialog and reset form
		setIsAddNewParameterDialogOpen(false);
		resetNewParameterData();
	};

	const handleCancelNewParameter = () => {
		setIsAddNewParameterDialogOpen(false);
		resetNewParameterData();
	};

	const resetNewParameterData = () => {
		setNewParameterData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			information: "",
			category: "",
			provided_by: "user",
			input_type: "simple",
			output: false,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
		});
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

	// Add calculations as available parameters for formula building
	const groupedParametersWithCalculations = { ...groupedParameters };
	
	// Add calculations under a "Calculations" category
	if (calculations.length > 0) {
		groupedParametersWithCalculations["Calculations"] = calculations.map(calc => ({
			id: calc.id,
			name: calc.name,
			description: calc.description,
			value: calc.result,
			test_value: calc.result,
			unit: calc.units,
			category: {
				name: "Calculations",
				color: "indigo"
			},
			provided_by: "calculation",
			input_type: "calculation",
			output: calc.output,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
			level: calc.level || 1,
			status: calc.status,
			formula: calc.formula
		}));
	}

	// Function to get all available categories including configuration categories
	const getAllAvailableCategories = () => {
		const configurationCategories = [
			{ name: "High Level Configuration", color: "blue" },
			{ name: "Low Level Configuration", color: "green" },
			{ name: "Advanced Configuration", color: "purple" }
		];
		return [...configurationCategories, ...customCategories];
	};

	// Function to get category badge style
	const getCategoryBadgeStyle = (categoryName: string) => {
		const category = getAllAvailableCategories().find(cat => cat.name === categoryName);
		if (category) {
			return {
				backgroundColor: `var(--${category.color}-50)`,
				borderColor: `var(--${category.color}-200)`,
				color: `var(--${category.color}-700)`,
			};
		}
		return {};
	};

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
				setIsAddNewParameterDialogOpen={setIsAddNewParameterDialogOpen}
				setIsPreviewDialogOpen={setIsPreviewDialogOpen}
			/>

			{/* Loading indicator for existing solution calculations */}
			{isLoadingCalculations && (
				<div className="flex items-center justify-center py-8">
					<div className="flex items-center gap-3">
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
						<span className="text-sm text-muted-foreground">
							Loading existing solution calculations...
						</span>
					</div>
				</div>
			)}

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
				groupedParameters={groupedParametersWithCalculations}
				isAddingCalculation={isAddingCalculation}
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				handleSaveNewCalculation={handleSaveNewCalculation}
				handleCancelAddCalculation={handleCancelAddCalculation}
				handleAddCalculation={handleAddCalculation}
				allCategories={getAllCategories()}
				customCategories={customCategories}
			/>

			<PreviewDialog 
				isOpen={isPreviewDialogOpen}
				onOpenChange={setIsPreviewDialogOpen}
				parameters={parameters}
				selectedIndustry={selectedIndustry}
				selectedTechnology={selectedTechnology}
				selectedSolutionId={selectedSolutionId}
				availableIndustries={availableIndustries}
				availableTechnologies={availableTechnologies}
				availableSolutionTypes={availableSolutionTypes}
			/>

			{/* Add Parameter Dialog */}
			<Dialog
				open={isAddNewParameterDialogOpen}
				onOpenChange={setIsAddNewParameterDialogOpen}
			>
				<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Add New Parameter</DialogTitle>
						<DialogDescription>
							Create a new parameter for your calculations. Current parameters: {parameters.length}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						{/* Parameter Name */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-name" className="text-right">
								Name *
							</Label>
							<div className="col-span-3">
								<Input
									id="parameter-name"
									value={newParameterData.name}
									onChange={(e) =>
										setNewParameterData((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									placeholder="Parameter name"
								/>
							</div>
						</div>

						{/* Category */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-category" className="text-right">
								Category *
							</Label>
							<div className="col-span-3">
								<Select
									value={newParameterData.category}
									onValueChange={(value) =>
										setNewParameterData((prev) => ({
											...prev,
											category: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{getAllAvailableCategories().length > 0 ? (
											getAllAvailableCategories().map((category) => (
												<SelectItem
													key={category.name}
													value={category.name}
												>
													<div className="flex items-center gap-2">
														<Badge
															variant="outline"
															className="text-xs"
															style={getCategoryBadgeStyle(category.name)}
														>
															{category.name}
														</Badge>
													</div>
												</SelectItem>
											))
										) : (
											<div className="px-2 py-1.5 text-xs text-muted-foreground">
												No categories available.
											</div>
										)}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Display Type */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-display-type" className="text-right">
								Display Type
							</Label>
							<div className="col-span-3">
								<Select
									value={newParameterData.display_type}
									onValueChange={(value) =>
										setNewParameterData((prev) => ({
											...prev,
											display_type: value as "simple" | "dropdown" | "range" | "filter",
										}))
									}
								>
									<SelectTrigger>
										<SelectValue>
											{newParameterData.display_type || "Select type"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="simple">Simple</SelectItem>
										<SelectItem value="dropdown">Dropdown</SelectItem>
										<SelectItem value="range">Range</SelectItem>
										<SelectItem value="filter">Filter</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Value based on display type */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-value" className="text-right">
								Value
							</Label>
							<div className="col-span-3">
								{newParameterData.display_type === "dropdown" ? (
									<DropdownOptionsEditor
										options={newParameterData.dropdown_options}
										onOptionsChange={(options) =>
											setNewParameterData((prev) => ({
												...prev,
												dropdown_options: options,
											}))
										}
										isEditing={true}
									/>
								) : newParameterData.display_type === "range" ? (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Input
												value={newParameterData.range_min}
												onChange={(e) =>
													setNewParameterData((prev) => ({
														...prev,
														range_min: e.target.value,
													}))
												}
												placeholder="Min"
												type="number"
												step="any"
											/>
											<span className="text-xs text-muted-foreground">to</span>
											<Input
												value={newParameterData.range_max}
												onChange={(e) =>
													setNewParameterData((prev) => ({
														...prev,
														range_max: e.target.value,
													}))
												}
												placeholder="Max"
												type="number"
												step="any"
											/>
										</div>
									</div>
								) : newParameterData.display_type === "filter" ? (
									<FilterOptionsEditor
										options={newParameterData.dropdown_options.map(opt => opt.value)}
										onOptionsChange={(options) =>
											setNewParameterData((prev) => ({
												...prev,
												dropdown_options: options.map(opt => ({ key: "", value: opt })),
											}))
										}
										isEditing={true}
									/>
								) : (
									<Input
										value={newParameterData.value}
										onChange={(e) =>
											setNewParameterData((prev) => ({
												...prev,
												value: e.target.value,
											}))
										}
										placeholder={
											newParameterData.provided_by === "company"
												? "Value *"
												: "Value (optional)"
										}
										type="number"
									/>
								)}
							</div>
						</div>

						{/* Test Value */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-test-value" className="text-right">
								Test Value
							</Label>
							<div className="col-span-3">
								<Input
									id="parameter-test-value"
									value={newParameterData.test_value}
									onChange={(e) =>
										setNewParameterData((prev) => ({
											...prev,
											test_value: e.target.value,
										}))
									}
									placeholder="Test Value"
									type="number"
								/>
							</div>
						</div>

						{/* Unit */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-unit" className="text-right">
								Unit *
							</Label>
							<div className="col-span-3">
								<Input
									id="parameter-unit"
									value={newParameterData.unit}
									onChange={(e) =>
										setNewParameterData((prev) => ({
											...prev,
											unit: e.target.value,
										}))
									}
									placeholder="Unit"
								/>
							</div>
						</div>

						{/* Description */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-description" className="text-right">
								Description
							</Label>
							<div className="col-span-3">
								<Input
									id="parameter-description"
									value={newParameterData.description}
									onChange={(e) =>
										setNewParameterData((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									placeholder="Description"
								/>
							</div>
						</div>

						{/* Information */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-information" className="text-right">
								Information
							</Label>
							<div className="col-span-3">
								<Input
									id="parameter-information"
									value={newParameterData.information}
									onChange={(e) =>
										setNewParameterData((prev) => ({
											...prev,
											information: e.target.value,
										}))
									}
									placeholder="Information"
								/>
							</div>
						</div>

						{/* Provided By */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-provided-by" className="text-right">
								Provided By
							</Label>
							<div className="col-span-3">
								<Select
									value={newParameterData.provided_by}
									onValueChange={(value) =>
										setNewParameterData((prev) => ({
											...prev,
											provided_by: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue>
											{newParameterData.provided_by || "Select provider"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="user">User</SelectItem>
										<SelectItem value="company">Company</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Input Type */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-input-type" className="text-right">
								Input Type
							</Label>
							<div className="col-span-3">
								<Select
									value={newParameterData.input_type}
									onValueChange={(value) =>
										setNewParameterData((prev) => ({
											...prev,
											input_type: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue>
											{newParameterData.input_type || "Select type"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="simple">Simple</SelectItem>
										<SelectItem value="advanced">Advanced</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Output */}
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="parameter-output" className="text-right">
								Output
							</Label>
							<div className="col-span-3">
								<Select
									value={newParameterData.output ? "true" : "false"}
									onValueChange={(value) =>
										setNewParameterData((prev) => ({
											...prev,
											output: value === "true",
										}))
									}
								>
									<SelectTrigger>
										<SelectValue>
											{newParameterData.output ? "True" : "False"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">True</SelectItem>
										<SelectItem value="false">False</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancelNewParameter}>
							Cancel
						</Button>
						<Button 
							onClick={handleSaveNewParameter}
							disabled={
								!newParameterData.name.trim() ||
								!newParameterData.unit.trim() ||
								(newParameterData.provided_by === "company" &&
									((newParameterData.display_type === "simple" && !newParameterData.value.trim()) ||
									 (newParameterData.display_type === "range" && (!newParameterData.range_min.trim() || !newParameterData.range_max.trim())) ||
									 (newParameterData.display_type === "dropdown" && newParameterData.dropdown_options.length === 0) ||
									 (newParameterData.display_type === "filter" && newParameterData.dropdown_options.length === 0)))
							}
						>
							Add Parameter
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			
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
