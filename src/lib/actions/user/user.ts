"use server";

import { getUsersCollection, getClientsCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";
import { hash } from "bcryptjs";
import { sendEmail, generateWelcomeEmail } from "../utils/SMTP-email-template";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Function to generate login email for user
function generateUserLoginEmail(
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



export interface UpdateUserProfileData {
	first_name: string;
	last_name: string;
	email: string;
	timezone: string;
	currency: string;
	unit_system: string;
	profile_image?: string;
	mobile_number?: string;
	work_number?: string;
}

function convertToClientData(user: unknown) {
	if (!user || typeof user !== 'object') {
		throw new Error('Invalid user document');
	}
	
	const userDoc = user as { 
		_id: unknown; 
		client_id: unknown; 
		created_at: Date; 
		first_name?: string;
		last_name?: string;
		email?: string;
		role?: string;
		profile_image?: string;
		mobile_number?: string;
		work_number?: string;
		timezone?: string;
		currency?: string;
		unit_system?: string;
		account_type?: string;
		company_name?: string;
		original_email?: string; // Added original_email
		[key: string]: unknown 
	};
	
	return {
		_id: String(userDoc._id),
		client_id: String(userDoc.client_id),
		first_name: userDoc.first_name || "",
		last_name: userDoc.last_name || "",
		email: userDoc.email || "",
		role: userDoc.role || "",
		account_type: userDoc.account_type || "",
		profile_image: userDoc.profile_image || "",
		company_name: userDoc.company_name || "",
		mobile_number: userDoc.mobile_number || "",
		work_number: userDoc.work_number || "",
		timezone: userDoc.timezone || "",
		currency: userDoc.currency || "",
		unit_system: userDoc.unit_system || "",
		created_at: userDoc.created_at.toISOString(),
		original_email: userDoc.original_email || userDoc.email, // Added original_email
	};
}

export async function updateUserProfile(
	userId: string,
	data: UpdateUserProfileData
) {
	try {
		const usersCollection = await getUsersCollection();

		const result = await usersCollection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				$set: {
					first_name: data.first_name,
					last_name: data.last_name,
					email: data.email,
					timezone: data.timezone,
					currency: data.currency,
					unit_system: data.unit_system,
					...(data.profile_image && { profile_image: data.profile_image }),
					...(data.mobile_number && { mobile_number: data.mobile_number }),
					...(data.work_number && { work_number: data.work_number }),
				},
			}
		);

		if (!result.acknowledged) {
			return { error: "Failed to update profile" };
		}

		const updatedUser = await usersCollection.findOne({
			_id: new ObjectId(userId),
		});
		if (!updatedUser) {
			return { error: "Failed to fetch updated profile" };
		}

		const safeUser = convertToClientData(updatedUser);

		return {
			success: true,
			user: safeUser,
		};
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { error: "Failed to update profile" };
	}
}

export async function getUsersByCompany(clientId: string) {
	try {
		const usersCollection = await getUsersCollection();
		const clientsCollection = await getClientsCollection();

		// First get the client name
		const client = await clientsCollection.findOne({
			_id: new ObjectId(clientId),
		});
		const companyName = client?.company_name || "Unknown Company";

		const users = await usersCollection
			.find({ client_id: new ObjectId(clientId) })
			.toArray();

		if (!users) {
			return { error: "No users found for this company" };
		}
	
		const safeUsers = users.map((user) => ({
			id: user._id.toString(),
			first_name: user.first_name || "",
			last_name: user.last_name || "",
			email: user.email,
			original_email: user.original_email || user.email, // Include original email
			role: user.role || "user",
			company_name: companyName, 
			mobile_number: user.mobile_number || "",
			work_number: user.work_number || "",
			timezone: user.timezone || "",
			currency: user.currency || "",
			unit_system: user.unit_system || "",
			profile_image:
				user.profile_image || "/images/profile/default-profile-pic.png",
			isVerified: user.isVerified || false,
		}));

		return {
			success: true,
			users: safeUsers,
		};
	} catch (error) {
		console.error("Error fetching company users:", error);
		return { error: "Failed to fetch company users" };
	}
}

export interface CreateUserData {
	first_name: string;
	last_name: string;
	email: string; // This will be the generated login email
	original_email?: string; // Optional original email for contact
	mobile_number?: string;
	work_number?: string;
	role: "super-admin" | "admin" | "user" | "seller" | "buyer";
	client_id: string;
	timezone?: string;
	currency?: string;
	unit_system?: "metric" | "imperial";
	company_name: string;
}

