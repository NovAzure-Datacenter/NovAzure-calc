import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ModeSelectorProps } from "../../value-calculator-main";

export default function ModeSelector(props: ModeSelectorProps) {
	const {
		setComparisonMode,
		comparisonMode,
		hasSelectedMode,
		setHasSelectedMode,
	} = props;

	function handleModeSelection(mode: "single" | "compare") {
		setComparisonMode(mode);
		setHasSelectedMode(true);
	}

	return !hasSelectedMode ? (
		<Card className="space-y-4">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">
					Value Calculator
				</CardTitle>
				<CardDescription>
					Would you like to compare two solutions or view a single one?
				</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-center gap-4">
				<Button
					onClick={() => handleModeSelection("single")}
					disabled={hasSelectedMode}
					className="w-48"
				>
					View Single Solution
				</Button>
				<Button
					onClick={() => handleModeSelection("compare")}
					disabled={hasSelectedMode}
					className="w-48"
				>
					Compare Two Solutions
				</Button>
			</CardContent>
		</Card>
	) : (
		<Card className="border-2 border-dashed border-gray-200 ">
			<CardHeader className="">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-base font-semibold text-blue-800">
							{comparisonMode === "single" ? "Single Mode" : "Compare Mode"}
						</span>
						<span>•</span>
						<span>
							{comparisonMode === "single"
								? "View and analyze one solution in detail"
								: "Compare two solutions side by side"}
						</span>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setHasSelectedMode(false);
							setComparisonMode(null);
						}}
						className="text-xs"
					>
						Change Selection
					</Button>
				</div>
			</CardHeader>
		</Card>
	);
}