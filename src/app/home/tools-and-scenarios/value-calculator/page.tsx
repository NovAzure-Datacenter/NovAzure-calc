"use client";
import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { useState } from "react";
import ValueCalculatorMain from "./componentsOLD/value-calculator-main";
import ValueCalculatorCompareWrapper from "./componentsOLD/value-calculator-compare-wrapper";
import ValueCalculatorCompare from "./components/value-calculator-compare";

export default function ValueCalculator() {
	// await checkRoutePermission("/home/tools-and-scenarios/value-calculator");
	const [isComparing, setIsComparing] = useState(false);

	return (
		<div className="w-full h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-50">
			<div className="p-8">
				 {/* {!isComparing ? (
					<ValueCalculatorMain 
						onCompareClick={() => setIsComparing(true)}
					/>
				) : (
					<ValueCalculatorCompareWrapper 
						onBack={() => setIsComparing(false)}
					/>
				)}  */}

				 <ValueCalculatorCompare /> 
			</div>
		</div>
	);
}
