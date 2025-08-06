import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useState, useEffect, useCallback } from "react";
import { 
	fetchIndustryDetails, 
	fetchTechnologyDetails, 
	fetchSolutionTypesForDisplay 
} from "../api";
import {
	formatCurrency,
	formatPercentage,
	getDifferenceColor,
	getPercentChangeColor,
	transformResultData,
	transformDataForChart,
	type ComparisonRow,
	type GraphData,
} from "../utils/formatters";
import {
	ValueCalculatorResultsProps,
	ComparisonMode,
	ConfigurationSummaryProps,
	ResultsTableProps,
	VisualComparisonProps,
	ComparisonGraphProps,
} from "../types/types";

/**
 * ValueCalculatorResults component - Displays calculation results and comparisons
 * Handles both single solution results and comparison between two solutions
 * Provides tabular data and visual charts for financial metrics analysis
 */
export default function ValueCalculatorResults({
	hasCalculated,
	selectedIndustry,
	selectedTechnology,
	selectedSolution,
	solutionVariantA,
	solutionVariantB,
	fetchedSolutionA,
	fetchedSolutionB,
	resultData,
	comparisonMode,
}: ValueCalculatorResultsProps) {
	// State for resolved names
	const [industryName, setIndustryName] = useState<string>("");
	const [technologyName, setTechnologyName] = useState<string>("");
	const [solutionName, setSolutionName] = useState<string>("");
	const [isLoadingNames, setIsLoadingNames] = useState<boolean>(false);

	/**
	 * Resolve industry ID to display name
	 */
	const resolveIndustryName = async (industryId: string) => {
		if (!industryId) return;
		
		setIsLoadingNames(true);
		try {
			const industry = await fetchIndustryDetails(industryId);
			if (industry) {
				setIndustryName(industry.name);
			} else {
				setIndustryName(industryId);
			}
		} catch (error) {
			setIndustryName(industryId);
		} finally {
			setIsLoadingNames(false);
		}
	};

	/**
	 * Resolve technology ID to display name
	 */
	const resolveTechnologyName = async (technologyId: string) => {
		if (!technologyId) return;
		
		setIsLoadingNames(true);
		try {
			const technology = await fetchTechnologyDetails(technologyId);
			if (technology) {
				setTechnologyName(technology.name);
			} else {
				setTechnologyName(technologyId);
			}
		} catch (error) {
			setTechnologyName(technologyId);
		} finally {
			setIsLoadingNames(false);
		}
	};

	/**
	 * Resolve solution ID to display name
	 */
	const resolveSolutionName = useCallback(async (solutionId: string) => {
		if (!solutionId || !selectedIndustry || !selectedTechnology) return;

		setIsLoadingNames(true);
		try {
			const solutionTypes = await fetchSolutionTypesForDisplay(selectedIndustry, selectedTechnology);
			const solution = solutionTypes.find((s: any) => s.id === solutionId);
			if (solution) {
				setSolutionName(solution.name);
			} else {
				setSolutionName(solutionId);
			}
		} catch (error) {
			setSolutionName(solutionId);
		} finally {
			setIsLoadingNames(false);
		}
	}, [selectedIndustry, selectedTechnology]);

	/**
	 * Resolve names when IDs change
	 */
	useEffect(() => {
		if (selectedSolution) {
			resolveSolutionName(selectedSolution);
		}
	}, [selectedIndustry, selectedTechnology, selectedSolution, resolveSolutionName]);


	/**
	 * Transform result data into comparison format
	 */
	const comparisonRows = transformResultData(resultData, comparisonMode);

	return (
		hasCalculated ? (
			<div className="space-y-6">
				<ConfigurationSummary
					comparisonMode={comparisonMode}
					fetchedSolutionA={fetchedSolutionA}
					fetchedSolutionB={fetchedSolutionB}
					industryName={industryName}
					technologyName={technologyName}
					solutionName={solutionName}
					isLoadingNames={isLoadingNames}
				/>

				<ResultsTable
					comparisonMode={comparisonMode}
					comparisonRows={comparisonRows}
					fetchedSolutionA={fetchedSolutionA}
					fetchedSolutionB={fetchedSolutionB}
					formatCurrency={formatCurrency}
					getDifferenceColor={getDifferenceColor}
					getPercentChangeColor={getPercentChangeColor}
					formatPercentage={formatPercentage}
				/>

				{comparisonMode === "compare" && resultData && (
					<VisualComparison
						resultData={resultData}
						fetchedSolutionA={fetchedSolutionA}
						fetchedSolutionB={fetchedSolutionB}
					/>
				)}
			</div>
		) : (
			<EmptyState />
		)
	);
}

