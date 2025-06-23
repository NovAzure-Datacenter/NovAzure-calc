"use client";


import UnderConstruction from "@/components/under-construction";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
	const router = useRouter();

	useEffect(() => {
		router.push("/dashboard/home");
	}, [router]);

	return <UnderConstruction />;
}
