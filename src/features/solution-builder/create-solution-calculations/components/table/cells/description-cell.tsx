import { Input } from "@/components/ui/input";
import { DescriptionCellProps, AddDescriptionCellProps } from "./types";

export function DescriptionCell({ calculation, isEditing, editData, setEditData, renderCell }: DescriptionCellProps) {
	return renderCell(
		true,
		isEditing ? (
			<Input
				value={editData.description}
				onChange={(e) =>
					setEditData((prev) => ({ ...prev, description: e.target.value }))
				}
				className="h-7 text-xs"
				placeholder="Description"
			/>
		) : (
			<span className="text-sm">{calculation.description}</span>
		),
		"description"
	);
}

export function AddDescriptionCell({ newCalculationData, setNewCalculationData, renderCell }: AddDescriptionCellProps) {
	return renderCell(
		true,
		<Input
			value={newCalculationData.description}
			onChange={(e) =>
				setNewCalculationData((prev) => ({
					...prev,
					description: e.target.value,
				}))
			}
			className="h-7 text-xs"
			placeholder="Description"
		/>,
		"description"
	);
} 