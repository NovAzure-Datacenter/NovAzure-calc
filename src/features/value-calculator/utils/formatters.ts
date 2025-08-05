
/**
 * Format currency values with appropriate units (K, M)
 * @param value - The numeric value to format
 * @returns Formatted currency string with appropriate unit
 */
export const formatCurrency = (value: number): string => {
	if (value >= 1000000) {
		return `$${(value / 1000000).toFixed(1)}M`;
	} else if (value >= 1000) {
		return `$${(value / 1000).toFixed(1)}K`;
	} else {
		return `$${value.toFixed(0)}`;
	}
};

/**
 * Helper function to format range values as percentages for display
 */
export const formatRangeValue = (value: string, unit?: string) => {
	if (unit === "%") {
		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			return Math.round(numValue * 100).toString();
		}
	}
	return value;
};

/**
 * Helper function to convert percentage input back to decimal for storage
 */
export const convertPercentageToDecimal = (value: string, unit?: string) => {
	if (unit === "%") {
		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			// Round to 4 decimal places to avoid floating point precision issues
			return (numValue / 100).toFixed(4);
		}
	}
	return value;
};

/**
 * Helper function to convert decimal to percentage for display
 */
export const convertDecimalToPercentage = (value: string, unit?: string) => {
	if (unit === "%") {
		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			// Round to avoid floating point precision issues
			return Math.round(numValue * 100).toString();
		}
	}
	return value;
};

/**
 * Format percentage values with proper decimal places
 * @param percentChange - The percentage change string (e.g., "5.2%")
 * @returns Formatted percentage string
 */
export const formatPercentage = (percentChange: string): string => {
	const value = parseFloat(percentChange.replace(/[^0-9.-]/g, ""));
	if (Math.abs(value) < 0.1) return "0.0%";
	return value.toFixed(1) + "%";
};

/**
 * Get color class for difference values based on whether it's positive or negative
 * @param difference - The numeric difference value
 * @returns CSS color class string
 */
export const getDifferenceColor = (difference: number): string => {
	if (difference < 0) return "text-green-600";
	if (difference > 0) return "text-red-600";
	return "text-gray-600";
};

/**
 * Get color class for percentage change values
 * @param percentChange - The percentage change string (e.g., "5.2%")
 * @returns CSS color class string
 */
export const getPercentChangeColor = (percentChange: string): string => {
	const value = parseFloat(percentChange.replace(/[^0-9.-]/g, ""));
	if (value < 0) return "text-green-600"; 
	if (value > 0) return "text-red-600"; 
	return "text-gray-600";
};

/**
 * Format metric names for display by converting underscores to spaces and capitalizing words
 * @param key - The original metric key (e.g., "total_cost_per_year")
 * @returns Formatted metric name (e.g., "Total Cost Per Year")
 */
export const formatMetricName = (key: string): string => {
	return key
		.replace(/_/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase())
		.replace(/\b\w+/g, (word) => {
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		});
};

/**
 * Transform raw result data into comparison row format
 * @param resultData - The raw result data from calculations
 * @param comparisonMode - The current comparison mode ("single" or "compare")
 * @returns Array of comparison row objects
 */
export const transformResultData = (
	resultData: any,
	comparisonMode?: "single" | "compare" | null
): ComparisonRow[] => {
	if (!resultData || typeof resultData !== "object") {
		return [];
	}

	const comparisonRows: ComparisonRow[] = [];

	if (comparisonMode === "single") {
		// Single mode - use solutionA data directly
		const singleData = resultData.solutionA || resultData;
		if (!singleData || typeof singleData !== "object") {
			return [];
		}

		const keys = Object.keys(singleData);

		// Transform each key-value pair into a table row
		keys.forEach((key) => {
			const value = singleData[key];
			const formattedMetric = formatMetricName(key);
			const numericValue =
				typeof value === "number" ? value : parseFloat(String(value)) || 0;

			comparisonRows.push({
				metric: formattedMetric,
				variantA: numericValue,
				variantB: numericValue, 
				difference: 0,
				percentChange: "0.0%",
			});
		});
	} else if (comparisonMode === "compare") {
		// Compare mode - use both solutionA and solutionB data
		const solutionAData = resultData.solutionA;
		const solutionBData = resultData.solutionB;

		if (!solutionAData || !solutionBData) {
			return [];
		}

		// Get all unique keys from both solutions
		const allKeys = new Set([
			...Object.keys(solutionAData),
			...Object.keys(solutionBData),
		]);

		// Transform each key-value pair into a table row
		allKeys.forEach((key) => {
			const valueA = solutionAData[key];
			const valueB = solutionBData[key];
			const formattedMetric = formatMetricName(key);

			const numericValueA =
				typeof valueA === "number" ? valueA : parseFloat(String(valueA)) || 0;
			const numericValueB =
				typeof valueB === "number" ? valueB : parseFloat(String(valueB)) || 0;
			const difference = numericValueB - numericValueA;
			const percentChange =
				numericValueA !== 0
					? ((difference / numericValueA) * 100).toFixed(1) + "%"
					: "0.0%";

			comparisonRows.push({
				metric: formattedMetric,
				variantA: numericValueA,
				variantB: numericValueB,
				difference: difference,
				percentChange: percentChange,
			});
		});
	}

	return comparisonRows;
};

/**
 * Transform result data into chart format for visualization
 * @param resultData - The raw result data from calculations
 * @returns Array of chart data objects
 */
export const transformDataForChart = (resultData: any): GraphData[] => {
	if (!resultData || !resultData.solutionA || !resultData.solutionB) {
		return [];
	}

	const solutionAData = resultData.solutionA;
	const solutionBData = resultData.solutionB;

	// Get all unique keys from both solutions
	const allKeys = new Set([
		...Object.keys(solutionAData),
		...Object.keys(solutionBData),
	]);

	const chartData = Array.from(allKeys).map((key) => {
		const valueA = solutionAData[key] || 0;
		const valueB = solutionBData[key] || 0;

		const formattedName = formatMetricName(key);

		return {
			name: formattedName,
			solutionA:
				typeof valueA === "number" ? valueA : parseFloat(String(valueA)) || 0,
			solutionB:
				typeof valueB === "number" ? valueB : parseFloat(String(valueB)) || 0,
			originalKey: key, 
		};
	});

	// Sort by the difference between solutions (most significant differences first)
	return chartData
		.sort((a, b) => {
			const diffA = Math.abs(a.solutionB - a.solutionA);
			const diffB = Math.abs(b.solutionB - b.solutionA);
			return diffB - diffA;
		})
		.slice(0, 8) 
		.map(({ originalKey, ...rest }) => rest);
};

/**
 * ComparisonRow interface - Defines structure for comparison row data
 */
export interface ComparisonRow {
	metric: string;
	variantA: number;
	variantB: number;
	difference: number;
	percentChange: string;
}

/**
 * GraphData interface - Defines structure for chart data
 */
export interface GraphData {
	name: string;
	solutionA: number;
	solutionB: number;
}
