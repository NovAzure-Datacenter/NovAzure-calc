import { Parameter } from "@/types/types";

/**
 * Returns sorted categories with Global first, then alphabetically
 */
export function getSortedCategories(
	parameters: Parameter[],
	customCategories: Array<{ name: string; color: string }>
): string[] {
	const uniqueCategories = Array.from(
		new Set(parameters.map((param) => param.category.name))
	);
	const customCategoryNames = customCategories.map((cat) => cat.name);
	const allCategoryNames = Array.from(
		new Set([...uniqueCategories, ...customCategoryNames])
	);

	return allCategoryNames.sort((a, b) => {
		if (a === "Global") return -1;
		if (b === "Global") return 1;
		return a.localeCompare(b);
	});
}

/**
 * Filters parameters based on active tab and search query
 */
export function getFilteredParameters(
	parameters: any[],
	activeTab: string,
	searchQuery: string,
	activeCategories: string[] = []
) {
	let filtered = parameters;

	// Filter by active categories
	if (activeCategories.length > 0 && !activeCategories.includes("all")) {
		filtered = filtered.filter((param) =>
			activeCategories.includes(param.category.name)
		);
	}

	// Filter by search query
	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase();
		filtered = filtered.filter((param) =>
			param.parameterName.toLowerCase().includes(query) ||
			param.description.toLowerCase().includes(query) ||
			param.category.name.toLowerCase().includes(query)
		);
	}

	return filtered;
}