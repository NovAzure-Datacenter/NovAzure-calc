import React from "react";
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

export const getIconForCategory = (level: string, name: string): React.ReactElement => {
	const iconProps = { className: "h-5 w-5" };

	// Industry level icons
	if (level === "industry") {
		switch (name.toLowerCase()) {
			case "data centres":
				return React.createElement(Building2, { ...iconProps, className: "h-5 w-5 text-blue-600" });
			case "renewable energy":
				return React.createElement(Zap, { ...iconProps, className: "h-5 w-5 text-yellow-600" });
			case "transportation":
				return React.createElement(Car, { ...iconProps, className: "h-5 w-5 text-purple-600" });
			case "buildings & hvac":
				return React.createElement(Home, { ...iconProps, className: "h-5 w-5 text-green-600" });
			default:
				return React.createElement(Building2, { ...iconProps, className: "h-5 w-5 text-gray-600" });
		}
	}

	// Technology level icons
	if (level === "technology") {
		if (name.toLowerCase().includes("cooling")) {
			return React.createElement(Snowflake, { ...iconProps, className: "h-5 w-5 text-blue-500" });
		}
		if (
			name.toLowerCase().includes("energy") ||
			name.toLowerCase().includes("power")
		) {
			return React.createElement(Battery, { ...iconProps, className: "h-5 w-5 text-green-500" });
		}
		if (
			name.toLowerCase().includes("charging") ||
			name.toLowerCase().includes("ev")
		) {
			return React.createElement(Plug, { ...iconProps, className: "h-5 w-5 text-purple-500" });
		}
		if (name.toLowerCase().includes("solar")) {
			return React.createElement(Sun, { ...iconProps, className: "h-5 w-5 text-yellow-500" });
		}
		if (
			name.toLowerCase().includes("building") ||
			name.toLowerCase().includes("automation")
		) {
			return React.createElement(Settings, { ...iconProps, className: "h-5 w-5 text-gray-500" });
		}
		return React.createElement(Cpu, { ...iconProps, className: "h-5 w-5 text-indigo-500" });
	}

	// Solution level icons
	if (level === "solution") {
		if (
			name.toLowerCase().includes("liquid") ||
			name.toLowerCase().includes("cooling")
		) {
			return React.createElement(Droplets, { ...iconProps, className: "h-5 w-5 text-blue-500" });
		}
		if (
			name.toLowerCase().includes("air") ||
			name.toLowerCase().includes("free")
		) {
			return React.createElement(Wind, { ...iconProps, className: "h-5 w-5 text-cyan-500" });
		}
		if (
			name.toLowerCase().includes("solar") ||
			name.toLowerCase().includes("inverter")
		) {
			return React.createElement(Sun, { ...iconProps, className: "h-5 w-5 text-yellow-500" });
		}
		if (
			name.toLowerCase().includes("charging") ||
			name.toLowerCase().includes("fast")
		) {
			return React.createElement(Plug, { ...iconProps, className: "h-5 w-5 text-purple-500" });
		}
		if (
			name.toLowerCase().includes("monitoring") ||
			name.toLowerCase().includes("power")
		) {
			return React.createElement(Gauge, { ...iconProps, className: "h-5 w-5 text-green-500" });
		}
		if (
			name.toLowerCase().includes("hvac") ||
			name.toLowerCase().includes("control")
		) {
			return React.createElement(Thermometer, { ...iconProps, className: "h-5 w-5 text-orange-500" });
		}
		return React.createElement(Wrench, { ...iconProps, className: "h-5 w-5 text-gray-500" });
	}

	// Solution variant level icons
	if (level === "solutionVariant") {
		return React.createElement(Settings, { ...iconProps, className: "h-5 w-5 text-teal-500" });
	}

	// Product level icons
	if (level === "product") {
		return React.createElement(Package, { ...iconProps, className: "h-5 w-5 text-green-600" });
	}

	return React.createElement(Package, { ...iconProps, className: "h-5 w-5 text-gray-500" });
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
				{
					id: "water-management",
					name: "Water Management",
					description:
						"Sustainable water management solutions for data center operations.",
					category: "Resource Management",
					solutions: [
						{
							id: "water-recycling",
							name: "Water Recycling",
							description:
								"Advanced water recycling and treatment systems for cooling applications.",
							category: "Recycling Systems",
							solutionVariants: [
								{
									id: "closed-loop-systems",
									name: "Closed Loop Systems",
									description:
										"Closed-loop water recycling with advanced filtration and treatment.",
									category: "Closed Loop",
									products: [
										{
											id: "aqua-recycle-pro",
											name: "AquaRecycle Pro",
											description:
												"Professional water recycling system with intelligent monitoring and control.",
											model: "ARP-5000L",
											category: "Water Treatment",
											efficiency: "95% Water Recovery",
											specifications: {
												powerRating: "5kW",
												coolingCapacity: "N/A",
												dimensions: "2000x1000x1800mm",
												weight: "450kg",
												operatingTemperature: "5-40°C",
												certifications: "NSF, EPA Compliant",
											},
											features: [
												"Multi-stage filtration",
												"UV sterilization",
												"Automated chemical dosing",
												"Real-time water quality monitoring",
												"Remote system diagnostics",
											],
										},
									],
								},
							],
						},
					],
				},
				{
					id: "infrastructure-efficiency",
					name: "Infrastructure Efficiency",
					description:
						"Comprehensive infrastructure optimization solutions for maximum efficiency.",
					category: "Optimization",
					solutions: [
						{
							id: "ai-optimization",
							name: "AI Optimization",
							description:
								"Artificial intelligence-driven optimization for data center operations.",
							category: "AI Systems",
							solutionVariants: [
								{
									id: "predictive-analytics",
									name: "Predictive Analytics",
									description:
										"AI-powered predictive analytics for proactive infrastructure management.",
									category: "Analytics",
									products: [
										{
											id: "ecostruxure-it-expert",
											name: "EcoStruxure IT Expert",
											description:
												"Cloud-based AI analytics platform for data center infrastructure optimization.",
											model: "ESX-CLOUD-AI",
											category: "Analytics Platform",
											efficiency: "15% Energy Reduction",
											specifications: {
												powerRating: "Cloud-based",
												coolingCapacity: "N/A",
												dimensions: "Software Solution",
												weight: "N/A",
												operatingTemperature: "N/A",
												certifications: "ISO 27001, SOC 2",
											},
											features: [
												"Machine learning algorithms",
												"Predictive failure analysis",
												"Energy optimization recommendations",
												"Capacity planning tools",
												"Real-time dashboard and alerts",
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
								{
									id: "central-inverters",
									name: "Central Inverters",
									description:
										"High-power central inverters for utility-scale solar installations.",
									category: "Central Technology",
									products: [
										{
											id: "conext-smartgen-solar",
											name: "Conext SmartGen Solar",
											description:
												"Utility-scale central inverter with grid support capabilities.",
											model: "SGS-1500kW",
											category: "Central Inverter",
											efficiency: "99.1% Peak Efficiency",
											specifications: {
												powerRating: "1500kW",
												coolingCapacity: "Forced Air",
												dimensions: "2400x1200x2200mm",
												weight: "1200kg",
												operatingTemperature: "-25-60°C",
												certifications: "IEC 62109, IEEE 1547",
											},
											features: [
												"Grid support functions",
												"Advanced power quality control",
												"Modular design for easy maintenance",
												"Integrated monitoring system",
												"Remote firmware updates",
											],
										},
									],
								},
							],
						},
						{
							id: "energy-storage",
							name: "Energy Storage",
							description:
								"Battery energy storage systems for solar power optimization.",
							category: "Storage Systems",
							solutionVariants: [
								{
									id: "lithium-storage",
									name: "Lithium Storage",
									description:
										"High-performance lithium-ion battery storage systems.",
									category: "Li-ion Technology",
									products: [
										{
											id: "conext-battery-system",
											name: "Conext Battery System",
											description:
												"Modular lithium-ion battery storage with intelligent management.",
											model: "CBS-100kWh",
											category: "Battery Storage",
											efficiency: "95% Round-trip Efficiency",
											specifications: {
												powerRating: "100kW",
												coolingCapacity: "Liquid Cooled",
												dimensions: "2000x1000x2000mm",
												weight: "800kg",
												operatingTemperature: "0-45°C",
												certifications: "UL 9540, IEC 62619",
											},
											features: [
												"Modular scalable design",
												"Advanced battery management system",
												"Fire suppression system",
												"Grid-tie and off-grid capability",
												"20-year design life",
											],
										},
									],
								},
							],
						},
					],
				},
				{
					id: "wind-systems",
					name: "Wind Systems",
					description:
						"Wind power generation and control systems for renewable energy.",
					category: "Wind Power",
					solutions: [
						{
							id: "wind-turbine-control",
							name: "Wind Turbine Control",
							description:
								"Advanced control systems for wind turbine optimization.",
							category: "Control Systems",
							solutionVariants: [
								{
									id: "turbine-controllers",
									name: "Turbine Controllers",
									description:
										"Intelligent controllers for wind turbine operation and safety.",
									category: "Control Technology",
									products: [
										{
											id: "windlogic-controller",
											name: "WindLogic Controller",
											description:
												"Advanced wind turbine controller with predictive algorithms.",
											model: "WLC-2000",
											category: "Turbine Controller",
											efficiency: "98% Availability",
											specifications: {
												powerRating: "2MW",
												coolingCapacity: "Natural Convection",
												dimensions: "600x400x200mm",
												weight: "25kg",
												operatingTemperature: "-40-70°C",
												certifications: "IEC 61400, GL Certified",
											},
											features: [
												"Predictive wind algorithms",
												"Advanced safety systems",
												"Remote monitoring capability",
												"Condition-based maintenance",
												"Grid code compliance",
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
								{
									id: "standard-fast-chargers",
									name: "Standard Fast Chargers",
									description:
										"Standard DC fast charging solutions for urban and commercial use.",
									category: "Standard DC",
									products: [
										{
											id: "evlink-dc-standard",
											name: "EVlink DC Standard",
											description:
												"Reliable DC fast charging station for everyday use.",
											model: "EVDC-STD-50",
											category: "DC Fast Charger",
											efficiency: "94% Power Conversion",
											specifications: {
												powerRating: "50kW",
												coolingCapacity: "Air Cooled",
												dimensions: "600x400x1600mm",
												weight: "180kg",
												operatingTemperature: "-25-45°C",
												certifications: "CE, CHAdeMO, CCS",
											},
											features: [
												"Compact design",
												"User-friendly interface",
												"Multiple payment options",
												"Cloud-based management",
												"Energy management integration",
											],
										},
									],
								},
							],
						},
						{
							id: "ac-charging",
							name: "AC Charging",
							description:
								"Level 2 AC charging solutions for residential and workplace use.",
							category: "AC Charging",
							solutionVariants: [
								{
									id: "workplace-chargers",
									name: "Workplace Chargers",
									description:
										"Professional AC charging stations for workplace installations.",
									category: "Workplace Solutions",
									products: [
										{
											id: "evlink-workplace",
											name: "EVlink Workplace",
											description:
												"Smart AC charging station designed for workplace environments.",
											model: "EVAC-WP-22",
											category: "AC Charger",
											efficiency: "92% Power Conversion",
											specifications: {
												powerRating: "22kW",
												coolingCapacity: "Natural Convection",
												dimensions: "400x200x600mm",
												weight: "15kg",
												operatingTemperature: "-25-50°C",
												certifications: "CE, IEC 61851",
											},
											features: [
												"RFID access control",
												"Load balancing capability",
												"Mobile app integration",
												"Energy monitoring",
												"Vandal-resistant design",
											],
										},
									],
								},
							],
						},
					],
				},
				{
					id: "fleet-management",
					name: "Fleet Management",
					description:
						"Comprehensive fleet electrification and management solutions.",
					category: "Fleet Solutions",
					solutions: [
						{
							id: "depot-charging",
							name: "Depot Charging",
							description:
								"Large-scale charging infrastructure for fleet depots.",
							category: "Depot Solutions",
							solutionVariants: [
								{
									id: "fleet-charging-systems",
									name: "Fleet Charging Systems",
									description:
										"Integrated charging systems for large vehicle fleets.",
									category: "Fleet Infrastructure",
									products: [
										{
											id: "evlink-fleet-manager",
											name: "EVlink Fleet Manager",
											description:
												"Comprehensive fleet charging management system with intelligent scheduling.",
											model: "EFM-DEPOT-500",
											category: "Fleet Charger",
											efficiency: "95% System Efficiency",
											specifications: {
												powerRating: "500kW Total",
												coolingCapacity: "Liquid Cooled",
												dimensions: "3000x2000x2500mm",
												weight: "1500kg",
												operatingTemperature: "-30-50°C",
												certifications: "CE, UL Listed",
											},
											features: [
												"Intelligent load management",
												"Fleet scheduling optimization",
												"Energy cost optimization",
												"Predictive maintenance",
												"Integration with fleet management systems",
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
								{
									id: "zone-controllers",
									name: "Zone Controllers",
									description:
										"Multi-zone HVAC controllers for precise climate control.",
									category: "Zone Control",
									products: [
										{
											id: "zonelogic-controller",
											name: "ZoneLogic Controller",
											description:
												"Advanced multi-zone HVAC controller with intelligent optimization.",
											model: "ZLC-16Z",
											category: "Zone Controller",
											efficiency: "18% Energy Savings",
											specifications: {
												powerRating: "24VAC/120VAC",
												coolingCapacity: "N/A",
												dimensions: "300x200x100mm",
												weight: "2.5kg",
												operatingTemperature: "-10-60°C",
												certifications: "CE, UL Listed",
											},
											features: [
												"16-zone control capability",
												"Advanced scheduling algorithms",
												"Energy optimization routines",
												"Remote monitoring and control",
												"Integration with building management systems",
											],
										},
									],
								},
							],
						},
						{
							id: "lighting-controls",
							name: "Lighting Controls",
							description:
								"Intelligent lighting control systems for energy efficiency and comfort.",
							category: "Lighting Systems",
							solutionVariants: [
								{
									id: "smart-lighting",
									name: "Smart Lighting",
									description:
										"Advanced lighting control with occupancy sensing and daylight harvesting.",
									category: "Intelligent Lighting",
									products: [
										{
											id: "lightlogic-system",
											name: "LightLogic System",
											description:
												"Comprehensive smart lighting control system with wireless connectivity.",
											model: "LLS-WIRELESS-PRO",
											category: "Lighting Controller",
											efficiency: "35% Energy Savings",
											specifications: {
												powerRating: "120-277VAC",
												coolingCapacity: "N/A",
												dimensions: "200x150x50mm",
												weight: "1.2kg",
												operatingTemperature: "0-50°C",
												certifications: "Energy Star, FCC",
											},
											features: [
												"Wireless mesh networking",
												"Occupancy and daylight sensing",
												"Automated scheduling",
												"Mobile app control",
												"Energy reporting and analytics",
											],
										},
									],
								},
							],
						},
					],
				},
				{
					id: "energy-monitoring",
					name: "Energy Monitoring",
					description:
						"Advanced energy monitoring and management systems for buildings.",
					category: "Energy Management",
					solutions: [
						{
							id: "building-meters",
							name: "Building Meters",
							description:
								"Smart metering solutions for comprehensive building energy monitoring.",
							category: "Metering Systems",
							solutionVariants: [
								{
									id: "smart-building-meters",
									name: "Smart Building Meters",
									description:
										"Advanced smart meters for detailed building energy analysis.",
									category: "Smart Metering",
									products: [
										{
											id: "powerlogic-ion9000",
											name: "PowerLogic ION9000",
											description:
												"High-performance power meter for critical building applications.",
											model: "ION9000-Series",
											category: "Power Meter",
											efficiency: "0.1% Accuracy Class",
											specifications: {
												powerRating: "Up to 6000A",
												coolingCapacity: "N/A",
												dimensions: "180x180x150mm",
												weight: "2.8kg",
												operatingTemperature: "-25-70°C",
												certifications: "IEC 62053, ANSI C12.20",
											},
											features: [
												"Revenue-grade accuracy",
												"Advanced power quality monitoring",
												"Ethernet and wireless connectivity",
												"Web-based interface",
												"Comprehensive data logging",
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
