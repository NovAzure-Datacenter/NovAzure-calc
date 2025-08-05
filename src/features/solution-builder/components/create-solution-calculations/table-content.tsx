"use client";

import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Edit, Save, X, Plus } from "lucide-react";
import { Calculation } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	CalculationsTableContentProps,
	CalculationsTableHeaderProps,
	CalculationsTableBodyProps,
	CalculationRowProps,
	AddCalculationRowProps,
	FormulaEditorProps,
	ExpandedFormulaEditorProps,
	FormulaPreviewProps,
	MathematicalOperatorsProps,
	ParametersByCategoryProps,
	ParameterButtonProps,
	AddCalculationButtonProps,
} from "../../types/types";

/**
 * TableContent component - Main calculations table with editing capabilities
 * Displays calculations in a table format with inline editing, formula expansion, and parameter insertion
 * Supports adding new calculations, editing existing ones, and managing calculation categories
 */
import { useCalculationValidator } from "./hooks/useCalculationValidator";
import { CustomCalculationCategory } from "../../utils/calculation-color-utils";

interface TableContentProps {
	calculations: Calculation[];
	editingCalculation: string | null;
	editData: {
		name: string;
		formula: string;
		units: string;
		description: string;
		category: string;
		output: boolean;
		display_result: boolean;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			formula: string;
			units: string;
			description: string;
			category: string;
			output: boolean;
			display_result: boolean;
		}>
	>;
	handleEditCalculation: (calculation: Calculation) => void;
	handleSaveCalculation: (calculationId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteCalculation: (calculationId: string) => void;
	insertIntoFormula: (text: string) => void;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	getCategoryColor: (category: string) => string;
	getStatusColor: (status: string) => string;
	groupedParameters: Record<string, any[]>;
	// Add calculation props
	isAddingCalculation: boolean;
	newCalculationData: Calculation;
	setNewCalculationData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			description: string;
			formula: string;
			units: string;
			category: string;
			output: boolean;
			display_result: boolean;
		}>
	>;
	handleSaveNewCalculation: () => void;
	handleCancelAddCalculation: () => void;
	handleAddCalculation: () => void;
	allCategories: string[];
	customCategories: CustomCalculationCategory[];
}

export function TableContent({
	calculations,
	editingCalculation,
	editData,
	setEditData,
	handleEditCalculation,
	handleSaveCalculation,
	handleCancelEdit,
	handleDeleteCalculation,
	insertIntoFormula,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	getCategoryColor,
	getStatusColor,
	groupedParameters,
	isAddingCalculation,
	newCalculationData,
	setNewCalculationData,
	handleSaveNewCalculation,
	handleCancelAddCalculation,
	handleAddCalculation,
	allCategories,
	customCategories,
}: CalculationsTableContentProps) {
	const [isAddFormulaExpanded, setIsAddFormulaExpanded] = useState(false);
	const [expandedCalculations, setExpandedCalculations] = useState<Set<string>>(new Set());

	// Helper functions
	const toggleFormulaExpanded = (calculationId: string) => {
		setExpandedCalculations(prev => {
			const newSet = new Set(prev);
			if (newSet.has(calculationId)) {
				newSet.delete(calculationId);
			} else {
				newSet.add(calculationId);
			}
			return newSet;
		});
	};

	const setIsExpanded = (calculationId: string) => (expanded: boolean) => {
		setExpandedCalculations(prev => {
			const newSet = new Set(prev);
			if (expanded) {
				newSet.add(calculationId);
			} else {
				newSet.delete(calculationId);
			}
			return newSet;
		});
	};

	return (
		<div className="border rounded-md">
			<div className="max-h-[55vh] overflow-y-auto">
				<TooltipProvider>
					<Table>
						<CalculationsTableHeader />
						<CalculationsTableBody
							calculations={calculations}
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
							groupedParameters={groupedParameters}
							isAddingCalculation={isAddingCalculation}
							newCalculationData={newCalculationData}
							setNewCalculationData={setNewCalculationData}
							handleSaveNewCalculation={handleSaveNewCalculation}
							handleCancelAddCalculation={handleCancelAddCalculation}
							handleAddCalculation={handleAddCalculation}
							allCategories={allCategories}
							expandedCalculations={expandedCalculations}
							setExpandedCalculations={setExpandedCalculations}
						/>
					</Table>
				</TooltipProvider>
			</div>
		</div>
	);
}

