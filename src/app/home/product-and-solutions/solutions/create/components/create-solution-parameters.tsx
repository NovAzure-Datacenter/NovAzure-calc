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
import { Edit, Save, X, Info, Plus, Trash, Search } from "lucide-react";
import { type Parameter } from "../../mock-data";

interface ParametersConfigurationProps {
	parameters: Parameter[];
	onParametersChange: (parameters: Parameter[]) => void;
	customCategories: string[];
	setCustomCategories: React.Dispatch<React.SetStateAction<string[]>>;
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
		color: "bg-blue-500 text-blue-700 border-blue-200",
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
		if (isNaN(numericValue) || isNaN(numericTestValue)) {
			return;
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
			category: "",
			provided_by: "user",
			input_type: "simple",
			output: false,
		});
	};

	const handleSaveNewParameter = () => {
		const numericValue = parseFloat(newParameterData.value);
		const numericTestValue = parseFloat(newParameterData.test_value);
		if (
			isNaN(numericValue) ||
			isNaN(numericTestValue) ||
			!newParameterData.name.trim()
		) {
			return;
		}

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
				color: "blue",
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
			setCustomCategories((prev) => [...prev, newCategoryData.name.trim()]);
			setActiveTab(newCategoryData.name.trim());
			setIsAddCategoryDialogOpen(false);
			setNewCategoryData({
				name: "",
				description: "",
				color: "bg-blue-500 text-blue-700 border-blue-200",
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
				prev.filter((cat) => cat !== confirmCategory)
			);

			if (activeTab === confirmCategory) {
				setActiveTab("all");
			}
			setIsConfirmDialogOpen(false);
			setConfirmCategory(null);
		}
	};

	const getLevelColor = (level: string) => {
		switch (level) {
			case "L1":
				return "bg-blue-100 text-blue-800";
			case "L2":
				return "bg-green-100 text-green-800";
			case "L3":
				return "bg-yellow-100 text-yellow-800";
			case "L4":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getCategoryColor = (categoryName: string) => {
		const parameter = parameters.find(
			(param) => param.category.name === categoryName
		);
		const colorName = parameter?.category.color || "gray";

		const colorMap: Record<string, string> = {
			red: "!bg-red-100 !text-red-800 !border-red-300",
			blue: "!bg-blue-100 !text-blue-800 !border-blue-300",
			green: "!bg-green-100 !text-green-800 !border-green-300",
			yellow: "!bg-yellow-100 !text-yellow-800 !border-yellow-300",
			purple: "!bg-purple-100 !text-purple-800 !border-purple-300",
			orange: "!bg-orange-100 !text-orange-800 !border-orange-300",
			pink: "!bg-pink-100 !text-pink-800 !border-pink-300",
			teal: "!bg-teal-100 !text-teal-800 !border-teal-300",
			indigo: "!bg-indigo-100 !text-indigo-800 !border-indigo-300",
			cyan: "!bg-cyan-100 !text-cyan-800 !border-cyan-300",
			gray: "!bg-gray-100 !text-gray-800 !border-gray-300",
		};

		return colorMap[colorName] || colorMap.gray;
	};

	const allCategories = [...customCategories];

	const filteredParameters = parameters
		.filter((param) => {
			// First filter by active tab
			const tabFiltered = activeTab === "all" || param.category.name === activeTab;
			
			// Then filter by search query
			const searchFiltered = searchQuery.trim() === "" || 
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
			/>

			<ConfirmCategoryRemovalDialog
				isConfirmDialogOpen={isConfirmDialogOpen}
				setIsConfirmDialogOpen={setIsConfirmDialogOpen}
				confirmCategory={confirmCategory}
				handleConfirmRemoveCategory={handleConfirmRemoveCategory}
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

function CategoryTabs({
	activeTab,
	setActiveTab,
	allCategories,
	handleRemoveCategory,
	setIsAddCategoryDialogOpen,
	newCategoryData,
	setNewCategoryData,
	handleAddCategory,
	isAddCategoryDialogOpen,
	handleAddParameter,
	isAddingParameter,
	editingParameter,
	handleCancelAddParameter,
	parameters,
}: {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	allCategories: string[];
	handleRemoveCategory: (category: string) => void;
	setIsAddCategoryDialogOpen: (open: boolean) => void;
	newCategoryData: {
		name: string;
		description: string;
		color: string;
	};
	setNewCategoryData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			description: string;
			color: string;
		}>
	>;
	handleAddCategory: () => void;
	isAddCategoryDialogOpen: boolean;
	handleAddParameter: () => void;
	isAddingParameter: boolean;
	editingParameter: string | null;
	handleCancelAddParameter: () => void;
	parameters: Parameter[];
}) {
	const categoryColors = [
		"bg-blue-500 text-blue-700 border-blue-200 ",
		"bg-green-500 text-green-700 border-green-200",
		"bg-yellow-500 text-yellow-700 border-yellow-200",
		"bg-purple-500 text-purple-700 border-purple-200",
		"bg-red-500 text-red-700 border-red-200",
		"bg-orange-500 text-orange-700 border-orange-200",
		"bg-pink-500 text-pink-700 border-pink-200",
		"bg-gray-500 text-gray-700 border-gray-200",
		"bg-teal-500 text-teal-700 border-teal-200",
		"bg-indigo-500 text-indigo-700 border-indigo-200",
	];

	// Get unique categories from parameters
	const uniqueCategories = Array.from(
		new Set(parameters.map((param) => param.category.name))
	);

	// Function to get category color
	const getCategoryColor = (categoryName: string) => {
		const parameter = parameters.find(
			(param) => param.category.name === categoryName
		);
		const colorName = parameter?.category.color || "gray";

		// Map color names to Tailwind classes with higher specificity
		const colorMap: Record<string, string> = {
			red: "!bg-red-100 !text-red-800 !border-red-300",
			blue: "!bg-blue-100 !text-blue-800 !border-blue-300",
			green: "!bg-green-100 !text-green-800 !border-green-300",
			yellow: "!bg-yellow-100 !text-yellow-800 !border-yellow-300",
			purple: "!bg-purple-100 !text-purple-800 !border-purple-300",
			orange: "!bg-orange-100 !text-orange-800 !border-orange-300",
			pink: "!bg-pink-100 !text-pink-800 !border-pink-300",
			teal: "!bg-teal-100 !text-teal-800 !border-teal-300",
			indigo: "!bg-indigo-100 !text-indigo-800 !border-indigo-300",
			cyan: "!bg-cyan-100 !text-cyan-800 !border-cyan-300",
			gray: "!bg-gray-100 !text-gray-800 !border-gray-300",
		};

		return colorMap[colorName] || colorMap.gray;
	};

	// Function to get category inline styles
	const getCategoryStyle = (categoryName: string) => {
		const parameter = parameters.find(
			(param) => param.category.name === categoryName
		);
		const colorName = parameter?.category.color || "gray";

		// Map color names to hex colors for inline styles
		const colorMap: Record<
			string,
			{ backgroundColor: string; color: string; borderColor: string }
		> = {
			red: {
				backgroundColor: "#fef2f2",
				color: "#991b1b",
				borderColor: "#fca5a5",
			},
			blue: {
				backgroundColor: "#eff6ff",
				color: "#1e40af",
				borderColor: "#93c5fd",
			},
			green: {
				backgroundColor: "#f0fdf4",
				color: "#166534",
				borderColor: "#86efac",
			},
			yellow: {
				backgroundColor: "#fefce8",
				color: "#a16207",
				borderColor: "#fde047",
			},
			purple: {
				backgroundColor: "#faf5ff",
				color: "#7c3aed",
				borderColor: "#c4b5fd",
			},
			orange: {
				backgroundColor: "#fff7ed",
				color: "#c2410c",
				borderColor: "#fdba74",
			},
			pink: {
				backgroundColor: "#fdf2f8",
				color: "#be185d",
				borderColor: "#f9a8d4",
			},
			teal: {
				backgroundColor: "#f0fdfa",
				color: "#134e4a",
				borderColor: "#5eead4",
			},
			indigo: {
				backgroundColor: "#eef2ff",
				color: "#3730a3",
				borderColor: "#a5b4fc",
			},
			cyan: {
				backgroundColor: "#ecfeff",
				color: "#0e7490",
				borderColor: "#67e8f9",
			},
			gray: {
				backgroundColor: "#f9fafb",
				color: "#374151",
				borderColor: "#d1d5db",
			},
		};

		return colorMap[colorName] || colorMap.gray;
	};

	// Combine auto-generated categories with custom categories
	const allTabs = ["all", ...uniqueCategories, ...allCategories];

	return (
		<>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
				<TabsList className="flex w-auto bg-muted/50 space-x-1 justify-start">
					<TabsTrigger
						value="all"
						className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground bg-background/80 hover:bg-background border-backdrop h-8"
					>
						All
					</TabsTrigger>
					{uniqueCategories.map((category) => {
						const categoryStyle = getCategoryStyle(category);
						return (
							<TabsTrigger
								key={category}
								value={category}
								className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
								style={categoryStyle}
							>
								{category}
							</TabsTrigger>
						);
					})}
					{allCategories.map((category) => (
						<TabsTrigger
							key={category}
							value={category}
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop group relative"
						>
							<span className="pr-6">{category}</span>
							<Button
								size="sm"
								variant="ghost"
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveCategory(category);
								}}
								className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100  hover:bg-red-100 hover:text-red-600 "
							>
								<X className="h-3 w-3" />
							</Button>
						</TabsTrigger>
					))}
					<Button
						variant="outline"
						onClick={() => setIsAddCategoryDialogOpen(true)}
						size="sm"
						className="text-xs"
					>
						<Plus className="h-4 w-4" />
						Add Category
					</Button>
				</TabsList>
			</Tabs>

			{/* Parameters Header */}
			<div className="mb-4">
				<div className="flex items-end justify-between ">
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-semibold text-foreground">
							{activeTab === "all" ? "All Parameters" : activeTab}
						</h2>
						<p className="text-sm text-muted-foreground">
							{activeTab === "all"
								? "View and manage all parameters across all categories"
								: `Parameters categorized under ${activeTab}`}
						</p>
					</div>
					<Button
						className="text-xs "
						onClick={
							isAddingParameter ? handleCancelAddParameter : handleAddParameter
						}
						disabled={editingParameter !== null}
					>
						{isAddingParameter ? (
							<>
								<X className="h-3 w-3" />
								Cancel
							</>
						) : (
							<>
								<Plus className="h-3 w-3" />
								Add Parameter
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Add New Category Dialog */}
			<Dialog
				open={isAddCategoryDialogOpen}
				onOpenChange={setIsAddCategoryDialogOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add New Category</DialogTitle>
						<DialogDescription>
							Create a new parameter category to organize your parameters.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="category-name" className="text-right">
								Name
							</Label>
							<Input
								id="category-name"
								value={newCategoryData.name}
								onChange={(e) =>
									setNewCategoryData((prev) => ({
										...prev,
										name: e.target.value,
									}))
								}
								className="col-span-3"
								placeholder="Enter category name"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="category-color" className="text-right">
								Color
							</Label>
							<div className="col-span-3 flex gap-2">
								{categoryColors.map((color) => (
									<button
										key={color}
										type="button"
										onClick={() =>
											setNewCategoryData((prev) => ({
												...prev,
												color: color,
											}))
										}
										className={`w-6 h-6 rounded-full ${color} transition-all duration-200 hover:scale-110 ${
											newCategoryData.color === color
												? "ring-2 ring-black ring-offset-2"
												: ""
										}`}
									/>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsAddCategoryDialogOpen(false);
								setNewCategoryData({
									name: "",
									description: "",
									color: "bg-blue-500 text-blue-700 border-blue-200",
								});
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAddCategory}
							disabled={!newCategoryData.name.trim()}
						>
							Add Category
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

function Searchbar({ 
	searchQuery, 
	setSearchQuery,
	filteredParameters
}: { 
	searchQuery: string; 
	setSearchQuery: (query: string) => void; 
	filteredParameters: Parameter[];
}) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setSearchQuery("");
		}
	};

	return (
		<div className="mb-4">
			<div className="relative">
				<Input
					placeholder="Search parameters by name, category, description, value, unit, provider, or input type..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					className="pl-10 pr-10"
				/>
				<div className="absolute left-3 top-1/2 -translate-y-1/2">
					<Search className="h-4 w-4 text-muted-foreground" />
				</div>
				{searchQuery && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSearchQuery("")}
						className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
						title="Clear search (Esc)"
					>
						<X className="h-3 w-3" />
					</Button>
				)}
			</div>
			{searchQuery && (
				<div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
					<span>
						Searching for: "{searchQuery}" • {filteredParameters.length} result{filteredParameters.length !== 1 ? 's' : ''}
					</span>
					{searchQuery && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setSearchQuery("")}
							className="h-6 px-2 text-xs"
						>
							Clear
						</Button>
					)}
				</div>
			)}
		</div>
	);
}

