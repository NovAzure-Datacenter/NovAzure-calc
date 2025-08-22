import { Input } from "@/components/ui/input";
import { NameCellProps, AddNameCellProps } from "./types";

export function NameCell({ calculation, isEditing, editData, setEditData, renderCell }: NameCellProps) {
	return renderCell(
		true,
		isEditing ? (
			<Input
				value={editData.name}
				onChange={(e) =>
					setEditData((prev) => ({ ...prev, name: e.target.value }))
				}
				className="h-7 text-xs"
				placeholder="Calculation name"
			/>
		) : (
			<span className="text-sm font-medium">{calculation.name}</span>
		),
		"name"
	);
}

export function AddNameCell({ newCalculationData, setNewCalculationData, renderCell }: AddNameCellProps) {
	return renderCell(
		true,
		<Input
			value={newCalculationData.name}
			onChange={(e) =>
				setNewCalculationData((prev) => ({
					...prev,
					name: e.target.value,
				}))
			}
			className="h-7 text-xs"
			placeholder="Calculation name"
		/>,
		"name"
	);
} 