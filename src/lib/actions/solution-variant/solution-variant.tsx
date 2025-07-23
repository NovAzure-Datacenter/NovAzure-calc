"use server";

import { ObjectId } from "mongodb";
import { getSolutionVariantsCollection } from "@/lib/mongoDb/db";

export interface CreateSolutionVariantData {
	name: string;
	description: string;
	icon: string;
	solution_id: string;
	created_by: string;
}

export interface SolutionVariantData {
	_id: string;
	name: string;
	description: string;
	icon: string;
	solution_id: string;
	created_by: string;
	created_at: Date;
	updated_at: Date;
}

export interface UpdateSolutionVariantData {
	name?: string;
	description?: string;
	icon?: string;
}

export async function createSolutionVariant(data: CreateSolutionVariantData) {
	try {
		const solutionVariantsCollection = await getSolutionVariantsCollection();

		const solutionVariant = {
			name: data.name,
			description: data.description,
			icon: data.icon,
			solution_id: new ObjectId(data.solution_id),
			created_by: data.created_by,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await solutionVariantsCollection.insertOne(solutionVariant);

		if (!result.acknowledged) {
			return { error: "Failed to create solution variant" };
		}

		return {
			success: true,
			solution_variant_id: result.insertedId.toString(),
			message: "Solution variant created successfully",
		};
	} catch (error) {
		console.error("Error creating solution variant:", error);
		return { error: "Failed to create solution variant" };
	}
}

export async function getSolutionVariantsBySolutionId(solutionId: string) {
	try {
		const solutionVariantsCollection = await getSolutionVariantsCollection();
		
		// Validate that solutionId is a valid ObjectId
		if (!ObjectId.isValid(solutionId)) {
			console.error("Invalid ObjectId:", solutionId);
			return { error: "Invalid solution ID format" };
		}
		
		const solutionVariants = await solutionVariantsCollection
			.find({ solution_id: new ObjectId(solutionId) })
			.toArray();

		//console.log(`Found ${solutionVariants.length} variants for solution ${solutionId}`);

		return {
			success: true,
			solutionVariants: solutionVariants.map((variant) => ({
				id: variant._id.toString(),
				name: variant.name,
				description: variant.description,
				icon: variant.icon,
				solution_id: variant.solution_id.toString(),
				created_by: variant.created_by,
				created_at: variant.created_at,
				updated_at: variant.updated_at,
			})),
		};
	} catch (error) {
		console.error("Error fetching solution variants:", error);
		return { error: "Failed to fetch solution variants" };
	}
}

export async function updateSolutionVariant(
	solutionVariantId: string,
	data: UpdateSolutionVariantData
) {
	try {
		const solutionVariantsCollection = await getSolutionVariantsCollection();

		const updateData: any = {
			updated_at: new Date(),
		};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined) updateData.description = data.description;
		if (data.icon !== undefined) updateData.icon = data.icon;

		const result = await solutionVariantsCollection.updateOne(
			{ _id: new ObjectId(solutionVariantId) },
			{ $set: updateData }
		);

		if (!result.acknowledged) {
			return { error: "Failed to update solution variant" };
		}

		if (result.matchedCount === 0) {
			return { error: "Solution variant not found" };
		}

		return {
			success: true,
			message: "Solution variant updated successfully",
		};
	} catch (error) {
		console.error("Error updating solution variant:", error);
		return { error: "Failed to update solution variant" };
	}
}

export async function updateSolutionVariantSolutionId(
	solutionVariantId: string,
	solutionId: string
) {
	try {
		const solutionVariantsCollection = await getSolutionVariantsCollection();

		const result = await solutionVariantsCollection.updateOne(
			{ _id: new ObjectId(solutionVariantId) },
			{ 
				$set: { 
					solution_id: new ObjectId(solutionId),
					updated_at: new Date()
				} 
			}
		);

		if (!result.acknowledged) {
			return { error: "Failed to update solution variant" };
		}

		if (result.matchedCount === 0) {
			return { error: "Solution variant not found" };
		}

		return {
			success: true,
			message: "Solution variant updated successfully",
		};
	} catch (error) {
		console.error("Error updating solution variant:", error);
		return { error: "Failed to update solution variant" };
	}
}

export async function deleteSolutionVariant(solutionVariantId: string) {
	try {
		const solutionVariantsCollection = await getSolutionVariantsCollection();

		const result = await solutionVariantsCollection.deleteOne({
			_id: new ObjectId(solutionVariantId),
		});

		if (!result.acknowledged) {
			return { error: "Failed to delete solution variant" };
		}

		if (result.deletedCount === 0) {
			return { error: "Solution variant not found" };
		}

		return {
			success: true,
			message: "Solution variant deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting solution variant:", error);
		return { error: "Failed to delete solution variant" };
	}
}
