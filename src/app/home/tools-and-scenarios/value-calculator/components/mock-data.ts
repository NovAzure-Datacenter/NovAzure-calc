// Type definitions for mock data
interface Industry {
	id: string;
	name: string;
	icon: string;
}

interface Technology {
	id: string;
	name: string;
	icon: string;
}

interface Solution {
	id: string;
	name: string;
	icon: string;
}

interface SolutionVariant {
	id: string;
	name: string;
	description: string;
	cost: string;
	efficiency: string;
}

interface LowLevelConfigItem {
	id: string;
	name: string;
	value: string;
	unit: string;
	description: string;
}

interface AdvancedConfigItem {
	id: string;
	name: string;
	type: "text" | "dropdown" | "checkbox";
	unit?: string;
	placeholder?: string;
	options?: string[];
}

interface AdvancedConfigVariant {
	[variantId: string]: AdvancedConfigItem[];
}

interface AdvancedConfigSolution {
	[solutionId: string]: AdvancedConfigVariant;
}


export const mockIndustries: Industry[] = [
	{ id: "datacenters", name: "Data Centers", icon: "Building2" },
	{ id: "oil-gas", name: "Oil & Gas", icon: "Building2" },
	{ id: "renewable-energy", name: "Renewable Energy", icon: "Building2" },
];

export const mockTechnologies: Record<string, Technology[]> = {
	datacenters: [
		{ id: "advanced-cooling", name: "Advanced Cooling System", icon: "Cpu" },
		{ id: "liquid-cooling", name: "Liquid Cooling Technology", icon: "Cpu" },
		{ id: "air-cooling", name: "Air Cooling Systems", icon: "Cpu" },
	],
	"oil-gas": [
		{ id: "drilling-tech", name: "Advanced Drilling Technology", icon: "Cpu" },
		{ id: "extraction-systems", name: "Extraction Systems", icon: "Cpu" },
		{ id: "refinement-tech", name: "Refinement Technology", icon: "Cpu" },
	],
	"renewable-energy": [
		{ id: "solar-tech", name: "Solar Technology", icon: "Cpu" },
		{ id: "wind-tech", name: "Wind Energy Systems", icon: "Cpu" },
		{ id: "hydro-tech", name: "Hydroelectric Systems", icon: "Cpu" },
	],
};

export const mockSolutions: Record<string, Solution[]> = {
	"advanced-cooling": [
		{ id: "liquid-cooling", name: "Liquid Cooling", icon: "Package" },
		{ id: "air-cooling", name: "Air Cooling", icon: "Package" },
		{ id: "hybrid-cooling", name: "Hybrid Cooling", icon: "Package" },
	],
	"liquid-cooling": [
		{ id: "direct-liquid", name: "Direct Liquid Cooling", icon: "Package" },
		{ id: "immersion-cooling", name: "Immersion Cooling", icon: "Package" },
		{ id: "two-phase", name: "Two-Phase Cooling", icon: "Package" },
	],
	"air-cooling": [
		{ id: "forced-air", name: "Forced Air Cooling", icon: "Package" },
		{ id: "natural-convection", name: "Natural Convection", icon: "Package" },
		{ id: "heat-exchanger", name: "Heat Exchanger Systems", icon: "Package" },
	],
	"drilling-tech": [
		{ id: "horizontal-drilling", name: "Horizontal Drilling", icon: "Package" },
		{ id: "directional-drilling", name: "Directional Drilling", icon: "Package" },
		{ id: "hydraulic-fracturing", name: "Hydraulic Fracturing", icon: "Package" },
	],
	"extraction-systems": [
		{ id: "pump-systems", name: "Pump Systems", icon: "Package" },
		{ id: "compression-systems", name: "Compression Systems", icon: "Package" },
		{ id: "separation-systems", name: "Separation Systems", icon: "Package" },
	],
	"refinement-tech": [
		{ id: "distillation", name: "Distillation Processes", icon: "Package" },
		{ id: "cracking", name: "Cracking Technology", icon: "Package" },
		{ id: "catalytic-reforming", name: "Catalytic Reforming", icon: "Package" },
	],
	"solar-tech": [
		{ id: "photovoltaic", name: "Photovoltaic Systems", icon: "Package" },
		{ id: "concentrated-solar", name: "Concentrated Solar Power", icon: "Package" },
		{ id: "solar-thermal", name: "Solar Thermal Systems", icon: "Package" },
	],
	"wind-tech": [
		{ id: "onshore-wind", name: "Onshore Wind Turbines", icon: "Package" },
		{ id: "offshore-wind", name: "Offshore Wind Farms", icon: "Package" },
		{ id: "small-wind", name: "Small Wind Systems", icon: "Package" },
	],
	"hydro-tech": [
		{ id: "dam-hydro", name: "Dam Hydroelectric", icon: "Package" },
		{ id: "run-of-river", name: "Run-of-River Systems", icon: "Package" },
		{ id: "pumped-storage", name: "Pumped Storage", icon: "Package" },
	],
};

