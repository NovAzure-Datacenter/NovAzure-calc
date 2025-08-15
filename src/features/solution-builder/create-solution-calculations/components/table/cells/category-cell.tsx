import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CategoryCellProps, AddCategoryCellProps } from "./types";

export function CategoryCell({ 
	calculation, 
	isEditing, 
	editData, 
	setEditData, 
	allCategories, 
	getCategoryColor, 
	renderCell 
}: CategoryCellProps) {
	const getCategoryName = (category: any) => {
		return typeof category === "string"
			? category
			: category?.name || "Unknown";
	};

	return renderCell(
		true,
		isEditing ? (
			<Select
				value={editData.category}
				onValueChange={(value) =>
					setEditData((prev) => ({ ...prev, category: value }))
				}
			>
				<SelectTrigger className="h-7 text-xs">
					<SelectValue placeholder="Select category" />
				</SelectTrigger>
				<SelectContent>
					{allCategories.map((cat) => (
						<SelectItem key={cat} value={cat}>
							{cat}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		) : (
			<Badge
				variant="outline"
				className={getCategoryColor(getCategoryName(calculation.category))}
			>
				{getCategoryName(calculation.category)}
			</Badge>
		),
		"category"
	);
}

export function AddCategoryCell({ 
	newCalculationData, 
	setNewCalculationData, 
	allCategories, 
	renderCell 
}: AddCategoryCellProps) {
	return renderCell(
		true,
		<Select
			value={newCalculationData.category}
			onValueChange={(value) =>
				setNewCalculationData((prev) => ({
					...prev,
					category: value,
				}))
			}
		>
			<SelectTrigger className="h-7 text-xs">
				<SelectValue placeholder="Select category" />
			</SelectTrigger>
			<SelectContent>
				{allCategories.map((category) => (
					<SelectItem key={category} value={category}>
						{category}
					</SelectItem>
				))}
			</SelectContent>
		</Select>,
		"category"
	);
} 