import { getClientByUserId } from "@/lib/actions/clients/clients";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { 
	getSolutionTypesByIndustryAndTechnology,
	createSolution,
	updateSolution 
} from "@/lib/actions/solution/solution";
import {
	createSolutionVariant,
	getSolutionVariantsBySolutionId,
	updateSolutionVariant,
	updateSolutionVariantSolutionId,
} from "@/lib/actions/solution-variant/solution-variant";
import { 
	getClientSolutions, 
	createClientSolution, 
	updateClientSolution,
	getClientSolutionsByIndustryAndTechnology
} from "@/lib/actions/clients-solutions/clients-solutions";
import { getAllGlobalParameters } from "@/lib/actions/global-parameters/global-parameters";
import { Parameter } from "@/types/types";
import { Calculation } from "@/types/types";

// Re-export types for centralized access
export type { Parameter } from "@/types/types";
export type { Calculation } from "@/types/types";

/**
 * Fetch initial data for solution builder
 * Loads client data, industries, technologies, and global parameters
 * Used for initial setup of the solution builder
 */
export const fetchInitialData = async (userId: string) => {
	try {
		// Load client data
		const clientResult = await getClientByUserId(userId);
		if (!clientResult.client) {
			return {
				clientData: null,
				industries: [],
				technologies: [],
			};
		}

		const clientData = clientResult.client;

		// Load industries
		const industriesResult = await getIndustries();
		const industries = industriesResult.success ? (industriesResult.industries || []) : [];

		// Load technologies
		const technologiesResult = await getTechnologies();
		const technologies = technologiesResult.success ? (technologiesResult.technologies || []) : [];


		return {
			clientData,
			industries,
			technologies
		};
	} catch (error) {
		console.error("Error loading initial data:", error);
		throw new Error("Failed to load initial data");
	}
};

/**
 * Fetch solution types based on selected industry and technology
 * Retrieves client solutions available for the industry/technology combination
 * Used when user selects industry and technology to populate solution options
 */
export const fetchSolutionTypes = async (industryId: string, technologyId: string, clientId: string) => {
	if (!industryId || !technologyId || !clientId) {
		return [];
	}

	try {
		const result = await getClientSolutionsByIndustryAndTechnology(clientId, industryId, technologyId);
		
		// Transform client solutions to match expected format


		return result;
	} catch (error) {
		console.error("Error fetching solution types:", error);
		throw new Error("Failed to load solution types");
	}
};



/**
 * Fetch existing solution data (parameters and calculations)
 * Loads existing solution data for editing or reference
 * Used when user selects an existing solution variant
 */
export const fetchExistingSolutionData = async (solutionVariantId: string, clientData: any, existingParameters: Parameter[] = []) => {
	if (!solutionVariantId || !clientData?.id) {
		return {
			parameters: [],
			calculations: [],
			existingSolution: null
		};
	}

	try {
		if (!solutionVariantId.startsWith("new-variant-") && solutionVariantId !== "new") {
			const existingSolutions = await getClientSolutions(clientData.id);
			if (existingSolutions.solutions) {
				const existingSolution = existingSolutions.solutions.find(
					(solution) => solution.id === solutionVariantId
				);
				console.log("existingSolution", existingSolution)

				if (existingSolution) {
					// Load global parameters and merge with existing parameters
					const globalParams = await getAllGlobalParameters();
					const existingParamsMap = new Map(
						existingSolution.parameters?.map((param) => [param.id, param]) || []
					);

					const globalParamCopies = createGlobalParameterCopies(
						globalParams.filter((globalParam) => !existingParamsMap.has(globalParam.id)),
						existingSolution.parameters || []
					);

					const mergedParameters = [
						...globalParamCopies,
						...(existingSolution.parameters || []),
					];

					return {
						parameters: mergedParameters,
						calculations: existingSolution.calculations || [],
						existingSolution
					};
				}
			}
		}

		// Default: return global parameters for new variants
		const globalParams = await getAllGlobalParameters();
		const globalParamCopies = createGlobalParameterCopies(globalParams, existingParameters);

		return {
			parameters: globalParamCopies,
			calculations: [],
			existingSolution: null
		};
	} catch (error) {
		console.error("Error loading existing solution data:", error);
		throw new Error("Failed to load existing solution data");
	}
};

