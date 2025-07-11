import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { LeadsMain } from "./components/leads-main";

export default async function Products() {
	await checkRoutePermission("/home/leads");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<LeadsMain />
		</div>
	);
}
