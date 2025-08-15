import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DisplayResultCellProps, AddDisplayResultCellProps } from "./types";

export function DisplayResultCell({ calculation, renderCell }: DisplayResultCellProps) {
	return renderCell(
		true,
		<Badge variant={calculation.display_result ? "default" : "secondary"}>
			{calculation.display_result ? "Yes" : "No"}
		</Badge>,
		"displayResult"
	);
}

export function AddDisplayResultCell({ newCalculationData, setNewCalculationData, renderCell }: AddDisplayResultCellProps) {
	return renderCell(
		true,
		<Select
			value={newCalculationData.display_result ? "true" : "false"}
			onValueChange={(value) =>
				setNewCalculationData((prev) => ({
					...prev,
					display_result: value === "true",
				}))
			}
		>
			<SelectTrigger className="h-7 text-xs">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="true">Yes</SelectItem>
				<SelectItem value="false">No</SelectItem>
			</SelectContent>
		</Select>,
		"displayResult"
	);
} 