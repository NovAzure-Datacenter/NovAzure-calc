import { Parameter } from "@/types/types";
import { ParameterEditData } from "@/features/solution-builder/types/types";

/**
 * Returns default parameter edit data with sensible defaults
 */
export function getDefaultParameterEditData(): ParameterEditData {
	return {
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		category: "Global",
		user_interface: {
			type: "input",
			category: "Global",
			is_advanced: false,
		},
		output: false,
		display_type: "simple",
		dropdown_options: [],
		range_min: "",
		range_max: "",
		conditional_rules: [],
	};
}

/**
 * Converts a Parameter object to ParameterEditData for editing
 */
export function convertParameterToEditData(parameter: Parameter): ParameterEditData {
	return {
		name: parameter.name,
		value: parameter.value,
		test_value: parameter.test_value,
		unit: parameter.unit,
		description: parameter.description,
		category: parameter.category.name,
		user_interface: {
			type:
				typeof parameter.user_interface === "string"
					? (parameter.user_interface as "input" | "static" | "not_viewable")
					: parameter.user_interface?.type || "input",
			category:
				typeof parameter.user_interface === "string"
					? parameter.category.name
					: parameter.user_interface?.category || "",
			is_advanced:
				typeof parameter.user_interface === "string"
					? false
					: parameter.user_interface?.is_advanced || false
		},
		output: parameter.output,
		display_type: parameter.display_type,
		dropdown_options: parameter.dropdown_options || [],
		range_min: parameter.range_min || "",
		range_max: parameter.range_max || "",
		conditional_rules: parameter.conditional_rules || [],
	};
}

/**
 * Converts ParameterEditData back to a Parameter object
 */
export function convertEditDataToParameter(
	editData: ParameterEditData,
	categoryColor: string,
	id: string
): Parameter {
	return {
		id,
		level: "1",
		name: editData.name.trim(),
		value: editData.value,
		test_value: editData.test_value,
		unit: editData.unit,
		description: editData.description,
		category: {
			name: editData.category,
			color: categoryColor,
		},
		user_interface: {
			type: editData.user_interface?.type || "input",
			category: editData.user_interface?.category || "",
			is_advanced: editData.user_interface?.is_advanced || false
		},
		output: editData.output,
		display_type: editData.display_type,
		dropdown_options: editData.dropdown_options,
		range_min: editData.range_min,
		range_max: editData.range_max,
		conditional_rules: editData.conditional_rules,
		is_modifiable: true,
	};
} 