// Mock data for solution variants
export const mockSolutionVariants: Record<string, SolutionVariant[]> = {
	"liquid-cooling": [
		{ id: "variant-1", name: "Variant 1", description: "Traditional liquid cooling with 40% efficiency", cost: "Medium", efficiency: "85%" },
		{ id: "variant-2", name: "Variant 2", description: "Enhanced liquid cooling with 60% efficiency", cost: "High", efficiency: "92%" },
		{ id: "variant-3", name: "Variant 3", description: "Premium liquid cooling with 80% efficiency", cost: "Very High", efficiency: "98%" },
	],
	"air-cooling": [
		{ id: "variant-1", name: "Variant 1", description: "Basic air cooling system", cost: "Low", efficiency: "70%" },
		{ id: "variant-2", name: "Variant 2", description: "Improved air cooling with better airflow", cost: "Medium", efficiency: "78%" },
		{ id: "variant-3", name: "Variant 3", description: "High-performance air cooling system", cost: "High", efficiency: "85%" },
	],
	"hybrid-cooling": [
		{ id: "variant-1", name: "Variant 1", description: "Combined air and liquid cooling", cost: "Medium", efficiency: "80%" },
		{ id: "variant-2", name: "Variant 2", description: "Smart hybrid cooling with AI optimization", cost: "High", efficiency: "88%" },
		{ id: "variant-3", name: "Variant 3", description: "Ultra-efficient hybrid cooling solution", cost: "Very High", efficiency: "95%" },
	],
	"direct-liquid": [
		{ id: "variant-1", name: "Variant 1", description: "Direct liquid cooling for standard workloads", cost: "Medium", efficiency: "88%" },
		{ id: "variant-2", name: "Variant 2", description: "Optimized for high-density computing", cost: "High", efficiency: "94%" },
		{ id: "variant-3", name: "Variant 3", description: "Maximum efficiency direct liquid cooling", cost: "Very High", efficiency: "99%" },
	],
	"immersion-cooling": [
		{ id: "variant-1", name: "Variant 1", description: "Basic immersion cooling system", cost: "High", efficiency: "90%" },
		{ id: "variant-2", name: "Variant 2", description: "Advanced two-phase immersion cooling", cost: "Very High", efficiency: "96%" },
		{ id: "variant-3", name: "Variant 3", description: "Ultra-low temperature immersion cooling", cost: "Premium", efficiency: "99.5%" },
	],
	"two-phase": [
		{ id: "variant-1", name: "Variant 1", description: "Basic two-phase cooling system", cost: "Medium", efficiency: "85%" },
		{ id: "variant-2", name: "Variant 2", description: "Enhanced two-phase cooling", cost: "High", efficiency: "92%" },
		{ id: "variant-3", name: "Variant 3", description: "Ultra-efficient two-phase cooling", cost: "Very High", efficiency: "97%" },
	],
};

// Mock data for low level configuration
export const mockLowLevelConfig: Record<string, LowLevelConfigItem[]> = {
	"air-cooling": [
		{ id: "annualized-pPUE", name: "Annualized pPUE", value: "1.0", unit: "", description: "Power Usage Effectiveness" },
		{ id: "airflow-rate", name: "Airflow Rate", value: "2.5", unit: "m³/s", description: "Cooling air flow rate" },
		{ id: "temperature-delta", name: "Temperature Delta", value: "15.0", unit: "°C", description: "Temperature difference" },
	],
	"liquid-cooling": [
		{ id: "annualized-pPUE", name: "Annualized pPUE", value: "1.2", unit: "", description: "Power Usage Effectiveness" },
		{ id: "flow-rate", name: "Flow Rate", value: "0.8", unit: "L/min", description: "Coolant flow rate" },
		{ id: "temperature-delta", name: "Temperature Delta", value: "8.0", unit: "°C", description: "Temperature difference" },
	],
	"hybrid-cooling": [
		{ id: "annualized-pPUE", name: "Annualized pPUE", value: "1.1", unit: "", description: "Power Usage Effectiveness" },
		{ id: "airflow-rate", name: "Airflow Rate", value: "1.8", unit: "m³/s", description: "Cooling air flow rate" },
		{ id: "flow-rate", name: "Flow Rate", value: "0.5", unit: "L/min", description: "Coolant flow rate" },
	],
	"direct-liquid": [
		{ id: "annualized-pPUE", name: "Annualized pPUE", value: "1.15", unit: "", description: "Power Usage Effectiveness" },
		{ id: "flow-rate", name: "Flow Rate", value: "1.2", unit: "L/min", description: "Coolant flow rate" },
		{ id: "temperature-delta", name: "Temperature Delta", value: "6.0", unit: "°C", description: "Temperature difference" },
	],
	"immersion-cooling": [
		{ id: "annualized-pPUE", name: "Annualized pPUE", value: "1.05", unit: "", description: "Power Usage Effectiveness" },
		{ id: "fluid-volume", name: "Fluid Volume", value: "500.0", unit: "L", description: "Coolant volume" },
		{ id: "temperature-delta", name: "Temperature Delta", value: "4.0", unit: "°C", description: "Temperature difference" },
	],
	"two-phase": [
		{ id: "annualized-pPUE", name: "Annualized pPUE", value: "1.08", unit: "", description: "Power Usage Effectiveness" },
		{ id: "refrigerant-flow", name: "Refrigerant Flow", value: "0.3", unit: "kg/s", description: "Refrigerant flow rate" },
		{ id: "temperature-delta", name: "Temperature Delta", value: "5.0", unit: "°C", description: "Temperature difference" },
	],
};

