"use server";

import {
	getIndustriesCollection,
	getTechnologiesCollection,
} from "../../mongoDb/db";
import { ObjectId } from "mongodb";

// Cache for industries to avoid multiple database calls
let industriesCache: any[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
function isCacheValid(): boolean {
	return Date.now() - cacheTimestamp < CACHE_DURATION;
}

// Helper function to invalidate cache
function invalidateCache(): void {
	industriesCache = [];
	cacheTimestamp = 0;
}

export interface CreateIndustryData {
	name: string;
	description: string;
	technologies: string[];
	icon?: string; 
	parameters: Array<{
		name: string;
		value: number;
		unit: string;
		description: string;
		category: "cost" | "performance" | "environmental" | "other";
	}>;
}

export interface IndustryData {
	_id: string;
	name: string;
	description: string;
	technologies: string[]; 
	companies: Array<{
		name: string;
		icon?: string;
	}>;
	icon?: string; 
	status: "verified" | "pending";
	parameters: Array<{
		name: string;
		value: number;
		unit: string;
		description: string;
		category: "cost" | "performance" | "environmental" | "other";
	}>;
	created_at: Date;
	updated_at: Date;
}

export interface UpdateIndustryData {
	name?: string;
	description?: string;
	technologies?: string[]; 
	icon?: string; 
	parameters?: Array<{
		name: string;
		value: number;
		unit: string;
		description: string;
		category: "cost" | "performance" | "environmental" | "other";
	}>;
}

export async function createIndustry(data: CreateIndustryData) {
	try {
		const industriesCollection = await getIndustriesCollection();

		const newIndustry = {
			name: data.name,
			description: data.description,
			technologies: data.technologies,
			icon: data.icon || "Building2", 
			companies: [],
			status: "pending" as const,
			parameters: data.parameters,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await industriesCollection.insertOne(newIndustry);

		if (!result.acknowledged) {
			return { error: "Failed to create industry" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			industryId: result.insertedId.toString(),
			message: "Industry created successfully",
		};
	} catch (error) {
		console.error("Error creating industry:", error);
		return { error: "Failed to create industry" };
	}
}

export async function getIndustries(clientId?: string) {
	try {
		// Return cached data if valid (for now, we'll use a simple cache key)
		const cacheKey = clientId || "all";
		if (isCacheValid() && industriesCache.length > 0) {
			// If clientId is provided, filter the cached data
			if (clientId) {
				const filteredIndustries = industriesCache.filter(industry => 
					industry.companies?.some((company: any) => company.name === clientId)
				);
				return {
					success: true,
					industries: filteredIndustries,
				};
			}
			return {
				success: true,
				industries: industriesCache,
			};
		}

		const industriesCollection = await getIndustriesCollection();
		const technologiesCollection = await getTechnologiesCollection();

		// Build query based on clientId
		let query = {};
		if (clientId) {
			query = {
				"companies.name": clientId
			};
		}

		const industries = await industriesCollection.find(query).toArray();

		// Get all unique technology IDs from all industries
		const allTechnologyIds = industries.reduce((ids: string[], industry) => {
			if (industry.technologies && Array.isArray(industry.technologies)) {
				ids.push(...industry.technologies);
			}
			return ids;
		}, []);

		// Fetch all technologies by IDs
		const technologies = await technologiesCollection
			.find({ _id: { $in: allTechnologyIds.map((id) => new ObjectId(id)) } })
			.toArray();

		// Create a map of technology ID to technology data
		const technologyMap = new Map();
		technologies.forEach((tech) => {
			technologyMap.set(tech._id.toString(), tech);
		});

		const transformedIndustries = industries.map((industry) => ({
			id: industry._id.toString(),
			name: industry.name,
			description: industry.description,
			icon: industry.icon || "Building2",
			technologies: (industry.technologies || [])
				.map((techId: string) => {
					const tech = technologyMap.get(techId);
					return tech
						? {
								id: tech._id.toString(),
								name: tech.name,
								description: tech.description,
								category: tech.category,
								icon: tech.icon,
								efficiency: tech.efficiency,
								efficiencyUnit: tech.efficiencyUnit,
								cost: tech.cost,
								costUnit: tech.costUnit,
								energySavings: tech.energySavings,
								carbonReduction: tech.carbonReduction,
								implementationTime: tech.implementationTime,
								paybackPeriod: tech.paybackPeriod,
								status: tech.status,
								applicableIndustries: tech.applicableIndustries || [],
						  }
						: null;
				})
				.filter(Boolean), // Remove null entries
			companies: industry.companies || [],
			status: industry.status,
			parameters: industry.parameters || [],
			created_at: industry.created_at,
			updated_at: industry.updated_at,
		}));

		// Update cache (store all industries for potential reuse)
		industriesCache = transformedIndustries;
		cacheTimestamp = Date.now();

		// Return filtered data if clientId was provided
		if (clientId) {
			const filteredIndustries = transformedIndustries.filter(industry => 
				industry.companies?.some((company: any) => company.name === clientId)
			);
			return {
				success: true,
				industries: filteredIndustries,
			};
		}

		return {
			success: true,
			industries: transformedIndustries,
		};
	} catch (error) {
		console.error("Error fetching industries:", error);
		return { error: "Failed to fetch industries" };
	}
}

export async function getIndustryById(industryId: string) {
	try {
		const industriesCollection = await getIndustriesCollection();
		const technologiesCollection = await getTechnologiesCollection();

		const industry = await industriesCollection.findOne({
			_id: new ObjectId(industryId),
		});

		if (!industry) {
			return { error: "Industry not found" };
		}

		// Fetch technologies by IDs
		const technologies = await technologiesCollection
			.find({
				_id: {
					$in: (industry.technologies || []).map(
						(id: string) => new ObjectId(id)
					),
				},
			})
			.toArray();

		// Create a map of technology ID to technology data
		const technologyMap = new Map();
		technologies.forEach((tech) => {
			technologyMap.set(tech._id.toString(), tech);
		});

		return {
			success: true,
			industry: {
				id: industry._id.toString(),
				name: industry.name,
				description: industry.description,
				icon: industry.icon || "Building2",
				technologies: (industry.technologies || [])
					.map((techId: string) => {
						const tech = technologyMap.get(techId);
						return tech
							? {
									id: tech._id.toString(),
									name: tech.name,
									description: tech.description,
									category: tech.category,
									icon: tech.icon,
									efficiency: tech.efficiency,
									efficiencyUnit: tech.efficiencyUnit,
									cost: tech.cost,
									costUnit: tech.costUnit,
									energySavings: tech.energySavings,
									carbonReduction: tech.carbonReduction,
									implementationTime: tech.implementationTime,
									paybackPeriod: tech.paybackPeriod,
									status: tech.status,
									applicableIndustries: tech.applicableIndustries || [],
							  }
							: null;
					})
					.filter(Boolean), 
				companies: industry.companies || [],
				status: industry.status,
				parameters: industry.parameters || [],
				created_at: industry.created_at,
				updated_at: industry.updated_at,
			},
		};
	} catch (error) {
		console.error("Error fetching industry:", error);
		return { error: "Failed to fetch industry" };
	}
}

export async function updateIndustryStatus(
	industryId: string,
	status: "verified" | "pending"
) {
	try {
		const industriesCollection = await getIndustriesCollection();

		const result = await industriesCollection.updateOne(
			{ _id: new ObjectId(industryId) },
			{
				$set: {
					status,
					updated_at: new Date(),
				},
			}
		);

		if (!result.acknowledged) {
			return { error: "Failed to update industry status" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			message: "Industry status updated successfully",
		};
	} catch (error) {
		console.error("Error updating industry status:", error);
		return { error: "Failed to update industry status" };
	}
}

export async function deleteIndustry(industryId: string) {
	try {
		const industriesCollection = await getIndustriesCollection();

		const result = await industriesCollection.deleteOne({
			_id: new ObjectId(industryId),
		});

		if (!result.acknowledged) {
			return { error: "Failed to delete industry" };
		}

		if (result.deletedCount === 0) {
			return { error: "Industry not found" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			message: "Industry deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting industry:", error);
		return { error: "Failed to delete industry" };
	}
}

export async function updateIndustry(
	industryId: string,
	data: UpdateIndustryData
) {
	try {
		const industriesCollection = await getIndustriesCollection();

		const updateData: any = {
			updated_at: new Date(),
		};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined)
			updateData.description = data.description;
		if (data.technologies !== undefined)
			updateData.technologies = data.technologies;
		if (data.icon !== undefined) updateData.icon = data.icon;
		if (data.parameters !== undefined) updateData.parameters = data.parameters;

		const result = await industriesCollection.updateOne(
			{ _id: new ObjectId(industryId) },
			{ $set: updateData }
		);

		if (!result.acknowledged) {
			return { error: "Failed to update industry" };
		}

		if (result.matchedCount === 0) {
			return { error: "Industry not found" };
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			message: "Industry updated successfully",
		};
	} catch (error) {
		console.error("Error updating industry:", error);
		return { error: "Failed to update industry" };
	}
}

export async function updateIndustryCompanies(
	industryIds: string[],
	companyId: string
): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getIndustriesCollection();

		// Update all specified industries to add the company ID to their companies array
		const updatePromises = industryIds.map(async (industryId) => {
			const result = await collection.updateOne(
				{ _id: new ObjectId(industryId) },
				{
					$push: {
						companies: {
							name: companyId,
						},
					} as any,
					$set: {
						updated_at: new Date(),
					},
				}
			);
			return result;
		});

		await Promise.all(updatePromises);

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return { success: true };
	} catch (error) {
		console.error("Error updating industry companies:", error);
		return { error: "Failed to update industry companies" };
	}
}

export async function removeCompanyFromIndustries(
	industryIds: string[],
	companyId: string
): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getIndustriesCollection();

		// Update all specified industries to remove the company ID from their companies array
		const updatePromises = industryIds.map(async (industryId) => {
			const result = await collection.updateOne(
				{ _id: new ObjectId(industryId) },
				{
					$pull: {
						companies: {
							name: companyId,
						},
					} as any,
					$set: {
						updated_at: new Date(),
					},
				}
			);
			return result;
		});

		await Promise.all(updatePromises);

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return { success: true };
	} catch (error) {
		console.error("Error removing company from industries:", error);
		return { error: "Failed to remove company from industries" };
	}
}

