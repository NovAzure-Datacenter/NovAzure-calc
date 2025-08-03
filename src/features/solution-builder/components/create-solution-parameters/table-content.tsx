import { Parameter } from "@/app/home/product-and-solutions/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Info, Save, X, Plus, Trash, Lock, Download, ChevronDown } from "lucide-react";
import {
	getCategoryBadgeStyle,
	getCategoryBadgeStyleForDropdown,
} from "../../../../utils/color-utils";
import React, { useEffect, useState } from "react";
import {
	getDisplayTypeBadgeStyle,
	renderDisplayTypeEditor,
	renderDisplayTypeViewer,
	getUserInterfaceBadgeStyle,
} from "@/components/table-components/parameter-types";

// Column visibility state type
export interface ColumnVisibility {
	parameterName: boolean;
	category: boolean;
	displayType: boolean;
	value: boolean;
	testValue: boolean;
	unit: boolean;
	description: boolean;
	information: boolean;
	userInterface: boolean;
	output: boolean;
	actions: boolean;
}

// Column filter component
export function ColumnFilter({ 
	columnVisibility, 
	setColumnVisibility 
}: { 
	columnVisibility: ColumnVisibility; 
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>; 
}) {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleItemChange = (key: keyof ColumnVisibility, checked: boolean) => {
		console.log(`${key} changed:`, checked);
		setColumnVisibility(prev => ({ ...prev, [key]: checked }));
	};

	// Handle clicking outside to close dropdown
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (isOpen && !target.closest('.column-filter-dropdown')) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative column-filter-dropdown">
			<Button 
				variant="outline" 
				size="sm" 
				className="text-xs"
				onClick={handleToggle}
			>
				Columns <ChevronDown className="h-3 w-3 ml-1" />
			</Button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[200px]">
					<div className="p-1">
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.parameterName}
								onChange={(e) => handleItemChange('parameterName', e.target.checked)}
								className="mr-2"
							/>
							Parameter Name
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.category}
								onChange={(e) => handleItemChange('category', e.target.checked)}
								className="mr-2"
							/>
							Category
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.displayType}
								onChange={(e) => handleItemChange('displayType', e.target.checked)}
								className="mr-2"
							/>
							Display Type
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.value}
								onChange={(e) => handleItemChange('value', e.target.checked)}
								className="mr-2"
							/>
							Value
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.testValue}
								onChange={(e) => handleItemChange('testValue', e.target.checked)}
								className="mr-2"
							/>
							Test Value
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.unit}
								onChange={(e) => handleItemChange('unit', e.target.checked)}
								className="mr-2"
							/>
							Unit
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.description}
								onChange={(e) => handleItemChange('description', e.target.checked)}
								className="mr-2"
							/>
							Description
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.information}
								onChange={(e) => handleItemChange('information', e.target.checked)}
								className="mr-2"
							/>
							Information
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.userInterface}
								onChange={(e) => handleItemChange('userInterface', e.target.checked)}
								className="mr-2"
							/>
							User Interface
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.output}
								onChange={(e) => handleItemChange('output', e.target.checked)}
								className="mr-2"
							/>
							Output
						</label>
						<label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
							<input
								type="checkbox"
								checked={columnVisibility.actions}
								onChange={(e) => handleItemChange('actions', e.target.checked)}
								className="mr-2"
							/>
							Actions
						</label>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * TableContent component - Main parameter table with editing capabilities
 * Displays parameters in a table format with inline editing, filtering, and search functionality
 * Supports adding new parameters, editing existing ones, and managing parameter categories
 */
