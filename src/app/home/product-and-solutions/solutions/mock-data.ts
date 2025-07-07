import { Droplets, Wind, Thermometer } from "lucide-react";

export interface Product {
	id: string;
	name: string;
	description: string;
	model: string;
	category: string;
	efficiency: string;
	specifications: {
		powerRating: string;
		coolingCapacity: string;
		dimensions: string;
		weight: string;
		operatingTemperature: string;
		certifications: string;
	};
	features: string[];
	status: "pending" | "verified" | "active";
	parameterCount: number;
	calculationOverview: string;
}

export interface Solution {
	id: string;
	name: string;
	description: string;
	category: string;
	logo: React.ComponentType<{ className?: string }>;
	products: Product[];
	status: "pending" | "verified" | "active";
	parameterCount: number;
	calculationOverview: string;
}

export interface SolutionType {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	variants: SolutionVariant[];
}

export interface SolutionVariant {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}

export interface Parameter {
	id: string;
	level: string;
	name: string;
	defaultValue: number;
	overrideValue: number | null;
	units: string;
	description: string;
	category: "performance" | "cost" | "environmental" | "operational";
}

export interface Calculation {
	id: string;
	name: string;
	formula: string;
	result: number | string;
	units: string;
	description: string;
	status: "valid" | "error" | "pending";
	category: "financial" | "performance" | "efficiency" | "operational";
}

// Default calculations for solution configuration
export const defaultCalculations: Calculation[] = [
	{
		id: "total-capex",
		name: "Total CAPEX",
		formula: "equipment_cost + installation_cost + commissioning_cost",
		result: 140000.00,
		units: "$",
		description: "Total Capital Expenditure for the system",
		status: "valid",
		category: "financial",
	},
	{
		id: "annual-opex",
		name: "Annual OPEX",
		formula: "annual_energy_cost + annual_maintenance_cost + annual_labor_cost",
		result: 142000.00,
		units: "$/year",
		description: "Annual Operating Expenditure",
		status: "valid",
		category: "financial",
	},
	{
		id: "five-year-tco",
		name: "5-Year TCO",
		formula: "total_capex + (annual_opex * 5)",
		result: 850000.00,
		units: "$",
		description: "Total Cost of Ownership over 5 years",
		status: "valid",
		category: "financial",
	},
	{
		id: "payback-period",
		name: "Payback Period",
		formula: "total_capex / annual_savings",
		result: 1.87,
		units: "years",
		description: "Time to recover initial investment",
		status: "valid",
		category: "financial",
	},
	{
		id: "overall-efficiency",
		name: "Overall Efficiency",
		formula: "cooling_load / power_consumption * 100",
		result: "Error",
		units: "%",
		description: "Overall system efficiency percentage",
		status: "error",
		category: "efficiency",
	},
	{
		id: "capacity-utilization",
		name: "Capacity Utilization",
		formula: "cooling_load / unit_capacity * 100",
		result: "Error",
		units: "%",
		description: "How much of rated capacity is being used",
		status: "error",
		category: "performance",
	},
	{
		id: "throughput-rate",
		name: "Throughput Rate",
		formula: "cooling_load / operating_hours",
		result: "Error",
		units: "units/hr",
		description: "Rate of processing or production",
		status: "error",
		category: "operational",
	},
	{
		id: "availability-factor",
		name: "Availability Factor",
		formula: "operating_hours / 8760 * 100",
		result: "Error",
		units: "%",
		description: "System availability percentage",
		status: "error",
		category: "operational",
	},
	{
		id: "power-density",
		name: "Power Density",
		formula: "power_consumption / facility_size",
		result: "Error",
		units: "kW/m²",
		description: "Power consumption per unit area",
		status: "error",
		category: "performance",
	},
	{
		id: "cooling-efficiency",
		name: "Cooling Efficiency",
		formula: "cooling_load / power_consumption",
		result: "Error",
		units: "kW/kW",
		description: "Cooling delivered per unit power consumed",
		status: "error",
		category: "efficiency",
	},
];

