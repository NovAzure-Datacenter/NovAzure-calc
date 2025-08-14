import { ValueCellProps } from "./types";
import { renderDisplayTypeEditor, renderDisplayTypeViewer } from "@/components/table-components/parameter-types";

export function ValueCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	highlightSearchTerm,
	searchQuery,
	parameter,
	renderCell,
	parameters,
	handleSaveParameter,
	handleCancelEdit,
}: ValueCellProps) {
	return renderCell(
		columnVisibility.value,
		isEditing ? (
			renderDisplayTypeEditor(
				editData.display_type,
				editData,
				setEditData,
				parameters,
				() => handleSaveParameter(parameter.id),
				handleCancelEdit
			)
		) : (
			<span className="text-xs text-muted-foreground">
				{renderDisplayTypeViewer(
					parameter.display_type,
					parameter,
					highlightSearchTerm,
					searchQuery
				)}
			</span>
		),
		"value",
		isExpanded
	);
} 