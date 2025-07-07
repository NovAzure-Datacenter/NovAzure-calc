import { SidebarInset } from "@/components/ui/sidebar";
import UnderConstruction from "@/components/under-construction";
import { checkRoutePermission } from "@/lib/auth/check-permissions";

export default async function MarketParametersPage() {
	await checkRoutePermission("/home/admin/market-parameters");

	return (
		<SidebarInset>
			<UnderConstruction title="Market Parameters Page" />
		</SidebarInset>
	);
}
