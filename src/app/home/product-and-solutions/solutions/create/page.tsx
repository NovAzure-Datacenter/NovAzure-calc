import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { CreateSolutionMain } from "./components/create-solution-main";

export default async function CreateSolution() {
	await checkRoutePermission("/home/product-and-solutions/solutions/create");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<CreateSolutionMain />
		</div>
	);
}