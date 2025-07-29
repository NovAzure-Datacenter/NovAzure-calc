"use server";

import { getGlobalParametersCollection } from "@/lib/mongoDb/db";
import { Parameter } from "@/app/home/product-and-solutions/types";
import { ObjectId } from "mongodb";

// Cache for global parameters to avoid multiple database calls
let globalParametersCache: Parameter[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
function isCacheValid(): boolean {
	return (
		globalParametersCache !== null &&
		Date.now() - cacheTimestamp < CACHE_DURATION
	);
}

// Helper function to invalidate cache
function invalidateCache(): void {
	globalParametersCache = null;
	cacheTimestamp = 0;
}

// Helper function to convert MongoDB document to Parameter
function convertToParameter(doc: any): Parameter {
	return {
		id: doc._id.toString(),
		name: doc.name,
		value: doc.value,
		test_value: doc.test_value,
		unit: doc.unit,
		description: doc.description,
		provided_by: doc.provided_by || "global",
		input_type: doc.input_type || "simple",
		output: doc.output !== undefined ? doc.output : true,
		level: doc.level || "L1",
		category: {
			name: doc.category?.name || "Global",
			color: doc.category?.color || "blue",
		},
		is_modifiable: doc.is_modifiable || false,
		display_type: doc.display_type || "simple",
		dropdown_options: doc.dropdown_options || [],
		range_min: doc.range_min || "",
		range_max: doc.range_max || "",
		information: doc.information || "",
	};
}

// Helper function to convert Parameter to MongoDB document
function convertToMongoDoc(parameter: Omit<Parameter, "id">): any {
	return {
		name: parameter.name,
		value: parameter.value,
		test_value: parameter.test_value,
		unit: parameter.unit,
		description: parameter.description,
		information: parameter.information,
		provided_by: parameter.provided_by,
		input_type: parameter.input_type,
		output: parameter.output,
		level: parameter.level,
		category: parameter.category,
		is_modifiable: parameter.is_modifiable,
		display_type: parameter.display_type,
		dropdown_options: parameter.dropdown_options,
		range_min: parameter.range_min,
		range_max: parameter.range_max,
	};
}

/**
 * Get all global parameters with caching
 */
export async function getAllGlobalParameters(): Promise<Parameter[]> {
	try {
		// Return cached data if valid
		if (isCacheValid()) {
			return globalParametersCache!;
		}

		const collection = await getGlobalParametersCollection();
		const documents = await collection.find({}).toArray();

		const parameters = documents.map(convertToParameter);

		// Update cache
		globalParametersCache = parameters;
		cacheTimestamp = Date.now();

		return parameters;
	} catch (error) {
		console.error("Error fetching global parameters:", error);
		throw new Error("Failed to fetch global parameters");
	}
}

/**
 * Get global parameters by category
 */
export async function getGlobalParametersByCategory(
	category: string
): Promise<Parameter[]> {
	try {
		const allParameters = await getAllGlobalParameters();
		return allParameters.filter((param) => param.category.name === category);
	} catch (error) {
		console.error("Error fetching global parameters by category:", error);
		throw new Error("Failed to fetch global parameters by category");
	}
}

/**
 * Create a new global parameter
 */
export async function createGlobalParameter(
	parameterData: Omit<Parameter, "id">
): Promise<Parameter> {
	try {
		const collection = await getGlobalParametersCollection();
		const mongoDoc = convertToMongoDoc(parameterData);

		const result = await collection.insertOne(mongoDoc);

		// Invalidate cache to ensure fresh data
		invalidateCache();

		// Return the created parameter with the new ID
		return {
			id: result.insertedId.toString(),
			...parameterData,
		};
	} catch (error) {
		console.error("Error creating global parameter:", error);
		throw new Error("Failed to create global parameter");
	}
}

/**
 * Update a global parameter
 */
export async function updateGlobalParameter(
	id: string,
	parameterData: Partial<Omit<Parameter, "id">>
): Promise<Parameter> {
	try {
		const collection = await getGlobalParametersCollection();
		const mongoDoc = convertToMongoDoc(parameterData as Omit<Parameter, "id">);

		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: mongoDoc },
			{ returnDocument: "after" }
		);

		if (!result) {
			throw new Error("Parameter not found");
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return convertToParameter(result);
	} catch (error) {
		console.error("Error updating global parameter:", error);
		throw new Error("Failed to update global parameter");
	}
}

/**
 * Delete a global parameter
 */
export async function deleteGlobalParameter(id: string): Promise<boolean> {
	try {
		const collection = await getGlobalParametersCollection();
		const result = await collection.deleteOne({ _id: new ObjectId(id) });

		if (result.deletedCount === 0) {
			throw new Error("Parameter not found");
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return true;
	} catch (error) {
		console.error("Error deleting global parameter:", error);
		throw new Error("Failed to delete global parameter");
	}
}

/**
 * Search global parameters
 */
export async function searchGlobalParameters(
	query: string
): Promise<Parameter[]> {
	try {
		const allParameters = await getAllGlobalParameters();

		const searchTerm = query.toLowerCase();
		return allParameters.filter(
			(param) =>
				param.name.toLowerCase().includes(searchTerm) ||
				param.description.toLowerCase().includes(searchTerm) ||
				param.category.name.toLowerCase().includes(searchTerm)
		);
	} catch (error) {
		console.error("Error searching global parameters:", error);
		throw new Error("Failed to search global parameters");
	}
}

/**
 * Force refresh cache (useful for testing or manual refresh)
 */
export async function refreshGlobalParametersCache(): Promise<void> {
	invalidateCache();
	await getAllGlobalParameters();
}
