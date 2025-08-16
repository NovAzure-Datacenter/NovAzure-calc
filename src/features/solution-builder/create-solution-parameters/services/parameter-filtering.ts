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
	parameters: Parameter[],
	activeTab: string,
	searchQuery: string
): Parameter[] {
	return parameters.filter((param) => {
		// Filter by active tab
		let tabFiltered = false;

		if (activeTab === "all") {
			tabFiltered = true;
		} else if (activeTab === "Global") {
			tabFiltered = [
				"Global",
				"Industry",
				"Technology",
				"Technologies",
			].includes(param.category.name);
		} else {
			tabFiltered = param.category.name === activeTab;
		}

		// Filter by search query
		const searchFiltered =
			searchQuery.trim() === "" ||
			param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.test_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
			param.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(typeof param.user_interface === "string"
				? (param.user_interface as string).toLowerCase().includes(searchQuery.toLowerCase())
				: param.user_interface?.type
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) || false) ||
			param.output.toString().toLowerCase().includes(searchQuery.toLowerCase());

		return tabFiltered && searchFiltered;
	});
} 