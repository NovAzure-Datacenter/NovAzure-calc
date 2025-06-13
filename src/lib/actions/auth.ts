"use server";

import { getUsersCollection } from "../mongoDb/db";
import { hash, compare } from "bcrypt";
import { UserData } from "@/hooks/useUser";
import { ObjectId } from "mongodb";

export interface LoginData {
	email: string;
	password: string;
}

export interface LoginResponse {
	success?: boolean;
	error?: string;
	user?: UserData;
}

export interface ResetPasswordRequest {
	email: string;
}

export interface VerifyResetCodeRequest {
	email: string;
	code: string;
}

export interface UpdatePasswordRequest {
	email: string;
	code: string;
	newPassword: string;
}

{
	/*
* Helper functions while in development - remove in production
convertToClientData() // Convert MongoDB document to safe client data
createDemoUser() // Create demo user
*/
}
function convertToClientData(user: any) {
	return {
		...user,
		_id: user._id.toString(),
		company_id: user.company_id.toString(),
		created_at: user.created_at.toISOString(),
	};
}
export async function createDemoUser() {
	try {
		// Check if demo user already exists
		const usersCollection = await getUsersCollection();
		const existingUser = await usersCollection.findOne({
			email: "demo@example.com",
		});
		if (existingUser) {
			return { error: "Demo user already exists" };
		}

		const demoUser = {
			email: "demo@example.com",
			passwordHash: await hash("demo123", 10),
			role: "admin",
			company_id: new ObjectId(),
			timezone: "UTC",
			currency: "USD",
			unit_system: "metric",
			created_at: new Date(),
			name: "Demo User",
			profile_image: "https://ui-avatars.com/api/?name=Demo+User",
			company_name: "Demo Company",
		};

		// Insert demo user
		const result = await usersCollection.insertOne(demoUser);

		if (!result.acknowledged) {
			return { error: "Failed to create demo user" };
		}

		// Return success without sensitive data and convert ObjectId to string
		const { passwordHash, ...safeUser } = demoUser;
		return {
			success: true,
			message: "Demo user created successfully",
			user: convertToClientData(safeUser),
		};
	} catch (error) {
		console.error("Error creating demo user:", error);
		return {
			error: "Failed to create demo user. Error: " + (error as Error).message,
		};
	}
}

{
	/*
* Login functions
login() // Login user
*/
}
export async function login(data: LoginData): Promise<LoginResponse> {
	try {
		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne({ email: data.email });

		if (!user) {
			return { error: "User not found" };
		}

		const isPasswordValid = await compare(data.password, user.passwordHash);

		if (!isPasswordValid) {
			return { error: "Invalid password" };
		}

		// Transform MongoDB user to UserData type
		const userData: UserData = {
			name: user.name || "Unknown",
			account_type: user.role,
			profile_image:
				user.profile_image || "https://ui-avatars.com/api/?name=Unknown",
			company_name: user.company_name || "Unknown Company",
		};

		return {
			success: true,
			user: userData,
		};
	} catch (error) {
		console.error("Login error:", error);

		return { error: "An error occurred during login. Please try again." };
	}
}

{
	/*
* Password reset functions
requestPasswordReset() // Send email with reset code
verifyResetCode() // Verify reset code
updatePassword() // Update password
*/
}
export async function requestPasswordReset(data: ResetPasswordRequest) {
	try {
		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne({ email: data.email });

		if (!user) {
			return { error: "No account found with this email" };
		}

		// Generate a 6-digit code
		const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
		const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

		// Update mongodb user with reset code
		await usersCollection.updateOne(
			{ email: data.email },
			{
				$set: {
					reset_code: resetCode,
					reset_code_expiry: resetCodeExpiry,
				},
			}
		);
		
		{
			/* 
            TODO: Send email with reset code
            Need to figure out what to use here:
            "nodemailer" or "resend", maybe novazure has something already we can build on
		*/
		}
		return {
			success: true,
			message: "Reset code sent to email",
			code: resetCode, 
		};
	} catch (error) {
		console.error("Error requesting password reset:", error);
		return { error: "Failed to process password reset request" };
	}
}

export async function verifyResetCode(data: VerifyResetCodeRequest) {
	try {
		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne({
			email: data.email,
			reset_code: data.code,
			reset_code_expiry: { $gt: new Date() },
		});

		if (!user) {
			return { error: "Invalid or expired reset code" };
		}

		return { success: true };
	} catch (error) {
		console.error("Error verifying reset code:", error);
		return { error: "Failed to verify reset code" };
	}
}

export async function updatePassword(data: UpdatePasswordRequest) {
	try {
		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne({
			email: data.email,
			reset_code: data.code,
			reset_code_expiry: { $gt: new Date() },
		});

		if (!user) {
			return { error: "Invalid or expired reset code" };
		}

		// Hash the new password
		const passwordHash = await hash(data.newPassword, 10);

		// Update password and clear reset code
		await usersCollection.updateOne(
			{ email: data.email },
			{
				$set: { passwordHash },
				$unset: { reset_code: "", reset_code_expiry: "" },
			}
		);

		return { success: true, message: "Password updated successfully" };
	} catch (error) {
		console.error("Error updating password:", error);
		return { error: "Failed to update password" };
	}
}
