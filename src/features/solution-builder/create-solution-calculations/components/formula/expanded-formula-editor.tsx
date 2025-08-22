import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpandedFormulaEditorProps } from "../../../types/types";
import { FormulaPreview } from "./formula-preview";
import { MathematicalOperators } from "./mathematical-operators";
import { ParametersByCategory } from "../parameters/parameters-by-category";

/**
 * ExpandedFormulaEditor component - Full-screen formula editor with tools
 */
export function ExpandedFormulaEditor({
	title,
	formula,
	onFormulaChange,
	onCollapse,
	resetFormula,
	rewindFormula,
	getColorCodedFormula,
	groupedParameters,
	insertIntoFormula,
}: ExpandedFormulaEditorProps) {
	return (
		<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-md">
			<div className="flex items-center justify-between mb-4">
				<h4 className="text-sm font-medium text-blue-900">{title}</h4>
				<Button
					size="sm"
					variant="default"
					onClick={onCollapse}
					className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
					title="Collapse formula editor"
				>
					<span className="mr-1">−</span>
					<span>Collapse</span>
				</Button>
			</div>

			{/* Formula Input */}
			<div className="flex items-center gap-3 mb-4">
				<Input
					value={formula}
					onChange={(e) => onFormulaChange(e.target.value)}
					className="h-10 text-sm font-mono flex-1"
					placeholder="Enter formula..."
				/>
				<Button
					size="sm"
					variant="outline"
					onClick={resetFormula}
					className="h-10 px-3 text-xs"
					title="Clear formula"
				>
					Clear
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={rewindFormula}
					className="h-10 px-3 text-xs"
					title="Remove last character"
				>
					←
				</Button>
			</div>

			{/* Formula Preview */}
			{formula && (
				<FormulaPreview
					formula={formula}
					getColorCodedFormula={getColorCodedFormula}
					className="text-sm font-mono p-3 bg-white rounded border mb-4"
				/>
			)}

			{/* Formula Editor Tools */}
			<div className="space-y-4">
				{/* Operators */}
				<MathematicalOperators insertIntoFormula={insertIntoFormula} />

				{/* Parameters by Category */}
				<ParametersByCategory
					groupedParameters={groupedParameters}
					insertIntoFormula={insertIntoFormula}
				/>
			</div>
		</div>
	);
} 