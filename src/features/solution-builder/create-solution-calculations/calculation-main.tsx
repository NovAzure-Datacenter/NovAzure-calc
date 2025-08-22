"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import CalculationCategoryTabs from "./category-tabs";
import { CustomCalculationCategory } from "../utils/calculation-color-utils";
import { Calculation } from "@/types/types";
import { CalculationTable } from "./components/table";
import { SearchBar } from "@/features/solution-builder/components/common";
import PreviewDialog from "./components/dialogs/preview-dialog";
import { LoadingIndicator } from "./components/common/loading-indicator";
import { AddParameterDialog } from "./components/dialogs/add-parameter-dialog";
import {
	CalculationsConfigurationProps,
	CalculationEditData,
	ParameterEditData,
} from "../types/types";
import { useCalculationValidator } from "./hooks/useCalculationValidator";
import { useCalculatorLevelManager } from "./hooks/useCalculatorLevelManager";
import { getStatusColor } from "./services/calculation-service";


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
		category: "capex",
		output: false,
		display_result: false,
	});

	// Replace the problematic useEffect with useMemo
	const availableCategories = useMemo(() => {
		const extractedCategories = new Set<string>();
		
		// Add default categories
		extractedCategories.add("capex");
		extractedCategories.add("opex");
		
		// Extract categories from calculations
		calculations.forEach(calculation => {
			if (calculation.category) {
				const categoryName = typeof calculation.category === "string" 
					? calculation.category 
					: calculation.category.name;
				if (categoryName) {
					extractedCategories.add(categoryName.toLowerCase());
				}
			}
		});
		
		// Create category objects with default colors using full Tailwind classes
		const categoryObjects = Array.from(extractedCategories).map(name => {
			// Default colors for known categories using full Tailwind classes
			const defaultColors: Record<string, string> = {
				capex: "bg-green-50 text-green-700 border-green-200",
				opex: "bg-blue-50 text-blue-700 border-blue-200",
			};
			
			return {
				name: name,
				color: defaultColors[name.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"
			};
		});
		
		return categoryObjects;
	}, [calculations]); // Only recalculate when calculations change

	/**
	 * Get all available categories including custom ones
	 */
	const getAllAvailableCategories = () => {
		const allCategories = [...availableCategories];
		
		// Add custom categories
		if (customCategories) {
			customCategories.forEach(customCat => {
				if (!allCategories.find(cat => cat.name.toLowerCase() === customCat.name.toLowerCase())) {
					allCategories.push({
						name: customCat.name,
						color: customCat.color
					});
				}
			});
		}
		
		return allCategories;
	};

	/**
	 * Get all categories for tabs (including custom categories)
	 */
	const getAllCategories = () => {
		const allCategories = getAllAvailableCategories();
		
		// Return just the category names as strings
		return ["all", ...allCategories.map(cat => cat.name)];
	};

	/**
	 * Get category color by name
	 */
	const getCategoryColorByName = (categoryName: string) => {
		const allCategories = getAllAvailableCategories();
		const category = allCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
		return category?.color || "bg-gray-50 text-gray-700 border-gray-200";
	};


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

	// Search state
	const [searchQuery, setSearchQuery] = useState("");

	// State for new parameter data
	const [newParameterData, setNewParameterData] = useState<ParameterEditData>({
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		category: "Global",
		user_interface: {
			type: "input" as "input" | "static" | "not_viewable",
			category: "Global",
			is_advanced: false,
		},
		output: false,
		display_type: "simple" as "simple" | "dropdown" | "range" | "filter",
		dropdown_options: [] as Array<{ key: string; value: string }>,
		range_min: "",
		range_max: "",
		conditional_rules: [] as Array<{ condition: string; value: string }>,
	});

	// State for add calculation form
	const [isAddingCalculation, setIsAddingCalculation] = useState(false);
	const [newCalculationData, setNewCalculationData] = useState({
		name: "",
		description: "",
		formula: "",
		units: "",
		category: "capex",
		output: false,
		display_result: false,
	});

	// Reset form when dialog opens
	useEffect(() => {
		if (isAddNewParameterDialogOpen) {
			resetNewParameterData();
		}
	}, [isAddNewParameterDialogOpen]);

	const groupedParameters = useMemo(() => {
		const grouped = parameters.reduce((acc, param) => {
			const categoryName = param.category.name;
			if (!acc[categoryName]) {
				acc[categoryName] = [];
			}
			acc[categoryName].push(param);
			return acc;
		}, {} as Record<string, (typeof parameters)[0][]>);

		return grouped;
	}, [parameters]);

	const groupedParametersWithCalculations = useMemo(() => {
		const grouped = { ...groupedParameters };

		if (calculations.length > 0) {
			grouped["Calculations"] = calculations.map(
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
					level: calc.level || 2,
					status: calc.status,
					formula: calc.formula,
				})
			);
		}

		return grouped;
	}, [groupedParameters, calculations]);

	// Memoize calculation data to prevent infinite loops
	const editCalculationData = useMemo(() => {
		return editingCalculation && editData.name && editData.formula
			? {
					name: editData.name,
					formula: editData.formula,
			  }
			: null;
	}, [editingCalculation, editData.name, editData.formula]);

	const newCalculationDataForValidation = useMemo(() => {
		return isAddingCalculation &&
			newCalculationData.name &&
			newCalculationData.formula
			? newCalculationData
			: null;
	}, [
		isAddingCalculation,
		newCalculationData,
	]);

	const editCalculationResult = useCalculationValidator(groupedParametersWithCalculations, editCalculationData);
	const newCalculationResult = useCalculationValidator(groupedParametersWithCalculations, newCalculationDataForValidation);
	
	const { parameters: parametersWithLevels } = useCalculatorLevelManager(groupedParametersWithCalculations, calculations);

	useEffect(() => {
		if (parametersWithLevels.length > 0) {
			const calculationLevelUpdates = parametersWithLevels
				.filter(p => p.type === "CALCULATION")
				.map(p => ({ name: p.name, level: p.level }));

			let hasLevelChanges = false;
			const updatedCalculations = calculations.map(calc => {
				const levelUpdate = calculationLevelUpdates.find(update => update.name === calc.name);
				if (levelUpdate && calc.level !== levelUpdate.level) {
					hasLevelChanges = true;
					return { ...calc, level: levelUpdate.level };
				}
				return calc;
			});

			if (hasLevelChanges) {
				onCalculationsChange(updatedCalculations);
			}
		}
	}, [parametersWithLevels, calculations, onCalculationsChange]);

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
		// Ensure formula editor starts in collapsed state when editing begins
		// This will be handled by the TableContent component
	};

	/**
	 * Handle saving calculation changes
	 */
	const handleSaveCalculation = (calculationId: string) => {
		const calculationResult = editCalculationResult ? 
			Object.values(editCalculationResult)[0] : null;
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
							color: getCategoryColorByName(editData.category),
						},
						output: editData.output,
						display_result: editData.display_result,
						result: calculationResult,
						status:
							calculationResult === null
								? ("error" as const)
								: ("valid" as const),
				  }
				: calc
		);
		onCalculationsChange(updatedCalculations as Calculation[]);
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
			category: "capex",
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
		const defaultCategory = activeTab === "all" ? "capex" : activeTab;
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

		const calculationResult = newCalculationResult ? 
			Object.values(newCalculationResult)[0] : null;

		const categoryColor = getCategoryColorByName(newCalculationData.category);

		const calculatedLevel = 2;

		const newCalculation: Calculation = {
			id: `calc-${Date.now()}`,
			name: newCalculationData.name,
			formula: newCalculationData.formula,
			result: calculationResult || "Error",
			units: newCalculationData.units,
			description: newCalculationData.description,
			status: calculationResult !== null ? "valid" : "error",
			category: {
				name: newCalculationData.category,
				color: categoryColor,
			},
			output: newCalculationData.output,
			display_result:
				newCalculationData.display_result !== undefined
					? newCalculationData.display_result
					: false,
			level: calculatedLevel,
		};

		onCalculationsChange([newCalculation, ...calculations]);
		setIsAddingCalculation(false);
		setNewCalculationData({
			name: "",
			description: "",
			formula: "",
			units: "",
			category: "capex",
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

		if (!newParameterData.category.trim()) {
			toast.error("Category is required");
			return;
		}

		// Check for duplicate parameter names (case-insensitive)
		const normalizedNewName = newParameterData.name.trim().toLowerCase();
		const hasDuplicate = parameters.some(param => 
			param.name.toLowerCase() === normalizedNewName
		);
		
		if (hasDuplicate) {
			toast.error(`A parameter named "${newParameterData.name.trim()}" already exists.`);
			return;
		}

		if (newParameterData.user_interface?.type === "static") {
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
			category: "Global",
			user_interface: {
				type: "input",
				category: "Global",
				is_advanced: false,
			},
			output: false,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
			conditional_rules: [],
		});
	};

	/**
	 * Formula manipulation functions (insert, reset, rewind)
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
		return getCategoryColorByName(category);
	};
	const getCategoryBadgeStyle = (categoryName: string) => {
		const categoryColor = getCategoryColorByName(categoryName);
		
		// Extract color name from the full Tailwind class string
		// Example: "bg-green-50 text-green-700 border-green-200" -> "green"
		const colorMatch = categoryColor.match(/bg-(\w+)-\d+/);
		if (colorMatch) {
			const colorName = colorMatch[1];
			return {
				backgroundColor: `var(--${colorName}-50)`,
				borderColor: `var(--${colorName}-200)`,
				color: `var(--${colorName}-700)`,
			};
		}
		return {};
	};

	const getFilteredCalculations = (): Calculation[] => {
		let filtered = calculations;

		// Filter by active tab
		if (activeTab !== "all") {
			filtered = filtered.filter((calc) => {
				if (!calc.category) {
					return false;
				}

				const categoryName = (() => {
					if (typeof calc.category === "string") {
						return (calc.category as string).toLowerCase();
					}
					return (calc.category?.name || "").toLowerCase();
				})();

				return categoryName?.toLowerCase() === activeTab.toLowerCase();
			});
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((calc) => {
				const name = calc.name.toLowerCase();
				const description = calc.description.toLowerCase();
				const formula = calc.formula.toLowerCase();
				const units = calc.units.toLowerCase();
				const status = String(calc.status || "").toLowerCase();
				const categoryName = (() => {
					if (typeof calc.category === "string") {
						return (calc.category as string).toLowerCase();
					}
					return (calc.category?.name || "").toLowerCase();
				})();

				return (
					name.includes(query) ||
					description.includes(query) ||
					formula.includes(query) ||
					units.includes(query) ||
					status.includes(query) ||
					categoryName.includes(query)
				);
			});
		}

		return filtered;
	};

	// Simplified loading state - only use the prop from parent
	const isTableLoading = isLoadingCalculations;

	return (
		<div className="space-y-6 ">
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

			<LoadingIndicator isLoading={isTableLoading} />

			<SearchBar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				filteredItems={getFilteredCalculations()}
				placeholder="Search calculations by name, category, description, formula, units, or status..."
			/>

			{/* Only render table when not loading */}
			{!isTableLoading && (
				<CalculationTable
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
			)}

			<PreviewDialog
				isOpen={isPreviewDialogOpen}
				onOpenChange={setIsPreviewDialogOpen}
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
		</div>
	);
}

