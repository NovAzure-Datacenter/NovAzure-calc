import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { ScenariosMain } from "./components/scenarios-main";

export default async function ViewScenarios() {
	await checkRoutePermission("/home/tools-and-scenarios/view-scenarios");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<ScenariosMain />
		</div>
	);
}