// Default parameters for solution configuration
export const defaultParameters: Parameter[] = [
	// L1 - Facility Level Parameters
	{
		id: "facility-size",
		level: "L1",
		name: "Facility Size",
		defaultValue: 1000,
		overrideValue: null,
		units: "m²",
		description: "Total facility floor area",
		category: "operational",
	},
	{
		id: "operating-hours",
		level: "L1",
		name: "Operating Hours",
		defaultValue: 24,
		overrideValue: null,
		units: "hours/day",
		description: "Daily operational hours",
		category: "operational",
	},
	{
		id: "equipment-cost",
		level: "L1",
		name: "Equipment Cost",
		defaultValue: 100000,
		overrideValue: null,
		units: "$",
		description: "Initial cost of equipment and hardware",
		category: "cost",
	},
	{
		id: "installation-cost",
		level: "L1",
		name: "Installation Cost",
		defaultValue: 25000,
		overrideValue: null,
		units: "$",
		description: "Cost of installation and setup",
		category: "cost",
	},
	{
		id: "commissioning-cost",
		level: "L1",
		name: "Commissioning Cost",
		defaultValue: 15000,
		overrideValue: null,
		units: "$",
		description: "Cost of testing and commissioning",
		category: "cost",
	},
	{
		id: "annual-energy-cost",
		level: "L1",
		name: "Annual Energy Cost",
		defaultValue: 50000,
		overrideValue: null,
		units: "$/year",
		description: "Annual electricity and energy costs",
		category: "cost",
	},
	{
		id: "annual-maintenance-cost",
		level: "L1",
		name: "Annual Maintenance Cost",
		defaultValue: 12000,
		overrideValue: null,
		units: "$/year",
		description: "Annual maintenance and servicing costs",
		category: "cost",
	},
	{
		id: "annual-labor-cost",
		level: "L1",
		name: "Annual Labor Cost",
		defaultValue: 80000,
		overrideValue: null,
		units: "$/year",
		description: "Annual operational labor costs",
		category: "cost",
	},
	{
		id: "annual-savings",
		level: "L1",
		name: "Annual Savings",
		defaultValue: 75000,
		overrideValue: null,
		units: "$/year",
		description: "Annual cost savings from the system",
		category: "cost",
	},

	// L2 - System Level Parameters
	{
		id: "cooling-load",
		level: "L2",
		name: "Cooling Load",
		defaultValue: 500,
		overrideValue: null,
		units: "kW",
		description: "Total heat load to be removed",
		category: "performance",
	},
	{
		id: "temperature-setpoint",
		level: "L2",
		name: "Temperature Setpoint",
		defaultValue: 22,
		overrideValue: null,
		units: "°C",
		description: "Target temperature for cooling system",
		category: "performance",
	},
	{
		id: "humidity-setpoint",
		level: "L2",
		name: "Humidity Setpoint",
		defaultValue: 45,
		overrideValue: null,
		units: "%RH",
		description: "Target relative humidity",
		category: "performance",
	},

	// L3 - Component Level Parameters
	{
		id: "air-flow-rate",
		level: "L3",
		name: "Air Flow Rate",
		defaultValue: 1200,
		overrideValue: null,
		units: "m³/min",
		description: "Required air circulation rate",
		category: "performance",
	},
	{
		id: "supply-air-temperature",
		level: "L3",
		name: "Supply Air Temperature",
		defaultValue: 18,
		overrideValue: null,
		units: "°C",
		description: "Temperature of air supplied to space",
		category: "performance",
	},
	{
		id: "delta-t",
		level: "L3",
		name: "Delta T",
		defaultValue: 8,
		overrideValue: null,
		units: "K",
		description: "Temperature difference between supply and return air",
		category: "performance",
	},

	// L4 - Unit Level Parameters
	{
		id: "unit-capacity",
		level: "L4",
		name: "Unit Capacity",
		defaultValue: 25,
		overrideValue: null,
		units: "kW",
		description: "Cooling capacity per unit",
		category: "performance",
	},
	{
		id: "number-of-units",
		level: "L4",
		name: "Number of Units",
		defaultValue: 20,
		overrideValue: null,
		units: "units",
		description: "Total number of cooling units",
		category: "operational",
	},
	{
		id: "power-consumption",
		level: "L4",
		name: "Power Consumption",
		defaultValue: 8,
		overrideValue: null,
		units: "kW",
		description: "Electrical power consumption per unit",
		category: "performance",
	},
	{
		id: "number-of-servers",
		level: "L4",
		name: "Number of Servers",
		defaultValue: 1000,
		overrideValue: null,
		units: "servers",
		description: "Total number of servers",
		category: "operational",
	},
	{
		id: "server-power-consumption",
		level: "L4",
		name: "Server Power Consumption",
		defaultValue: 1,
		overrideValue: null,
		units: "kW",
		description: "Power consumption per server",
		category: "performance",
	},
	{
		id: "server-cooling-load",
		level: "L4",
		name: "Server Cooling Load",
		defaultValue: 1,
		overrideValue: null,
		units: "kW",
		description: "Cooling load per server",
		category: "performance",
	},
];

