import { Calculation } from "@/types/types";

interface ColorStyle {
	backgroundColor: string;
	color: string;
	borderColor: string;
}

interface ActiveTabStyle extends ColorStyle {
	fontWeight: "600";
}

interface CustomCalculationCategory {
	name: string;
	color: string;
}

const colorMap: Record<string, ColorStyle> = {
	red: {
		backgroundColor: "#fef2f2",
		color: "#991b1b",
		borderColor: "#fca5a5",
	},
	blue: {
		backgroundColor: "#eff6ff",
		color: "#1e40af",
		borderColor: "#93c5fd",
	},
	green: {
		backgroundColor: "#f0fdf4",
		color: "#166534",
		borderColor: "#86efac",
	},
	yellow: {
		backgroundColor: "#fefce8",
		color: "#a16207",
		borderColor: "#fde047",
	},
	purple: {
		backgroundColor: "#faf5ff",
		color: "#7c3aed",
		borderColor: "#c4b5fd",
	},
	orange: {
		backgroundColor: "#fff7ed",
		color: "#c2410c",
		borderColor: "#fdba74",
	},
	pink: {
		backgroundColor: "#fdf2f8",
		color: "#be185d",
		borderColor: "#f9a8d4",
	},
	teal: {
		backgroundColor: "#f0fdfa",
		color: "#134e4a",
		borderColor: "#5eead4",
	},
	indigo: {
		backgroundColor: "#eef2ff",
		color: "#3730a3",
		borderColor: "#a5b4fc",
	},
	cyan: {
		backgroundColor: "#ecfeff",
		color: "#0e7490",
		borderColor: "#67e8f9",
	},
	gray: {
		backgroundColor: "#f9fafb",
		color: "#374151",
		borderColor: "#d1d5db",
	},
};

const vibrantColorMap: Record<string, ColorStyle> = {
	red: {
		backgroundColor: "#dc2626",
		color: "#ffffff",
		borderColor: "#dc2626",
	},
	blue: {
		backgroundColor: "#2563eb",
		color: "#ffffff",
		borderColor: "#2563eb",
	},
	green: {
		backgroundColor: "#16a34a",
		color: "#ffffff",
		borderColor: "#16a34a",
	},
	yellow: {
		backgroundColor: "#ca8a04",
		color: "#ffffff",
		borderColor: "#ca8a04",
	},
	purple: {
		backgroundColor: "#9333ea",
		color: "#ffffff",
		borderColor: "#9333ea",
	},
	orange: {
		backgroundColor: "#ea580c",
		color: "#ffffff",
		borderColor: "#ea580c",
	},
	pink: {
		backgroundColor: "#db2777",
		color: "#ffffff",
		borderColor: "#db2777",
	},
	teal: {
		backgroundColor: "#0d9488",
		color: "#ffffff",
		borderColor: "#0d9488",
	},
	indigo: {
		backgroundColor: "#4f46e5",
		color: "#ffffff",
		borderColor: "#4f46e5",
	},
	cyan: {
		backgroundColor: "#0891b2",
		color: "#ffffff",
		borderColor: "#0891b2",
	},
	gray: {
		backgroundColor: "#6b7280",
		color: "#ffffff",
		borderColor: "#6b7280",
	},
};

// Default calculation categories with their colors
const defaultCalculationCategories: Record<string, string> = {
	capex: "blue",
	opex: "green",
};

export function getCalculationCategoryColorName(
	categoryName: string,
	calculations: Calculation[],
	customCategories: CustomCalculationCategory[]
): string {
	const customCategory = customCategories.find(
		(cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
	);
	if (customCategory) {
		return customCategory.color;
	}

	if (defaultCalculationCategories[categoryName.toLowerCase()]) {
		return defaultCalculationCategories[categoryName.toLowerCase()];
	}

	return "gray";
}

export function getCalculationCategoryStyle(
	categoryName: string,
	calculations: Calculation[],
	customCategories: CustomCalculationCategory[]
): ColorStyle {
	const colorName = getCalculationCategoryColorName(
		categoryName,
		calculations,
		customCategories
	);
	return colorMap[colorName] || colorMap.gray;
}

export function getCalculationActiveTabStyle(
	categoryName: string,
	calculations: Calculation[],
	customCategories: CustomCalculationCategory[]
): ActiveTabStyle {
	const colorName = getCalculationCategoryColorName(
		categoryName,
		calculations,
		customCategories
	);
	const baseStyle = vibrantColorMap[colorName] || vibrantColorMap.gray;
	return {
		...baseStyle,
		fontWeight: "600",
	};
}

export function getCalculationCategoryBadgeStyle(
	categoryName: string,
	calculations: Calculation[],
	customCategories: CustomCalculationCategory[]
): ColorStyle {
	const colorName = getCalculationCategoryColorName(
		categoryName,
		calculations,
		customCategories
	);
	return colorMap[colorName] || colorMap.gray;
}

export function getCalculationCategoryBadgeStyleForDropdown(
	categoryName: string,
	calculations: Calculation[],
	customCategories: CustomCalculationCategory[]
): ColorStyle {
	const colorName = getCalculationCategoryColorName(
		categoryName,
		calculations,
		customCategories
	);
	return colorMap[colorName] || colorMap.gray;
}

export function getCalculationCategoryTailwindClasses(
	categoryName: string,
	calculations: Calculation[],
	customCategories: CustomCalculationCategory[]
): string {
	const colorName = getCalculationCategoryColorName(
		categoryName,
		calculations,
		customCategories
	);
	
	const colorClasses: Record<string, string> = {
		red: "bg-red-50 text-red-700 border-red-200",
		blue: "bg-blue-50 text-blue-700 border-blue-200",
		green: "bg-green-50 text-green-700 border-green-200",
		yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
		purple: "bg-purple-50 text-purple-700 border-purple-200",
		orange: "bg-orange-50 text-orange-700 border-orange-200",
		pink: "bg-pink-50 text-pink-700 border-pink-200",
		teal: "bg-teal-50 text-teal-700 border-teal-200",
		indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
		cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
		gray: "bg-gray-50 text-gray-700 border-gray-200",
	};

	return colorClasses[colorName] || colorClasses.gray;
}

export function getAvailableColors(): string[] {
	return Object.keys(colorMap);
}

export { type CustomCalculationCategory }; 