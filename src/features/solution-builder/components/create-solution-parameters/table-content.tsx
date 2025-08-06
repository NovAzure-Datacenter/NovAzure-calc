import { Parameter } from "@/types/types";
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
	Edit,
	Info,
	Save,
	X,
	Plus,
	Trash,
	Lock,
	ChevronDown,
} from "lucide-react";
import {
	getCategoryBadgeStyle,
	getCategoryBadgeStyleForDropdown,
} from "../../../../utils/color-utils";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
	getDisplayTypeBadgeStyle,
	renderDisplayTypeEditor,
	renderDisplayTypeViewer,
	getUserInterfaceBadgeStyle,
} from "@/components/table-components/parameter-types";
import {
	TableContentProps,
	ColumnFilterProps,
	ParameterTableHeaderProps,
	ParameterTableBodyProps,
	ParameterRowProps,
	AddParameterRowProps,
	EmptyStateProps,
	AddParameterButtonProps,
	SearchHighlightProps,
	CategoryData,
	ColumnVisibility,
} from "../../types/types";

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
	usedParameterIds = [],
}: TableContentProps) {
	// State for expanded rows
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [tableWidth, setTableWidth] = useState<number>(0);
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculate dynamic column widths based on content and available space
	const calculateColumnWidths = () => {
		const visibleColumns = Object.entries(columnVisibility)
			.filter(([_, isVisible]) => isVisible)
			.map(([key]) => key);

		// Base column configurations with flexible widths
		const columnConfig = {
			parameterName: { minWidth: 120, maxWidth: 200, priority: 3 },
			category: { minWidth: 80, maxWidth: 120, priority: 2 },
			displayType: { minWidth: 90, maxWidth: 140, priority: 2 },
			value: { minWidth: 80, maxWidth: 150, priority: 2 },
			testValue: { minWidth: 70, maxWidth: 100, priority: 1 },
			unit: { minWidth: 50, maxWidth: 80, priority: 1 },
			description: { minWidth: 120, maxWidth: 300, priority: 4 },
			information: { minWidth: 100, maxWidth: 200, priority: 3 },
			userInterface: { minWidth: 100, maxWidth: 160, priority: 2 },
			output: { minWidth: 60, maxWidth: 80, priority: 1 },
			actions: { minWidth: 80, maxWidth: 100, priority: 1 },
		};

		// Calculate total minimum width
		const totalMinWidth = visibleColumns.reduce((total, column) => {
			const config = columnConfig[column as keyof typeof columnConfig];
			return total + (config?.minWidth || 80);
		}, 0);

		// Calculate available width (container width - padding)
		const availableWidth = Math.max(tableWidth - 32, totalMinWidth);

		// Distribute extra space based on priorities
		const totalPriority = visibleColumns.reduce((total, column) => {
			const config = columnConfig[column as keyof typeof columnConfig];
			return total + (config?.priority || 1);
		}, 0);

		const extraSpace = availableWidth - totalMinWidth;
		const priorityWeight = extraSpace / totalPriority;

		// Calculate final widths
		const columnWidths: Record<string, number> = {};
		visibleColumns.forEach((column) => {
			const config = columnConfig[column as keyof typeof columnConfig];
			const minWidth = config?.minWidth || 80;
			const maxWidth = config?.maxWidth || 200;
			const priority = config?.priority || 1;

			const extraWidth = priorityWeight * priority;
			const calculatedWidth = Math.min(maxWidth, minWidth + extraWidth);

			columnWidths[column] = Math.max(minWidth, calculatedWidth);
		});

		return columnWidths;
	};

	// Update table width on resize
	useEffect(() => {
		const updateTableWidth = () => {
			if (containerRef.current) {
				setTableWidth(containerRef.current.offsetWidth);
			}
		};

		updateTableWidth();
		window.addEventListener("resize", updateTableWidth);
		return () => window.removeEventListener("resize", updateTableWidth);
	}, []);

	// Helper functions
	const getCategoryBadgeStyleWrapper = (categoryName: string) => {
		return getCategoryBadgeStyle(categoryName, parameters, customCategories);
	};

	const getCategoryBadgeStyleForDropdownWrapper = (categoryName: string) => {
		return getCategoryBadgeStyleForDropdown(
			categoryName,
			parameters,
			customCategories
		);
	};

	const toggleRowExpansion = (parameterId: string) => {
		setExpandedRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(parameterId)) {
				newSet.delete(parameterId);
			} else {
				newSet.add(parameterId);
			}
			return newSet;
		});
	};

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

	// Helper function to render a table cell with dynamic width
	const renderCell = (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => {
		if (!isVisible) return null;

		const columnWidths = calculateColumnWidths();
		const width = columnKey ? columnWidths[columnKey] : undefined;

		// Define which columns should be centered
		const centeredColumns = [
			"category",
			"displayType",
			"value",
			"testValue",
			"unit",
			"userInterface",
			"output",
			"actions",
		];
		const isCentered = columnKey && centeredColumns.includes(columnKey);

		return (
			<TableCell
				className={`py-1 px-2 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden ${
					isCentered ? "text-center" : ""
				}`}
				style={{
					width: width ? `${width}px` : "auto",
					minWidth: width ? `${width}px` : "auto",
					maxWidth: width ? `${width}px` : "none",
				}}
			>
				<div
					className={`overflow-hidden ${isCentered ? "text-center" : ""} ${
						isExpanded ? "" : "truncate"
					}`}
					style={{
						width: "100%",
					}}
				>
					{children}
				</div>
			</TableCell>
		);
	};

	return (
		<div className="border rounded-lg" ref={containerRef}>
			<div className="max-h-[55vh] overflow-y-auto overflow-x-auto relative">
				<TooltipProvider>
					<div className="min-w-full">
						<Table className="w-full min-w-[1200px] table-fixed">
							<ParameterTableHeader
								columnVisibility={columnVisibility}
								calculateColumnWidths={calculateColumnWidths}
							/>
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
								renderCell={renderCell}
								expandedRows={expandedRows}
								toggleRowExpansion={toggleRowExpansion}
								usedParameterIds={usedParameterIds}
							/>
						</Table>
					</div>
				</TooltipProvider>
			</div>
		</div>
	);
}
/**
 * ColumnFilter component - Dropdown for toggling table column visibility
 * Provides a user-friendly interface to show/hide specific table columns
 */
