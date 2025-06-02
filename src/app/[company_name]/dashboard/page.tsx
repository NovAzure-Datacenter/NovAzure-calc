"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

import CustomSidebar from "@/components/sidebar/custom-sidebar";
import { useUser } from "@/hooks/useUser";

export default function Page() {
	const [activeTab, setActiveTab] = useState<string>("Dashboard");
	const { user } = useUser();

	return (
		<SidebarProvider defaultOpen>
			<CustomSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
			<main className="flex-1 min-h-screen w-full">
				<div className="flex w-full items-center gap-2 px-6 h-14">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">
									Building Your Application
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Data Fetching</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className="flex-1 px-6 py-6 flex w-full flex-col gap-6">
				</div>
			</main>
		</SidebarProvider>
	);
}
