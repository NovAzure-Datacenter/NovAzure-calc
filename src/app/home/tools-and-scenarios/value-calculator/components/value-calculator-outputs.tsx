import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock output data for each variant
const airCoolingOutputs = {
	inputs: {
		"Data Center Type": "General Purpose",
		"Project Location": "UK",
		"Utilisation Percentage": "80%",
		"Data Hall Capacity": "2.5 MW",
		"Planned Years": "5",
		"First Year Operation": "2025",
		"Annualized pPUE": "1.0",
		"Airflow Rate": "2.5 m³/s",
		"Temperature Delta": "15.0°C",
	},
	calculations: [
		{ name: "Cooling Equipment Capex", formula: "Base Cost × Capacity Factor", result: "$5,665,088", status: "calculated" },
		{ name: "Infrastructure Capex", formula: "Equipment Cost × 1.39", result: "$2,200,000", status: "calculated" },
		{ name: "Total Capex", formula: "Equipment + Infrastructure", result: "$7,865,088", status: "calculated" },
		{ name: "Annual Cooling Opex", formula: "Power × Hours × Rate", result: "$822,497", status: "calculated" },
		{ name: "Total Opex Over Lifetime", formula: "Annual Opex × Years", result: "$13,987,457", status: "calculated" },
		{ name: "TCO Excluding IT", formula: "Capex + Total Opex", result: "$19,542,545", status: "calculated" },
	],
	summary: {
		"Total Capex": "$7,865,088",
		"Annual Opex": "$822,497",
		"Lifetime Opex": "$13,987,457",
		"TCO": "$19,542,545",
		"ROI": "12.3%",
		"Payback Period": "3.2 years",
	}
};

