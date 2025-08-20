"use client";

import { TableBody as UITableBody } from "@/components/ui/table";
import { ParameterRow } from "./parameter-row";
import type { ParameterTableBodyProps } from "@/features/solution-builder/types/types";
import type { Parameter } from "@/types/types";
import { AddParameterRow } from "./add-parameter-row";

export function TableBody({
	filteredParameters,
	usedParameterIds = [],
	editingParameter,
	isAddingParameter,
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	...rowProps
}: ParameterTableBodyProps) {
	// Create a placeholder parameter for the new row
	const placeholderParameter: Parameter = {
		id: "new-parameter-placeholder",
		name: "",
		category: { name: "", color: "gray" },
		display_type: "simple",
		value: "",
		test_value: "",
		unit: "",
		description: "",
		user_interface: {
			type: "static",
			category: "",
			is_advanced: false,
		},
		output: false,
		level: "1",
		is_modifiable: true,
		is_unified: false,
		is_mandatory: false,
	};

	return (
		<UITableBody>
			{/* Render editable row for adding new parameter */}
			{isAddingParameter && (
				<AddParameterRow
					key="new-parameter-placeholder"
					parameter={placeholderParameter}
					isUnused={true}
					isEditing={true}
					editData={newParameterData}
					setEditData={setNewParameterData}
					handleSaveNewParameter={handleSaveNewParameter}
					handleCancelAddParameter={handleCancelAddParameter}
					{...(rowProps as any)}
					isAddingParameter={true}
					newParameterData={newParameterData}
					setNewParameterData={setNewParameterData}
					
				/>
			)}

			{/* Render existing parameters */}
			{filteredParameters?.map((parameter: any) => {
				const isUnused = !usedParameterIds.includes(parameter.id);
				const isEditing = editingParameter === parameter.id;

				return (
					<ParameterRow
						key={parameter.id}
						parameter={parameter as Parameter}
						isUnused={isUnused}
						isEditing={isEditing}
						handleSaveNewParameter={handleSaveNewParameter}
						handleCancelAddParameter={handleCancelAddParameter}
						{...(rowProps as any)}
					/>
				);
			})}
		</UITableBody>
	);
}
