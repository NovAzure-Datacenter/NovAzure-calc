'use server';

import { ObjectId } from "mongodb";
import { getClientsLeadsCollection } from "@/lib/mongoDb/db";
import { getUserData } from "@/lib/actions/auth/get-user-data";

export interface LeadData {
	id: string;
	first_name: string;
	last_name: string;
	contact_email: string;
	contact_phone: string;
	created_at: string;
	created_by: string;
	client_id: string;
	associated_scenarios: string[];
	last_contacted: string;
	notes: string;
	company_name: string;
	website: string;
	status: string;
}

export async function getLeadsByClientId(userId: string): Promise<{
	success: boolean;
	leads?: LeadData[];
	error?: string;
}> {
	try {
		// Get current user data to get client_id
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const clientId = userData.client_id;
		if (!clientId) {
			return { success: false, error: "No client ID found for user" };
		}

		const leadsCollection = await getClientsLeadsCollection();

		// Fetch leads where client_id matches the current user's client_id
		const leads = await leadsCollection
			.find({ client_id: clientId })
			.sort({ created_at: -1 }) // Sort by newest first
			.toArray();

		// Transform the data to match our interface
		const transformedLeads: LeadData[] = leads.map((lead) => ({
			id: lead._id.toString(),
			first_name: lead.first_name || "",
			last_name: lead.last_name || "",
			contact_email: lead.contact_email || "",
			contact_phone: lead.contact_phone || "",
			created_at: lead.created_at ? new Date(lead.created_at).toISOString() : new Date().toISOString(),
			created_by: lead.created_by || "",
			client_id: lead.client_id || "",
			associated_scenarios: lead.associated_scenarios || [],
			last_contacted: lead.last_contacted ? new Date(lead.last_contacted).toISOString() : new Date().toISOString(),
			notes: lead.notes || "",
			company_name: lead.company_name || "",
			website: lead.website || "",
			status: lead.status || "",
		}));

		return {
			success: true,
			leads: transformedLeads,
		};
	} catch (error) {
		console.error("Error fetching leads:", error);
		return { success: false, error: "Failed to fetch leads" };
	}
}

export async function createLead(
	userId: string,
	leadData: Omit<LeadData, "id">
): Promise<{
	success: boolean;
	lead?: LeadData;
	error?: string;
}> {
	try {
		// Get current user data to get client_id
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const clientId = userData.client_id;
		if (!clientId) {
			return { success: false, error: "No client ID found for user" };
		}

		const leadsCollection = await getClientsLeadsCollection();

		const newLead = {
			...leadData,
			client_id: clientId,
			created_at: new Date(),
			created_by: userData._id,
		};

		const result = await leadsCollection.insertOne(newLead);

		if (!result.acknowledged) {
			return { success: false, error: "Failed to create lead" };
		}

		const createdLead: LeadData = {
			id: result.insertedId.toString(),
			...newLead,
			created_at: newLead.created_at.toISOString(),
			last_contacted: newLead.last_contacted || newLead.created_at.toISOString(),
			company_name: newLead.company_name || "",
			website: newLead.website || "",
			status: newLead.status || "New",
		};

		return {
			success: true,
			lead: createdLead,
		};
	} catch (error) {
		console.error("Error creating lead:", error);
		return { success: false, error: "Failed to create lead" };
	}
}

export async function updateLead(
	userId: string,
	leadId: string,
	updateData: Partial<Omit<LeadData, "id" | "client_id" | "created_by" | "created_at">>
): Promise<{
	success: boolean;
	lead?: LeadData;
	error?: string;
}> {
	try {
		// Get current user data to get client_id
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const clientId = userData.client_id;
		if (!clientId) {
			return { success: false, error: "No client ID found for user" };
		}

		const leadsCollection = await getClientsLeadsCollection();

		const result = await leadsCollection.findOneAndUpdate(
			{
				_id: new ObjectId(leadId),
				client_id: clientId, // Ensure user can only update their own leads
			},
			{
				$set: {
					...updateData,
					last_contacted: new Date(),
				},
			},
			{ returnDocument: "after" }
		);

		if (!result || !result.value) {
			return { success: false, error: "Lead not found or access denied" };
		}

		const leadDoc = result.value;
		const updatedLead: LeadData = {
			id: leadDoc._id.toString(),
			first_name: leadDoc.first_name || "",
			last_name: leadDoc.last_name || "",
			contact_email: leadDoc.contact_email || "",
			contact_phone: leadDoc.contact_phone || "",
			created_at: leadDoc.created_at ? new Date(leadDoc.created_at).toISOString() : new Date().toISOString(),
			created_by: leadDoc.created_by || "",
			client_id: leadDoc.client_id || "",
			associated_scenarios: leadDoc.associated_scenarios || [],
			last_contacted: leadDoc.last_contacted ? new Date(leadDoc.last_contacted).toISOString() : new Date().toISOString(),
			notes: leadDoc.notes || "",
			company_name: leadDoc.company_name || "",
			website: leadDoc.website || "",
			status: leadDoc.status || "",
		};

		return {
			success: true,
			lead: updatedLead,
		};
	} catch (error) {
		console.error("Error updating lead:", error);
		return { success: false, error: "Failed to update lead" };
	}
}

export async function deleteLead(
	userId: string,
	leadId: string
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		// Get current user data to get client_id
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const clientId = userData.client_id;
		if (!clientId) {
			return { success: false, error: "No client ID found for user" };
		}

		const leadsCollection = await getClientsLeadsCollection();

		const result = await leadsCollection.deleteOne({
			_id: new ObjectId(leadId),
			client_id: clientId, // Ensure user can only delete their own leads
		});

		if (result.deletedCount === 0) {
			return { success: false, error: "Lead not found or access denied" };
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting lead:", error);
		return { success: false, error: "Failed to delete lead" };
	}
}
