"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

import CalculationCategoryTabs from "./category-tabs";
import { CustomCalculationCategory } from "../../utils/calculation-color-utils";
import { Calculation } from "@/types/types";
import { TableContent } from "./table-content";
import PreviewDialog from "../create-solution-parameters/preview-dialog";
import {
	CalculationsConfigurationProps,
	CalculationEditData,
	FilterOptionsEditorProps,
	DropdownOptionsEditorProps,
} from "../../types/types";

/**
 * CalculationMain component
 * Main component for managing solution calculations
 * Provides comprehensive interface for creating, editing, and organizing calculations
 */
export function CalculationMain({
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
	// State management
	const [editingCalculation, setEditingCalculation] = useState<string | null>(
		null
	);
	const [editData, setEditData] = useState<CalculationEditData>({
		name: "",
		formula: "",
		units: "",
		description: "",
		category: "financial",
		output: false,
		display_result: false,
	});

	const [activeTab, setActiveTab] = useState("all");
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
		color: "blue",
	});
	const [isAddNewParameterDialogOpen, setIsAddNewParameterDialogOpen] =
		useState(false);
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
		user_interface: {
			type: "input" as "input" | "static" | "not_viewable",
			category: "",
			is_advanced: false,
		},
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
		const needsMigration = calculations.some(
			(calc) =>
				typeof calc.category === "string" ||
				!calc.category ||
				calc.display_result === undefined
		);

		if (needsMigration) {
			const migratedCalculations = calculations.map((calc) => {
				if (
					calc.category &&
					typeof calc.category === "object" &&
					calc.category.name &&
					calc.display_result !== undefined
				) {
					return calc;
				}

				const oldCategory =
					typeof calc.category === "string" ? calc.category : "financial";
				const defaultColors: Record<string, string> = {
					financial: "green",
					performance: "blue",
					efficiency: "yellow",
					operational: "purple",
				};

				return {
					...calc,
					display_result:
						calc.display_result !== undefined ? calc.display_result : false,
					category: {
						name: oldCategory,
						color: defaultColors[oldCategory.toLowerCase()] || "gray",
					},
				};
			});

			onCalculationsChange(migratedCalculations);
		}
	}, [calculations, onCalculationsChange]);

	// Reset form when dialog opens
	useEffect(() => {
		if (isAddNewParameterDialogOpen) {
			resetNewParameterData();
		}
	}, [isAddNewParameterDialogOpen]);

	/**
	 * Evaluate formula and return result
	 */
	const evaluateFormula = (formula: string): number | string => {
		try {
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

			// Add calculations to context
			calculations.forEach((calc) => {
				if (calc.result !== "Error" && typeof calc.result === "number") {
					context[calc.name] = calc.result;
					context[calc.name.replace(/\s+/g, "_")] = calc.result;
				}
			});

			// Replace parameter and calculation names in formula with their values
			let evaluatedFormula = formula;
			Object.entries(context).forEach(([key, value]) => {
				const regex = new RegExp(
					`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
					"g"
				);
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
		if (calculations.length > 0 && hasInitialized) {
			const createEvaluationContext = () => {
				const context: { [key: string]: number } = {};

				parameters.forEach((param) => {
					const value =
						param.overrideValue !== null
							? param.overrideValue
							: param.defaultValue;
					context[param.id] = value;
					context[param.id.replace(/-/g, "_")] = value;
				});

				calculations.forEach((calc) => {
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
					const selfReference = calc.formula.includes(calc.name);
					if (selfReference) {
						return {
							...calc,
							result: "Error",
							status: "error" as const,
						};
					}

					let evaluatedFormula = calc.formula;
					Object.entries(context).forEach(([key, value]) => {
						const regex = new RegExp(
							`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
							"g"
						);
						evaluatedFormula = evaluatedFormula.replace(
							regex,
							value.toString()
						);
					});

					const result = new Function(
						...Object.keys(context),
						`return ${evaluatedFormula}`
					)(...Object.values(context));

					const finalResult =
						typeof result === "number" && !isNaN(result) && isFinite(result)
							? parseFloat(result.toFixed(2))
							: "Error";

					return {
						...calc,
						result: finalResult,
						status:
							finalResult === "Error" ? ("error" as const) : ("valid" as const),
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

	/**
	 * Handle calculation editing
	 */
	const handleEditCalculation = (calculation: Calculation) => {
		setEditingCalculation(calculation.id);
		setEditData({
			name: calculation.name,
			formula: calculation.formula,
			units: calculation.units,
			description: calculation.description,
			category:
				typeof calculation.category === "string"
					? calculation.category
					: calculation.category?.name || "financial",
			output: calculation.output,
			display_result:
				calculation.display_result !== undefined
					? calculation.display_result
					: false,
		});
	};

	/**
	 * Handle saving calculation changes
	 */
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

	/**
	 * Handle canceling calculation edit
	 */
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

	/**
	 * Handle category management
	 */
	const handleAddCategory = () => {
		const newCategory: CustomCalculationCategory = {
			name: newCategoryData.name,
			color: newCategoryData.color,
		};
		setCustomCategories?.((prev) => [...prev, newCategory]);
		setIsAddCategoryDialogOpen(false);
		setNewCategoryData({
			name: "",
			description: "",
			color: "blue",
		});
	};

	const handleRemoveCategory = (categoryName: string) => {
		setCustomCategories?.((prev) =>
			prev.filter((cat) => cat.name !== categoryName)
		);
		if (activeTab === categoryName) {
			setActiveTab("all");
		}
	};

	/**
	 * Handle calculation management
	 */
	const handleAddCalculation = () => {
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
		if (!newCalculationData.name.trim() || !newCalculationData.formula.trim()) {
			return;
		}

		let categoryColor = "green";
		const customCategory = customCategories.find(
			(cat) => cat.name === newCalculationData.category
		);
		if (customCategory) {
			categoryColor = customCategory.color;
		} else {
			const defaultColors: Record<string, string> = {
				financial: "green",
				performance: "blue",
				efficiency: "yellow",
				operational: "purple",
			};
			categoryColor =
				defaultColors[newCalculationData.category.toLowerCase()] || "gray";
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
			display_result:
				newCalculationData.display_result !== undefined
					? newCalculationData.display_result
					: false,
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

	/**
	 * Handle new parameter dialog
	 */
	const handleSaveNewParameter = () => {
		if (!newParameterData.name.trim()) {
			toast.error("Parameter name is required");
			return;
		}

		if (!newParameterData.unit.trim()) {
			toast.error("Unit is required");
			return;
		}

		if (newParameterData.user_interface.type === "static") {
			if (
				newParameterData.display_type === "simple" &&
				!newParameterData.value.trim()
			) {
				toast.error("Value is required when provided by static");
				return;
			} else if (
				newParameterData.display_type === "range" &&
				(!newParameterData.range_min.trim() ||
					!newParameterData.range_max.trim())
			) {
				toast.error(
					"Range min and max values are required when provided by static"
				);
				return;
			} else if (
				(newParameterData.display_type === "dropdown" ||
					newParameterData.display_type === "filter") &&
				newParameterData.dropdown_options.length === 0
			) {
				toast.error("Options are required when provided by static");
				return;
			}
		}

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
				color: "gray",
			},
			user_interface: newParameterData.user_interface,
			output: newParameterData.output,
			display_type: newParameterData.display_type,
			dropdown_options: newParameterData.dropdown_options,
			range_min: newParameterData.range_min,
			range_max: newParameterData.range_max,
		};

		if (onParametersChange) {
			onParametersChange([newParameter, ...parameters]);
			toast.success("Parameter added successfully!");
		}

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
			user_interface: {
				type: "input",
				category: "",
				is_advanced: false,
			},
			output: false,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
		});
	};

	/**
	 * Formula manipulation functions
	 */
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
			return;
		}

		const tokens: string[] = [];
		let currentToken = "";

		const parts = currentFormula.split(/([+\-*/()])/);

		for (const part of parts) {
			if (/^[+\-*/()]$/.test(part)) {
				if (currentToken.trim()) {
					tokens.push(currentToken.trim());
					currentToken = "";
				}
				tokens.push(part);
			} else {
				currentToken += part;
			}
		}

		if (currentToken.trim()) {
			tokens.push(currentToken.trim());
		}

		return tokens
			.map((token, index) => {
				if (/^[+\-*/()]+$/.test(token)) {
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
					return null;
				}
			})
			.filter(Boolean);
	};

	const getColorCodedFormula = (formula: string) => {
		const tokens: string[] = [];
		let currentToken = "";

		const parts = formula.split(/([+\-*/()])/);

		for (const part of parts) {
			if (/^[+\-*/()]$/.test(part)) {
				if (currentToken.trim()) {
					tokens.push(currentToken.trim());
					currentToken = "";
				}
				tokens.push(part);
			} else {
				currentToken += part;
			}
		}

		if (currentToken.trim()) {
			tokens.push(currentToken.trim());
		}

		return tokens
			.map((token, index) => {
				if (/^[+\-*/()]+$/.test(token)) {
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
					return null;
				}
			})
			.filter(Boolean);
	};

	/**
	 * Utility functions
	 */
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

	const groupedParametersWithCalculations = { ...groupedParameters };

	if (calculations.length > 0) {
		groupedParametersWithCalculations["Calculations"] = calculations.map(
			(calc) => ({
				id: calc.id,
				name: calc.name,
				description: calc.description,
				value: calc.result,
				test_value: calc.result,
				unit: calc.units,
				category: {
					name: "Calculations",
					color: "indigo",
				},
				user_interface: {
					type: "input",
					category: "Calculations",
					is_advanced: false,
				},
				output: calc.output,
				display_type: "simple",
				dropdown_options: [],
				range_min: "",
				range_max: "",
				level: calc.level || 1,
				status: calc.status,
				formula: calc.formula,
			})
		);
	}

	const getAllAvailableCategories = () => {
		return [...customCategories];
	};

	const getCategoryBadgeStyle = (categoryName: string) => {
		const category = getAllAvailableCategories().find(
			(cat) => cat.name === categoryName
		);
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
		const defaultCategories = [
			"financial",
			"performance",
			"efficiency",
			"operational",
		];
		const customCategoryNames = customCategories.map((cat) => cat.name);
		return [...defaultCategories, ...customCategoryNames];
	};

	const getFilteredCalculations = (): Calculation[] => {
		if (activeTab === "all") {
			return calculations;
		}
		return calculations.filter((calc) => {
			if (!calc.category) {
				return false;
			}

			const categoryName =
				typeof calc.category === "string" ? calc.category : calc.category.name;

			return categoryName?.toLowerCase() === activeTab.toLowerCase();
		});
	};

	return (
		<div className="space-y-4">
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

			<LoadingIndicator isLoading={isLoadingCalculations} />

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

			<AddParameterDialog
				isOpen={isAddNewParameterDialogOpen}
				onOpenChange={setIsAddNewParameterDialogOpen}
				newParameterData={newParameterData}
				setNewParameterData={setNewParameterData}
				onSaveParameter={handleSaveNewParameter}
				onCancelParameter={handleCancelNewParameter}
				getAllAvailableCategories={getAllAvailableCategories}
				getCategoryBadgeStyle={getCategoryBadgeStyle}
				parametersCount={parameters.length}
			/>

			<CalculationsSummary filteredCalculations={getFilteredCalculations()} />
		</div>
	);
}

