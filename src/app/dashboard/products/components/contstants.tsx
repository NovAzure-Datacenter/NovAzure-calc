import {
	Building2,
	Zap,
	Car,
	Home,
	Snowflake,
	Battery,
	Plug,
	Thermometer,
	Droplets,
	Wind,
	Settings,
	Package,
	Sun,
	Gauge,
	Cpu,
	Wrench,
} from "lucide-react";

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
}

export interface SolutionVariant {
	id: string;
	name: string;
	description: string;
	category: string;
	products: Product[];
}

export interface Solution {
	id: string;
	name: string;
	description: string;
	category: string;
	solutionVariants: SolutionVariant[];
}

export interface Technology {
	id: string;
	name: string;
	description: string;
	category: string;
	solutions: Solution[];
}

export interface Industry {
	id: string;
	name: string;
	description: string;
	category: string;
	technologies: Technology[];
}

export interface MockData {
	industries: Industry[];
}

export const getIconForCategory = (level: string, name: string) => {
	const iconProps = { className: "h-5 w-5" };

	// Industry level icons
	if (level === "industry") {
		switch (name.toLowerCase()) {
			case "data centres":
				return <Building2 {...iconProps} className="h-5 w-5 text-blue-600" />;
			case "renewable energy":
				return <Zap {...iconProps} className="h-5 w-5 text-yellow-600" />;
			case "transportation":
				return <Car {...iconProps} className="h-5 w-5 text-purple-600" />;
			case "buildings & hvac":
				return <Home {...iconProps} className="h-5 w-5 text-green-600" />;
			default:
				return <Building2 {...iconProps} className="h-5 w-5 text-gray-600" />;
		}
	}

	// Technology level icons
	if (level === "technology") {
		if (name.toLowerCase().includes("cooling")) {
			return <Snowflake {...iconProps} className="h-5 w-5 text-blue-500" />;
		}
		if (
			name.toLowerCase().includes("energy") ||
			name.toLowerCase().includes("power")
		) {
			return <Battery {...iconProps} className="h-5 w-5 text-green-500" />;
		}
		if (
			name.toLowerCase().includes("charging") ||
			name.toLowerCase().includes("ev")
		) {
			return <Plug {...iconProps} className="h-5 w-5 text-purple-500" />;
		}
		if (name.toLowerCase().includes("solar")) {
			return <Sun {...iconProps} className="h-5 w-5 text-yellow-500" />;
		}
		if (
			name.toLowerCase().includes("building") ||
			name.toLowerCase().includes("automation")
		) {
			return <Settings {...iconProps} className="h-5 w-5 text-gray-500" />;
		}
		return <Cpu {...iconProps} className="h-5 w-5 text-indigo-500" />;
	}

	// Solution level icons
	if (level === "solution") {
		if (
			name.toLowerCase().includes("liquid") ||
			name.toLowerCase().includes("cooling")
		) {
			return <Droplets {...iconProps} className="h-5 w-5 text-blue-500" />;
		}
		if (
			name.toLowerCase().includes("air") ||
			name.toLowerCase().includes("free")
		) {
			return <Wind {...iconProps} className="h-5 w-5 text-cyan-500" />;
		}
		if (
			name.toLowerCase().includes("solar") ||
			name.toLowerCase().includes("inverter")
		) {
			return <Sun {...iconProps} className="h-5 w-5 text-yellow-500" />;
		}
		if (
			name.toLowerCase().includes("charging") ||
			name.toLowerCase().includes("fast")
		) {
			return <Plug {...iconProps} className="h-5 w-5 text-purple-500" />;
		}
		if (
			name.toLowerCase().includes("monitoring") ||
			name.toLowerCase().includes("power")
		) {
			return <Gauge {...iconProps} className="h-5 w-5 text-green-500" />;
		}
		if (
			name.toLowerCase().includes("hvac") ||
			name.toLowerCase().includes("control")
		) {
			return <Thermometer {...iconProps} className="h-5 w-5 text-orange-500" />;
		}
		return <Wrench {...iconProps} className="h-5 w-5 text-gray-500" />;
	}

	// Solution variant level icons
	if (level === "solutionVariant") {
		return <Settings {...iconProps} className="h-5 w-5 text-teal-500" />;
	}

	// Product level icons
	if (level === "product") {
		return <Package {...iconProps} className="h-5 w-5 text-green-600" />;
	}

	return <Package {...iconProps} className="h-5 w-5 text-gray-500" />;
};

