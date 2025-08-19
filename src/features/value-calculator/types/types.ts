export interface SolutionVariant {
  id: string;
  name: string;
  description?: string;
}

export interface Solution {
  id: string;
  name: string;
  description?: string;
  solutionVariants?: SolutionVariant[];
}

export interface Technology {
  id: string;
  name: string;
  description?: string;
  solutions: Solution[];
}

export interface Industry {
  id: string;
  name: string;
  description?: string;
  technologies: Technology[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
}

export type IndustryData = Record<string, Industry>;

export interface ConfigField {
    id: string;
    label: string;
    type: "number" | "text" | "select";
    value: string | number;
    options?: string[];
    unit?: string;
    required?: boolean;
}

export interface ConfigFieldAPI {
  id: string;
  label: string;
  type: string;
  value?: string;
  unit?: string;
  options?: string[];
  required?: boolean;
  min_value?: number;
  max_value?: number;
}

export interface ProductConfigResponse {
  product_id: string;
  config_fields: ConfigFieldAPI[];
  global_fields_1: ConfigFieldAPI[];
  global_fields_2: ConfigFieldAPI[];
}

export interface AdvancedConfig {
    // Data Centre Configuration - Advanced
    inletTemperature: number;
    electricityPrice: number;
    waterPrice: number;
    waterloop: string;
    requiredElectricalPowerIncrease: number;
    
    // Air Cooling Configuration - Advanced
    coolingAlternative: string;
    defaultAirCoolingTechnology: string;
    airChassisPerRack: number;
    airCoolingCapexCost: number;
    annualAirCoolingMaintenance: number;
    airWUE: number;
    
    // PLC Configuration - Advanced
    chassisTechnology: string;
    plcRackCoolingCapacity: number;
    annualPLCMaintenance: number;
    includePoCCost: string;
    totalPoCCost: number;
    plcChassisPerRack: number;
    
    // IT Configuration - Advanced
    serverRatedMaxPower: number;
    maxChassisPerRackAir: number;
    totalAirPowerPerRack: number;
    includeITCost: string;
    typicalITCostPerServer: number;
    typicalITCostPerServerAlt: number;
    annualITMaintenanceCost: number;
    serverRefreshYears: number;
    
