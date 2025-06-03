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
import { SidebarInset } from "@/components/ui/sidebar";
import { CalculatorsStore } from "./(calculators)/calculators-store";
import ValueCalculator from "./(calculators)/value-calculator";

export default function Page() {
	const [activeComponent, setActiveComponent] = useState<string>("/dashboard");
	const params = useParams();
	const company_name = params.company_name as string;

	const handleComponentChange = (url: string) => {
		setActiveComponent(url);
		// window.history.pushState({}, "", `/${company_name}${url}`);
	};

	const renderComponent = () => {
		switch (activeComponent) {
			case "/dashboard":
				return <Dashboard />;

			case "/calculators":
			case "/calculators/UPS-solution":
			case "/calculators/value-calculator":
				return <ValueCalculator />;

			case "/calculators/store":
				return <CalculatorsStore />;

			default:
				return <Dashboard />;
		}
	};

	return (
		<div className="min-h-screen flex pt-12">
			<CustomSidebar
				activeTab={activeComponent}
				setActiveTab={handleComponentChange}
			/>

			<SidebarInset>
				<div className="p-4 max-h-screen overflow-x-hidden overflow-y-auto">
					{renderComponent()}
				</div>
			</SidebarInset>
		</div>
	);
}
