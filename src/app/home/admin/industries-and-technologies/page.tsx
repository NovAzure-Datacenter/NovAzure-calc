import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { IndustriesAndTechnologiesMain } from "./components/industries-and-technologies-main";

export default async function IndustriesAndTechnologies() {
	await checkRoutePermission("/home/admin/industries-and-technologies");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<IndustriesAndTechnologiesMain />
		</div>
	);
}
