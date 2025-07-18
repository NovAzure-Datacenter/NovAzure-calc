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
import { Edit, Save, X, Info, Plus, Trash } from "lucide-react";

export interface Parameter {
	id: string;
	level: number; 
	name: string;
	value: number;
	testValue: number;
	unit: string;
	description: string;
	providedBy: "global" | "company" | "user";
	inputType: "simple" | "advanced";
	output: boolean;
	category: string; 
}

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
		testValue: string;
		unit: string;
		description: string;
		providedBy: string;
		inputType: string;
		output: boolean;
		category: string;
	}>({
		name: "",
		value: "",
		testValue: "",
		unit: "",
		description: "",
		providedBy: "user",
		inputType: "simple",
		output: false,
		category: "all",
	});
	const [activeTab, setActiveTab] = useState("all");
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
	});
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [confirmCategory, setConfirmCategory] = useState<string | null>(null);

	const [isParameterConfirmDialogOpen, setIsParameterConfirmDialogOpen] = useState(false);
	const [confirmParameter, setConfirmParameter] = useState<string | null>(null);
	
	const [isAddingParameter, setIsAddingParameter] = useState(false);
	const [newParameterData, setNewParameterData] = useState<{
		name: string;
		value: string;
		testValue: string;
		unit: string;
		description: string;
		providedBy: string;
		inputType: string;
		output: boolean;
		category: string;
	}>({
		name: "",
		value: "",
		testValue: "",
		unit: "",
		description: "",
		providedBy: "user",
		inputType: "simple",
		output: false,
		category: "none",
	});

	const handleEditParameter = (parameter: Parameter) => {
		setEditingParameter(parameter.id);
		setEditData({
			name: parameter.name,
			value: parameter.value.toString(),
			testValue: parameter.testValue.toString(),
			unit: parameter.unit,
			description: parameter.description,
			providedBy: parameter.providedBy,
			inputType: parameter.inputType,
			output: parameter.output,
			category: parameter.category,
		});
	};

	const handleSaveParameter = (parameterId: string) => {
		const numericValue = parseFloat(editData.value);
		if (isNaN(numericValue)) {
			return;
		}

		const currentParameter = parameters.find((p) => p.id === parameterId);
		if (!currentParameter) return;

		const updatedParameters = parameters.map((param) =>
			param.id === parameterId
				? {
						...param,
						name: editData.name,
						value: numericValue,
						testValue: parseFloat(editData.testValue),
						unit: editData.unit,
						description: editData.description,
						providedBy: editData.providedBy as "global" | "company" | "user",
						inputType: editData.inputType as "simple" | "advanced",
						output: editData.output,
						category: editData.category,
				  }
				: param
		);
		onParametersChange(updatedParameters);
		setEditingParameter(null);
		setEditData({
			name: "",
			value: "",
			testValue: "",
			unit: "",
			description: "",
			providedBy: "user",
			inputType: "simple",
			output: false,
			category: "all",
		});
	};

	const handleCancelEdit = () => {
		setEditingParameter(null);
		setEditData({
			name: "",
			value: "",
			testValue: "",
			unit: "",
			description: "",
			providedBy: "user",
			inputType: "simple",
			output: false,
			category: "all",
		});
	};

	const handleResetParameter = (parameterId: string) => {
		const updatedParameters = parameters.map((param) =>
			param.id === parameterId ? { ...param, overrideValue: null } : param
		);
		onParametersChange(updatedParameters);
	};

	const handleAddParameter = () => {
		setIsAddingParameter(true);
		setNewParameterData({
			name: "",
			value: "",
			testValue: "",
			unit: "",
			description: "",
			providedBy: "user",
			inputType: "simple",
			output: false,
			category: "none",
		});
	};

	const handleSaveNewParameter = () => {
		const numericValue = parseFloat(newParameterData.value);
		if (isNaN(numericValue) || !newParameterData.name.trim()) {
			// Handle invalid input
			return;
		}

		const newParameter: Parameter = {
			id: `param-${Date.now()}`, 
			level: 1, 
			name: newParameterData.name.trim(),
			value: numericValue, 
			testValue: parseFloat(newParameterData.testValue), 
			unit: newParameterData.unit,
			description: newParameterData.description,
			providedBy: newParameterData.providedBy as "global" | "company" | "user", 
			inputType: newParameterData.inputType as "simple" | "advanced", 
			output: newParameterData.output, 
			category: newParameterData.category, 
		};

		onParametersChange([newParameter, ...parameters]);
		setIsAddingParameter(false);
		setNewParameterData({
			name: "",
			value: "",
			testValue: "",
			unit: "",
			description: "",
			providedBy: "user",
			inputType: "simple",
			output: false,
			category: "none",
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
			testValue: "",
			unit: "",
			description: "",
			providedBy: "user",
			inputType: "simple",
			output: false,
			category: "none",
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

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "performance":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "cost":
				return "bg-green-50 text-green-700 border-green-200";
			case "environmental":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			case "operational":
				return "bg-purple-50 text-purple-700 border-purple-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	const allCategories = [...customCategories];

	const filteredParameters =
		activeTab === "all"
			? parameters
			: activeTab === "none"
			? parameters.filter((param) => param.category === "none")
			: parameters.filter((param) => param.category === activeTab);

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
					<TableContent
						filteredParameters={filteredParameters}
						editingParameter={editingParameter}
						editData={editData}
						setEditData={setEditData}
						handleEditParameter={handleEditParameter}
						handleSaveParameter={handleSaveParameter}
						handleCancelEdit={handleCancelEdit}
						handleDeleteParameter={handleDeleteParameter}
						handleResetParameter={handleResetParameter}
						getLevelColor={getLevelColor}
						getCategoryColor={getCategoryColor}
						isAddingParameter={isAddingParameter}
						newParameterData={newParameterData}
						setNewParameterData={setNewParameterData}
						handleSaveNewParameter={handleSaveNewParameter}
						handleCancelAddParameter={handleCancelAddParameter}
						handleAddParameter={handleAddParameter}
						customCategories={customCategories}
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
}: {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	allCategories: string[];
	handleRemoveCategory: (category: string) => void;
	setIsAddCategoryDialogOpen: (open: boolean) => void;
	newCategoryData: {
		name: string;
		description: string;
	};
	setNewCategoryData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			description: string;
		}>
	>;
	handleAddCategory: () => void;
	isAddCategoryDialogOpen: boolean;
	handleAddParameter: () => void;
	isAddingParameter: boolean;
	editingParameter: string | null;
	handleCancelAddParameter: () => void;
}) {
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
						
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAddCategoryDialogOpen(false)}
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

