"use client";

import { useState } from "react";
import ValueCalculatorCompare from "../../../../features/value-calculator/components/value-calculator-main";

export default function ValueCalculator() {
	// await checkRoutePermission("/home/tools-and-scenarios/value-calculator");
	const [isComparing, setIsComparing] = useState(false);

	return (
		<div className="w-full h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-50">
			<div className="p-8">
				<ValueCalculatorCompare />
			</div>
		</div>
	);
}
