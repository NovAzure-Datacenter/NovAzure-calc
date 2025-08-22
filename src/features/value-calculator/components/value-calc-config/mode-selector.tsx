import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeSelectorProps } from "../../value-calculator-main";

export default function ModeSelector({
	setComparisonMode,
	comparisonMode,
	hasSelectedMode,
	setHasSelectedMode,
	onModeChangeSelection,
}: ModeSelectorProps) {
	const handleModeSelect = (mode: "single" | "compare") => {
		setComparisonMode(mode);
		setHasSelectedMode(true);
	};

	const handleChangeSelection = () => {
		setComparisonMode(null);
		setHasSelectedMode(false);
		onModeChangeSelection();
	};

	return (
		<Card className="border-2 border-dashed border-gray-200">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span className={`inline-flex items-center rounded-full px-3 py-1.5 text-base font-semibold ${
							hasSelectedMode 
								? "bg-green-100 text-green-800" 
								: "bg-blue-100 text-blue-800"
						}`}>
							{hasSelectedMode ? "Mode Selected ✓" : "Mode Selector"}
						</span>
						<span>•</span>
						<span>
							{hasSelectedMode
								? `${
										comparisonMode === "single"
											? "Single Solution Mode"
											: "Compare Solutions Mode"
								  }`
								: "Select a mode to continue"}
						</span>
					</div>
					{hasSelectedMode && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleChangeSelection}
							className="text-xs"
						>
							Change Selection
						</Button>
					)}
				</div>
			</CardHeader>
			{!hasSelectedMode && (
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Button
							onClick={() => handleModeSelect("single")}
							className="h-20 text-lg font-semibold"
							variant="outline"
						>
							Single Solution
						</Button>
						<Button
							onClick={() => handleModeSelect("compare")}
							className="h-20 text-lg font-semibold"
							variant="outline"
						>
							Compare Solutions
						</Button>
					</div>
				</CardContent>
			)}
		</Card>
	);
}