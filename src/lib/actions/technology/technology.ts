"use server";

import { getTechnologiesCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";

// Cache for technologies to avoid multiple database calls
let technologiesCache: any[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
function isCacheValid(): boolean {
	return Date.now() - cacheTimestamp < CACHE_DURATION;
}

// Helper function to invalidate cache
function invalidateCache(): void {
	technologiesCache = [];
	cacheTimestamp = 0;
}

export interface CreateTechnologyData {
	name: string;
	description: string;
	icon?: string; 
	status?: "pending" | "verified";
	applicableIndustries?: string[];
	parameters?: Array<{
		name: string;
		value: number;
		unit: string;
		description: string;
		category: "cost" | "performance" | "environmental" | "other";
	}>;
}

export interface TechnologyData {
	_id: string;
	name: string;
	description: string;
	icon?: string;
	status?: "pending" | "verified";
	applicableIndustries?: string[];
	parameters?: Array<{
		name: string;
		value: number;
		unit: string;
		description: string;
		category: "cost" | "performance" | "environmental" | "other";
	}>;
	created_at: Date;
	updated_at: Date;
}

export async function createTechnology(data: CreateTechnologyData) {
	try {
		const technologiesCollection = await getTechnologiesCollection();

		const newTechnology = {
			name: data.name,
			description: data.description,
			icon: data.icon,
			status: data.status || "pending",
			applicableIndustries: data.applicableIndustries || [],
			parameters: data.parameters || [],
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await technologiesCollection.insertOne(newTechnology);

		if (!result.acknowledged) {
			return { error: "Failed to create technology" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			technologyId: result.insertedId.toString(),
			message: "Technology created successfully",
		};
	} catch (error) {
		console.error("Error creating technology:", error);
		return { error: "Failed to create technology" };
	}
}

export async function getTechnologies(clientId?: string) {
	try {
		// Return cached data if valid (for now, we'll use a simple cache key)
		const cacheKey = clientId || "all";
		if (isCacheValid() && technologiesCache.length > 0) {
			// If clientId is provided, filter the cached data
			if (clientId) {
				const filteredTechnologies = technologiesCache.filter(tech => 
					tech.applicableIndustries?.includes(clientId)
				);
				return {
					success: true,
					technologies: filteredTechnologies,
				};
			}
			return {
				success: true,
				technologies: technologiesCache,
			};
		}

		const technologiesCollection = await getTechnologiesCollection();
		
		// Build query based on clientId
		let query = {};
		if (clientId) {
			query = {
				applicableIndustries: clientId
			};
		}

		const technologies = await technologiesCollection.find(query).toArray();

		const transformedTechnologies = technologies.map((technology) => ({
			id: technology._id.toString(),
			name: technology.name,
			description: technology.description,
			icon: technology.icon,
			status: technology.status,
			applicableIndustries: technology.applicableIndustries || [],
			parameters: technology.parameters || [],
			created_at: technology.created_at,
			updated_at: technology.updated_at,
		}));

		// Update cache (store all technologies for potential reuse)
		technologiesCache = transformedTechnologies;
		cacheTimestamp = Date.now();

		// Return filtered data if clientId was provided
		if (clientId) {
			const filteredTechnologies = transformedTechnologies.filter(tech => 
				tech.applicableIndustries?.includes(clientId)
			);
			return {
				success: true,
				technologies: filteredTechnologies,
			};
		}

		return {
			success: true,
			technologies: transformedTechnologies,
		};
	} catch (error) {
		console.error("Error fetching technologies:", error);
		return { error: "Failed to fetch technologies" };
	}
}

export async function getTechnologyById(technologyId: string) {
	try {
		const technologiesCollection = await getTechnologiesCollection();
		const technology = await technologiesCollection.findOne({
			_id: new ObjectId(technologyId),
		});

		if (!technology) {
			return { error: "Technology not found" };
		}

		return {
			success: true,
			technology: {
				id: technology._id.toString(),
				name: technology.name,
				description: technology.description,
				icon: technology.icon,
				status: technology.status,
				applicableIndustries: technology.applicableIndustries || [],
				parameters: technology.parameters || [],
				created_at: technology.created_at,
				updated_at: technology.updated_at,
			},
		};
	} catch (error) {
		console.error("Error fetching technology:", error);
		return { error: "Failed to fetch technology" };
	}
}

export async function updateTechnologyStatus(
	technologyId: string,
	status: "verified" | "pending"
) {
	try {
		const technologiesCollection = await getTechnologiesCollection();

		const result = await technologiesCollection.updateOne(
			{ _id: new ObjectId(technologyId) },
			{
				$set: {
					status,
					updated_at: new Date(),
				},
			}
		);

		if (!result.acknowledged) {
			return { error: "Failed to update technology status" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			message: "Technology status updated successfully",
		};
	} catch (error) {
		console.error("Error updating technology status:", error);
		return { error: "Failed to update technology status" };
	}
}

export async function updateTechnology(
	technologyId: string,
	data: Partial<CreateTechnologyData>
) {
	try {
		const technologiesCollection = await getTechnologiesCollection();

		const updateData: any = {
			updated_at: new Date(),
		};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined) updateData.description = data.description;
		if (data.icon !== undefined) updateData.icon = data.icon;
		if (data.status !== undefined) updateData.status = data.status;
		if (data.applicableIndustries !== undefined) updateData.applicableIndustries = data.applicableIndustries;
		if (data.parameters !== undefined) updateData.parameters = data.parameters;

		const result = await technologiesCollection.updateOne(
			{ _id: new ObjectId(technologyId) },
			{ $set: updateData }
		);

		if (!result.acknowledged) {
			return { error: "Failed to update technology" };
		}

		if (result.matchedCount === 0) {
			return { error: "Technology not found" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			message: "Technology updated successfully",
		};
	} catch (error) {
		console.error("Error updating technology:", error);
		return { error: "Failed to update technology" };
	}
}

export async function deleteTechnology(technologyId: string) {
	try {
		const technologiesCollection = await getTechnologiesCollection();

		const result = await technologiesCollection.deleteOne({
			_id: new ObjectId(technologyId),
		});

		if (!result.acknowledged) {
			return { error: "Failed to delete technology" };
		}

		if (result.deletedCount === 0) {
			return { error: "Technology not found" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			message: "Technology deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting technology:", error);
		return { error: "Failed to delete technology" };
	}
}

/**
 * Get technologies filtered by selected technology IDs
 */
export async function getTechnologiesBySelectedIds(selectedTechnologyIds: string[]) {
	try {
		console.log("🔍 getTechnologiesBySelectedIds called with IDs:", selectedTechnologyIds);
		
		// Return cached data if valid
		if (isCacheValid() && technologiesCache.length > 0) {
			console.log("📦 Using cached technologies data");
			const filteredTechnologies = technologiesCache.filter(tech => 
				selectedTechnologyIds.includes(tech.id)
			);
			console.log("✅ Filtered technologies from cache:", filteredTechnologies.length);
			return {
				success: true,
				technologies: filteredTechnologies,
			};
		}

		console.log("🔄 Cache invalid or empty, fetching from database");
		const technologiesCollection = await getTechnologiesCollection();
		
		// Build query based on selected technology IDs
		const query = {
			_id: { $in: selectedTechnologyIds.map((id) => new ObjectId(id)) }
		};
		
		console.log("🔍 Database query:", JSON.stringify(query, null, 2));

		const technologies = await technologiesCollection.find(query).toArray();
		console.log("📊 Found technologies in database:", technologies.length);

		const transformedTechnologies = technologies.map((technology) => ({
			id: technology._id.toString(),
			name: technology.name,
			description: technology.description,
			icon: technology.icon,
			status: technology.status,
			applicableIndustries: technology.applicableIndustries || [],
			parameters: technology.parameters || [],
			created_at: technology.created_at,
			updated_at: technology.updated_at,
		}));

		console.log("✅ Transformed technologies:", transformedTechnologies.map(t => ({ id: t.id, name: t.name })));

		// Update cache (store all technologies for potential reuse)
		technologiesCache = transformedTechnologies;
		cacheTimestamp = Date.now();

		return {
			success: true,
			technologies: transformedTechnologies,
		};
	} catch (error) {
		console.error("❌ Error fetching technologies by selected IDs:", error);
		return { error: "Failed to fetch technologies" };
	}
}

/**
 * Force refresh cache (useful for testing or manual refresh)
 */
export async function refreshTechnologiesCache(): Promise<void> {
	invalidateCache();
}
