import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsersCollection } from "@/lib/mongoDb/db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const usersCollection = await getUsersCollection();
					const user = await usersCollection.findOne({
						email: credentials.email,
					});

					if (!user) {
						return null;
					}

					// Ensure user has required fields
					if (!user._id || !user.email || !user.passwordHash) {
						console.error("User missing required fields:", { 
							hasId: !!user._id, 
							hasEmail: !!user.email, 
							hasPasswordHash: !!user.passwordHash 
						});
						return null;
					}

					const isPasswordValid = await compare(
						credentials.password,
						user.passwordHash
					);

					if (!isPasswordValid) {
						return null;
					}

					// Return minimal user data to keep JWT small
					return {
						id: user._id?.toString() || "",
						email: user.email,
						name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown User",
						role: user.role || "user",
						client_id: user.client_id?.toString() || "",
					};
				} catch (error) {
					console.error("Auth error:", error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt" as const,
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				// Store only essential data in JWT
				token.role = user.role;
				token.client_id = user.client_id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				// Add essential data to session
				session.user.id = token.sub!;
				session.user.role = token.role!;
				session.user.client_id = token.client_id!;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
	// Add NEXTAUTH_URL configuration for proper redirect handling
	...(process.env.NEXTAUTH_URL && {
		url: process.env.NEXTAUTH_URL,
	}),
};

export default NextAuth(authOptions);
