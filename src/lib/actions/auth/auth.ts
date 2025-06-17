'use server'

import { getUsersCollection } from "../../mongoDb/db";
import { compare } from "bcrypt";
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

function convertToClientData(user: any) {
    return {
        ...user,
        _id: user._id.toString(),
        company_id: user.company_id.toString(),
        created_at: user.created_at.toISOString()
    };
}

export async function login(data: LoginData): Promise<LoginResponse> {
    try {
        const usersCollection = await getUsersCollection(); 
        const user = await usersCollection.findOne(
            { email: data.email },
            { readPreference: 'primary' }
        );

        if (!user) {
            return { error: "User not found" };
        }


        const isPasswordValid = await compare(data.password, user.passwordHash);

        if (!isPasswordValid) {
            return { error: "Invalid password" };
        }

        // Transform MongoDB user to UserData type
        const userData: UserData = {
            first_name: user.first_name || "Unknown",
            last_name: user.last_name || "",
            account_type: user.role, 
            work_number: user.work_number || "",
            mobile_number: user.mobile_number || "",
            profile_image: user.profile_image || "/images/profile/default-profile-pic.png",
            company_name: user.company_name || "Unknown Company",
            company_id: user.company_id.toString(),
            email: user.email,
            timezone: user.timezone || "UTC",
            currency: user.currency || "USD",
            unit_system: user.unit_system || "metric",
            _id: user._id.toString(),
            role: user.role || "user"
        };


        return { 
            success: true, 
            user: userData
        };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "An error occurred during login. Please try again." };
    }
} 