// Mock data for solution types and variants
export const solutionTypes: SolutionType[] = [
	{
		id: "air-cooling",
		name: "Air Cooling",
		description:
			"Traditional air-based cooling solutions for data center environments",
		icon: Wind,
		variants: [
			{
				id: "crac-units",
				name: "CRAC Units",
				description:
					"Computer Room Air Conditioning units for precision cooling",
				icon: Thermometer,
			},
			{
				id: "crah-units",
				name: "CRAH Units",
				description:
					"Computer Room Air Handler units for efficient air management",
				icon: Wind,
			},
			{
				id: "in-row-cooling",
				name: "In-Row Cooling",
				description: "Cooling systems positioned between server racks",
				icon: Thermometer,
			},
			{
				id: "free-cooling",
				name: "Free Cooling",
				description: "Energy-efficient cooling using ambient air temperature",
				icon: Wind,
			},
		],
	},
	{
		id: "liquid-cooling",
		name: "Liquid Cooling",
		description:
			"Advanced liquid-based cooling solutions for high-density computing",
		icon: Droplets,
		variants: [
			{
				id: "immersion-cooling",
				name: "Immersion Cooling",
				description: "Direct immersion of hardware in dielectric fluid",
				icon: Droplets,
			},
			{
				id: "direct-to-chip",
				name: "Direct-to-Chip",
				description: "Precision cooling directly to processor components",
				icon: Thermometer,
			},
			{
				id: "rear-door-heat-exchangers",
				name: "Rear Door Heat Exchangers",
				description: "Heat exchangers mounted on rack rear doors",
				icon: Thermometer,
			},
			{
				id: "liquid-cooled-racks",
				name: "Liquid Cooled Racks",
				description: "Complete rack systems with integrated liquid cooling",
				icon: Droplets,
			},
		],
	},
	{
		id: "hybrid-cooling",
		name: "Hybrid Cooling",
		description:
			"Combined air and liquid cooling systems for optimal efficiency",
		icon: Thermometer,
		variants: [
			{
				id: "hybrid-air-liquid",
				name: "Hybrid Air-Liquid",
				description: "Combined air and liquid cooling in single system",
				icon: Thermometer,
			},
			{
				id: "adaptive-cooling",
				name: "Adaptive Cooling",
				description: "Intelligent systems that switch between cooling methods",
				icon: Wind,
			},
			{
				id: "thermal-management",
				name: "Thermal Management",
				description: "Comprehensive thermal management and monitoring",
				icon: Thermometer,
			},
			{
				id: "orchestrated-cooling",
				name: "Orchestrated Cooling",
				description: "AI-driven cooling orchestration systems",
				icon: Thermometer,
			},
		],
	},
];

