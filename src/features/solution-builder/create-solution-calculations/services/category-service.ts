import { Calculation } from "@/types/types";
import { CustomCalculationCategory } from "../../utils/calculation-color-utils";

/**
 * Service for managing calculation categories
 */

/**
 * Extract available categories from calculations
 */
export function extractAvailableCategories(calculations: Calculation[]) {
	const extractedCategories = new Set<string>();
	
	// Add default categories
	extractedCategories.add("capex");
	extractedCategories.add("opex");
	
	// Extract categories from calculations
	calculations.forEach(calculation => {
		if (calculation.category) {
			const categoryName = typeof calculation.category === "string" 
				? calculation.category 
				: calculation.category.name;
			if (categoryName) {
				extractedCategories.add(categoryName.toLowerCase());
			}
		}
	});
	
	const categoryObjects = Array.from(extractedCategories).map(name => {
		const defaultColors: Record<string, string> = {
			capex: "bg-green-50 text-green-700 border-green-200",
			opex: "bg-blue-50 text-blue-700 border-blue-200",
		};
		
		return {
			name: name,
			color: defaultColors[name.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"
		};
	});
	
	return categoryObjects;
}

/**
 * Get all available categories including custom ones
 */
export function getAllAvailableCategories(
	availableCategories: Array<{ name: string; color: string }>,
	customCategories?: CustomCalculationCategory[]
) {
	const allCategories = [...availableCategories];
	
	if (customCategories) {
		customCategories.forEach(customCat => {
			if (!allCategories.find(cat => cat.name.toLowerCase() === customCat.name.toLowerCase())) {
				allCategories.push({
					name: customCat.name,
					color: customCat.color
				});
			}
		});
	}
	
	return allCategories;
}

/**
 * Get all categories for tabs (including custom categories)
 */
export function getAllCategories(
	availableCategories: Array<{ name: string; color: string }>,
	customCategories?: CustomCalculationCategory[]
) {
	const allCategories = getAllAvailableCategories(availableCategories, customCategories);
	
	// Return just the category names as strings
	return ["all", ...allCategories.map(cat => cat.name)];
}

/**
 * Get category color by name
 */
export function getCategoryColorByName(
	categoryName: string,
	availableCategories: Array<{ name: string; color: string }>,
	customCategories?: CustomCalculationCategory[]
) {
	const allCategories = getAllAvailableCategories(availableCategories, customCategories);
	const category = allCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
	return category?.color || "bg-gray-50 text-gray-700 border-gray-200";
}

/**
 * Get category badge style for inline styles
 */
export function getCategoryBadgeStyle(
	categoryName: string,
	availableCategories: Array<{ name: string; color: string }>,
	customCategories?: CustomCalculationCategory[]
) {
	const categoryColor = getCategoryColorByName(categoryName, availableCategories, customCategories);
	
	const colorMatch = categoryColor.match(/bg-(\w+)-\d+/);
	if (colorMatch) {
		const colorName = colorMatch[1];
		return {
			backgroundColor: `var(--${colorName}-50)`,
			borderColor: `var(--${colorName}-200)`,
			color: `var(--${colorName}-700)`,
		};
	}
	return {};
} 