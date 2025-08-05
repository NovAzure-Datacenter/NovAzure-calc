import { Parameter } from "@/types/types";


interface ColorStyle {
	backgroundColor: string;
	color: string;
	borderColor: string;
}

interface ActiveTabStyle extends ColorStyle {
	fontWeight: "600";
}

interface CustomCategory {
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
		backgroundColor: "#4b5563",
		color: "#ffffff",
		borderColor: "#4b5563",
	},
};

const tailwindColorMap: Record<string, string> = {
	red: "!bg-red-100 !text-red-800 !border-red-300",
	blue: "!bg-blue-100 !text-blue-800 !border-blue-300",
	green: "!bg-green-100 !text-green-800 !border-green-300",
	yellow: "!bg-yellow-100 !text-yellow-800 !border-yellow-300",
	purple: "!bg-purple-100 !text-purple-800 !border-purple-300",
	orange: "!bg-orange-100 !text-orange-800 !border-orange-300",
	pink: "!bg-pink-100 !text-pink-800 !border-pink-300",
	teal: "!bg-teal-100 !text-teal-800 !border-teal-300",
	indigo: "!bg-indigo-100 !text-indigo-800 !border-indigo-300",
	cyan: "!bg-cyan-100 !text-cyan-800 !border-cyan-300",
	gray: "!bg-gray-100 !text-gray-800 !border-gray-300",
};

const levelColorMap: Record<string, string> = {
	L1: "bg-blue-100 text-blue-800",
	L2: "bg-green-100 text-green-800",
	L3: "bg-yellow-100 text-yellow-800",
	L4: "bg-purple-100 text-purple-800",
};

/**
 * Get the color name for a category
 */
export function getCategoryColorName(
	categoryName: string,
	parameters: Parameter[],
	customCategories: CustomCategory[]
): string {
	const customCategory = customCategories.find(
		(cat) => cat.name === categoryName
	);
	if (customCategory) {
		return customCategory.color;
	}

	const parameter = parameters.find(
		(param) => param.category.name === categoryName
	);
	return parameter?.category.color || "gray";
}

/**
 * Get category style for tabs and badges
 */
export function getCategoryStyle(
	categoryName: string,
	parameters: Parameter[],
	customCategories: CustomCategory[]
): ColorStyle {
	const colorName = getCategoryColorName(
		categoryName,
		parameters,
		customCategories
	);
	return colorMap[colorName] || colorMap.gray;
}

/**
 * Get active tab style with vibrant colors
 */
export function getActiveTabStyle(
	categoryName: string,
	parameters: Parameter[],
	customCategories: CustomCategory[]
): ActiveTabStyle {
	const colorName = getCategoryColorName(
		categoryName,
		parameters,
		customCategories
	);
	const activeStyle = vibrantColorMap[colorName] || vibrantColorMap.gray;
	return {
		...activeStyle,
		fontWeight: "600" as const,
	};
}

/**
 * Get category badge style for table display
 */
export function getCategoryBadgeStyle(
	categoryName: string,
	parameters: Parameter[],
	customCategories: CustomCategory[]
): ColorStyle {
	return getCategoryStyle(categoryName, parameters, customCategories);
}

/**
 * Get category badge style for dropdown display
 */
export function getCategoryBadgeStyleForDropdown(
	categoryName: string,
	parameters: Parameter[],
	customCategories: CustomCategory[]
): ColorStyle {
	return getCategoryStyle(categoryName, parameters, customCategories);
}

/**
 * Get Tailwind CSS classes for category colors
 */
export function getCategoryTailwindClasses(
	categoryName: string,
	parameters: Parameter[],
	customCategories: CustomCategory[]
): string {
	const colorName = getCategoryColorName(
		categoryName,
		parameters,
		customCategories
	);
	return tailwindColorMap[colorName] || tailwindColorMap.gray;
}

/**
 * Get level color classes
 */
export function getLevelColor(level: string): string {
	return levelColorMap[level] || "bg-gray-100 text-gray-800";
}

/**
 * Get available color options for category creation
 */
export function getAvailableColors(): string[] {
	return Object.keys(colorMap);
}
