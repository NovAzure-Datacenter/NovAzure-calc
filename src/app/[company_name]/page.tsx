"use client";

import CustomSidebar from "@/components/sidebar/custom-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";
import { Dashboard } from "./(dashboard)/dashboard";
import { Calculators } from "./(calculators)/calculators";
import { useParams } from "next/navigation";

export default function Page() {
	const [activeComponent, setActiveComponent] = useState<string>("/dashboard");
	const params = useParams();
	const company_name = params.company_name as string;

	const handleComponentChange = (url: string) => {
		setActiveComponent(url);
		window.history.pushState({}, "", `/${company_name}${url}`);
	};
	
	
	const renderComponent = () => {
		switch (activeComponent) {
			case "/dashboard":
				return <Dashboard />;
			case "/calculators":
			case "/calculators/store":
			case "/calculators/UPS-solution":
			case "/calculators/value-calculator":
				return <Calculators />;
			default:
				return <Dashboard />;
		}
	};

	return (
		<div className="flex h-screen">
			<CustomSidebar
				activeTab={activeComponent}
				setActiveTab={handleComponentChange}
			/>

			<div className="pt-12 flex-1">
				<header className="flex shrink-0 items-center gap-2 p-4 ">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">
									Building Your Application
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>
									{activeComponent.split("/").pop()?.replace(/-/g, " ")}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<main className="p-4">{renderComponent()}</main>
			</div>
		</div>
	);
}
