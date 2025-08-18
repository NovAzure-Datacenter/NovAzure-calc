import { Parameter } from "@/types/types";
import { Calculation } from "@/types/types";

// Re-export Calculation for use in other modules
export type { Calculation };

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Main solution data structure
 */
export interface CreateSolutionData {
	// Selection fields (IDs from MongoDB)
	industry: string;
	technology: string;
	solution: string; // ID or "new" for creation mode
	solution_variant: string; // ID or "new" for creation mode

	// Creation fields (only populated when creating new)
	solution_name: string;
	solution_description: string;
	solution_icon: string;
	solution_variant_name: string;
	solution_variant_description: string;
	solution_variant_icon: string;
	solution_variant_product_badge: boolean;

	// Data arrays
	parameters: Parameter[];
	calculations: Calculation[];
	categories: any[]; // Add your category type here
}

/**
 * Common data props used across multiple components
 */
export interface CommonDataProps {
	clientData: any;
	availableIndustries: any[];
	availableTechnologies: any[];
	availableSolutionTypes: any[];
	availableSolutionVariants: any[];
	newlyCreatedSolutions: any[];
	newlyCreatedVariants: any[];
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
	isLoadingSolutionTypes: boolean;
	isLoadingSolutionVariants: boolean;
}

/**
 * Common selection props
 */
export interface CommonSelectionProps {
	selectedIndustry: string;
	selectedTechnology: string;
	selectedSolutionId: string;
	selectedSolutionVariantId: string;
}

/**
 * Common selection handlers
 */
export interface CommonSelectionHandlers {
	onIndustrySelect: (industryId: string) => void;
	onTechnologySelect: (technologyId: string) => void;
	onSolutionTypeSelect: (solutionTypeId: string) => void;
	onSolutionVariantSelect: (variantId: string) => void;
}

/**
 * Common creation state
 */
export interface CommonCreationState {
	isCreatingNewSolution: boolean;
	isCreatingNewVariant: boolean;
}

/**
 * Common creation handlers
 */
export interface CommonCreationHandlers {
	onCreateNewSolution: () => void;
	onCreateNewVariant: () => void;
	onNoVariantSelect: () => void;
	onAddSolutionVariant: (variant: any) => void;
	onAddNewlyCreatedSolution: (solution: any) => void;
	onAddNewlyCreatedVariant: (variant: any) => void;
}

/**
 * Category data structure
 */
export interface CategoryData {
	name: string;
	description: string;
	color: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
	isValid: boolean;
	errorMessage: string;
}

/**
 * Dialog props
 */
export interface DialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

// ============================================================================
// MAIN COMPONENT PROPS
// ============================================================================

export type CreateSolutionMainProps = Record<string, never>;

/**
 * Step content props - combines common interfaces
 */
export interface StepContentProps
	extends CommonDataProps,
		CommonSelectionProps,
		CommonSelectionHandlers,
		CommonCreationState,
		CommonCreationHandlers {
	currentStep: number;
	formData: CreateSolutionData;
	isLoadingParameters: boolean;
	isLoadingCalculations: boolean;
	isSubmitting: boolean;
	isExistingSolutionLoaded: boolean;
	customParameterCategories: Array<{ name: string; color: string }>;
	customCalculationCategories: Array<{ name: string; color: string }>;
	onFormDataChange: (updates: Partial<CreateSolutionData>) => void;
	onParametersChange: (parameters: Parameter[]) => void;
	onCalculationsChange: (calculations: Calculation[]) => void;
	onSaveAsDraft: () => void;
	onSubmitForReview: () => void;
	setCustomParameterCategories: React.Dispatch<
		React.SetStateAction<Array<{ name: string; color: string }>>
	>;
	setCustomCalculationCategories: React.Dispatch<
		React.SetStateAction<Array<{ name: string; color: string }>>
	>;
	getSelectedIndustryName: () => string;
	getSelectedTechnologyName: () => string;
	getSelectedSolutionType: () => any;
	getSelectedSolutionVariant: () => any;
	onUsedParametersChange?: (usedParameterIds: string[]) => void;
	handleSolutionTypeSelectLocal: (
		solutionTypeId: string,
		solutionName: string,
		solutionDescription: string,
		solutionIcon: string
	) => void;
}