export function ColumnFilter({
	columnVisibility,
	setColumnVisibility,
}: ColumnFilterProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleItemChange = (key: keyof ColumnVisibility, checked: boolean) => {
		setColumnVisibility((prev) => ({ ...prev, [key]: checked }));
	};

	// Handle clicking outside to close dropdown
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (isOpen && !target.closest(".column-filter-dropdown")) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const columnOptions = [
		{ key: "parameterName" as keyof ColumnVisibility, label: "Parameter Name" },
		{ key: "category" as keyof ColumnVisibility, label: "Category" },
		{ key: "displayType" as keyof ColumnVisibility, label: "Display Type" },
		{ key: "value" as keyof ColumnVisibility, label: "Value" },
		{ key: "testValue" as keyof ColumnVisibility, label: "Test Value" },
		{ key: "unit" as keyof ColumnVisibility, label: "Unit" },
		{ key: "description" as keyof ColumnVisibility, label: "Description" },
		{ key: "information" as keyof ColumnVisibility, label: "Information" },
		{ key: "userInterface" as keyof ColumnVisibility, label: "User Interface" },
		{ key: "output" as keyof ColumnVisibility, label: "Output" },
		{ key: "actions" as keyof ColumnVisibility, label: "Actions" },
	];

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
						{columnOptions.map(({ key, label }) => (
							<label
								key={key}
								className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={columnVisibility[key]}
									onChange={(e) => handleItemChange(key, e.target.checked)}
									className="mr-2"
								/>
								{label}
							</label>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * ParameterTableHeader component - Renders the table header with column definitions and tooltips
 */
function ParameterTableHeader({
	columnVisibility,
	calculateColumnWidths,
}: ParameterTableHeaderProps) {
	const headerColumns = [
		{
			key: "parameterName",
			label: "Parameter Name",
		},
		{ key: "category", label: "Category" },
		{
			key: "displayType",
			label: "Display Type",
			hasTooltip: true,
		},
		{
			key: "value",
			label: "Value",
			hasTooltip: true,
		},
		{
			key: "testValue",
			label: "Test Value",
			hasTooltip: true,
		},
		{ key: "unit", label: "Unit" },
		{
			key: "description",
			label: "Description",
		},
		{
			key: "information",
			label: "Information",
		},
		{
			key: "userInterface",
			label: "User Interface",
			hasTooltip: true,
		},
		{
			key: "output",
			label: "Output",
			hasTooltip: true,
		},
		{ key: "actions", label: "Actions" },
	];

	const getTooltipContent = (columnKey: string) => {
		switch (columnKey) {
			case "displayType":
				return {
					title: "How the value is displayed in the calculator",
					content:
						"• Simple: Text input field\n• Dropdown: Select from predefined options\n• Range: Min/Max number range\n• Filter: Multiple filter options",
				};
			case "value":
				return {
					title: "The numerical value for this parameter",
					content: "",
				};
			case "testValue":
				return {
					title: "A test value used for validation and testing purposes",
					content: "",
				};
			case "userInterface":
				return {
					title: "Who provides this value during the value calculator",
					content:
						"• Input: Client provides during calculation\n• Static: Pre-loaded by company\n• Not Viewable: System-managed (read-only)",
				};
			case "output":
				return {
					title:
						"Whether this parameter is visible during the value calculator",
					content: "• True: Visible to client\n• False: Hidden from client",
				};
			default:
				return null;
		}
	};

	const columnWidths = calculateColumnWidths();

	return (
		<TableHeader className="sticky top-0 bg-gray-50 z-10">
			<TableRow>
				{headerColumns.map(({ key, label, hasTooltip }) => {
					if (!columnVisibility[key as keyof ColumnVisibility]) return null;

					const tooltipContent = hasTooltip ? getTooltipContent(key) : null;
					const width = columnWidths[key];

					return (
						<TableHead
							key={key}
							className="bg-gray-50 px-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center"
							style={{
								width: width ? `${width}px` : "auto",
								minWidth: width ? `${width}px` : "auto",
								maxWidth: width ? `${width}px` : "none",
							}}
						>
							{tooltipContent ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex items-center gap-1 cursor-help justify-center">
											<span className="truncate">{label}</span>
											<Info className="h-3 w-3 text-muted-foreground flex-shrink-0" />
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-sm">{tooltipContent.title}</p>
										{tooltipContent.content && (
											<p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
												{tooltipContent.content}
											</p>
										)}
									</TooltipContent>
								</Tooltip>
							) : (
								<span className="truncate text-center">{label}</span>
							)}
						</TableHead>
					);
				})}
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
	renderCell,
	expandedRows,
	toggleRowExpansion,
	usedParameterIds,
}: ParameterTableBodyProps) {
	return (
		<TableBody>
			{/* Add new parameter row */}
			{isAddingParameter && (
				<AddParameterRow
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
					getDisplayTypeBadgeStyle={getDisplayTypeBadgeStyle}
					columnVisibility={columnVisibility}
					renderCell={renderCell}
					usedParameterIds={usedParameterIds}
				/>
			)}

			{/* Empty state when no parameters are found */}
			<EmptyState
				filteredParameters={filteredParameters}
				isAddingParameter={isAddingParameter}
			/>

			{/* Parameter rows */}
			{filteredParameters.map((parameter) => {
				const isEditing = editingParameter === parameter.id;
				const isExpanded = expandedRows.has(parameter.id);
				const isUnused = !(usedParameterIds || []).includes(parameter.id);

				return (
					<ParameterRow
						key={parameter.id}
						parameter={parameter}
						isEditing={isEditing}
						editData={editData}
						setEditData={setEditData}
						handleEditParameter={handleEditParameter}
						handleSaveParameter={handleSaveParameter}
						handleCancelEdit={handleCancelEdit}
						handleDeleteParameter={handleDeleteParameter}
						highlightSearchTerm={highlightSearchTerm}
						searchQuery={searchQuery}
						getCategoryBadgeStyleWrapper={getCategoryBadgeStyleWrapper}
						getCategoryBadgeStyleForDropdownWrapper={
							getCategoryBadgeStyleForDropdownWrapper
						}
						getUserInterfaceBadgeStyle={getUserInterfaceBadgeStyle}
						getDisplayTypeBadgeStyle={getDisplayTypeBadgeStyle}
						getAllAvailableCategories={getAllAvailableCategories}
						columnVisibility={columnVisibility}
						editingParameter={editingParameter}
						isAddingParameter={isAddingParameter}
						renderCell={renderCell}
						expandedRows={expandedRows}
						toggleRowExpansion={toggleRowExpansion}
						usedParameterIds={usedParameterIds}
						isUnused={isUnused}
					/>
				);
			})}

			{/* Add parameter button row */}
			<AddParameterButton
				isAddingParameter={isAddingParameter}
				activeTab={activeTab}
				handleAddParameter={handleAddParameter}
				handleCancelAddParameter={handleCancelAddParameter}
			/>
		</TableBody>
	);
}

/**
 * AddParameterRow component - Renders the row for adding a new parameter
 */
function AddParameterRow({
	isAddingParameter,
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	getAllAvailableCategories,
	getCategoryBadgeStyleForDropdownWrapper,
	getUserInterfaceBadgeStyle,
	getDisplayTypeBadgeStyle,
	columnVisibility,
	renderCell,
	usedParameterIds,
}: AddParameterRowProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSaveNewParameter();
		} else if (e.key === "Escape") {
			handleCancelAddParameter();
		}
	};

			const isSaveDisabled = () => {
			return (
				!newParameterData.name.trim() ||
				!newParameterData.unit.trim() ||
				(newParameterData.user_interface?.type === "static" &&
					((newParameterData.display_type === "simple" &&
						!newParameterData.value.trim()) ||
						(newParameterData.display_type === "range" &&
							(!newParameterData.range_min.trim() ||
								!newParameterData.range_max.trim())) ||
						(newParameterData.display_type === "dropdown" &&
							newParameterData.dropdown_options.length === 0) ||
						(newParameterData.display_type === "filter" &&
							newParameterData.dropdown_options.length === 0)))
			);
		};

	return (
		<TableRow className="bg-green-50 border-2 border-green-200 shadow-md">
			{renderCell(
				columnVisibility.parameterName,
				<div className="flex items-center gap-2">
					<Input
						value={newParameterData.name}
						onChange={(e) => {
									const originalValue = e.target.value;
									const filteredValue = originalValue.replace(/[()+=\-*/]/g, '');
									
									if (originalValue !== filteredValue) {
										toast.error("Characters ()+-*/ are not allowed in parameter names");
									}
									
									setNewParameterData((prev) => ({
								...prev,
								name: filteredValue,
							}));
						}}
						className="h-7 text-xs"
						placeholder="Parameter name"
								onKeyDown={handleKeyDown}
					/>
				</div>,
				"parameterName"
			)}
			{renderCell(
				columnVisibility.category,
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
						{getAllAvailableCategories().length > 0 ? (
							getAllAvailableCategories().map((category) => (
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
				</Select>,
				"category"
			)}
			{renderCell(
				columnVisibility.displayType,
				<Select
					value={newParameterData.display_type}
					onValueChange={(value) =>
						setNewParameterData((prev) => ({
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
								style={getDisplayTypeBadgeStyle(newParameterData.display_type)}
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
				</Select>,
				"displayType"
			)}
			{renderCell(
				columnVisibility.value,
				renderDisplayTypeEditor(
					newParameterData.display_type,
					newParameterData,
					setNewParameterData,
					[],
					handleSaveNewParameter,
					handleCancelAddParameter
				),
				"value"
			)}
			{renderCell(
				columnVisibility.testValue,
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
					onKeyDown={handleKeyDown}
				/>,
				"testValue"
			)}
			{renderCell(
				columnVisibility.unit,
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
					onKeyDown={handleKeyDown}
				/>,
				"unit"
			)}
			{renderCell(
				columnVisibility.description,
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
					onKeyDown={handleKeyDown}
				/>,
				"description"
			)}
			{renderCell(
				columnVisibility.information,
				<Input
					value={newParameterData.information}
					onChange={(e) =>
						setNewParameterData((prev) => ({
							...prev,
							information: e.target.value,
						}))
					}
					className="h-7 text-xs"
					placeholder="Information"
					onKeyDown={handleKeyDown}
				/>,
				"information"
			)}
			{renderCell(
				columnVisibility.userInterface,
				<div className="space-y-1">
					<Select
						value={newParameterData.user_interface?.type || "input"}
						onValueChange={(value) =>
							setNewParameterData((prev) => ({
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
											newParameterData.user_interface?.type || "input"
										).color,
									}}
								>
									{newParameterData.user_interface?.type || "Select provider"}
								</span>
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="input">Input</SelectItem>
							<SelectItem value="static">Static</SelectItem>
							<SelectItem value="not_viewable">Not Viewable</SelectItem>
						</SelectContent>
					</Select>
					{newParameterData.user_interface?.type === "input" && (
						<Select
							value={
								newParameterData.user_interface?.is_advanced ? "true" : "false"
							}
							onValueChange={(value) =>
								setNewParameterData((prev) => ({
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
									{newParameterData.user_interface?.is_advanced
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
				</div>,
				"userInterface"
			)}
			{renderCell(
				columnVisibility.output,
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
				</Select>,
				"output"
			)}
			{renderCell(
				columnVisibility.actions,
				<div className="flex items-center gap-1">
					<Button
						size="sm"
						variant="ghost"
						onClick={handleSaveNewParameter}
						className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
						disabled={isSaveDisabled()}
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
				</div>,
				"actions"
			)}
		</TableRow>
	);
}

/**
 * ParameterRow component - Renders a single parameter row with editing capabilities
 */
function ParameterRow({
	parameter,
	isEditing,
	editData,
	setEditData,
	handleEditParameter,
	handleSaveParameter,
	handleCancelEdit,
	handleDeleteParameter,
	highlightSearchTerm,
	searchQuery,
	getCategoryBadgeStyleWrapper,
	getCategoryBadgeStyleForDropdownWrapper,
	getUserInterfaceBadgeStyle,
	getDisplayTypeBadgeStyle,
	getAllAvailableCategories,
	columnVisibility,
	editingParameter,
	isAddingParameter,
	renderCell,
	expandedRows,
	toggleRowExpansion,
	usedParameterIds,
	isUnused,
}: ParameterRowProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSaveParameter(parameter.id);
		} else if (e.key === "Escape") {
			handleCancelEdit();
		}
	};

	const isSaveDisabled = () => {
		return (
			!editData.name.trim() ||
			!editData.unit.trim() ||
			(editData.user_interface?.type === "static" &&
				((editData.display_type === "simple" && !editData.value.trim()) ||
					(editData.display_type === "range" &&
						(!editData.range_min.trim() || !editData.range_max.trim())) ||
					(editData.display_type === "dropdown" &&
						editData.dropdown_options.length === 0) ||
					(editData.display_type === "filter" &&
						editData.dropdown_options.length === 0)))
		);
	};

	const getUserInterfaceDisplayText = (userInterface: any) => {
		if (!userInterface) {
			return "Not Viewable";
		}
		if (typeof userInterface === "string") {
			return userInterface === "input"
				? "Input"
				: userInterface === "static"
				? "Static"
				: userInterface === "not_viewable"
				? "Not Viewable"
				: userInterface;
		}
		if (!userInterface.type) {
			return "Not Viewable";
		}
		return userInterface.type === "input"
			? "Input"
			: userInterface.type === "static"
			? "Static"
			: userInterface.type === "not_viewable"
			? "Not Viewable"
			: userInterface.type;
	};

	const getReadOnlyTooltip = (userInterface: any) => {
		if (!userInterface) {
			return "Global parameter - not modifiable";
		}
		const type =
			typeof userInterface === "string" ? userInterface : userInterface?.type || "not_viewable";
		if (type === "not_viewable") return "Global parameter - not modifiable";
		if (type === "static") return "Company parameter - not modifiable";
		return "Parameter - not modifiable";
	};

	const isExpanded = expandedRows.has(parameter.id);

	return (
		<TableRow
			className={`transition-all duration-200 cursor-pointer ${
				isEditing ? "bg-blue-50 border-2 border-blue-200 shadow-md" : ""
			} ${
				(editingParameter && !isEditing) || isAddingParameter
					? "opacity-40 pointer-events-none"
					: ""
			} ${isUnused ? "opacity-50" : ""}`}
			style={{
				height: isExpanded ? "auto" : "32px",
				minHeight: "32px",
			}}
			onClick={() => !isEditing && toggleRowExpansion(parameter.id)}
		>
			{renderCell(
				columnVisibility.parameterName,
				isEditing ? (
					<Input
						value={editData.name}
						onChange={(e) => {
											const originalValue = e.target.value;
											const filteredValue = originalValue.replace(/[()+=\-*/]/g, '');
											
											if (originalValue !== filteredValue) {
												toast.error("Characters ()+-*/ are not allowed in parameter names");
											}
											
											setEditData((prev) => ({
								...prev,
								name: filteredValue,
							}));
						}}
						className="h-7 text-xs"
						placeholder="Parameter name"
					/>
				) : (
					<div className="flex items-center gap-2">
						<span className="font-medium text-xs">
							{highlightSearchTerm(parameter.name, searchQuery)}
						</span>
						{isUnused && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Lock className="h-3 w-3 text-muted-foreground ml-1" />
									</TooltipTrigger>
									<TooltipContent>
										<p>Unused parameter</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				),
				"parameterName",
				isExpanded
			)}

			{renderCell(
				columnVisibility.category,
				isEditing ? (
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
						style={getCategoryBadgeStyleWrapper(parameter.category.name)}
					>
						{highlightSearchTerm(parameter.category.name, searchQuery)}
					</Badge>
				),
				"category",
				isExpanded
			)}

			{renderCell(
				columnVisibility.displayType,
				isEditing ? (
					<Select
						value={editData.display_type}
						onValueChange={(value) =>
							setEditData((prev) => ({
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
								<span style={getDisplayTypeBadgeStyle(editData.display_type)}>
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
						{highlightSearchTerm(parameter.display_type, searchQuery)}
					</Badge>
				),
				"displayType",
				isExpanded
			)}

			{renderCell(
				columnVisibility.value,
				isEditing ? (
					renderDisplayTypeEditor(
						editData.display_type,
						editData,
						setEditData,
						[],
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
				),
				"value",
				isExpanded
			)}

			{renderCell(
				columnVisibility.testValue,
				isEditing ? (
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
						onKeyDown={handleKeyDown}
					/>
				) : (
					<span className="text-xs text-muted-foreground">
						{highlightSearchTerm(parameter.test_value, searchQuery)}
					</span>
				),
				"testValue",
				isExpanded
			)}

			{renderCell(
				columnVisibility.unit,
				isEditing ? (
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
				),
				"unit",
				isExpanded
			)}

			{renderCell(
				columnVisibility.description,
				isEditing ? (
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
								<p className="text-sm">{parameter.description}</p>
							</TooltipContent>
						</Tooltip>
					</div>
				),
				"description",
				isExpanded
			)}

			{renderCell(
				columnVisibility.information,
				isEditing ? (
					<Input
						value={editData.information}
						onChange={(e) =>
							setEditData((prev) => ({
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
				),
				"information",
				isExpanded
			)}

			{renderCell(
				columnVisibility.userInterface,
				isEditing ? (
					<div className="space-y-1">
						<Select
							value={editData.user_interface?.type || "input"}
							onValueChange={(value) =>
								setEditData((prev) => ({
									...prev,
									user_interface: {
										type: value as "input" | "static" | "not_viewable",
										category: "",
										is_advanced: editData.user_interface?.is_advanced || false,
									},
								}))
							}
						>
							<SelectTrigger className="h-7 text-xs">
								<SelectValue>
									<span
										style={{
											color: getUserInterfaceBadgeStyle(
												editData.user_interface?.type || "input"
											).color,
										}}
									>
										{getUserInterfaceDisplayText(editData.user_interface)}
									</span>
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="input">Input</SelectItem>
								<SelectItem value="static">Static</SelectItem>
								<SelectItem value="not_viewable">Not Viewable</SelectItem>
							</SelectContent>
						</Select>
						{editData.user_interface?.type === "input" && (
							<Select
								value={editData.user_interface?.is_advanced ? "true" : "false"}
								onValueChange={(value) =>
									setEditData((prev) => ({
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
										{editData.user_interface?.is_advanced
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
									: parameter.user_interface?.type || "input"
							)}
						>
							{highlightSearchTerm(
								getUserInterfaceDisplayText(parameter.user_interface),
								searchQuery
							)}
						</Badge>
						{typeof parameter.user_interface === "object" &&
							parameter.user_interface?.type === "input" && (
								<Badge
									variant="outline"
									className="text-xs"
									style={{
										backgroundColor: parameter.user_interface?.is_advanced
											? "#fef3c7"
											: "#f0f9ff",
										color: parameter.user_interface?.is_advanced
											? "#92400e"
											: "#1e40af",
										borderColor: parameter.user_interface?.is_advanced
											? "#f59e0b"
											: "#3b82f6",
									}}
								>
									{parameter.user_interface?.is_advanced ? "Advanced" : "Simple"}
								</Badge>
							)}
					</div>
				),
				"userInterface",
				isExpanded
			)}

			{renderCell(
				columnVisibility.output,
				isEditing ? (
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
							<SelectValue>{editData.output ? "True" : "False"}</SelectValue>
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
				),
				"output",
				isExpanded
			)}

			{renderCell(
				columnVisibility.actions,
				<div className="flex items-center gap-1">
					{!isEditing ? (
						<>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => handleEditParameter(parameter)}
								className="h-5 w-5 p-0"
								disabled={editingParameter !== null || isAddingParameter}
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
								onClick={() => handleSaveParameter(parameter.id)}
								className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
								disabled={isSaveDisabled()}
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
				</div>,
				"actions",
				isExpanded
			)}
		</TableRow>
	);
}

/**
 * EmptyState component - Shows when no parameters are found
 */
function EmptyState({
	filteredParameters,
	isAddingParameter,
}: EmptyStateProps) {
	if (filteredParameters.length !== 0 || isAddingParameter) return null;

	return (
		<TableRow>
			<TableCell colSpan={11} className="text-center py-8">
				<div className="flex flex-col items-center gap-2 text-muted-foreground">
					<Info className="h-8 w-8" />
					<p className="text-sm font-medium">No parameters found</p>
					<p className="text-xs">Add parameters to get started</p>
				</div>
			</TableCell>
		</TableRow>
	);
}

/**
 * AddParameterButton component - Renders the add parameter button row
 */
function AddParameterButton({
	isAddingParameter,
	activeTab,
	handleAddParameter,
	handleCancelAddParameter,
}: AddParameterButtonProps) {
	if (isAddingParameter || activeTab === "Global") return null;

	return (
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
					<span className="text-xs">Add Parameter</span>
				</div>
			</TableCell>
		</TableRow>
	);
}
