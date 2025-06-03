"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CustomSidebar from "@/components/sidebar/custom-sidebar";

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
