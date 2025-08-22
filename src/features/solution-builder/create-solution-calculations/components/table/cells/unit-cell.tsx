import { Input } from "@/components/ui/input";
import { UnitCellProps, AddUnitCellProps } from "./types";

export function UnitCell({ calculation, isEditing, editData, setEditData, renderCell }: UnitCellProps) {
	return renderCell(
		true,
		isEditing ? (
			<Input
				value={editData.units}
				onChange={(e) =>
					setEditData((prev) => ({ ...prev, units: e.target.value }))
				}
				className="h-7 text-xs"
				placeholder="Unit"
			/>
		) : (
			<span className="text-sm">{calculation.units}</span>
		),
		"unit"
	);
}

export function AddUnitCell({ newCalculationData, setNewCalculationData, renderCell }: AddUnitCellProps) {
	return renderCell(
		true,
		<Input
			value={newCalculationData.units}
			onChange={(e) =>
				setNewCalculationData((prev) => ({
					...prev,
					units: e.target.value,
				}))
			}
			className="h-7 text-xs"
			placeholder="Unit"
		/>,
		"unit"
	);
} 