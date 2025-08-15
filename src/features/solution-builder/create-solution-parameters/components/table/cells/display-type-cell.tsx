import { DisplayTypeCellProps } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function DisplayTypeCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	highlightSearchTerm,
	searchQuery,
	parameter,
	renderCell,
	getDisplayTypeBadgeStyle,
	isPriority,
}: DisplayTypeCellProps) {
	return renderCell(
		columnVisibility.displayType,
		isEditing ? (
			<Select
				value={editData.display_type}
				onValueChange={(value) =>
					setEditData((prev) => ({
						...prev,
						display_type: value as
							| "simple"
							| "dropdown"
							| "range"
							| "filter"
							| "conditional",
					}))
				}
				disabled={isPriority}
			>
				<SelectTrigger className={`h-7 text-xs ${isPriority ? "bg-gray-100 cursor-not-allowed" : ""}`}>
					<SelectValue>
						<span style={getDisplayTypeBadgeStyle(editData.display_type)}>
							{editData.display_type || "Select type"}
						</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="simple">Simple</SelectItem>
					<SelectItem value="dropdown">Dropdown</SelectItem>
					<SelectItem value="range">Range</SelectItem>
					<SelectItem value="filter">Filter</SelectItem>
					<SelectItem value="conditional">Conditional</SelectItem>
				</SelectContent>
			</Select>
		) : (
			<Badge
				variant="outline"
				className="text-xs"
				style={getDisplayTypeBadgeStyle(parameter.display_type)}
			>
				{highlightSearchTerm(parameter.display_type, searchQuery)}
			</Badge>
		),
		"displayType",
		isExpanded
	);
} 