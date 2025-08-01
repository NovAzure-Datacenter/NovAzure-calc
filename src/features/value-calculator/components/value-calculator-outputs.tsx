

export default function ValueCalculatorOutputs({
	hasCalculated,
	selectedIndustry,
	selectedTechnology,
	selectedSolution,
	solutionVariantA,
	solutionVariantB,
}: {
	hasCalculated: boolean;
	selectedIndustry: string;
	selectedTechnology: string;
	selectedSolution: string;
	solutionVariantA: string;
	solutionVariantB: string;
}) {


	return hasCalculated ? (
		<div>
			</div>
	) : (
		<div className="text-center py-8">
			<p className="text-muted-foreground">
				Please complete configuration and click Calculate to view calculation outputs.
			</p>
		</div>
	);
}
