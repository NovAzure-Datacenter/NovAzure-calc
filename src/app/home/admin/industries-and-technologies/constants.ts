import {
	Building2,
	Zap,
	Droplets,
	Recycle,
	Wind,
	Server,
	Shell,
	Chrome,
	Fuel,
	Wrench,
	Car,
	Home,
	Factory,
	Hospital,
	Sprout,
	Building,
	ShoppingBag,
	Ship,
} from "lucide-react";
import type { Industry } from "./types";

export const sampleData: Industry[] = [
	{
		id: "1",
		logo: Building2,
		name: "Data Centers",
		description:
			"High-performance computing facilities with advanced cooling and energy management systems",
		technologies: [
			{ name: "Cooling Systems", icon: Wind },
			{ name: "Energy Management", icon: Zap },
			{ name: "Renewable Energy Integration", icon: Recycle },
			{ name: "Waste Heat Recovery", icon: Server },
			{ name: "Water Management", icon: Droplets },
			{ name: "Infrastructure Efficiency", icon: Wrench },
		],
		companies: [
			{ name: "Shell", icon: Shell },
			{ name: "Schneider Electric", icon: Zap },
			{ name: "Galp", icon: Fuel },
			{ name: "Google", icon: Chrome },
		],
		status: "verified",
		parameters: [
			{
				name: "Average PUE",
				value: 1.54,
				unit: "",
				description: "Power Usage Effectiveness - industry average",
				category: "performance"
			},
			{
				name: "Cooling CAPEX per kW",
				value: 3849,
				unit: "USD/kW",
				description: "Average cooling equipment capital expenditure",
				category: "cost"
			},
			{
				name: "Annual Energy Cost",
				value: 0.12,
				unit: "USD/kWh",
				description: "Average electricity cost for data centers",
				category: "cost"
			},
			{
				name: "Water Usage",
				value: 1.8,
				unit: "L/kWh",
				description: "Water consumption per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Carbon Footprint",
				value: 0.5,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Maintenance Cost",
				value: 0.1,
				unit: "% of CAPEX/year",
				description: "Annual maintenance cost as percentage of CAPEX",
				category: "cost"
			}
		]
	},
	{
		id: "2",
		logo: Fuel,
		name: "Oil & Gas",
		description:
			"Energy sector focusing on extraction, refining, and distribution of petroleum products",
		technologies: [
			{ name: "Drilling Technology", icon: Server },
			{ name: "Pipeline Management", icon: Wrench },
			{ name: "Environmental Monitoring", icon: Droplets },
			{ name: "Safety Systems", icon: Wind },
		],
		companies: [
			{ name: "Shell", icon: Shell },
			{ name: "Galp", icon: Fuel },
		],
		status: "verified",
		parameters: [
			{
				name: "Extraction Efficiency",
				value: 85,
				unit: "%",
				description: "Average extraction efficiency rate",
				category: "performance"
			},
			{
				name: "Infrastructure CAPEX",
				value: 2500000,
				unit: "USD/MW",
				description: "Capital expenditure per megawatt of capacity",
				category: "cost"
			},
			{
				name: "Operational Cost",
				value: 45,
				unit: "USD/barrel",
				description: "Average operational cost per barrel",
				category: "cost"
			},
			{
				name: "Carbon Intensity",
				value: 0.4,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Safety Index",
				value: 95,
				unit: "%",
				description: "Safety performance index",
				category: "operational"
			}
		]
	},
	{
		id: "3",
		logo: Wind,
		name: "Renewable Energy",
		description:
			"Clean energy solutions including wind, solar, and hydroelectric power generation",
		technologies: [
			{ name: "Wind Turbines", icon: Wind },
			{ name: "Solar Panels", icon: Zap },
			{ name: "Energy Storage", icon: Server },
			{ name: "Grid Integration", icon: Wrench },
			{ name: "Smart Monitoring", icon: Droplets },
		],
		companies: [
			{ name: "Google", icon: Chrome },
			{ name: "Schneider Electric", icon: Zap },
		],
		status: "pending",
		parameters: [
			{
				name: "Capacity Factor",
				value: 35,
				unit: "%",
				description: "Average capacity utilization factor",
				category: "performance"
			},
			{
				name: "Installation CAPEX",
				value: 1500000,
				unit: "USD/MW",
				description: "Capital expenditure per megawatt installed",
				category: "cost"
			},
			{
				name: "Levelized Cost",
				value: 0.04,
				unit: "USD/kWh",
				description: "Levelized cost of energy",
				category: "cost"
			},
			{
				name: "Carbon Reduction",
				value: 0.9,
				unit: "kg CO2/kWh avoided",
				description: "Carbon emissions avoided per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Maintenance Cost",
				value: 0.02,
				unit: "USD/kWh",
				description: "Annual maintenance cost per kilowatt-hour",
				category: "cost"
			}
		]
	},
	{
		id: "4",
		logo: Car,
		name: "Transportation",
		description:
			"Sector focused on developing and implementing sustainable and efficient modes of transport.",
		technologies: [
			{ name: "Alternative Fuels", icon: Fuel },
			{ name: "Electric Vehicle Infrastructure", icon: Zap },
		],
		companies: [
			{ name: "Tesla", icon: Car },
			{ name: "Ford", icon: Car },
			{ name: "BP", icon: Fuel },
		],
		status: "verified",
		parameters: [
			{
				name: "Fuel Efficiency",
				value: 25,
				unit: "mpg",
				description: "Average fuel efficiency for conventional vehicles",
				category: "performance"
			},
			{
				name: "EV Range",
				value: 250,
				unit: "miles",
				description: "Average electric vehicle range",
				category: "performance"
			},
			{
				name: "Infrastructure Cost",
				value: 50000,
				unit: "USD/charging station",
				description: "Cost per charging station installation",
				category: "cost"
			},
			{
				name: "Carbon Emissions",
				value: 0.4,
				unit: "kg CO2/mile",
				description: "Average carbon emissions per mile",
				category: "environmental"
			},
			{
				name: "Battery Cost",
				value: 150,
				unit: "USD/kWh",
				description: "Battery cost per kilowatt-hour",
				category: "cost"
			}
		]
	},
	{
		id: "5",
		logo: Home,
		name: "Buildings & HVAC",
		description:
			"Optimizing energy efficiency and comfort in residential and commercial buildings through advanced heating, ventilation, and air conditioning systems.",
		technologies: [
			{ name: "Building Management Systems", icon: Wrench },
			{ name: "Heat Pumps", icon: Wind },
		],
		companies: [
			{ name: "Siemens", icon: Building2 },
			{ name: "Daikin", icon: Wind },
			{ name: "Honeywell", icon: Wrench },
		],
		status: "verified",
		parameters: [
			{
				name: "Energy Efficiency Ratio",
				value: 3.5,
				unit: "",
				description: "Average energy efficiency ratio for HVAC systems",
				category: "performance"
			},
			{
				name: "Installation Cost",
				value: 8000,
				unit: "USD/ton",
				description: "HVAC installation cost per ton of cooling",
				category: "cost"
			},
			{
				name: "Annual Energy Cost",
				value: 0.15,
				unit: "USD/kWh",
				description: "Average energy cost for building operations",
				category: "cost"
			},
			{
				name: "Carbon Footprint",
				value: 0.6,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Maintenance Cost",
				value: 0.08,
				unit: "% of CAPEX/year",
				description: "Annual maintenance cost as percentage of CAPEX",
				category: "cost"
			}
		]
	},
	{
		id: "6",
		logo: Factory,
		name: "Manufacturing",
		description:
			"Industries involved in the production of goods, focusing on process optimization and energy monitoring.",
		technologies: [
			{ name: "Process Heating", icon: Server },
			{ name: "Energy Monitoring", icon: Zap },
		],
		companies: [
			{ name: "General Electric", icon: Wrench },
			{ name: "Caterpillar", icon: Server },
			{ name: "Bosch", icon: Zap },
		],
		status: "verified",
		parameters: [
			{
				name: "Energy Intensity",
				value: 0.8,
				unit: "kWh/USD output",
				description: "Energy consumption per dollar of output",
				category: "performance"
			},
			{
				name: "Equipment CAPEX",
				value: 500000,
				unit: "USD/MW",
				description: "Capital expenditure per megawatt of production",
				category: "cost"
			},
			{
				name: "Operational Efficiency",
				value: 78,
				unit: "%",
				description: "Average operational efficiency",
				category: "performance"
			},
			{
				name: "Carbon Intensity",
				value: 0.7,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Maintenance Cost",
				value: 0.12,
				unit: "% of CAPEX/year",
				description: "Annual maintenance cost as percentage of CAPEX",
				category: "cost"
			}
		]
	},
	{
		id: "7",
		logo: Hospital,
		name: "Healthcare",
		description:
			"Providing medical services and developing innovative solutions for patient care and facility management.",
		technologies: [
			{ name: "Medical Imaging", icon: Zap },
			{ name: "Telemedicine", icon: Droplets },
			{ name: "Hospital Energy Efficiency", icon: Recycle },
			{ name: "Smart Building Systems", icon: Building2 },
		],
		companies: [
			{ name: "Philips", icon: Zap },
			{ name: "GE Healthcare", icon: Server },
			{ name: "Siemens Healthineers", icon: Building2 },
		],
		status: "verified",
		parameters: [
			{
				name: "Energy per Bed",
				value: 250,
				unit: "kWh/bed/day",
				description: "Average energy consumption per hospital bed per day",
				category: "performance"
			},
			{
				name: "Equipment CAPEX",
				value: 150000,
				unit: "USD/bed",
				description: "Medical equipment capital expenditure per bed",
				category: "cost"
			},
			{
				name: "Operational Cost",
				value: 0.18,
				unit: "USD/kWh",
				description: "Average operational cost per kilowatt-hour",
				category: "cost"
			},
			{
				name: "Carbon Footprint",
				value: 0.5,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Patient Safety Index",
				value: 98,
				unit: "%",
				description: "Patient safety performance index",
				category: "operational"
			}
		]
	},
	{
		id: "8",
		logo: Sprout,
		name: "Agriculture",
		description:
			"Focusing on sustainable farming practices, crop optimization, and resource management.",
		technologies: [
			{ name: "Precision Farming", icon: Wrench },
			{ name: "Water Management", icon: Droplets },
			{ name: "Renewable Energy in Farms", icon: Wind },
			{ name: "Crop Monitoring", icon: Server },
		],
		companies: [
			{ name: "John Deere", icon: Wrench },
			{ name: "Bayer Crop Science", icon: Droplets },
			{ name: "Monsanto", icon: Recycle },
		],
		status: "verified",
		parameters: [
			{
				name: "Water Efficiency",
				value: 85,
				unit: "%",
				description: "Water use efficiency in irrigation systems",
				category: "performance"
			},
			{
				name: "Equipment CAPEX",
				value: 200000,
				unit: "USD/hectare",
				description: "Agricultural equipment capital expenditure per hectare",
				category: "cost"
			},
			{
				name: "Energy per Hectare",
				value: 1200,
				unit: "kWh/hectare/year",
				description: "Energy consumption per hectare per year",
				category: "performance"
			},
			{
				name: "Carbon Sequestration",
				value: 2.5,
				unit: "ton CO2/hectare/year",
				description: "Carbon sequestration potential per hectare",
				category: "environmental"
			},
			{
				name: "Yield Improvement",
				value: 25,
				unit: "%",
				description: "Average yield improvement with smart farming",
				category: "performance"
			}
		]
	},
	{
		id: "9",
		logo: Building,
		name: "Smart Cities",
		description:
			"Integrating technology and innovative solutions to enhance urban sustainability, efficiency, and quality of life.",
		technologies: [
			{ name: "Smart Grids", icon: Zap },
			{ name: "Intelligent Transportation Systems", icon: Car },
			{ name: "Waste Management Systems", icon: Server },
			{ name: "Public Safety Solutions", icon: Wind },
		],
		companies: [
			{ name: "Cisco", icon: Building2 },
			{ name: "IBM", icon: Chrome },
			{ name: "Schneider Electric", icon: Zap },
		],
		status: "pending",
		parameters: [
			{
				name: "Energy Savings",
				value: 30,
				unit: "%",
				description: "Average energy savings with smart city solutions",
				category: "performance"
			},
			{
				name: "Infrastructure CAPEX",
				value: 5000000,
				unit: "USD/km²",
				description: "Smart city infrastructure capital expenditure per square kilometer",
				category: "cost"
			},
			{
				name: "Operational Efficiency",
				value: 85,
				unit: "%",
				description: "Overall operational efficiency improvement",
				category: "performance"
			},
			{
				name: "Carbon Reduction",
				value: 40,
				unit: "%",
				description: "Carbon emissions reduction potential",
				category: "environmental"
			},
			{
				name: "Citizen Satisfaction",
				value: 92,
				unit: "%",
				description: "Citizen satisfaction index with smart city services",
				category: "operational"
			}
		]
	},
	{
		id: "10",
		logo: ShoppingBag,
		name: "Retail",
		description:
			"Optimizing operations and customer experience in retail environments through smart technologies and energy management.",
		technologies: [
			{ name: "Energy Management in Stores", icon: Zap },
			{ name: "Smart Lighting Systems", icon: Wind },
			{ name: "HVAC Optimization", icon: Server },
			{ name: "Building Management Systems", icon: Wrench },
		],
		companies: [
			{ name: "Walmart", icon: Building2 },
			{ name: "Target", icon: Chrome },
			{ name: "Tesco", icon: Droplets },
		],
		status: "verified",
		parameters: [
			{
				name: "Energy per Store",
				value: 500000,
				unit: "kWh/store/year",
				description: "Average energy consumption per retail store per year",
				category: "performance"
			},
			{
				name: "Store CAPEX",
				value: 2000000,
				unit: "USD/store",
				description: "Capital expenditure per retail store",
				category: "cost"
			},
			{
				name: "Energy Cost Savings",
				value: 25,
				unit: "%",
				description: "Energy cost savings with smart retail solutions",
				category: "cost"
			},
			{
				name: "Carbon Footprint",
				value: 0.4,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Customer Experience Score",
				value: 88,
				unit: "%",
				description: "Customer experience improvement score",
				category: "operational"
			}
		]
	},
	{
		id: "11",
		logo: Ship,
		name: "Marine & Shipping",
		description:
			"Innovating for sustainable and efficient maritime operations, including propulsion and port management.",
		technologies: [
			{ name: "Alternative Marine Fuels", icon: Fuel },
			{ name: "Port Energy Management", icon: Zap },
			{ name: "Fleet Efficiency", icon: Car },
			{ name: "Emissions Monitoring", icon: Droplets },
		],
		companies: [
			{ name: "Maersk", icon: Building2 },
			{ name: "CMA CGM", icon: Fuel },
			{ name: "Wärtsilä", icon: Wrench },
		],
		status: "verified",
		parameters: [
			{
				name: "Fuel Efficiency",
				value: 12,
				unit: "g/kWh",
				description: "Fuel consumption per kilowatt-hour",
				category: "performance"
			},
			{
				name: "Vessel CAPEX",
				value: 80000000,
				unit: "USD/vessel",
				description: "Average vessel capital expenditure",
				category: "cost"
			},
			{
				name: "Operational Cost",
				value: 0.08,
				unit: "USD/kWh",
				description: "Operational cost per kilowatt-hour",
				category: "cost"
			},
			{
				name: "Carbon Emissions",
				value: 0.3,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Safety Index",
				value: 96,
				unit: "%",
				description: "Maritime safety performance index",
				category: "operational"
			}
		]
	},
	{
		id: "12",
		logo: Zap,
		name: "Electronics & Semiconductors",
		description:
			"Manufacturing of electronic components and semiconductor devices with focus on energy efficiency and sustainable production.",
		technologies: [
			{ name: "Clean Room Energy Management", icon: Wind },
			{ name: "Process Cooling Systems", icon: Droplets },
			{ name: "Waste Heat Recovery", icon: Server },
			{ name: "Renewable Energy Integration", icon: Recycle },
		],
		companies: [
			{ name: "Intel", icon: Server },
			{ name: "TSMC", icon: Building2 },
			{ name: "Samsung", icon: Zap },
		],
		status: "verified",
		parameters: [
			{
				name: "Process Efficiency",
				value: 92,
				unit: "%",
				description: "Manufacturing process efficiency",
				category: "performance"
			},
			{
				name: "Fab CAPEX",
				value: 10000000000,
				unit: "USD/fab",
				description: "Semiconductor fabrication facility capital expenditure",
				category: "cost"
			},
			{
				name: "Energy per Wafer",
				value: 1500,
				unit: "kWh/wafer",
				description: "Energy consumption per wafer processed",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 0.6,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Yield Rate",
				value: 95,
				unit: "%",
				description: "Manufacturing yield rate",
				category: "operational"
			}
		]
	},
	{
		id: "13",
		logo: Droplets,
		name: "Water & Wastewater",
		description:
			"Water treatment, purification, and wastewater management systems with energy-efficient processes.",
		technologies: [
			{ name: "Membrane Filtration", icon: Droplets },
			{ name: "Energy Recovery Systems", icon: Zap },
			{ name: "Smart Water Networks", icon: Server },
			{ name: "Biological Treatment", icon: Recycle },
		],
		companies: [
			{ name: "Veolia", icon: Droplets },
			{ name: "Suez", icon: Building2 },
			{ name: "Xylem", icon: Wrench },
		],
		status: "verified",
		parameters: [
			{
				name: "Treatment Efficiency",
				value: 98,
				unit: "%",
				description: "Water treatment efficiency rate",
				category: "performance"
			},
			{
				name: "Plant CAPEX",
				value: 5000000,
				unit: "USD/MLD",
				description: "Capital expenditure per million liters per day capacity",
				category: "cost"
			},
			{
				name: "Energy per Liter",
				value: 0.8,
				unit: "kWh/m³",
				description: "Energy consumption per cubic meter of water treated",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 0.3,
				unit: "kg CO2/m³",
				description: "Carbon emissions per cubic meter of water treated",
				category: "environmental"
			},
			{
				name: "Water Recovery Rate",
				value: 85,
				unit: "%",
				description: "Water recovery rate in treatment processes",
				category: "operational"
			}
		]
	},
	{
		id: "14",
		logo: Wind,
		name: "Aviation & Aerospace",
		description:
			"Aviation industry focusing on sustainable aviation fuels, electric propulsion, and energy-efficient aircraft systems.",
		technologies: [
			{ name: "Sustainable Aviation Fuels", icon: Fuel },
			{ name: "Electric Propulsion", icon: Zap },
			{ name: "Aircraft Energy Management", icon: Server },
			{ name: "Ground Support Equipment", icon: Wrench },
		],
		companies: [
			{ name: "Boeing", icon: Building2 },
			{ name: "Airbus", icon: Wind },
			{ name: "Rolls-Royce", icon: Server },
		],
		status: "pending",
		parameters: [
			{
				name: "Fuel Efficiency",
				value: 3.5,
				unit: "L/100km",
				description: "Fuel consumption per 100 kilometers",
				category: "performance"
			},
			{
				name: "Aircraft CAPEX",
				value: 100000000,
				unit: "USD/aircraft",
				description: "Average aircraft capital expenditure",
				category: "cost"
			},
			{
				name: "Operational Cost",
				value: 0.15,
				unit: "USD/km",
				description: "Operational cost per kilometer",
				category: "cost"
			},
			{
				name: "Carbon Emissions",
				value: 0.25,
				unit: "kg CO2/km",
				description: "Carbon emissions per kilometer",
				category: "environmental"
			},
			{
				name: "Safety Index",
				value: 99.9,
				unit: "%",
				description: "Aviation safety performance index",
				category: "operational"
			}
		]
	},
	{
		id: "15",
		logo: Recycle,
		name: "Waste Management & Recycling",
		description:
			"Waste collection, processing, and recycling operations with energy recovery and circular economy solutions.",
		technologies: [
			{ name: "Waste-to-Energy", icon: Zap },
			{ name: "Automated Sorting Systems", icon: Server },
			{ name: "Biogas Production", icon: Fuel },
			{ name: "Circular Economy Platforms", icon: Recycle },
		],
		companies: [
			{ name: "Waste Management Inc", icon: Recycle },
			{ name: "Republic Services", icon: Building2 },
			{ name: "Covanta", icon: Zap },
		],
		status: "verified",
		parameters: [
			{
				name: "Recycling Rate",
				value: 65,
				unit: "%",
				description: "Average recycling rate",
				category: "performance"
			},
			{
				name: "Facility CAPEX",
				value: 30000000,
				unit: "USD/facility",
				description: "Waste processing facility capital expenditure",
				category: "cost"
			},
			{
				name: "Energy Recovery",
				value: 0.6,
				unit: "kWh/kg",
				description: "Energy recovered per kilogram of waste",
				category: "performance"
			},
			{
				name: "Carbon Reduction",
				value: 2.1,
				unit: "kg CO2/kg waste",
				description: "Carbon emissions avoided per kilogram of waste",
				category: "environmental"
			},
			{
				name: "Processing Efficiency",
				value: 88,
				unit: "%",
				description: "Waste processing efficiency",
				category: "operational"
			}
		]
	},
	{
		id: "16",
		logo: Server,
		name: "Telecommunications",
		description:
			"Network infrastructure and communication systems with focus on energy-efficient data transmission and network management.",
		technologies: [
			{ name: "5G Energy Optimization", icon: Zap },
			{ name: "Data Center Cooling", icon: Wind },
			{ name: "Network Virtualization", icon: Server },
			{ name: "Smart Grid Communications", icon: Building2 },
		],
		companies: [
			{ name: "Cisco", icon: Server },
			{ name: "Ericsson", icon: Building2 },
			{ name: "Nokia", icon: Zap },
		],
		status: "verified",
		parameters: [
			{
				name: "Network Efficiency",
				value: 94,
				unit: "%",
				description: "Network transmission efficiency",
				category: "performance"
			},
			{
				name: "Infrastructure CAPEX",
				value: 2000000,
				unit: "USD/tower",
				description: "Telecommunications infrastructure capital expenditure per tower",
				category: "cost"
			},
			{
				name: "Energy per GB",
				value: 0.06,
				unit: "kWh/GB",
				description: "Energy consumption per gigabyte of data transmitted",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 0.02,
				unit: "kg CO2/GB",
				description: "Carbon emissions per gigabyte of data",
				category: "environmental"
			},
			{
				name: "Network Reliability",
				value: 99.9,
				unit: "%",
				description: "Network uptime reliability",
				category: "operational"
			}
		]
	},
	{
		id: "17",
		logo: Building2,
		name: "Construction & Infrastructure",
		description:
			"Building and infrastructure development with sustainable materials, energy-efficient construction methods, and smart building technologies.",
		technologies: [
			{ name: "Green Building Materials", icon: Recycle },
			{ name: "Energy-Efficient Construction", icon: Wind },
			{ name: "Smart Building Systems", icon: Server },
			{ name: "Renewable Energy Integration", icon: Zap },
		],
		companies: [
			{ name: "Bechtel", icon: Building2 },
			{ name: "Fluor", icon: Wrench },
			{ name: "Skanska", icon: Recycle },
		],
		status: "verified",
		parameters: [
			{
				name: "Construction Efficiency",
				value: 82,
				unit: "%",
				description: "Construction process efficiency",
				category: "performance"
			},
			{
				name: "Project CAPEX",
				value: 2500,
				unit: "USD/m²",
				description: "Construction capital expenditure per square meter",
				category: "cost"
			},
			{
				name: "Energy per m²",
				value: 120,
				unit: "kWh/m²/year",
				description: "Energy consumption per square meter per year",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 0.8,
				unit: "kg CO2/m²",
				description: "Carbon emissions per square meter",
				category: "environmental"
			},
			{
				name: "Project Delivery Time",
				value: 85,
				unit: "%",
				description: "Projects delivered on time",
				category: "operational"
			}
		]
	},
	{
		id: "18",
		logo: Fuel,
		name: "Chemical & Petrochemical",
		description:
			"Chemical manufacturing and processing with energy-efficient production methods and sustainable chemical solutions.",
		technologies: [
			{ name: "Process Optimization", icon: Server },
			{ name: "Catalytic Technologies", icon: Zap },
			{ name: "Waste Heat Recovery", icon: Wind },
			{ name: "Green Chemistry", icon: Recycle },
		],
		companies: [
			{ name: "BASF", icon: Building2 },
			{ name: "Dow Chemical", icon: Fuel },
			{ name: "DuPont", icon: Zap },
		],
		status: "verified",
		parameters: [
			{
				name: "Process Efficiency",
				value: 89,
				unit: "%",
				description: "Chemical process efficiency",
				category: "performance"
			},
			{
				name: "Plant CAPEX",
				value: 5000000,
				unit: "USD/ton/year",
				description: "Chemical plant capital expenditure per ton of annual capacity",
				category: "cost"
			},
			{
				name: "Energy per Ton",
				value: 800,
				unit: "kWh/ton",
				description: "Energy consumption per ton of product",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 1.2,
				unit: "kg CO2/kg product",
				description: "Carbon emissions per kilogram of product",
				category: "environmental"
			},
			{
				name: "Safety Index",
				value: 97,
				unit: "%",
				description: "Chemical plant safety performance index",
				category: "operational"
			}
		]
	},
	{
		id: "19",
		logo: Hospital,
		name: "Pharmaceuticals & Biotechnology",
		description:
			"Drug development and biotech research with energy-efficient laboratory operations and sustainable manufacturing processes.",
		technologies: [
			{ name: "Laboratory Energy Management", icon: Zap },
			{ name: "Clean Room Systems", icon: Wind },
			{ name: "Bioreactor Optimization", icon: Server },
			{ name: "Sustainable Manufacturing", icon: Recycle },
		],
		companies: [
			{ name: "Pfizer", icon: Hospital },
			{ name: "Johnson & Johnson", icon: Building2 },
			{ name: "Novartis", icon: Zap },
		],
		status: "verified",
		parameters: [
			{
				name: "Research Efficiency",
				value: 76,
				unit: "%",
				description: "Research and development efficiency",
				category: "performance"
			},
			{
				name: "Facility CAPEX",
				value: 10000000,
				unit: "USD/facility",
				description: "Pharmaceutical facility capital expenditure",
				category: "cost"
			},
			{
				name: "Energy per Drug",
				value: 5000,
				unit: "kWh/drug developed",
				description: "Energy consumption per drug developed",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 0.9,
				unit: "kg CO2/kWh",
				description: "Carbon emissions per kilowatt-hour",
				category: "environmental"
			},
			{
				name: "Regulatory Compliance",
				value: 99.5,
				unit: "%",
				description: "Regulatory compliance rate",
				category: "operational"
			}
		]
	},
	{
		id: "20",
		logo: Car,
		name: "Automotive & Mobility",
		description:
			"Vehicle manufacturing and mobility solutions with electric vehicles, autonomous systems, and sustainable transportation technologies.",
		technologies: [
			{ name: "Electric Vehicle Manufacturing", icon: Zap },
			{ name: "Battery Technology", icon: Server },
			{ name: "Autonomous Systems", icon: Building2 },
			{ name: "Mobility-as-a-Service", icon: Car },
		],
		companies: [
			{ name: "Tesla", icon: Car },
			{ name: "Volkswagen", icon: Building2 },
			{ name: "Toyota", icon: Zap },
		],
		status: "verified",
		parameters: [
			{
				name: "Manufacturing Efficiency",
				value: 88,
				unit: "%",
				description: "Vehicle manufacturing efficiency",
				category: "performance"
			},
			{
				name: "Factory CAPEX",
				value: 500000000,
				unit: "USD/factory",
				description: "Automotive factory capital expenditure",
				category: "cost"
			},
			{
				name: "Energy per Vehicle",
				value: 3000,
				unit: "kWh/vehicle",
				description: "Energy consumption per vehicle manufactured",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 2.5,
				unit: "ton CO2/vehicle",
				description: "Carbon emissions per vehicle manufactured",
				category: "environmental"
			},
			{
				name: "Quality Index",
				value: 96,
				unit: "%",
				description: "Vehicle quality performance index",
				category: "operational"
			}
		]
	},
	{
		id: "21",
		logo: ShoppingBag,
		name: "Food & Beverage",
		description:
			"Food processing and beverage production with energy-efficient manufacturing, sustainable packaging, and waste reduction technologies.",
		technologies: [
			{ name: "Food Processing Efficiency", icon: Server },
			{ name: "Sustainable Packaging", icon: Recycle },
			{ name: "Cold Chain Management", icon: Wind },
			{ name: "Waste Reduction Systems", icon: Droplets },
		],
		companies: [
			{ name: "Nestlé", icon: ShoppingBag },
			{ name: "Coca-Cola", icon: Droplets },
			{ name: "Unilever", icon: Recycle },
		],
		status: "verified",
		parameters: [
			{
				name: "Processing Efficiency",
				value: 91,
				unit: "%",
				description: "Food processing efficiency",
				category: "performance"
			},
			{
				name: "Plant CAPEX",
				value: 3000000,
				unit: "USD/ton/year",
				description: "Food processing plant capital expenditure per ton of annual capacity",
				category: "cost"
			},
			{
				name: "Energy per Ton",
				value: 400,
				unit: "kWh/ton",
				description: "Energy consumption per ton of food processed",
				category: "performance"
			},
			{
				name: "Carbon Footprint",
				value: 0.8,
				unit: "kg CO2/kg food",
				description: "Carbon emissions per kilogram of food produced",
				category: "environmental"
			},
			{
				name: "Food Safety Index",
				value: 99.8,
				unit: "%",
				description: "Food safety performance index",
				category: "operational"
			}
		]
	},
];
