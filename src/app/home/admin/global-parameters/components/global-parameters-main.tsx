"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Parameter } from "@/types/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";


import GlobalParametersTableContent from "./global-parameters-table-content";
import GlobalParametersTabs from "./global-parameters-tabs";
import {
	getAllGlobalParameters,
	createGlobalParameter,
	updateGlobalParameter,
	deleteGlobalParameter,
} from "@/lib/actions/global-parameters/global-parameters";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getActiveTabStyle, getCategoryStyle } from "@/utils/color-utils";
import Searchbar from "@/features/solution-builder/components/create-solution-parameters/search-bar";


export default function GlobalParametersMain() {
	const [activeTab, setActiveTab] = useState("All");
	const [parameters, setParameters] = useState<Parameter[]>([]);
	const [editingParameter, setEditingParameter] = useState<string | null>(null);
	const [isAddingParameter, setIsAddingParameter] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	// Edit data state
	const [editData, setEditData] = useState({
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		category: "Global",
		is_modifiable: true,
		display_type: "simple" as "simple" | "dropdown" | "range" | "filter" | "conditional",
		dropdown_options: [] as Array<{ key: string; value: string }>,
		range_min: "",
		range_max: "",
		conditional_rules: [] as Array<{ condition: string; value: string }>,
	});

	// New parameter data state
	const [newParameterData, setNewParameterData] = useState({
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		category: "Global",
		is_modifiable: true,
		display_type: "simple" as "simple" | "dropdown" | "range" | "filter" | "conditional",
		dropdown_options: [] as Array<{ key: string; value: string }>,
		range_min: "",
		range_max: "",
		conditional_rules: [] as Array<{ condition: string; value: string }>,
	});

	// Custom categories for each tab
	const customCategories = [
		{ name: "Global", color: "blue" },
		{ name: "Industry", color: "green" },
		{ name: "Technology", color: "purple" },
	];

	// Load parameters from MongoDB
	const loadParameters = async () => {
		try {
			setIsLoading(true);
			setIsError(false);
			const data = await getAllGlobalParameters();
			setParameters(data);
		} catch (error) {
			console.error("Error loading parameters:", error);
			setIsError(true);
			toast.error("Failed to load parameters");
		} finally {
			setIsLoading(false);
		}
	};

	// Load parameters on component mount
	useEffect(() => {
		loadParameters();
	}, []);

	// Get parameters for current tab
	const getCurrentTabParameters = () => {
		switch (activeTab) {
			case "All":
				return parameters;
			case "Global":
				return parameters.filter(param => param.category.name === "Global");
			case "Industry":
				return parameters.filter(param => param.category.name === "Industry");
			case "Technology":
				return parameters.filter(param => param.category.name === "Technology");
			default:
				return [];
		}
	};

	// Filter parameters based on search query
	const filteredParameters = getCurrentTabParameters().filter(
		(parameter) =>
			parameter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			parameter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			parameter.category.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Color utility functions
	const getLevelColor = (level: string) => {
		const levelColorMap: Record<string, string> = {
			L1: "bg-blue-100 text-blue-800",
			L2: "bg-green-100 text-green-800",
			L3: "bg-yellow-100 text-yellow-800",
			L4: "bg-purple-100 text-purple-800",
		};
		return levelColorMap[level] || "bg-gray-100 text-gray-800";
	};

	const getCategoryColor = (category: string) => {
		const categoryColorMap: Record<string, string> = {
			Global: "bg-blue-100 text-blue-800",
			Industry: "bg-green-100 text-green-800",
			Technology: "bg-purple-100 text-purple-800",
		};
		return categoryColorMap[category] || "bg-gray-100 text-gray-800";
	};

	// Wrapper functions for tab styling
	const getCategoryStyleWrapper = (categoryName: string) => {
		return getCategoryStyle(
			categoryName,
			getCurrentTabParameters(),
			customCategories
		);
	};

	const getActiveTabStyleWrapper = (categoryName: string) => {
		return getActiveTabStyle(
			categoryName,
			getCurrentTabParameters(),
			customCategories
		);
	};


	// Parameter management functions
	const handleEditParameter = (parameter: Parameter) => {
		setEditingParameter(parameter.id);
		setEditData({
			name: parameter.name,
			value: parameter.value,
			test_value: parameter.test_value,
			unit: parameter.unit,
			description: parameter.description,
			category: parameter.category.name,
			is_modifiable: parameter.is_modifiable,
			display_type: parameter.display_type,
			dropdown_options: parameter.dropdown_options || [],
			range_min: parameter.range_min || "",
			range_max: parameter.range_max || "",
			conditional_rules: parameter.conditional_rules || [],
		});
	};

	const handleSaveParameter = async (parameterId: string) => {
		try {
			const updatedParameter = await updateGlobalParameter(parameterId, {
				name: editData.name,
				value: editData.value,
				test_value: editData.test_value,
				unit: editData.unit,
				description: editData.description,
				information: "",
				category: { name: editData.category, color: "blue" },
				user_interface: "not_viewable",
				output: true,
				level: "L1",
				is_modifiable: editData.is_modifiable,
				display_type: editData.display_type,
				dropdown_options: editData.dropdown_options,
				range_min: editData.range_min,
				range_max: editData.range_max,
				conditional_rules: editData.conditional_rules,
			});

			// Update local state
			setParameters(prev => 
				prev.map(param => 
					param.id === parameterId ? updatedParameter : param
				)
			);

			setEditingParameter(null);
			setEditData({
				name: "",
				value: "",
				test_value: "",
				unit: "",
				description: "",
				category: "Global",
				is_modifiable: true,
				display_type: "simple",
				dropdown_options: [],
				range_min: "",
				range_max: "",
				conditional_rules: [],
			});

			toast.success("Parameter updated successfully");
		} catch (error) {
			console.error("Error updating parameter:", error);
			toast.error("Failed to update parameter");
		}
	};

	const handleCancelEdit = () => {
		setEditingParameter(null);
		setEditData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: "Global",
			is_modifiable: true,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
			conditional_rules: [],
		});
	};

	const handleDeleteParameter = async (parameterId: string) => {
		try {
			await deleteGlobalParameter(parameterId);
			
			// Update local state
			setParameters(prev => prev.filter(param => param.id !== parameterId));
			
			toast.success("Parameter deleted successfully");
		} catch (error) {
			console.error("Error deleting parameter:", error);
			toast.error("Failed to delete parameter");
		}
	};

	const handleAddParameter = () => {
		setIsAddingParameter(true);
		setNewParameterData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: activeTab === "All" ? "Global" : activeTab,
			is_modifiable: true,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
			conditional_rules: [],
		});
	};

	const handleSaveNewParameter = async () => {
		try {
			const newParameter = await createGlobalParameter({
				name: newParameterData.name,
				value: newParameterData.value,
				test_value: newParameterData.test_value,
				unit: newParameterData.unit,
				description: newParameterData.description,
				information: "",
				category: { name: newParameterData.category, color: "blue" },
				user_interface: "not_viewable",
				output: true,
				level: "L1",
				is_modifiable: newParameterData.is_modifiable,
				display_type: newParameterData.display_type,
				dropdown_options: newParameterData.dropdown_options,
				range_min: newParameterData.range_min,
				range_max: newParameterData.range_max,
				conditional_rules: newParameterData.conditional_rules,
			});

			// Update local state
			setParameters(prev => [...prev, newParameter]);

			setIsAddingParameter(false);
			setNewParameterData({
				name: "",
				value: "",
				test_value: "",
				unit: "",
				description: "",
				category: "Global",
				is_modifiable: true,
				display_type: "simple",
				dropdown_options: [],
				range_min: "",
				range_max: "",
				conditional_rules: [],
			});

			toast.success("Parameter added successfully");
		} catch (error) {
			console.error("Error adding parameter:", error);
			toast.error("Failed to add parameter");
		}
	};

	const handleCancelAddParameter = () => {
		setIsAddingParameter(false);
		setNewParameterData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			category: "Global",
			is_modifiable: true,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
			conditional_rules: [],
		});
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="mx-auto p-4 space-y-4">
				<div className="space-y-6">
					<Card>
						<CardHeader className="pb-4">
							<CardTitle className="text-lg">Global Parameters</CardTitle>
							<CardDescription className="text-sm">
								Manage global, industry, and technology parameters. <br /> These
								parameters can be used to create formulas for your clients
								solutions.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
								<span className="ml-2 text-muted-foreground">Loading parameters...</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// Error state
	if (isError) {
		return (
			<div className="mx-auto p-4 space-y-4">
				<div className="space-y-6">
					<Card>
						<CardHeader className="pb-4">
							<CardTitle className="text-lg">Global Parameters</CardTitle>
							<CardDescription className="text-sm">
								Manage global, industry, and technology parameters. <br /> These
								parameters can be used to create formulas for your clients
								solutions.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex flex-col items-center justify-center py-8">
								<p className="text-muted-foreground mb-4">Failed to load parameters</p>
								<Button onClick={loadParameters} variant="outline">
									Try Again
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto p-4 space-y-4">
			<div className="space-y-6">
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="text-lg"> Global Parameters</CardTitle>
						<CardDescription className="text-sm ">
							Manage global, industry, and technology parameters. <br /> These
							parameters can be used to create formulas for your clients
							solutions.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<GlobalParametersTabs
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							getActiveTabStyleWrapper={getActiveTabStyleWrapper}
							getCategoryStyleWrapper={getCategoryStyleWrapper}
						/>

						{/* Parameters Header */}
						<div className="mb-4">
							<div className="flex items-end justify-between">
								<div className="flex flex-col gap-2">
									<h2 className="text-lg font-semibold text-foreground">
										{activeTab === "All"
											? "All Parameters"
											: `${activeTab} Parameters`}
									</h2>
									<p className="text-sm text-muted-foreground">
										{activeTab === "All"
											? "View and manage all parameters across all categories"
											: `Manage ${activeTab.toLowerCase()} parameters for your organization`}
									</p>
								</div>
								<Button
									className="text-xs"
									onClick={
										isAddingParameter
											? handleCancelAddParameter
											: handleAddParameter
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

						{/* Search Bar */}
						<Searchbar
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							filteredParameters={filteredParameters}
						/>

						{/* Table Content */}
						<GlobalParametersTableContent
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
							parameters={getCurrentTabParameters()}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