function TableContent({
	filteredParameters,
	editingParameter,
	editData,
	setEditData,
	handleEditParameter,
	handleSaveParameter,
	handleCancelEdit,
	handleDeleteParameter,
	getLevelColor,
	getCategoryColor,
	isAddingParameter,
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	handleAddParameter,
	customCategories,
	searchQuery,
	parameters,
}: {
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: {
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		category: string;
		provided_by: string;
		input_type: string;
		output: boolean;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			category: string;
			provided_by: string;
			input_type: string;
			output: boolean;
		}>
	>;
	handleEditParameter: (parameter: Parameter) => void;
	handleSaveParameter: (parameterId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteParameter: (parameterId: string) => void;
	getLevelColor: (level: string) => string;
	getCategoryColor: (category: string) => string;
	isAddingParameter: boolean;
	newParameterData: {
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		category: string;
		provided_by: string;
		input_type: string;
		output: boolean;
	};
	setNewParameterData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			category: string;
			provided_by: string;
			input_type: string;
			output: boolean;
		}>
	>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	handleAddParameter: () => void;
	customCategories: string[];
	searchQuery: string;
	parameters: Parameter[];
}) {
	// Function to get category badge style
	const getCategoryBadgeStyle = (categoryName: string) => {
		// Map color names to hex colors for badge styling
		const colorMap: Record<
			string,
			{ backgroundColor: string; color: string; borderColor: string }
		> = {
			red: {
				backgroundColor: "#fef2f2",
				color: "#991b1b",
				borderColor: "#fca5a5",
			},
			blue: {
				backgroundColor: "#eff6ff",
				color: "#1e40af",
				borderColor: "#93c5fd",
			},
			green: {
				backgroundColor: "#f0fdf4",
				color: "#166534",
				borderColor: "#86efac",
			},
			yellow: {
				backgroundColor: "#fefce8",
				color: "#a16207",
				borderColor: "#fde047",
			},
			purple: {
				backgroundColor: "#faf5ff",
				color: "#7c3aed",
				borderColor: "#c4b5fd",
			},
			orange: {
				backgroundColor: "#fff7ed",
				color: "#c2410c",
				borderColor: "#fdba74",
			},
			pink: {
				backgroundColor: "#fdf2f8",
				color: "#be185d",
				borderColor: "#f9a8d4",
			},
			teal: {
				backgroundColor: "#f0fdfa",
				color: "#134e4a",
				borderColor: "#5eead4",
			},
			indigo: {
				backgroundColor: "#eef2ff",
				color: "#3730a3",
				borderColor: "#a5b4fc",
			},
			cyan: {
				backgroundColor: "#ecfeff",
				color: "#0e7490",
				borderColor: "#67e8f9",
			},
			gray: {
				backgroundColor: "#f9fafb",
				color: "#374151",
				borderColor: "#d1d5db",
			},
		};
		
		// Find the parameter with this category to get the color
		const parameter = filteredParameters.find(
			(param) => param.category.name === categoryName
		);
		const colorName = parameter?.category.color || "gray";
		
		return colorMap[colorName] || colorMap.gray;
	};

	// Function to get category badge style for dropdown (simpler version)
	const getCategoryBadgeStyleForDropdown = (categoryName: string) => {
		// Map color names to hex colors for badge styling
		const colorMap: Record<
			string,
			{ backgroundColor: string; color: string; borderColor: string }
		> = {
			red: {
				backgroundColor: "#fef2f2",
				color: "#991b1b",
				borderColor: "#fca5a5",
			},
			blue: {
				backgroundColor: "#eff6ff",
				color: "#1e40af",
				borderColor: "#93c5fd",
			},
			green: {
				backgroundColor: "#f0fdf4",
				color: "#166534",
				borderColor: "#86efac",
			},
			yellow: {
				backgroundColor: "#fefce8",
				color: "#a16207",
				borderColor: "#fde047",
			},
			purple: {
				backgroundColor: "#faf5ff",
				color: "#7c3aed",
				borderColor: "#c4b5fd",
			},
			orange: {
				backgroundColor: "#fff7ed",
				color: "#c2410c",
				borderColor: "#fdba74",
			},
			pink: {
				backgroundColor: "#fdf2f8",
				color: "#be185d",
				borderColor: "#f9a8d4",
			},
			teal: {
				backgroundColor: "#f0fdfa",
				color: "#134e4a",
				borderColor: "#5eead4",
			},
			indigo: {
				backgroundColor: "#eef2ff",
				color: "#3730a3",
				borderColor: "#a5b4fc",
			},
			cyan: {
				backgroundColor: "#ecfeff",
				color: "#0e7490",
				borderColor: "#67e8f9",
			},
			gray: {
				backgroundColor: "#f9fafb",
				color: "#374151",
				borderColor: "#d1d5db",
			},
		};
		
		// Find the parameter with this category to get the color
		const parameter = parameters.find(
			(param) => param.category.name === categoryName
		);
		const colorName = parameter?.category.color || "gray";
		
		return colorMap[colorName] || colorMap.gray;
	};

	// Function to highlight search terms
	const highlightSearchTerm = (text: string, searchTerm: string) => {
		if (!searchTerm.trim()) return text;
		
		const regex = new RegExp(`(${searchTerm})`, 'gi');
		const parts = text.split(regex);
		
		return parts.map((part, index) => 
			regex.test(part) ? (
				<mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
					{part}
				</mark>
			) : (
				part
			)
		);
	};

	return (
		<div className="border rounded-lg">
			<div className="max-h-[55vh] overflow-y-auto ">
				<TooltipProvider>
					<Table>
						<TableHeader className="sticky top-0 bg-background z-10">
							<TableRow>
								<TableHead className="w-48 bg-background">
									Parameter Name
								</TableHead>
								<TableHead className="w-32 bg-background">Category</TableHead>
								<TableHead className="w-32 bg-background">Value</TableHead>
								<TableHead className="w-32 bg-background">Test Value</TableHead>
								<TableHead className="w-20 bg-background">Unit</TableHead>
								<TableHead className="bg-background">Description</TableHead>
								<TableHead className="w-32 bg-background">
									Provided By
								</TableHead>
								<TableHead className="w-32 bg-background">Input Type</TableHead>
								<TableHead className="w-24 bg-background">Output</TableHead>
								<TableHead className="w-24 bg-background">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isAddingParameter && (
								<TableRow className="bg-green-50 border-2 border-green-200 shadow-md">
									<TableCell className="py-2">
										<div className="flex items-center gap-2">
											<Input
												value={newParameterData.name}
												onChange={(e) =>
													setNewParameterData((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												className="h-7 text-xs"
												placeholder="Parameter name"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSaveNewParameter();
													} else if (e.key === "Escape") {
														handleCancelAddParameter();
													}
												}}
											/>
										</div>
									</TableCell>
									<TableCell className="py-2">
										{newParameterData.category.trim() ? (
											<div className="flex items-center gap-2">
												<Badge
													variant="outline"
													className="text-xs"
													style={getCategoryBadgeStyle(
														newParameterData.category
													)}
												>
													{newParameterData.category}
												</Badge>
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														setNewParameterData((prev) => ({
															...prev,
															category: "",
														}))
													}
													className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
												>
													<X className="h-3 w-3" />
												</Button>
											</div>
										) : (
											<Select
												value={newParameterData.category}
												onValueChange={(value) =>
													setNewParameterData((prev) => ({
														...prev,
														category: value,
													}))
												}
											>
												<SelectTrigger className="h-7 text-xs">
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													{/* Get unique categories from existing parameters */}
													{Array.from(
														new Set(
															parameters.map((param: Parameter) => param.category.name)
														)
													).map((category: string) => (
														<SelectItem key={category} value={category}>
															<div className="flex items-center gap-2">
																<Badge
																	variant="outline"
																	className="text-xs"
																	style={getCategoryBadgeStyleForDropdown(category)}
																>
																	{category}
																</Badge>
															</div>
														</SelectItem>
													))}
													{/* Add custom categories */}
													{customCategories
														.filter(
															(cat: string) =>
																!parameters.some(
																	(param: Parameter) => param.category.name === cat
																)
														)
														.map((category: string) => (
															<SelectItem key={category} value={category}>
																<div className="flex items-center gap-2">
																	<Badge
																		variant="outline"
																		className="text-xs"
																		style={getCategoryBadgeStyleForDropdown(category)}
																	>
																		{category}
																	</Badge>
																</div>
															</SelectItem>
														))}
												</SelectContent>
											</Select>
										)}
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.value}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													value: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Value"
											type="number"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.test_value}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													test_value: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Test Value"
											type="number"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.unit}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													unit: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Unit"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.description}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													description: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Description"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.provided_by}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													provided_by: value,
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													{newParameterData.provided_by || "Select provider"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="global">Global</SelectItem>
												<SelectItem value="user">User</SelectItem>
												<SelectItem value="company">Company</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.input_type}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													input_type: value,
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													{newParameterData.input_type || "Select type"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="simple">Simple</SelectItem>
												<SelectItem value="advanced">Advanced</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.output ? "true" : "false"}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													output: value === "true",
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													{newParameterData.output ? "True" : "False"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="true">True</SelectItem>
												<SelectItem value="false">False</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<div className="flex items-center gap-1">
											<Button
												size="sm"
												variant="ghost"
												onClick={handleSaveNewParameter}
												className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
												disabled={
													!newParameterData.name.trim() ||
													!newParameterData.value.trim() ||
													!newParameterData.unit.trim()
												}
											>
												<Save className="h-3 w-3" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={handleCancelAddParameter}
												className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							)}
							{filteredParameters.length === 0 && !isAddingParameter ? (
								<TableRow>
									<TableCell colSpan={10} className="text-center py-8">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<Info className="h-8 w-8" />
											<p className="text-sm font-medium">No parameters found</p>
											<p className="text-xs">Add parameters to get started</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredParameters.map((parameter) => {
									const isEditing = editingParameter === parameter.id;

									return (
										<TableRow
											key={parameter.id}
											className={`transition-all duration-200 h-12 ${
												isEditing
													? "bg-blue-50 border-2 border-blue-200 shadow-md"
													: ""
											} ${
												(editingParameter && !isEditing) || isAddingParameter
													? "opacity-40 pointer-events-none"
													: ""
											}`}
										>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.name}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																name: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Parameter name"
													/>
												) : (
													<div className="flex items-center gap-2">
														<span className="font-medium text-sm">
															{highlightSearchTerm(parameter.name, searchQuery)}
														</span>
													</div>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													editData.category.trim() ? (
														<div className="flex items-center gap-2">
															<Badge
																variant="outline"
																className="text-xs"
																style={getCategoryBadgeStyle(editData.category)}
															>
																{editData.category}
															</Badge>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	setEditData((prev) => ({
																		...prev,
																		category: "",
																	}))
																}
																className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
															>
																<X className="h-3 w-3" />
															</Button>
														</div>
													) : (
														<Input
															value={editData.category}
															onChange={(e) =>
																setEditData((prev) => ({
																	...prev,
																	category: e.target.value,
																}))
															}
															className="h-7 text-xs"
															placeholder="Category"
														/>
													)
												) : (
													<Badge
														variant="outline"
														className="text-xs"
														style={getCategoryBadgeStyle(
															parameter.category.name
														)}
													>
														{highlightSearchTerm(parameter.category.name, searchQuery)}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.value}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																value: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Value"
														type="number"
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																handleSaveParameter(parameter.id);
															} else if (e.key === "Escape") {
																handleCancelEdit();
															}
														}}
													/>
												) : (
													<span className="text-xs text-muted-foreground">
														{highlightSearchTerm(parameter.value, searchQuery)}
													</span>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.test_value}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																test_value: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Test Value"
														type="number"
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																handleSaveParameter(parameter.id);
															} else if (e.key === "Escape") {
																handleCancelEdit();
															}
														}}
													/>
												) : (
													<span className="text-xs text-muted-foreground">
														{highlightSearchTerm(parameter.test_value, searchQuery)}
													</span>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.unit}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																unit: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Unit"
													/>
												) : (
													<span className="text-xs text-muted-foreground">
														{highlightSearchTerm(parameter.unit, searchQuery)}
													</span>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.description}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																description: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Description"
													/>
												) : (
													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground max-w-xs truncate">
															{highlightSearchTerm(parameter.description, searchQuery)}
														</span>
														<Tooltip>
															<TooltipTrigger asChild>
																<Info className="h-3 w-3 text-muted-foreground cursor-help" />
															</TooltipTrigger>
															<TooltipContent className="max-w-xs">
																<p className="text-sm">
																	{parameter.description}
																</p>
															</TooltipContent>
														</Tooltip>
													</div>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													parameter.provided_by === "global" ? (
														<span className="text-xs text-muted-foreground">
															Global (Not Editable)
														</span>
													) : (
														<Select
															value={editData.provided_by}
															onValueChange={(value) =>
																setEditData((prev) => ({
																	...prev,
																	provided_by: value,
																}))
															}
														>
															<SelectTrigger className="h-7 text-xs">
																<SelectValue>
																	{editData.provided_by || "Select provider"}
																</SelectValue>
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="user">User</SelectItem>
																<SelectItem value="company">Company</SelectItem>
															</SelectContent>
														</Select>
													)
												) : (
													<Badge variant="outline" className="text-xs">
														{highlightSearchTerm(parameter.provided_by, searchQuery)}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.input_type}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																input_type: value,
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue>
																{editData.input_type || "Select type"}
															</SelectValue>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="simple">Simple</SelectItem>
															<SelectItem value="advanced">Advanced</SelectItem>
														</SelectContent>
													</Select>
												) : (
													<Badge variant="outline" className="text-xs">
														{highlightSearchTerm(parameter.input_type, searchQuery)}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.output ? "true" : "false"}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																output: value === "true",
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue>
																{editData.output ? "True" : "False"}
															</SelectValue>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="true">True</SelectItem>
															<SelectItem value="false">False</SelectItem>
														</SelectContent>
													</Select>
												) : (
													<Badge variant="outline" className="text-xs">
														{parameter.output ? "True" : "False"}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												<div className="flex items-center gap-1">
													{!isEditing ? (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() => handleEditParameter(parameter)}
																className="h-5 w-5 p-0"
																disabled={
																	editingParameter !== null || isAddingParameter
																}
															>
																<Edit className="h-3 w-3" />
															</Button>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	handleDeleteParameter(parameter.id)
																}
																className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
															>
																<Trash className="h-3 w-3" />
															</Button>
														</>
													) : (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	handleSaveParameter(parameter.id)
																}
																className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
															>
																<Save className="h-3 w-3" />
															</Button>
															<Button
																size="sm"
																variant="ghost"
																onClick={handleCancelEdit}
																className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
															>
																<X className="h-3 w-3" />
															</Button>
														</>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
							{!isAddingParameter && (
								<TableRow className="border-t-2">
									<TableCell
										colSpan={10}
										className="text-center bg-muted/50 cursor-pointer py-2"
										onClick={
											isAddingParameter
												? handleCancelAddParameter
												: handleAddParameter
										}
									>
										<div className="flex items-center gap-2 justify-center text-muted-foreground">
											<Plus className="h-3 w-3" />
											<span className="text-xs">Add Parameter </span>
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

function ConfirmCategoryRemovalDialog({
	isConfirmDialogOpen,
	setIsConfirmDialogOpen,
	confirmCategory,
	handleConfirmRemoveCategory,
}: {
	isConfirmDialogOpen: boolean;
	setIsConfirmDialogOpen: (open: boolean) => void;
	confirmCategory: string | null;
	handleConfirmRemoveCategory: () => void;
}) {
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
							This action cannot be undone. All parameters in this category will
							be moved to the "All" tab.
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
