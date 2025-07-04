"use server";

import { getClientsCollection, getUsersCollection } from "@/lib/mongoDb/db";
import { ObjectId } from "mongodb";
import { removeCompanyFromIndustries } from "../industry/industry";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { sendEmail, generateWelcomeEmail } from "../utils/SMTP-email-template";

export interface ClientData {
	id?: string;
	logo: string;
	companyName: string;
	website: string;
	mainContactEmail: string;
	mainContactFirstName?: string;
	mainContactLastName?: string;
	mainContactPhone?: string;
	techContactFirstName?: string;
	techContactLastName?: string;
	techContactEmail?: string;
	techContactPhone?: string;
	companyIndustry?: string;
	companySize?: string;
	street?: string;
	city?: string;
	stateProvince?: string;
	zipcodePostalCode?: string;
	country?: string;
	timezone?: string;
	clientStatus?: string;
	additionalNotes?: string;
	selectedIndustries?: string[];
	selectedTechnologies?: string[];
	userCount?: number;
	productCount?: number;
	productPendingCount?: number;
	scenarioCount?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export async function getClients(): Promise<{
	clients?: ClientData[];
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();
		const clients = await collection.find({}).toArray();

		const transformedClients: ClientData[] = clients
			.filter((client) => client._id.toString() !== "684ad0ca270ad70b516c4bd0")
			.map((client) => ({
				id: client._id.toString(),
				logo: client.logo || "Building2",
				companyName: client.companyName,
				website: client.website,
				mainContactEmail: client.mainContactEmail,
				mainContactFirstName: client.mainContactFirstName,
				mainContactLastName: client.mainContactLastName,
				mainContactPhone: client.mainContactPhone,
				techContactFirstName: client.techContactFirstName,
				techContactLastName: client.techContactLastName,
				techContactEmail: client.techContactEmail,
				techContactPhone: client.techContactPhone,
				companyIndustry: client.companyIndustry,
				companySize: client.companySize,
				street: client.street,
				city: client.city,
				stateProvince: client.stateProvince,
				zipcodePostalCode: client.zipcodePostalCode,
				country: client.country,
				timezone: client.timezone,
				clientStatus: client.clientStatus || "prospect",
				additionalNotes: client.additionalNotes,
				selectedIndustries: client.selectedIndustries || [],
				selectedTechnologies: client.selectedTechnologies || [],
				userCount: client.userCount || 0,
				productCount: client.productCount || 0,
				productPendingCount: client.productPendingCount || 0,
				scenarioCount: client.scenarioCount || 0,
				createdAt: client.createdAt,
				updatedAt: client.updatedAt,
			}));

		return { clients: transformedClients };
	} catch (error) {
		console.error("Error fetching clients:", error);
		return { error: "Failed to fetch clients" };
	}
}

export async function createClient(
	clientData: Omit<ClientData, "id" | "createdAt" | "updatedAt">
): Promise<{
	clientId?: string;
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();

		const newClient = {
			...clientData,
			userCount: clientData.userCount || 0,
			productCount: clientData.productCount || 0,
			productPendingCount: clientData.productPendingCount || 0,
			scenarioCount: clientData.scenarioCount || 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await collection.insertOne(newClient);

		if (result.insertedId) {
			// Create a user account for the main contact
			const userCreationResult = await createClientUser(
				clientData,
				result.insertedId.toString()
			);

			if (userCreationResult.error) {
				console.error("Warning: Failed to create user account:", userCreationResult.error);
				// Don't fail the client creation, just log the warning
			}

			return { clientId: result.insertedId.toString() };
		} else {
			return { error: "Failed to create client" };
		}
	} catch (error) {
		console.error("Error creating client:", error);
		return { error: "Failed to create client" };
	}
}

