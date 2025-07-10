"use client";

import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { useState } from "react";
import ValueCalculatorMain from "./components/value-calculator-main";
import ValueCalculatorCompareWrapper from "./components/value-calculator-compare-wrapper";

export default function ValueCalculator() {
	const [isComparing, setIsComparing] = useState(false);

	return (
		<div className="w-full h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-50">
			<div className="p-8">
				{!isComparing ? (
					<ValueCalculatorMain 
						onCompareClick={() => setIsComparing(true)}
					/>
				) : (
					<ValueCalculatorCompareWrapper 
						onBack={() => setIsComparing(false)}
					/>
				)}
			</div>
		</div>
	);
}
