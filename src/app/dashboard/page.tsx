'use client'
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BuyerSidebar } from "./components/sidebar/buyers/sidepanel/buyer-sidebar";
import { useState } from "react";
import { buyerSideBarItems } from "./components/sidebar/sidebar-Items";




export default function Page() {
	const [activeTab, setActiveTab] = useState<string>("Dashboard");
	const ActiveComponent =
		buyerSideBarItems.items.find((item) => item.title === activeTab)?.component;


	return (
		<SidebarProvider defaultOpen>
			{/* <AppSidebar /> */}
			<BuyerSidebar setActiveTab={setActiveTab} activeTab={activeTab}/>
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
					{ActiveComponent && <ActiveComponent />}
				</div>
			</main>
		</SidebarProvider>
	);
}
