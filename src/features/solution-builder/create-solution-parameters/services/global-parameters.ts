import { Parameter } from "@/types/types";
import { getAllGlobalParameters } from "@/lib/actions/global-parameters/global-parameters";

/**
 * Loads global parameters if the parameters array is empty
 */
export async function loadGlobalParametersIfNeeded(
	parameters: Parameter[],
	onParametersChange: (parameters: Parameter[]) => void
): Promise<void> {
	if (parameters.length === 0) {
		try {
			const globalParams = await getAllGlobalParameters();
			const globalParamCopies = createGlobalParameterCopies(globalParams, []);
			onParametersChange(globalParamCopies);
		} catch (error) {
			console.error(
				"Global Parameters Service - Error loading global parameters:",
				error
			);
		}
	}
}

/**
 * Creates copies of global parameters with correct ID convention
 */
export function createGlobalParameterCopies(
	globalParams: any[],
	existingParameters: Parameter[] = []
): Parameter[] {
	const existingParamNames = new Set(
		existingParameters.map((param) => param.name)
	);


	const standardParameters = {
		name: "Planned years of operation",
		value: "10",
		unit: "years",
		description: "The number of years the solution is planned to operate for.",
		category: {
			name: "standard",
			color: "blue",
		},
		user_interface: {
			type: "input",
			category: "",
			is_advanced: false,
		},
		is_modifiable: false,
		is_unified: false,
		is_mandatory: false,
		output: false,
		display_type: "range",
		dropdown_options: [],
		range_min: "1",
		range_max: "10",
		conditional_rules: [],
	};

	return globalParams
		.filter((globalParam) => !existingParamNames.has(globalParam.name))
		.map((globalParam) => {
			const transformedParam = {
				...globalParam,
				id: `param-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				user_interface: {
					type: "not_viewable",
					category: globalParam.category?.name || "Global",
					is_advanced: false,
				},
			};
			return transformedParam;
		});
}
