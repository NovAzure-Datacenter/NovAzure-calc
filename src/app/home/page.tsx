import { Suspense } from "react";
import Loading from "@/components/loading-main";
import UnderConstruction from "@/components/under-construction";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	return (
		<Suspense fallback={<Loading />}>
			<UnderConstruction title="Navigate to other pages using the dashboard navigation" />
		</Suspense>
	);
}
