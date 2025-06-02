import { useState, useEffect } from "react";

export interface UserData {
	name: string;
	account_type: string;
	profile_image: string;
	company_name: string;
}

export function useUser() {
	const [user, setUser] = useState<UserData | null>(null);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);
			setIsUserLoggedIn(true);
		}
		setIsLoading(false);

		function handleStorageChange(event: StorageEvent) {
			if (event.key === "user") {
				const newUserData = event.newValue ? JSON.parse(event.newValue) : null;
				setUser(newUserData);
				setIsUserLoggedIn(!!newUserData);
			}
		}

		// Handle changes from other tabs/windows
		window.addEventListener("storage", handleStorageChange);

		// Custom event for same-tab updates
		window.addEventListener("userChange", ((event: CustomEvent) => {
			setUser(event.detail);
			setIsUserLoggedIn(!!event.detail);
		}) as EventListener);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("userChange", ((event: CustomEvent) => {
				setUser(event.detail);
				setIsUserLoggedIn(!!event.detail);
			}) as EventListener);
		};
	}, []);

	const updateUser = (userData: UserData | null) => {
		if (userData) {
			localStorage.setItem("user", JSON.stringify(userData));
		} else {
			localStorage.removeItem("user");
		}

		// Dispatch custom event for same-tab updates
		window.dispatchEvent(new CustomEvent("userChange", { detail: userData }));
		setIsUserLoggedIn(!!userData);
	};

	return { user, updateUser, isUserLoggedIn, isLoading };
}
