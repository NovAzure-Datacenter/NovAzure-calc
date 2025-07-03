"use server";

import { getClientsCollection } from "@/lib/mongoDb/db";
import { ObjectId } from "mongodb";
import { removeCompanyFromIndustries } from "../industry/industry";

export interface ClientData {
	id?: string;
	logo: string;
	companyName: string;
	website: string;
	mainContactEmail: string;
	mainContactFirstName?: string;
	mainContactLastName?: string;
	mainContactPhone?: string;
	techContactFirstName?: string;
	techContactLastName?: string;
	techContactEmail?: string;
	techContactPhone?: string;
	companyIndustry?: string;
	companySize?: string;
	street?: string;
	city?: string;
	stateProvince?: string;
	zipcodePostalCode?: string;
	country?: string;
	timezone?: string;
	clientStatus?: string;
	additionalNotes?: string;
	selectedIndustries?: string[];
	selectedTechnologies?: string[];
	userCount?: number;
	productCount?: number;
	productPendingCount?: number;
	scenarioCount?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export async function getClients(): Promise<{
	clients?: ClientData[];
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();
		const clients = await collection.find({}).toArray();

		const transformedClients: ClientData[] = clients.map((client) => ({
			id: client._id.toString(),
			logo: client.logo || "Building2",
			companyName: client.companyName,
			website: client.website,
			mainContactEmail: client.mainContactEmail,
			mainContactFirstName: client.mainContactFirstName,
			mainContactLastName: client.mainContactLastName,
			mainContactPhone: client.mainContactPhone,
			techContactFirstName: client.techContactFirstName,
			techContactLastName: client.techContactLastName,
			techContactEmail: client.techContactEmail,
			techContactPhone: client.techContactPhone,
			companyIndustry: client.companyIndustry,
			companySize: client.companySize,
			street: client.street,
			city: client.city,
			stateProvince: client.stateProvince,
			zipcodePostalCode: client.zipcodePostalCode,
			country: client.country,
			timezone: client.timezone,
			clientStatus: client.clientStatus || "prospect",
			additionalNotes: client.additionalNotes,
			selectedIndustries: client.selectedIndustries || [],
			selectedTechnologies: client.selectedTechnologies || [],
			userCount: client.userCount || 0,
			productCount: client.productCount || 0,
			productPendingCount: client.productPendingCount || 0,
			scenarioCount: client.scenarioCount || 0,
			createdAt: client.createdAt,
			updatedAt: client.updatedAt,
		}));

		return { clients: transformedClients };
	} catch (error) {
		console.error("Error fetching clients:", error);
		return { error: "Failed to fetch clients" };
	}
}

export async function createClient(
	clientData: Omit<ClientData, "id" | "createdAt" | "updatedAt">
): Promise<{
	clientId?: string;
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();

		const newClient = {
			...clientData,
			userCount: clientData.userCount || 0,
			productCount: clientData.productCount || 0,
			productPendingCount: clientData.productPendingCount || 0,
			scenarioCount: clientData.scenarioCount || 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await collection.insertOne(newClient);

		if (result.insertedId) {
			return { clientId: result.insertedId.toString() };
		} else {
			return { error: "Failed to create client" };
		}
	} catch (error) {
		console.error("Error creating client:", error);
		return { error: "Failed to create client" };
	}
}

export async function updateClient(
	clientId: string,
	clientData: Partial<ClientData>
): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();

		const updateData = {
			...clientData,
			updatedAt: new Date(),
		};

		const result = await collection.updateOne(
			{ _id: new ObjectId(clientId) },
			{ $set: updateData }
		);

		if (result.matchedCount > 0) {
			return { success: true };
		} else {
			return { error: "Client not found" };
		}
	} catch (error) {
		console.error("Error updating client:", error);
		return { error: "Failed to update client" };
	}
}

export async function deleteClient(clientId: string): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();

		// First, get the client to find which industries it's associated with
		const client = await collection.findOne({ _id: new ObjectId(clientId) });

		if (!client) {
			return { error: "Client not found" };
		}

		// Remove the company from all associated industries
		if (client.selectedIndustries && client.selectedIndustries.length > 0) {
			const removeResult = await removeCompanyFromIndustries(
				client.selectedIndustries,
				clientId
			);
			if (removeResult.error) {
				console.error(
					"Warning: Failed to remove company from industries:",
					removeResult.error
				);
				// Continue with deletion even if industry update fails
			}
		}

		// Delete the client
		const result = await collection.deleteOne({ _id: new ObjectId(clientId) });

		if (result.deletedCount > 0) {
			return { success: true };
		} else {
			return { error: "Client not found" };
		}
	} catch (error) {
		console.error("Error deleting client:", error);
		return { error: "Failed to delete client" };
	}
}