export async function cleanupIndustryCompanies(): Promise<{
	success?: boolean;
	error?: string;
	cleanedCount?: number;
	totalIndustries?: number;
}> {
	try {
		const collection = await getIndustriesCollection();

		// Get all industries
		const industries = await collection.find({}).toArray();
		let totalCleaned = 0;

		// Process each industry
		for (const industry of industries) {
			if (!industry.companies || !Array.isArray(industry.companies)) {
				continue;
			}

			// Filter out text-based entries (keep only MongoDB ObjectId strings)
			const originalCount = industry.companies.length;
			const cleanedCompanies = industry.companies.filter((company: any) => {
				// Check if company.name is a valid MongoDB ObjectId string (24 hex characters)
				return (
					company.name &&
					typeof company.name === "string" &&
					/^[0-9a-fA-F]{24}$/.test(company.name)
				);
			});

			const removedCount = originalCount - cleanedCompanies.length;

			// Only update if there were changes
			if (removedCount > 0) {
				await collection.updateOne(
					{ _id: industry._id },
					{
						$set: {
							companies: cleanedCompanies,
							updated_at: new Date(),
						},
					}
				);
				totalCleaned += removedCount;
			}
		}

		// Invalidate cache to ensure fresh data
		invalidateCache();

		return {
			success: true,
			cleanedCount: totalCleaned,
			totalIndustries: industries.length,
		};
	} catch (error) {
		console.error("Error cleaning up industry companies:", error);
		return { error: "Failed to clean up industry companies" };
	}
}

