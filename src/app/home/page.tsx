import { Suspense } from "react";
import Loading from "@/components/loading-main";
import UnderConstruction from "@/components/under-construction";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import IndustriesAndTechnologies from "./admin/industries-and-technologies/page";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	return (
		<Suspense fallback={<Loading />}>
			<IndustriesAndTechnologies />
		</Suspense>
	);
}
