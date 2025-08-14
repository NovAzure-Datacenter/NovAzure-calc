import { UnitCellProps } from "./types";
import { Input } from "@/components/ui/input";

export function UnitCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	highlightSearchTerm,
	searchQuery,
	parameter,
	renderCell,
	isPriority,
}: UnitCellProps) {
	return renderCell(
		columnVisibility.unit,
		isEditing ? (
			<Input
				value={editData.unit}
				onChange={(e) =>
					setEditData((prev) => ({
						...prev,
						unit: e.target.value,
					}))
				}
				className={`h-7 text-xs ${isPriority ? "bg-gray-100 cursor-not-allowed" : ""}`}
				placeholder="Unit"
				disabled={isPriority}
			/>
		) : (
			<span className="text-xs text-muted-foreground">
				{highlightSearchTerm(parameter.unit, searchQuery)}
			</span>
		),
		"unit",
		isExpanded
	);
} 