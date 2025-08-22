import { CategoryCellProps } from "./types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

	getCategoryBadgeStyleWrapper,
	getCategoryBadgeStyleForDropdownWrapper,
	isPriority,
	categories,
}: CategoryCellProps) {
	const CATEGORIES_TO_EXCLUDE = ["Use Case"];
	const availableCategories = [
		{ name: "none", description: "No category selected", color: "#6B7280" },
		...categories.filter(
			(category) => !CATEGORIES_TO_EXCLUDE.includes(category.name)
		)
	];
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
				<SelectTrigger
					className={`h-7 text-xs ${
						isPriority ? "bg-gray-100 cursor-not-allowed" : ""
					}`}
				>
					<SelectValue placeholder="Select category" />
				</SelectTrigger>
				<SelectContent>
					{availableCategories.map((category) => (
						<SelectItem
							key={category.name}
							value={category.name}
							onClick={() => {
								setEditData((prev) => ({
									...prev,
									category: category.name,
								}));
							}}
						>
							<span
								style={getCategoryBadgeStyleForDropdownWrapper(category.name)}
							>
								{category.name === "none" ? "No Category" : category.name}
							</span>
						</SelectItem>
					))}
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
