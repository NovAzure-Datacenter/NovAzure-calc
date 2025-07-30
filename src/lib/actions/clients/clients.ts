"use server";

import { getClientsCollection, getUsersCollection } from "@/lib/mongoDb/db";
import { getConnectedClient } from "@/lib/mongoDb/dbConnect";
import { ObjectId } from "mongodb";
import { removeCompanyFromIndustries } from "../industry/industry";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { sendEmail, generateWelcomeEmail } from "../utils/SMTP-email-template";
import { monitorDatabaseOperation } from "../utils/connection-monitor";

// Cache for client data to avoid multiple database calls
let clientCache: { [userId: string]: ClientData } = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
function isCacheValid(): boolean {
	return Date.now() - cacheTimestamp < CACHE_DURATION;
}

// Helper function to invalidate cache
function invalidateCache(): void {
	clientCache = {};
	cacheTimestamp = 0;
}

export interface ClientData {
	id?: string;
	logo: string;
	company_name: string;
	website: string;
	main_contact_email: string;
	main_contact_first_name?: string;
	main_contact_last_name?: string;
	main_contact_phone?: string;
	tech_contact_first_name?: string;
	tech_contact_last_name?: string;
	tech_contact_email?: string;
	tech_contact_phone?: string;
	company_industry?: string;
	company_size?: string;
	street?: string;
	city?: string;
	state_province?: string;
	zipcode_postal_code?: string;
	country?: string;
	timezone?: string;
	client_status?: string;
	additional_notes?: string;
	selected_industries?: string[];
	selected_technologies?: string[];
	user_count?: number;
	product_count?: number;
	product_pending_count?: number;
	scenario_count?: number;
	login_email?: string;
	created_at?: Date;
	updated_at?: Date;
}

/**
 * Get client by user ID with caching
 */
export async function getClientByUserId(userId: string): Promise<{
	client?: ClientData;
	error?: string;
}> {
	try {
		// Return cached data if valid
		if (isCacheValid() && clientCache[userId]) {
			return { client: clientCache[userId] };
		}

		const usersCollection = await getUsersCollection();
		const clientsCollection = await getClientsCollection();

		// Get user to find their client_id
		const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
		if (!user) {
			return { error: "User not found" };
		}

		if (!user.client_id) {
			return { error: "User has no associated client" };
		}

		// Get client data
		const client = await clientsCollection.findOne({ _id: user.client_id });
		if (!client) {
			return { error: "Client not found" };
		}

		const transformedClient: ClientData = {
			id: client._id.toString(),
			logo: client.logo || "Building2",
			company_name: client.company_name,
			website: client.website,
			main_contact_email: client.main_contact_email,
			main_contact_first_name: client.main_contact_first_name,
			main_contact_last_name: client.main_contact_last_name,
			main_contact_phone: client.main_contact_phone,
			tech_contact_first_name: client.tech_contact_first_name,
			tech_contact_last_name: client.tech_contact_last_name,
			tech_contact_email: client.tech_contact_email,
			tech_contact_phone: client.tech_contact_phone,
			company_industry: client.company_industry,
			company_size: client.company_size,
			street: client.street,
			city: client.city,
			state_province: client.state_province,
			zipcode_postal_code: client.zipcode_postal_code,
			country: client.country,
			timezone: client.timezone,
			client_status: client.client_status || "prospect",
			additional_notes: client.additional_notes,
			selected_industries: client.selected_industries || [],
			selected_technologies: client.selected_technologies || [],
			user_count: client.user_count || 0,
			product_count: client.product_count || 0,
			product_pending_count: client.product_pending_count || 0,
			scenario_count: client.scenario_count || 0,
			login_email: client.login_email,
			created_at: client.created_at,
			updated_at: client.updated_at,
		};

		// Update cache
		clientCache[userId] = transformedClient;
		cacheTimestamp = Date.now();

		return { client: transformedClient };
	} catch (error) {
		console.error("Error fetching client by user ID:", error);
		return { error: "Failed to fetch client data" };
	}
}

/**
 * Get all clients
 */
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
				company_name: client.company_name	,
				website: client.website,
				main_contact_email: client.main_contact_email,
				main_contact_first_name: client.main_contact_first_name,
				main_contact_last_name: client.main_contact_last_name,
				main_contact_phone: client.main_contact_phone,
				tech_contact_first_name: client.tech_contact_first_name,
				tech_contact_last_name: client.tech_contact_last_name,
				tech_contact_email: client.tech_contact_email,
				tech_contact_phone: client.tech_contact_phone,
				company_industry: client.company_industry,
				company_size: client.company_size,
				street: client.street,
				city: client.city,
				state_province: client.state_province,
				zipcode_postal_code: client.zipcode_postal_code,	
				country: client.country,
				timezone: client.timezone,
				client_status: client.client_status || "prospect",
				additional_notes: client.additional_notes,
				selected_industries: client.selected_industries || [],
				selected_technologies: client.selected_technologies || [],
				user_count: client.user_count || 0,
				product_count: client.product_count || 0,
				product_pending_count: client.product_pending_count || 0,
				scenario_count: client.scenario_count || 0,
				login_email: client.login_email,
				created_at: client.created_at,
				updated_at: client.updated_at,
			}));

		return { clients: transformedClients };
	} catch (error) {
		console.error("Error fetching clients:", error);
		return { error: "Failed to fetch clients" };
	}
}

