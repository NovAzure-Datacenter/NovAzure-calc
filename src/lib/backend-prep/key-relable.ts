// Interface for the calculator state
interface CalculatorState {
	dataCentreType: string;
	utilisation: string;
	yearsOfOperation: string;
	projectLocation: string;
	dataHallCapacity: string;
	firstYear: string;
	airCoolingPUE: string;
	liquidCoolingPUE: string;
	showResultTable: boolean;
}

// Interface for the transformed state with new key labels
interface TransformedCalculatorState {
	'%_of_utilisation': string | null;
	'planned_years_of_operation': string | null;
	'project_location': string | null;
	'data_hall_design_capacity_mw': string | null;
	'first_year_of_operation': string | null;
	'annualised_air_ppue': string | null;
}

/**
 * Transforms calculator state to use new key labels for backend processing
 * @param state - The calculator state from the React component
 * @returns Object with transformed keys and values
 */
export function transformCalculatorState(state: CalculatorState): TransformedCalculatorState {
	return {
		'%_of_utilisation': state.utilisation !== 'none' ? state.utilisation : null,
		'planned_years_of_operation': state.yearsOfOperation || null,
		'project_location': state.projectLocation !== 'none' ? state.projectLocation : null,
		'data_hall_design_capacity_mw': state.dataHallCapacity || null,
		'first_year_of_operation': state.firstYear !== 'none' ? state.firstYear : null,
		'annualised_air_ppue': state.airCoolingPUE || null,
	};
}