/**
 * FilterOptionsEditor component
 * Manages filter options for parameter configuration
 */
function FilterOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: FilterOptionsEditorProps) {
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

/**
 * DropdownOptionsEditor component
 * Manages dropdown options for parameter configuration
 */
function DropdownOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: DropdownOptionsEditorProps) {
	const addOption = () => {
		onOptionsChange([...options, { key: "", value: "" }]);
	};

	const updateOption = (
		index: number,
		field: "key" | "value",
		value: string
	) => {
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

/**
 * LoadingIndicator component
 * Shows loading state for calculations
 */
function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
	if (!isLoading) return null;

	return (
		<div className="flex items-center justify-center py-8">
			<div className="flex items-center gap-3">
				<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
				<span className="text-sm text-muted-foreground">
					Loading existing solution calculations...
				</span>
			</div>
		</div>
	);
}

/**
 * CalculationsSummary component
 * Shows summary statistics for calculations
 */
function CalculationsSummary({
	filteredCalculations,
}: {
	filteredCalculations: Calculation[];
}) {
	const validCount = filteredCalculations.filter(
		(c) => c.status === "valid"
	).length;
	const errorCount = filteredCalculations.filter(
		(c) => c.status === "error"
	).length;

	return (
		<div className="flex justify-between items-center pt-3 border-t">
			<div className="text-sm text-muted-foreground">
				<span className="font-medium">{filteredCalculations.length}</span>{" "}
				calculations
				<span className="mx-2">•</span>
				<span className="font-medium">{validCount}</span> valid
				<span className="mx-2">•</span>
				<span className="font-medium text-red-600">{errorCount}</span> errors
			</div>
			<div className="flex items-center gap-2 text-xs text-muted-foreground">
				<span>Click parameters to insert into formulas</span>
			</div>
		</div>
	);
}

/**
 * AddParameterDialog component
 * Dialog for adding new parameters
 */
function AddParameterDialog({
	isOpen,
	onOpenChange,
	newParameterData,
	setNewParameterData,
	onSaveParameter,
	onCancelParameter,
	getAllAvailableCategories,
	getCategoryBadgeStyle,
	parametersCount,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	newParameterData: any;
	setNewParameterData: React.Dispatch<React.SetStateAction<any>>;
	onSaveParameter: () => void;
	onCancelParameter: () => void;
	getAllAvailableCategories: () => Array<{ name: string; color: string }>;
	getCategoryBadgeStyle: (categoryName: string) => React.CSSProperties;
	parametersCount: number;
}) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Parameter</DialogTitle>
					<DialogDescription>
						Create a new parameter for your calculations. Current parameters:{" "}
						{parametersCount}
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
									setNewParameterData((prev: any) => ({
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
									setNewParameterData((prev: any) => ({
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
											<SelectItem key={category.name} value={category.name}>
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
									setNewParameterData((prev: any) => ({
										...prev,
										display_type: value as
											| "simple"
											| "dropdown"
											| "range"
											| "filter",
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
										setNewParameterData((prev: any) => ({
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
												setNewParameterData((prev: any) => ({
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
												setNewParameterData((prev: any) => ({
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
									options={newParameterData.dropdown_options.map(
										(opt: any) => opt.value
									)}
									onOptionsChange={(options) =>
										setNewParameterData((prev: any) => ({
											...prev,
											dropdown_options: options.map((opt: string) => ({
												key: "",
												value: opt,
											})),
										}))
									}
									isEditing={true}
								/>
							) : (
								<Input
									value={newParameterData.value}
									onChange={(e) =>
										setNewParameterData((prev: any) => ({
											...prev,
											value: e.target.value,
										}))
									}
									placeholder={
										newParameterData.user_interface.type === "static"
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
									setNewParameterData((prev: any) => ({
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
									setNewParameterData((prev: any) => ({
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
									setNewParameterData((prev: any) => ({
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
									setNewParameterData((prev: any) => ({
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
								value={newParameterData.user_interface.type}
								onValueChange={(value) =>
									setNewParameterData((prev: any) => ({
										...prev,
										user_interface: {
											...prev.user_interface,
											type: value as "input" | "static" | "not_viewable",
										},
									}))
								}
							>
								<SelectTrigger>
									<SelectValue>
										{newParameterData.user_interface.type || "Select provider"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="input">User Input</SelectItem>
									<SelectItem value="static">Static Value</SelectItem>
									<SelectItem value="not_viewable">Not Viewable</SelectItem>
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
									setNewParameterData((prev: any) => ({
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
					<Button variant="outline" onClick={onCancelParameter}>
						Cancel
					</Button>
					<Button
						onClick={onSaveParameter}
						disabled={
							!newParameterData.name.trim() ||
							!newParameterData.unit.trim() ||
							(newParameterData.user_interface.type === "static" &&
								((newParameterData.display_type === "simple" &&
									!newParameterData.value.trim()) ||
									(newParameterData.display_type === "range" &&
										(!newParameterData.range_min.trim() ||
											!newParameterData.range_max.trim())) ||
									(newParameterData.display_type === "dropdown" &&
										newParameterData.dropdown_options.length === 0) ||
									(newParameterData.display_type === "filter" &&
										newParameterData.dropdown_options.length === 0)))
						}
					>
						Add Parameter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
