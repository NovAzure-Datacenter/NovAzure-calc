"use server";

import { getSolutionsCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";
import { type Parameter, type Calculation } from "../../../app/home/product-and-solutions/mock-data";

export interface CreateSolutionData {
	selected_industry: string;
	selected_technology: string;
	solution_type: string;
	solution_variant: string;
	solution_name: string;
	solution_description: string;
	custom_solution_type: string;
	custom_solution_variant: string;
	parameters: Parameter[];
	calculations: Calculation[];
	status: "draft" | "pending" | "verified";
	created_by: string;
	client_id: string;
}

export interface SolutionData {
	_id: string;
	selected_industry: string;
	selected_technology: string;
	solution_type: string;
	solution_variant: string;
	solution_name: string;
	solution_description: string;
	custom_solution_type: string;
	custom_solution_variant: string;
	parameters: Parameter[];
	calculations: Calculation[];
	status: "draft" | "pending" | "verified";
	created_by: string;
	client_id: string;
	created_at: Date;
	updated_at: Date;
}

export interface UpdateSolutionData {
	selected_industry?: string;
	selected_technology?: string;
	solution_type?: string;
	solution_variant?: string;
	solution_name?: string;
	solution_description?: string;
	custom_solution_type?: string;
	custom_solution_variant?: string;
	parameters?: Parameter[];
	calculations?: Calculation[];
	status?: "draft" | "pending" | "verified";
}

export async function createSolution(data: CreateSolutionData) {
	try {
		const solutionsCollection = await getSolutionsCollection();

		const newSolution = {
			selected_industry: data.selected_industry,
			selected_technology: data.selected_technology,
			solution_type: data.solution_type,
			solution_variant: data.solution_variant,
			solution_name: data.solution_name,
			solution_description: data.solution_description,
			custom_solution_type: data.custom_solution_type,
			custom_solution_variant: data.custom_solution_variant,
			parameters: data.parameters,
			calculations: data.calculations,
			status: data.status,
			created_by: data.created_by,
			client_id: data.client_id,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await solutionsCollection.insertOne(newSolution);

		if (!result.acknowledged) {
			return { error: "Failed to create solution" };
		}

		return {
			success: true,
			solution_id: result.insertedId.toString(),
			message: "Solution created successfully",
		};
	} catch (error) {
		console.error("Error creating solution:", error);
		return { error: "Failed to create solution" };
	}
}

export async function getSolutions() {
	try {
		const solutionsCollection = await getSolutionsCollection();
		const solutions = await solutionsCollection.find({}).toArray();

		return {
			success: true,
			solutions: solutions.map((solution) => ({
				id: solution._id.toString(),
				selected_industry: solution.selected_industry,
				selected_technology: solution.selected_technology,
				solution_type: solution.solution_type,
				solution_variant: solution.solution_variant,
				solution_name: solution.solution_name,
				solution_description: solution.solution_description,
				custom_solution_type: solution.custom_solution_type,
				custom_solution_variant: solution.custom_solution_variant,
				parameters: solution.parameters,
				calculations: solution.calculations,
				status: solution.status,
				created_by: solution.created_by,
				client_id: solution.client_id,
				created_at: solution.created_at,
				updated_at: solution.updated_at,
			})),
		};
	} catch (error) {
		console.error("Error fetching solutions:", error);
		return { error: "Failed to fetch solutions" };
	}
}

export async function getSolutionById(solutionId: string) {
	try {
		const solutionsCollection = await getSolutionsCollection();

		const solution = await solutionsCollection.findOne({
			_id: new ObjectId(solutionId),
		});

		if (!solution) {
			return { error: "Solution not found" };
		}

		return {
			success: true,
			solution: {
				id: solution._id.toString(),
				selected_industry: solution.selected_industry,
				selected_technology: solution.selected_technology,
				solution_type: solution.solution_type,
				solution_variant: solution.solution_variant,
				solution_name: solution.solution_name,
				solution_description: solution.solution_description,
				custom_solution_type: solution.custom_solution_type,
				custom_solution_variant: solution.custom_solution_variant,
				parameters: solution.parameters,
				calculations: solution.calculations,
				status: solution.status,
				created_by: solution.created_by,
				client_id: solution.client_id,
				created_at: solution.created_at,
				updated_at: solution.updated_at,
			},
		};
	} catch (error) {
		console.error("Error fetching solution:", error);
		return { error: "Failed to fetch solution" };
	}
}

export async function getSolutionsByClientId(clientId: string) {
	try {
		const solutionsCollection = await getSolutionsCollection();
		const solutions = await solutionsCollection
			.find({ client_id: clientId })
			.toArray();

		return {
			success: true,
			solutions: solutions.map((solution) => ({
				id: solution._id.toString(),
				selected_industry: solution.selected_industry,
				selected_technology: solution.selected_technology,
				solution_type: solution.solution_type,
				solution_variant: solution.solution_variant,
				solution_name: solution.solution_name,
				solution_description: solution.solution_description,
				custom_solution_type: solution.custom_solution_type,
				custom_solution_variant: solution.custom_solution_variant,
				parameters: solution.parameters,
				calculations: solution.calculations,
				status: solution.status,
				created_by: solution.created_by,
				client_id: solution.client_id,
				created_at: solution.created_at,
				updated_at: solution.updated_at,
			})),
		};
	} catch (error) {
		console.error("Error fetching solutions by client ID:", error);
		return { error: "Failed to fetch solutions" };
	}
}

export async function updateSolution(
	solutionId: string,
	data: UpdateSolutionData
) {
	try {
		const solutionsCollection = await getSolutionsCollection();

		const updateData: any = {
			updated_at: new Date(),
		};

		if (data.selected_industry !== undefined) updateData.selected_industry = data.selected_industry;
		if (data.selected_technology !== undefined) updateData.selected_technology = data.selected_technology;
		if (data.solution_type !== undefined) updateData.solution_type = data.solution_type;
		if (data.solution_variant !== undefined) updateData.solution_variant = data.solution_variant;
		if (data.solution_name !== undefined) updateData.solution_name = data.solution_name;
		if (data.solution_description !== undefined) updateData.solution_description = data.solution_description;
		if (data.custom_solution_type !== undefined) updateData.custom_solution_type = data.custom_solution_type;
		if (data.custom_solution_variant !== undefined) updateData.custom_solution_variant = data.custom_solution_variant;
		if (data.parameters !== undefined) updateData.parameters = data.parameters;
		if (data.calculations !== undefined) updateData.calculations = data.calculations;
		if (data.status !== undefined) updateData.status = data.status;

		const result = await solutionsCollection.updateOne(
			{ _id: new ObjectId(solutionId) },
			{ $set: updateData }
		);

		if (!result.acknowledged) {
			return { error: "Failed to update solution" };
		}

		if (result.matchedCount === 0) {
			return { error: "Solution not found" };
		}

		return {
			success: true,
			message: "Solution updated successfully",
		};
	} catch (error) {
		console.error("Error updating solution:", error);
		return { error: "Failed to update solution" };
	}
}

export async function deleteSolution(solutionId: string) {
	try {
		const solutionsCollection = await getSolutionsCollection();

		const result = await solutionsCollection.deleteOne({
			_id: new ObjectId(solutionId),
		});

		if (!result.acknowledged) {
			return { error: "Failed to delete solution" };
		}

		if (result.deletedCount === 0) {
			return { error: "Solution not found" };
		}

		return {
			success: true,
			message: "Solution deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting solution:", error);
		return { error: "Failed to delete solution" };
	}
}

export async function submitSolutionForReview(solutionId: string) {
	try {
		const solutionsCollection = await getSolutionsCollection();

		const result = await solutionsCollection.updateOne(
			{ _id: new ObjectId(solutionId) },
			{ 
				$set: { 
					status: "pending",
					updated_at: new Date()
				} 
			}
		);

		if (!result.acknowledged) {
			return { error: "Failed to submit solution for review" };
		}

		if (result.matchedCount === 0) {
			return { error: "Solution not found" };
		}

		return {
			success: true,
			message: "Solution submitted for review successfully",
		};
	} catch (error) {
		console.error("Error submitting solution for review:", error);
		return { error: "Failed to submit solution for review" };
	}
} 