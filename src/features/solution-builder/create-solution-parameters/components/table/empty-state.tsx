import { TableRow, TableCell } from "@/components/ui/table";
import type { EmptyStateProps } from "@/features/solution-builder/types/types";
import { Info } from "lucide-react";

export function EmptyState({ filteredParameters, isAddingParameter }: EmptyStateProps) {
	if (filteredParameters.length !== 0 || isAddingParameter) return null;

	return (
		<TableRow>
			<TableCell colSpan={11} className="text-center py-8">
				<div className="flex flex-col items-center gap-2 text-muted-foreground">
					<Info className="h-8 w-8" />
					<p className="text-sm font-medium">No parameters found</p>
					<p className="text-xs">Add parameters to get started</p>
				</div>
			</TableCell>
		</TableRow>
	);
} 