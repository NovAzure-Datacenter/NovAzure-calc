"use client";

import CustomSidebar from "@/components/sidebar/custom-sidebar";
import { useState } from "react";
import { Dashboard } from "./(dashboard)/dashboard";
// import { TCOCalculator } from "../dashboard/(tcocalculator)/tcocalculator";
import { useParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { CalculatorsStore } from "./(calculators)/calculators-store";
import ValueCalculator from "./(calculators)/value-calculator";
import UnderConstruction from "@/components/under-construction";
import SolutionsDisplay from "./(solutions)/components/solutions-display";
import TechnologySelector from "./(solutions)/page";

export default function Page() {
	const [activeComponent, setActiveComponent] = useState<string>("/dashboard");
	const params = useParams();
	// const company_name = params.company_name as string;

	const handleComponentChange = (url: string) => {
		setActiveComponent(url);
		// window.history.pushState({}, "", `/${company_name}${url}`);
	};

	const renderComponent = () => {
		switch (activeComponent) {
			case "/dashboard":
				return <Dashboard />;
			case "/solutions":
				return <TechnologySelector />;
	
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
