import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { SolutionsMain } from "./components/solutions-main";


export default async function Solutions() {
	await checkRoutePermission("/home/product-and-solutions/solutions");

	return (
		<div className="w-full min-h-full bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<SolutionsMain />
		</div>
	);
}