export async function createUser(data: CreateUserData) {
	try {
		const usersCollection = await getUsersCollection();

		// Use the generated login email for authentication
		const loginEmail = data.email.toLowerCase();
		const originalEmail = data.email; // Store the original email for contact purposes

		const existingUser = await usersCollection.findOne({
			email: loginEmail,
		});
		if (existingUser) {
			return { error: "User with this login email already exists" };
		}

		// Generate a temporary password hash (user will need to reset password)
		const tempPassword = Math.random().toString(36).slice(-8);
		const passwordHash = await hash(tempPassword, 10);

		// Generate a reset token
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

		const newUser = {
			first_name: data.first_name,
			last_name: data.last_name,
			email: loginEmail, // Use the generated login email
			original_email: originalEmail, // Store the original email for contact
			passwordHash,
			role: data.role,
			client_id: new ObjectId(data.client_id),
			mobile_number: data.mobile_number || "",
			work_number: data.work_number || "",
			timezone: data.timezone || "UTC",
			currency: data.currency || "USD",
			unit_system: data.unit_system || "metric",
			created_at: new Date(),
			isVerified: false,
			profile_image: "/images/profile/default-profile-pic.png",
			resetToken,
			resetTokenExpiry,
		};

		const result = await usersCollection.insertOne(newUser);

		if (!result.acknowledged) {
			return { error: "Failed to create user" };
		}

		const createdUser = await usersCollection.findOne({
			_id: result.insertedId,
		});
		if (!createdUser) {
			return { error: "Failed to fetch created user" };
		}

		try {
			// Send welcome email to the original email address
			await sendEmail({
				to: originalEmail,
				subject: `Welcome to NovAzure`,
				html: generateWelcomeEmail(
					data.first_name,
					data.last_name,
					data.company_name,
					resetToken,
					loginEmail // Pass the login email
				),
			});
		} catch (emailError) {
			console.error("Error sending welcome email:", emailError);
		}

		return {
			success: true,
			user: {
				id: createdUser._id.toString(),
				first_name: createdUser.first_name,
				last_name: createdUser.last_name,
				email: createdUser.email, // This is the login email
				original_email: createdUser.original_email,
				role: createdUser.role,
				company_name: data.company_name,
				mobile_number: createdUser.mobile_number,
				work_number: createdUser.work_number,
				timezone: createdUser.timezone,
				currency: createdUser.currency,
				unit_system: createdUser.unit_system,
				profile_image: createdUser.profile_image,
				isVerified: createdUser.isVerified,
			},
		};
	} catch (error) {
		console.error("Error creating user:", error);
		return { error: "Failed to create user" };
	}
}

export async function getUserById(userId: string) {
	try {
		const usersCollection = await getUsersCollection();

		const user = await usersCollection.findOne({
			_id: new ObjectId(userId),
		});

		if (!user) {
			return { error: "User not found" };
		}

		return {
			success: true,
			user: {
				id: user._id.toString(),
				first_name: user.first_name || "",
				last_name: user.last_name || "",
				email: user.email,
				original_email: user.original_email || user.email,
				role: user.role || "user",
				client_id: user.client_id.toString(),
				mobile_number: user.mobile_number || "",
				work_number: user.work_number || "",
				timezone: user.timezone || "",
				currency: user.currency || "",
				unit_system: user.unit_system || "",
				profile_image: user.profile_image || "/images/profile/default-profile-pic.png",
				isVerified: user.isVerified || false,
				created_at: user.created_at,
			},
		};
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		return { error: "Failed to fetch user" };
	}
}

export async function deleteUser(userId: string) {
	try {
		const usersCollection = await getUsersCollection();

		// First check if user exists
		const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
		if (!user) {
			return { error: "User not found" };
		}

		// Delete the user
		const result = await usersCollection.deleteOne({
			_id: new ObjectId(userId),
		});

		if (!result.acknowledged) {
			return { error: "Failed to delete user" };
		}

		if (result.deletedCount === 0) {
			return { error: "No user was deleted" };
		}

		return {
			success: true,
			message: "User deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting user:", error);
		return { error: "Failed to delete user" };
	}
}

export async function getCurrentUserClientId() {
	try {
		const session = await getServerSession(authOptions);
		
		if (!session?.user?.email) {
			return null;
		}

		const usersCollection = await getUsersCollection();
		
		const user = await usersCollection.findOne({
			email: session.user.email,
		});

		if (!user || !user.client_id) {
			return null;
		}

		return user.client_id.toString();
	} catch (error) {
		console.error("Error getting current user client ID:", error);
		return null;
	}
}

export interface CreateUserForCurrentCompanyData {
	first_name: string;
	last_name: string;
	email: string; // Original contact email
	mobile_number?: string;
	work_number?: string;
	role: "admin" | "user";
	timezone?: string;
}

export async function createUserForCurrentCompany(data: CreateUserForCurrentCompanyData) {
	try {
		// Get current user's client_id
		const currentClientId = await getCurrentUserClientId();

		if (!currentClientId) {
			return { error: "Unable to determine current user's company" };
		}

		// Get client details for company name
		const clientsCollection = await getClientsCollection();
		const client = await clientsCollection.findOne({ _id: new ObjectId(currentClientId) });
		if (!client) {
			return { error: "Company not found" };
		}

		const companyName = client.company_name;

		// Generate login email for the new user
		const loginEmail = generateUserLoginEmail(data.first_name, data.last_name, companyName);
		if (!loginEmail) {
			return { error: "Unable to generate login email - missing required information" };
		}

		// Create user with current client_id
		const createUserData: CreateUserData = {
			...data,
			client_id: currentClientId,
			company_name: companyName,
			email: loginEmail, // Use the generated login email
			original_email: data.email, // Store the original email for contact
			currency: "USD", // Default currency
			unit_system: "metric", // Default unit system
		};

		return await createUser(createUserData);
	} catch (error) {
		console.error("Error creating user for current company:", error);
		return { error: "Failed to create user" };
	}
}
