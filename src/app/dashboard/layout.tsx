"use client";

import CustomSidebar from "@/components/sidebar/custom-sidebar";
import { ActiveComponentProvider, useActiveComponent } from "@/contexts/active-component-context";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
	const { activeComponent, setActiveComponent } = useActiveComponent();

	return (
		<div className="flex h-screen overflow-hidden">
			<CustomSidebar
				activeTab={activeComponent}
				setActiveTab={setActiveComponent}
			/>
			{children}
		</div>
	);
}


// set active component context
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ActiveComponentProvider>
			<DashboardLayoutContent>{children}</DashboardLayoutContent>
		</ActiveComponentProvider>
	);
}