// Function to create a user account for a client's main contact
async function createClientUser(
	clientData: Omit<ClientData, "id" | "createdAt" | "updatedAt">,
	clientId: string
): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const usersCollection = await getUsersCollection();

		// Generate login email
		const loginEmail = generateClientLoginEmail(
			clientData.mainContactFirstName || "",
			clientData.mainContactLastName || "",
			clientData.companyName
		);

		if (!loginEmail) {
			return { error: "Unable to generate login email - missing contact information" };
		}

		// Check if user with this email already exists
		const existingUser = await usersCollection.findOne({
			email: loginEmail.toLowerCase(),
		});

		if (existingUser) {
			return { error: "User with this email already exists" };
		}

		// Generate a temporary password hash (user will need to reset password)
		const tempPassword = Math.random().toString(36).slice(-8);
		const passwordHash = await hash(tempPassword, 10);

		// Generate a reset token for initial password setup (1 week expiration)
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

		const newUser = {
			first_name: clientData.mainContactFirstName || "",
			last_name: clientData.mainContactLastName || "",
			email: loginEmail.toLowerCase(),
			passwordHash,
			role: "admin",
			client_id: new ObjectId(clientId),
			mobile_number: clientData.mainContactPhone || "",
			work_number: "",
			timezone: clientData.timezone || "UTC",
			currency: "USD",
			unit_system: "metric",
			created_at: new Date(),
			isVerified: false,
			profile_image: "",
			resetToken,
			resetTokenExpiry,
		};

		const result = await usersCollection.insertOne(newUser);

		if (!result.acknowledged) {
			return { error: "Failed to create user account" };
		}

		// Send welcome email to the main contact email (not the generated login email)
		try {
			await sendEmail({
				to: clientData.mainContactEmail.toLowerCase(),
				subject: `Welcome to NovAzure - ${clientData.companyName}`,
				html: generateWelcomeEmail(
					clientData.mainContactFirstName || "",
					clientData.mainContactLastName || "",
					clientData.companyName,
					resetToken,
					loginEmail // Pass the login email to include in the welcome message
				),
			});
		} catch (emailError) {
			console.error("Error sending welcome email:", emailError);
			// Don't fail user creation if email fails
		}

		console.log(`User account created for client ${clientData.companyName}: ${loginEmail}`);
		return { success: true };
	} catch (error) {
		console.error("Error creating client user:", error);
		return { error: "Failed to create user account" };
	}
}

// Function to generate login email for client
function generateClientLoginEmail(
	firstName: string,
	lastName: string,
	companyName: string
): string {
	if (!firstName || !lastName || !companyName) {
		return "";
	}

	// Clean and normalize inputs
	const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, "").toLowerCase();
	const cleanLastName = lastName.replace(/[^a-zA-Z]/g, "").toLowerCase();
	const cleanCompanyName = companyName
		.replace(/[^a-zA-Z0-9]/g, "")
		.replace(/\s+/g, "")
		.toLowerCase();

	if (!cleanFirstName || !cleanLastName || !cleanCompanyName) {
		return "";
	}

	// Generate email: firstLetter + lastName + "-" + companyName + "@novazure.com"
	const firstLetter = cleanFirstName.charAt(0).toUpperCase();
	const email = `${firstLetter}${cleanLastName}-${cleanCompanyName}@novazure.com`;

	return email;
}

export async function updateClient(
	clientId: string,
	clientData: Partial<ClientData>
): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();

		const updateData = {
			...clientData,
			updatedAt: new Date(),
		};

		const result = await collection.updateOne(
			{ _id: new ObjectId(clientId) },
			{ $set: updateData }
		);

		if (result.matchedCount > 0) {
			return { success: true };
		} else {
			return { error: "Client not found" };
		}
	} catch (error) {
		console.error("Error updating client:", error);
		return { error: "Failed to update client" };
	}
}

export async function deleteClient(clientId: string): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();

		// First, get the client to find which industries it's associated with
		const client = await collection.findOne({ _id: new ObjectId(clientId) });

		if (!client) {
			return { error: "Client not found" };
		}

		// Remove the company from all associated industries
		if (client.selectedIndustries && client.selectedIndustries.length > 0) {
			const removeResult = await removeCompanyFromIndustries(
				client.selectedIndustries,
				clientId
			);
			if (removeResult.error) {
				console.error(
					"Warning: Failed to remove company from industries:",
					removeResult.error
				);
				// Continue with deletion even if industry update fails
			}
		}

		// Delete the client
		const result = await collection.deleteOne({ _id: new ObjectId(clientId) });

		if (result.deletedCount > 0) {
			return { success: true };
		} else {
			return { error: "Client not found" };
		}
	} catch (error) {
		console.error("Error deleting client:", error);
		return { error: "Failed to delete client" };
	}
}
