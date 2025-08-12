import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClientSolution } from "../api";

export default function ValueCalculatorOutputs({
	hasCalculated,
	selectedIndustry,
	selectedTechnology,
	selectedSolution,
	solutionVariantA,
	solutionVariantB,
	fetchedSolutionA,
	fetchedSolutionB,
	comparisonMode,
}: {
	hasCalculated: boolean;
	selectedIndustry: string;
	selectedTechnology: string;
	selectedSolution: string;
	solutionVariantA: string;
	solutionVariantB: string;
	fetchedSolutionA?: ClientSolution | null;
	fetchedSolutionB?: ClientSolution | null;
	comparisonMode?: "single" | "compare" | null;
}) {
	if (!hasCalculated) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">
					Please complete configuration and click Calculate to view calculation outputs.
				</p>
			</div>
		);
	}

	// Get output parameters from solutions
	const getOutputParameters = (solution: ClientSolution | null) => {
		if (!solution?.parameters) return [];
		// Ensure parameters is an array
		if (!Array.isArray(solution.parameters)) {
			return [];
		}
		const outputParams = solution.parameters.filter(param => 
			param && typeof param === 'object' && param.output === true
		);
		return outputParams;
	};

	const solutionAParams = getOutputParameters(fetchedSolutionA || null);
	const solutionBParams = getOutputParameters(fetchedSolutionB || null);

	// Get unique categories from all parameters
	const getAllCategories = () => {
		const allParams = [...solutionAParams, ...solutionBParams];
		const categories = new Set<string>();
		allParams.forEach(param => {
			// Handle both string and object category formats
			if (typeof param.category === 'string') {
				categories.add(param.category);
			} else if (param.category?.name && typeof param.category.name === 'string') {
				categories.add(param.category.name);
			}
		});
		const categoryArray = Array.from(categories).sort();
		return categoryArray;
	};

	const categories = getAllCategories();

	// Check if we have any output parameters
	const hasOutputParameters = solutionAParams.length > 0 || solutionBParams.length > 0;

	// Ensure categories is valid
	if (!Array.isArray(categories) || categories.length === 0) {
		// This will be handled in the OutputParametersTable component
	}

	if (!hasOutputParameters) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">
					No output parameters available for the selected solutions.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Solution Selection Tabs */}
			<Tabs defaultValue="solution-a" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="solution-a" className="text-sm">
						Solution A
						{solutionVariantA && (
							<Badge variant="secondary" className="ml-2 text-xs bg-gray-100 text-gray-700 border-gray-300">
								{fetchedSolutionA?.solution_name || "Selected"}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger 
						value="solution-b" 
						className="text-sm"
						disabled={comparisonMode !== "compare"}
					>
						Solution B
						{solutionVariantB && (
							<Badge variant="secondary" className="ml-2 text-xs bg-gray-100 text-gray-700 border-gray-300">
								{fetchedSolutionB?.solution_name || "Selected"}
							</Badge>
						)}
					</TabsTrigger>
				</TabsList>

				{/* Solution A Content */}
				<TabsContent value="solution-a" className="space-y-4">
					{solutionAParams.length > 0 ? (
						<OutputParametersTable 
							parameters={solutionAParams}
							categories={categories}
							solutionName={fetchedSolutionA?.solution_name || "Solution A"}
						/>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							<p>No output parameters available for Solution A.</p>
						</div>
					)}
				</TabsContent>

				{/* Solution B Content */}
				<TabsContent value="solution-b" className="space-y-4">
					{comparisonMode === "compare" ? (
						solutionBParams.length > 0 ? (
							<OutputParametersTable 
								parameters={solutionBParams}
								categories={categories}
								solutionName={fetchedSolutionB?.solution_name || "Solution B"}
							/>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<p>No output parameters available for Solution B.</p>
							</div>
						)
					) : (
						<div className="text-center py-8 text-muted-foreground">
							<p>Comparison mode not enabled. Select &ldquo;Compare Two Solutions&rdquo; to view Solution B parameters.</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}

/**
 * OutputParametersTable component - Displays output parameters organized by category
 */
function OutputParametersTable({ 
	parameters, 
	categories, 
	solutionName 
}: { 
	parameters: any[]; 
	categories: string[]; 
	solutionName: string; 
}) {
	// Ensure categories is valid
	if (!Array.isArray(categories) || categories.length === 0) {
		// If no categories, show all parameters in a single group
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-lg">Output Parameters - {solutionName}</CardTitle>
				</CardHeader>
				<CardContent>
					<CategoryParametersTable 
						parameters={parameters}
						category="All Parameters"
					/>
				</CardContent>
			</Card>
		);
	}

	// Group parameters by category
	const parametersByCategory = categories.reduce((acc, category) => {
		acc[category] = parameters.filter(param => {
			// Handle both string and object category formats
			if (typeof param.category === 'string') {
				return param.category === category;
			} else if (param.category?.name) {
				return param.category.name === category;
			}
			return false;
		});
		return acc;
	}, {} as Record<string, any[]>);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg">Output Parameters - {solutionName}</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue={categories[0]} className="w-full">
					<TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
						{categories.map((category) => (
							<TabsTrigger key={category} value={category} className="text-sm">
								{category}
								<Badge variant="outline" className="ml-2 text-xs bg-gray-50 text-gray-600 border-gray-300">
									{parametersByCategory[category]?.length || 0}
								</Badge>
							</TabsTrigger>
						))}
					</TabsList>

					{categories.map((category) => (
						<TabsContent key={category} value={category} className="space-y-4">
							<CategoryParametersTable 
								parameters={parametersByCategory[category] || []}
								category={category}
							/>
						</TabsContent>
					))}
				</Tabs>
			</CardContent>
		</Card>
	);
}

/**
 * CategoryParametersTable component - Displays parameters for a specific category
 */
function CategoryParametersTable({ 
	parameters, 
	category 
}: { 
	parameters: any[]; 
	category: string; 
}) {
	// Ensure parameters is an array and has valid items
	if (!Array.isArray(parameters) || parameters.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<p>No parameters found in category: {category}</p>
			</div>
		);
	}

	// Filter out any invalid parameters
	const validParameters = parameters.filter(param => 
		param && typeof param === 'object' && (param.name || param.id)
	);

	if (validParameters.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<p>No valid parameters found in category: {category}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Parameter
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Value
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Unit
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Description
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{validParameters.map((parameter, index) => (
							<tr key={parameter.id || index} className="hover:bg-gray-50 transition-colors duration-150">
								<td className="px-4 py-3">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-gray-900">
											{parameter.name || `Parameter ${index + 1}`}
										</span>
										{parameter.information && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Badge variant="outline" className="h-4 px-1 text-xs cursor-help border-gray-300 text-gray-600 hover:bg-gray-50">
															<Info className="h-3 w-3" />
														</Badge>
													</TooltipTrigger>
													<TooltipContent className="max-w-xs">
														<p className="text-sm">{parameter.information}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
									</div>
								</td>
								<td className="px-4 py-3">
									<span className="text-sm text-gray-900 font-medium">
										{formatParameterValue(parameter)}
									</span>
								</td>
								<td className="px-4 py-3">
									<span className="text-sm text-gray-500">
										{parameter.unit || '-'}
									</span>
								</td>
								<td className="px-4 py-3">
									<span className="text-sm text-gray-600">
										{parameter.description || '-'}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

/**
 * Helper function to format parameter values
 */
function formatParameterValue(parameter: any): string {
	// Handle percentage values
	if (parameter.unit === "%") {
		if (parameter.value !== undefined && parameter.value !== null && parameter.value !== "") {
			return `${(parseFloat(parameter.value) * 100).toFixed(2)}%`;
		}
		if (parameter.test_value !== undefined && parameter.test_value !== null && parameter.test_value !== "") {
			return `${(parseFloat(parameter.test_value) * 100).toFixed(2)}%`;
		}
		if (parameter.default_value !== undefined && parameter.default_value !== null && parameter.default_value !== "") {
			return `${(parseFloat(parameter.default_value) * 100).toFixed(2)}%`;
		}
		return '-';
	}
	
	// Handle currency values
	if (parameter.unit === "$" || parameter.unit === "USD") {
		if (parameter.value !== undefined && parameter.value !== null && parameter.value !== "") {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			}).format(parseFloat(parameter.value));
		}
		if (parameter.test_value !== undefined && parameter.test_value !== null && parameter.test_value !== "") {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			}).format(parseFloat(parameter.test_value));
		}
		if (parameter.default_value !== undefined && parameter.default_value !== null && parameter.default_value !== "") {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			}).format(parseFloat(parameter.default_value));
		}
		return '-';
	}
	
	// Handle numeric values with appropriate decimal places
	if (parameter.value !== undefined && parameter.value !== null && parameter.value !== "") {
		const numValue = parseFloat(parameter.value);
		if (!isNaN(numValue)) {
			const decimalPlaces = Number.isInteger(numValue) ? 0 : 2;
			return numValue.toLocaleString('en-US', {
				minimumFractionDigits: decimalPlaces,
				maximumFractionDigits: decimalPlaces,
			});
		}
	}
	
	// Fallback to test_value
	if (parameter.test_value !== undefined && parameter.test_value !== null && parameter.test_value !== "") {
		const testValue = parseFloat(parameter.test_value);
		if (!isNaN(testValue)) {
			const decimalPlaces = Number.isInteger(testValue) ? 0 : 2;
			return testValue.toLocaleString('en-US', {
				minimumFractionDigits: decimalPlaces,
				maximumFractionDigits: decimalPlaces,
			});
		}
		return parameter.test_value.toString();
	}
	
	// Fallback to default_value
	if (parameter.default_value !== undefined && parameter.default_value !== null && parameter.default_value !== "") {
		const defaultValue = parseFloat(parameter.default_value);
		if (!isNaN(defaultValue)) {
			const decimalPlaces = Number.isInteger(defaultValue) ? 0 : 2;
			return defaultValue.toLocaleString('en-US', {
				minimumFractionDigits: decimalPlaces,
				maximumFractionDigits: decimalPlaces,
			});
		}
		return parameter.default_value.toString();
	}
	
	return '-';
}
