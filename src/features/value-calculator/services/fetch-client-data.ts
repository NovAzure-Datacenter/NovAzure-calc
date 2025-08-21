import { getClientDataById } from "@/lib/actions/clients/clients";
import { getIndustriesBySelectedIds } from "@/lib/actions/industry/industry";
import { getTechnologiesBySelectedIds } from "@/lib/actions/technology/technology";

export const fetchClientInitialData = async (clientId: string) => {
	const clientResult = await getClientDataById(clientId);

	if (!clientResult.client) {
		return {
			industries: [],
			technologies: [],
			clientData: null,
		};
	}

	const clientData = clientResult.client;
	let industries: any[] = [];
	let technologies: any[] = [];

	// Fetch industries if client has selected industries
	if (
		clientData.selected_industries &&
		clientData.selected_industries.length > 0
	) {
		const industriesResult = await getIndustriesBySelectedIds(
			clientData.selected_industries
		);
		if (industriesResult.success && industriesResult.industries) {
			industries = industriesResult.industries;
		}
	}

	// Fetch technologies if client has selected technologies
	if (
		clientData.selected_technologies &&
		clientData.selected_technologies.length > 0
	) {
		const technologiesResult = await getTechnologiesBySelectedIds(
			clientData.selected_technologies
		);
		if (technologiesResult.success && technologiesResult.technologies) {
			technologies = technologiesResult.technologies;
		}
	}

	return {
		industries,
		technologies,
		clientData,
	};
};
