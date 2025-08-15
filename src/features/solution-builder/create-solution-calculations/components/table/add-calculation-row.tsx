import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { AddCalculationRowProps } from "../../../types/types";
import { ExpandedFormulaEditor } from "../formula/expanded-formula-editor";
import {
	AddLevelCell,
	AddNameCell,
	AddCategoryCell,
	AddFormulaCell,
	AddDescriptionCell,
	AddMockResultCell,
	AddUnitCell,
	AddDisplayResultCell,
	AddOutputCell,
	AddActionsCell,
} from "./cells";

/**
 * AddCalculationRow component - Renders the row for adding a new calculation
 */
export function AddCalculationRow({
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
	renderCell,
}: AddCalculationRowProps) {
	// If formula is expanded, render expanded formula editor
	if (isAddFormulaExpanded) {
		return (
			<TableRow className="bg-blue-50 border-2 border-blue-200 shadow-md">
				{/* Level */}
				<TableCell>
					<span className="text-xs font-mono">New</span>
				</TableCell>

				{/* Formula - Expanded mode (spans all remaining columns) */}
				<TableCell colSpan={9} className="p-0">
					<ExpandedFormulaEditor
						title="Formula Editor - New Calculation"
						formula={newCalculationData.formula}
						onFormulaChange={(formula) =>
							setNewCalculationData((prev) => ({ ...prev, formula }))
						}
						onCollapse={() => setIsAddFormulaExpanded(false)}
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

	// Regular add row rendering using extracted cells
	return (
		<TableRow className="bg-blue-50 border-2 border-blue-200 shadow-md">
			<AddLevelCell renderCell={renderCell} />
			
			<AddNameCell 
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				renderCell={renderCell}
			/>
			
			<AddCategoryCell 
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				allCategories={allCategories}
				renderCell={renderCell}
			/>
			
			<AddFormulaCell 
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				insertIntoFormula={insertIntoFormula}
				resetFormula={resetFormula}
				rewindFormula={rewindFormula}
				getColorCodedFormula={getColorCodedFormula}
				groupedParameters={groupedParameters}
				isAddFormulaExpanded={isAddFormulaExpanded}
				setIsAddFormulaExpanded={setIsAddFormulaExpanded}
				renderCell={renderCell}
			/>
			
			<AddDescriptionCell 
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				renderCell={renderCell}
			/>
			
			<AddMockResultCell renderCell={renderCell} />
			
			<AddUnitCell 
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				renderCell={renderCell}
			/>
			
			<AddDisplayResultCell 
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				renderCell={renderCell}
			/>
			
			<AddOutputCell 
				newCalculationData={newCalculationData}
				setNewCalculationData={setNewCalculationData}
				renderCell={renderCell}
			/>
			
			<AddActionsCell 
				handleSaveNewCalculation={handleSaveNewCalculation}
				handleCancelAddCalculation={handleCancelAddCalculation}
				renderCell={renderCell}
			/>
		</TableRow>
	);
} 