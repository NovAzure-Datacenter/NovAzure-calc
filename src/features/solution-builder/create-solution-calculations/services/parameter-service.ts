import { Calculation } from "@/types/types";

/**
 * Service for parameter processing and validation
 */

/**
 * Group parameters by category
 */
export function groupParametersByCategory(parameters: any[]) {
	const grouped = parameters.reduce((acc, param) => {
		const categoryName = param.category.name;
		if (!acc[categoryName]) {
			acc[categoryName] = [];
		}
		acc[categoryName].push(param);
		return acc;
	}, {} as Record<string, any[]>);

	return grouped;
}

/**
 * Group parameters with calculations for formula validation
 */
export function groupParametersWithCalculations(
	groupedParameters: Record<string, any[]>,
	calculations: Calculation[]
) {
	const grouped = { ...groupedParameters };

	if (calculations.length > 0) {
		grouped["Calculations"] = calculations.map(
			(calc) => ({
				id: calc.id,
				name: calc.name,
				description: calc.description,
				value: calc.result,
				test_value: calc.result,
				unit: calc.units,
				category: {
					name: "Calculations",
					color: "indigo",
				},
				user_interface: {
					type: "input",
					category: "Calculations",
					is_advanced: false,
				},
				output: calc.output,
				display_type: "simple",
				dropdown_options: [],
				range_min: "",
				range_max: "",
				level: calc.level || 2,
				status: calc.status,
				formula: calc.formula,
			})
		);
	}

	return grouped;
}

/**
 * Validate parameter data before saving
 */
export function validateParameterData(parameterData: any): { isValid: boolean; error?: string } {
	if (!parameterData.name.trim()) {
		return { isValid: false, error: "Parameter name is required" };
	}

	if (!parameterData.unit.trim()) {
		return { isValid: false, error: "Unit is required" };
	}

	if (!parameterData.category.trim()) {
		return { isValid: false, error: "Category is required" };
	}

	if (parameterData.user_interface?.type === "static") {
		if (
			parameterData.display_type === "simple" &&
			!parameterData.value.trim()
		) {
			return { isValid: false, error: "Value is required when provided by static" };
		} else if (
			parameterData.display_type === "range" &&
			(!parameterData.range_min.trim() ||
				!parameterData.range_max.trim())
		) {
			return { isValid: false, error: "Range min and max values are required when provided by static" };
		} else if (
			(parameterData.display_type === "dropdown" ||
				parameterData.display_type === "filter") &&
			parameterData.dropdown_options.length === 0
		) {
			return { isValid: false, error: "Options are required when provided by static" };
		}
	}

	return { isValid: true };
}

/**
 * Check for duplicate parameter names
 */
export function checkForDuplicateParameter(
	newName: string,
	existingParameters: any[]
): boolean {
	const normalizedNewName = newName.trim().toLowerCase();
	return existingParameters.some(param => 
		param.name.toLowerCase() === normalizedNewName
	);
}

/**
 * Create new parameter object
 */
export function createNewParameter(parameterData: any) {
	return {
		id: `param-${Date.now()}`,
		name: parameterData.name,
		value: parameterData.value,
		test_value: parameterData.test_value,
		unit: parameterData.unit,
		description: parameterData.description,
		information: parameterData.information,
		category: {
			name: parameterData.category,
			color: "gray",
		},
		user_interface: parameterData.user_interface,
		output: parameterData.output,
		display_type: parameterData.display_type,
		dropdown_options: parameterData.dropdown_options,
		range_min: parameterData.range_min,
		range_max: parameterData.range_max,
	};
} 