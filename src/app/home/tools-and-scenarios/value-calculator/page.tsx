import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { ValueCalculatorMain } from "./components/value-calculator-main";

export default async function ValueCalculator() {
	await checkRoutePermission("/home/tools-and-scenarios/value-calculator");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<ValueCalculatorMain />
		</div>
	);
}
