"use server";

import { getUsersCollection, getClientsCollection } from "@/lib/mongoDb/db";
import { ObjectId } from "mongodb";
import { UserData } from "@/hooks/useUser";

export async function getUserData(userId: string): Promise<UserData | null> {
	try {
		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			return null;
		}

		// Fetch company name based on company_id
		let companyName = "Unknown Company";
		if (user.client_id) {
			const companiesCollection = await getClientsCollection();
			const company = await companiesCollection.findOne({ _id: user.client_id });
			companyName = company?.company_name || "Unknown Company";
		}
		return {
			first_name: user.first_name || "Unknown",
			last_name: user.last_name || "",
			account_type: user.role || "user",
			profile_image:
				user.profile_image || "/images/profile/default-profile-pic.png",
			company_name: companyName,
			client_id: user.client_id.toString(),
			email: user.email,
			work_number: user.work_number || "",
			mobile_number: user.mobile_number || "",
			timezone: user.timezone || "UTC",
			currency: user.currency || "USD",
			unit_system: user.unit_system || "metric",
			_id: user._id.toString(),
			role: user.role || "user",
		};
	} catch (error) {
		console.error("Error fetching user data:", error);
		return null;
	}
}
