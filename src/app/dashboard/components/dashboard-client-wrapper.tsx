"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { getCompanyDetails } from "@/lib/actions/company/company";
import Loading from "@/components/loading-main";

export default function DashboardClientWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading: isUserLoading } = useUser();
	const [isCompanyLoading, setIsCompanyLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchCompanyDetails() {
			setIsCompanyLoading(true);
			if (user?.company_id) {
				const result = await getCompanyDetails(user.company_id);
				if (result.success && result.company) {
				}
			}
			setIsCompanyLoading(false);
		}

		if (!isUserLoading && user) {
			fetchCompanyDetails();
		}
	}, [user?.company_id, isUserLoading, user]);

	useEffect(() => {
		setIsLoading(isUserLoading || isCompanyLoading);
	}, [isUserLoading, isCompanyLoading]);

	if (isLoading) {
		return <Loading />;
	}

	return <>{children}</>;
} 