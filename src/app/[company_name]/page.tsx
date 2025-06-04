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
import SolutionsForm from "./(solutions)/page";
import UnderConstruction from "@/components/under-construction";

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
			case "/solutions":
				return <SolutionsForm />;
			case "/calculators":
			case "/calculators/UPS-solution":
			case "/calculators/value-calculator":
				return <ValueCalculator />;

			case "/calculators/store":
				return <CalculatorsStore />;

			default:
				return <UnderConstruction />;
		}
	};

	return (
		<div className="min-h-screen flex pt-12">
			<CustomSidebar
				activeTab={activeComponent}
				setActiveTab={handleComponentChange}
			/>

			<SidebarInset className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950 dark:to-sky-950">
				<div className="p-4 max-h-screen overflow-x-hidden overflow-y-auto">
					{renderComponent()}
				</div>
			</SidebarInset>
		</div>
	);
}