const liquidCoolingOutputs = {
	inputs: {
		"Data Center Type": "General Purpose",
		"Project Location": "UK",
		"Utilisation Percentage": "80%",
		"Data Hall Capacity": "2.5 MW",
		"Planned Years": "5",
		"First Year Operation": "2025",
		"Annualized pPUE": "1.2",
		"Flow Rate": "0.8 L/min",
		"Temperature Delta": "8.0°C",
	},
	calculations: [
		{ name: "Cooling Equipment Capex", formula: "Base Cost × Efficiency Factor", result: "$4,532,070", status: "calculated" },
		{ name: "Infrastructure Capex", formula: "Equipment Cost × 1.49", result: "$2,200,000", status: "calculated" },
		{ name: "Total Capex", formula: "Equipment + Infrastructure", result: "$6,732,070", status: "calculated" },
		{ name: "Annual Cooling Opex", formula: "Power × Hours × Rate × Efficiency", result: "$984,365", status: "calculated" },
		{ name: "Total Opex Over Lifetime", formula: "Annual Opex × Years", result: "$16,415,481", status: "calculated" },
		{ name: "TCO Excluding IT", formula: "Capex + Total Opex", result: "$20,837,551", status: "calculated" },
	],
	summary: {
		"Total Capex": "$6,732,070",
		"Annual Opex": "$984,365",
		"Lifetime Opex": "$16,415,481",
		"TCO": "$20,837,551",
		"ROI": "10.8%",
		"Payback Period": "3.8 years",
	}
};

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
	const getStatusColor = (status: string) => {
		switch (status) {
			case "calculated":
				return "bg-green-50 text-green-700 border-green-200";
			case "error":
				return "bg-red-50 text-red-700 border-red-200";
			case "pending":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	return hasCalculated ? (
		<div className="space-y-6">
			{/* Configuration Summary */}
			<div className="bg-muted/30 rounded-lg p-4">
				<h3 className="text-sm font-medium mb-4 text-muted-foreground">Configuration Summary</h3>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Air Cooling (Variant A) Configuration */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-3 h-3 bg-gray-600 rounded-full"></div>
							<h4 className="text-sm font-medium text-gray-900">Air Cooling (Variant A)</h4>
						</div>
						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Industry:</span>
								<span className="font-medium">{selectedIndustry || "Not selected"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Technology:</span>
								<span className="font-medium">{selectedTechnology || "Not selected"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Solution:</span>
								<span className="font-medium">{selectedSolution || "Not selected"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Variant:</span>
								<span className="font-medium">{solutionVariantA || "Not selected"}</span>
							</div>
						</div>
					</div>

					{/* Liquid Cooling (Variant B) Configuration */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-3 h-3 bg-black rounded-full"></div>
							<h4 className="text-sm font-medium text-gray-900">Liquid Cooling (Variant B)</h4>
						</div>
						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Industry:</span>
								<span className="font-medium">{selectedIndustry || "Not selected"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Technology:</span>
								<span className="font-medium">{selectedTechnology || "Not selected"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Solution:</span>
								<span className="font-medium">{selectedSolution || "Not selected"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Variant:</span>
								<span className="font-medium">{solutionVariantB || "Not selected"}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Output Results */}
			<div className="space-y-6">
				<h3 className="text-lg font-semibold">Calculation Outputs</h3>
				
				{/* Air Cooling Outputs */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-gray-600 rounded-full"></div>
							<CardTitle className="text-base">Air Cooling (Variant A) - Detailed Outputs</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Input Parameters */}
						<div>
							<h4 className="text-sm font-medium mb-3 text-gray-900">Input Parameters</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{Object.entries(airCoolingOutputs.inputs).map(([key, value]) => (
									<div key={key} className="flex justify-between text-sm">
										<span className="text-muted-foreground">{key}:</span>
										<span className="font-medium">{value}</span>
									</div>
								))}
							</div>
						</div>

						{/* Calculation Steps */}
						<div>
							<h4 className="text-sm font-medium mb-3 text-gray-900">Calculation Steps</h4>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-48">Calculation</TableHead>
										<TableHead className="w-64">Formula</TableHead>
										<TableHead className="w-32">Result</TableHead>
										<TableHead className="w-24">Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{airCoolingOutputs.calculations.map((calc, index) => (
										<TableRow key={index}>
											<TableCell className="font-medium text-sm">{calc.name}</TableCell>
											<TableCell className="text-sm font-mono">{calc.formula}</TableCell>
											<TableCell className="font-mono text-sm">{calc.result}</TableCell>
											<TableCell>
												<Badge variant="outline" className={`text-xs ${getStatusColor(calc.status)}`}>
													{calc.status}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* Summary Results */}
						<div>
							<h4 className="text-sm font-medium mb-3 text-gray-900">Summary Results</h4>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{Object.entries(airCoolingOutputs.summary).map(([key, value]) => (
									<div key={key} className="bg-gray-50 rounded-lg p-3">
										<div className="text-xs text-muted-foreground mb-1">{key}</div>
										<div className="font-mono font-medium text-sm">{value}</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Liquid Cooling Outputs */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-black rounded-full"></div>
							<CardTitle className="text-base">Liquid Cooling (Variant B) - Detailed Outputs</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Input Parameters */}
						<div>
							<h4 className="text-sm font-medium mb-3 text-gray-900">Input Parameters</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{Object.entries(liquidCoolingOutputs.inputs).map(([key, value]) => (
									<div key={key} className="flex justify-between text-sm">
										<span className="text-muted-foreground">{key}:</span>
										<span className="font-medium">{value}</span>
									</div>
								))}
							</div>
						</div>

						{/* Calculation Steps */}
						<div>
							<h4 className="text-sm font-medium mb-3 text-gray-900">Calculation Steps</h4>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-48">Calculation</TableHead>
										<TableHead className="w-64">Formula</TableHead>
										<TableHead className="w-32">Result</TableHead>
										<TableHead className="w-24">Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{liquidCoolingOutputs.calculations.map((calc, index) => (
										<TableRow key={index}>
											<TableCell className="font-medium text-sm">{calc.name}</TableCell>
											<TableCell className="text-sm font-mono">{calc.formula}</TableCell>
											<TableCell className="font-mono text-sm">{calc.result}</TableCell>
											<TableCell>
												<Badge variant="outline" className={`text-xs ${getStatusColor(calc.status)}`}>
													{calc.status}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* Summary Results */}
						<div>
							<h4 className="text-sm font-medium mb-3 text-gray-900">Summary Results</h4>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{Object.entries(liquidCoolingOutputs.summary).map(([key, value]) => (
									<div key={key} className="bg-gray-50 rounded-lg p-3">
										<div className="text-xs text-muted-foreground mb-1">{key}</div>
										<div className="font-mono font-medium text-sm">{value}</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	) : (
		<div className="text-center py-8">
			<p className="text-muted-foreground">
				Please complete configuration and click Calculate to view calculation outputs.
			</p>
		</div>
	);
}
