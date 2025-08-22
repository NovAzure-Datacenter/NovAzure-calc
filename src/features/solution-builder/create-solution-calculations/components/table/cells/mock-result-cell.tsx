import { Badge } from "@/components/ui/badge";
import { MockResultCellProps } from "./types";

export function MockResultCell({ calculation, getStatusColor, renderCell }: MockResultCellProps) {
	return renderCell(
		true,
		<Badge
			variant="outline"
			className={getStatusColor(calculation.status || "pending")}
		>
			{calculation.result || "Pending"}
		</Badge>,
		"mockResult"
	);
}

export function AddMockResultCell({ renderCell }: { renderCell: MockResultCellProps['renderCell'] }) {
	return renderCell(
		true,
		<span className="text-sm text-muted-foreground">-</span>,
		"mockResult"
	);
} 