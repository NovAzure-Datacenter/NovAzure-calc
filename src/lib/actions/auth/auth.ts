'use server'

import { getUsersCollection, getClientsCollection } from "../../mongoDb/db";
import { compare } from "bcryptjs";
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

interface MongoUser {
    _id: ObjectId;
    email: string;
    passwordHash: string;
    first_name?: string;
    last_name?: string;
    role: string;
    work_number?: string;
    mobile_number?: string;
    profile_image?: string;
    client_id: ObjectId;
    timezone?: string;
    currency?: string;
    unit_system?: string;
    created_at: Date;
}

function _convertToClientData(user: MongoUser) {
    return {
        ...user,
        _id: user._id.toString(),
        client_id: user.client_id.toString(),
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

        // Fetch client name based on client_id
        let companyName = "Unknown Company";
        if (user.client_id) {
            const clientsCollection = await getClientsCollection();
            const client = await clientsCollection.findOne({ _id: user.client_id });
            companyName = client?.company_name || "Unknown Company";
        }

        // Transform MongoDB user to UserData type
        const userData: UserData = {
            first_name: user.first_name || "Unknown",
            last_name: user.last_name || "",
            account_type: user.role, 
            work_number: user.work_number || "",
            mobile_number: user.mobile_number || "",
            profile_image: user.profile_image || "/images/profile/default-profile-pic.png",
            company_name: companyName,
            client_id: user.client_id.toString(),
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