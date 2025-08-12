"use server";

import { getGlobalCalculationsCollection } from "@/lib/mongoDb/db";
import { Calculation } from "@/types/types";
import { ObjectId } from "mongodb";

// Cache for global calculations to avoid multiple database calls
let globalCalculationsCache: Calculation[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
function isCacheValid(): boolean {
	return (
		globalCalculationsCache !== null &&
		Date.now() - cacheTimestamp < CACHE_DURATION
	);
}

// Helper function to invalidate cache
function invalidateCache(): void {
	globalCalculationsCache = null;
	cacheTimestamp = 0;
}

// Helper function to convert MongoDB document to Calculation type
function convertToCalculation(doc: any): Calculation {
	return {
		id: doc._id.toString(),
		name: doc.name,
		formula: doc.formula,
		result: doc.result,
		units: doc.units,
		description: doc.description,
		status: doc.status,
		category: doc.category,
		output: doc.output,
		level: doc.level,
		display_result: doc.display_result,
	};
}

// Helper function to convert Calculation to MongoDB document
function convertToMongoDoc(calculation: Omit<Calculation, "id">): any {
	return {
		name: calculation.name,
		formula: calculation.formula,
		result: calculation.result,
		units: calculation.units,
		description: calculation.description,
		status: calculation.status,
		category: calculation.category,
		output: calculation.output,
		level: calculation.level,
		display_result: calculation.display_result,
	};
}

/**
 * Get all global calculations with caching
 */
export async function getAllGlobalCalculations(): Promise<Calculation[]> {
	try {
		// Return cached data if valid
		if (isCacheValid()) {
			return globalCalculationsCache!;
		}

		const collection = await getGlobalCalculationsCollection();
		const documents = await collection.find({}).toArray();

		const calculations = documents.map(convertToCalculation);

		// Update cache
		globalCalculationsCache = calculations;
		cacheTimestamp = Date.now();

		return calculations;
	} catch (error) {
		console.error("Error fetching global calculations:", error);
		throw new Error("Failed to fetch global calculations");
	}
}

/**
 * Create a new global calculation
 */
export async function createGlobalCalculation(
	calculationData: Omit<Calculation, "id">
): Promise<Calculation> {
	try {
		const collection = await getGlobalCalculationsCollection();
		const mongoDoc = convertToMongoDoc(calculationData);

		const result = await collection.insertOne(mongoDoc);

		if (!result.insertedId) {
			throw new Error("Failed to create global calculation");
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		const createdCalculation = await collection.findOne({
			_id: result.insertedId,
		});

		if (!createdCalculation) {
			throw new Error("Failed to retrieve created global calculation");
		}

		return convertToCalculation(createdCalculation);
	} catch (error) {
		console.error("Error creating global calculation:", error);
		throw new Error("Failed to create global calculation");
	}
}

/**
 * Update a global calculation
 */
export async function updateGlobalCalculation(
	id: string,
	calculationData: Partial<Omit<Calculation, "id">>
): Promise<Calculation> {
	try {
		const collection = await getGlobalCalculationsCollection();
		const mongoDoc = convertToMongoDoc(
			calculationData as Omit<Calculation, "id">
		);

		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: mongoDoc },
			{ returnDocument: "after" }
		);

		if (!result) {
			throw new Error("Calculation not found");
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return convertToCalculation(result);
	} catch (error) {
		console.error("Error updating global calculation:", error);
		throw new Error("Failed to update global calculation");
	}
}

/**
 * Delete a global calculation
 */
export async function deleteGlobalCalculation(id: string): Promise<void> {
	try {
		const collection = await getGlobalCalculationsCollection();
		const result = await collection.deleteOne({ _id: new ObjectId(id) });

		if (result.deletedCount === 0) {
			throw new Error("Calculation not found");
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();
	} catch (error) {
		console.error("Error deleting global calculation:", error);
		throw new Error("Failed to delete global calculation");
	}
}

/**
 * Initialize default global calculations if they don't exist
 */
export async function initializeGlobalCalculations(): Promise<void> {
	try {
		const collection = await getGlobalCalculationsCollection();

		// Check if global calculations already exist
		const existingCount = await collection.countDocuments({});
		if (existingCount > 0) {
			console.log("Global calculations already exist, skipping initialization");
			return;
		}

		// Default global calculations
		const defaultCalculations = [
			{
				name: "Total Cost of Ownership",
				formula: "",
				result: 0,
				units: "",
				description:
					"Total cost including CAPEX and OPEX over the project lifetime",
				status: "valid",
				category: {
					name: "required",
					color: "teal",
				},
				output: true,
				level: 0,
				display_result: true,
			},
			{
				name: "Total CAPEX",
				formula: "",
				result: 0,
				units: "",
				description: "Total capital expenditure for the project",
				status: "valid",
				category: {
					name: "required",
					color: "teal",
				},
				output: true,
				level: 0,
				display_result: true,
			},
			{
				name: "Total OPEX",
				formula: "",
				result: 0,
				units: "",
				description: "Total operational expenditure for the project",
				status: "valid",
				category: {
					name: "required",
					color: "teal",
				},
				output: true,
				level: 0,
				display_result: true,
			},
		];

		// Insert default calculations
		await collection.insertMany(defaultCalculations);

		// Invalidate cache
		invalidateCache();

		console.log("Global calculations initialized successfully");
	} catch (error) {
		console.error("Error initializing global calculations:", error);
		throw new Error("Failed to initialize global calculations");
	}
}
