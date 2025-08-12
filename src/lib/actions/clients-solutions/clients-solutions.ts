"use server";

import { getClientsSolutionsCollection } from "@/lib/mongoDb/db";
import { ObjectId } from "mongodb";

/**
 * Helper function to serialize MongoDB documents for client components
 * Converts _id fields to strings and Date objects to ISO strings
 */
function serializeMongoDocument(doc: any): any {
	if (doc === null || doc === undefined) {
		return doc;
	}
	
	if (typeof doc === 'object') {
		if (Array.isArray(doc)) {
			return doc.map(serializeMongoDocument);
		}
		
		const serialized: any = {};
		for (const [key, value] of Object.entries(doc)) {
			if (key === '_id' && value && typeof value === 'object' && 'toString' in value) {
				serialized[key] = value.toString();
			} else if (value instanceof Date) {
				serialized[key] = value.toISOString();
			} else if (typeof value === 'object' && value !== null) {
				serialized[key] = serializeMongoDocument(value);
			} else {
				serialized[key] = value;
			}
		}
		return serialized;
	}
	
	return doc;
}

// Cache for client solutions to avoid multiple database calls
let clientSolutionsCache: { [clientId: string]: any[] } = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
function isCacheValid(): boolean {
	return Date.now() - cacheTimestamp < CACHE_DURATION;
}

// Helper function to invalidate cache
function invalidateCache(): void {
	clientSolutionsCache = {};
	cacheTimestamp = 0;
}

export interface ClientSolution {
	id?: string;
	client_id: string;
	solution_name: string;
	solution_description: string;
	solution_icon?: string;
	industry_id: string;
	technology_id: string;
	selected_solution_id?: string;
	selected_solution_variant_id?: string;
	is_creating_new_solution: boolean;
	is_creating_new_variant: boolean;
	new_variant_name?: string;
	new_variant_description?: string;
	new_variant_icon?: string;
	parameters: any[];
	calculations: any[];
	status: "draft" | "pending" | "approved" | "rejected";
	created_by: string;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Create a new client solution
 */
export async function createClientSolution(
	solutionData: Omit<ClientSolution, "id" | "created_at" | "updated_at">
): Promise<{
	solutionId?: string;
	error?: string;
}> {
	try {
		const collection = await getClientsSolutionsCollection();

		const newSolution = {
			...solutionData,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await collection.insertOne(newSolution);

		if (result.insertedId) {
			// Invalidate cache to ensure fresh data
			invalidateCache();
			return { solutionId: result.insertedId.toString() };
		} else {
			return { error: "Failed to create solution" };
		}
	} catch (error) {
		console.error("Error creating client solution:", error);
		return { error: "Failed to create solution" };
	}
}

/**
 * Get all solutions for a specific client with caching
 */
export async function getClientSolutions(clientId: string): Promise<{
	solutions?: ClientSolution[];
	error?: string;
}> {
	try {
		// Return cached data if valid
		if (isCacheValid() && clientSolutionsCache[clientId]) {
			return { solutions: clientSolutionsCache[clientId] };
		}

		const collection = await getClientsSolutionsCollection();
		const documents = await collection.find({ client_id: clientId }).toArray();

		// Serialize MongoDB documents to prevent Next.js warnings
		const serializedDocuments = documents.map(serializeMongoDocument);

		const solutions = serializedDocuments.map((doc) => ({
			id: doc._id.toString(),
			client_id: doc.client_id,
			solution_name: doc.solution_name,
			solution_description: doc.solution_description,
			solution_icon: doc.solution_icon,
			industry_id: doc.industry_id,
			technology_id: doc.technology_id,
			selected_solution_id: doc.selected_solution_id,
			selected_solution_variant_id: doc.selected_solution_variant_id,
			is_creating_new_solution: doc.is_creating_new_solution,
			is_creating_new_variant: doc.is_creating_new_variant,
			new_variant_name: doc.new_variant_name,
			new_variant_description: doc.new_variant_description,
			new_variant_icon: doc.new_variant_icon,
			parameters: doc.parameters,
			calculations: doc.calculations,
			status: doc.status,
			created_by: doc.created_by,
			created_at: doc.created_at,
			updated_at: doc.updated_at,
		}));

		// Update cache
		clientSolutionsCache[clientId] = solutions;
		cacheTimestamp = Date.now();

		return { solutions };
	} catch (error) {
		console.error("Error fetching client solutions:", error);
		return { error: "Failed to fetch solutions" };
	}
}

/**
 * Get a specific solution by ID
 */
export async function getClientSolution(solutionId: string): Promise<{
	solution?: ClientSolution;
	error?: string;
}> {
	try {
		const collection = await getClientsSolutionsCollection();
		const document = await collection.findOne({
			_id: new ObjectId(solutionId),
		});

		if (!document) {
			return { error: "Solution not found" };
		}

		// Serialize MongoDB document to prevent Next.js warnings
		const serializedDocument = serializeMongoDocument(document);

		const solution: ClientSolution = {
			id: serializedDocument._id.toString(),
			client_id: serializedDocument.client_id,
			solution_name: serializedDocument.solution_name,
			solution_description: serializedDocument.solution_description,
			solution_icon: serializedDocument.solution_icon,
			industry_id: serializedDocument.industry_id,
			technology_id: serializedDocument.technology_id,
			selected_solution_id: serializedDocument.selected_solution_id,
			selected_solution_variant_id: serializedDocument.selected_solution_variant_id,
			is_creating_new_solution: serializedDocument.is_creating_new_solution,
			is_creating_new_variant: serializedDocument.is_creating_new_variant,
			new_variant_name: serializedDocument.new_variant_name,
			new_variant_description: serializedDocument.new_variant_description,
			new_variant_icon: serializedDocument.new_variant_icon,
			parameters: serializedDocument.parameters,
			calculations: serializedDocument.calculations,
			status: serializedDocument.status,
			created_by: serializedDocument.created_by,
			created_at: serializedDocument.created_at,
			updated_at: serializedDocument.updated_at,
		};

		return { solution };
	} catch (error) {
		console.error("Error fetching client solution:", error);
		return { error: "Failed to fetch solution" };
	}
}

/**
 * Update a client solution
 */
export async function updateClientSolution(
	solutionId: string,
	solutionData: Partial<ClientSolution>
): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getClientsSolutionsCollection();

		const updateData = {
			...solutionData,
			updated_at: new Date(),
		};

		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(solutionId) },
			{ $set: updateData },
			{ returnDocument: "after" }
		);

		if (!result) {
			return { error: "Solution not found" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return { success: true };
	} catch (error) {
		console.error("Error updating client solution:", error);
		return { error: "Failed to update solution" };
	}
}

