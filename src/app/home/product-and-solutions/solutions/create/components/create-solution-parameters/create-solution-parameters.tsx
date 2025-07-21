"use client";

import React, { useState } from "react";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X, Info, Plus, Trash, Search, Lock } from "lucide-react";
import { Parameter } from "../../../../types";
import CategoryTabs from "./category-tabs";
import Searchbar from "./search-bar";
import TableContent from "./table-content";
import { getLevelColor, getCategoryTailwindClasses } from "./color-utils";

interface ParametersConfigurationProps {
	parameters: Parameter[];
	onParametersChange: (parameters: Parameter[]) => void;
	customCategories: Array<{ name: string; color: string }>;
	setCustomCategories: React.Dispatch<
		React.SetStateAction<Array<{ name: string; color: string }>>
	>;
}

export function ParametersConfiguration({
	parameters,
	onParametersChange,
	customCategories,
	setCustomCategories,
}: ParametersConfigurationProps) {
	const [editingParameter, setEditingParameter] = useState<string | null>(null);
	const [editData, setEditData] = useState<{
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		category: string;
		provided_by: string;
		input_type: string;
		output: boolean;
	}>({
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		category: "",
		provided_by: "user",
		input_type: "simple",
		output: false,
	});
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
	const [newParameterData, setNewParameterData] = useState<{
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		category: string;
		provided_by: string;
		input_type: string;
		output: boolean;
	}>({
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		category: "",
		provided_by: "user",
		input_type: "simple",
		output: false,
	});

	// Search state
	const [searchQuery, setSearchQuery] = useState("");

	const handleEditParameter = (parameter: Parameter) => {
		setEditingParameter(parameter.id);
		setEditData({
			name: parameter.name,
			value: parameter.value,
			test_value: parameter.test_value,
			unit: parameter.unit,
			description: parameter.description,
			category: parameter.category.name,
			provided_by: parameter.provided_by,
			input_type: parameter.input_type,
			output: parameter.output,
		});
	};

	const handleSaveParameter = (parameterId: string) => {
		const numericValue = parseFloat(editData.value);
		const numericTestValue = parseFloat(editData.test_value);

		// Basic validation
		if (isNaN(numericTestValue)) {
			return;
		}

		// Conditional validation based on provided_by
		if (editData.provided_by === "company") {
			// For company parameters, value is mandatory
			if (isNaN(numericValue) || !editData.value.trim()) {
				return;
			}
		} else {
			// For user parameters, value is optional but if provided, must be valid
			if (editData.value.trim() && isNaN(numericValue)) {
				return;
			}
		}

		const currentParameter = parameters.find((p) => p.id === parameterId);
		if (!currentParameter) return;

		const updatedParameters = parameters.map((param) =>
			param.id === parameterId
				? {
						...param,
						name: editData.name,
						value: editData.value,
						test_value: editData.test_value,
						unit: editData.unit,
						description: editData.description,
						category: {
							name: editData.category,
							color: currentParameter.category.color,
						},
						provided_by: editData.provided_by,
						input_type: editData.input_type,
						output: editData.output,
				  }
				: param
		);
		onParametersChange(updatedParameters);
		setEditingParameter(null);
		setEditData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: "",
			provided_by: "user",
			input_type: "simple",
			output: false,
		});
	};

	const handleCancelEdit = () => {
		setEditingParameter(null);
		setEditData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: "",
			provided_by: "user",
			input_type: "simple",
			output: false,
		});
	};

	const handleAddParameter = () => {
		setIsAddingParameter(true);
		setNewParameterData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: activeTab === "all" || activeTab === "Global" ? "" : activeTab,
			provided_by: "user",
			input_type: "simple",
			output: false,
		});
	};

	const handleSaveNewParameter = () => {
		const numericValue = parseFloat(newParameterData.value);
		const numericTestValue = parseFloat(newParameterData.test_value);

		// Basic validation
		if (!newParameterData.name.trim() || isNaN(numericTestValue)) {
			return;
		}

		// Conditional validation based on provided_by
		if (newParameterData.provided_by === "company") {
			// For company parameters, value is mandatory
			if (isNaN(numericValue) || !newParameterData.value.trim()) {
				return;
			}
		} else {
			// For user parameters, value is optional but if provided, must be valid
			if (newParameterData.value.trim() && isNaN(numericValue)) {
				return;
			}
		}

		// Find the selected custom category to get its color
		const selectedCategory = customCategories.find(
			(cat) => cat.name === newParameterData.category
		);
		const categoryColor = selectedCategory?.color || "blue";

		const newParameter: Parameter = {
			id: `param-${Date.now()}`,
			level: "L1",
			name: newParameterData.name.trim(),
			value: newParameterData.value,
			test_value: newParameterData.test_value,
			unit: newParameterData.unit,
			description: newParameterData.description,
			category: {
				name: newParameterData.category,
				color: categoryColor,
			},
			provided_by: newParameterData.provided_by,
			input_type: newParameterData.input_type,
			output: newParameterData.output,
		};

		onParametersChange([newParameter, ...parameters]);
		setIsAddingParameter(false);
		setNewParameterData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: "",
			provided_by: "user",
			input_type: "simple",
			output: false,
		});
	};

	const handleDeleteParameter = (parameterId: string) => {
		setConfirmParameter(parameterId);
		setIsParameterConfirmDialogOpen(true);
	};

	const handleCancelAddParameter = () => {
		setIsAddingParameter(false);
		setNewParameterData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: "",
			provided_by: "user",
			input_type: "simple",
			output: false,
		});
	};

	const handleConfirmRemoveParameter = () => {
		if (confirmParameter) {
			const parameterToRemove = parameters.find(
				(param) => param.id === confirmParameter
			);
			if (parameterToRemove) {
				const updatedParameters = parameters.filter(
					(param) => param.id !== confirmParameter
				);
				onParametersChange(updatedParameters);
				setIsParameterConfirmDialogOpen(false);
				setConfirmParameter(null);
			}
		}
	};

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
			// Remove the category from custom categories
			setCustomCategories((prev) =>
				prev.filter((cat) => cat.name !== confirmCategory)
			);

			// Remove all parameters that belong to this category
			const updatedParameters = parameters.filter(
				(param) => param.category.name !== confirmCategory
			);
			onParametersChange(updatedParameters);

			// Switch to "all" tab if the current tab is being removed
			if (activeTab === confirmCategory) {
				setActiveTab("all");
			}
			setIsConfirmDialogOpen(false);
			setConfirmCategory(null);
		}
	};

	// Wrapper function to match the expected signature
	const getCategoryColor = (categoryName: string) => {
		return getCategoryTailwindClasses(
			categoryName,
			parameters,
			customCategories
		);
	};

	// Get unique categories from parameters
	const uniqueCategories = Array.from(
		new Set(parameters.map((param) => param.category.name))
	);

	// Get custom category names
	const customCategoryNames = customCategories.map((cat) => cat.name);

	// Merge all categories without duplicates
	const allCategoryNames = Array.from(
		new Set([...uniqueCategories, ...customCategoryNames])
	);

	// Sort categories: "Global" first, then custom categories alphabetically
	const sortedCategories = allCategoryNames.sort((a, b) => {
		if (a === "Global") return -1; // Global comes first
		if (b === "Global") return 1;
		return a.localeCompare(b); // Alphabetical for the rest
	});

	const allCategories = sortedCategories;

	const filteredParameters = parameters.filter((param) => {
		// First filter by active tab
		const tabFiltered =
			activeTab === "all" || param.category.name === activeTab;

		// Then filter by search query
		const searchFiltered =
			searchQuery.trim() === "" ||
			param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.test_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.provided_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.input_type.toLowerCase().includes(searchQuery.toLowerCase());

		return tabFiltered && searchFiltered;
	});

	return (
		<div className="space-y-6">
			{/* Tabs */}
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
					/>
				</>
			)}
		</div>
	);
}

