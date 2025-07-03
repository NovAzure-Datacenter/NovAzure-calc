
import DashboardClientWrapper from "../dashboard/components/dashboard-client-wrapper";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import CustomSidebar from "@/components/sidebar/custom-sidebar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	return (
		<DashboardClientWrapper>
			<div className="flex h-screen overflow-hidden">
				<CustomSidebar />
				{children}
			</div>
		</DashboardClientWrapper>
	);
}