export const mockData: MockData = {
	industries: [
		{
			id: "data-centres",
			name: "Data Centres",
			description:
				"Comprehensive solutions for modern data center infrastructure, focusing on energy efficiency and sustainability.",
			category: "Infrastructure",
			technologies: [
				{
					id: "cooling-systems",
					name: "Cooling Systems",
					description:
						"Advanced cooling technologies for optimal data center thermal management.",
					category: "Thermal Management",
					solutions: [
						{
							id: "liquid-cooling",
							name: "Liquid Cooling",
							description:
								"High-efficiency liquid cooling solutions for high-density computing environments.",
							category: "Active Cooling",
							solutionVariants: [
								{
									id: "direct-to-chip",
									name: "Direct-to-Chip Liquid Cooling",
									description:
										"Precision cooling directly to processor components for maximum efficiency.",
									category: "Precision Cooling",
									products: [
										{
											id: "rackCDU-d2c",
											name: "RackCDU D2C",
											description:
												"Direct-to-chip cooling distribution unit with intelligent monitoring and control.",
											model: "RCDU-D2C-40kW",
											category: "Cooling Distribution",
											efficiency: "98.5% PUE",
											specifications: {
												powerRating: "40kW",
												coolingCapacity: "45kW",
												dimensions: "600x1200x2000mm",
												weight: "180kg",
												operatingTemperature: "5-45°C",
												certifications: "CE, UL, Energy Star",
											},
											features: [
												"Intelligent flow control",
												"Real-time temperature monitoring",
												"Predictive maintenance alerts",
												"Energy optimization algorithms",
												"Remote monitoring capability",
											],
										},
									],
								},
								{
									id: "immersion-cooling",
									name: "Immersion Cooling",
									description:
										"Complete server immersion in dielectric fluid for ultimate cooling efficiency.",
									category: "Immersion Systems",
									products: [
										{
											id: "submerge-smartpod",
											name: "Submerge SmartPod",
											description:
												"Complete immersion cooling pod system with integrated monitoring and control.",
											model: "SSP-100kW",
											category: "Immersion Pod",
											efficiency: "99.2% PUE",
											specifications: {
												powerRating: "100kW",
												coolingCapacity: "120kW",
												dimensions: "2400x1200x2200mm",
												weight: "850kg",
												operatingTemperature: "0-50°C",
												certifications: "CE, UL, ISO 14001",
											},
											features: [
												"Two-phase immersion cooling",
												"Automated fluid management",
												"Hot-swappable server modules",
												"Zero water consumption",
												"Noise reduction up to 95%",
											],
										},
									],
								},
							],
						},
						{
							id: "free-air-cooling",
							name: "Free Air Cooling",
							description:
								"Natural air cooling systems leveraging ambient conditions for energy savings.",
							category: "Passive Cooling",
							solutionVariants: [
								{
									id: "economizer-systems",
									name: "Economizer Systems",
									description:
										"Intelligent air-side economizers for optimal free cooling utilization.",
									category: "Air Management",
									products: [
										{
											id: "airside-economizer-pro",
											name: "AirSide Economizer Pro",
											description:
												"Advanced economizer system with intelligent controls and filtration.",
											model: "ASE-PRO-50",
											category: "Air Economizer",
											efficiency: "85% Free Cooling Hours",
											specifications: {
												powerRating: "2.5kW",
												coolingCapacity: "50kW",
												dimensions: "1800x800x600mm",
												weight: "120kg",
												operatingTemperature: "-20-40°C",
												certifications: "CE, ASHRAE Compliant",
											},
											features: [
												"Intelligent damper control",
												"Multi-stage filtration",
												"Weather prediction integration",
												"Energy optimization algorithms",
												"Remote monitoring and control",
											],
										},
									],
								},
							],
						},
						{
							id: "adiabatic-cooling",
							name: "Adiabatic Cooling",
							description:
								"Evaporative cooling enhancement for improved efficiency in dry climates.",
							category: "Evaporative Cooling",
							solutionVariants: [
								{
									id: "evaporative-enhancement",
									name: "Evaporative Enhancement",
									description:
										"Water-based cooling enhancement systems for air-cooled equipment.",
									category: "Water Enhancement",
									products: [
										{
											id: "evap-cool-system",
											name: "EvapCool System",
											description:
												"Modular evaporative cooling system with water management.",
											model: "ECS-30kW",
											category: "Evaporative Cooler",
											efficiency: "92% Cooling Effectiveness",
											specifications: {
												powerRating: "3kW",
												coolingCapacity: "30kW",
												dimensions: "1500x1000x800mm",
												weight: "95kg",
												operatingTemperature: "10-50°C",
												certifications: "CE, Water Efficiency Certified",
											},
											features: [
												"Water recycling system",
												"Automatic water quality monitoring",
												"Legionella prevention protocols",
												"Variable speed fans",
												"Smart humidity control",
											],
										},
									],
								},
							],
						},
					],
				},
				{
					id: "energy-management",
					name: "Energy Management",
					description:
						"Intelligent energy monitoring and optimization systems for data centers.",
					category: "Power Management",
					solutions: [
						{
							id: "power-monitoring",
							name: "Power Monitoring",
							description:
								"Real-time power monitoring and analytics for energy optimization.",
							category: "Monitoring Systems",
							solutionVariants: [
								{
									id: "smart-meters",
									name: "Smart Power Meters",
									description:
										"Intelligent power metering with advanced analytics capabilities.",
									category: "Metering",
									products: [
										{
											id: "powerlogic-pm8000",
											name: "PowerLogic PM8000",
											description:
												"Advanced power meter with comprehensive monitoring and communication capabilities.",
											model: "PM8000-Series",
											category: "Power Meter",
											efficiency: "0.2% Accuracy Class",
											specifications: {
												powerRating: "Up to 6300A",
												coolingCapacity: "N/A",
												dimensions: "144x144x120mm",
												weight: "1.2kg",
												operatingTemperature: "-25-70°C",
												certifications: "IEC 61557, UL Listed",
											},
											features: [
												"Revenue-grade accuracy",
												"Advanced power quality analysis",
												"Ethernet and serial communications",
												"Web-based configuration",
												"Alarm and event logging",
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			id: "renewable-energy",
			name: "Renewable Energy",
			description:
				"Sustainable energy solutions including solar, wind, and energy storage systems.",
			category: "Sustainability",
			technologies: [
				{
					id: "solar-systems",
					name: "Solar Systems",
					description:
						"Complete photovoltaic systems for commercial and industrial applications.",
					category: "Solar Power",
					solutions: [
						{
							id: "solar-inverters",
							name: "Solar Inverters",
							description:
								"High-efficiency inverters for solar power conversion and grid integration.",
							category: "Power Conversion",
							solutionVariants: [
								{
									id: "string-inverters",
									name: "String Inverters",
									description:
										"Optimized string inverters for commercial solar installations.",
									category: "String Technology",
									products: [
										{
											id: "conext-core-xl",
											name: "Conext Core XL",
											description:
												"Three-phase string inverter with advanced monitoring and safety features.",
											model: "CORE-XL-50kW",
											category: "String Inverter",
											efficiency: "98.8% Peak Efficiency",
											specifications: {
												powerRating: "50kW",
												coolingCapacity: "Natural Convection",
												dimensions: "665x460x242mm",
												weight: "61kg",
												operatingTemperature: "-25-60°C",
												certifications: "IEC 62109, UL 1741",
											},
											features: [
												"Integrated DC disconnect",
												"Advanced arc fault protection",
												"Rapid shutdown compliance",
												"WiFi and Ethernet connectivity",
												"Remote monitoring and diagnostics",
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			id: "transportation",
			name: "Transportation",
			description:
				"Electrification solutions for transportation infrastructure and fleet management.",
			category: "Mobility",
			technologies: [
				{
					id: "ev-charging",
					name: "EV Charging",
					description:
						"Electric vehicle charging infrastructure for public and private use.",
					category: "Charging Infrastructure",
					solutions: [
						{
							id: "fast-charging",
							name: "Fast Charging",
							description:
								"High-power DC fast charging stations for rapid vehicle charging.",
							category: "DC Charging",
							solutionVariants: [
								{
									id: "ultra-fast-chargers",
									name: "Ultra-Fast Chargers",
									description:
										"Ultra-high power charging stations for commercial and highway applications.",
									category: "Ultra-Fast DC",
									products: [
										{
											id: "evlink-dc-ultra",
											name: "EVlink DC Ultra",
											description:
												"Ultra-fast DC charging station with dual connector capability.",
											model: "EVDC-ULTRA-350",
											category: "DC Fast Charger",
											efficiency: "96% Power Conversion",
											specifications: {
												powerRating: "350kW",
												coolingCapacity: "Liquid Cooled",
												dimensions: "800x600x1800mm",
												weight: "450kg",
												operatingTemperature: "-30-50°C",
												certifications: "CE, CHAdeMO, CCS",
											},
											features: [
												"Dual connector support",
												"Dynamic power sharing",
												"Integrated payment system",
												"Remote monitoring and management",
												"Predictive maintenance alerts",
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			id: "buildings-hvac",
			name: "Buildings & HVAC",
			description:
				"Smart building automation and HVAC control systems for energy efficiency.",
			category: "Building Management",
			technologies: [
				{
					id: "building-automation",
					name: "Building Automation",
					description:
						"Integrated building management systems for optimal comfort and efficiency.",
					category: "Automation Systems",
					solutions: [
						{
							id: "hvac-controls",
							name: "HVAC Controls",
							description:
								"Advanced HVAC control systems with intelligent optimization.",
							category: "Climate Control",
							solutionVariants: [
								{
									id: "smart-thermostats",
									name: "Smart Thermostats",
									description:
										"Intelligent thermostats with learning capabilities and remote control.",
									category: "Temperature Control",
									products: [
										{
											id: "smartstat-pro",
											name: "SmartStat Pro",
											description:
												"Professional-grade smart thermostat with advanced scheduling and analytics.",
											model: "SSP-2024",
											category: "Smart Thermostat",
											efficiency: "23% Energy Savings",
											specifications: {
												powerRating: "24VAC",
												coolingCapacity: "N/A",
												dimensions: "120x120x25mm",
												weight: "0.3kg",
												operatingTemperature: "0-50°C",
												certifications: "Energy Star, FCC",
											},
											features: [
												"Machine learning algorithms",
												"Occupancy sensing",
												"Weather compensation",
												"Mobile app control",
												"Integration with BMS systems",
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
