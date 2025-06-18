"use server";

import { getUsersCollection, getCompaniesCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";
import { hash } from "bcrypt";
import { sendEmail, generateWelcomeEmail } from "../utils/SMTP-email-template";
import crypto from "crypto";

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

function convertToClientData(user: any) {
	return {
		...user,
		_id: user._id.toString(),
		company_id: user.company_id.toString(),
		created_at: user.created_at.toISOString(),
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

export async function getUsersByCompany(companyId: string) {
	try {
		const usersCollection = await getUsersCollection();
		const companiesCollection = await getCompaniesCollection();

		// First get the company name
		const company = await companiesCollection.findOne({
			_id: new ObjectId(companyId),
		});
		const companyName = company?.name || "Unknown Company";

		const users = await usersCollection
			.find({ company_id: new ObjectId(companyId) })
			.toArray();

		if (!users) {
			return { error: "No users found for this company" };
		}

		const safeUsers = users.map((user) => ({
			id: user._id.toString(),
			first_name: user.first_name || "",
			last_name: user.last_name || "",
			email: user.email,
			role: user.role || "user",
			company_name: companyName, // Use the fetched company name
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
	email: string;
	mobile_number?: string;
	work_number?: string;
	role: "super-admin" | "admin" | "user" | "seller" | "buyer";
	company_id: string;
	timezone?: string;
	currency?: string;
	unit_system?: "metric" | "imperial";
	company_name: string;
}

export async function createUser(data: CreateUserData) {
	try {
		const usersCollection = await getUsersCollection();

		const normalizedEmail = data.email.toLowerCase();

		const existingUser = await usersCollection.findOne({
			email: normalizedEmail,
		});
		if (existingUser) {
			return { error: "User with this email already exists" };
		}

		// Generate a temporary password hash (user will need to reset password)
		const tempPassword = Math.random().toString(36).slice(-8);
		const passwordHash = await hash(tempPassword, 10);

		// Generate a reset token
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

		const newUser = {
			first_name: data.first_name,
			last_name: data.last_name,
			email: normalizedEmail,
			passwordHash,
			role: data.role,
			company_id: new ObjectId(data.company_id),
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
			await sendEmail({
				to: data.email,
				subject: `Welcome to NovAzure`,
				html: generateWelcomeEmail(
					data.first_name,
					data.last_name,
					data.company_name,
					resetToken
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
				email: createdUser.email,
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