export default function TableContent({
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
	activeTab,
	columnVisibility,
	setColumnVisibility,
}: {
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: {
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		information: string;
		category: string;
		user_interface: {
			type: "input" | "static" | "not_viewable";
			category: string;
			is_advanced: boolean;
		};
		output: boolean;
		display_type: "simple" | "dropdown" | "range" | "filter" | "conditional";
		dropdown_options: Array<{ key: string; value: string }>;
		range_min: string;
		range_max: string;
		conditional_rules: Array<{ condition: string; value: string }>;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			information: string;
			category: string;
			user_interface: {
				type: "input" | "static" | "not_viewable";
				category: string;
				is_advanced: boolean;
			};
			output: boolean;
			display_type: "simple" | "dropdown" | "range" | "filter" | "conditional";
			dropdown_options: Array<{ key: string; value: string }>;
			range_min: string;
			range_max: string;
			conditional_rules: Array<{ condition: string; value: string }>;
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
		information: string;
		category: string;
		user_interface: {
			type: "input" | "static" | "not_viewable";
			category: string;
			is_advanced: boolean;
		};
		output: boolean;
		display_type: "simple" | "dropdown" | "range" | "filter" | "conditional";
		dropdown_options: Array<{ key: string; value: string }>;
		range_min: string;
		range_max: string;
		conditional_rules: Array<{ condition: string; value: string }>;
	};
	setNewParameterData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			information: string;
			category: string;
			user_interface: {
				type: "input" | "static" | "not_viewable";
				category: string;
				is_advanced: boolean;
			};
			output: boolean;
			display_type: "simple" | "dropdown" | "range" | "filter" | "conditional";
			dropdown_options: Array<{ key: string; value: string }>;
			range_min: string;
			range_max: string;
			conditional_rules: Array<{ condition: string; value: string }>;
		}>
	>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	handleAddParameter: () => void;
	customCategories: Array<{ name: string; color: string }>;
	searchQuery: string;
	parameters: Parameter[];
	activeTab: string;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
}) {
	/**
	 * Wrapper function to match expected signature for category badge styling
	 */
	const getCategoryBadgeStyleWrapper = (categoryName: string) => {
		return getCategoryBadgeStyle(categoryName, parameters, customCategories);
	};

	/**
	 * Wrapper function to match expected signature for dropdown category badge styling
	 */
	const getCategoryBadgeStyleForDropdownWrapper = (categoryName: string) => {
		return getCategoryBadgeStyleForDropdown(
			categoryName,
			parameters,
			customCategories
		);
	};

	/**
	 * Highlights search terms in text by wrapping them in mark tags
	 */
	const highlightSearchTerm = (text: string, searchTerm: string) => {
		if (!searchTerm.trim()) return text;

		const regex = new RegExp(`(${searchTerm})`, "gi");
		const parts = text.split(regex);

		return parts.map((part, index) =>
			regex.test(part) ? (
				<mark
					key={index}
					className="bg-yellow-200 text-yellow-900 px-0.5 rounded"
				>
					{part}
				</mark>
			) : (
				part
			)
		);
	};

	/**
	 * Gets all available categories including existing parameters and custom categories
	 * Excludes system-managed categories that users shouldn't select
	 */
	const getAllAvailableCategories = () => {
		const systemManagedCategories = [
			"Global",
			"Industry",
			"Technology",
			"Technologies",
		];

		const existingCategories = Array.from(
			new Set(parameters.map((param) => param.category.name))
		).filter((category) => !systemManagedCategories.includes(category));

		const existingCategoryObjects = existingCategories.map((category) => {
			const paramWithCategory = parameters.find(
				(param) => param.category.name === category
			);
			return {
				name: category,
				color: paramWithCategory?.category.color || "gray",
			};
		});

		return [...existingCategoryObjects, ...customCategories];
	};

	return (
		<div className="border rounded-lg">
			<div className="max-h-[55vh] overflow-y-auto relative">
				<TooltipProvider>
					<Table>
						<ParameterTableHeader columnVisibility={columnVisibility} />
						<ParameterTableBody
							isAddingParameter={isAddingParameter}
							newParameterData={newParameterData}
							setNewParameterData={setNewParameterData}
							handleSaveNewParameter={handleSaveNewParameter}
							handleCancelAddParameter={handleCancelAddParameter}
							getAllAvailableCategories={getAllAvailableCategories}
							getCategoryBadgeStyleForDropdownWrapper={
								getCategoryBadgeStyleForDropdownWrapper
							}
							getUserInterfaceBadgeStyle={getUserInterfaceBadgeStyle}
							filteredParameters={filteredParameters}
							editingParameter={editingParameter}
							editData={editData}
							setEditData={setEditData}
							handleEditParameter={handleEditParameter}
							handleSaveParameter={handleSaveParameter}
							handleCancelEdit={handleCancelEdit}
							handleDeleteParameter={handleDeleteParameter}
							highlightSearchTerm={highlightSearchTerm}
							searchQuery={searchQuery}
							getCategoryBadgeStyleWrapper={getCategoryBadgeStyleWrapper}
							activeTab={activeTab}
							handleAddParameter={handleAddParameter}
							getDisplayTypeBadgeStyle={getDisplayTypeBadgeStyle}
							columnVisibility={columnVisibility}
							setColumnVisibility={setColumnVisibility}
						/>
					</Table>
				</TooltipProvider>
			</div>
		</div>
	);
}

