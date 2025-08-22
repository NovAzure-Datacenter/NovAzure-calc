import { Dispatch, SetStateAction } from "react";
import { Calculation } from "@/types/types";

// Common props that all cells receive
export interface CalculationCellCommonProps {
	calculation: Calculation;
	isEditing: boolean;
	editData: {
		name: string;
		formula: string;
		units: string;
		description: string;
		category: string;
		output: boolean;
		display_result: boolean;
	};
	setEditData: Dispatch<SetStateAction<{
		name: string;
		formula: string;
		units: string;
		description: string;
		category: string;
		output: boolean;
		display_result: boolean;
	}>>;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
}

// Specific props for cells that need additional functionality
export type LevelCellProps = Pick<CalculationCellCommonProps, 'calculation' | 'renderCell'>;

export type NameCellProps = Pick<CalculationCellCommonProps, 'calculation' | 'isEditing' | 'editData' | 'setEditData' | 'renderCell'>;

export interface CategoryCellProps extends Pick<CalculationCellCommonProps, 'calculation' | 'isEditing' | 'editData' | 'setEditData' | 'renderCell'> {
	allCategories: string[];
	getCategoryColor: (category: string) => string;
}

export interface FormulaCellProps extends Pick<CalculationCellCommonProps, 'calculation' | 'isEditing' | 'editData' | 'setEditData' | 'renderCell'> {
	insertIntoFormula: (text: string) => void;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	groupedParameters: Record<string, any[]>;
	isFormulaExpanded?: boolean;
	toggleFormulaExpanded?: (calculationId: string) => void;
	isFormulaEditorExpanded?: boolean;
	setIsFormulaEditorExpanded?: (expanded: boolean) => void;
}

export type DescriptionCellProps = Pick<CalculationCellCommonProps, 'calculation' | 'isEditing' | 'editData' | 'setEditData' | 'renderCell'>;

export interface MockResultCellProps extends Pick<CalculationCellCommonProps, 'calculation' | 'renderCell'> {
	getStatusColor: (status: string) => string;
}

export type UnitCellProps = Pick<CalculationCellCommonProps, 'calculation' | 'isEditing' | 'editData' | 'setEditData' | 'renderCell'>;

export type DisplayResultCellProps = Pick<CalculationCellCommonProps, 'calculation' | 'renderCell'>;

export type OutputCellProps = Pick<CalculationCellCommonProps, 'calculation' | 'renderCell'>;

export interface ActionsCellProps extends Pick<CalculationCellCommonProps, 'calculation' | 'isEditing' | 'renderCell'> {
	handleEditCalculation: (calculation: Calculation) => void;
	handleSaveCalculation: (calculationId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteCalculation: (calculationId: string) => void;
}

// Props for add calculation row cells
export interface AddCalculationCellCommonProps {
	newCalculationData: {
		name: string;
		description: string;
		formula: string;
		units: string;
		category: string;
		output: boolean;
		display_result: boolean;
	};
	setNewCalculationData: Dispatch<SetStateAction<{
		name: string;
		description: string;
		formula: string;
		units: string;
		category: string;
		output: boolean;
		display_result: boolean;
	}>>;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
}

export type AddNameCellProps = Pick<AddCalculationCellCommonProps, 'newCalculationData' | 'setNewCalculationData' | 'renderCell'>;

export interface AddCategoryCellProps extends Pick<AddCalculationCellCommonProps, 'newCalculationData' | 'setNewCalculationData' | 'renderCell'> {
	allCategories: string[];
}

export interface AddFormulaCellProps extends Pick<AddCalculationCellCommonProps, 'newCalculationData' | 'setNewCalculationData' | 'renderCell'> {
	insertIntoFormula: (text: string) => void;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	groupedParameters: Record<string, any[]>;
	isAddFormulaExpanded: boolean;
	setIsAddFormulaExpanded: (expanded: boolean) => void;
}

export type AddDescriptionCellProps = Pick<AddCalculationCellCommonProps, 'newCalculationData' | 'setNewCalculationData' | 'renderCell'>;

export type AddUnitCellProps = Pick<AddCalculationCellCommonProps, 'newCalculationData' | 'setNewCalculationData' | 'renderCell'>;

export type AddDisplayResultCellProps = Pick<AddCalculationCellCommonProps, 'newCalculationData' | 'setNewCalculationData' | 'renderCell'>;

export type AddOutputCellProps = Pick<AddCalculationCellCommonProps, 'newCalculationData' | 'setNewCalculationData' | 'renderCell'>;

export interface AddActionsCellProps extends Pick<AddCalculationCellCommonProps, 'renderCell'> {
	handleSaveNewCalculation: () => void;
	handleCancelAddCalculation: () => void;
} 