"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import CategoryTabs from "./category-tabs";
import Searchbar from "./search-bar";
import TableContent from "./table-content";
import {
	getLevelColor,
	getCategoryTailwindClasses,
} from "../../../../utils/color-utils";
import PreviewDialog from "./preview-dialog";
import { Parameter } from "@/types/types";
import {
	CreateSolutionParametersProps,
	ParameterEditData,
	ConfirmCategoryRemovalDialogProps,
	ConfirmParameterRemovalDialogProps,
	ParameterValidationResult,
} from "../../types/types";
import { getAllGlobalParameters } from "@/lib/actions/global-parameters/global-parameters";

/**
 * CreateSolutionParameters component - Main component for managing solution parameters
 * Provides a comprehensive interface for creating, editing, and organizing parameters
 * Handles parameter validation, category management, and parameter filtering
 */
export function ParameterMain({
	parameters,
	onParametersChange,
	customCategories,
	setCustomCategories,
	selectedIndustry,
	selectedTechnology,
	selectedSolutionId,
	availableIndustries = [],
	availableTechnologies = [],
	availableSolutionTypes = [],
	isLoadingParameters = false,
}: CreateSolutionParametersProps) {
	// State management
	const [editingParameter, setEditingParameter] = useState<string | null>(null);
	const [editData, setEditData] = useState<ParameterEditData>(
		getDefaultParameterEditData()
	);
	const [activeTab, setActiveTab] = useState("all");
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
		color: "blue",
	});
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [confirmCategory, setConfirmCategory] = useState<string | null>(null);
	const [isParameterConfirmDialogOpen, setIsParameterConfirmDialogOpen] =
		useState(false);
	const [confirmParameter, setConfirmParameter] = useState<string | null>(null);
	const [isAddingParameter, setIsAddingParameter] = useState(false);
	const [newParameterData, setNewParameterData] = useState<ParameterEditData>(
		getDefaultParameterEditData()
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
	const [columnVisibility, setColumnVisibility] = useState({
		parameterName: true,
		category: true,
		displayType: true,
		value: true,
		testValue: true,
		unit: true,
		description: true,
		information: true,
		userInterface: true,
		output: true,
		actions: true,
	});

	// Parameter management handlers
	const handleEditParameter = (parameter: Parameter) => {
		setEditingParameter(parameter.id);
		setEditData(convertParameterToEditData(parameter));
	};

	const handleSaveParameter = (parameterId: string) => {
		const validation = validateParameterEditData(editData);
		if (!validation.isValid) {
			return;
		}

		const currentParameter = parameters.find((p) => p.id === parameterId);
		if (!currentParameter) return;

		const updatedParameters = parameters.map((param) =>
			param.id === parameterId
				? convertEditDataToParameter(
						editData,
						currentParameter.category.color,
						parameterId
				  )
				: param
		);

		onParametersChange(updatedParameters);
		setEditingParameter(null);
		setEditData(getDefaultParameterEditData());
	};

	const handleCancelEdit = () => {
		setEditingParameter(null);
		setEditData(getDefaultParameterEditData());
	};

	const handleAddParameter = () => {
		setIsAddingParameter(true);
		setNewParameterData({
			...getDefaultParameterEditData(),
			category: activeTab === "all" || activeTab === "Global" ? "" : activeTab,
		});
	};

	const handleSaveNewParameter = () => {
		const validation = validateParameterEditData(newParameterData);
		if (!validation.isValid) {
			return;
		}

		const selectedCategory = customCategories.find(
			(cat) => cat.name === newParameterData.category
		);
		const categoryColor = selectedCategory?.color || "blue";

		const newParameter: Parameter = convertEditDataToParameter(
			newParameterData,
			categoryColor,
			`param-${Date.now()}`
		);

		onParametersChange([newParameter, ...parameters]);
		setIsAddingParameter(false);
		setNewParameterData(getDefaultParameterEditData());
	};

	const handleDeleteParameter = (parameterId: string) => {
		setConfirmParameter(parameterId);
		setIsParameterConfirmDialogOpen(true);
	};

	const handleCancelAddParameter = () => {
		setIsAddingParameter(false);
		setNewParameterData(getDefaultParameterEditData());
	};

	const handleConfirmRemoveParameter = () => {
		if (confirmParameter) {
			const updatedParameters = parameters.filter(
				(param) => param.id !== confirmParameter
			);
			onParametersChange(updatedParameters);
			setIsParameterConfirmDialogOpen(false);
			setConfirmParameter(null);
		}
	};

	// Category management handlers
	const handleAddCategory = () => {
		if (newCategoryData.name.trim()) {
			setCustomCategories((prev) => [
				...prev,
				{
					name: newCategoryData.name.trim(),
					color: newCategoryData.color,
				},
			]);
			setActiveTab(newCategoryData.name.trim());
			setIsAddCategoryDialogOpen(false);
			setNewCategoryData({
				name: "",
				description: "",
				color: "blue",
			});
		}
	};

	const handleRemoveCategory = (categoryToRemove: string) => {
		setConfirmCategory(categoryToRemove);
		setIsConfirmDialogOpen(true);
	};

	const handleConfirmRemoveCategory = () => {
		if (confirmCategory) {
			setCustomCategories((prev) =>
				prev.filter((cat) => cat.name !== confirmCategory)
			);

			const updatedParameters = parameters.filter(
				(param) => param.category.name !== confirmCategory
			);
			onParametersChange(updatedParameters);

			if (activeTab === confirmCategory) {
				setActiveTab("all");
			}
			setIsConfirmDialogOpen(false);
			setConfirmCategory(null);
		}
	};

	// Helper functions
	const getCategoryColor = (categoryName: string) => {
		return getCategoryTailwindClasses(
			categoryName,
			parameters,
			customCategories
		);
	};

	const allCategories = getSortedCategories(parameters, customCategories);
	const filteredParameters = getFilteredParameters(
		parameters,
		activeTab,
		searchQuery
	);

	/**
	 * Load global parameters if parameters array is empty
	 */
	const loadGlobalParametersIfNeeded = async () => {
		if (parameters.length === 0) {
			try {
				const globalParams = await getAllGlobalParameters();
				const globalParamCopies = createGlobalParameterCopies(globalParams, []);
				onParametersChange(globalParamCopies);
			} catch (error) {
				console.error("Error loading global parameters:", error);
			}
		}
	};

	/**
	 * Create copies of global parameters with correct ID convention
	 */
	const createGlobalParameterCopies = (
		globalParams: any[],
		existingParameters: Parameter[] = []
	) => {
		const existingParamNames = new Set(
			existingParameters.map((param) => param.name)
		);
		const standardParameters = {
			name: "Planned years of operation",
			value: "10",
			unit: "years",
			description:
				"The number of years the solution is planned to operate for.",
			information:
				"The number of years the solution is planned to operate for.",
			category: {
				name: "standard",
				color: "blue",
			},
			user_interface: {
				type: "input",
				category: "",
				is_advanced: false,
			},
			is_modifiable: false,
			output: false,
			display_type: "range",
			dropdown_options: [],
			range_min: "1",
			range_max: "10",
			conditional_rules: [],
		};

		return globalParams
			.filter((globalParam) => !existingParamNames.has(globalParam.name))
			.map((globalParam) => ({
				...globalParam,
				id: `param-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				user_interface: {
					type: "not_viewable",
					category: globalParam.category?.name || "Global",
					is_advanced: false,
				},
				is_modifiable: globalParam.is_modifiable || false,
			}));
	};

	// Load global parameters when component mounts or parameters change
	useEffect(() => {
		loadGlobalParametersIfNeeded();
	}, [parameters.length]);

	return (
		<div className="flex flex-col h-full">
			<CategoryTabs
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				allCategories={allCategories}
				handleRemoveCategory={handleRemoveCategory}
				setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
				newCategoryData={newCategoryData}
				setNewCategoryData={setNewCategoryData}
				handleAddCategory={handleAddCategory}
				isAddCategoryDialogOpen={isAddCategoryDialogOpen}
				handleAddParameter={handleAddParameter}
				handleCancelAddParameter={handleCancelAddParameter}
				isAddingParameter={isAddingParameter}
				editingParameter={editingParameter}
				parameters={parameters}
				customCategories={customCategories}
				setIsPreviewDialogOpen={setIsPreviewDialogOpen}
				columnVisibility={columnVisibility}
				setColumnVisibility={setColumnVisibility}
			/>

			<ConfirmCategoryRemovalDialog
				isConfirmDialogOpen={isConfirmDialogOpen}
				setIsConfirmDialogOpen={setIsConfirmDialogOpen}
				confirmCategory={confirmCategory}
				handleConfirmRemoveCategory={handleConfirmRemoveCategory}
				parameters={parameters}
			/>

			<ConfirmParameterRemovalDialog
				isConfirmDialogOpen={isParameterConfirmDialogOpen}
				setIsConfirmDialogOpen={setIsParameterConfirmDialogOpen}
				confirmParameter={confirmParameter}
				handleConfirmRemoveParameter={handleConfirmRemoveParameter}
				parameters={parameters}
			/>

			{activeTab !== "add-new-category" && (
				<>
					<LoadingIndicator isLoading={isLoadingParameters} />
					<Searchbar
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						filteredParameters={filteredParameters}
					/>
					<TableContent
						filteredParameters={filteredParameters}
						editingParameter={editingParameter}
						editData={editData}
						setEditData={setEditData}
						handleEditParameter={handleEditParameter}
						handleSaveParameter={handleSaveParameter}
						handleCancelEdit={handleCancelEdit}
						handleDeleteParameter={handleDeleteParameter}
						getLevelColor={getLevelColor}
						getCategoryColor={getCategoryColor}
						isAddingParameter={isAddingParameter}
						newParameterData={newParameterData}
						setNewParameterData={setNewParameterData}
						handleSaveNewParameter={handleSaveNewParameter}
						handleCancelAddParameter={handleCancelAddParameter}
						handleAddParameter={handleAddParameter}
						customCategories={customCategories}
						searchQuery={searchQuery}
						parameters={parameters}
						activeTab={activeTab}
						columnVisibility={columnVisibility}
						setColumnVisibility={setColumnVisibility}
					/>
				</>
			)}

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
		</div>
	);
}

/**
 * ConfirmCategoryRemovalDialog component - Dialog for confirming category removal
 */
function ConfirmCategoryRemovalDialog({
	isConfirmDialogOpen,
	setIsConfirmDialogOpen,
	confirmCategory,
	handleConfirmRemoveCategory,
	parameters,
}: ConfirmCategoryRemovalDialogProps) {
	const parametersInCategory = parameters.filter(
		(param) => param.category.name === confirmCategory
	).length;

	return (
		<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Category Removal</DialogTitle>
					<DialogDescription>
						Are you sure you want to remove the category &quot;{confirmCategory}
						&quot;?
						<br />
						This action cannot be undone. {parametersInCategory} parameter
						{parametersInCategory !== 1 ? "s" : ""} in this category will be
						permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsConfirmDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleConfirmRemoveCategory}>
						Remove Category
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/**
 * ConfirmParameterRemovalDialog component - Dialog for confirming parameter removal
 */
function ConfirmParameterRemovalDialog({
	isConfirmDialogOpen,
	setIsConfirmDialogOpen,
	confirmParameter,
	handleConfirmRemoveParameter,
	parameters,
}: ConfirmParameterRemovalDialogProps) {
	const parameterToRemove = parameters.find(
		(param) => param.id === confirmParameter
	);
	const parameterName = parameterToRemove?.name || "Unknown Parameter";

	return (
		<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Parameter Removal</DialogTitle>
					<DialogDescription>
						Are you sure you want to remove the parameter &quot;{parameterName}
						&quot;?
						<br />
						This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsConfirmDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleConfirmRemoveParameter}>
						Remove Parameter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/**
 * LoadingIndicator component - Shows loading state for parameters
 */
function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
	if (!isLoading) return null;

	return (
		<div className="flex items-center justify-center py-8">
			<div className="flex items-center gap-3">
				<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
				<span className="text-sm text-muted-foreground">
					Loading existing solution parameters...
				</span>
			</div>
		</div>
	);
}

/**
 * Helper function to get default parameter edit data
 */
function getDefaultParameterEditData(): ParameterEditData {
	return {
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
		conditional_rules: [],
	};
}

/**
 * Helper function to convert Parameter to ParameterEditData
 */
function convertParameterToEditData(parameter: Parameter): ParameterEditData {
	return {
		name: parameter.name,
		value: parameter.value,
		test_value: parameter.test_value,
		unit: parameter.unit,
		description: parameter.description,
		information: parameter.information,
		category: parameter.category.name,
		user_interface: {
			type:
				typeof parameter.user_interface === "string"
					? (parameter.user_interface as "input" | "static" | "not_viewable")
					: parameter.user_interface.type,
			category:
				typeof parameter.user_interface === "string"
					? parameter.category.name
					: parameter.user_interface.category,
			is_advanced:
				typeof parameter.user_interface === "string"
					? false
					: parameter.user_interface.is_advanced,
		},
		output: parameter.output,
		display_type: parameter.display_type,
		dropdown_options: parameter.dropdown_options || [],
		range_min: parameter.range_min || "",
		range_max: parameter.range_max || "",
		conditional_rules: parameter.conditional_rules || [],
	};
}

/**
 * Helper function to convert ParameterEditData to Parameter
 */
function convertEditDataToParameter(
	editData: ParameterEditData,
	categoryColor: string,
	id: string
): Parameter {
	return {
		id,
		level: "1",
		name: editData.name.trim(),
		value: editData.value,
		test_value: editData.test_value,
		unit: editData.unit,
		description: editData.description,
		information: editData.information,
		category: {
			name: editData.category,
			color: categoryColor,
		},
		user_interface: {
			type: editData.user_interface.type,
			category: editData.user_interface.category,
			is_advanced: editData.user_interface.is_advanced,
		},
		output: editData.output,
		display_type: editData.display_type,
		dropdown_options: editData.dropdown_options,
		range_min: editData.range_min,
		range_max: editData.range_max,
		conditional_rules: editData.conditional_rules,
		is_modifiable: true,
	};
}

/**
 * Helper function to validate parameter edit data
 */
function validateParameterEditData(
	editData: ParameterEditData
): ParameterValidationResult {
	// Basic validation - check required fields
	if (!editData.name.trim() || !editData.unit.trim()) {
		return {
			isValid: false,
			errorMessage: "Name and unit are required fields.",
		};
	}

	// Additional validation for static parameters
	if (editData.user_interface.type === "static") {
		if (editData.display_type === "simple" && !editData.value.trim()) {
			return {
				isValid: false,
				errorMessage: "Static parameters with simple display require a value.",
			};
		}

		if (
			editData.display_type === "range" &&
			(!editData.range_min.trim() || !editData.range_max.trim())
		) {
			return {
				isValid: false,
				errorMessage:
					"Static parameters with range display require both min and max values.",
			};
		}

		if (
			(editData.display_type === "dropdown" ||
				editData.display_type === "filter") &&
			editData.dropdown_options.length === 0
		) {
			return {
				isValid: false,
				errorMessage:
					"Static parameters with dropdown/filter display require options.",
			};
		}
	}

	return {
		isValid: true,
		errorMessage: "",
	};
}

/**
 * Helper function to get sorted categories
 */
function getSortedCategories(
	parameters: Parameter[],
	customCategories: Array<{ name: string; color: string }>
): string[] {
	const uniqueCategories = Array.from(
		new Set(parameters.map((param) => param.category.name))
	);
	const customCategoryNames = customCategories.map((cat) => cat.name);
	const allCategoryNames = Array.from(
		new Set([...uniqueCategories, ...customCategoryNames])
	);

	return allCategoryNames.sort((a, b) => {
		if (a === "Global") return -1;
		if (b === "Global") return 1;
		return a.localeCompare(b);
	});
}

/**
 * Helper function to filter parameters based on active tab and search query
 */
function getFilteredParameters(
	parameters: Parameter[],
	activeTab: string,
	searchQuery: string
): Parameter[] {
	return parameters.filter((param) => {
		// Filter by active tab
		let tabFiltered = false;

		if (activeTab === "all") {
			tabFiltered = true;
		} else if (activeTab === "Global") {
			tabFiltered = [
				"Global",
				"Industry",
				"Technology",
				"Technologies",
			].includes(param.category.name);
		} else {
			tabFiltered = param.category.name === activeTab;
		}

		// Filter by search query
		const searchFiltered =
			searchQuery.trim() === "" ||
			param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.test_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(typeof param.user_interface === "string"
				? param.user_interface.toLowerCase().includes(searchQuery.toLowerCase())
				: param.user_interface.type
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) ||
			param.output.toString().toLowerCase().includes(searchQuery.toLowerCase());

		return tabFiltered && searchFiltered;
	});
}