/**
 * ParameterTableHeader component - Renders the table header with column definitions and tooltips
 */
function ParameterTableHeader({ columnVisibility }: { columnVisibility: ColumnVisibility }) {
	return (
		<TableHeader className="sticky top-0 bg-background z-10">
			<TableRow>
				{columnVisibility.parameterName && (
					<TableHead className="w-48 bg-background">Parameter Name</TableHead>
				)}
				{columnVisibility.category && (
					<TableHead className="w-32 bg-background">Category</TableHead>
				)}
				{columnVisibility.displayType && (
					<TableHead className="w-32 bg-background">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-1 cursor-help">
									Display Type
									<Info className="h-3 w-3 text-muted-foreground" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-sm">
									How the value is displayed in the calculator
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									• <strong>Simple:</strong> Text input field
									<br />• <strong>Dropdown:</strong> Select from predefined
									options
									<br />• <strong>Range:</strong> Min/Max number range
									<br />• <strong>Filter:</strong> Multiple filter options
								</p>
							</TooltipContent>
						</Tooltip>
					</TableHead>
				)}
				{columnVisibility.value && (
					<TableHead className="w-32 bg-background">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-1 cursor-help">
									Value
									<Info className="h-3 w-3 text-muted-foreground" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-sm">The numerical value for this parameter</p>
							</TooltipContent>
						</Tooltip>
					</TableHead>
				)}
				{columnVisibility.testValue && (
					<TableHead className="w-32 bg-background">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-1 cursor-help">
									Test Value
									<Info className="h-3 w-3 text-muted-foreground" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-sm">
									A test value used for validation and testing purposes
								</p>
							</TooltipContent>
						</Tooltip>
					</TableHead>
				)}
				{columnVisibility.unit && (
					<TableHead className="w-20 bg-background">Unit</TableHead>
				)}
				{columnVisibility.description && (
					<TableHead className="bg-background">Description</TableHead>
				)}
				{columnVisibility.information && (
					<TableHead className="bg-background">Information</TableHead>
				)}
				{columnVisibility.userInterface && (
					<TableHead className="w-32 bg-background">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-1 cursor-help">
									User Interface
									<Info className="h-3 w-3 text-muted-foreground" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-sm">
									Who provides this value during the value calculator
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									• <strong>Input:</strong> Client provides during calculation
									<br />• <strong>Static:</strong> Pre-loaded by company
									<br />• <strong>Not Viewable:</strong> System-managed
									(read-only)
								</p>
							</TooltipContent>
						</Tooltip>
					</TableHead>
				)}
				{columnVisibility.output && (
					<TableHead className="w-32 bg-background">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-1 cursor-help">
									Output
									<Info className="h-3 w-3 text-muted-foreground" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-sm">
									Whether this parameter is visible during the value calculator
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									• <strong>True:</strong> Visible to client
									<br />• <strong>False:</strong> Hidden from client
								</p>
							</TooltipContent>
						</Tooltip>
					</TableHead>
				)}
				{columnVisibility.actions && (
					<TableHead className="w-24 bg-background">Actions</TableHead>
				)}
			</TableRow>
		</TableHeader>
	);
}

/**
 * ParameterTableBody component - Renders the table body with parameter rows and add new parameter row
 */
