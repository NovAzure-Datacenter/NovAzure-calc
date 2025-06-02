"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";

import CustomSidebar from "@/components/sidebar/custom-sidebar";
import { useUser } from "@/hooks/useUser";

export default function Page() {
	const [activeTab, setActiveTab] = useState<string>("Calculators");
	const { user } = useUser();

	return (
		<SidebarProvider>
			<div className="flex h-screen w-full">
				<CustomSidebar setActiveTab={setActiveTab} activeTab={activeTab} />

				<main className="flex flex-col flex-1 min-w-0">
					<header className="flex h-12 shrink-0 items-center gap-2  px-4">
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
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
						<div className="grid auto-rows-min gap-4 md:grid-cols-3">
							<div className="bg-muted/50 aspect-video rounded-xl" />
							<div className="bg-muted/50 aspect-video rounded-xl" />
							<div className="bg-muted/50 aspect-video rounded-xl" />
						</div>
						<div className="bg-muted/50 flex-1 rounded-xl" />
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
