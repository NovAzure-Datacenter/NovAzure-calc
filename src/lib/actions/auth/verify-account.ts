"use server";

import { getUsersCollection } from "../../mongoDb/db";
import { hash } from "bcrypt";

export async function verifyAccountToken(token: string) {
	try {
		const usersCollection = await getUsersCollection();

		const user = await usersCollection.findOne({
			resetToken: token,
			resetTokenExpiry: { $gt: new Date() },
			isVerified: false,
		});

		if (!user) {
			return { error: "Invalid or expired verification token" };
		}

		return {
			success: true,
			user: {
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
			},
		};
	} catch (error) {
		console.error("Error verifying account token:", error);
		return { error: "Failed to verify account token" };
	}
}

export async function setupInitialPassword(token: string, password: string) {
	try {
		const usersCollection = await getUsersCollection();

		const user = await usersCollection.findOne({
			resetToken: token,
			resetTokenExpiry: { $gt: new Date() },
			isVerified: false,
		});

		if (!user) {
			return { error: "Invalid or expired verification token" };
		}

		// Hash the new password
		const passwordHash = await hash(password, 10);

		// Update user with new password, mark as verified, and clear reset token
		const result = await usersCollection.updateOne(
			{ _id: user._id },
			{
				$set: {
					passwordHash,
					isVerified: true,
				},
				$unset: {
					resetToken: "",
					resetTokenExpiry: "",
				},
			}
		);

		if (!result.acknowledged) {
			return { error: "Failed to update account" };
		}

		return { success: true };
	} catch (error) {
		console.error("Error setting up initial password:", error);
		return { error: "Failed to set up password" };
	}
}
