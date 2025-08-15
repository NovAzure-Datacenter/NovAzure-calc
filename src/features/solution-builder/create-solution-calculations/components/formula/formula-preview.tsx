import { FormulaPreviewProps } from "../../../types/types";

/**
 * FormulaPreview component - Displays color-coded formula preview
 */
export function FormulaPreview({
	formula,
	getColorCodedFormula,
	className,
}: FormulaPreviewProps) {
	return (
		<div className={className}>
			<div className="text-muted-foreground mb-2 text-xs font-medium">
				Formula Preview:
			</div>
			<div className="flex flex-wrap gap-1">
				{getColorCodedFormula(formula)}
			</div>
		</div>
	);
} 