// ============================================================================
// FILTER COMPONENT PROPS
// ============================================================================

/**
 * Filter component props
 */
export interface CreateSolutionFilterProps
	extends CommonDataProps,
		CommonSelectionProps,
		CommonSelectionHandlers,
		CommonCreationState,
		CommonCreationHandlers {
	formData: {
		solution_name: string;
		solution_description: string;
		solution_icon: string;
		solution_variant_name: string;
		solution_variant_description: string;
		solution_variant_icon: string;
		solution_variant_product_badge: boolean;
	};
	onFormDataChange: (updates: any) => void;
	handleSolutionTypeSelectLocal: (
		solutionTypeId: string,
		solutionName: string,
		solutionDescription: string,
		solutionIcon: string
	) => void;
}

/**
 * Step 1 content props
 */
export interface StepContentStep1Props extends CreateSolutionFilterProps {
	openAccordion: string | undefined;
	setOpenAccordion: (value: string | undefined) => void;
	handleCreateNewVariant: () => void;
	handleCreateNewSolution: () => void;
	onAddNewlyCreatedSolution: (solution: any) => void;
	onAddNewlyCreatedVariant: (variant: any) => void;
	selectedSolutionId: string;
	handleSolutionTypeSelectLocal: (
		solutionTypeId: string,
		solutionName: string,
		solutionDescription: string,
		solutionIcon: string
	) => void;
}

/**
 * Create item dialog props - Unified interface for creating solutions or variants
 */
export interface CreateItemDialogProps extends DialogProps {
	formData: {
		solution_name: string;
		solution_description: string;
		solution_icon: string;
		solution_variant_name: string;
		solution_variant_description: string;
		solution_variant_icon: string;
		solution_variant_product_badge: boolean;
	};
	onFormDataChange: (
		data: Partial<{
			solution_name: string;
			solution_description: string;
			solution_icon: string;
			solution_variant_name: string;
			solution_variant_description: string;
			solution_variant_icon: string;
			solution_variant_product_badge: boolean;
		}>
	) => void;
	onCreate: () => void;
	type: "solution" | "variant";
}

// ============================================================================
// SECTION COMPONENT PROPS
// ============================================================================

/**
 * Base section props
 */
export interface BaseSectionProps {
	renderSelectionCard: (
		item: any,
		itemId: string,
		isSelected: boolean,
		onSelect: (id: string) => void,
		showIcon?: boolean,
		cardType?: "solution" | "variant" | "default"
	) => React.JSX.Element;
}

export interface IndustrySectionProps extends BaseSectionProps {
	selectedIndustry: string;
	clientSelectedIndustries: string[];
	otherIndustries: any[];
	availableIndustries: any[];
	isLoadingIndustries: boolean;
	onIndustrySelect: (industryId: string) => void;
	openAccordion: string | undefined;
	setOpenAccordion: (value: string | undefined) => void;
	getSelectedIndustry: () => any;
}

export interface TechnologySectionProps extends BaseSectionProps {
	selectedTechnology: string;
	clientSelectedTechnologies: string[];
	otherTechnologies: any[];
	technologiesForSelectedIndustry: any[];
	canSelectTechnology: boolean;
	isLoadingTechnologies: boolean;
	onTechnologySelect: (technologyId: string) => void;
	getSelectedIndustry: () => any;
	getSelectedTechnology: () => any;
}

