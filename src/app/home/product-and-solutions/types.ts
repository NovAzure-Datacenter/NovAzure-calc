// Centralized types for product-and-solutions module

export interface Parameter {
	id: string;
	name: string;
	value: string;
	test_value: string;
	unit: string;
	description: string;
	information: string;
	provided_by: string;
	input_type: string;
	output: boolean;
	level: string;
	display_type: "simple" | "dropdown" | "range" | "filter";
	dropdown_options?: Array<{ key: string; value: string }>;
	range_min?: string;
	range_max?: string;
	category: {
		name: string;
		color: string;
	};
	is_modifiable: boolean;
}

export interface Calculation {
	id: string;
	name: string;
	formula: string;
	result: number | string;
	units: string;
	description: string;
	status: "valid" | "error" | "pending";
	category: {
		name: string;
		color: string;
	};
	output: boolean;
	display_result: boolean;
	level: number;
}

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
