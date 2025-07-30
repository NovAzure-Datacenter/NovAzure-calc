"use server";

import { getUsersCollection } from "../../mongoDb/db";
import { hash, compare } from "bcryptjs";
import {
	sendEmail,
	generatePasswordResetEmail,
} from "../utils/SMTP-email-template";
import { ObjectId } from "mongodb";

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

export interface ChangePasswordRequest {
	userId: string;
	currentPassword: string;
	newPassword: string;
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

		// Send email with reset code
		try {
			await sendEmail({
				to: data.email,
				subject: "NovAzure Password Reset Code",
				html: generatePasswordResetEmail(resetCode),
			});
		} catch (emailError) {
			console.error("Failed to send reset email:", emailError);
			// If email fails, remove the reset code
			await usersCollection.updateOne(
				{ email: data.email },
				{
					$unset: { reset_code: "", reset_code_expiry: "" },
				}
			);
			return { error: "Failed to send reset code email" };
		}

		return {
			success: true,
			message: "Reset code sent to email",
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

export async function changePassword(data: ChangePasswordRequest) {
	try {
		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne({
			_id: new ObjectId(data.userId),
		});

		if (!user) {
			return { error: "User not found" };
		}

		// Verify current password
		const isValidPassword = await compare(
			data.currentPassword,
			user.passwordHash
		);
		if (!isValidPassword) {
			return { error: "Current password is incorrect" };
		}

		// Hash the new password
		const passwordHash = await hash(data.newPassword, 10);

		// Update password
		await usersCollection.updateOne(
			{ _id: new ObjectId(data.userId) },
			{ $set: { passwordHash } }
		);

		return { success: true, message: "Password updated successfully" };
	} catch (error) {
		console.error("Error changing password:", error);
		return { error: "Failed to change password" };
	}
}
