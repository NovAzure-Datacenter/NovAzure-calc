"use server";

import { getTechnologiesCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";

export interface CreateTechnologyData {
	name: string;
	description: string;
	icon?: string; // Store icon name as string for MongoDB
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

export async function getTechnologies() {
	try {
		const technologiesCollection = await getTechnologiesCollection();
		const technologies = await technologiesCollection.find({}).toArray();

		return {
			success: true,
			technologies: technologies.map((technology) => ({
				id: technology._id.toString(),
				name: technology.name,
				description: technology.description,
				icon: technology.icon,
				status: technology.status,
				applicableIndustries: technology.applicableIndustries || [],
				parameters: technology.parameters || [],
				created_at: technology.created_at,
				updated_at: technology.updated_at,
			})),
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

		// Only update fields that are provided
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

		return {
			success: true,
			message: "Technology deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting technology:", error);
		return { error: "Failed to delete technology" };
	}
}
