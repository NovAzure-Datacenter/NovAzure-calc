import { useState } from "react";
import { CalculationEditData } from "../../types/types";

/**
 * Hook for managing calculation editing state
 */
export function useCalculationState() {
	const [editingCalculation, setEditingCalculation] = useState<string | null>(null);
	const [editData, setEditData] = useState<CalculationEditData>({
		name: "",
		formula: "",
		units: "",
		description: "",
		category: "capex",
		output: false,
		display_result: false,
	});

	const [isAddingCalculation, setIsAddingCalculation] = useState(false);
	const [newCalculationData, setNewCalculationData] = useState({
		name: "",
		description: "",
		formula: "",
		units: "",
		category: "capex",
		output: false,
		display_result: false,
	});

	const resetEditData = () => {
		setEditData({
			name: "",
			formula: "",
			units: "",
			description: "",
			category: "capex",
			output: false,
			display_result: false,
		});
	};

	const resetNewCalculationData = () => {
		setNewCalculationData({
			name: "",
			description: "",
			formula: "",
			units: "",
			category: "capex",
			output: false,
			display_result: false,
		});
	};

	return {
		// Editing state
		editingCalculation,
		setEditingCalculation,
		editData,
		setEditData,
		resetEditData,
		
		// Adding state
		isAddingCalculation,
		setIsAddingCalculation,
		newCalculationData,
		setNewCalculationData,
		resetNewCalculationData,
	};
} 