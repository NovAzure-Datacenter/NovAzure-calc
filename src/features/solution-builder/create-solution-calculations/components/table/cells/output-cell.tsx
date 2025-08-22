import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { OutputCellProps, AddOutputCellProps } from "./types";

export function OutputCell({ calculation, renderCell }: OutputCellProps) {
	return renderCell(
		true,
		<Badge variant={calculation.output ? "default" : "secondary"}>
			{calculation.output ? "Yes" : "No"}
		</Badge>,
		"output"
	);
}

export function AddOutputCell({ newCalculationData, setNewCalculationData, renderCell }: AddOutputCellProps) {
	return renderCell(
		true,
		<Select
			value={newCalculationData.output ? "true" : "false"}
			onValueChange={(value) =>
				setNewCalculationData((prev) => ({
					...prev,
					output: value === "true",
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
		"output"
	);
} 