/**
 * Create a new client
 */
export async function createClient(
	clientData: Omit<ClientData, "id" | "created_at" | "updated_at">
): Promise<{
	clientId?: string;
	loginEmail?: string;
	error?: string;
}> {
	try {
		const collection = await getClientsCollection();

		// Generate login email
		const loginEmail = generateClientLoginEmail(
			clientData.main_contact_first_name || "",
			clientData.main_contact_last_name || "",
			clientData.company_name
		);

		const newClient = {
			...clientData,
			login_email: loginEmail,
			user_count: clientData.user_count || 0,
			product_count: clientData.product_count || 0,
			product_pending_count: clientData.product_pending_count || 0,
			scenario_count: clientData.scenario_count || 0,
			created_at: new Date(),
			updated_at: new Date(),
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

			// Invalidate cache to ensure fresh data
			invalidateCache();

			return { clientId: result.insertedId.toString(), loginEmail };
		} else {
			return { error: "Failed to create client" };
		}
	} catch (error) {
		console.error("Error creating client:", error);
		return { error: "Failed to create client" };
	}
}

/**
 * Update a client
 */
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
			updated_at: new Date(),
		};

		const result = await collection.updateOne(
			{ _id: new ObjectId(clientId) },
			{ $set: updateData }
		);

		if (result.matchedCount > 0) {
			// Invalidate cache to ensure fresh data
			invalidateCache();
			return { success: true };
		} else {
			return { error: "Client not found" };
		}
	} catch (error) {
		console.error("Error updating client:", error);
		return { error: "Failed to update client" };
	}
}

/**
 * Delete a client
 */
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
		if (client.selected_industries && client.selected_industries.length > 0) {
			const removeResult = await removeCompanyFromIndustries(
				client.selected_industries,
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
			// Invalidate cache to ensure fresh data
			invalidateCache();
			return { success: true };
		} else {
			return { error: "Client not found" };
		}
	} catch (error) {
		console.error("Error deleting client:", error);
		return { error: "Failed to delete client" };
	}
}

/**
 * Get client details
 */
export async function getClientDetails(clientId: string) {
	try {
		const collection = await getClientsCollection();
		const client = await collection.findOne({ _id: new ObjectId(clientId) });
		if (!client) {
			return { error: "Client not found" };
		}

		return {
			success: true,
			client: {
				name: client.company_name,
				_id: client._id.toString(),
				industry: client.company_industry,
				contact_email: client.main_contact_email,
				contact_number: client.main_contact_phone,
				website: client.website,
				logo: client.logo,
				country: client.country,
				currency: "USD", // Default currency for clients
				address: `${client.street || ""} ${client.city || ""} ${client.state_province || ""} ${client.zipcode_postal_code || ""}`.trim(),
				plan: "standard", // Default plan for clients
				created_at: client.created_at
			}
		};
	} catch (error) {
		console.error("Error fetching client details:", error);
		return { error: "Failed to fetch client details" };
	}
}

/**
 * Get client data by client ID with full details including selected industries and technologies
 */
export async function getClientDataById(clientId: string): Promise<{
	client?: ClientData;
	error?: string;
}> {
	try {
		console.log("🔍 getClientDataById called with clientId:", clientId);
		
		const clientsCollection = await getClientsCollection();
		const client = await clientsCollection.findOne({ _id: new ObjectId(clientId) });
		
		if (!client) {
			console.log("❌ Client not found for ID:", clientId);
			return { error: "Client not found" };
		}

		console.log("✅ Client found:", {
			id: client._id.toString(),
			company_name: client.company_name,
			selected_industries: client.selected_industries,
			selected_technologies: client.selected_technologies
		});

		const transformedClient: ClientData = {
			id: client._id.toString(),
			logo: client.logo || "Building2",
			company_name: client.company_name,
			website: client.website,
			main_contact_email: client.main_contact_email,
			main_contact_first_name: client.main_contact_first_name,
			main_contact_last_name: client.main_contact_last_name,
			main_contact_phone: client.main_contact_phone,
			tech_contact_first_name: client.tech_contact_first_name,
			tech_contact_last_name: client.tech_contact_last_name,
			tech_contact_email: client.tech_contact_email,
			tech_contact_phone: client.tech_contact_phone,
			company_industry: client.company_industry,
			company_size: client.company_size,
			street: client.street,
			city: client.city,
			state_province: client.state_province,
			zipcode_postal_code: client.zipcode_postal_code,
			country: client.country,
			timezone: client.timezone,
			client_status: client.client_status || "prospect",
			additional_notes: client.additional_notes,
			selected_industries: client.selected_industries || [],
			selected_technologies: client.selected_technologies || [],
			user_count: client.user_count || 0,
			product_count: client.product_count || 0,
			product_pending_count: client.product_pending_count || 0,
			scenario_count: client.scenario_count || 0,
			login_email: client.login_email,
			created_at: client.created_at,
			updated_at: client.updated_at,
		};

		console.log("✅ Transformed client data:", {
			id: transformedClient.id,
			company_name: transformedClient.company_name,
			selected_industries: transformedClient.selected_industries,
			selected_technologies: transformedClient.selected_technologies
		});

		return { client: transformedClient };
	} catch (error) {
		console.error("❌ Error fetching client data:", error);
		return { error: "Failed to fetch client data" };
	}
}

