import CustomSidebar from "@/components/sidebar/custom-sidebar";
import DashboardClientWrapper from "./components/dashboard-client-wrapper";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DashboardClientWrapper>
			<div className="flex h-screen overflow-hidden">
				<CustomSidebar />
				{children}
			</div>
		</DashboardClientWrapper>
	);
}