/**
 * Delete a client solution
 */
export async function deleteClientSolution(solutionId: string): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getClientsSolutionsCollection();
		const result = await collection.deleteOne({
			_id: new ObjectId(solutionId),
		});

		if (result.deletedCount === 0) {
			return { error: "Solution not found" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return { success: true };
	} catch (error) {
		console.error("Error deleting client solution:", error);
		return { error: "Failed to delete solution" };
	}
}

/**
 * Get solutions by status
 */
export async function getClientSolutionsByStatus(
	clientId: string,
	status: ClientSolution["status"]
): Promise<{
	solutions?: ClientSolution[];
	error?: string;
}> {
	try {
		const allSolutions = await getClientSolutions(clientId);
		if (allSolutions.error) {
			return { error: allSolutions.error };
		}

		const filteredSolutions = allSolutions.solutions?.filter(
			(solution) => solution.status === status
		);

		return { solutions: filteredSolutions };
	} catch (error) {
		console.error("Error fetching client solutions by status:", error);
		return { error: "Failed to fetch solutions by status" };
	}
}

/**
 * Search client solutions
 */
export async function searchClientSolutions(
	clientId: string,
	query: string
): Promise<{
	solutions?: ClientSolution[];
	error?: string;
}> {
	try {
		const allSolutions = await getClientSolutions(clientId);
		if (allSolutions.error) {
			return { error: allSolutions.error };
		}

		const searchTerm = query.toLowerCase();
		const filteredSolutions = allSolutions.solutions?.filter(
			(solution) =>
				solution.solution_name.toLowerCase().includes(searchTerm) ||
				solution.solution_description.toLowerCase().includes(searchTerm)
		);

		return { solutions: filteredSolutions };
	} catch (error) {
		console.error("Error searching client solutions:", error);
		return { error: "Failed to search solutions" };
	}
}

/**
 * Force refresh cache (useful for testing or manual refresh)
 */
export async function refreshClientSolutionsCache(): Promise<void> {
	invalidateCache();
}
