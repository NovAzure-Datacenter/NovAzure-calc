import { getClientSolutions, getClientSolution, ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";
import { getIndustriesBySelectedIds } from "@/lib/actions/industry/industry";
import { getTechnologiesBySelectedIds } from "@/lib/actions/technology/technology";
import { getSolutionTypesByIndustryAndTechnology } from "@/lib/actions/solution/solution";
import { getClientDataById } from "@/lib/actions/clients/clients";

// Re-export types for centralized access
export type { ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";

/**
 * Fetch client's initial data including industries and technologies
 * Loads the client's profile data and their selected industries and technologies
 * Used for initial setup of the value calculator
 */
export const fetchClientInitialData = async (clientId: string) => {
	const clientResult = await getClientDataById(clientId);
	
	if (!clientResult.client) {
		return {
			industries: [],
			technologies: [],
			clientData: null
		};
	}

	const clientData = clientResult.client;
	let industries: any[] = [];
	let technologies: any[] = [];

	// Fetch industries if client has selected industries
	if (clientData.selected_industries && clientData.selected_industries.length > 0) {
		const industriesResult = await getIndustriesBySelectedIds(clientData.selected_industries);
		if (industriesResult.success && industriesResult.industries) {
			industries = industriesResult.industries;
		}
	}

	// Fetch technologies if client has selected technologies
	if (clientData.selected_technologies && clientData.selected_technologies.length > 0) {
		const technologiesResult = await getTechnologiesBySelectedIds(clientData.selected_technologies);
		if (technologiesResult.success && technologiesResult.technologies) {
			technologies = technologiesResult.technologies;
		}
	}

	return {
		industries,
		technologies,
		clientData
	};
};

/**
 * Fetch available client solutions for selected industry and technology
 * Retrieves all solutions available to the client for the specific industry/technology combination
 * Used when user selects industry and technology to populate solution options
 */
export const fetchAvailableClientSolutions = async (
	clientId: string,
	industryId: string,
	technologyId: string
) => {
	if (!clientId || !industryId || !technologyId) {
		return [];
	}

	const result = await getClientSolutions(clientId);
	
	if (!result.solutions) {
		return [];
	}

	// Filter solutions by industry and technology
	const filteredSolutions = result.solutions.filter((solution) => {
		const matchesIndustry = solution.industry === industryId;
		const matchesTechnology = solution.technology === technologyId;
		return matchesIndustry && matchesTechnology;
	});

	return filteredSolutions;
};

/**
 * Fetch solution types available for industry and technology combination
 * Retrieves the types of solutions that can be created for the selected industry and technology
 * Used to populate solution type dropdown when industry/technology is selected
 */
export const fetchAvailableSolutionTypes = async (
	industryId: string,
	technologyId: string
) => {
	if (!industryId || !technologyId) {
		return [];
	}

	const result = await getSolutionTypesByIndustryAndTechnology(industryId, technologyId);
	
	if (result.success && result.solutionTypes) {
		return result.solutionTypes;
	}
	
	return [];
};

/**
 * Fetch complete solution details for solution variant A
 * Retrieves full solution information including parameters, calculations, and metadata
 * Used when user selects solution variant A for detailed configuration
 */
export const fetchSolutionVariantADetails = async (solutionId: string) => {
	if (!solutionId) {
		return null;
	}

	const result = await getClientSolution(solutionId);
	return result.solution || null;
};

/**
 * Fetch complete solution details for solution variant B
 * Retrieves full solution information including parameters, calculations, and metadata
 * Used when user selects solution variant B for detailed configuration
 */
export const fetchSolutionVariantBDetails = async (solutionId: string) => {
	if (!solutionId) {
		return null;
	}

	const result = await getClientSolution(solutionId);
	return result.solution || null;
};

/**
 * Legacy function names for backward compatibility
 * @deprecated Use the more descriptive function names above
 */
export const fetchClientIndustriesAndTechnologies = fetchClientInitialData;
export const fetchClientSolutionsByIndustryAndTechnology = fetchAvailableClientSolutions;
export const fetchSolutionTypesByIndustryAndTechnology = fetchAvailableSolutionTypes;

/**
 * Fetch industry details by ID
 * Retrieves industry information for display purposes
 * Used in comparison component to resolve industry names
 */
export const fetchIndustryDetails = async (industryId: string) => {
	if (!industryId) {
		return null;
	}

	const result = await getIndustriesBySelectedIds([industryId]);
	if (result.success && result.industries && result.industries.length > 0) {
		return result.industries[0];
	}
	return null;
};

/**
 * Fetch technology details by ID
 * Retrieves technology information for display purposes
 * Used in comparison component to resolve technology names
 */
export const fetchTechnologyDetails = async (technologyId: string) => {
	if (!technologyId) {
		return null;
	}

	const result = await getTechnologiesBySelectedIds([technologyId]);
	if (result.success && result.technologies && result.technologies.length > 0) {
		return result.technologies[0];
	}
	return null;
};

/**
 * Fetch solution types for industry and technology combination
 * Retrieves solution types for display purposes
 * Used in comparison component to resolve solution names
 */
export const fetchSolutionTypesForDisplay = async (industryId: string, technologyId: string) => {
	if (!industryId || !technologyId) {
		return [];
	}

	const result = await getSolutionTypesByIndustryAndTechnology(industryId, technologyId);
	if (result.success && result.solutionTypes) {
		return result.solutionTypes;
	}
	return [];
};
