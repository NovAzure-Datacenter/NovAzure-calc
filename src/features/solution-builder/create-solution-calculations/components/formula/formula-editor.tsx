import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { FormulaEditorProps } from "../../../types/types";
import { FormulaPreview } from "./formula-preview";

/**
 * FormulaEditor component - Renders formula editing interface
 */
export function FormulaEditor({
	isEditing,
	calculation,
	editData,
	getColorCodedFormula,
	isExpanded,
	setIsExpanded,
}: FormulaEditorProps) {
	return (
		<TableCell>
			{isEditing ? (
				<div className="space-y-2">
					{/* Formula Preview - Always visible when there's a formula */}
					{editData.formula && (
						<FormulaPreview
							formula={editData.formula}
							getColorCodedFormula={getColorCodedFormula}
							className="text-xs font-mono p-2 bg-muted/30 rounded border"
						/>
					)}

					{/* Expand Button - Only when not expanded */}
					{!isExpanded && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIsExpanded(true)}
							className="h-6 px-2 text-xs"
							title="Expand formula editor with operators and parameters"
						>
							<span className="mr-1">+</span>
							<span>Expand</span>
						</Button>
					)}
				</div>
			) : (
				<div className="flex items-center gap-2">
					<div className="flex flex-wrap gap-1 min-w-0 flex-1">
						{getColorCodedFormula(calculation.formula)}
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							<p className="text-sm">Formula: {calculation.formula}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</TableCell>
	);
} 