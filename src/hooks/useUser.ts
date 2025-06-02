import { useState, useEffect } from "react";

interface UserData {
	name: string;
	account_type: string;
	profile_image: string;
}

export function useUser() {
	const [user, setUser] = useState<UserData | null>(() => {
		if (typeof window !== "undefined") {
			const userData = localStorage.getItem("user");
			return userData ? JSON.parse(userData) : null;
		}
		return null;
	});

	useEffect(() => {
		function handleStorageChange(event: StorageEvent) {
			if (event.key === "user") {
				setUser(event.newValue ? JSON.parse(event.newValue) : null);
			}
		}

		// Handle changes from other tabs/windows
		window.addEventListener("storage", handleStorageChange);

		// Custom event for same-tab updates
		window.addEventListener("userChange", ((event: CustomEvent) => {
			setUser(event.detail);
		}) as EventListener);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("userChange", ((event: CustomEvent) => {
				setUser(event.detail);
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
	};

	return { user, updateUser };
}
