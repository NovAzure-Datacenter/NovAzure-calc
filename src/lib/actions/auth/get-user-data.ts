"use server";

import { getUsersCollection } from "@/lib/mongoDb/db";
import { ObjectId } from "mongodb";
import { UserData } from "@/hooks/useUser";

export async function getUserData(userId: string): Promise<UserData | null> {
	try {
		const usersCollection = await getUsersCollection();
		const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			return null;
		}

		return {
			first_name: user.first_name || "Unknown",
			last_name: user.last_name || "",
			account_type: user.role || "user",
			profile_image:
				user.profile_image || "/images/profile/default-profile-pic.png",
			company_name: user.company_name || "Unknown Company",
			company_id: user.company_id.toString(),
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
