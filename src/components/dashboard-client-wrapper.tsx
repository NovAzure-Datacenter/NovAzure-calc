"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { getClientDetails } from "@/lib/actions/clients/clients";
import Loading from "@/components/loading-main";

export default function DashboardClientWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading: isUserLoading } = useUser();
	const [isClientLoading, setIsClientLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchClientDetails() {
			setIsClientLoading(true);
			if (user?.client_id) {
				const result = await getClientDetails(user.client_id);
				if (result.success && result.client) {
				}
			}
			setIsClientLoading(false);
		}

		if (!isUserLoading && user) {
			fetchClientDetails();
		}
	}, [user?.client_id, isUserLoading, user]);

	useEffect(() => {
		setIsLoading(isUserLoading || isClientLoading);
	}, [isUserLoading, isClientLoading]);

	if (isLoading) {
		return <Loading />;
	}

	return <>{children}</>;
} 