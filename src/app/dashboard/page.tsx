"use client";
import { SidebarInset } from "@/components/ui/sidebar";
import UnderConstruction from "@/components/under-construction";
import { useActiveComponent } from "@/contexts/active-component-context";
import AccountSettingsPage from "./(account)/settings/page";
import CompanyUsersPage from "./(users)/page";
import TCOCalculator from "./(tcocalculator)/page";

export default function Page() {
	const { activeComponent } = useActiveComponent();

	const renderComponent = () => {
		switch (activeComponent) {
			case "/dashboard/users":
				return <CompanyUsersPage />;

			case "/dashboard/tco-calculator":
				return <TCOCalculator />;

			case "/dashboard/account/settings":
				return <AccountSettingsPage />;
			default:
				return <UnderConstruction />;
		}
	};

	return (
		<SidebarInset>
			<div className="flex-1 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950 dark:to-sky-950 h-full">
				<div className="h-full overflow-y-auto">
					<div className="p-4">{renderComponent()}</div>
				</div>
			</div>
		</SidebarInset>
	);
}
