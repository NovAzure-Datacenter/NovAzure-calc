import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormulaCellProps, AddFormulaCellProps } from "./types";
import { FormulaPreview } from "../../formula/formula-preview";

export function FormulaCell({ 
	calculation,
	isEditing, 
	editData, 
	setEditData, 
	getColorCodedFormula,
	isFormulaEditorExpanded,
	setIsFormulaEditorExpanded,
	renderCell 
}: FormulaCellProps) {
	return renderCell(
		true,
		isEditing ? (
			<div className="space-y-2">
				<Input
					value={editData.formula}
					onChange={(e) =>
						setEditData((prev) => ({ ...prev, formula: e.target.value }))
					}
					className="h-7 text-xs font-mono"
					placeholder="Enter formula..."
				/>
				{!isFormulaEditorExpanded && setIsFormulaEditorExpanded && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => setIsFormulaEditorExpanded(true)}
						className="h-6 px-2 text-xs"
						title="Expand formula editor"
					>
						<span className="mr-1">+</span>
						<span>Expand</span>
					</Button>
				)}
			</div>
		) : (
			<div className="flex flex-wrap gap-1 min-w-0">
				{getColorCodedFormula(calculation.formula)}
			</div>
		),
		"formula"
	);
}

export function AddFormulaCell({ 
	newCalculationData, 
	setNewCalculationData, 
	getColorCodedFormula,
	isAddFormulaExpanded,
	setIsAddFormulaExpanded,
	renderCell 
}: AddFormulaCellProps) {
	const handleExpandClick = () => {
		setIsAddFormulaExpanded(!isAddFormulaExpanded);
	};

	return renderCell(
		true,
		<div className="space-y-3">
			{/* Formula Input with Expand Button */}
			<div className="flex items-center gap-2">
				<Input
					value={newCalculationData.formula}
					onChange={(e) =>
						setNewCalculationData((prev) => ({
							...prev,
							formula: e.target.value,
						}))
					}
					className="h-7 text-xs font-mono flex-1"
					placeholder="Enter formula..."
				/>
				<Button
					size="sm"
					variant="default"
					onClick={handleExpandClick}
					className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
					title={
						isAddFormulaExpanded
							? "Collapse formula editor"
							: "Expand formula editor with operators and parameters"
					}
				>
					{isAddFormulaExpanded ? (
						<>
							<span className="mr-1">−</span>
							<span>Collapse</span>
						</>
					) : (
						<>
							<span className="mr-1">+</span>
							<span>Expand</span>
						</>
					)}
				</Button>
			</div>

			{/* Formula Preview - Always visible when there's a formula */}
			{newCalculationData.formula && (
				<FormulaPreview
					formula={newCalculationData.formula}
					getColorCodedFormula={getColorCodedFormula}
					className="text-xs font-mono p-2 bg-muted/30 rounded border"
				/>
			)}
		</div>,
		"formula"
	);
} 