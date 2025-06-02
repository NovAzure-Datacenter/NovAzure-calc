"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function CompanyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isUserLoggedIn } = useUser();
	const router = useRouter();
	const params = useParams();

	useEffect(() => {
		if (user && isUserLoggedIn) {
			const sanitizedCompanyName = user.company_name
				.toLowerCase()
				.replace(/\s+/g, "-");

			if (params.company_name !== sanitizedCompanyName) {
				const currentPath = window.location.pathname;
				const pathAfterCompany = currentPath.split('/').slice(2).join('/');
				router.replace(`/${sanitizedCompanyName}/${pathAfterCompany}`);
			}
		}
	}, [user, isUserLoggedIn, router, params.company_name]);

	return <>{children}</>;
} 