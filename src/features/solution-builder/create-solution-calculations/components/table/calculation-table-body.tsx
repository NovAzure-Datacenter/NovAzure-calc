import React, { useState, useMemo, useEffect } from "react";
import { TableBody } from "@/components/ui/table";
import { CalculationsTableBodyProps } from "../../../types/types";
import { AddCalculationButton } from "./add-calculation-button";
import { CalculationRow } from "./calculation-row";
import { AddCalculationRow } from "./add-calculation-row";

/**
 * CalculationsTableBody component - Renders the table body with calculation rows and add new calculation row
 */
export function CalculationsTableBody({
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
	renderCell,
}: CalculationsTableBodyProps) {
	const sortedCalculations = useMemo(() => {
		return [...calculations].sort((a, b) => {
			// First sort by priority (Global/Required calculations first)
			const categoryA = (typeof a.category === "string" ? a.category : a.category?.name || "").toLowerCase();
			const categoryB = (typeof b.category === "string" ? b.category : b.category?.name || "").toLowerCase();

			const isAPriority = categoryA === "global" || categoryA === "required";
			const isBPriority = categoryB === "global" || categoryB === "required";

			if (isAPriority !== isBPriority) {
				return isAPriority ? -1 : 1;
			}

			// Then sort by level within each priority group
			const levelA = a.level || 1;
			const levelB = b.level || 1;
			return levelB - levelA;
		});
	}, [calculations]);

	// Find the index where priority calculations end
	const priorityEndIndex = sortedCalculations.findIndex((calc) => {
		const category = (typeof calc.category === "string" ? calc.category : calc.category?.name || "").toLowerCase();
		return category !== "global" && category !== "required";
	});

	const [isAddFormulaExpanded, setIsAddFormulaExpanded] = useState(false);

	React.useEffect(() => {
		if (!isAddingCalculation) {
			setIsAddFormulaExpanded(false);
		}
	}, [isAddingCalculation]);

	const toggleFormulaExpanded = (calculationId: string) => {
		setExpandedCalculations((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(calculationId)) {
				newSet.delete(calculationId);
			} else {
				newSet.add(calculationId);
			}
			return newSet;
		});
	};

	return (
		<TableBody>
			{sortedCalculations.map((calculation, index) => {
				const isEditing = editingCalculation === calculation.id;
				const isFormulaExpanded = expandedCalculations.has(calculation.id);

				// Add separator after priority calculations
				const showSeparator = index === priorityEndIndex && priorityEndIndex > 0;

				return (
					<React.Fragment key={calculation.id}>
						{showSeparator && (
							<tr>
								<td
									colSpan={10}
									className="border-t-2 border-blue-200 bg-blue-50 text-center py-1"
								>
									<span className="text-xs text-blue-600 font-medium">
										Custom Calculations
									</span>
								</td>
							</tr>
						)}
						<CalculationRow
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
							renderCell={renderCell}
						/>
					</React.Fragment>
				);
			})}

			{/* Add Calculation Row */}
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
					renderCell={renderCell}
				/>
			)}

			<AddCalculationButton
				isAddingCalculation={isAddingCalculation}
				handleAddCalculation={handleAddCalculation}
				handleCancelAddCalculation={handleCancelAddCalculation}
			/>
		</TableBody>
	);
} 