'use server'

import { usersCollection } from "../mongoDb/db";
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

// Helper function to convert MongoDB document to safe client data
function convertToClientData(user: any) {
    return {
        ...user,
        _id: user._id.toString(),
        company_id: user.company_id.toString(),
        created_at: user.created_at.toISOString()
    };
}

// Debug function to create a demo user
export async function createDemoUser() {
    try {
        // Check if demo user already exists
        const existingUser = await usersCollection.findOne({ email: "demo@example.com" });
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
            company_name: "Demo Company"
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
            user: convertToClientData(safeUser)
        };
    } catch (error) {
        console.error("Error creating demo user:", error);
        return { error: "Failed to create demo user. Error: " + (error as Error).message };
    }
}

// Debug function to list all users
export async function getAllUsers() {
    try {
        const users = await usersCollection.find({}).toArray();
        // Remove sensitive data and convert ObjectIds to strings
        const safeUsers = users.map(user => {
            const { passwordHash, ...userWithoutPassword } = user;
            return convertToClientData(userWithoutPassword);
        });
        return { success: true, users: safeUsers };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { error: "Failed to fetch users" };
    }
}

export async function login(data: LoginData): Promise<LoginResponse> {
    try {
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
            profile_image: user.profile_image || "https://ui-avatars.com/api/?name=Unknown",
            company_name: user.company_name || "Unknown Company"
        };

        return { 
            success: true, 
            user: userData
        };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "An error occurred during login" };
    }
} 