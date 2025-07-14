"use server";

import { ObjectId } from "mongodb";
import { getScenariosCollection } from "@/lib/mongoDb/db";
import { getUserData } from "@/lib/actions/auth/get-user-data";

export interface ScenarioData {
	id: string;
	scenario_name: string;
	associated_project_id: string;
	solution: string[];
	solution_variant: string;
	compared_to: string[];
	input_parameters: any[];
	results: any[];
	client_id: string;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export async function getScenariosByProjectId(
	userId: string,
	projectId: string
): Promise<{
	success: boolean;
	scenarios?: ScenarioData[];
	error?: string;
}> {
	try {
		// Get current user data to verify permissions
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const scenariosCollection = await getScenariosCollection();

		// Fetch scenarios where associated_project_id matches
		const scenarios = await scenariosCollection
			.find({ associated_project_id: projectId })
			.sort({ created_at: -1 }) // Sort by newest first
			.toArray();

		// Transform the data to match our interface
		const transformedScenarios: ScenarioData[] = scenarios.map((scenario) => ({
			id: scenario._id.toString(),
			scenario_name: scenario.scenario_name || "",
			associated_project_id: scenario.associated_project_id || "",
			solution: scenario.solution || [],
			solution_variant: scenario.solution_variant || "N/A",
			compared_to: scenario.compared_to || [],
			input_parameters: scenario.input_parameters || [],
			results: scenario.results || [],
			client_id: scenario.client_id || "",
			user_id: scenario.user_id || "",
			created_at: scenario.created_at
				? new Date(scenario.created_at).toISOString()
				: new Date().toISOString(),
			updated_at: scenario.updated_at
				? new Date(scenario.updated_at).toISOString()
				: new Date().toISOString(),
		}));

		return {
			success: true,
			scenarios: transformedScenarios,
		};
	} catch (error) {
		console.error("Error fetching scenarios:", error);
		return { success: false, error: "Failed to fetch scenarios" };
	}
}

export async function createScenario(
	userId: string,
	scenarioData: Omit<ScenarioData, "id" | "created_at" | "updated_at">
): Promise<{
	success: boolean;
	scenario?: ScenarioData;
	error?: string;
}> {
	try {
		// Get current user data to verify permissions
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const scenariosCollection = await getScenariosCollection();

		const newScenario = {
			...scenarioData,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await scenariosCollection.insertOne(newScenario);

		if (!result.acknowledged) {
			return { success: false, error: "Failed to create scenario" };
		}

		const createdScenario: ScenarioData = {
			id: result.insertedId.toString(),
			...newScenario,
			created_at: newScenario.created_at.toISOString(),
			updated_at: newScenario.updated_at.toISOString(),
		};

		return {
			success: true,
			scenario: createdScenario,
		};
	} catch (error) {
		console.error("Error creating scenario:", error);
		return { success: false, error: "Failed to create scenario" };
	}
}

export async function updateScenario(
	userId: string,
	scenarioId: string,
	updateData: Partial<
		Omit<ScenarioData, "id" | "client_id" | "user_id" | "created_at">
	>
): Promise<{
	success: boolean;
	scenario?: ScenarioData;
	error?: string;
}> {
	try {
		// Get current user data to verify permissions
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const scenariosCollection = await getScenariosCollection();

		const result = await scenariosCollection.findOneAndUpdate(
			{
				_id: new ObjectId(scenarioId),
			},
			{
				$set: {
					...updateData,
					updated_at: new Date(),
				},
			},
			{ returnDocument: "after" }
		);

		if (!result || !result.value) {
			return { success: false, error: "Scenario not found or access denied" };
		}

		const scenarioDoc = result.value;
		const updatedScenario: ScenarioData = {
			id: scenarioDoc._id.toString(),
			scenario_name: scenarioDoc.scenario_name || "",
			associated_project_id: scenarioDoc.associated_project_id || "",
			solution: scenarioDoc.solution || [],
			solution_variant: scenarioDoc.solution_variant || "N/A",
			compared_to: scenarioDoc.compared_to || [],
			input_parameters: scenarioDoc.input_parameters || [],
			results: scenarioDoc.results || [],
			client_id: scenarioDoc.client_id || "",
			user_id: scenarioDoc.user_id || "",
			created_at: scenarioDoc.created_at
				? new Date(scenarioDoc.created_at).toISOString()
				: new Date().toISOString(),
			updated_at: scenarioDoc.updated_at
				? new Date(scenarioDoc.updated_at).toISOString()
				: new Date().toISOString(),
		};

		return {
			success: true,
			scenario: updatedScenario,
		};
	} catch (error) {
		console.error("Error updating scenario:", error);
		return { success: false, error: "Failed to update scenario" };
	}
}

export async function deleteScenario(
	userId: string,
	scenarioId: string
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		// Get current user data to verify permissions
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const scenariosCollection = await getScenariosCollection();

		const result = await scenariosCollection.deleteOne({
			_id: new ObjectId(scenarioId),
		});

		if (result.deletedCount === 0) {
			return { success: false, error: "Scenario not found or access denied" };
		}

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error deleting scenario:", error);
		return { success: false, error: "Failed to delete scenario" };
	}
}
