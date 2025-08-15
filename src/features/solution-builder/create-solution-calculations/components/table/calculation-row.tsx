import React, { useState, useEffect } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { CalculationRowProps } from "../../../types/types";
import { ExpandedFormulaEditor } from "../formula/expanded-formula-editor";
import {
	LevelCell,
	NameCell,
	CategoryCell,
	FormulaCell,
	DescriptionCell,
	MockResultCell,
	UnitCell,
	DisplayResultCell,
	OutputCell,
	ActionsCell,
} from "./cells";

/**
 * CalculationRow component - Renders a single calculation row with editing capabilities
 */
export function CalculationRow({
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
	renderCell,
}: CalculationRowProps) {
	// State for formula editor expansion when editing
	const [isFormulaEditorExpanded, setIsFormulaEditorExpanded] = useState(false);

	// Reset formula editor expansion when editing starts
	useEffect(() => {
		if (isEditing) {
			setIsFormulaEditorExpanded(false);
		}
	}, [isEditing]);

	// Helper functions
	const getCategoryName = (category: any) => {
		return typeof category === "string"
			? category
			: category?.name || "Unknown";
	};

	// Check if this is a priority calculation (Global/Required)
	const categoryName = getCategoryName(calculation.category);
	const category = categoryName.toLowerCase();
	const isPriority = category === "global" || category === "required";

	// If formula is expanded, render expanded formula editor
	if (isFormulaExpanded && !isEditing) {
		return (
			<TableRow className="transition-all duration-200 bg-blue-50 border-2 border-blue-200 shadow-md">
				{/* Level */}
				<TableCell>
					<span className="text-sm font-mono">{calculation.level || 1}</span>
				</TableCell>

				{/* Formula - Expanded mode (spans all remaining columns) */}
				<TableCell colSpan={9} className="p-0">
					<ExpandedFormulaEditor
						title={`Formula Editor - ${calculation.name}`}
						formula={editData.formula}
						onFormulaChange={(formula) =>
							setEditData((prev) => ({ ...prev, formula }))
						}
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

	// If formula editor is expanded when editing, render expanded formula editor
	if (isFormulaEditorExpanded && isEditing) {
		return (
			<TableRow className="transition-all duration-200 bg-blue-50 border-2 border-blue-200 shadow-md">
				{/* Level */}
				<TableCell>
					<span className="text-xs font-mono">{calculation.level || 1}</span>
				</TableCell>

				{/* Formula - Expanded mode (spans all remaining columns) */}
				<TableCell colSpan={9} className="p-0">
					<ExpandedFormulaEditor
						title={`Formula Editor - ${calculation.name}`}
						formula={editData.formula}
						onFormulaChange={(formula) =>
							setEditData((prev) => ({ ...prev, formula }))
						}
						onCollapse={() => setIsFormulaEditorExpanded(false)}
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

	// Regular row rendering using extracted cells
	return (
		<TableRow className={`border-b hover:bg-muted/50 ${isPriority ? "bg-yellow-50" : ""}`}>
			<LevelCell calculation={calculation} renderCell={renderCell} />
			
			<NameCell 
				calculation={calculation}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				renderCell={renderCell}
			/>
			
			<CategoryCell 
				calculation={calculation}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				allCategories={allCategories}
				getCategoryColor={getCategoryColor}
				renderCell={renderCell}
			/>
			
			<FormulaCell 
				calculation={calculation}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				insertIntoFormula={insertIntoFormula}
				resetFormula={resetFormula}
				rewindFormula={rewindFormula}
				getColorCodedFormula={getColorCodedFormula}
				groupedParameters={groupedParameters}
				isFormulaEditorExpanded={isFormulaEditorExpanded}
				setIsFormulaEditorExpanded={setIsFormulaEditorExpanded}
				renderCell={renderCell}
			/>
			
			<DescriptionCell 
				calculation={calculation}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				renderCell={renderCell}
			/>
			
			<MockResultCell 
				calculation={calculation}
				getStatusColor={getStatusColor}
				renderCell={renderCell}
			/>
			
			<UnitCell 
				calculation={calculation}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				renderCell={renderCell}
			/>
			
			<DisplayResultCell 
				calculation={calculation}
				renderCell={renderCell}
			/>
			
			<OutputCell 
				calculation={calculation}
				renderCell={renderCell}
			/>
			
			<ActionsCell 
				calculation={calculation}
				isEditing={isEditing}
				handleEditCalculation={handleEditCalculation}
				handleSaveCalculation={handleSaveCalculation}
				handleCancelEdit={handleCancelEdit}
				handleDeleteCalculation={handleDeleteCalculation}
				renderCell={renderCell}
			/>
		</TableRow>
	);
} 