// Function to create a user account for a client's main contact
async function createClientUser(
	clientData: Omit<ClientData, "id" | "created_at" | "updated_at">,
	clientId: string
): Promise<{
	success?: boolean;
	error?: string;
}> {
	try {
		const usersCollection = await getUsersCollection();

		// Generate login email
		const loginEmail = generateClientLoginEmail(
			clientData.main_contact_first_name || "",
			clientData.main_contact_last_name || "",
			clientData.company_name
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
			first_name: clientData.main_contact_first_name || "",
			last_name: clientData.main_contact_last_name || "",
			email: loginEmail.toLowerCase(),
			passwordHash,
			role: "admin",
			client_id: new ObjectId(clientId),
			mobile_number: clientData.main_contact_phone || "",
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
				to: clientData.main_contact_email.toLowerCase(),
				subject: `Welcome to NovAzure - ${clientData.company_name}`,
				html: generateWelcomeEmail(
					clientData.main_contact_first_name || "",
					clientData.main_contact_last_name || "",
					clientData.company_name,
					resetToken,
					loginEmail 
				),
			});
		} catch (emailError) {
			console.error("Error sending welcome email:", emailError);
			// Don't fail user creation if email fails
		}

		//console.log(`User account created for client ${clientData.company_name}: ${loginEmail}`);
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

/**
 * Optimized function to load clients with related data in a single operation
 */
export async function getClientsWithRelatedData(): Promise<{
	clients?: ClientData[];
	industries?: Array<{ id: string; name: string; icon: string }>;
	technologies?: Array<{ id: string; name: string; icon: string }>;
	error?: string;
}> {
	return monitorDatabaseOperation(async () => {
		try {
			const { db } = await getConnectedClient();
			
			// Execute all queries in parallel using a single connection
			const [clients, industries, technologies] = await Promise.all([
				db.collection('clients').find({}).toArray(),
				db.collection('industry').find({}).toArray(),
				db.collection('technologies').find({}).toArray()
			]);

			// Transform clients
			const transformedClients: ClientData[] = clients
				.filter((client: any) => client._id.toString() !== "684ad0ca270ad70b516c4bd0")
				.map((client: any) => ({
					id: client._id.toString(),
					logo: client.logo || "Building2",
					company_name: client.company_name,
					website: client.website,
					main_contact_email: client.main_contact_email,
					main_contact_first_name: client.main_contact_first_name,
					main_contact_last_name: client.main_contact_last_name,
					main_contact_phone: client.main_contact_phone,
					tech_contact_first_name: client.tech_contact_first_name,
					tech_contact_last_name: client.tech_contact_last_name,
					tech_contact_email: client.tech_contact_email,
					tech_contact_phone: client.tech_contact_phone,
					company_industry: client.company_industry,
					company_size: client.company_size,
					street: client.street,
					city: client.city,
					state_province: client.state_province,
					zipcode_postal_code: client.zipcode_postal_code,	
					country: client.country,
					timezone: client.timezone,
					client_status: client.client_status || "prospect",
					additional_notes: client.additional_notes,
					selected_industries: client.selected_industries || [],
					selected_technologies: client.selected_technologies || [],
					user_count: client.user_count || 0,
					product_count: client.product_count || 0,
					product_pending_count: client.product_pending_count || 0,
					scenario_count: client.scenario_count || 0,
					login_email: client.login_email,
					created_at: client.created_at,
					updated_at: client.updated_at,
				}));

			// Transform industries
			const transformedIndustries = industries.map((industry: any) => ({
				id: industry._id.toString(),
				name: industry.name,
				icon: industry.icon || "Building2",
			}));

			// Transform technologies
			const transformedTechnologies = technologies.map((technology: any) => ({
				id: technology._id.toString(),
				name: technology.name,
				icon: technology.icon || "Cpu",
			}));

			return {
				clients: transformedClients,
				industries: transformedIndustries,
				technologies: transformedTechnologies,
			};
		} catch (error) {
			console.error("Error fetching clients with related data:", error);
			return { error: "Failed to fetch data" };
		}
	});
}

/**
 * Force refresh cache (useful for testing or manual refresh)
 */
export async function refreshClientCache(): Promise<void> {
	invalidateCache();
}