export interface SolutionSectionProps extends BaseSectionProps {
	selectedSolutionId: string;
	availableSolutionTypes: any[];
	canSelectSolution: boolean;
	isLoadingSolutionTypes: boolean;
	isCreatingNewSolution: boolean;
	onSolutionTypeSelect: (solutionTypeId: string) => void;
	getSelectedIndustry: () => any;
	getSelectedTechnology: () => any;
	getSelectedSolutionCategory: () => any;
	handleCreateNewSolution: () => void;
	onFormDataChange: (updates: any) => void;
	onAddNewlyCreatedSolution: (solution: any) => void;
	newlyCreatedSolutions: any[];
	handleSolutionTypeSelectLocal: (
		solutionTypeId: string,
		solutionName: string,
		solutionDescription: string,
		solutionIcon: string
	) => void;
}

export interface VariantSectionProps extends BaseSectionProps {
	selectedSolutionVariantId: string;
	selectedSolutionId: string;
	isCreatingNewVariant: boolean;
	formData: {
		solution_name: string;
		solution_description: string;
		solution_icon: string;
		solution_variant_name: string;
		solution_variant_description: string;
		solution_variant_icon: string;
		solution_variant_product_badge: boolean;
	};
	onFormDataChange: (updates: any) => void;
	handleCreateNewVariant: () => void;
	onSolutionVariantSelect: (variantId: string) => void;
	onAddSolutionVariant: (variant: any) => void;
	onAddNewlyCreatedVariant: (variant: any) => void;
	newlyCreatedVariants: any[];
	availableSolutionVariants: any[];
}

// ============================================================================
// CATEGORY MANAGEMENT PROPS
// ============================================================================

/**
 * Base category tabs props
 */
export interface BaseCategoryTabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	allCategories: string[];
	handleRemoveCategory: (category: string) => void;
	setIsAddCategoryDialogOpen: (open: boolean) => void;
	newCategoryData: CategoryData;
	setNewCategoryData: React.Dispatch<React.SetStateAction<CategoryData>>;
	handleAddCategory: () => void;
	isAddCategoryDialogOpen: boolean;
	customCategories: Array<{ name: string; color: string }>;
}

export interface CategoryTabsProps extends BaseCategoryTabsProps {
	handleAddParameter: () => void;
	isAddingParameter: boolean;
	editingParameter: string | null;
	handleCancelAddParameter: () => void;
	parameters: Parameter[];
	setIsPreviewDialogOpen: (open: boolean) => void;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
}

export interface CalculationCategoryTabsProps extends BaseCategoryTabsProps {
	handleAddCalculation: () => void;
	isAddingCalculation: boolean;
	editingCalculation: string | null;
	handleCancelAddCalculation: () => void;
	calculations: Calculation[];
	setIsAddNewParameterDialogOpen: (open: boolean) => void;
	setIsPreviewDialogOpen: (open: boolean) => void;
}

export interface AddCategoryDialogProps extends DialogProps {
	newCategoryData: CategoryData;
	setNewCategoryData: React.Dispatch<React.SetStateAction<CategoryData>>;
	onAddCategory: () => void;
	allCategories: string[];
}

