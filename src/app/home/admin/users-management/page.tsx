import { SidebarInset } from "@/components/ui/sidebar";
import UnderConstruction from "@/components/under-construction";
import { checkRoutePermission } from "@/lib/auth/check-permissions";

export default async function UsersManagementPage() {
	// This will redirect if user doesn't have permission
	await checkRoutePermission("/home/admin/users-management");

	return (
		<SidebarInset>
			<UnderConstruction title="Users Management Page" />
		</SidebarInset>
	);
}
