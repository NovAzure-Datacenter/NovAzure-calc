

import ValueCalculatorMain from "@/features/value-calculator/value-calculator-main";

export default function ValueCalculator() {
	// await checkRoutePermission("/home/tools-and-scenarios/value-calculator");
	return (
		<div className="w-full h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-50">
			<div className="p-8">
				{/* <ValueCalculatorMainOld /> */}
				<ValueCalculatorMain />
			</div>
		</div>
	);
}
