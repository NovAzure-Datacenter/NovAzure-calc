import { CategoryCellProps } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function CategoryCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	highlightSearchTerm,
	searchQuery,
	parameter,
	renderCell,
	getAllAvailableCategories,
	getCategoryBadgeStyleWrapper,
	getCategoryBadgeStyleForDropdownWrapper,
	isPriority,
}: CategoryCellProps) {
	return renderCell(
		columnVisibility.category,
		isEditing ? (
			<Select
				value={editData.category}
				onValueChange={(value) =>
					setEditData((prev) => ({
						...prev,
						category: value,
					}))
				}
				disabled={isPriority}
			>
				<SelectTrigger className={`h-7 text-xs ${isPriority ? "bg-gray-100 cursor-not-allowed" : ""}`}>
					<SelectValue placeholder="Select category" />
				</SelectTrigger>
				<SelectContent>
					{getAllAvailableCategories().length > 0 ? (
						getAllAvailableCategories().map((category) => (
							<SelectItem key={category.name} value={category.name}>
								<span style={getCategoryBadgeStyleForDropdownWrapper(category.name)}>
									{category.name}
								</span>
							</SelectItem>
						))
					) : (
						<div className="px-2 py-1.5 text-xs text-muted-foreground">
							No categories available.
						</div>
					)}
				</SelectContent>
			</Select>
		) : (
			<Badge
				variant="outline"
				className="text-xs"
				style={getCategoryBadgeStyleWrapper(parameter.category.name)}
			>
				{highlightSearchTerm(parameter.category.name, searchQuery)}
			</Badge>
		),
		"category",
		isExpanded
	);
} 