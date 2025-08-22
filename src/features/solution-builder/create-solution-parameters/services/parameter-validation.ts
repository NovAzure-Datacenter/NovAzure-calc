import { Parameter } from "@/types/types";
import { ParameterEditData, ParameterValidationResult } from "@/features/solution-builder/types/types";

/**
 * Validates parameter edit data for required fields, duplicates, and type-specific requirements
 */
export function validateParameterEditData(
	editData: ParameterEditData,
	existingParameters: Parameter[] = []
): ParameterValidationResult {
	// Basic validation - check required fields
	if (!editData.name.trim() || !editData.unit.trim() ) {
		return {
			isValid: false,
			errorMessage: "Name, unit, and category are required fields."
		};
	}

	const normalizedNewName = editData.name.trim().toLowerCase();
	const hasDuplicate = existingParameters.some(param => 
		param.name.toLowerCase() === normalizedNewName
	);
	
	if (hasDuplicate) {
		return {
			isValid: false,
			errorMessage: `A parameter named "${editData.name.trim()}" already exists.`,
		};
	}

	if (editData.user_interface?.type === "static") {
		if (editData.display_type === "simple" && !editData.value.trim()) {
			return {
				isValid: false,
				errorMessage: "Static parameters with simple display require a value.",
			};
		}

		if (
			editData.display_type === "range" &&
			(!editData.range_min.trim() || !editData.range_max.trim())
		) {
			return {
				isValid: false,
				errorMessage:
					"Static parameters with range display require both min and max values.",
			};
		}

		if (
			(editData.display_type === "dropdown" ||
				editData.display_type === "filter") &&
			editData.dropdown_options.length === 0
		) {
			return {
				isValid: false,
				errorMessage:
					"Static parameters with dropdown/filter display require options.",
			};
		}
	}

	return {
		isValid: true,
		errorMessage: "",
	};
} 