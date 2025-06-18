'use server'

import { getUsersCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";

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
        created_at: user.created_at.toISOString()
    };
}

export async function updateUserProfile(userId: string, data: UpdateUserProfileData) {
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
                    ...(data.work_number && { work_number: data.work_number })
                }
            }
        );

        if (!result.acknowledged) {
            return { error: "Failed to update profile" };
        }

        const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!updatedUser) {
            return { error: "Failed to fetch updated profile" };
        }

        const safeUser = convertToClientData(updatedUser);

        return {
            success: true,
            user: safeUser
        };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { error: "Failed to update profile" };
    }
} 