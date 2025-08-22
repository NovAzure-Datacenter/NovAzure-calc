import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash } from "lucide-react";
import { ActionsCellProps, AddActionsCellProps } from "./types";

export function ActionsCell({ 
	calculation, 
	isEditing, 
	handleEditCalculation, 
	handleSaveCalculation, 
	handleCancelEdit, 
	handleDeleteCalculation, 
	renderCell 
}: ActionsCellProps) {
	return renderCell(
		true,
		<div className="flex items-center gap-1">
			{isEditing ? (
				<>
					<Button
						size="sm"
						variant="default"
						onClick={() => handleSaveCalculation(calculation.id)}
						className="h-6 w-6 p-0"
						title="Save changes"
					>
						<Save className="h-3 w-3" />
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={handleCancelEdit}
						className="h-6 w-6 p-0"
						title="Cancel editing"
					>
						<X className="h-3 w-3" />
					</Button>
				</>
			) : (
				<>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => handleEditCalculation(calculation)}
						className="h-6 w-6 p-0"
						title="Edit calculation"
					>
						<Edit className="h-3 w-3" />
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => handleDeleteCalculation(calculation.id)}
						className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
						title="Delete calculation"
					>
						<Trash className="h-3 w-3" />
					</Button>
				</>
			)}
		</div>,
		"actions"
	);
}

export function AddActionsCell({ handleSaveNewCalculation, handleCancelAddCalculation, renderCell }: AddActionsCellProps) {
	return renderCell(
		true,
		<div className="flex items-center gap-1">
			<Button
				size="sm"
				variant="default"
				onClick={handleSaveNewCalculation}
				className="h-6 w-6 p-0"
				title="Save calculation"
			>
				<Save className="h-3 w-3" />
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={handleCancelAddCalculation}
				className="h-6 w-6 p-0"
				title="Cancel"
			>
				<X className="h-3 w-3" />
			</Button>
		</div>,
		"actions"
	);
} 