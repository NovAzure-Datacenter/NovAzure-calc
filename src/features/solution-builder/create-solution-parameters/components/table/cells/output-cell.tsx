import { OutputCellProps } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function OutputCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	parameter,
	renderCell,
}: OutputCellProps) {
	return renderCell(
		columnVisibility.output,
		isEditing ? (
			<Select
				value={editData.output ? "true" : "false"}
				onValueChange={(value) =>
					setEditData((prev) => ({
						...prev,
						output: value === "true",
					}))
				}
			>
				<SelectTrigger className="h-7 text-xs">
					<SelectValue>{editData.output ? "True" : "False"}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="true">True</SelectItem>
					<SelectItem value="false">False</SelectItem>
				</SelectContent>
			</Select>
		) : (
			<Badge variant="outline" className="text-xs">
				{parameter.output ? "True" : "False"}
			</Badge>
		),
		"output",
		isExpanded
	);
} 