/**
 * Get industries filtered by selected industry IDs
 */
export async function getIndustriesBySelectedIds(selectedIndustryIds: string[]) {
	try {
		console.log("🔍 getIndustriesBySelectedIds called with IDs:", selectedIndustryIds);
		
		// Return cached data if valid
		if (isCacheValid() && industriesCache.length > 0) {
			console.log("📦 Using cached industries data");
			const filteredIndustries = industriesCache.filter(industry => 
				selectedIndustryIds.includes(industry.id)
			);
			console.log("✅ Filtered industries from cache:", filteredIndustries.length);
			return {
				success: true,
				industries: filteredIndustries,
			};
		}

		console.log("🔄 Cache invalid or empty, fetching from database");
		const industriesCollection = await getIndustriesCollection();
		const technologiesCollection = await getTechnologiesCollection();

		// Build query based on selected industry IDs
		const query = {
			_id: { $in: selectedIndustryIds.map((id) => new ObjectId(id)) }
		};
		
		console.log("🔍 Database query:", JSON.stringify(query, null, 2));

		const industries = await industriesCollection.find(query).toArray();
		console.log("📊 Found industries in database:", industries.length);

		// Get all unique technology IDs from all industries
		const allTechnologyIds = industries.reduce((ids: string[], industry) => {
			if (industry.technologies && Array.isArray(industry.technologies)) {
				ids.push(...industry.technologies);
			}
			return ids;
		}, []);
		
		console.log("🔧 Technology IDs found in industries:", allTechnologyIds);

		// Fetch all technologies by IDs
		const technologies = await technologiesCollection
			.find({ _id: { $in: allTechnologyIds.map((id) => new ObjectId(id)) } })
			.toArray();
			
		console.log("📊 Found technologies in database:", technologies.length);

		// Create a map of technology ID to technology data
		const technologyMap = new Map();
		technologies.forEach((tech) => {
			technologyMap.set(tech._id.toString(), tech);
		});

		const transformedIndustries = industries.map((industry) => ({
			id: industry._id.toString(),
			name: industry.name,
			description: industry.description,
			icon: industry.icon || "Building2",
			technologies: (industry.technologies || [])
				.map((techId: string) => {
					const tech = technologyMap.get(techId);
					return tech
						? {
								id: tech._id.toString(),
								name: tech.name,
								description: tech.description,
								category: tech.category,
								icon: tech.icon,
								efficiency: tech.efficiency,
								efficiencyUnit: tech.efficiencyUnit,
								cost: tech.cost,
								costUnit: tech.costUnit,
								energySavings: tech.energySavings,
								carbonReduction: tech.carbonReduction,
								implementationTime: tech.implementationTime,
								paybackPeriod: tech.paybackPeriod,
								status: tech.status,
								applicableIndustries: tech.applicableIndustries || [],
						  }
						: null;
				})
				.filter(Boolean), // Remove null entries
			companies: industry.companies || [],
			status: industry.status,
			parameters: industry.parameters || [],
			created_at: industry.created_at,
			updated_at: industry.updated_at,
		}));

		console.log("✅ Transformed industries:", transformedIndustries.map(i => ({ id: i.id, name: i.name })));

		// Update cache (store all industries for potential reuse)
		industriesCache = transformedIndustries;
		cacheTimestamp = Date.now();

		return {
			success: true,
			industries: transformedIndustries,
		};
	} catch (error) {
		console.error("❌ Error fetching industries by selected IDs:", error);
		return { error: "Failed to fetch industries" };
	}
}

/**
 * Force refresh cache (useful for testing or manual refresh)
 */
export async function refreshIndustriesCache(): Promise<void> {
	invalidateCache();
}
