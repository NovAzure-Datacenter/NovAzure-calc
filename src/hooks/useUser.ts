
import { useState, useEffect } from "react";

export interface UserData {
	name: string;
	account_type: string;
	profile_image: string;
	company_name: string;
}

export function useUser() {
	const [user, setUser] = useState<UserData | null>(null);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		// Check localStorage only on client side
		try {
			const userData = localStorage.getItem("user");
			if (userData) {
				const parsedUser = JSON.parse(userData);
				setUser(parsedUser);
				setIsUserLoggedIn(true);
			}
		} catch (error) {
			console.error("Error parsing user data from localStorage:", error);
		} finally {
			setIsLoading(false);
		}

		// Create event handlers
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "user") {
				try {
					const newUserData = event.newValue ? JSON.parse(event.newValue) : null;
					setUser(newUserData);
					setIsUserLoggedIn(!!newUserData);
				} catch (error) {
					console.error("Error parsing user data from storage event:", error);
				}
			}
		};

		const handleUserChange = (event: CustomEvent<UserData | null>) => {
			setUser(event.detail);
			setIsUserLoggedIn(!!event.detail);
		};

		// Add event listeners
		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("userChange", handleUserChange as EventListener);

		return () => {
			// Clean up event listeners
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("userChange", handleUserChange as EventListener);
		};
	}, []);

	const updateUser = (userData: UserData | null) => {
		try {
			if (userData) {
				localStorage.setItem("user", JSON.stringify(userData));
			} else {
				localStorage.removeItem("user");
			}

			// Dispatch custom event for same-tab updates
			window.dispatchEvent(new CustomEvent("userChange", { detail: userData }));
			
			setUser(userData);
			setIsUserLoggedIn(!!userData);
		} catch (error) {
			console.error("Error updating user data:", error);
		}
	};

	return { user, updateUser, isUserLoggedIn, isLoading };
}
