"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CompanyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider className="flex h-screen">
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