export const mockSolutions: Solution[] = [
	{
		id: "chassis-immersion-cooling",
		name: "Chassis Immersion Cooling",
		description:
			"Advanced single-phase immersion cooling solution for high-density data center applications with superior thermal performance and energy efficiency.",
		category: "Liquid Cooling",
		logo: Droplets,
		status: "verified",
		parameterCount: 24,
		calculationOverview:
			"Thermal resistance, heat transfer coefficient, flow rate optimization",
		products: [
			{
				id: "ku-l2-immersion",
				name: "KU:L2 Immersion System",
				description:
					"High-performance single-phase immersion cooling system designed for 2U server configurations with intelligent thermal management.",
				model: "KU:L2-IS-2000",
				category: "Immersion Cooling",
				efficiency: "PUE 1.02",
				specifications: {
					powerRating: "2kW per chassis",
					coolingCapacity: "2.5kW thermal",
					dimensions: "482x89x800mm",
					weight: "45kg",
					operatingTemperature: "15-35°C",
					certifications: "UL, CE, RoHS",
				},
				features: [
					"Single-phase dielectric fluid",
					"Intelligent thermal monitoring",
					"Automatic leak detection",
					"Modular design for scalability",
					"Remote management interface",
					"Energy-efficient pump system",
					"Silent operation",
					"Easy maintenance access",
				],
				status: "verified",
				parameterCount: 18,
				calculationOverview:
					"Heat transfer efficiency, fluid dynamics, thermal resistance mapping",
			},
			{
				id: "ku-l4-immersion",
				name: "KU:L4 Immersion System",
				description:
					"Advanced 4U immersion cooling solution for high-density computing with enhanced thermal performance and modular architecture.",
				model: "KU:L4-IS-4000",
				category: "Immersion Cooling",
				efficiency: "PUE 1.015",
				specifications: {
					powerRating: "4kW per chassis",
					coolingCapacity: "5kW thermal",
					dimensions: "482x178x800mm",
					weight: "78kg",
					operatingTemperature: "15-35°C",
					certifications: "UL, CE, RoHS, IEC 60950",
				},
				features: [
					"Enhanced thermal conductivity",
					"Multi-zone temperature control",
					"Advanced fluid management",
					"Predictive maintenance alerts",
					"Scalable rack integration",
					"Energy optimization algorithms",
					"Comprehensive monitoring suite",
					"Quick deployment capability",
				],
				status: "verified",
				parameterCount: 22,
				calculationOverview:
					"Multi-zone thermal analysis, fluid flow optimization, heat dissipation modeling",
			},
		],
	},
	{
		id: "air-cooling-systems",
		name: "Air Cooling Systems",
		description:
			"Intelligent air-based cooling solutions for traditional data center environments with advanced airflow management and energy optimization.",
		category: "Air Cooling",
		logo: Wind,
		status: "active",
		parameterCount: 19,
		calculationOverview:
			"Airflow dynamics, temperature distribution, energy consumption analysis",
		products: [
			{
				id: "airflow-pro-hvac",
				name: "AirFlow Pro HVAC",
				description:
					"High-efficiency air conditioning system with intelligent airflow management and energy optimization for data center applications.",
				model: "AFP-HVAC-5000",
				category: "Air Conditioning",
				efficiency: "PUE 1.08",
				specifications: {
					powerRating: "5kW",
					coolingCapacity: "15kW",
					dimensions: "1200x800x2000mm",
					weight: "320kg",
					operatingTemperature: "10-45°C",
					certifications: "AHRI, UL, CE",
				},
				features: [
					"Variable speed compressors",
					"Intelligent airflow control",
					"Energy recovery systems",
					"Remote monitoring capability",
					"Predictive maintenance",
					"Multi-zone temperature control",
					"Humidity management",
					"Eco-friendly refrigerants",
				],
				status: "active",
				parameterCount: 16,
				calculationOverview:
					"Airflow optimization, temperature gradient analysis, energy efficiency modeling",
			},
			{
				id: "free-cooling-eco",
				name: "Free Cooling ECO",
				description:
					"Energy-efficient free cooling system that leverages ambient air temperature for data center cooling with minimal energy consumption.",
				model: "FCE-ECO-3000",
				category: "Free Cooling",
				efficiency: "PUE 1.03",
				specifications: {
					powerRating: "3kW",
					coolingCapacity: "12kW",
					dimensions: "1000x600x1800mm",
					weight: "280kg",
					operatingTemperature: "-10-35°C",
					certifications: "UL, CE, Energy Star",
				},
				features: [
					"Ambient air utilization",
					"Intelligent temperature control",
					"Energy-efficient operation",
					"Automatic mode switching",
					"Advanced filtration systems",
					"Real-time efficiency monitoring",
					"Weather-responsive operation",
					"Low maintenance design",
				],
				status: "active",
				parameterCount: 14,
				calculationOverview:
					"Ambient temperature analysis, energy savings calculation, operational efficiency metrics",
			},
		],
	},
	{
		id: "thermal-management-suite",
		name: "Thermal Management Suite",
		description:
			"Comprehensive thermal management solution combining liquid and air cooling technologies with intelligent orchestration for optimal performance.",
		category: "Hybrid Cooling",
		logo: Thermometer,
		status: "pending",
		parameterCount: 31,
		calculationOverview:
			"Hybrid cooling optimization, thermal load balancing, energy efficiency modeling",
		products: [
			{
				id: "thermal-orchestrator-pro",
				name: "Thermal Orchestrator Pro",
				description:
					"Advanced thermal management system that intelligently coordinates liquid and air cooling for maximum efficiency and reliability.",
				model: "TOP-HYBRID-6000",
				category: "Hybrid Cooling",
				efficiency: "PUE 1.025",
				specifications: {
					powerRating: "6kW",
					coolingCapacity: "20kW",
					dimensions: "1500x1000x2200mm",
					weight: "450kg",
					operatingTemperature: "5-40°C",
					certifications: "UL, CE, ISO 9001",
				},
				features: [
					"Intelligent load balancing",
					"Dynamic cooling orchestration",
					"Real-time thermal mapping",
					"Predictive analytics",
					"Energy optimization algorithms",
					"Fault-tolerant operation",
					"Comprehensive monitoring",
					"Automated maintenance scheduling",
				],
				status: "pending",
				parameterCount: 25,
				calculationOverview:
					"Thermal load distribution, cooling efficiency optimization, energy consumption analysis",
			},
			{
				id: "eco-thermal-controller",
				name: "Eco Thermal Controller",
				description:
					"Smart thermal controller that optimizes cooling strategies based on workload, ambient conditions, and energy costs.",
				model: "ETC-SMART-4000",
				category: "Thermal Control",
				efficiency: "PUE 1.035",
				specifications: {
					powerRating: "4kW",
					coolingCapacity: "16kW",
					dimensions: "1200x800x2000mm",
					weight: "380kg",
					operatingTemperature: "10-45°C",
					certifications: "UL, CE, IEC 61508",
				},
				features: [
					"AI-powered optimization",
					"Workload-aware cooling",
					"Cost-based decision making",
					"Real-time efficiency tracking",
					"Predictive maintenance",
					"Multi-zone coordination",
					"Energy cost optimization",
					"Comprehensive reporting",
				],
				status: "pending",
				parameterCount: 28,
				calculationOverview:
					"AI-driven optimization, cost-benefit analysis, thermal efficiency modeling",
			},
		],
	},
];
