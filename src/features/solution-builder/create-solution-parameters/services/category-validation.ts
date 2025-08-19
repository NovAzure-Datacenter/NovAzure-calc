import { RESERVED_CATEGORY_NAMES, HIDDEN_CATEGORIES, CategoryValidationResult } from "@/features/solution-builder/types/types";

/**
 * Checks if a category name is reserved
 */
export function isReservedCategoryName(name: string): boolean {
	return RESERVED_CATEGORY_NAMES.includes(name.toLowerCase() as any);
}

/**
 * Checks if a category should be hidden
 */
export function isHiddenCategory(name: string): boolean {
	return HIDDEN_CATEGORIES.some(hidden => hidden.toLowerCase() === name.toLowerCase());
}

/**
 * Validates category names for creation
 */
export function validateCategoryName(name: string, allCategories: string[]): CategoryValidationResult {
	if (isReservedCategoryName(name)) {
		return {
			isValid: false,
			errorMessage: `"${name}" is a reserved category name and cannot be used.`
		};
	}

	if (name.trim() && allCategories.some(cat => cat.toLowerCase() === name.toLowerCase())) {
		return {
			isValid: false,
			errorMessage: `A category named "${name}" already exists.`
		};
	}

	if (!name.trim()) {
		return {
			isValid: false,
			errorMessage: "Category name is required."
		};
	}

	return {
		isValid: true,
		errorMessage: ""
	};
} 