function TableContent({
	filteredParameters,
	editingParameter,
	editData,
	setEditData,
	handleEditParameter,
	handleSaveParameter,
	handleCancelEdit,
	handleDeleteParameter,
	handleResetParameter,
	getLevelColor,
	getCategoryColor,
	isAddingParameter,
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	handleAddParameter,
	customCategories,
}: {
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: {
		name: string;
		value: string;
		testValue: string;
		unit: string;
		description: string;
		providedBy: string;
		inputType: string;
		output: boolean;
		category: string;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			testValue: string;
			unit: string;
			description: string;
			providedBy: string;
			inputType: string;
			output: boolean;
			category: string;
		}>
	>;
	handleEditParameter: (parameter: Parameter) => void;
	handleSaveParameter: (parameterId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteParameter: (parameterId: string) => void;
	handleResetParameter: (parameterId: string) => void;
	getLevelColor: (level: string) => string;
	getCategoryColor: (category: string) => string;
	isAddingParameter: boolean;
	newParameterData: {
		name: string;
		value: string;
		testValue: string;
		unit: string;
		description: string;
		providedBy: string;
		inputType: string;
		output: boolean;
		category: string;
	};
	setNewParameterData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			testValue: string;
			unit: string;
			description: string;
			providedBy: string;
			inputType: string;
			output: boolean;
			category: string;
		}>
	>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	handleAddParameter: () => void;
	customCategories: string[];
}) {
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
								<TableHead className="w-32 bg-background">Value</TableHead>
								<TableHead className="w-32 bg-background">Test Value</TableHead>
								<TableHead className="w-20 bg-background">Unit</TableHead>
								<TableHead className="bg-background">Description</TableHead>
								<TableHead className="w-32 bg-background">Category</TableHead>
								<TableHead className="w-32 bg-background">
									Provided By
								</TableHead>
								<TableHead className="w-24 bg-background">Input Type</TableHead>
								<TableHead className="w-20 bg-background">Output</TableHead>
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
											value={newParameterData.testValue}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													testValue: e.target.value,
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
											value={newParameterData.category}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													category: value,
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												{customCategories.map((category: string) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.providedBy}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													providedBy: value,
													// Reset inputType to "simple" if changing from user to something else
													inputType:
														value !== "user" ? "simple" : prev.inputType,
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="global">Global</SelectItem>
												<SelectItem value="company">Company</SelectItem>
												<SelectItem value="user">User</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.inputType}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													inputType: value,
												}))
											}
											disabled={newParameterData.providedBy !== "user"}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="simple">Simple</SelectItem>
												<SelectItem value="advanced">Advanced</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.output.toString()}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													output: value === "true",
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="true">Yes</SelectItem>
												<SelectItem value="false">No</SelectItem>
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
													!newParameterData.testValue.trim() ||
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
															{parameter.name}
														</span>
													</div>
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
														{parameter.value}
													</span>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.testValue}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																testValue: e.target.value,
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
														{parameter.testValue}
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
														{parameter.unit}
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
															{parameter.description}
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
													<Select
														value={editData.category}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																category: value,
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="none">None</SelectItem>
															{customCategories.map((category: string) => (
																<SelectItem key={category} value={category}>
																	{category}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												) : (
													<Badge variant="outline" className="text-xs">
														{parameter.category === "none" ? "None" : parameter.category}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.providedBy}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																providedBy: value,
																// Reset inputType to "simple" if changing from user to something else
																inputType:
																	value !== "user" ? "simple" : prev.inputType,
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="global">Global</SelectItem>
															<SelectItem value="company">Company</SelectItem>
															<SelectItem value="user">User</SelectItem>
														</SelectContent>
													</Select>
												) : (
													<Badge variant="outline" className="text-xs">
														{parameter.providedBy}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.inputType}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																inputType: value,
															}))
														}
														disabled={editData.providedBy !== "user"}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="simple">Simple</SelectItem>
															<SelectItem value="advanced">Advanced</SelectItem>
														</SelectContent>
													</Select>
												) : (
													<Badge
														variant="outline"
														className={`text-xs ${
															parameter.providedBy !== "user"
																? "opacity-50 cursor-not-allowed"
																: ""
														}`}
													>
														{parameter.inputType}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												<Badge variant="outline" className="text-xs">
													{parameter.output ? "Yes" : "No"}
												</Badge>
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
																onClick={() => handleDeleteParameter(parameter.id)}
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
						<Button variant="destructive" onClick={handleConfirmRemoveParameter}>
							Remove Parameter
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}