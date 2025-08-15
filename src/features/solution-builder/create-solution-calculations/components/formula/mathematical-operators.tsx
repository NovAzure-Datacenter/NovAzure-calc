import { MathematicalOperatorsProps } from "../../../types/types";

/**
 * MathematicalOperators component - Renders mathematical operator buttons
 */
export function MathematicalOperators({
	insertIntoFormula,
	className,
}: MathematicalOperatorsProps) {
	const operators = [
		{ symbol: "+", label: "Add" },
		{ symbol: "-", label: "Subtract" },
		{ symbol: "*", label: "Multiply" },
		{ symbol: "/", label: "Divide" },
		{ symbol: "(", label: "Open Parenthesis" },
		{ symbol: ")", label: "Close Parenthesis" },
		{ symbol: "**", label: "Power" },
	];

	return (
		<div className={className}>
			<div className="text-sm font-medium mb-3 text-blue-900">
				Mathematical Operators:
			</div>
			<div className="flex flex-wrap gap-2">
				{operators.map((op) => (
					<button
						key={op.symbol}
						type="button"
						onClick={() => insertIntoFormula(op.symbol)}
						className="h-8 px-4 text-sm font-mono border rounded hover:bg-blue-100 transition-colors bg-white"
						title={op.label}
					>
						{op.symbol}
					</button>
				))}
			</div>
		</div>
	);
} 