/**
 * ConfigurationSummary component - Displays summary of selected solutions and configuration
 */
function ConfigurationSummary({
	comparisonMode,
	fetchedSolutionA,
	fetchedSolutionB,
	industryName,
	technologyName,
	solutionName,
	isLoadingNames,
}: ConfigurationSummaryProps) {
	return (
		<div className="bg-muted/30 rounded-lg p-4">
			<h3 className="text-sm font-medium mb-4 text-muted-foreground">Configuration Summary</h3>
			<div className={`grid gap-6 ${comparisonMode === "compare" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
				{/* Single Mode - Show only Solution A */}
				{comparisonMode === "single" && fetchedSolutionA && (
					<SingleSolutionSummary
						fetchedSolutionA={fetchedSolutionA}
						industryName={industryName}
						technologyName={technologyName}
						solutionName={solutionName}
						isLoadingNames={isLoadingNames}
					/>
				)}

				{/* Compare Mode - Show both solutions */}
				{comparisonMode === "compare" && (
					<ComparisonSolutionSummary
						fetchedSolutionA={fetchedSolutionA}
						fetchedSolutionB={fetchedSolutionB}
						industryName={industryName}
						technologyName={technologyName}
						isLoadingNames={isLoadingNames}
					/>
				)}

				{/* No solution selected */}
				{!fetchedSolutionA && !fetchedSolutionB && (
					<NoSolutionSelected />
				)}
			</div>
		</div>
	);
}

/**
 * SingleSolutionSummary component - Shows summary for single solution mode
 */
function SingleSolutionSummary({
	fetchedSolutionA,
	industryName,
	technologyName,
	solutionName,
	isLoadingNames,
}: {
	fetchedSolutionA?: any | null;
	industryName: string;
	technologyName: string;
	solutionName?: string;
	isLoadingNames: boolean;
}) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 mb-3">
				<div className="w-3 h-3 bg-blue-600 rounded-full"></div>
				<h4 className="text-sm font-medium text-gray-900">
					{fetchedSolutionA?.solution_name || "Selected Solution"}
				</h4>
			</div>
			<div className="space-y-3 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Industry:</span>
					<span className="font-medium">
						{isLoadingNames ? "Loading..." : (industryName || "Not selected")}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Technology:</span>
					<span className="font-medium">
						{isLoadingNames ? "Loading..." : (technologyName || "Not selected")}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Solution:</span>
					<span className="font-medium">
						{isLoadingNames ? "Loading..." : (solutionName || "Not selected")}
					</span>
				</div>
			
				{fetchedSolutionA?.solution_description && (
					<div className="pt-2 border-t">
						<div className="text-muted-foreground mb-1">Description:</div>
						<div className="text-sm text-gray-700">
							{fetchedSolutionA.solution_description}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * ComparisonSolutionSummary component - Shows summary for comparison mode
 */
function ComparisonSolutionSummary({
	fetchedSolutionA,
	fetchedSolutionB,
	industryName,
	technologyName,
	isLoadingNames,
}: ConfigurationSummaryProps) {
	return (
		<>
			{/* Solution A Configuration */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-3">
					<div className="w-3 h-3 bg-blue-600 rounded-full"></div>
					<h4 className="text-sm font-medium text-gray-900">
						{fetchedSolutionA?.solution_name || "Solution A"}
					</h4>
				</div>
				<div className="space-y-3 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Industry:</span>
						<span className="font-medium">
							{isLoadingNames ? "Loading..." : (industryName || "Not selected")}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Technology:</span>
						<span className="font-medium">
							{isLoadingNames ? "Loading..." : (technologyName || "Not selected")}
						</span>
					</div>
				 
					{fetchedSolutionA?.solution_description && (
						<div className="pt-2 border-t">
							<div className="text-muted-foreground mb-1">Description:</div>
							<div className="text-sm text-gray-700">
								{fetchedSolutionA.solution_description}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Solution B Configuration */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-3">
					<div className="w-3 h-3 bg-green-600 rounded-full"></div>
					<h4 className="text-sm font-medium text-gray-900">
						{fetchedSolutionB?.solution_name || "Solution B"}
					</h4>
				</div>
				<div className="space-y-3 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Industry:</span>
						<span className="font-medium">
							{isLoadingNames ? "Loading..." : (industryName || "Not selected")}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Technology:</span>
						<span className="font-medium">
							{isLoadingNames ? "Loading..." : (technologyName || "Not selected")}
						</span>
					</div>
			   
					{fetchedSolutionB?.solution_description && (
						<div className="pt-2 border-t">
							<div className="text-muted-foreground mb-1">Description:</div>
							<div className="text-sm text-gray-700">
								{fetchedSolutionB.solution_description}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

/**
 * NoSolutionSelected component - Shows when no solution is selected
 */
function NoSolutionSelected() {
	return (
		<div className="text-center py-8 text-muted-foreground">
			<p>No solution selected for comparison</p>
		</div>
	);
}

/**
 * ResultsTable component - Displays results in tabular format
 */
function ResultsTable({
	comparisonMode,
	comparisonRows,
	fetchedSolutionA,
	fetchedSolutionB,
	formatCurrency,
	getDifferenceColor,
	getPercentChangeColor,
	formatPercentage,
}: ResultsTableProps) {
	if (comparisonMode === "single") {
		return (
			<SingleResultsTable
				comparisonRows={comparisonRows}
				fetchedSolutionA={fetchedSolutionA}
				formatCurrency={formatCurrency}
			/>
		);
	} else if (comparisonMode === "compare") {
		return (
			<ComparisonResultsTable
				comparisonRows={comparisonRows}
				fetchedSolutionA={fetchedSolutionA}
				fetchedSolutionB={fetchedSolutionB}
				formatCurrency={formatCurrency}
				getDifferenceColor={getDifferenceColor}
				getPercentChangeColor={getPercentChangeColor}
				formatPercentage={formatPercentage}
			/>
		);
	}
	
	return null;
}

/**
 * SingleResultsTable component - Shows results for single solution mode
 */
function SingleResultsTable({
	comparisonRows,
	fetchedSolutionA,
	formatCurrency,
}: {
	comparisonRows: ComparisonRow[];
	fetchedSolutionA?: any | null;
	formatCurrency: (value: number) => string;
}) {
	return (
		<div className="border rounded-lg shadow-sm">
			<div className="bg-muted/50 px-6 py-4 border-b">
				<h3 className="text-lg font-semibold text-gray-900">Results Summary</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Financial metrics for {fetchedSolutionA?.solution_name || "Selected Solution"}
				</p>
			</div>
			<div className="max-h-[60vh] overflow-y-auto">
				<Table>
					<TableHeader className="sticky top-0 bg-background z-10">
						<TableRow className="border-b-2 border-gray-200">
							<TableHead className="w-48 bg-background font-semibold text-gray-900 py-4">
								Metric
							</TableHead>
							<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
								<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
									{fetchedSolutionA?.solution_name || "Selected Solution"}
								</Badge>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{comparisonRows.map((row, index) => (
							<TableRow 
								key={index} 
								className={`hover:bg-muted/50 transition-colors ${
									index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
								}`}
							>
								<TableCell className="font-medium text-gray-900 py-3">
									{row.metric}
								</TableCell>
								<TableCell className="text-center font-mono text-gray-900 py-3">
									{formatCurrency(row.variantA)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

/**
 * ComparisonResultsTable component - Shows results for comparison mode
 */
function ComparisonResultsTable({
	comparisonRows,
	fetchedSolutionA,
	fetchedSolutionB,
	formatCurrency,
	getDifferenceColor,
	getPercentChangeColor,
	formatPercentage,
}: ResultsTableProps) {
	return (
		<div className="border rounded-lg shadow-sm">
			<div className="bg-muted/50 px-6 py-4 border-b">
				<h3 className="text-lg font-semibold text-gray-900">Comparison Results</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Side-by-side comparison of financial metrics
				</p>
			</div>
			<div className="max-h-[60vh] overflow-y-auto">
				<Table>
					<TableHeader className="sticky top-0 bg-background z-10">
						<TableRow className="border-b-2 border-gray-200">
							<TableHead className="w-48 bg-background font-semibold text-gray-900 py-4">
								Metric
							</TableHead>
							<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
								<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
									{fetchedSolutionA?.solution_name || "Solution A"}
								</Badge>
							</TableHead>
							<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
								<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
									{fetchedSolutionB?.solution_name || "Solution B"}
								</Badge>
							</TableHead>
							<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
								Difference
							</TableHead>
							<TableHead className="w-24 bg-background font-semibold text-center text-gray-900 py-4">
								% Change
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{comparisonRows.map((row, index) => (
							<TableRow 
								key={index} 
								className={`hover:bg-muted/50 transition-colors ${
									index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
								}`}
							>
								<TableCell className="font-medium text-gray-900 py-3">
									{row.metric}
								</TableCell>
								<TableCell className="text-center font-mono text-gray-900 py-3">
									{formatCurrency(row.variantA)}
								</TableCell>
								<TableCell className="text-center font-mono text-gray-900 py-3">
									{formatCurrency(row.variantB)}
								</TableCell>
								<TableCell className={`text-center font-mono font-semibold py-3 ${getDifferenceColor(row.difference)}`}>
									{row.difference < 0 ? `-${formatCurrency(Math.abs(row.difference))}` : `+${formatCurrency(row.difference)}`}
								</TableCell>
								<TableCell className={`text-center font-mono font-semibold py-3 ${getPercentChangeColor(row.percentChange)}`}>
									{formatPercentage(row.percentChange)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

/**
 * VisualComparison component - Shows chart visualization for comparison mode
 */
function VisualComparison({
	resultData,
	fetchedSolutionA,
	fetchedSolutionB,
}: VisualComparisonProps) {
	return (
		<div className="border rounded-lg shadow-sm">
			<div className="bg-muted/50 px-6 py-4 border-b">
				<h3 className="text-lg font-semibold text-gray-900">Visual Comparison</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Graphical representation of key metrics comparison
				</p>
			</div>
			<div className="p-6">
				<ComparisonGraph 
					resultData={resultData}
					solutionAName={fetchedSolutionA?.solution_name || "Solution A"}
					solutionBName={fetchedSolutionB?.solution_name || "Solution B"}
				/>
			</div>
		</div>
	);
}

/**
 * EmptyState component - Shows when no calculation has been performed
 */
function EmptyState() {
	return (
		<div className="text-center py-8">
			<p className="text-muted-foreground">Please complete configuration and click Calculate to view comparison results.</p>
		</div>
	);
}

/**
 * ComparisonGraph component - Renders bar chart for solution comparison
 */
function ComparisonGraph({ 
	resultData, 
	solutionAName, 
	solutionBName 
}: ComparisonGraphProps) {
	const chartData = transformDataForChart(resultData);

	/**
	 * Format currency values for tooltip
	 */
	const formatCurrency = (value: number) => {
		if (value >= 1000000) {
			return `$${(value / 1000000).toFixed(1)}M`;
		} else if (value >= 1000) {
			return `$${(value / 1000).toFixed(1)}K`;
		} else {
			return `$${value.toFixed(0)}`;
		}
	};

	/**
	 * Custom tooltip component
	 */
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border rounded-lg shadow-lg">
					<p className="font-medium text-gray-900">{label}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} className="text-sm" style={{ color: entry.color }}>
							{entry.name}: {formatCurrency(entry.value)}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	if (chartData.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<p>No data available for visualization</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<ResponsiveContainer width="100%" height={400}>
				<BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
					<XAxis 
						dataKey="name" 
						height={60}
						tick={{ fontSize: 11, fill: '#6b7280' }}
						axisLine={{ stroke: '#e5e7eb' }}
					/>
					<YAxis 
						tickFormatter={(value) => {
							if (value >= 1000000) {
								return `$${(value / 1000000).toFixed(0)}M`;
							} else if (value >= 1000) {
								return `$${(value / 1000).toFixed(0)}K`;
							} else {
								return `$${value}`;
							}
						}}
						tick={{ fontSize: 11, fill: '#6b7280' }}
						axisLine={{ stroke: '#e5e7eb' }}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend 
						wrapperStyle={{ paddingTop: '10px' }}
						formatter={(value) => <span style={{ color: '#374151', fontSize: '12px' }}>{value}</span>}
					/>
					<Bar 
						dataKey="solutionA" 
						fill="#3B82F6" 
						name={solutionAName}
						radius={[4, 4, 0, 0]}
						stroke="#2563EB"
						strokeWidth={1}
					/>
					<Bar 
						dataKey="solutionB" 
						fill="#10B981" 
						name={solutionBName}
						radius={[4, 4, 0, 0]}
						stroke="#059669"
						strokeWidth={1}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}