    // Space Configuration
    floorSpacePerAirRack: number;
    floorSpacePerPLCRack: number;
    spaceUnit: string;
}

export interface CalculationResults {
    costSavings: number;
    energyEfficiency: number;
    roi: number;
    paybackPeriod: number;
    carbonReduction: number;
}

// Value Calculator Component Interfaces

/**
 * ValueCalculatorMain component props interface
 */
export type ValueCalculatorMainProps = Record<string, never>;

/**
 * ValueCalculatorConfiguration component props interface
 */
export interface ValueCalculatorConfigurationProps {
	onCalculate?: () => void;
	selectedIndustry: string;
	setSelectedIndustry: (value: string | ((prev: string) => string)) => void;
	selectedTechnology: string;
	setSelectedTechnology: (value: string | ((prev: string) => string)) => void;
	selectedSolution: string;
	setSelectedSolution: React.Dispatch<React.SetStateAction<string>>;
	solutionVariantA: string;
	setSolutionVariantA: (value: string | ((prev: string) => string)) => void;
	solutionVariantB: string;
	setSolutionVariantB: (value: string | ((prev: string) => string)) => void;
	comparisonMode: ComparisonMode;
	setComparisonMode: React.Dispatch<React.SetStateAction<ComparisonMode>>;
	// Data fetching props
	clientSolutions: any[];
	isLoadingSolutions: boolean;
	solutionTypes: any[];
	industries: any[];
	technologies: any[];
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
	fetchedSolutionA: any | null;
	fetchedSolutionB: any | null;
	parameterValues: Record<string, any>;
	setParameterValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	setResultData: React.Dispatch<React.SetStateAction<any>>;
	// Calculation props
	resultData: any;
}

/**
 * ValueCalculatorResults component props interface
 */
export interface ValueCalculatorResultsProps {
	hasCalculated: boolean;
	selectedIndustry: string;
	selectedTechnology: string;
	selectedSolution: string;
	solutionVariantA: string;
	solutionVariantB: string;
	fetchedSolutionA?: any | null;
	fetchedSolutionB?: any | null;
	resultData?: any | null;
	comparisonMode?: "single" | "compare" | null;
	parameterValues: Record<string, any>;
}

/**
 * GlobalConfigCard component props interface
 */
export interface GlobalConfigCardProps {
	comparisonMode: "single" | "compare" | null;
	solutionVariantA: string;
	solutionVariantB: string;
	clientSolutions: any;
	fetchedSolutionA: any | null;
	fetchedSolutionB: any | null;
	parameterValues: any;
	handleParameterValueChange: (parameterId: string, value: any) => void;
}

/**
 * Parameter interface for solution parameters
 */
export interface Parameter {
	id: string;
	name: string;
	description?: string;
	display_type: DisplayType;
	user_interface: {
		type: UserInterfaceType;
	} | string; // Fallback for old format
	dropdown_options?: Array<{
		key?: string;
		value?: string;
	}>;
	range_min?: string;
	range_max?: string;
	unit?: string;
	information?: boolean;
}

/**
 * Solution parameter with comparison data
 */
export interface SharedParameter extends Parameter {
	solutionBParam: Parameter;
}

/**
 * Comparison mode type
 */
export type ComparisonMode = "single" | "compare" | null;

/**
 * User interface type for parameters
 */
export type UserInterfaceType = "input" | "static" | "not_viewable";

/**
 * Display type for parameters
 */
export type DisplayType = "dropdown" | "filter" | "range" | "simple";

/**
 * Color variant for UI elements
 */
export type ColorVariant = "gray" | "blue" | "green";

/**
 * Parameter value change handler type
 */
export type ParameterValueChangeHandler = (parameterId: string, value: any) => void;

/**
 * Solution variant selector props
 */
export interface SolutionVariantSelectorProps {
	value: string;
	onValueChange: (value: string) => void;
	availableSolutionVariants: any[];
	isLoadingSolutions: boolean;
	placeholder: string;
	label?: string;
	color?: ColorVariant;
}

/**
 * Parameter input props
 */
export interface ParameterInputProps {
	parameter: Parameter;
	parameterValues: Record<string, any>;
	handleParameterValueChange: ParameterValueChangeHandler;
	prefix?: string;
}

/**
 * Dropdown input props
 */
export interface DropdownInputProps {
	parameter: Parameter;
	paramId: string;
	parameterValues: Record<string, any>;
	handleParameterValueChange: ParameterValueChangeHandler;
	isEditable: boolean;
}

/**
 * Filter input props
 */
export interface FilterInputProps {
	parameter: Parameter;
	paramId: string;
	parameterValues: Record<string, any>;
	handleParameterValueChange: ParameterValueChangeHandler;
	isEditable: boolean;
}

/**
 * Range input props
 */
export interface RangeInputProps {
	parameter: Parameter;
	paramId: string;
	parameterValues: Record<string, any>;
	handleParameterValueChange: ParameterValueChangeHandler;
	isEditable: boolean;
	formatRangeValue: (value: string, unit?: string) => string;
	convertPercentageToDecimal: (value: string, unit?: string) => string;
	convertDecimalToPercentage: (value: string, unit?: string) => string;
}

/**
 * Simple input props
 */
export interface SimpleInputProps {
	parameter: Parameter;
	paramId: string;
	parameterValues: Record<string, any>;
	handleParameterValueChange: ParameterValueChangeHandler;
	isEditable: boolean;
}

/**
 * Solution unique parameters props
 */
export interface SolutionUniqueParametersProps {
	title: string;
	color: ColorVariant;
	parameters: Parameter[];
	parameterValues: Record<string, any>;
	handleParameterValueChange: ParameterValueChangeHandler;
	prefix: string;
}

/**
 * Configuration summary props
 */
export interface ConfigurationSummaryProps {
	comparisonMode?: ComparisonMode;
	fetchedSolutionA?: any | null;
	fetchedSolutionB?: any | null;
	industryName: string;
	technologyName: string;
	solutionName?: string;
	isLoadingNames: boolean;
}

/**
 * Results table props
 */
export interface 	ResultsTableProps {
	comparisonMode?: ComparisonMode;
	comparisonRows: any[];
	fetchedSolutionA?: any | null;
	fetchedSolutionB?: any | null;
	formatCurrency: (value: number) => string;
	getDifferenceColor: (difference: number) => string;
	getPercentChangeColor: (percentChange: string) => string;
	formatPercentage: (percentChange: string) => string;
	resultData: any;
}

/**
 * Visual comparison props
 */
export interface VisualComparisonProps {
	resultData?: any | null;
	fetchedSolutionA?: any | null;
	fetchedSolutionB?: any | null;
}

/**
 * Comparison graph props
 */
export interface ComparisonGraphProps {
	resultData: any;
	solutionAName: string;
	solutionBName: string;
}

/**
 * Tab content props
 */
export interface TabContentProps {
	currentTab: string;
	hasCalculated: boolean;
	comparisonMode: ComparisonMode;
	// Configuration props
	selectedIndustry: string;
	setSelectedIndustry: (value: string | ((prev: string) => string)) => void;
	selectedTechnology: string;
	setSelectedTechnology: (value: string | ((prev: string) => string)) => void;
	selectedSolution: string;
	setSelectedSolution: React.Dispatch<React.SetStateAction<string>>;
	solutionVariantA: string;
	setSolutionVariantA: (value: string | ((prev: string) => string)) => void;
	solutionVariantB: string;
	setSolutionVariantB: (value: string | ((prev: string) => string)) => void;
	dataCenterType: string;
	setDataCenterType: React.Dispatch<React.SetStateAction<string>>;
	projectLocation: string;
	setProjectLocation: React.Dispatch<React.SetStateAction<string>>;
	utilisationPercentage: string;
	setUtilisationPercentage: React.Dispatch<React.SetStateAction<string>>;
	dataHallCapacity: string;
	setDataHallCapacity: React.Dispatch<React.SetStateAction<string>>;
	plannedYears: string;
	setPlannedYears: React.Dispatch<React.SetStateAction<string>>;
	firstYearOperation: string;
	setFirstYearOperation: React.Dispatch<React.SetStateAction<string>>;
	setComparisonMode: React.Dispatch<React.SetStateAction<ComparisonMode>>;
	// Data fetching props
	clientSolutions: any[];
	isLoadingSolutions: boolean;
	solutionTypes: any[];
	isLoadingSolutionTypes: boolean;
	industries: any[];
	technologies: any[];
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
	clientData: any;
	fetchedSolutionA: any | null;
	isLoadingSolutionA: boolean;
	fetchedSolutionB: any | null;
	isLoadingSolutionB: boolean;
	parameterValues: Record<string, any>;
	setParameterValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
	setResultData: React.Dispatch<React.SetStateAction<any>>;
	// Calculation props
	resultData: any;
	onCalculate: () => void;
}

/**
 * Tab navigation props
 */
export interface TabNavigationProps {
	hasCalculated: boolean;
	comparisonMode: ComparisonMode;
}