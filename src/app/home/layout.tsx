
import DashboardClientWrapper from "@/components/dashboard-client-wrapper";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import CustomSidebar from "@/components/sidebar/custom-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

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
			<CustomSidebar />
			<SidebarInset className="flex h-screen overflow-x-hidden   bg-gradient-to-br from-blue-50 to-sky-50 relative">
				{children}
			</SidebarInset>
		</DashboardClientWrapper>
	);
}
