import { SidebarInset } from "@/components/ui/sidebar";
import { checkRoutePermission } from "@/lib/auth/check-permissions";
import GlobalParametersMain from "./components/global-parameters-main";

export default async function GlobalParametersPage() {
	await checkRoutePermission("/home/admin/global-parameters");

	return (
		<SidebarInset className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<GlobalParametersMain />
		</SidebarInset>
	);
}
