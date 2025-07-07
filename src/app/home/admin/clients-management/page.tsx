import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { ClientsManagementMain } from "./components/clients-management-main";

export default async function ClientsPage() {
	await checkRoutePermission("/home/admin/clients-management");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<ClientsManagementMain />
		</div>
	);
}
