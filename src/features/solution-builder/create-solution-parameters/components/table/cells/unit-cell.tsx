import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UnitCellProps } from "./types";

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

	const PARAMTER_LIST = [
		{
			unit: "$",
			description: "US Dollar",
		},
		{
			unit: "£",
			description: "British Pound",
		},
		{
			unit: "€",
			description: "Euro",
		},
		{
			unit: "mWh",
			description: "Milliwatt-hour",
		},
		{
			unit: "kWh",
			description: "Kilowatt-hour",
		},
		{
			unit: "%",
			description: "Percentage",
		},
		{
			unit: "L",
			description: "Litres",
		},
		{
			unit: "$/kWh",
			description: "US Dollar per Kilowatt-hour",
		},
		{
			unit: "£/kWh",
			description: "British Pound per Kilowatt-hour",
		},
		{
			unit: "€/kWh",
			description: "Euro per Kilowatt-hour",
		},
		{
			unit: "litres/kWh",
			description: "Litres per Kilowatt-hour",
		},
	];

	return renderCell(
		columnVisibility.unit,
		isEditing ? (
			<Select
				value={editData.unit}
				onValueChange={(value) =>
					setEditData((prev) => ({
						...prev,
						unit: value,
					}))
				}
			>
				<SelectTrigger
					className={`h-7 text-xs ${
						isPriority ? "bg-gray-100 cursor-not-allowed" : ""
					}`}
				>
					<SelectValue>{editData.unit || "Select unit"}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{PARAMTER_LIST.map((unit) => (
						<SelectItem
							key={unit.unit}
							value={unit.unit}
							onClick={() => {
								setEditData((prev) => ({
									...prev,
									unit: unit.unit,
								}));
							}}
						>
							{unit.unit}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		) : (
			<span className="text-xs text-muted-foreground">
				{highlightSearchTerm(parameter.unit, searchQuery)}
			</span>
		),
		"unit",
		isExpanded
	);
}