// Mock data for advanced configuration
export const mockAdvancedConfig: AdvancedConfigSolution = {
	"liquid-cooling": {
		"variant-1": [
			{ id: "inlet-temperature", name: "Inlet Temperature", type: "text", unit: "°C", placeholder: "Enter inlet temperature" },
			{ id: "electricity-price", name: "Electricity Price", type: "text", unit: "$/kWh", placeholder: "Enter electricity price" },
			{ id: "water-price", name: "Water Price", type: "text", unit: "$/L", placeholder: "Enter water price" },
			{ id: "chassis-immersion-tech", name: "Chassis Immersion Technology", type: "dropdown", options: ["Single-Phase", "Two-Phase", "Hybrid"] },
			{ id: "annual-plc-maintenance", name: "Annual PLC Maintenance", type: "text", unit: "% of Capex", placeholder: "Enter maintenance percentage" },
			{ id: "plc-chassis-per-rack", name: "Number of PLC Chassis per Rack", type: "text", unit: "", placeholder: "Enter number of chassis" },
			{ id: "servers-per-rack", name: "Number of Servers per Rack", type: "text", unit: "sq m", placeholder: "Enter number of servers" },
			{ id: "include-it-cost", name: "Include IT Cost in Calculations", type: "checkbox" },
		],
		"variant-2": [
			{ id: "inlet-temperature", name: "Inlet Temperature", type: "text", unit: "°C", placeholder: "Enter inlet temperature" },
			{ id: "electricity-price", name: "Electricity Price", type: "text", unit: "$/kWh", placeholder: "Enter electricity price" },
			{ id: "coolant-price", name: "Coolant Price", type: "text", unit: "$/L", placeholder: "Enter coolant price" },
			{ id: "direct-liquid-tech", name: "Direct Liquid Technology", type: "dropdown", options: ["Cold Plate", "Microchannel", "Advanced"] },
			{ id: "annual-maintenance", name: "Annual Maintenance", type: "text", unit: "% of Capex", placeholder: "Enter maintenance percentage" },
			{ id: "cooling-units-per-rack", name: "Number of Cooling Units per Rack", type: "text", unit: "", placeholder: "Enter number of units" },
			{ id: "servers-per-rack", name: "Number of Servers per Rack", type: "text", unit: "sq m", placeholder: "Enter number of servers" },
			{ id: "include-it-cost", name: "Include IT Cost in Calculations", type: "checkbox" },
		],
		"variant-3": [
			{ id: "inlet-temperature", name: "Inlet Temperature", type: "text", unit: "°C", placeholder: "Enter inlet temperature" },
			{ id: "electricity-price", name: "Electricity Price", type: "text", unit: "$/kWh", placeholder: "Enter electricity price" },
			{ id: "premium-coolant-price", name: "Premium Coolant Price", type: "text", unit: "$/L", placeholder: "Enter coolant price" },
			{ id: "advanced-immersion-tech", name: "Advanced Immersion Technology", type: "dropdown", options: ["Cryogenic", "Nano-Fluid", "Phase-Change"] },
			{ id: "premium-maintenance", name: "Premium Maintenance", type: "text", unit: "% of Capex", placeholder: "Enter maintenance percentage" },
			{ id: "advanced-units-per-rack", name: "Number of Advanced Units per Rack", type: "text", unit: "", placeholder: "Enter number of units" },
			{ id: "servers-per-rack", name: "Number of Servers per Rack", type: "text", unit: "sq m", placeholder: "Enter number of servers" },
			{ id: "include-it-cost", name: "Include IT Cost in Calculations", type: "checkbox" },
		],
	},
};

// Mock data for comparison
interface ComparisonData {
	metric: string;
	airCooling: string;
	liquidCooling: string;
	difference: string;
	percentChange: string;
}

export const comparisonData: ComparisonData[] = [
	{
		metric: "Cooling Equipment Capex",
		airCooling: "5,665,088",
		liquidCooling: "4,532,070",
		difference: "-1,133,018",
		percentChange: "-20.0%",
	},
	{
		metric: "Total Capex",
		airCooling: "7,865,088",
		liquidCooling: "6,732,070",
		difference: "-1,133,018",
		percentChange: "-14.4%",
	},
	{
		metric: "Annual Cooling Opex",
		airCooling: "822,497",
		liquidCooling: "984,365",
		difference: "161,868",
		percentChange: "19.7%",
	},
	{
		metric: "Total Opex Over Lifetime",
		airCooling: "13,987,457",
		liquidCooling: "16,415,481",
		difference: "2,428,024",
		percentChange: "17.4%",
	},
	{
		metric: "TCO Excluding IT",
		airCooling: "19,542,545",
		liquidCooling: "20,837,551",
		difference: "1,295,006",
		percentChange: "6.6%",
	},
];