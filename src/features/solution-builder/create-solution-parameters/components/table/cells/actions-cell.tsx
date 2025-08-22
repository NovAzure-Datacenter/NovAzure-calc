import { ActionsCellProps } from "./types";
import { Button } from "@/components/ui/button";
import { Edit, Save, Trash, X } from "lucide-react";

export function ActionsCell({
	columnVisibility,
	isExpanded,
	isEditing,
	parameter,
	renderCell,
	handleEditParameter,
	handleDeleteParameter,
	handleSaveParameter,
	handleCancelEdit,
	editingParameter,
	isAddingParameter,
	isSaveDisabled,
	handleSaveNewParameter,
	handleCancelAddParameter,
}: ActionsCellProps) {

	const NON_REMOVAL_PARAMETERS = ['NovAzure Provided', "Global", "Required"]	

	return renderCell(
		columnVisibility.actions,
		<div className="flex items-center gap-1">
			{!isEditing ? (
				<>
					<Button
						size="sm"
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							handleEditParameter(parameter);
						}}
						className="h-5 w-5 p-0"
						disabled={isEditing || isAddingParameter}
					>
						<Edit className="h-3 w-3" />
					</Button>

					{!NON_REMOVAL_PARAMETERS.includes(parameter.category.name) && (
							<Button
								size="sm"
								variant="ghost"
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteParameter(parameter.id);
								}}
								className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
							>
								<Trash className="h-3 w-3" />
							</Button>
						)}
				</>
			) : (
				<>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => {
							if (isAddingParameter && handleSaveNewParameter) {
								handleSaveNewParameter();
							} else {
								handleSaveParameter(parameter.id);
							}
						}}
						className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
						disabled={isSaveDisabled()}
					>
						<Save className="h-3 w-3" />
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => {
							if (isAddingParameter && handleCancelAddParameter) {
								handleCancelAddParameter();
							} else {
								handleCancelEdit();
							}
						}}
						className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
					>
						<X className="h-3 w-3" />
					</Button>
				</>
			)}
		</div>,
		"actions",
		isExpanded
	);
}