/**
 * CalculationsTableHeader component - Renders the table header with column definitions and tooltips
 */
function CalculationsTableHeader({}: CalculationsTableHeaderProps) {
	const headerColumns = [
		{ 
			key: 'level', 
			label: 'Level', 
			width: 'w-16', 
			hasTooltip: true, 
			tooltip: {
				title: 'The calculation priority level based on category',
				content: '• Level 1: Financial calculations\n• Level 2: Performance & Efficiency\n• Level 3: Operational'
			}
		},
		{ key: 'name', label: 'Name', width: 'w-32', hasTooltip: false },
		{ key: 'category', label: 'Category', width: 'w-24', hasTooltip: false },
		{ 
			key: 'formula', 
			label: 'Formula', 
			width: 'w-80', 
			hasTooltip: true, 
			tooltip: {
				title: 'Mathematical expression using parameters and operators',
				content: '• Use parameter names as variables\n• Supports +, -, *, /, **, ( )\n• Real-time validation and preview'
			}
		},
		{ key: 'description', label: 'Description', width: 'w-48', hasTooltip: false },
		{ 
			key: 'mockResult', 
			label: 'Mock Result', 
			width: 'w-24', 
			hasTooltip: true, 
			tooltip: {
				title: 'Calculated result using current parameter values',
				content: '• Valid: Formula evaluates successfully\n• Error: Formula has syntax issues\n• Pending: Waiting for evaluation'
			}
		},
		{ key: 'unit', label: 'Unit', width: 'w-16', hasTooltip: false },
		{ 
			key: 'displayResult', 
			label: 'Is display Result', 
			width: 'w-32', 
			hasTooltip: true, 
			tooltip: {
				title: 'Whether this calculation result is displayed in the results view',
				content: '• Yes: Result is shown in calculation results\n• No: Result is hidden from display'
			}
		},
		{ 
			key: 'output', 
			label: 'Output', 
			width: 'w-20', 
			hasTooltip: true, 
			tooltip: {
				title: 'Whether this calculation is included in final results',
				content: '• Yes: Shows in value calculator\n• No: Internal calculation only'
			}
		},
		{ key: 'actions', label: 'Actions', width: 'w-20', hasTooltip: false },
	];

	return (
		<TableHeader className="sticky top-0 bg-background z-10">
			<TableRow>
				{headerColumns.map(({ key, label, width, hasTooltip, tooltip }) => (
					<TableHead key={key} className={`${width} bg-background`}>
						{hasTooltip && tooltip ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex items-center gap-1 cursor-help">
										{label}
										<Info className="h-3 w-3 text-muted-foreground" />
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-sm">{tooltip.title}</p>
									<p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
										{tooltip.content}
									</p>
								</TooltipContent>
							</Tooltip>
						) : (
							label
						)}
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	);
}

/**
 * CalculationsTableBody component - Renders the table body with calculation rows and add new calculation row
 */
function CalculationsTableBody({
	calculations,
	editingCalculation,
	editData,
	setEditData,
	handleEditCalculation,
	handleSaveCalculation,
	handleCancelEdit,
	handleDeleteCalculation,
	insertIntoFormula,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	getCategoryColor,
	getStatusColor,
	groupedParameters,
	isAddingCalculation,
	newCalculationData,
	setNewCalculationData,
	handleSaveNewCalculation,
	handleCancelAddCalculation,
	handleAddCalculation,
	allCategories,
	expandedCalculations,
	setExpandedCalculations,
}: CalculationsTableBodyProps) {
	// State for add calculation formula expansion
	const [isAddFormulaExpanded, setIsAddFormulaExpanded] = useState(false);

	// Reset formula expansion when add calculation is cancelled
	React.useEffect(() => {
		if (!isAddingCalculation) {
			setIsAddFormulaExpanded(false);
		}
	}, [isAddingCalculation]);

	// Helper functions
	const toggleFormulaExpanded = (calculationId: string) => {
		setExpandedCalculations(prev => {
			const newSet = new Set(prev);
			if (newSet.has(calculationId)) {
				newSet.delete(calculationId);
			} else {
				newSet.add(calculationId);
			}
			return newSet;
		});
	};

	const setIsExpanded = (calculationId: string) => (expanded: boolean) => {
		setExpandedCalculations(prev => {
			const newSet = new Set(prev);
			if (expanded) {
				newSet.add(calculationId);
			} else {
				newSet.delete(calculationId);
			}
			return newSet;
		});
	};

	return (
		<TableBody>
			{/* Add new calculation row */}
			{isAddingCalculation && (
				<AddCalculationRow
					isAddingCalculation={isAddingCalculation}
					newCalculationData={newCalculationData}
					setNewCalculationData={setNewCalculationData}
					handleSaveNewCalculation={handleSaveNewCalculation}
					handleCancelAddCalculation={handleCancelAddCalculation}
					insertIntoFormula={insertIntoFormula}
					resetFormula={resetFormula}
					rewindFormula={rewindFormula}
					getColorCodedFormula={getColorCodedFormula}
					getCategoryColor={getCategoryColor}
					groupedParameters={groupedParameters}
					allCategories={allCategories}
					isAddFormulaExpanded={isAddFormulaExpanded}
					setIsAddFormulaExpanded={setIsAddFormulaExpanded}
				/>
			)}

			{/* Calculation rows */}
			{calculations.map((calculation) => {
				const isEditing = editingCalculation === calculation.id;
				const isFormulaExpanded = expandedCalculations.has(calculation.id);

				return (
					<CalculationRow
						key={calculation.id}
						calculation={calculation}
						isEditing={isEditing}
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
						groupedParameters={groupedParameters}
						allCategories={allCategories}
						editingCalculation={editingCalculation}
						isFormulaExpanded={isFormulaExpanded}
						toggleFormulaExpanded={toggleFormulaExpanded}
					/>
				);
			})}

			{/* Add calculation button row */}
			<AddCalculationButton
				isAddingCalculation={isAddingCalculation}
				handleAddCalculation={handleAddCalculation}
				handleCancelAddCalculation={handleCancelAddCalculation}
			/>
		</TableBody>
	);
}

/**
 * CalculationRow component - Renders a single calculation row with editing capabilities
 */
function CalculationRow({
	calculation,
	isEditing,
	editData,
	setEditData,
	handleEditCalculation,
	handleSaveCalculation,
	handleCancelEdit,
	handleDeleteCalculation,
	insertIntoFormula,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	getCategoryColor,
	getStatusColor,
	groupedParameters,
	allCategories,
	editingCalculation,
	isFormulaExpanded,
	toggleFormulaExpanded,
}: CalculationRowProps) {
	// Helper functions
	const getCalculationLevel = (category: any) => {
		if (typeof category === "string") return "1";
		
		switch (category?.name) {
			case "financial":
				return "1";
			case "performance":
				return "2";
			case "efficiency":
				return "2";
			case "operational":
				return "3";
			default:
				return "1";
		}
	};

	const getCategoryName = (category: any) => {
		return typeof category === "string" ? category : category?.name || "Unknown";
	};

	// If formula is expanded, render expanded formula editor
	if (isFormulaExpanded) {
		return (
			<TableRow className="transition-all duration-200 bg-blue-50 border-2 border-blue-200 shadow-md">
				{/* Level */}
				<TableCell>
					<span className="text-sm font-mono">{getCalculationLevel(calculation.category)}</span>
				</TableCell>
				
				{/* Formula - Expanded mode (spans all remaining columns) */}
				<TableCell colSpan={9} className="p-0">
					<ExpandedFormulaEditor
						title={`Formula Editor - ${calculation.name}`}
						formula={editData.formula}
						onFormulaChange={(formula) => setEditData(prev => ({ ...prev, formula }))}
						onCollapse={() => toggleFormulaExpanded(calculation.id)}
						resetFormula={resetFormula}
						rewindFormula={rewindFormula}
						getColorCodedFormula={getColorCodedFormula}
						groupedParameters={groupedParameters}
						insertIntoFormula={insertIntoFormula}
					/>
				</TableCell>
			</TableRow>
		);
	}

	// Normal row rendering (not expanded)
	return (
		<TableRow
			className={`transition-all duration-200 ${
				isEditing ? "bg-blue-50 border-2 border-blue-200 shadow-md" : ""
			} ${
				editingCalculation && !isEditing ? "opacity-40 pointer-events-none" : ""
			}`}
		>
			{/* Level */}
			<TableCell>
				<span className="text-sm font-mono">{getCalculationLevel(calculation.category)}</span>
			</TableCell>
			
			{/* Name */}
			<TableCell>
				{isEditing ? (
					<Input
						value={editData.name}
						onChange={(e) =>
							setEditData((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
						className="h-8 text-sm"
						placeholder="Calculation name"
					/>
				) : (
					<span className="font-medium text-sm">{calculation.name}</span>
				)}
			</TableCell>
			
			{/* Category */}
			<TableCell>
				{isEditing ? (
					<Select
						value={editData.category || getCategoryName(calculation.category)}
						onValueChange={(value) =>
							setEditData((prev) => ({
								...prev,
								category: value,
							}))
						}
					>
						<SelectTrigger className="h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{allCategories.map((category) => (
								<SelectItem key={category} value={category}>
									<div className="flex items-center gap-2">
										<Badge
											variant="outline"
											className={`text-xs ${getCategoryColor(category)}`}
										>
											{category}
										</Badge>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<Badge
						variant="outline"
						className={`text-xs ${getCategoryColor(getCategoryName(calculation.category))}`}
					>
						{getCategoryName(calculation.category)}
					</Badge>
				)}
			</TableCell>
			
			{/* Formula */}
			<FormulaEditor
				isEditing={isEditing}
				calculation={calculation}
				editData={editData}
				setEditData={setEditData}
				resetFormula={resetFormula}
				rewindFormula={rewindFormula}
				getColorCodedFormula={getColorCodedFormula}
				groupedParameters={groupedParameters}
				insertIntoFormula={insertIntoFormula}
				isExpanded={isFormulaExpanded}
				setIsExpanded={(expanded) => {
					if (expanded) {
						toggleFormulaExpanded(calculation.id);
					} else {
						toggleFormulaExpanded(calculation.id);
					}
				}}
			/>
			
			{/* Description */}
			<TableCell>
				{isEditing ? (
					<Input
						value={editData.description}
						onChange={(e) =>
							setEditData((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
						className="h-8 text-sm"
						placeholder="Description"
					/>
				) : (
					<span className="text-sm text-muted-foreground">{calculation.description}</span>
				)}
			</TableCell>
			
			{/* Mock Result */}
			<TableCell>
				<div className="flex items-center gap-2">
					<Badge 
						className={`text-xs ${
							calculation.status === "error" 
								? "bg-red-100 text-red-800 border-red-200" 
								: "bg-green-100 text-green-800 border-green-200"
						}`}
					>
						{calculation.status === "error" ? "Error:" : "Valid:"}
					</Badge>
					<span
						className={`text-sm font-mono ${
							calculation.status === "error" ? "text-red-600" : "text-green-600"
						}`}
					>
						{calculation.status === "error" 
							? "Error"
							: typeof calculation.result === "number"
								? calculation.result.toLocaleString()
								: calculation.result
						}
					</span>
				</div>
			</TableCell>
			
			{/* Unit */}
			<TableCell>
				{isEditing ? (
					<Input
						value={editData.units}
						onChange={(e) =>
							setEditData((prev) => ({
								...prev,
								units: e.target.value,
							}))
						}
						className="h-8 text-sm"
						placeholder="Units"
					/>
				) : (
					<span className="text-sm text-muted-foreground">{calculation.units}</span>
				)}
			</TableCell>
			
			{/* Is display Result */}
			<TableCell>
				{isEditing ? (
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id={`display-result-${calculation.id}`}
							checked={editData.display_result !== undefined ? editData.display_result : (calculation.display_result !== undefined ? calculation.display_result : false)}
							onChange={(e) =>
								setEditData((prev) => ({
									...prev,
									display_result: e.target.checked,
								}))
							}
							className="h-4 w-4"
						/>
						<label htmlFor={`display-result-${calculation.id}`} className="text-sm">
							{editData.display_result !== undefined ? editData.display_result : (calculation.display_result !== undefined ? calculation.display_result : false) ? "Yes" : "No"}
						</label>
					</div>
				) : (
					<Badge
						variant="outline"
						className={`text-xs ${
							(calculation.display_result !== undefined ? calculation.display_result : false)
								? "bg-green-50 text-green-700 border-green-200"
								: "bg-gray-50 text-gray-700 border-gray-200"
						}`}
					>
						{(calculation.display_result !== undefined ? calculation.display_result : false) ? "Yes" : "No"}
					</Badge>
				)}
			</TableCell>
			
			{/* Output */}
			<TableCell>
				{isEditing ? (
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id={`output-${calculation.id}`}
							checked={editData.output !== undefined ? editData.output : calculation.output}
							onChange={(e) =>
								setEditData((prev) => ({
									...prev,
									output: e.target.checked,
								}))
							}
							className="h-4 w-4"
						/>
						<label htmlFor={`output-${calculation.id}`} className="text-sm">
							{editData.output !== undefined ? editData.output : calculation.output ? "Yes" : "No"}
						</label>
					</div>
				) : (
					<Badge
						variant="outline"
						className={`text-xs ${
							calculation.output
								? "bg-green-50 text-green-700 border-green-200"
								: "bg-gray-50 text-gray-700 border-gray-200"
						}`}
					>
						{calculation.output ? "Yes" : "No"}
					</Badge>
				)}
			</TableCell>
			
			{/* Actions */}
			<TableCell>
				<div className="flex items-center gap-1">
					{!isEditing ? (
						<>
							<button
								onClick={() => handleEditCalculation(calculation)}
								className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
								disabled={editingCalculation !== null}
							>
								<Edit className="h-4 w-4" />
							</button>
							<button
								onClick={() => handleDeleteCalculation(calculation.id)}
								className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
								disabled={editingCalculation !== null}
							>
								<X className="h-4 w-4" />
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => handleSaveCalculation(calculation.id)}
								className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
							>
								<Save className="h-4 w-4" />
							</button>
							<button
								onClick={handleCancelEdit}
								className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
							>
								<X className="h-4 w-4" />
							</button>
						</>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
}

/**
 * AddCalculationRow component - Renders the row for adding a new calculation
 */
function AddCalculationRow({
	isAddingCalculation,
	newCalculationData,
	setNewCalculationData,
	handleSaveNewCalculation,
	handleCancelAddCalculation,
	insertIntoFormula,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	getCategoryColor,
	groupedParameters,
	allCategories,
	isAddFormulaExpanded,
	setIsAddFormulaExpanded,
}: AddCalculationRowProps) {
	// Debug logging
	console.log('AddCalculationRow render:', { isAddFormulaExpanded, isAddingCalculation });

	const handleExpandClick = () => {
		console.log('Expand button clicked, current state:', isAddFormulaExpanded);
		setIsAddFormulaExpanded(!isAddFormulaExpanded);
		console.log('New state will be:', !isAddFormulaExpanded);
	};

	return (
		<TableRow className="bg-blue-50 border-2 border-blue-200 shadow-md">
			{/* Level */}
			<TableCell>
				<span className="text-sm text-muted-foreground">N/A</span>
			</TableCell>
			
			{/* If formula is expanded, only render level and formula columns */}
			{isAddFormulaExpanded ? (
				/* Formula - Expanded mode (spans all remaining columns) */
				<TableCell colSpan={9} className="p-0">
					<ExpandedFormulaEditor
						title="Formula Editor - New Calculation"
						formula={newCalculationData.formula}
						onFormulaChange={(formula) => setNewCalculationData(prev => ({ ...prev, formula }))}
						onCollapse={() => setIsAddFormulaExpanded(false)}
						resetFormula={resetFormula}
						rewindFormula={rewindFormula}
						getColorCodedFormula={getColorCodedFormula}
						groupedParameters={groupedParameters}
						insertIntoFormula={insertIntoFormula}
					/>
				</TableCell>
			) : (
				<>
					{/* Name */}
					<TableCell>
						<Input
							value={newCalculationData.name}
							onChange={(e) =>
								setNewCalculationData((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							className="h-8 text-sm"
							placeholder="Calculation name"
						/>
					</TableCell>
					{/* Category */}
					<TableCell>
						<Select
							value={newCalculationData.category}
							onValueChange={(value) =>
								setNewCalculationData((prev) => ({
									...prev,
									category: value,
								}))
							}
						>
							<SelectTrigger className="h-8">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{allCategories.map((category) => (
									<SelectItem key={category} value={category}>
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className={`text-xs ${getCategoryColor(category)}`}
											>
												{category}
											</Badge>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</TableCell>
					{/* Formula */}
					<TableCell>
						<div className="space-y-3">
							{/* Formula Input with Expand Button */}
							<div className="flex items-center gap-2">
								<Input
									value={newCalculationData.formula}
									onChange={(e) =>
										setNewCalculationData((prev) => ({
											...prev,
											formula: e.target.value,
										}))
									}
									className="h-8 text-sm font-mono flex-1"
									placeholder="Enter formula..."
								/>
								<Button
									size="sm"
									variant="default"
									onClick={handleExpandClick}
									className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
									title={isAddFormulaExpanded ? "Collapse formula editor" : "Expand formula editor with operators and parameters"}
								>
									{isAddFormulaExpanded ? (
										<>
											<span className="mr-1">−</span>
											<span>Collapse</span>
										</>
									) : (
										<>
											<span className="mr-1">+</span>
											<span>Expand</span>
										</>
									)}
								</Button>
							</div>

							{/* Formula Preview - Always visible when there's a formula */}
							{newCalculationData.formula && (
								<FormulaPreview
									formula={newCalculationData.formula}
									getColorCodedFormula={getColorCodedFormula}
									className="text-xs font-mono p-2 bg-muted/30 rounded border"
								/>
							)}
						</div>
					</TableCell>
					{/* Description */}
					<TableCell>
						<Input
							value={newCalculationData.description}
							onChange={(e) =>
								setNewCalculationData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							className="h-8 text-sm"
							placeholder="Description"
						/>
					</TableCell>
					{/* Mock Result */}
					<TableCell>
						<span className="text-sm text-muted-foreground">-</span>
					</TableCell>
					{/* Unit */}
					<TableCell>
						<Input
							value={newCalculationData.units}
							onChange={(e) =>
								setNewCalculationData((prev) => ({
									...prev,
									units: e.target.value,
								}))
							}
							className="h-8 text-sm"
							placeholder="Units"
						/>
					</TableCell>
					{/* Is display Result */}
					<TableCell>
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="new-calculation-display-result"
								checked={newCalculationData.display_result !== undefined ? newCalculationData.display_result : false}
								onChange={(e) =>
									setNewCalculationData((prev) => ({
										...prev,
										display_result: e.target.checked,
									}))
								}
								className="h-4 w-4"
							/>
							<label
								htmlFor="new-calculation-display-result"
								className="text-sm"
							>
								{newCalculationData.display_result !== undefined ? newCalculationData.display_result : false ? "Yes" : "No"}
							</label>
						</div>
					</TableCell>
					{/* Output */}
					<TableCell>
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="new-calculation-output"
								checked={newCalculationData.output}
								onChange={(e) =>
									setNewCalculationData((prev) => ({
										...prev,
										output: e.target.checked,
									}))
								}
								className="h-4 w-4"
							/>
							<label
								htmlFor="new-calculation-output"
								className="text-sm"
							>
								{newCalculationData.output ? "Yes" : "No"}
							</label>
						</div>
					</TableCell>
					{/* Actions */}
					<TableCell>
						<div className="flex items-center gap-1">
							<button
								onClick={handleSaveNewCalculation}
								disabled={
									!newCalculationData.name.trim() ||
									!newCalculationData.formula.trim()
								}
								className="h-6 w-6 p-0 text-green-600 hover:text-green-700 disabled:opacity-50"
							>
								<Save className="h-4 w-4" />
							</button>
							<button
								onClick={handleCancelAddCalculation}
								className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</TableCell>
				</>
			)}
		</TableRow>
	);
}

/**
 * FormulaEditor component - Renders formula editing interface
 */
function FormulaEditor({
	isEditing,
	calculation,
	editData,
	setEditData,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	groupedParameters,
	insertIntoFormula,
	isExpanded,
	setIsExpanded,
}: FormulaEditorProps) {
	return (
		<TableCell>
			{isEditing ? (
				<div className="space-y-3">
					{/* Formula Input with Expand Button */}
					<div className="flex items-center gap-2">
						<Input
							value={editData.formula}
							onChange={(e) =>
								setEditData((prev) => ({
									...prev,
									formula: e.target.value,
								}))
							}
							className="h-8 text-sm font-mono flex-1"
							placeholder="Enter formula..."
						/>
						<Button
							size="sm"
							variant="default"
							onClick={() => setIsExpanded(!isExpanded)}
							className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
							title={isExpanded ? "Collapse formula editor" : "Expand formula editor with operators and parameters"}
						>
							{isExpanded ? (
								<>
									<span className="mr-1">−</span>
									<span>Collapse</span>
								</>
							) : (
								<>
									<span className="mr-1">+</span>
									<span>Expand</span>
								</>
							)}
						</Button>
					</div>

					{/* Formula Preview - Always visible when there's a formula */}
					{editData.formula && (
						<FormulaPreview
							formula={editData.formula}
							getColorCodedFormula={getColorCodedFormula}
							className="text-xs font-mono p-2 bg-muted/30 rounded border"
						/>
					)}

					{/* Expanded Formula Editor - Only when expanded */}
					{isExpanded && (
						<div className="border rounded-md p-3 bg-muted/20">
							<div className="text-xs font-medium mb-3 text-muted-foreground">
								Formula Editor
							</div>
							
							{/* Formula Input with Clear and Rewind in Expanded Mode */}
							<div className="flex items-center gap-2 mb-3">
								<Input
									value={editData.formula}
									onChange={(e) =>
										setEditData((prev) => ({
											...prev,
											formula: e.target.value,
										}))
									}
									className="h-8 text-sm font-mono flex-1"
									placeholder="Enter formula..."
								/>
								<Button
									size="sm"
									variant="outline"
									onClick={resetFormula}
									className="h-8 px-2 text-xs"
									title="Clear formula"
								>
									Clear
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={rewindFormula}
									className="h-8 px-2 text-xs"
									title="Remove last character"
								>
									←
								</Button>
							</div>
							
							{/* Operators */}
							<MathematicalOperators insertIntoFormula={insertIntoFormula} className="mb-3" />

							{/* Parameters by Category */}
							<ParametersByCategory
								groupedParameters={groupedParameters}
								insertIntoFormula={insertIntoFormula}
							/>
						</div>
					)}
				</div>
			) : (
				<div className="flex items-center gap-2">
					<div className="flex flex-wrap gap-1 min-w-0 flex-1">
						{getColorCodedFormula(calculation.formula)}
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							<p className="text-sm">Formula: {calculation.formula}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</TableCell>
	);
}

/**
 * ExpandedFormulaEditor component - Full-screen formula editor with tools
 */
function ExpandedFormulaEditor({
	title,
	formula,
	onFormulaChange,
	onCollapse,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	groupedParameters,
	insertIntoFormula,
}: ExpandedFormulaEditorProps) {
	return (
		<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-md">
			<div className="flex items-center justify-between mb-4">
				<h4 className="text-sm font-medium text-blue-900">{title}</h4>
				<Button
					size="sm"
					variant="default"
					onClick={onCollapse}
					className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
					title="Collapse formula editor"
				>
					<span className="mr-1">−</span>
					<span>Collapse</span>
				</Button>
			</div>
			
			{/* Formula Input */}
			<div className="flex items-center gap-3 mb-4">
				<Input
					value={formula}
					onChange={(e) => onFormulaChange(e.target.value)}
					className="h-10 text-sm font-mono flex-1"
					placeholder="Enter formula..."
				/>
				<Button
					size="sm"
					variant="outline"
					onClick={resetFormula}
					className="h-10 px-3 text-xs"
					title="Clear formula"
				>
					Clear
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={rewindFormula}
					className="h-10 px-3 text-xs"
					title="Remove last character"
				>
					←
				</Button>
			</div>

			{/* Formula Preview */}
			{formula && (
				<FormulaPreview
					formula={formula}
					getColorCodedFormula={getColorCodedFormula}
					className="text-sm font-mono p-3 bg-white rounded border mb-4"
				/>
			)}

			{/* Formula Editor Tools */}
			<div className="space-y-4">
				{/* Operators */}
				<MathematicalOperators insertIntoFormula={insertIntoFormula} />

				{/* Parameters by Category */}
				<ParametersByCategory
					groupedParameters={groupedParameters}
					insertIntoFormula={insertIntoFormula}
				/>
			</div>
		</div>
	);
}

/**
 * FormulaPreview component - Displays color-coded formula preview
 */
function FormulaPreview({ formula, getColorCodedFormula, className }: FormulaPreviewProps) {
	return (
		<div className={className}>
			<div className="text-muted-foreground mb-2 text-xs font-medium">Formula Preview:</div>
			<div className="flex flex-wrap gap-1">
				{getColorCodedFormula(formula)}
			</div>
		</div>
	);
}

/**
 * MathematicalOperators component - Renders mathematical operator buttons
 */
function MathematicalOperators({ insertIntoFormula, className }: MathematicalOperatorsProps) {
	const operators = [
		{ symbol: "+", label: "Add" },
		{ symbol: "-", label: "Subtract" },
		{ symbol: "*", label: "Multiply" },
		{ symbol: "/", label: "Divide" },
		{ symbol: "(", label: "Open Parenthesis" },
		{ symbol: ")", label: "Close Parenthesis" },
		{ symbol: "**", label: "Power" },
	];

	return (
		<div className={className}>
			<div className="text-sm font-medium mb-3 text-blue-900">Mathematical Operators:</div>
			<div className="flex flex-wrap gap-2">
				{operators.map((op) => (
					<button
						key={op.symbol}
						type="button"
						onClick={() => insertIntoFormula(op.symbol)}
						className="h-8 px-4 text-sm font-mono border rounded hover:bg-blue-100 transition-colors bg-white"
						title={op.label}
					>
						{op.symbol}
					</button>
				))}
			</div>
		</div>
	);
}

/**
 * ParametersByCategory component - Renders parameters organized by category
 */
function ParametersByCategory({ groupedParameters, insertIntoFormula, className }: ParametersByCategoryProps) {
	return (
		<div className={className}>
			<div className="text-sm font-medium mb-3 text-blue-900">Available Parameters:</div>
			<Accordion type="multiple" className="space-y-2 max-h-60 overflow-y-auto">
				{Object.entries(groupedParameters)
					.sort(([a], [b]) => {
						// Put "Calculations" first, then sort others alphabetically
						if (a === "Calculations") return -1;
						if (b === "Calculations") return 1;
						return a.localeCompare(b);
					})
					.map(([category, params]) => (
					<AccordionItem key={category} value={category} className="border rounded-md">
						<AccordionTrigger className="p-2 text-left hover:bg-muted/50 transition-colors bg-white">
							<span className="text-xs font-medium capitalize text-muted-foreground">
								{category} ({params.length})
							</span>
						</AccordionTrigger>
						<AccordionContent className="p-2 border-t bg-muted/20">
							<div className="flex flex-wrap gap-2">
								{(params as any[]).map((param: any) => (
									<ParameterButton
										key={param.id}
										param={param}
										insertIntoFormula={insertIntoFormula}
									/>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}

/**
 * ParameterButton component - Individual parameter button
 */
function ParameterButton({ param, insertIntoFormula }: ParameterButtonProps) {
	// Helper function to get category color for the parameter
	const getParameterCategoryColor = (paramCategory: any) => {
		if (!paramCategory || !paramCategory.color) {
			return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
		}
		
		switch (paramCategory.color.toLowerCase()) {
			case "green":
				return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
			case "blue":
				return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
			case "yellow":
				return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
			case "purple":
				return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
			case "red":
				return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
			case "orange":
				return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
			case "pink":
				return "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100";
			case "indigo":
				return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
		}
	};

	return (
		<button
			type="button"
			onClick={() => insertIntoFormula(param.name)}
			className={`h-6 px-3 text-xs border rounded transition-colors ${getParameterCategoryColor(param.category)}`}
			title={`${param.name}: ${param.description}`}
		>
			{param.name}
		</button>
	);
}

/**
 * AddCalculationButton component - Renders the add calculation button row
 */
function AddCalculationButton({
	isAddingCalculation,
	handleAddCalculation,
	handleCancelAddCalculation,
}: AddCalculationButtonProps) {
	if (isAddingCalculation) return null;

	return (
		<TableRow className="border-t-2">
			<TableCell
				colSpan={10}
				className="text-center bg-muted/50 cursor-pointer py-2"
				onClick={isAddingCalculation ? handleCancelAddCalculation : handleAddCalculation}
			>
				<div className="flex items-center gap-2 justify-center text-muted-foreground">
					<Plus className="h-3 w-3" />
					<span className="text-xs">Add Calculation</span>
				</div>
			</TableCell>
		</TableRow>
	);
}
 