function ParameterTableBody({
	isAddingParameter,
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	getAllAvailableCategories,
	getCategoryBadgeStyleForDropdownWrapper,
	getUserInterfaceBadgeStyle,
	filteredParameters,
	editingParameter,
	editData,
	setEditData,
	handleEditParameter,
	handleSaveParameter,
	handleCancelEdit,
	handleDeleteParameter,
	highlightSearchTerm,
	searchQuery,
	getCategoryBadgeStyleWrapper,
	activeTab,
	handleAddParameter,
	getDisplayTypeBadgeStyle,
	columnVisibility,
	setColumnVisibility,
}: {
	isAddingParameter: boolean;
	newParameterData: any;
	setNewParameterData: any;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	getAllAvailableCategories: () => any[];
	getCategoryBadgeStyleForDropdownWrapper: (name: string) => any;
	getUserInterfaceBadgeStyle: (type: string) => any;
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: any;
	setEditData: any;
	handleEditParameter: (parameter: Parameter) => void;
	handleSaveParameter: (parameterId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteParameter: (parameterId: string) => void;
	highlightSearchTerm: (text: string, searchTerm: string) => any;
	searchQuery: string;
	getCategoryBadgeStyleWrapper: (name: string) => any;
	activeTab: string;
	handleAddParameter: () => void;
	getDisplayTypeBadgeStyle: (displayType: string) => any;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
}) {


	// Helper function to render a table cell conditionally
	const renderCell = (isVisible: boolean, children: React.ReactNode) => {
		return isVisible ? <TableCell className="py-2">{children}</TableCell> : null;
	};

	return (
		<TableBody>
			{/* Add new parameter row - appears when isAddingParameter is true */}
			{isAddingParameter && (
				<TableRow className="bg-green-50 border-2 border-green-200 shadow-md">
					{renderCell(columnVisibility.parameterName, (
						<div className="flex items-center gap-2">
							<Input
								value={newParameterData.name}
								onChange={(e) =>
									setNewParameterData((prev: any) => ({
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
					))}
					{renderCell(columnVisibility.category, (
						<Select
							value={newParameterData.category}
							onValueChange={(value) =>
								setNewParameterData((prev: any) => ({
									...prev,
									category: value,
								}))
							}
						>
							<SelectTrigger className="h-7 text-xs">
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{getAllAvailableCategories().length > 0 ? (
									getAllAvailableCategories().map((category: any) => (
										<SelectItem key={category.name} value={category.name}>
											<div className="flex items-center gap-2">
												<Badge
													variant="outline"
													className="text-xs"
													style={getCategoryBadgeStyleForDropdownWrapper(
														category.name
													)}
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
					))}
					{renderCell(columnVisibility.displayType, (
						<Select
							value={newParameterData.display_type}
							onValueChange={(value) =>
								setNewParameterData((prev: any) => ({
									...prev,
									display_type: value as
										| "simple"
										| "dropdown"
										| "range"
										| "filter"
										| "conditional",
								}))
							}
						>
							<SelectTrigger className="h-7 text-xs">
								<SelectValue>
									<span
										style={getDisplayTypeBadgeStyle(
											newParameterData.display_type
										)}
									>
										{newParameterData.display_type || "Select type"}
									</span>
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="simple">Simple</SelectItem>
								<SelectItem value="dropdown">Dropdown</SelectItem>
								<SelectItem value="range">Range</SelectItem>
								<SelectItem value="filter">Filter</SelectItem>
								<SelectItem value="conditional">Conditional</SelectItem>
							</SelectContent>
						</Select>
					))}
					{renderCell(columnVisibility.value, (
						renderDisplayTypeEditor(
							newParameterData.display_type,
							newParameterData,
							setNewParameterData,
							filteredParameters,
							handleSaveNewParameter,
							handleCancelAddParameter
						)
					))}
					{renderCell(columnVisibility.testValue, (
						<Input
							value={newParameterData.test_value}
							onChange={(e) =>
								setNewParameterData((prev: any) => ({
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
					))}
					{renderCell(columnVisibility.unit, (
						<Input
							value={newParameterData.unit}
							onChange={(e) =>
								setNewParameterData((prev: any) => ({
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
					))}
					{renderCell(columnVisibility.description, (
						<Input
							value={newParameterData.description}
							onChange={(e) =>
								setNewParameterData((prev: any) => ({
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
					))}
					{renderCell(columnVisibility.information, (
						<Input
							value={newParameterData.information}
							onChange={(e) =>
								setNewParameterData((prev: any) => ({
									...prev,
									information: e.target.value,
								}))
							}
							className="h-7 text-xs"
							placeholder="Information"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSaveNewParameter();
								} else if (e.key === "Escape") {
									handleCancelAddParameter();
								}
							}}
						/>
					))}
					{renderCell(columnVisibility.userInterface, (
						<div className="space-y-1">
							<Select
								value={newParameterData.user_interface.type}
								onValueChange={(value) =>
									setNewParameterData((prev: any) => ({
										...prev,
										user_interface: {
											type: value as "input" | "static" | "not_viewable",
											category: "",
											is_advanced: false,
										},
									}))
								}
							>
								<SelectTrigger className="h-7 text-xs">
									<SelectValue>
										<span
											style={{
												color: getUserInterfaceBadgeStyle(
													newParameterData.user_interface.type
												).color,
											}}
										>
											{newParameterData.user_interface.type || "Select provider"}
										</span>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="input">Input</SelectItem>
									<SelectItem value="static">Static</SelectItem>
									<SelectItem value="not_viewable">Not Viewable</SelectItem>
								</SelectContent>
							</Select>
							{newParameterData.user_interface.type === "input" && (
								<Select
									value={
										newParameterData.user_interface.is_advanced ? "true" : "false"
									}
									onValueChange={(value) =>
										setNewParameterData((prev: any) => ({
											...prev,
											user_interface: {
												...prev.user_interface,
												is_advanced: value === "true",
											},
										}))
									}
								>
									<SelectTrigger className="h-6 text-xs">
										<SelectValue>
											{newParameterData.user_interface.is_advanced
												? "Advanced"
												: "Simple"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="false">Simple</SelectItem>
										<SelectItem value="true">Advanced</SelectItem>
									</SelectContent>
								</Select>
							)}
						</div>
					))}
					{renderCell(columnVisibility.output, (
						<Select
							value={newParameterData.output ? "true" : "false"}
							onValueChange={(value) =>
								setNewParameterData((prev: any) => ({
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
					))}
					{renderCell(columnVisibility.actions, (
						<div className="flex items-center gap-1">
							<Button
								size="sm"
								variant="ghost"
								onClick={handleSaveNewParameter}
								className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
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
					))}
				</TableRow>
			)}

			{/* Empty state when no parameters are found */}
			{filteredParameters.length === 0 && !isAddingParameter ? (
				<TableRow>
					<TableCell colSpan={11} className="text-center py-8">
						<div className="flex flex-col items-center gap-2 text-muted-foreground">
							<Info className="h-8 w-8" />
							<p className="text-sm font-medium">No parameters found</p>
							<p className="text-xs">Add parameters to get started</p>
						</div>
					</TableCell>
				</TableRow>
			) : (
				/* Parameter rows - maps through filtered parameters */
				filteredParameters.map((parameter) => {
					const isEditing = editingParameter === parameter.id;
					const isGlobal = parameter.category.name === "Global";
					const isIndustry = parameter.category.name === "Industry";
					const isTechnology =
						parameter.category.name === "Technology" ||
						parameter.category.name === "Technologies";
					const isReadOnly = false;

					return (
						<TableRow
							key={parameter.id}
							className={`transition-all duration-200 h-12 ${
								isEditing ? "bg-blue-50 border-2 border-blue-200 shadow-md" : ""
							} ${
								(editingParameter && !isEditing) || isAddingParameter
									? "opacity-40 pointer-events-none"
									: ""
							}`}
						>

							
							{/* Parameter name cell - editable when editing */}
							{renderCell(columnVisibility.parameterName, (
								isEditing ? (
									<Input
										value={editData.name}
										onChange={(e) =>
											setEditData((prev: any) => ({
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
								)
							))}

							{/* Category cell - dropdown when editing, badge when viewing */}
							{renderCell(columnVisibility.category, (
								isEditing ? (
									<Select
										value={editData.category}
										onValueChange={(value) =>
											setEditData((prev: any) => ({
												...prev,
												category: value,
											}))
										}
									>
										<SelectTrigger className="h-7 text-xs">
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{getAllAvailableCategories().length > 0 ? (
												getAllAvailableCategories().map((category: any) => (
													<SelectItem key={category.name} value={category.name}>
														<div className="flex items-center gap-2">
															<Badge
																variant="outline"
																className="text-xs"
																style={getCategoryBadgeStyleForDropdownWrapper(
																	category.name
																)}
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
								) : (
									<Badge
										variant="outline"
										className="text-xs"
										style={getCategoryBadgeStyleWrapper(
											parameter.category.name
										)}
									>
										{highlightSearchTerm(parameter.category.name, searchQuery)}
									</Badge>
								)
							))}

							{/* Display type cell - dropdown when editing, badge when viewing */}
							{renderCell(columnVisibility.displayType, (
								isEditing ? (
									<Select
										value={editData.display_type}
										onValueChange={(value) =>
											setEditData((prev: any) => ({
												...prev,
												display_type: value as
													| "simple"
													| "dropdown"
													| "range"
													| "filter"
													| "conditional",
											}))
										}
									>
										<SelectTrigger className="h-7 text-xs">
											<SelectValue>
												<span
													style={getDisplayTypeBadgeStyle(
														editData.display_type
													)}
												>
													{editData.display_type || "Select type"}
												</span>
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="simple">Simple</SelectItem>
											<SelectItem value="dropdown">Dropdown</SelectItem>
											<SelectItem value="range">Range</SelectItem>
											<SelectItem value="filter">Filter</SelectItem>
											<SelectItem value="conditional">Conditional</SelectItem>
										</SelectContent>
									</Select>
								) : (
									<Badge
										variant="outline"
										className="text-xs"
										style={getDisplayTypeBadgeStyle(parameter.display_type)}
									>
										{isReadOnly
											? "—"
											: highlightSearchTerm(
													parameter.display_type,
													searchQuery
											  )}
									</Badge>
								)
							))}

							{/* Value cell - conditional rendering based on display type */}
							{renderCell(columnVisibility.value, (
								isEditing ? (
									renderDisplayTypeEditor(
										editData.display_type,
										editData,
										setEditData,
										filteredParameters,
										() => handleSaveParameter(parameter.id),
										handleCancelEdit
									)
								) : (
									<span className="text-xs text-muted-foreground">
										{renderDisplayTypeViewer(
											parameter.display_type,
											parameter,
											highlightSearchTerm,
											searchQuery
										)}
									</span>
								)
							))}

							{/* Test value cell - input when editing, text when viewing */}
							{renderCell(columnVisibility.testValue, (
								isEditing ? (
									<Input
										value={editData.test_value}
										onChange={(e) =>
											setEditData((prev: any) => ({
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
								)
							))}

							{/* Unit cell - input when editing, text when viewing */}
							{renderCell(columnVisibility.unit, (
								isEditing ? (
									<Input
										value={editData.unit}
										onChange={(e) =>
											setEditData((prev: any) => ({
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
								)
							))}

							{/* Description cell - input when editing, text with tooltip when viewing */}
							{renderCell(columnVisibility.description, (
								isEditing ? (
									<Input
										value={editData.description}
										onChange={(e) =>
											setEditData((prev: any) => ({
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
												<p className="text-sm">{parameter.description}</p>
											</TooltipContent>
										</Tooltip>
									</div>
								)
							))}

							{/* Information cell - input when editing, text with tooltip when viewing */}
							{renderCell(columnVisibility.information, (
								isEditing ? (
									<Input
										value={editData.information}
										onChange={(e) =>
											setEditData((prev: any) => ({
												...prev,
												information: e.target.value,
											}))
										}
										className="h-7 text-xs"
										placeholder="Information"
									/>
								) : (
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground max-w-xs truncate">
											{highlightSearchTerm(parameter.information, searchQuery)}
										</span>
										<Tooltip>
											<TooltipTrigger asChild>
												<Info className="h-3 w-3 text-muted-foreground cursor-help" />
											</TooltipTrigger>
											<TooltipContent className="max-w-xs">
												<p className="text-sm">{parameter.information}</p>
											</TooltipContent>
										</Tooltip>
									</div>
								)
							))}

							{/* User interface cell - dropdowns when editing, badges when viewing */}
							{renderCell(columnVisibility.userInterface, (
								isEditing ? (
									<div className="space-y-1">
										<Select
											value={editData.user_interface.type}
											onValueChange={(value) =>
												setEditData((prev: any) => ({
													...prev,
													user_interface: {
														type: value as "input" | "static" | "not_viewable",
														category: "",
														is_advanced: editData.user_interface.is_advanced,
													},
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													<span
														style={{
															color: getUserInterfaceBadgeStyle(
																editData.user_interface.type
															).color,
														}}
													>
														{editData.user_interface.type === "input"
															? "Input"
															: editData.user_interface.type === "static"
															? "Static"
															: editData.user_interface.type === "not_viewable"
															? "Not Viewable"
															: editData.user_interface.type ||
															  "Select provider"}
													</span>
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="input">Input</SelectItem>
												<SelectItem value="static">Static</SelectItem>
												<SelectItem value="not_viewable">
													Not Viewable
												</SelectItem>
											</SelectContent>
										</Select>
										{editData.user_interface.type === "input" && (
											<Select
												value={
													editData.user_interface.is_advanced ? "true" : "false"
												}
												onValueChange={(value) =>
													setEditData((prev: any) => ({
														...prev,
														user_interface: {
															...prev.user_interface,
															is_advanced: value === "true",
														},
													}))
												}
											>
												<SelectTrigger className="h-6 text-xs">
													<SelectValue>
														{editData.user_interface.is_advanced
															? "Advanced"
															: "Simple"}
													</SelectValue>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="false">Simple</SelectItem>
													<SelectItem value="true">Advanced</SelectItem>
												</SelectContent>
											</Select>
										)}
									</div>
								) : (
									<div className="space-y-1">
										<Badge
											variant="outline"
											style={getUserInterfaceBadgeStyle(
												typeof parameter.user_interface === "string"
													? parameter.user_interface
													: parameter.user_interface.type
											)}
										>
											{highlightSearchTerm(
												typeof parameter.user_interface === "string"
													? parameter.user_interface === "input"
														? "Input"
														: parameter.user_interface === "static"
														? "Static"
														: parameter.user_interface === "not_viewable"
														? "Not Viewable"
														: parameter.user_interface
													: parameter.user_interface.type === "input"
													? "Input"
													: parameter.user_interface.type === "static"
													? "Static"
													: parameter.user_interface.type === "not_viewable"
													? "Not Viewable"
													: parameter.user_interface.type,
												searchQuery
											)}
										</Badge>
										{typeof parameter.user_interface === "object" &&
											parameter.user_interface.type === "input" && (
												<Badge
													variant="outline"
													className="text-xs"
													style={{
														backgroundColor: parameter.user_interface
															.is_advanced
															? "#fef3c7"
															: "#f0f9ff",
														color: parameter.user_interface.is_advanced
															? "#92400e"
															: "#1e40af",
														borderColor: parameter.user_interface.is_advanced
															? "#f59e0b"
															: "#3b82f6",
													}}
												>
													{parameter.user_interface.is_advanced
														? "Advanced"
														: "Simple"}
												</Badge>
											)}
									</div>
								)
							))}

							{/* Output cell - dropdown when editing, badge when viewing */}
							{renderCell(columnVisibility.output, (
								isEditing ? (
									<Select
										value={editData.output ? "true" : "false"}
										onValueChange={(value) =>
											setEditData((prev: any) => ({
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
										{isReadOnly ? "—" : parameter.output ? "True" : "False"}
									</Badge>
								)
							))}

							{/* Actions cell - edit/delete buttons when viewing, save/cancel when editing */}
							{renderCell(columnVisibility.actions, (
								<div className="flex items-center gap-1">
									{!isEditing ? (
										<>
											{isReadOnly ? (
												<Tooltip>
													<TooltipTrigger asChild>
														<Lock className="h-3 w-3 text-muted-foreground cursor-help" />
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm">
															{(typeof parameter.user_interface === "string"
																? parameter.user_interface
																: parameter.user_interface.type) ===
															"not_viewable"
																? "Global parameter - not modifiable"
																: (typeof parameter.user_interface === "string"
																		? parameter.user_interface
																		: parameter.user_interface.type) ===
																  "static"
																? "Company parameter - not modifiable"
																: "Parameter - not modifiable"}
														</p>
													</TooltipContent>
												</Tooltip>
											) : (
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
											)}
										</>
									) : (
										<>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleSaveParameter(parameter.id)}
												className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
												disabled={
													!editData.name.trim() ||
													!editData.unit.trim() ||
													(editData.user_interface.type === "static" &&
														((editData.display_type === "simple" &&
															!editData.value.trim()) ||
															(editData.display_type === "range" &&
																(!editData.range_min.trim() ||
																	!editData.range_max.trim())) ||
															(editData.display_type === "dropdown" &&
																editData.dropdown_options.length === 0) ||
															(editData.display_type === "filter" &&
																editData.dropdown_options.length === 0)))
												}
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
							))}
						</TableRow>
					);
				})
			)}

			{/* Add parameter row - appears when not adding and not on Global tab */}
			{!isAddingParameter && activeTab !== "Global" && (
				<TableRow className="border-t-2">
					<TableCell
						colSpan={11}
						className="text-center bg-muted/50 cursor-pointer py-2"
						onClick={
							isAddingParameter ? handleCancelAddParameter : handleAddParameter
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
	);
}
