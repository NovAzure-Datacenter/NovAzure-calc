import { TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { AddCalculationButtonProps } from "../../../types/types";

/**
 * AddCalculationButton component - Renders the add calculation button row
 */
export function AddCalculationButton({
	isAddingCalculation,
	handleAddCalculation,
	handleCancelAddCalculation,
}: AddCalculationButtonProps) {
	if (isAddingCalculation) return null;

	return (
		<TableRow className="border-t-2">
			<TableCell
				colSpan={10}
				className="text-center bg-muted/50 cursor-pointer py-2"
				onClick={
					isAddingCalculation
						? handleCancelAddCalculation
						: handleAddCalculation
				}
			>
				<div className="flex items-center gap-2 justify-center text-muted-foreground">
					<Plus className="h-3 w-3" />
					<span className="text-xs">Add Calculation</span>
				</div>
			</TableCell>
		</TableRow>
	);
} 