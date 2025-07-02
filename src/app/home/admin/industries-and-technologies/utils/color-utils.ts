import type {
	Industry,
	Technology,
	IndustryParameter,
	TechnologyParameter,
} from "../types";

/**
 * Get color classes for industry status badges
 */
export function getIndustryStatusColor(status: Industry["status"]): string {
	switch (status) {
		case "verified":
			return "bg-green-100 text-green-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

/**
 * Get color classes for technology status badges
 */
export function getTechnologyStatusColor(status: Technology["status"]): string {
	switch (status) {
		case "verified":
			return "bg-green-100 text-green-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

/**
 * Get color classes for parameter category badges
 * Used in industry grid view and detail dialogs
 */
export function getParameterCategoryColor(category: string): string {
	switch (category) {
		case "cost":
			return "bg-blue-100 text-blue-800";
		case "performance":
			return "bg-purple-100 text-purple-800";
		case "environmental":
			return "bg-green-100 text-green-800";
		case "operational":
			return "bg-orange-100 text-orange-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

/**
 * Get color classes for parameter category badges in create dialogs
 * Slightly different color scheme used in create forms
 */
export function getCreateDialogCategoryColor(
	category: IndustryParameter["category"] | TechnologyParameter["category"]
): string {
	switch (category) {
		case "cost":
			return "bg-red-100 text-red-800";
		case "performance":
			return "bg-blue-100 text-blue-800";
		case "environmental":
			return "bg-green-100 text-green-800";
		case "other":
			return "bg-purple-100 text-purple-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

/**
 * Unified function to get status color for both industries and technologies
 */
export function getStatusColor(
	status: Industry["status"] | Technology["status"]
): string {
	if (status === "verified") {
		return "bg-green-100 text-green-800";
	} else if (status === "pending") {
		return "bg-yellow-100 text-yellow-800";
	}
	return "bg-gray-100 text-gray-800";
}

/**
 * Unified function to get category color with context awareness
 * @param category - The parameter category
 * @param context - Whether this is for create dialogs or display views
 */
export function getCategoryColor(
	category: string,
	context: "create" | "display" = "display"
): string {
	if (context === "create") {
		return getCreateDialogCategoryColor(
			category as IndustryParameter["category"]
		);
	}
	return getParameterCategoryColor(category);
}
