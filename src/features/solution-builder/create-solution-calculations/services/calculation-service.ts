import { Calculation } from "@/types/types";
// import { getCategoryColorByName } from "./category-service";

/**
 * Service for calculation management
 */

/**
 * Filter calculations by active tab
 */
export function filterCalculationsByCategory(
	calculations: Calculation[],
	activeTab: string
): Calculation[] {
	if (activeTab === "all") {
		return calculations;
	}

	return calculations.filter((calc) => {
		if (!calc.category) {
			return false;
		}

		const categoryName = (() => {
			if (typeof calc.category === "string") {
				return (calc.category as string).toLowerCase();
			}
			return (calc.category?.name || "").toLowerCase();
		})();

		return categoryName?.toLowerCase() === activeTab.toLowerCase();
	});
}

/**
 * Filter calculations by search query
 */
export function filterCalculationsBySearch(
	calculations: Calculation[],
	searchQuery: string
): Calculation[] {
	if (!searchQuery.trim()) {
		return calculations;
	}

	const query = searchQuery.toLowerCase();
	return calculations.filter((calc) => {
		const name = calc.name.toLowerCase();
		const description = calc.description.toLowerCase();
		const formula = calc.formula.toLowerCase();
		const units = calc.units.toLowerCase();
		const status = String(calc.status || "").toLowerCase();
		const categoryName = (() => {
			if (typeof calc.category === "string") {
				return (calc.category as string).toLowerCase();
			}
			return (calc.category?.name || "").toLowerCase();
		})();

		return (
			name.includes(query) ||
			description.includes(query) ||
			formula.includes(query) ||
			units.includes(query) ||
			status.includes(query) ||
			categoryName.includes(query)
		);
	});
}

/**
 * Get filtered calculations applying both category and search filters
 */
export function getFilteredCalculations(
	calculations: Calculation[],
	activeTab: string,
	searchQuery: string
): Calculation[] {
	let filtered = filterCalculationsByCategory(calculations, activeTab);
	filtered = filterCalculationsBySearch(filtered, searchQuery);
	return filtered;
}

/**
 * Get status color for calculation status badges
 */
export function getStatusColor(status: string): string {
	switch (status) {
		case "valid":
			return "bg-green-100 text-green-800";
		case "error":
			return "bg-red-100 text-red-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
} 

// export function getCategoryColor(category: string) {
// 	return getCategoryColorByName(category);
// }