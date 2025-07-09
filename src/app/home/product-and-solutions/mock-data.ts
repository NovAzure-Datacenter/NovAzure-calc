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
	status: "pending" | "verified" | "draft";
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
	status: "pending" | "verified" | "draft";
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
	{
		id: "renewable-energy-systems",
		name: "Renewable Energy Systems",
		description:
			"Solar, wind, and hybrid renewable energy solutions for sustainable power generation",
		icon: Wind,
		variants: [
			{
				id: "solar-panel-systems",
				name: "Solar Panel Systems",
				description: "Photovoltaic systems for solar energy generation",
				icon: Wind,
			},
			{
				id: "wind-turbine-systems",
				name: "Wind Turbine Systems",
				description: "Wind energy generation systems for various scales",
				icon: Wind,
			},
			{
				id: "hybrid-renewable",
				name: "Hybrid Renewable",
				description: "Combined solar and wind energy systems",
				icon: Wind,
			},
			{
				id: "energy-storage-systems",
				name: "Energy Storage Systems",
				description: "Battery storage solutions for renewable energy",
				icon: Wind,
			},
		],
	},
	{
		id: "smart-grid-solutions",
		name: "Smart Grid Solutions",
		description:
			"Intelligent grid management and energy distribution systems",
		icon: Wind,
		variants: [
			{
				id: "grid-monitoring",
				name: "Grid Monitoring",
				description: "Real-time grid performance monitoring systems",
				icon: Wind,
			},
			{
				id: "demand-response",
				name: "Demand Response",
				description: "Intelligent demand-side energy management",
				icon: Wind,
			},
			{
				id: "microgrid-systems",
				name: "Microgrid Systems",
				description: "Localized energy generation and distribution",
				icon: Wind,
			},
			{
				id: "grid-optimization",
				name: "Grid Optimization",
				description: "AI-powered grid efficiency optimization",
				icon: Wind,
			},
		],
	},
	{
		id: "electric-vehicle-infrastructure",
		name: "Electric Vehicle Infrastructure",
		description:
			"Charging stations and infrastructure for electric vehicles",
		icon: Wind,
		variants: [
			{
				id: "fast-charging-stations",
				name: "Fast Charging Stations",
				description: "High-speed EV charging infrastructure",
				icon: Wind,
			},
			{
				id: "smart-charging-networks",
				name: "Smart Charging Networks",
				description: "Intelligent EV charging network management",
				icon: Wind,
			},
			{
				id: "battery-swapping-stations",
				name: "Battery Swapping Stations",
				description: "Quick battery replacement systems for EVs",
				icon: Wind,
			},
			{
				id: "wireless-charging",
				name: "Wireless Charging",
				description: "Inductive charging systems for electric vehicles",
				icon: Wind,
			},
		],
	},
	{
		id: "transportation-optimization",
		name: "Transportation Optimization",
		description:
			"Intelligent transportation systems and fleet management solutions",
		icon: Wind,
		variants: [
			{
				id: "fleet-management",
				name: "Fleet Management",
				description: "Comprehensive fleet tracking and optimization",
				icon: Wind,
			},
			{
				id: "route-optimization",
				name: "Route Optimization",
				description: "AI-powered route planning and optimization",
				icon: Wind,
			},
			{
				id: "fuel-efficiency-systems",
				name: "Fuel Efficiency Systems",
				description: "Systems to optimize fuel consumption and emissions",
				icon: Wind,
			},
			{
				id: "autonomous-vehicle-systems",
				name: "Autonomous Vehicle Systems",
				description: "Self-driving technology and infrastructure",
				icon: Wind,
			},
		],
	},
	{
		id: "waste-heat-recovery",
		name: "Waste Heat Recovery",
		description:
			"Systems that capture and reuse waste heat from industrial processes",
		icon: Thermometer,
		variants: [
			{
				id: "heat-exchanger-systems",
				name: "Heat Exchanger Systems",
				description: "Efficient heat transfer and recovery systems",
				icon: Thermometer,
			},
			{
				id: "thermal-energy-storage",
				name: "Thermal Energy Storage",
				description: "Systems to store and reuse thermal energy",
				icon: Thermometer,
			},
			{
				id: "cogeneration-systems",
				name: "Cogeneration Systems",
				description: "Combined heat and power generation systems",
				icon: Thermometer,
			},
			{
				id: "industrial-heat-pumps",
				name: "Industrial Heat Pumps",
				description: "Heat pump systems for industrial applications",
				icon: Thermometer,
			},
		],
	},
	{
		id: "water-management-systems",
		name: "Water Management Systems",
		description:
			"Smart water treatment and recycling systems for industrial processes",
		icon: Droplets,
		variants: [
			{
				id: "water-treatment-systems",
				name: "Water Treatment Systems",
				description: "Advanced water purification and treatment",
				icon: Droplets,
			},
			{
				id: "water-recycling-systems",
				name: "Water Recycling Systems",
				description: "Closed-loop water reuse and recycling",
				icon: Droplets,
			},
			{
				id: "smart-irrigation",
				name: "Smart Irrigation",
				description: "Intelligent agricultural irrigation systems",
				icon: Droplets,
			},
			{
				id: "leak-detection-systems",
				name: "Leak Detection Systems",
				description: "Advanced water leak detection and prevention",
				icon: Droplets,
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
		status: "verified",
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
				status: "verified",
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
				status: "verified",
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
	{
		id: "hybrid-cooling-prototype",
		name: "Hybrid Cooling Prototype",
		description:
			"Experimental hybrid cooling solution combining liquid and air cooling with advanced AI-driven optimization for next-generation data centers.",
		category: "Hybrid Cooling",
		logo: Thermometer,
		status: "draft",
		parameterCount: 28,
		calculationOverview:
			"Prototype testing, performance validation, efficiency optimization",
		products: [
			{
				id: "hybrid-prototype-alpha",
				name: "Hybrid Prototype Alpha",
				description:
					"First-generation hybrid cooling prototype with experimental liquid-air cooling integration and AI optimization.",
				model: "HPA-PROTO-1000",
				category: "Hybrid Cooling",
				efficiency: "PUE 1.05",
				specifications: {
					powerRating: "1kW",
					coolingCapacity: "3kW",
					dimensions: "800x600x1500mm",
					weight: "200kg",
					operatingTemperature: "15-40°C",
					certifications: "Prototype - No certification",
				},
				features: [
					"Experimental liquid-air integration",
					"AI-driven optimization",
					"Real-time performance monitoring",
					"Adaptive cooling strategies",
					"Prototype testing mode",
					"Data collection capabilities",
					"Flexible configuration options",
					"Research-grade sensors",
				],
				status: "draft",
				parameterCount: 20,
				calculationOverview:
					"Prototype performance analysis, experimental data collection, optimization testing",
			},
			{
				id: "ai-cooling-controller-beta",
				name: "AI Cooling Controller Beta",
				description:
					"Beta version of AI-powered cooling controller with advanced machine learning algorithms for thermal optimization.",
				model: "AIC-BETA-2000",
				category: "AI Control",
				efficiency: "PUE 1.06",
				specifications: {
					powerRating: "2kW",
					coolingCapacity: "6kW",
					dimensions: "1000x700x1800mm",
					weight: "250kg",
					operatingTemperature: "10-45°C",
					certifications: "Beta - Limited testing",
				},
				features: [
					"Machine learning algorithms",
					"Predictive thermal modeling",
					"Dynamic optimization",
					"Real-time learning",
					"Performance analytics",
					"Experimental features",
					"Beta testing mode",
					"Advanced diagnostics",
				],
				status: "draft",
				parameterCount: 24,
				calculationOverview:
					"AI model training, performance prediction, experimental optimization",
			},
		],
	},
	{
		id: "liquid-cooling-draft",
		name: "Advanced Liquid Cooling Draft",
		description:
			"Draft version of next-generation liquid cooling system with enhanced thermal conductivity and energy efficiency features.",
		category: "Liquid Cooling",
		logo: Droplets,
		status: "draft",
		parameterCount: 22,
		calculationOverview:
			"Draft calculations, thermal modeling, efficiency projections",
		products: [
			{
				id: "liquid-draft-system",
				name: "Liquid Draft System",
				description:
					"Draft liquid cooling system with experimental thermal management and energy optimization features.",
				model: "LDS-DRAFT-3000",
				category: "Liquid Cooling",
				efficiency: "PUE 1.04",
				specifications: {
					powerRating: "3kW",
					coolingCapacity: "8kW",
					dimensions: "1200x800x2000mm",
					weight: "350kg",
					operatingTemperature: "10-40°C",
					certifications: "Draft - No certification",
				},
				features: [
					"Experimental thermal design",
					"Advanced fluid dynamics",
					"Energy optimization",
					"Real-time monitoring",
					"Draft configuration",
					"Testing capabilities",
					"Flexible setup",
					"Research features",
				],
				status: "draft",
				parameterCount: 18,
				calculationOverview:
					"Draft thermal analysis, experimental efficiency, prototype calculations",
			},
		],
	},
	{
		id: "solar-energy-suite",
		name: "Solar Energy Suite",
		description:
			"Comprehensive solar energy solution with advanced photovoltaic systems, energy storage, and smart grid integration for renewable energy applications.",
		category: "Renewable Energy Systems",
		logo: Wind,
		status: "verified",
		parameterCount: 26,
		calculationOverview:
			"Solar efficiency optimization, energy yield calculation, ROI analysis",
		products: [
			{
				id: "solar-panel-array-pro",
				name: "Solar Panel Array Pro",
				description:
					"High-efficiency photovoltaic system with smart tracking and energy optimization for commercial and industrial applications.",
				model: "SPA-PRO-5000",
				category: "Solar Energy",
				efficiency: "22.5% conversion",
				specifications: {
					powerRating: "5kW per array",
					coolingCapacity: "N/A",
					dimensions: "2000x1000x50mm",
					weight: "25kg",
					operatingTemperature: "-40-85°C",
					certifications: "IEC 61215, IEC 61730, UL 1703",
				},
				features: [
					"High-efficiency monocrystalline cells",
					"Smart solar tracking system",
					"Real-time performance monitoring",
					"Weather-resistant design",
					"Easy installation and maintenance",
					"Grid integration capability",
					"Remote monitoring interface",
					"25-year performance warranty",
				],
				status: "verified",
				parameterCount: 20,
				calculationOverview:
					"Solar irradiance analysis, energy yield prediction, efficiency optimization",
			},
			{
				id: "energy-storage-battery-system",
				name: "Energy Storage Battery System",
				description:
					"Advanced lithium-ion battery storage system for solar energy with intelligent energy management and grid balancing capabilities.",
				model: "EBS-LITHIUM-10000",
				category: "Energy Storage",
				efficiency: "95% round-trip efficiency",
				specifications: {
					powerRating: "10kWh capacity",
					coolingCapacity: "N/A",
					dimensions: "1200x600x800mm",
					weight: "150kg",
					operatingTemperature: "0-45°C",
					certifications: "UL 1973, IEC 62619, UN 38.3",
				},
				features: [
					"High-capacity lithium-ion technology",
					"Intelligent energy management",
					"Grid balancing capabilities",
					"Real-time monitoring",
					"Safety protection systems",
					"Modular design for scalability",
					"10-year warranty",
					"Remote diagnostics",
				],
				status: "verified",
				parameterCount: 18,
				calculationOverview:
					"Battery life cycle analysis, energy storage optimization, cost-benefit modeling",
			},
		],
	},
	{
		id: "wind-energy-solutions",
		name: "Wind Energy Solutions",
		description:
			"Advanced wind turbine systems with smart monitoring and energy optimization for sustainable wind power generation.",
		category: "Renewable Energy Systems",
		logo: Wind,
		status: "verified",
		parameterCount: 24,
		calculationOverview:
			"Wind speed analysis, power curve optimization, capacity factor calculation",
		products: [
			{
				id: "smart-wind-turbine",
				name: "Smart Wind Turbine",
				description:
					"Intelligent wind turbine system with adaptive blade control and real-time performance optimization for maximum energy capture.",
				model: "SWT-ADAPTIVE-2000",
				category: "Wind Energy",
				efficiency: "45% capacity factor",
				specifications: {
					powerRating: "2MW rated power",
					coolingCapacity: "N/A",
					dimensions: "80m hub height, 90m rotor diameter",
					weight: "85 tons",
					operatingTemperature: "-20-50°C",
					certifications: "IEC 61400, GL Wind, DNV",
				},
				features: [
					"Adaptive blade pitch control",
					"Real-time wind speed monitoring",
					"Intelligent power optimization",
					"Predictive maintenance system",
					"Grid synchronization",
					"Remote monitoring capabilities",
					"Low noise operation",
					"Bird-friendly design",
				],
				status: "verified",
				parameterCount: 22,
				calculationOverview:
					"Wind resource assessment, power curve analysis, energy yield prediction",
			},
		],
	},
	{
		id: "ev-charging-network",
		name: "EV Charging Network",
		description:
			"Comprehensive electric vehicle charging infrastructure with smart grid integration and renewable energy sources for sustainable transportation.",
		category: "Electric Vehicle Infrastructure",
		logo: Wind,
		status: "verified",
		parameterCount: 28,
		calculationOverview:
			"Charging demand analysis, grid load balancing, energy cost optimization",
		products: [
			{
				id: "fast-charger-pro",
				name: "Fast Charger Pro",
				description:
					"High-speed DC fast charging station with smart grid integration and renewable energy optimization for electric vehicles.",
				model: "FCP-DC-150",
				category: "EV Charging",
				efficiency: "95% charging efficiency",
				specifications: {
					powerRating: "150kW max output",
					coolingCapacity: "N/A",
					dimensions: "800x600x2000mm",
					weight: "450kg",
					operatingTemperature: "-30-50°C",
					certifications: "UL 2202, IEC 61851, SAE J1772",
				},
				features: [
					"150kW DC fast charging",
					"Smart grid integration",
					"Renewable energy optimization",
					"Real-time monitoring",
					"Payment processing",
					"User authentication",
					"Thermal management",
					"Emergency stop system",
				],
				status: "verified",
				parameterCount: 24,
				calculationOverview:
					"Charging demand modeling, grid impact analysis, revenue optimization",
			},
			{
				id: "smart-charging-controller",
				name: "Smart Charging Controller",
				description:
					"Intelligent charging management system that optimizes EV charging based on grid demand, renewable energy availability, and user preferences.",
				model: "SCC-INTELLIGENT-100",
				category: "EV Management",
				efficiency: "98% system efficiency",
				specifications: {
					powerRating: "100kW management",
					coolingCapacity: "N/A",
					dimensions: "600x400x300mm",
					weight: "25kg",
					operatingTemperature: "0-40°C",
					certifications: "UL 1741, IEEE 1547",
				},
				features: [
					"AI-powered load balancing",
					"Renewable energy integration",
					"Dynamic pricing support",
					"User preference learning",
					"Grid stability monitoring",
					"Predictive analytics",
					"Mobile app integration",
					"Comprehensive reporting",
				],
				status: "verified",
				parameterCount: 26,
				calculationOverview:
					"Load balancing algorithms, energy cost optimization, grid stability analysis",
			},
		],
	},
	{
		id: "fleet-optimization-suite",
		name: "Fleet Optimization Suite",
		description:
			"Comprehensive fleet management and optimization system with AI-powered route planning, fuel efficiency monitoring, and emissions tracking.",
		category: "Transportation Optimization",
		logo: Wind,
		status: "verified",
		parameterCount: 32,
		calculationOverview:
			"Route optimization algorithms, fuel consumption analysis, emissions tracking",
		products: [
			{
				id: "fleet-tracker-pro",
				name: "Fleet Tracker Pro",
				description:
					"Advanced fleet tracking and management system with real-time monitoring, route optimization, and predictive maintenance capabilities.",
				model: "FTP-ADVANCED-500",
				category: "Fleet Management",
				efficiency: "15% fuel savings",
				specifications: {
					powerRating: "12V DC operation",
					coolingCapacity: "N/A",
					dimensions: "120x80x30mm",
					weight: "200g",
					operatingTemperature: "-40-85°C",
					certifications: "FCC, CE, IC, ATEX",
				},
				features: [
					"Real-time GPS tracking",
					"Fuel consumption monitoring",
					"Driver behavior analysis",
					"Route optimization",
					"Predictive maintenance",
					"Geofencing capabilities",
					"Mobile app integration",
					"Comprehensive reporting",
				],
				status: "verified",
				parameterCount: 28,
				calculationOverview:
					"Route optimization algorithms, fuel efficiency analysis, maintenance prediction",
			},
			{
				id: "ai-route-optimizer",
				name: "AI Route Optimizer",
				description:
					"Artificial intelligence-powered route optimization system that reduces fuel consumption, delivery times, and operational costs.",
				model: "ARO-INTELLIGENT-1000",
				category: "Route Optimization",
				efficiency: "20% route efficiency improvement",
				specifications: {
					powerRating: "Cloud-based processing",
					coolingCapacity: "N/A",
					dimensions: "Virtual deployment",
					weight: "N/A",
					operatingTemperature: "Data center environment",
					certifications: "ISO 27001, SOC 2",
				},
				features: [
					"AI-powered route planning",
					"Real-time traffic integration",
					"Weather impact analysis",
					"Fuel cost optimization",
					"Delivery time prediction",
					"Dynamic route adjustment",
					"Multi-vehicle coordination",
					"Performance analytics",
				],
				status: "verified",
				parameterCount: 30,
				calculationOverview:
					"AI route optimization, traffic pattern analysis, cost-benefit modeling",
			},
		],
	},
];
