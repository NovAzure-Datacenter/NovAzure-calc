import React, { useState, useMemo, useRef, useEffect } from "react";
import { Table } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CalculationsTableContentProps } from "../../../types/types";
import { CalculationsTableHeader } from "./calculation-table-header";
import { CalculationsTableBody } from "./calculation-table-body";

/**
 * CalculationTable component - Main calculations table with editing capabilities
 * Displays calculations in a table format with inline editing, formula expansion, and parameter insertion
 * Supports adding new calculations, editing existing ones, and managing calculation categories
 */
export function CalculationTable({
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
	const [expandedCalculations, setExpandedCalculations] = useState<Set<string>>(
		new Set()
	);
	const [tableWidth, setTableWidth] = useState<number>(0);
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculate dynamic column widths based on content and available space
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

	const calculateColumnWidths = () => {
		const baseWidth = Math.max(tableWidth || 1200, 1200);
		return {
			level: Math.max(60, baseWidth * 0.05),
			name: Math.max(120, baseWidth * 0.15),
			category: Math.max(100, baseWidth * 0.1),
			formula: Math.max(200, baseWidth * 0.25),
			description: Math.max(150, baseWidth * 0.15),
			mockResult: Math.max(100, baseWidth * 0.1),
			unit: Math.max(80, baseWidth * 0.08),
			displayResult: Math.max(80, baseWidth * 0.07),
			output: Math.max(80, baseWidth * 0.07),
			actions: Math.max(80, baseWidth * 0.08),
		};
	};

	const renderCell = (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => {
		if (!isVisible) return null;

		const columnWidths = calculateColumnWidths();
		const width = columnKey ? columnWidths[columnKey as keyof typeof columnWidths] : undefined;

		return (
			<td
				className="px-2 py-1 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden"
				style={{
					width: width ? `${width}px` : "auto",
					minWidth: width ? `${width}px` : "auto",
					maxWidth: width ? `${width}px` : "none",
				}}
			>
				{children}
			</td>
		);
	};

	return (
		<div className="border rounded-lg" ref={containerRef}>
			<div className="max-h-[55vh] overflow-y-auto overflow-x-auto relative">
				<TooltipProvider>
					<div className="min-w-full">
						<Table className="w-full min-w-[1200px] table-fixed">
							<CalculationsTableHeader
								calculateColumnWidths={calculateColumnWidths}
							/>
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
								renderCell={renderCell}
							/>
						</Table>
					</div>
				</TooltipProvider>
			</div>
		</div>
	);
} 