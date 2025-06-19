import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { getUserData } from "@/lib/actions/auth/get-user-data";

export interface UserData {
	first_name: string;
	last_name: string;
	account_type: string;
	profile_image: string;
	company_name: string;
	company_id: string;
	email: string;
	work_number: string;
	mobile_number: string;
	timezone: string;
	currency: string;
	unit_system: string;
	_id: string;
	role: string;
}

export function useUser() {
	const { data: session, status } = useSession();
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoadingUserData, setIsLoadingUserData] = useState(false);

	// Fetch additional user data when session is available
	useEffect(() => {
		async function fetchUserData() {
			if (session?.user?.id && !userData) {
				setIsLoadingUserData(true);
				try {
					const fullUserData = await getUserData(session.user.id);
					if (fullUserData) {
						setUserData(fullUserData);
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				} finally {
					setIsLoadingUserData(false);
				}
			}
		}

		fetchUserData();
	}, [session?.user?.id, userData]);

	const isUserLoggedIn = status === "authenticated";
	const isLoading = status === "loading" || isLoadingUserData;

	const updateUser = async (userData: UserData | null) => {
		// With NextAuth, user data is managed server-side
		// This function is kept for compatibility but doesn't modify localStorage
		console.log("User data updated:", userData);
	};

	const logout = async () => {
		await signOut({ callbackUrl: "/login" });
	};

	return {
		user: userData,
		updateUser,
		isUserLoggedIn,
		isLoading,
		logout,
		session, // Expose the full session for advanced use cases
	};
}
