import { toast } from "sonner";
import {
	fetchInitialData as fetchInitialDataAPI,
	fetchSolutionTypes as fetchSolutionTypesAPI,
	fetchSolutionVariants as fetchSolutionVariantsAPI,
	fetchExistingSolutionData as fetchExistingSolutionDataAPI,
} from "../../api";

/**
 * Load initial client data and populate industries/technologies
 */
export async function loadInitialClientData(userId: string) {
	try {
		const initialData = await fetchInitialDataAPI(userId);

		if (initialData.clientData) {
			return {
				clientData: initialData.clientData,
				industries: initialData.industries,
				technologies: initialData.technologies,
			};
		} else {
			console.error("Error loading client data");
			toast.error("Failed to load client data");
			return null;
		}
	} catch (error) {
		console.error("Error loading data:", error);
		toast.error("Failed to load initial data");
		return null;
	}
}

/**
 * Fetch solution types based on selected industry and technology
 */
export async function loadClientSolutionsData(
	industryId: string,
	technologyId: string,
	clientId: string
) {
	try {
		const result = await fetchSolutionTypesAPI(
			industryId,
			technologyId,
			clientId
		);

		if (Array.isArray(result)) {
			return [];
		}

		return result.solutions || [];
	} catch (error) {
		console.error("Error fetching solution types:", error);
		toast.error("Failed to load solution types");
		return [];
	}
}

/**
 * Fetch solution variants for the selected solution type
 */
export async function loadClientsSolutionVariantsData(
	solutionId: string,
	clientId: string
) {
	try {
		const result = await fetchSolutionVariantsAPI(solutionId, clientId);
		return result;
	} catch (error) {
		console.error("Error fetching solution variants:", error);
		toast.error("Failed to load solution variants");
		return [];
	}
}

/**
 * Load existing solution data (parameters and calculations)
 */
export async function loadSolutionParametersAndCalculationsData(
	solutionVariantId: string,
	clientData: any,
	existingParameters: any[] = []
) {
	try {
		const result = await fetchExistingSolutionDataAPI(
			solutionVariantId,
			clientData,
			existingParameters
		);
		return result;
	} catch (error) {
		console.error("Error loading existing solution data:", error);
		toast.error("Failed to load existing solution data");
		return {
			parameters: [],
			calculations: [],
			existingSolution: null,
		};
	}
}