export interface AddCalculationCategoryDialogProps
	extends AddCategoryDialogProps {
	categoryNameError: string;
	onCategoryNameChange: (name: string) => void;
	onDialogClose: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ColumnVisibility {
	parameterName: boolean;
	category: boolean;
	displayType: boolean;
	value: boolean;
	testValue: boolean;
	unit: boolean;
	description: boolean;
	userInterface: boolean;
	output: boolean;
	actions: boolean;
}

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const RESERVED_CATEGORY_NAMES = [
	"industry",
	"technologies",
	"global",
	"technologies",
] as const;

export const HIDDEN_CATEGORIES = [
	"industry",
	"technology",
	"technologies",
	"high level configuration",
	"low level configuration",
	"advanced configuration",
] as const;

export const CALCULATION_RESERVED_CATEGORY_NAMES = ["capex", "opex"] as const;

export const CALCULATION_HIDDEN_CATEGORIES: string[] = [];

// Type aliases
export type Step = "industry" | "technology" | "solution";
export type ReservedCategoryName = (typeof RESERVED_CATEGORY_NAMES)[number];
export type HiddenCategory = (typeof HIDDEN_CATEGORIES)[number];
export type CalculationReservedCategoryName =
	(typeof CALCULATION_RESERVED_CATEGORY_NAMES)[number];

// ============================================================================
// PARAMETER TYPES
// ============================================================================

export interface CreateSolutionParametersProps extends CommonSelectionProps {
	parameters: Parameter[];
	onParametersChange: (parameters: Parameter[]) => void;
	customCategories: Array<{ name: string; color: string }>;
	setCustomCategories: React.Dispatch<
		React.SetStateAction<Array<{ name: string; color: string }>>
	>;
	availableIndustries?: any[];
	availableTechnologies?: any[];
	availableSolutionTypes?: any[];
	isLoadingParameters?: boolean;
	usedParameterIds?: string[];
}

export interface ParameterEditData {
	name: string;
	value: string;
	test_value: string;
	unit: string;
	description: string;
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
}

export interface ConfirmDialogProps extends DialogProps {
	title: string;
	description: string;
	onConfirm: () => void;
	confirmText: string;
}

export interface ConfirmCategoryRemovalDialogProps {
	isConfirmDialogOpen: boolean;
	setIsConfirmDialogOpen: (open: boolean) => void;
	confirmCategory: string | null;
	handleConfirmRemoveCategory: () => void;
	parameters: Parameter[];
}

export interface ConfirmParameterRemovalDialogProps {
	isConfirmDialogOpen: boolean;
	setIsConfirmDialogOpen: (open: boolean) => void;
	confirmParameter: string | null;
	handleConfirmRemoveParameter: () => void;
	parameters: Parameter[];
}

export type ParameterValidationResult = ValidationResult;

export interface TableContentProps {
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: ParameterEditData;
	setEditData: React.Dispatch<React.SetStateAction<ParameterEditData>>;
	handleEditParameter: (parameter: Parameter) => void;
	handleSaveParameter: (parameterId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteParameter: (parameterId: string) => void;
	getLevelColor: (level: string) => string;
	getCategoryColor: (category: string) => string;
	isAddingParameter: boolean;
	newParameterData: ParameterEditData;
	setNewParameterData: React.Dispatch<React.SetStateAction<ParameterEditData>>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	handleAddParameter: () => void;
	customCategories: Array<{ name: string; color: string }>;
	searchQuery: string;
	parameters: Parameter[];
	activeTab: string;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
	usedParameterIds?: string[];
}

export interface ColumnFilterProps {
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
}

export interface ParameterTableHeaderProps {
	columnVisibility: ColumnVisibility;
	calculateColumnWidths: () => Record<string, number>;
}

export interface ParameterTableBodyProps {
	isAddingParameter: boolean;
	newParameterData: ParameterEditData;
	setNewParameterData: React.Dispatch<React.SetStateAction<ParameterEditData>>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	getAllAvailableCategories: () => Array<{ name: string; color: string }>;
	getCategoryBadgeStyleForDropdownWrapper: (
		name: string
	) => React.CSSProperties;
	getUserInterfaceBadgeStyle: (type: string) => React.CSSProperties;
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: ParameterEditData;
	setEditData: React.Dispatch<React.SetStateAction<ParameterEditData>>;
	handleEditParameter: (parameter: Parameter) => void;
	handleSaveParameter: (parameterId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteParameter: (parameterId: string) => void;
	highlightSearchTerm: (text: string, searchTerm: string) => React.ReactNode;
	searchQuery: string;
	getCategoryBadgeStyleWrapper: (name: string) => React.CSSProperties;
	activeTab: string;
	handleAddParameter: () => void;
	getDisplayTypeBadgeStyle: (displayType: string) => React.CSSProperties;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
	expandedRows: Set<string>;
	toggleRowExpansion: (parameterId: string) => void;
	usedParameterIds?: string[];
}

export interface ParameterRowProps {
	parameter: Parameter;
	isEditing: boolean;
	editData: ParameterEditData;
	setEditData: React.Dispatch<React.SetStateAction<ParameterEditData>>;
	handleEditParameter: (parameter: Parameter) => void;
	handleSaveParameter: (parameterId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteParameter: (parameterId: string) => void;
	highlightSearchTerm: (text: string, searchTerm: string) => React.ReactNode;
	searchQuery: string;
	getCategoryBadgeStyleWrapper: (name: string) => React.CSSProperties;
	getCategoryBadgeStyleForDropdownWrapper: (
		name: string
	) => React.CSSProperties;
	getUserInterfaceBadgeStyle: (type: string) => React.CSSProperties;
	getDisplayTypeBadgeStyle: (displayType: string) => React.CSSProperties;
	getAllAvailableCategories: () => Array<{ name: string; color: string }>;
	columnVisibility: ColumnVisibility;
	editingParameter: string | null;
	isAddingParameter: boolean;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
	expandedRows: Set<string>;
	toggleRowExpansion: (parameterId: string) => void;
	usedParameterIds?: string[];
	isUnused?: boolean;
	parameters?: Parameter[];
}

export interface AddParameterRowProps {
	isAddingParameter: boolean;
	newParameterData: ParameterEditData;
	setNewParameterData: React.Dispatch<React.SetStateAction<ParameterEditData>>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	getAllAvailableCategories: () => Array<{ name: string; color: string }>;
	getCategoryBadgeStyleForDropdownWrapper: (
		name: string
	) => React.CSSProperties;
	getUserInterfaceBadgeStyle: (type: string) => React.CSSProperties;
	getDisplayTypeBadgeStyle: (displayType: string) => React.CSSProperties;
	columnVisibility: ColumnVisibility;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
	usedParameterIds?: string[];
	parameters?: Parameter[];
}

export interface EmptyStateProps {
	filteredParameters: Parameter[];
	isAddingParameter: boolean;
}

export interface AddParameterButtonProps {
	isAddingParameter: boolean;
	activeTab: string;
	handleAddParameter: () => void;
	handleCancelAddParameter: () => void;
}

export interface SearchHighlightProps {
	text: string;
	searchTerm: string;
}

// ============================================================================
// CALCULATION TYPES
// ============================================================================

export interface CalculationsConfigurationProps extends CommonSelectionProps {
	calculations: Calculation[];
	onCalculationsChange: (calculations: Calculation[]) => void;
	parameters: any[];
	onParametersChange?: (parameters: any[]) => void;
	customCategories: Array<{ name: string; color: string }>;
	setCustomCategories: React.Dispatch<
		React.SetStateAction<Array<{ name: string; color: string }>>
	>;
	availableIndustries?: any[];
	availableTechnologies?: any[];
	availableSolutionTypes?: any[];
	isLoadingCalculations?: boolean;
}

export interface CalculationEditData {
	name: string;
	formula: string;
	units: string;
	description: string;
	category: string;
	output: boolean;
	display_result: boolean;
}

export interface CalculationsTableContentProps {
	calculations: Calculation[];
	editingCalculation: string | null;
	editData: CalculationEditData;
	setEditData: React.Dispatch<React.SetStateAction<CalculationEditData>>;
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
	isAddingCalculation: boolean;
	newCalculationData: CalculationEditData;
	setNewCalculationData: React.Dispatch<
		React.SetStateAction<CalculationEditData>
	>;
	handleSaveNewCalculation: () => void;
	handleCancelAddCalculation: () => void;
	handleAddCalculation: () => void;
	allCategories: string[];
	customCategories: Array<{ name: string; color: string }>;
}

export type CalculationsTableHeaderProps = {
	calculateColumnWidths: () => Record<string, number>;
};

export interface CalculationsTableBodyProps {
	calculations: Calculation[];
	editingCalculation: string | null;
	editData: CalculationEditData;
	setEditData: React.Dispatch<React.SetStateAction<CalculationEditData>>;
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
	isAddingCalculation: boolean;
	newCalculationData: CalculationEditData;
	setNewCalculationData: React.Dispatch<
		React.SetStateAction<CalculationEditData>
	>;
	handleSaveNewCalculation: () => void;
	handleCancelAddCalculation: () => void;
	handleAddCalculation: () => void;
	allCategories: string[];
	expandedCalculations: Set<string>;
	setExpandedCalculations: React.Dispatch<React.SetStateAction<Set<string>>>;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
}

export interface CalculationRowProps {
	calculation: Calculation;
	isEditing: boolean;
	editData: CalculationEditData;
	setEditData: React.Dispatch<React.SetStateAction<CalculationEditData>>;
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
	allCategories: string[];
	editingCalculation: string | null;
	isFormulaExpanded: boolean;
	toggleFormulaExpanded: (calculationId: string) => void;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
}

export interface AddCalculationRowProps {
	isAddingCalculation: boolean;
	newCalculationData: CalculationEditData;
	setNewCalculationData: React.Dispatch<
		React.SetStateAction<CalculationEditData>
	>;
	handleSaveNewCalculation: () => void;
	handleCancelAddCalculation: () => void;
	insertIntoFormula: (text: string) => void;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	getCategoryColor: (category: string) => string;
	groupedParameters: Record<string, any[]>;
	allCategories: string[];
	isAddFormulaExpanded: boolean;
	setIsAddFormulaExpanded: React.Dispatch<React.SetStateAction<boolean>>;
	renderCell: (
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) => React.ReactElement | null;
}

export interface FormulaEditorProps {
	isEditing: boolean;
	calculation: Calculation;
	editData: CalculationEditData;
	setEditData: React.Dispatch<React.SetStateAction<CalculationEditData>>;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	groupedParameters: Record<string, any[]>;
	insertIntoFormula: (text: string) => void;
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
}

export interface ExpandedFormulaEditorProps {
	title: string;
	formula: string;
	onFormulaChange: (formula: string) => void;
	onCollapse: () => void;
	resetFormula: () => void;
	rewindFormula: () => void;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	groupedParameters: Record<string, any[]>;
	insertIntoFormula: (text: string) => void;
}

export interface FormulaPreviewProps {
	formula: string;
	getColorCodedFormula: (formula: string) => React.ReactNode;
	className?: string;
}

export interface MathematicalOperatorsProps {
	insertIntoFormula: (text: string) => void;
	className?: string;
}

export interface ParametersByCategoryProps {
	groupedParameters: Record<string, any[]>;
	insertIntoFormula: (text: string) => void;
	className?: string;
}

export interface ParameterButtonProps {
	param: any;
	insertIntoFormula: (text: string) => void;
}

export interface AddCalculationButtonProps {
	isAddingCalculation: boolean;
	handleAddCalculation: () => void;
	handleCancelAddCalculation: () => void;
}

// ============================================================================
// CALCULATION CATEGORY TYPES
// ============================================================================

export interface CalculationCategoryData {
	name: string;
	description: string;
	color: string;
}

export interface CalculationCategoryTabsListProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	allCategories: string[];
	handleRemoveCategory: (category: string) => void;
	setIsAddCategoryDialogOpen: (open: boolean) => void;
	customCategories: Array<{ name: string; color: string }>;
	calculations: Calculation[];
}

export interface CalculationCategoryTabProps {
	category: string;
	isActive: boolean;
	isCustomCategory: boolean;
	onRemove: (category: string) => void;
	getCategoryStyle: (categoryName: string) => React.CSSProperties;
	getActiveTabStyle: (categoryName: string) => React.CSSProperties;
}

export interface CalculationCategoryHeaderProps {
	activeTab: string;
	handleAddCalculation: () => void;
	isAddingCalculation: boolean;
	editingCalculation: string | null;
	handleCancelAddCalculation: () => void;
	setIsAddNewParameterDialogOpen: (open: boolean) => void;
	setIsPreviewDialogOpen: (open: boolean) => void;
}

export interface CategoryNameInputProps {
	value: string;
	onChange: (value: string) => void;
	error: string;
	placeholder?: string;
}

export interface CategoryColorSelectorProps {
	selectedColor: string;
	onColorSelect: (color: string) => void;
	availableColors: string[];
}

export type CategoryValidationResult = ValidationResult;

// ============================================================================
// PARAMETER DIALOG TYPES
// ============================================================================

export interface FilterOptionsEditorProps {
	options: string[];
	onOptionsChange: (options: string[]) => void;
	isEditing: boolean;
}

export interface DropdownOptionsEditorProps {
	options: Array<{ key: string; value: string }>;
	onOptionsChange: (options: Array<{ key: string; value: string }>) => void;
	isEditing: boolean;
}

export interface AddParameterDialogProps extends DialogProps {
	newParameterData: ParameterEditData;
	setNewParameterData: React.Dispatch<React.SetStateAction<ParameterEditData>>;
	onSaveParameter: () => void;
	onCancelParameter: () => void;
	getAllAvailableCategories: () => Array<{ name: string; color: string }>;
	getCategoryBadgeStyle: (categoryName: string) => React.CSSProperties;
	parametersCount: number;
}

export interface ParameterFormFieldProps {
	label: string;
	required?: boolean;
	children: React.ReactNode;
}

export interface ParameterNameFieldProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export interface ParameterCategoryFieldProps {
	value: string;
	onChange: (value: string) => void;
	getAllAvailableCategories: () => Array<{ name: string; color: string }>;
	getCategoryBadgeStyle: (categoryName: string) => React.CSSProperties;
}

export interface ParameterDisplayTypeFieldProps {
	value: string;
	onChange: (value: string) => void;
}

export interface ParameterValueFieldProps {
	displayType: string;
	value: string;
	onChange: (value: string) => void;
	dropdownOptions: Array<{ key: string; value: string }>;
	onDropdownOptionsChange: (
		options: Array<{ key: string; value: string }>
	) => void;
	rangeMin: string;
	rangeMax: string;
	onRangeMinChange: (value: string) => void;
	onRangeMaxChange: (value: string) => void;
	userInterfaceType: string;
}

export interface ParameterTestValueFieldProps {
	value: string;
	onChange: (value: string) => void;
}

export interface ParameterUnitFieldProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export interface ParameterDescriptionFieldProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export interface ParameterProvidedByFieldProps {
	value: string;
	onChange: (value: string) => void;
}

export interface ParameterOutputFieldProps {
	value: boolean;
	onChange: (value: boolean) => void;
}

// ============================================================================
// SUBMIT COMPONENT TYPES
// ============================================================================

export interface CreateSolutionSubmitProps {
	formData: {
		solution_name: string;
		solution_description: string;
		solution_variant: string;
		solution_variant_name: string;
		solution_variant_description: string;
		parameters: Parameter[];
		calculations: Calculation[];
	};
	showCustomSolutionType: boolean;
	showCustomSolutionVariant: boolean;
	isSubmitting: boolean;
	onSaveAsDraft: () => void;
	onSubmitForReview: () => void;
	getSelectedIndustryName: () => string;
	getSelectedTechnologyName: () => string;
	getSelectedSolutionType: () => any;
	getSelectedSolutionVariant: () => any;
	isExistingSolutionLoaded?: boolean;
	unusedParameterIds?: string[];
}

export interface ConfigurationItem {
	id: string;
	name: string;
	category: any;
	description: string;
	units?: string;
	type: "parameter" | "calculation";
	// Parameter specific fields
	value?: string;
	test_value?: string;
	user_interface?:
		| "input"
		| "static"
		| "not_viewable"
		| {
				type: "input" | "static" | "not_viewable";
				category: string;
				is_advanced: boolean;
		  };
	// Calculation specific fields
	formula?: string;
	result?: any;
	status?: string;
	output?: boolean;
	level?: number;
}

export interface SolutionSummaryProps {
	formData: {
		solution_name: string;
		solution_description: string;
		solution_variant: string;
		solution_variant_name: string;
		solution_variant_description: string;
	};
	showCustomSolutionType: boolean;
	showCustomSolutionVariant: boolean;
	getSelectedIndustryName: () => string;
	getSelectedTechnologyName: () => string;
	getSelectedSolutionType: () => any;
	getSelectedSolutionVariant: () => any;
}

export interface SummaryCardProps {
	icon: React.ReactNode;
	title: string;
	value: string;
	bgColor: string;
	iconColor: string;
}

export interface AdditionalDetailsProps {
	showCustomSolutionType: boolean;
	showCustomSolutionVariant: boolean;
	formData: {
		solution_name: string;
		solution_variant_name: string;
		solution_variant_description: string;
	};
}

export interface ConfigurationTableProps {
	configurationItems: ConfigurationItem[];
	parametersCount: number;
	calculationsCount: number;
}

export type ConfigurationTableHeaderProps = Record<string, never>;

export interface ConfigurationTableBodyProps {
	configurationItems: ConfigurationItem[];
}

export interface ConfigurationTableRowProps {
	item: ConfigurationItem;
}

export interface ActionCardsProps {
	isSubmitting: boolean;
	isExistingSolutionLoaded?: boolean;
	onSaveAsDraft: () => void;
	onSubmitForReview: () => void;
}

export interface ActionCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	benefits: string[];
	buttonText: string;
	buttonVariant: "outline" | "default";
	onClick: () => void;
	isSubmitting: boolean;
	submittingText: string;
	bgColor: string;
	iconColor: string;
}

export type WarningMessageProps = Record<string, never>;

export interface LoadingSpinnerProps {
	className?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface CalculationsSummaryProps {
	filteredCalculations: Calculation[];
}

export interface LoadingIndicatorProps {
	isLoading: boolean;
}

export interface MockData {
	mockCalculations: Calculation[];
	mockCategories: Array<{ name: string; color: string }>;
}

export interface CalculationEditState {
	editingCalculation: string | null;
	editData: CalculationEditData;
}

export interface CalculationManagementProps {
	calculations: Calculation[];
	onCalculationsChange: (calculations: Calculation[]) => void;
	parameters: any[];
	hasInitialized: boolean;
}

export interface FormulaEvaluationProps {
	formula: string;
	parameters: any[];
	calculations: Calculation[];
}

export interface CalculationMigrationProps {
	calculations: Calculation[];
	onCalculationsChange: (calculations: Calculation[]) => void;
	hasInitialized: boolean;
}

export interface CategoryManagementProps {
	customCategories: Array<{ name: string; color: string }>;
	setCustomCategories?: React.Dispatch<
		React.SetStateAction<Array<{ name: string; color: string }>>
	>;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export interface ParameterGroupingProps {
	parameters: any[];
	calculations: Calculation[];
}

export interface CalculationFilteringProps {
	calculations: Calculation[];
	activeTab: string;
}

export interface ParameterValidationProps {
	parameterData: ParameterEditData;
}

export interface CalculationValidationProps {
	calculationData: CalculationEditData;
}
export type {
	// ============================================================================
	// CORE TYPES
	// ============================================================================
	/**
	 * Main solution data structure
	 */
	Parameter,
};