function ConfirmCategoryRemovalDialog({
	isConfirmDialogOpen,
	setIsConfirmDialogOpen,
	confirmCategory,
	handleConfirmRemoveCategory,
	parameters,
}: {
	isConfirmDialogOpen: boolean;
	setIsConfirmDialogOpen: (open: boolean) => void;
	confirmCategory: string | null;
	handleConfirmRemoveCategory: () => void;
	parameters: Parameter[];
}) {
	// Count parameters in the category being removed
	const parametersInCategory = parameters.filter(
		(param) => param.category.name === confirmCategory
	).length;

	return (
		<>
			{/* Confirm Category Removal Dialog */}
			<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Confirm Category Removal</DialogTitle>
						<DialogDescription>
							Are you sure you want to remove the category "{confirmCategory}"?
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
		</>
	);
}

function ConfirmParameterRemovalDialog({
	isConfirmDialogOpen,
	setIsConfirmDialogOpen,
	confirmParameter,
	handleConfirmRemoveParameter,
	parameters,
}: {
	isConfirmDialogOpen: boolean;
	setIsConfirmDialogOpen: (open: boolean) => void;
	confirmParameter: string | null;
	handleConfirmRemoveParameter: () => void;
	parameters: Parameter[];
}) {
	// Find the parameter name by ID
	const parameterToRemove = parameters.find(
		(param) => param.id === confirmParameter
	);
	const parameterName = parameterToRemove?.name || "Unknown Parameter";

	return (
		<>
			{/* Confirm Parameter Removal Dialog */}
			<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Confirm Parameter Removal</DialogTitle>
						<DialogDescription>
							Are you sure you want to remove the parameter "{parameterName}"?
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
						<Button
							variant="destructive"
							onClick={handleConfirmRemoveParameter}
						>
							Remove Parameter
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