/**
 * Create a new solution
 * Creates a new solution with the provided data
 * Used when user creates a new solution category
 */
export const createNewSolution = async (solutionData: {
	solution_name: string;
	solution_description: string;
	solution_icon: string;
	applicable_industries: string;
	applicable_technologies: string;
	solution_variants: any[];
	parameters: Parameter[];
	calculations: Calculation[];
	status: "draft" | "pending" | "verified";
	created_by: string;
	client_id: string;
}) => {
	try {
		const result = await createSolution(solutionData);
		return result;
	} catch (error) {
		console.error("Error creating solution:", error);
		throw new Error("Failed to create solution");
	}
};

/**
 * Create a new solution variant
 * Creates a new variant for an existing solution
 * Used when user creates a new solution variant
 */
export const createNewSolutionVariant = async (variantData: {
	name: string;
	description: string;
	icon: string;
	solution_id: string;
	created_by: string;
}) => {
	try {
		const result = await createSolutionVariant(variantData);
		return result;
	} catch (error) {
		console.error("Error creating solution variant:", error);
		throw new Error("Failed to create solution variant");
	}
};

/**
 * Create a new client solution
 * Creates a client-specific solution with parameters and calculations
 * Used when user submits or saves a solution
 */
export const createNewClientSolution = async (clientSolutionData: {
	client_id: string;
	solution_name: string;
	solution_description: string;
	solution_icon: string;
	industry: string;
	technology: string;
	solution: string;
	solution_variant: string;
	solution_variant_name: string;
	solution_variant_description: string;
	solution_variant_icon: string;
	solution_variant_product_badge: boolean;
	parameters: Parameter[];
	calculations: Calculation[];
	categories: any[];
	status: "draft" | "pending" | "approved" | "rejected";
	created_by: string;
}) => {
	try {
		const result = await createClientSolution(clientSolutionData);
		return result;
	} catch (error) {
		console.error("Error creating client solution:", error);
		throw new Error("Failed to create client solution");
	}
};

/**
 * Update an existing client solution
 * Updates parameters, calculations, and status of an existing solution
 * Used when user edits an existing solution
 */
export const updateExistingClientSolution = async (
	solutionId: string,
	updateData: {
		parameters: Parameter[];
		calculations: Calculation[];
		status: "draft" | "pending" | "approved" | "rejected";
		updated_at: Date;
	}
) => {
	try {
		const result = await updateClientSolution(solutionId, updateData);
		return result;
	} catch (error) {
		console.error("Error updating client solution:", error);
		throw new Error("Failed to update client solution");
	}
};

/**
 * Helper function to create copies of global parameters with correct ID convention
 * Creates unique IDs for global parameters to avoid conflicts
 */
