import type { ReactNode, ReactElement } from "react";
import { ParameterRowProps, ColumnVisibility } from "@/features/solution-builder/types/types";

export interface ParameterCellCommonProps {
  columnVisibility: ColumnVisibility;
  renderCell: (
    isVisible: boolean,
		children: ReactNode,
    columnKey?: string,
    isExpanded?: boolean
	) => ReactElement | null;
  isExpanded: boolean;
}

export type NameCellProps = ParameterCellCommonProps &
  Pick<
    ParameterRowProps,
    | "isEditing"
    | "editData"
    | "setEditData"
    | "highlightSearchTerm"
    | "searchQuery"
    | "isUnused"
    | "parameter"
	> & {
	handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export type CategoryCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
		| "getAllAvailableCategories"
		| "getCategoryBadgeStyleWrapper"
		| "getCategoryBadgeStyleForDropdownWrapper"
	> & {
	isPriority: boolean;
};

export type DisplayTypeCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
		| "getDisplayTypeBadgeStyle"
	> & {
	isPriority: boolean;
};

export type ValueCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
		| "parameters"
		| "handleSaveParameter"
		| "handleCancelEdit"
	>;

export type TestValueCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
	> & {
	isPriority: boolean;
	handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export type UnitCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
	> & {
	isPriority: boolean;
};

export type DescriptionCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
	> & {
	isPriority: boolean;
};

export type InformationCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
	> & {
	isPriority: boolean;
};

export type UserInterfaceCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "highlightSearchTerm"
		| "searchQuery"
		| "parameter"
		| "getUserInterfaceBadgeStyle"
	>;

export type OutputCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "editData"
		| "setEditData"
		| "parameter"
	>;

export type ActionsCellProps = ParameterCellCommonProps &
	Pick<
		ParameterRowProps,
		| "isEditing"
		| "parameter"
		| "handleEditParameter"
		| "handleDeleteParameter"
		| "handleSaveParameter"
		| "handleCancelEdit"
		| "editingParameter"
		| "isAddingParameter"
	> & {
	isSaveDisabled: () => boolean;
	handleSaveNewParameter?: () => void;
	handleCancelAddParameter?: () => void;
};