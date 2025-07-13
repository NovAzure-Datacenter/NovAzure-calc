'use server';

import { ObjectId } from "mongodb";
import { getClientsProjectsCollection } from "@/lib/mongoDb/db";
import { getUserData } from "@/lib/actions/auth/get-user-data";

export interface ClientProjectData {
	id: string;
	name: string;
	description: string;
	start_date: string;
	end_date?: string;
	client_id: string;
	created_by: string;
	created_at: string;
	updated_at: string;
	scenarios: string[];
	industry: string[];
	technology: string[];
	project_manager?: string;
	budget?: number;
	location?: string;
	status?: "active" | "completed" | "on-hold" | "cancelled";
	priority?: "critical" | "high" | "medium" | "low";
}

export async function createClientProject(
	userId: string,
	projectData: Omit<ClientProjectData, "id" | "created_at" | "updated_at" | "scenarios">
): Promise<{
	success: boolean;
	project?: ClientProjectData;
	error?: string;
}> {
	try {
		// Get current user data to verify permissions
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const projectsCollection = await getClientsProjectsCollection();

		const newProject = {
			...projectData,
			created_at: new Date(),
			updated_at: new Date(),
			scenarios: [],
		};

		const result = await projectsCollection.insertOne(newProject);

		if (!result.acknowledged) {
			return { success: false, error: "Failed to create project" };
		}

		const createdProject: ClientProjectData = {
			id: result.insertedId.toString(),
			...newProject,
			created_at: newProject.created_at.toISOString(),
			updated_at: newProject.updated_at.toISOString(),
		};

		return {
			success: true,
			project: createdProject,
		};
	} catch (error) {
		console.error("Error creating project:", error);
		return { success: false, error: "Failed to create project" };
	}
}

export async function getProjectsByClientId(
	userId: string,
	clientId: string
): Promise<{
	success: boolean;
	projects?: ClientProjectData[];
	error?: string;
}> {
	try {
		// Get current user data to verify permissions
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const projectsCollection = await getClientsProjectsCollection();

		// Fetch projects where client_id matches
		const projects = await projectsCollection
			.find({ client_id: clientId })
			.sort({ created_at: -1 }) // Sort by newest first
			.toArray();

		// Transform the data to match our interface
		const transformedProjects: ClientProjectData[] = projects.map((project) => ({
			id: project._id.toString(),
			name: project.name || "",
			description: project.description || "",
			start_date: project.start_date ? new Date(project.start_date).toISOString() : new Date().toISOString(),
			end_date: project.end_date ? new Date(project.end_date).toISOString() : undefined,
			client_id: project.client_id || "",
			created_by: project.created_by || "",
			created_at: project.created_at ? new Date(project.created_at).toISOString() : new Date().toISOString(),
			updated_at: project.updated_at ? new Date(project.updated_at).toISOString() : new Date().toISOString(),
			scenarios: project.scenarios || [],
			industry: project.industry || [],
			technology: project.technology || [],
			project_manager: project.project_manager || undefined,
			budget: project.budget || undefined,
			location: project.location || undefined,
			status: project.status || "active",
			priority: project.priority || "medium",
		}));

		return {
			success: true,
			projects: transformedProjects,
		};
	} catch (error) {
		console.error("Error fetching projects:", error);
		return { success: false, error: "Failed to fetch projects" };
	}
}

export async function updateClientProject(
	userId: string,
	projectId: string,
	updateData: Partial<Omit<ClientProjectData, "id" | "client_id" | "created_by" | "created_at">>
): Promise<{
	success: boolean;
	project?: ClientProjectData;
	error?: string;
}> {
	try {
		// Get current user data to verify permissions
		const userData = await getUserData(userId);
		if (!userData) {
			return { success: false, error: "User not authenticated" };
		}

		const projectsCollection = await getClientsProjectsCollection();

		const result = await projectsCollection.findOneAndUpdate(
			{
				_id: new ObjectId(projectId),
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
			return { success: false, error: "Project not found or access denied" };
		}

		const projectDoc = result.value;
		const updatedProject: ClientProjectData = {
			id: projectDoc._id.toString(),
			name: projectDoc.name || "",
			description: projectDoc.description || "",
			start_date: projectDoc.start_date ? new Date(projectDoc.start_date).toISOString() : new Date().toISOString(),
			end_date: projectDoc.end_date ? new Date(projectDoc.end_date).toISOString() : undefined,
			client_id: projectDoc.client_id || "",
			created_by: projectDoc.created_by || "",
			created_at: projectDoc.created_at ? new Date(projectDoc.created_at).toISOString() : new Date().toISOString(),
			updated_at: projectDoc.updated_at ? new Date(projectDoc.updated_at).toISOString() : new Date().toISOString(),
			scenarios: projectDoc.scenarios || [],
			industry: projectDoc.industry || [],
			technology: projectDoc.technology || [],
			project_manager: projectDoc.project_manager || undefined,
			budget: projectDoc.budget || undefined,
			location: projectDoc.location || undefined,
			status: projectDoc.status || "active",
			priority: projectDoc.priority || "medium",
		};

		return {
			success: true,
			project: updatedProject,
		};
	} catch (error) {
		console.error("Error updating project:", error);
		return { success: false, error: "Failed to update project" };
	}
}

export async function deleteClientProject(
	userId: string,
	projectId: string
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

		const projectsCollection = await getClientsProjectsCollection();

		const result = await projectsCollection.deleteOne({
			_id: new ObjectId(projectId),
		});

		if (result.deletedCount === 0) {
			return { success: false, error: "Project not found or access denied" };
		}

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error deleting project:", error);
		return { success: false, error: "Failed to delete project" };
	}
}
