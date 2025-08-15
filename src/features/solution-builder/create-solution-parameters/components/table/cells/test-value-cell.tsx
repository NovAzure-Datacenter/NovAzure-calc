import { TestValueCellProps } from "./types";
import { Input } from "@/components/ui/input";

export function TestValueCell({
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
	handleKeyDown,
}: TestValueCellProps) {
	return renderCell(
		columnVisibility.testValue,
		isEditing ? (
			<Input
				value={editData.test_value}
				onChange={(e) =>
					setEditData((prev) => ({
						...prev,
						test_value: e.target.value,
					}))
				}
				className={`h-7 text-xs ${isPriority ? "bg-gray-100 cursor-not-allowed" : ""}`}
				placeholder="Test Value"
				type="number"
				onKeyDown={handleKeyDown}
				disabled={isPriority}
			/>
		) : (
			<span className="text-xs text-muted-foreground">
				{highlightSearchTerm(parameter.test_value, searchQuery)}
			</span>
		),
		"testValue",
		isExpanded
	);
} 