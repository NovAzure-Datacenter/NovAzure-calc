"use client";

import { useState } from "react";
import { ValueCalculatorMain } from "./value-calculator-main";
import { Button } from "@/components/ui/button";

// No need for CalculatorState, we use ValueCalculatorMain directly

// Render two independent ValueCalculatorMain components side by side, with a back button
export default function ValueCalculatorCompareWrapper({ onBack }: { onBack?: () => void } = {}) {
  // Local state to trigger back if not provided by parent
  const [showCompare, setShowCompare] = useState(true);

  if (!showCompare) {
    // If local back, render single calculator (hide compare button everywhere)
    return (
      <div className="flex flex-col gap-8">
        <ValueCalculatorMain hideCompareButton={true} />
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowCompare(true)}
            className="mt-2"
          >
            Compare Another Solution
          </Button>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-col items-center gap-4">
        {/* Single Compare Button for both calculators */}
        <Button
          variant="default"
          className="px-8 py-2 text-lg"
          onClick={() => {
            // TODO: Implement comparison logic here
            alert('Compare both calculations!');
          }}
        >
          Compare Both Calculations
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              setShowCompare(false);
            }
          }}
          className="mt-2"
        >
          ← Back to Single Calculator
        </Button>
      </div>
      {/* TODO: Add comparison results UI here */}
    </div>
  );
}
