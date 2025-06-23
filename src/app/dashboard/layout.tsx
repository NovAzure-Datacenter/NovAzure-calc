"use client";

import CustomSidebar from "@/components/sidebar/custom-sidebar";
import Loading from "@/components/loading-main";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { getCompanyDetails } from "@/lib/actions/company/company";

export default function DashboardLayout({
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
					// Company details loaded successfully
				}
			}
			setIsCompanyLoading(false);
		}

		if (!isUserLoading && user) {
			fetchCompanyDetails();
		}
	}, [user?.company_id, isUserLoading, user]);

	useEffect(() => {
		// Show loading while either user data or company details are loading
		setIsLoading(isUserLoading || isCompanyLoading);
	}, [isUserLoading, isCompanyLoading]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="flex h-screen overflow-hidden">
			<CustomSidebar />
			{children}
		</div>
	);
}
