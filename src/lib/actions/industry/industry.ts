"use server";

import {
	getIndustriesCollection,
	getTechnologiesCollection,
} from "../../mongoDb/db";
import { ObjectId } from "mongodb";

export interface CreateIndustryData {
	name: string;
	description: string;
	technologies: string[]; // Array of technology IDs
	icon?: string; // Store icon name as string for MongoDB
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
	technologies: string[]; // Array of technology IDs
	companies: Array<{
		name: string;
		icon?: string;
	}>;
	icon?: string; // Store icon name as string for MongoDB
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
	technologies?: string[]; // Array of technology IDs
	icon?: string; // Store icon name as string for MongoDB
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
			icon: data.icon || "Building2", // Default to Building2 if no icon provided
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

export async function getIndustries() {
	try {
		const industriesCollection = await getIndustriesCollection();
		const technologiesCollection = await getTechnologiesCollection();

		const industries = await industriesCollection.find({}).toArray();

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

		return {
			success: true,
			industries: industries.map((industry) => ({
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
			})),
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
					.filter(Boolean), // Remove null entries
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

		return {
			success: true,
			message: "Industry deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting industry:", error);
		return { error: "Failed to delete industry" };
	}
}

export async function updateIndustry(industryId: string, data: UpdateIndustryData) {
	try {
		const industriesCollection = await getIndustriesCollection();

		const updateData: any = {
			updated_at: new Date(),
		};

		// Only include fields that are provided
		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined) updateData.description = data.description;
		if (data.technologies !== undefined) updateData.technologies = data.technologies;
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

		return {
			success: true,
			message: "Industry updated successfully",
		};
	} catch (error) {
		console.error("Error updating industry:", error);
		return { error: "Failed to update industry" };
	}
}
