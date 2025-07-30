import { SidebarInset } from "@/components/ui/sidebar";
import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { UserManagementMain } from "./components/user-management-main";

export default async function UsersManagementPage() {
	await checkRoutePermission("/home/admin/users-management");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<UserManagementMain />
		</div>
	);
}
