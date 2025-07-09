"use client";

import { ValueCalculatorMain } from "./value-calculator-main";

// No need for CalculatorState, we use ValueCalculatorMain directly

// Render two independent ValueCalculatorMain components side by side
export default function ValueCalculatorCompareWrapper() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <ValueCalculatorMain hideCompareButton />
        </div>
        <div className="flex-1 min-w-0">
          <ValueCalculatorMain hideCompareButton />
        </div>
      </div>
      {/* TODO: Add comparison results UI here */}
    </div>
  );
}
