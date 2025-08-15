import { useState } from "react";

/**
 * Hook for managing parameter state
 */
export function useParameterState() {
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
		color: "blue",
	});

	const [newParameterData, setNewParameterData] = useState({
		name: "",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		information: "",
		category: "Global",
		user_interface: {
			type: "input" as "input" | "static" | "not_viewable",
			category: "Global",
			is_advanced: false,
		},
		output: false,
		display_type: "simple" as "simple" | "dropdown" | "range" | "filter",
		dropdown_options: [] as Array<{ key: string; value: string }>,
		range_min: "",
		range_max: "",
	});

	const resetNewParameterData = () => {
		setNewParameterData({
			name: "",
			value: "",
			test_value: "",
			unit: "",
			description: "",
			information: "",
			category: "Global",
			user_interface: {
				type: "input",
				category: "Global",
				is_advanced: false,
			},
			output: false,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
		});
	};

	const resetNewCategoryData = () => {
		setNewCategoryData({
			name: "",
			description: "",
			color: "blue",
		});
	};

	return {
		// Parameter state
		newParameterData,
		setNewParameterData,
		resetNewParameterData,
		
		// Category state
		newCategoryData,
		setNewCategoryData,
		resetNewCategoryData,
	};
} 