const createGlobalParameterCopies = (globalParams: any[], existingParameters: Parameter[] = []) => {
	const existingParamNames = new Set(existingParameters.map(param => param.name));
	
	return globalParams
		.filter(globalParam => !existingParamNames.has(globalParam.name))
		.map((globalParam) => ({
			...globalParam,
			id: `param-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			user_interface: {
				type: "not_viewable",
				category: globalParam.category?.name || "Global",
				is_advanced: false
			},
			is_modifiable: globalParam.is_modifiable || false,
		}));
};

/**
 * Fetch client's selected industries and technologies
 * Retrieves the industries and technologies that the client has selected
 * Used for filtering available options in the solution builder
 */
export const fetchClientSelectedData = (clientData: any) => {
	if (!clientData) {
		return {
			selectedIndustries: [],
			selectedTechnologies: []
		};
	}

	return {
		selectedIndustries: clientData.selected_industries || [],
		selectedTechnologies: clientData.selected_technologies || []
	};
};

/**
 * Filter technologies based on selected industry
 * Returns technologies that are applicable to the selected industry
 * Used for progressive filtering in the solution builder
 */
export const filterTechnologiesByIndustry = (technologies: any[], selectedIndustry: string) => {
	if (!selectedIndustry) return technologies;
	
	return technologies.filter((technology) => {
		const applicableIndustries = technology.applicableIndustries || [];
		return applicableIndustries.includes(selectedIndustry);
	});
};

/**
 * Get other industries (excluding client's selected ones)
 * Returns industries that the client hasn't selected
 * Used for showing additional industry options
 */
export const getOtherIndustries = (availableIndustries: any[], clientSelectedIndustries: string[]) => {
	return availableIndustries.filter(
		(industry) => !clientSelectedIndustries.includes(industry.id)
	);
};

/**
 * Get other technologies (excluding client's selected ones and filtered by industry)
 * Returns technologies that the client hasn't selected and are applicable to the industry
 * Used for showing additional technology options
 */
export const getOtherTechnologies = (technologiesForSelectedIndustry: any[], clientSelectedTechnologies: string[]) => {
	return technologiesForSelectedIndustry.filter(
		(technology) => !clientSelectedTechnologies.includes(technology.id)
	);
};

/**
 * Fetch calculation data for existing solutions
 * Loads calculation data for editing or reference
 * Used when user selects an existing solution variant
 */
export const fetchCalculationData = async (solutionVariantId: string, clientData: any) => {
	if (!solutionVariantId || !clientData?.id) {
		return {
			calculations: [],
			existingSolution: null
		};
	}

	try {
		if (!solutionVariantId.startsWith("new-variant-") && solutionVariantId !== "new") {
			const existingSolutions = await getClientSolutions(clientData.id);

			if (existingSolutions.solutions) {
				const existingSolution = existingSolutions.solutions.find(
					(solution) => solution.id === solutionVariantId
				);

				if (existingSolution) {
					return {
						calculations: existingSolution.calculations || [],
						existingSolution
					};
				}
			}
		}

		// Default: return empty calculations for new variants
		return {
			calculations: [],
			existingSolution: null
		};
	} catch (error) {
		console.error("Error loading calculation data:", error);
		throw new Error("Failed to load calculation data");
	}
};

/**
 * Validate calculation formula
 * Validates a calculation formula against available parameters
 * Used for real-time formula validation
 */
export const validateCalculationFormula = (formula: string, parameters: any[], calculations: any[]): { isValid: boolean; error?: string } => {
	try {
		// Create a safe evaluation context
		const context: { [key: string]: number } = {};

		// Add parameters to context
		parameters.forEach((param) => {
			const value = param.overrideValue !== null ? param.overrideValue : param.defaultValue;
			context[param.id] = value;
			context[param.id.replace(/-/g, "_")] = value;
		});

		// Add calculations to context
		calculations.forEach((calc) => {
			if (calc.result !== "Error" && typeof calc.result === "number") {
				context[calc.name] = calc.result;
				context[calc.name.replace(/\s+/g, "_")] = calc.result;
			}
		});

		// Check for self-reference
		if (formula.includes("self") || formula.includes("this")) {
			return { isValid: false, error: "Self-reference detected in formula" };
		}

		// Replace parameter and calculation names in formula with their values
		let evaluatedFormula = formula;
		Object.entries(context).forEach(([key, value]) => {
			const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "g");
			evaluatedFormula = evaluatedFormula.replace(regex, value.toString());
		});

		// Safe evaluation using Function constructor
		const result = new Function(
			...Object.keys(context),
			`return ${evaluatedFormula}`
		)(...Object.values(context));

		if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
			return { isValid: true };
		}
		return { isValid: false, error: "Formula evaluation failed" };
	} catch (error) {
		return { isValid: false, error: "Invalid formula syntax" };
	}
};

/**
 * Evaluate calculation formula with parameters
 * Evaluates a calculation formula and returns the result
 * Used for real-time calculation updates
 */
export const evaluateCalculationFormula = (formula: string, parameters: any[], calculations: any[]): number | string => {
	try {
		const context: { [key: string]: number } = {};

		// Add parameters to context
		parameters.forEach((param) => {
			const value = param.overrideValue !== null ? param.overrideValue : param.defaultValue;
			context[param.id] = value;
			context[param.id.replace(/-/g, "_")] = value;
		});

		// Add calculations to context
		calculations.forEach((calc) => {
			if (calc.result !== "Error" && typeof calc.result === "number") {
				context[calc.name] = calc.result;
				context[calc.name.replace(/\s+/g, "_")] = calc.result;
			}
		});

		// Replace parameter and calculation names in formula with their values
		let evaluatedFormula = formula;
		Object.entries(context).forEach(([key, value]) => {
			const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "g");
			evaluatedFormula = evaluatedFormula.replace(regex, value.toString());
		});

		// Safe evaluation using Function constructor
		const result = new Function(
			...Object.keys(context),
			`return ${evaluatedFormula}`
		)(...Object.values(context));

		if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
			return parseFloat(result.toFixed(2));
		}
		return "Error";
	} catch (error) {
		return "Error";
	}
};

/**
 * Migrate calculation data to new format
 * Converts old calculation format to new format
 * Used for backward compatibility
 */
export const migrateCalculationData = (calculations: any[]): any[] => {
	return calculations.map(calc => {
		// If already in new format, return as is
		if (calc.category && typeof calc.category === 'object' && calc.category.name && calc.display_result !== undefined) {
			return calc;
		}
		
		// Migrate from old format
		const oldCategory = typeof calc.category === 'string' ? calc.category : 'financial';
		const defaultColors: Record<string, string> = {
			financial: "green",
			performance: "blue", 
			efficiency: "yellow",
			operational: "purple"
		};
		
		return {
			...calc,
			display_result: calc.display_result !== undefined ? calc.display_result : false,
			category: {
				name: oldCategory,
				color: defaultColors[oldCategory.toLowerCase()] || "gray"
			}
		};
	});
};

/**
 * Group parameters by category for formula building
 * Groups parameters by their category for easier access in formula editor
 * Used for parameter selection in formula building
 */
export const groupParametersByCategory = (parameters: any[], calculations: any[] = []): Record<string, any[]> => {
	const grouped = parameters.reduce((acc, param) => {
		const categoryName = param.category?.name || "Uncategorized";
		if (!acc[categoryName]) {
			acc[categoryName] = [];
		}
		acc[categoryName].push(param);
		return acc;
	}, {} as Record<string, any[]>);

	// Add calculations as available parameters for formula building
	if (calculations.length > 0) {
		grouped["Calculations"] = calculations.map(calc => ({
			id: calc.id,
			name: calc.name,
			description: calc.description,
			value: calc.result,
			test_value: calc.result,
			unit: calc.units,
			category: {
				name: "Calculations",
				color: "indigo"
			},
			user_interface: {
				type: "input",
				category: "Calculations",
				is_advanced: false
			},
			output: calc.output,
			display_type: "simple",
			dropdown_options: [],
			range_min: "",
			range_max: "",
			level: calc.level || 1,
			status: calc.status,
			formula: calc.formula
		}));
	}

	return grouped;
};

/**
 * Filter calculations by category
 * Filters calculations based on selected category tab
 * Used for category-based calculation filtering
 */
export const filterCalculationsByCategory = (calculations: any[], activeTab: string): any[] => {
	if (activeTab === "all") {
		return calculations;
	}
	return calculations.filter(calc => {
		if (!calc.category) {
			return false;
		}
		
		const categoryName = typeof calc.category === 'string' 
			? calc.category 
			: calc.category.name;
		
		return categoryName?.toLowerCase() === activeTab.toLowerCase();
	});
};

/**
 * Fetch solution variants for the selected solution type
 * Retrieves all client solutions where the solution field matches the selected solution type ID
 * Used when user selects a solution type to populate variant options
 */
export const fetchSolutionVariants = async (solutionId: string, clientId: string) => {
	if (!solutionId || !clientId) {
		console.log("fetchSolutionVariants: Missing solutionId or clientId", { solutionId, clientId });
		return [];
	}

	try {
		console.log("fetchSolutionVariants: Starting with", { solutionId, clientId });
		
		// Get all client solutions for this client
		const allSolutions = await getClientSolutions(clientId);
		
		if (allSolutions.error || !allSolutions.solutions) {
			console.log("fetchSolutionVariants: Error getting client solutions", allSolutions.error);
			return [];
		}

		console.log("fetchSolutionVariants: Got all client solutions", allSolutions.solutions.length);

		// The solutionId passed here is actually the ID from availableSolutionTypes
		// which contains client solutions with their id field set to the solution ID (for variants)
		// or the document ID (for solutions)
		
		// Find all client solutions where the solution field matches the selected solutionId
		// This means we're looking for variants that reference this solution type
		const solutionVariants = allSolutions.solutions.filter(
			(clientSolution) => clientSolution.solution === solutionId
		);

		console.log("fetchSolutionVariants: Found variants for solution", solutionId, solutionVariants.length, solutionVariants);

		// Return the variants found
		return solutionVariants;
	} catch (error) {
		console.error("Error fetching solution variants:", error);
		throw new Error("Failed to load solution variants");
	}
};
