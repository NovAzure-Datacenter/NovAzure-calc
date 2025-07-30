import type {
	Industry,
	Technology,
} from "../../admin/industries-and-technologies/types";
import type {
	Solution,
	SolutionType,
	Parameter,
	Calculation,
} from "../../product-and-solutions/solutions/mock-data";
import {
	Building2,
	Fuel,
	Factory,
	Hospital,
	Zap,
	Wind,
	Droplets,
	Thermometer,
} from "lucide-react";

export interface SavedCalculationScenario {
	scenario_name: string;
	associated_project_id: string;
	solution: string[];
	solution_variant: string;
	compared_to: string[]; // Array of other scenario IDs for comparison
	input_parameters: Parameter[];
	results: any[];
	client_id: string;
	user_id: string;
	created_at: string;
	updated_at: string;

}

export const mockSavedScenarios = [
	{
		scenario_name: "TestCase1 - DC",
		associated_project_id: "6870d278e9f38dbbe8a30c6c",
		solution: ["686d5186a84ea2c9381926c8"],
		solution_variant: "N/A",
		compared_to: ["TestCase2 - DC"],
		input_parameters: [
			{
				id: "facility-size",
				level: "L1",
				name: "Facility Size",
				defaultValue: 5000,
				overrideValue: 5000,
				units: "m²",
				description: "Total facility floor area",
				category: "operational",
			},
			{
				id: "cooling-load",
				level: "L2",
				name: "Cooling Load",
				defaultValue: 2000,
				overrideValue: 2000,
				units: "kW",
				description: "Total heat load to be removed",
				category: "performance",
			},
			{
				id: "equipment-cost",
				level: "L1",
				name: "Equipment Cost",
				defaultValue: 800000,
				overrideValue: 800000,
				units: "$",
				description: "Initial cost of equipment and hardware",
				category: "cost",
			},
			{
				id: "annual-energy-cost",
				level: "L1",
				name: "Annual Energy Cost",
				defaultValue: 400000,
				overrideValue: 400000,
				units: "$/year",
				description: "Annual electricity and energy costs",
				category: "cost",
			},
		],
		results: [
           {"air cooling": {
			cooling_equipment_capex: 100000,
			it_equipment_capex: 200000,
			total_capex: 300000,
			annual_cooling_opex: 10000,
			annual_it_maintenance_cost: 20000,
			total_opex_over_lifetime: 300000,
			tco_excluding_it: 400000,
			tco_including_it: 500000,
		}}],
		client_id: "686834a57d2a3dc8bb13b486",
		user_id: "6867fde0df81532d965e08ff",
		created_at: "2024-01-15T10:30:00Z",
		updated_at: "2024-01-20T14:45:00Z",
	},
    {
		scenario_name: "TestCase2 - DC",
		associated_project_id: "6870d278e9f38dbbe8a30c6c",
		solution: ["686d5186a84ea2c9381926c8"],
		solution_variant: "N/A",
		compared_to: [],
		input_parameters: [
			{
				id: "facility-size",
				level: "L1",
				name: "Facility Size",
				defaultValue: 5000,
				overrideValue: 5000,
				units: "m²",
				description: "Total facility floor area",
				category: "operational",
			},
			{
				id: "cooling-load",
				level: "L2",
				name: "Cooling Load",
				defaultValue: 2000,
				overrideValue: 2000,
				units: "kW",
				description: "Total heat load to be removed",
				category: "performance",
			},
			{
				id: "equipment-cost",
				level: "L1",
				name: "Equipment Cost",
				defaultValue: 800000,
				overrideValue: 800000,
				units: "$",
				description: "Initial cost of equipment and hardware",
				category: "cost",
			},
			{
				id: "annual-energy-cost",
				level: "L1",
				name: "Annual Energy Cost",
				defaultValue: 400000,
				overrideValue: 400000,
				units: "$/year",
				description: "Annual electricity and energy costs",
				category: "cost",
			},
		],
		results: [
           {"air cooling": {
			cooling_equipment_capex: 100000,
			it_equipment_capex: 200000,
			total_capex: 300000,
			annual_cooling_opex: 10000,
			annual_it_maintenance_cost: 20000,
			total_opex_over_lifetime: 300000,
			tco_excluding_it: 400000,
			tco_including_it: 500000,
		}}],
		client_id: "686834a57d2a3dc8bb13b486",
		user_id: "6867fde0df81532d965e08ff",
		created_at: "2024-01-15T10:30:00Z",
		updated_at: "2024-01-20T14:45:00Z",
	},
];
