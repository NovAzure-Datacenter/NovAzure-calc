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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TableIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
	parameterValues,
}: ValueCalculatorResultsProps) {
	// State for resolved names
	const [industryName, setIndustryName] = useState<string>("");
	const [technologyName, setTechnologyName] = useState<string>("");
	const [solutionName, setSolutionName] = useState<string>("");
	const [isLoadingNames, setIsLoadingNames] = useState<boolean>(false);


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


	console.log(resultData)
	return (
		hasCalculated ? (
			<div className="space-y-6">
				{/* <ConfigurationSummary
					comparisonMode={comparisonMode}
					fetchedSolutionA={fetchedSolutionA}
					fetchedSolutionB={fetchedSolutionB}
					industryName={industryName}
					technologyName={technologyName}
					solutionName={solutionName}
					isLoadingNames={isLoadingNames}
				/> */}

				 <ResultsTable
				 resultData={resultData}
					comparisonMode={comparisonMode}
					comparisonRows={comparisonRows}
					fetchedSolutionA={fetchedSolutionA}
					fetchedSolutionB={fetchedSolutionB}
					formatCurrency={formatCurrency}
					getDifferenceColor={getDifferenceColor}
					getPercentChangeColor={getPercentChangeColor}
					formatPercentage={formatPercentage}
				/> 

				<Separator />


				{/* Chart System for detailed analysis */}
				{resultData && (
					<ChartSystem
						resultData={resultData}
						fetchedSolutionA={fetchedSolutionA}
						fetchedSolutionB={fetchedSolutionB}
						comparisonMode={comparisonMode}
						parameterValues={parameterValues}
					/>
				)}
			</div>
		) : (
			<EmptyState />
		)
	);
}


/**
 * ResultsTable component - Displays results in tabular format with tab navigation
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
	resultData,
	}: ResultsTableProps) {
	const [selectedTab, setSelectedTab] = useState("main");

	// Helper function to convert calculation name to resultData key
	const getResultDataKey = (calculationName: string) => {
		if (!resultData?.solutionA) return calculationName;
		
		const availableKeys = Object.keys(resultData.solutionA);
		
		// First, try exact match
		if (availableKeys.includes(calculationName)) {
			return calculationName;
		}
		
		// Normalize the calculation name: lowercase and replace spaces with underscores
		const normalizedCalculationName = calculationName.toLowerCase().replace(/\s+/g, '_');
		
		// Find the best match by comparing normalized versions
		let bestMatch = null;
		let bestScore = 0;
		
		for (const key of availableKeys) {
			// Normalize the key: lowercase
			const normalizedKey = key.toLowerCase();
			
			// Calculate similarity score
			let score = 0;
			
			// Exact match gets highest score
			if (normalizedKey === normalizedCalculationName) {
				score = 100;
			}
			// Key contains the normalized calculation name (most common case)
			else if (normalizedKey.includes(normalizedCalculationName)) {
				score = 90;
			}
			// Normalized calculation name contains the key
			else if (normalizedCalculationName.includes(normalizedKey)) {
				score = 85;
			}
			// Word-by-word comparison
			else {
				const calcWords = normalizedCalculationName.split('_').filter(word => word.length >= 2);
				const keyWords = normalizedKey.split('_').filter(word => word.length >= 2);
				
				if (calcWords.length > 0 && keyWords.length > 0) {
					const commonWords = calcWords.filter(word => keyWords.includes(word));
					score = (commonWords.length / Math.max(calcWords.length, keyWords.length)) * 70;
				}
			}
			
			if (score > bestScore) {
				bestScore = score;
				bestMatch = key;
			}
		}
		
		// If we found a good match, use it
		if (bestMatch && bestScore > 50) {
			return bestMatch;
		}
		
		// Fallback: try common transformations
		const fallbackVariations = [
			calculationName.replace(/\s+/g, '_').toUpperCase(),
			calculationName.replace(/\s+/g, '_'),
			calculationName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').toUpperCase()
		];
		
		for (const variation of fallbackVariations) {
			if (availableKeys.includes(variation)) {
				return variation;
			}
		}
		
		return calculationName;
	};

	// Helper function to get result value from resultData
	const getResultValue = (calculationName: string, solution: 'A' | 'B') => {
		if (!resultData) return 0;
		
		const key = getResultDataKey(calculationName);
		const solutionKey = solution === 'A' ? 'solutionA' : 'solutionB';
		
		return resultData[solutionKey]?.[key] || 0;
	};

	// Categorize calculations by their category names and create dynamic tabs
	const categorizeCalculations = () => {
		const categorized: Record<string, any[]> = {};
		const availableCategories = new Set<string>();

		// Process Solution A calculations
		if (fetchedSolutionA?.calculations) {
			fetchedSolutionA.calculations.forEach((calc: any) => {
				// Only include calculations where display_result is true
				if (calc.display_result !== true) return;
				
				const categoryName = calc.category?.name?.toLowerCase() || 'other';
				availableCategories.add(categoryName);
				
				if (!categorized[categoryName]) {
					categorized[categoryName] = [];
				}

				const calculationItem = {
					...calc,
					solution: 'A',
					solutionName: fetchedSolutionA.solution_name || 'Solution A',
					color: 'blue',
					resultValue: getResultValue(calc.name, 'A')
				};

				categorized[categoryName].push(calculationItem);
			});
		}

		// Process Solution B calculations (only in compare mode)
		if (comparisonMode === "compare" && fetchedSolutionB?.calculations) {
			fetchedSolutionB.calculations.forEach((calc: any) => {
				// Only include calculations where display_result is true
				if (calc.display_result !== true) return;
				
				const categoryName = calc.category?.name?.toLowerCase() || 'other';
				availableCategories.add(categoryName);
				
				if (!categorized[categoryName]) {
					categorized[categoryName] = [];
				}

				const calculationItem = {
					...calc,
					solution: 'B',
					solutionName: fetchedSolutionB.solution_name || 'Solution B',
					color: 'green',
					resultValue: getResultValue(calc.name, 'B')
				};

				categorized[categoryName].push(calculationItem);
			});
		}

		return { categorized, availableCategories: Array.from(availableCategories) };
	};

	const { categorized, availableCategories } = categorizeCalculations();

	// Create dynamic tabs based on available categories, with "required" first and relabeled to "main"
	const tabs = availableCategories
		.sort((a, b) => {
			// Define priority order for main categories
			const priorityOrder = ['required', 'capex', 'opex'];
			
			// Get priority indices
			const aPriority = priorityOrder.indexOf(a);
			const bPriority = priorityOrder.indexOf(b);
			
			// If both are priority categories, sort by priority order
			if (aPriority !== -1 && bPriority !== -1) {
				return aPriority - bPriority;
			}
			
			// If only one is priority, prioritize it
			if (aPriority !== -1) return -1;
			if (bPriority !== -1) return 1;
			
			// Sort other categories alphabetically
			return a.localeCompare(b);
		})
		.map(category => {
			// Special handling for main, capex, and opex tabs
			if (category === 'required') {
				return { id: category, label: 'Main' };
			}
			if (category === 'capex') {
				return { id: category, label: 'CAPEX' };
			}
			if (category === 'opex') {
				return { id: category, label: 'OPEX' };
			}
			
			// For other categories, check which solutions contain this category and attach only those solution names
			const solutionsWithCategory: string[] = [];
			
			if (fetchedSolutionA?.calculations?.some((calc: any) => 
				calc.category?.name?.toLowerCase() === category && calc.display_result === true
			)) {
				solutionsWithCategory.push(fetchedSolutionA.solution_name || 'Solution A');
			}
			
			if (comparisonMode === "compare" && fetchedSolutionB?.calculations?.some((calc: any) => 
				calc.category?.name?.toLowerCase() === category && calc.display_result === true
			)) {
				solutionsWithCategory.push(fetchedSolutionB.solution_name || 'Solution B');
			}
			
			// Only attach solution names if the category exists in at least one solution
			if (solutionsWithCategory.length > 0) {
				const solutionName = solutionsWithCategory.join(' & ');
				return {
					id: category,
					label: `${category.charAt(0).toUpperCase() + category.slice(1)} • ${solutionName}`
				};
			}
			
			// Fallback if no solutions contain this category
			return {
				id: category,
				label: category.charAt(0).toUpperCase() + category.slice(1)
			};
		});

	// Set default selected tab to first available category
	useEffect(() => {
		if (availableCategories.length > 0 && !availableCategories.includes(selectedTab)) {
			setSelectedTab(availableCategories[0]);
		}
	}, [availableCategories, selectedTab]);

	const renderTabContent = () => {
		const currentCalculations = categorized[selectedTab] || [];
		
		if (currentCalculations.length === 0) {
			return (
				<div className="border rounded-lg shadow-sm">
					<div className="bg-muted/50 px-6 py-4 border-b">
						<h3 className="text-lg font-semibold text-gray-900">{tabs.find(t => t.id === selectedTab)?.label || 'Results'}</h3>
						<p className="text-sm text-muted-foreground mt-1">
							No calculations found for this category
						</p>
					</div>
					<div className="p-6 text-center text-muted-foreground">
						<p>No calculations found</p>
					</div>
				</div>
			);
		}

		// Get solution names
		const solutionAName = fetchedSolutionA?.solution_name || "Solution A";
		const solutionBName = fetchedSolutionB?.solution_name || "Solution B";

		// Get all unique calculation names from both solutions
		const allCalculationNames = new Set<string>();
		currentCalculations.forEach(calc => {
			allCalculationNames.add(calc.name);
		});

		// Create a map of calculations by name and solution for easy lookup
		const calculationsMap = new Map<string, { A?: any, B?: any }>();
		currentCalculations.forEach(calc => {
			if (!calculationsMap.has(calc.name)) {
				calculationsMap.set(calc.name, {});
			}
			calculationsMap.get(calc.name)![calc.solution as 'A' | 'B'] = calc;
		});



		return (
			<div className="border rounded-lg shadow-sm">
				<div className="bg-muted/50 px-6 py-4 border-b">
					<h3 className="text-lg font-semibold text-gray-900">{tabs.find(t => t.id === selectedTab)?.label || 'Results'}</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Financial metrics and calculations for {selectedTab} category
					</p>
				</div>
				<div className="h-[400px] overflow-y-auto">
					<Table>
						<TableHeader className="sticky top-0 bg-background z-10">
							<TableRow className="border-b-2 border-gray-200">
								<TableHead className="w-48 bg-background font-semibold text-gray-900 py-4">
									Metric
								</TableHead>
								{comparisonMode === "compare" ? (
									<>
										<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
											<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
												{solutionAName}
											</Badge>
										</TableHead>
										<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
											<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
												{solutionBName}
											</Badge>
										</TableHead>
										<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
											Difference
										</TableHead>
									</>
								) : (
									<TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
										<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
											{solutionAName}
										</Badge>
									</TableHead>
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{comparisonMode === "compare" ? (
								// Comparison mode - show all calculations from both solutions
								Array.from(allCalculationNames).map((calcName, index) => {
									const calcA = calculationsMap.get(calcName)?.A;
									const calcB = calculationsMap.get(calcName)?.B;
									
									// Calculate difference only if both solutions have the calculation
									let difference: number | null = null;
									let differenceDisplay = "N/A";
									let differenceColor = "text-gray-500";
									
									if (calcA && calcB) {
										difference = calcB.result - calcA.result;
										differenceDisplay = difference < 0 ? 
											`-${formatCurrency(Math.abs(difference))}` : 
											`+${formatCurrency(difference)}`;
										differenceColor = getDifferenceColor(difference);
									}
									
									return (
										<TableRow 
											key={index} 
											className={`hover:bg-muted/50 transition-colors ${
												index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
											}`}
										>
											<TableCell className="font-medium text-gray-900 py-3">
												{calcName}
											</TableCell>
											<TableCell className="text-center font-mono text-gray-900 py-3">
												{calcA ? formatCurrency(calcA.result) : "N/A"}
											</TableCell>
											<TableCell className="text-center font-mono text-gray-900 py-3">
												{calcB ? formatCurrency(calcB.result) : "N/A"}
											</TableCell>
											<TableCell className={`text-center font-mono font-semibold py-3 ${differenceColor}`}>
												{differenceDisplay}
											</TableCell>
										</TableRow>
									);
								})
							) : (
								// Single mode - show only solution A calculations
								currentCalculations
									.filter(calc => calc.solution === 'A')
									.map((calc: any, index: number) => (
										<TableRow 
											key={index} 
											className={`hover:bg-muted/50 transition-colors ${
												index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
											}`}
										>
											<TableCell className="font-medium text-gray-900 py-3">
												{calc.name}
											</TableCell>
											<TableCell className="text-center font-mono text-gray-900 py-3">
												{formatCurrency(calc.resultValue)}
											</TableCell>
										</TableRow>
									))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-4">
			{/* Tab Navigation */}
			{tabs.length > 0 && (
				<Tabs value={selectedTab} onValueChange={setSelectedTab}>
					<TabsList className="flex w-full overflow-x-auto">
						{tabs.map((tab) => (
							<TabsTrigger key={tab.id} value={tab.id} className="text-sm whitespace-nowrap">
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			)}

			{/* Tab Content */}
			{renderTabContent()}
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
 * ChartSystem component - Comprehensive chart visualization system for value calculator results
 * Provides TCO, CAPEX, and OPEX analysis with interactive charts and tables
 * Includes summary cards, tab navigation, and detailed breakdowns
 */
function ChartSystem({
	resultData,
	fetchedSolutionA,
	fetchedSolutionB,
	comparisonMode,
	parameterValues,
}: {
	resultData: any;
	fetchedSolutionA?: any | null;
	fetchedSolutionB?: any | null;
	comparisonMode: ComparisonMode | null | undefined;
	parameterValues: Record<string, any>;
}) {
	const [selectedChartTab, setSelectedChartTab] = useState("tco");
	const [isTableView, setIsTableView] = useState(false);
	const [isTcoWithInitialCapex, setIsTcoWithInitialCapex] = useState(false);

	const chartTabs = [
		{ id: "tco", label: "TCO Analysis", color: "purple" },
		{ id: "capex", label: "CAPEX Analysis", color: "green" },
		{ id: "opex", label: "OPEX Analysis", color: "blue" },
	];

	// Extract key metrics from both solutions
	const getSolutionData = () => {
		const solutionAData = resultData?.solutionA || {};
		const solutionBData = resultData?.solutionB || {};
		
		return {
			solutionA: {
				totalCapex: Number(solutionAData?.Total_CAPEX || 0),
				totalTco: Number(solutionAData?.Total_Cost_of_Ownership || 0),
				annualOpex: Number(solutionAData?.Annual_OPEX || 0),
				lifetimeOpex: Number(solutionAData?.OPEX_for_lifetime_operation || 0),
			},
			solutionB: {
				totalCapex: Number(solutionBData?.Total_CAPEX || 0),
				totalTco: Number(solutionBData?.Total_Cost_of_Ownership || 0),
				annualOpex: Number(solutionBData?.Annual_OPEX || 0),
				lifetimeOpex: Number(solutionBData?.OPEX_for_lifetime_operation || 0),
			}
		};
	};

	const solutionData = getSolutionData();
	
	// Get planned years from parameterValues
	const plannedYearsParam = fetchedSolutionA?.parameters?.find(
		(param: any) => param.name === "Planned Years of Operation"
	);
	const plannedYears = plannedYearsParam 
		? parseInt(parameterValues[plannedYearsParam.id] || "4")
		: 4;

	// Generate CAPEX breakdown from calculations for both solutions
	const generateCapexBreakdown = () => {
		const breakdownA = [];
		const breakdownB = [];

		if (fetchedSolutionA?.calculations) {
			const capexCalculationsA = fetchedSolutionA.calculations.filter((calc: any) => 
				calc.category?.name?.toLowerCase() === "capex" ||
				calc.name.toLowerCase().includes("capex") ||
				calc.name.toLowerCase().includes("capital")
			);

			breakdownA.push(...capexCalculationsA.map((calc: any) => ({
				name: calc.name,
				value: Number(calc.result || 0),
				percentage: 0,
				category: calc.category?.name || "capex",
			})));
		}

		if (fetchedSolutionB?.calculations && comparisonMode === "compare") {
			const capexCalculationsB = fetchedSolutionB.calculations.filter((calc: any) => 
				calc.category?.name?.toLowerCase() === "capex" ||
				calc.name.toLowerCase().includes("capex") ||
				calc.name.toLowerCase().includes("capital")
			);

			breakdownB.push(...capexCalculationsB.map((calc: any) => ({
				name: calc.name,
				value: Number(calc.result || 0),
				percentage: 0,
				category: calc.category?.name || "capex",
			})));
		}

		// Calculate percentages for both solutions
		const totalValueA = breakdownA.reduce((sum: number, item: any) => sum + item.value, 0);
		const totalValueB = breakdownB.reduce((sum: number, item: any) => sum + item.value, 0);
		
		breakdownA.forEach((item: any) => {
			item.percentage = totalValueA > 0 ? (item.value / totalValueA) * 100 : 0;
		});
		
		breakdownB.forEach((item: any) => {
			item.percentage = totalValueB > 0 ? (item.value / totalValueB) * 100 : 0;
		});

		return {
			solutionA: breakdownA.sort((a: any, b: any) => b.value - a.value),
			solutionB: breakdownB.sort((a: any, b: any) => b.value - a.value),
		};
	};

	// Generate data for different chart types
	const generateOpexData = () => {
		const data = [];
		for (let year = 1; year <= plannedYears; year++) {
			const yearOpexA = solutionData.solutionA.annualOpex;
			const yearOpexB = solutionData.solutionB.annualOpex;
			const cumulativeOpexA = yearOpexA * year;
			const cumulativeOpexB = yearOpexB * year;
			const capexAmortizedA = solutionData.solutionA.totalCapex / plannedYears;
			const capexAmortizedB = solutionData.solutionB.totalCapex / plannedYears;
			const totalYearlyCostA = yearOpexA + capexAmortizedA;
			const totalYearlyCostB = yearOpexB + capexAmortizedB;
			const cumulativeTotalCostA = yearOpexA * year + capexAmortizedA * year;
			const cumulativeTotalCostB = yearOpexB * year + capexAmortizedB * year;

			data.push({
				year: `Year ${year}`,
				annualOpexA: yearOpexA,
				annualOpexB: yearOpexB,
				cumulativeOpexA: cumulativeOpexA,
				cumulativeOpexB: cumulativeOpexB,
				capexAmortizedA: capexAmortizedA,
				capexAmortizedB: capexAmortizedB,
				totalYearlyCostA: totalYearlyCostA,
				totalYearlyCostB: totalYearlyCostB,
				cumulativeTotalCostA: cumulativeTotalCostA,
				cumulativeTotalCostB: cumulativeTotalCostB,
			});
		}
		return data;
	};

	const generateTcoData = () => {
		const data = [];
		
		if (isTcoWithInitialCapex) {
			// Year 0 with initial CAPEX
			data.push({
				year: "Year 0",
				annualOpexA: 0,
				annualOpexB: 0,
				cumulativeOpexA: 0,
				cumulativeOpexB: 0,
				capexAmortizedA: 0,
				capexAmortizedB: 0,
				initialCapexA: solutionData.solutionA.totalCapex,
				initialCapexB: solutionData.solutionB.totalCapex,
				cumulativeCapexA: solutionData.solutionA.totalCapex,
				cumulativeCapexB: solutionData.solutionB.totalCapex,
				totalYearlyCostA: solutionData.solutionA.totalCapex,
				totalYearlyCostB: solutionData.solutionB.totalCapex,
				cumulativeTotalCostA: solutionData.solutionA.totalCapex,
				cumulativeTotalCostB: solutionData.solutionB.totalCapex,
			});
		}
		
		for (let year = 1; year <= plannedYears; year++) {
			const yearOpexA = solutionData.solutionA.annualOpex;
			const yearOpexB = solutionData.solutionB.annualOpex;
			const cumulativeOpexA = yearOpexA * year;
			const cumulativeOpexB = yearOpexB * year;
			
			let cumulativeCapexA, cumulativeCapexB;
			if (isTcoWithInitialCapex) {
				// CAPEX stays at initial value, no amortization
				cumulativeCapexA = solutionData.solutionA.totalCapex;
				cumulativeCapexB = solutionData.solutionB.totalCapex;
			} else {
				// CAPEX amortized across years
				const capexAmortizedA = solutionData.solutionA.totalCapex / plannedYears;
				const capexAmortizedB = solutionData.solutionB.totalCapex / plannedYears;
				cumulativeCapexA = capexAmortizedA * year;
				cumulativeCapexB = capexAmortizedB * year;
			}
			
			const totalYearlyCostA = yearOpexA + (isTcoWithInitialCapex ? 0 : solutionData.solutionA.totalCapex / plannedYears);
			const totalYearlyCostB = yearOpexB + (isTcoWithInitialCapex ? 0 : solutionData.solutionB.totalCapex / plannedYears);
			const cumulativeTotalCostA = cumulativeOpexA + cumulativeCapexA;
			const cumulativeTotalCostB = cumulativeOpexB + cumulativeCapexB;

			data.push({
				year: `Year ${year}`,
				annualOpexA: yearOpexA,
				annualOpexB: yearOpexB,
				cumulativeOpexA: cumulativeOpexA,
				cumulativeOpexB: cumulativeOpexB,
				capexAmortizedA: isTcoWithInitialCapex ? 0 : solutionData.solutionA.totalCapex / plannedYears,
				capexAmortizedB: isTcoWithInitialCapex ? 0 : solutionData.solutionB.totalCapex / plannedYears,
				initialCapexA: 0, // No initial CAPEX in subsequent years
				initialCapexB: 0, // No initial CAPEX in subsequent years
				cumulativeCapexA: cumulativeCapexA,
				cumulativeCapexB: cumulativeCapexB,
				totalYearlyCostA: totalYearlyCostA,
				totalYearlyCostB: totalYearlyCostB,
				cumulativeTotalCostA: cumulativeTotalCostA,
				cumulativeTotalCostB: cumulativeTotalCostB,
			});
		}
		return data;
	};

	const opexData = generateOpexData();
	const tcoData = generateTcoData();
	const capexBreakdown = generateCapexBreakdown();

	// Helper function to format currency values
	const formatCurrency = (value: number) => {
		if (value >= 1000000) {
			return `$${(value / 1000000).toFixed(1)}M`;
		} else if (value >= 1000) {
			return `$${(value / 1000).toFixed(1)}K`;
		} else {
			return `$${value.toFixed(0)}`;
		}
	};

	// Get solution names for display
	const solutionAName = fetchedSolutionA?.solution_name || "Solution A";
	const solutionBName = fetchedSolutionB?.solution_name || "Solution B";

	// Define consistent color scheme for different metric types
	const getChartColors = (metricType: 'opex' | 'capex' | 'tco' | 'total' | 'cumulative', solution: 'A' | 'B') => {
		const colors = {
			opex: {
				A: '#3b82f6', // Blue - Solution A
				B: '#1d4ed8', // Darker Blue - Solution B
			},
			capex: {
				A: '#10b981', // Green - Solution A
				B: '#059669', // Darker Green - Solution B
			},
			tco: {
				A: '#8b5cf6', // Purple - Solution A
				B: '#7c3aed', // Darker Purple - Solution B
			},
			total: {
				A: '#f59e0b', // Amber - Solution A
				B: '#d97706', // Darker Amber - Solution B
			},
			cumulative: {
				A: '#ef4444', // Red - Solution A
				B: '#dc2626', // Darker Red - Solution B
			}
		};
		
		return colors[metricType]?.[solution] || colors.opex[solution];
	};

	const renderChart = () => {
		switch (selectedChartTab) {
			case "opex":
				return (
					<div className="space-y-3">
						{/* OPEX Breakdown Chart/Table */}
						<div className="border p-3 rounded-lg relative">
							<div className="flex items-center justify-between mb-3">
								<h4 className="text-xs font-medium text-gray-900">
									OPEX Year-over-Year Analysis
								</h4>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsTableView(!isTableView)}
									className="h-6 w-6 p-0"
								>
									{isTableView ? (
										<BarChart3 className="h-3 w-3" />
									) : (
										<TableIcon className="h-3 w-3" />
									)}
								</Button>
							</div>
							
							{!isTableView ? (
								<div style={{ width: "100%", height: "250px" }}>
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={opexData}
											margin={{ top: 15, right: 25, left: 15, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="year" tick={{ fontSize: 10 }} />
											<YAxis 
												tick={{ fontSize: 10 }}
												tickFormatter={(value) => formatCurrency(value)}
											/>
											<Tooltip
												formatter={(value, name) => [
													formatCurrency(Number(value)),
													name,
												]}
											/>
											<Legend wrapperStyle={{ fontSize: "10px" }} />
											{comparisonMode === "compare" ? (
												<>
													<Bar
														dataKey="annualOpexA"
														fill={getChartColors('opex', 'A')}
														name={`${solutionAName} - Annual OPEX`}
													/>
													<Bar
														dataKey="annualOpexB"
														fill={getChartColors('opex', 'B')}
														name={`${solutionBName} - Annual OPEX`}
													/>
													<Bar
														dataKey="totalYearlyCostA"
														fill={getChartColors('total', 'A')}
														name={`${solutionAName} - Total Yearly`}
													/>
													<Bar
														dataKey="totalYearlyCostB"
														fill={getChartColors('total', 'B')}
														name={`${solutionBName} - Total Yearly`}
													/>
												</>
											) : (
												<>
													<Bar
														dataKey="annualOpexA"
														fill={getChartColors('opex', 'A')}
														name="Annual OPEX"
													/>
													<Bar
														dataKey="totalYearlyCostA"
														fill={getChartColors('total', 'A')}
														name="Total Yearly Cost (OPEX + CAPEX)"
													/>
												</>
											)}
										</BarChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className="border rounded-lg overflow-hidden">
									<div className="bg-gray-50 px-3 py-2 border-b">
										<h5 className="font-medium text-gray-900 text-xs">OPEX Yearly Breakdown</h5>
									</div>
									<div className="max-h-40 overflow-y-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-left">
														Year
													</TableHead>
													{comparisonMode === "compare" ? (
														<>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionAName} OPEX
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionBName} OPEX
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionAName} Total
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionBName} Total
															</TableHead>
														</>
													) : (
														<>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Annual OPEX
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Total Yearly Cost
															</TableHead>
														</>
													)}
												</TableRow>
											</TableHeader>
											<TableBody className="bg-white divide-y divide-gray-200">
												{opexData.map((item: any, index: number) => (
													<TableRow
														key={index}
														className="hover:bg-gray-50 transition-all duration-200"
														style={{ height: "28px", minHeight: "28px" }}
													>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden">
															<div className="text-xs font-medium text-gray-900">
																{item.year}
															</div>
														</TableCell>
														{comparisonMode === "compare" ? (
															<>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-blue-900">
																		{formatCurrency(item.annualOpexA)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-green-900">
																		{formatCurrency(item.annualOpexB)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-yellow-900">
																		{formatCurrency(item.totalYearlyCostA)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-purple-900">
																		{formatCurrency(item.totalYearlyCostB)}
																	</div>
																</TableCell>
															</>
														) : (
															<>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-blue-900">
																		{formatCurrency(item.annualOpexA)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-yellow-900">
																		{formatCurrency(item.totalYearlyCostA)}
																	</div>
																</TableCell>
															</>
														)}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</div>
							)}
						</div>

						{/* Key Insights */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
								<h5 className="font-medium text-blue-900 mb-2 text-xs">
									OPEX Insights
								</h5>
								<div className="space-y-1 text-xs">
									{comparisonMode === "compare" ? (
										<>
											<div className="flex justify-between">
												<span className="text-blue-700">{solutionAName} Annual:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(solutionData.solutionA.annualOpex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">{solutionBName} Annual:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(solutionData.solutionB.annualOpex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Difference:</span>
												<span className={`font-semibold ${
													solutionData.solutionA.annualOpex > solutionData.solutionB.annualOpex 
														? 'text-red-600' 
														: 'text-green-600'
												}`}>
													{formatCurrency(Math.abs(solutionData.solutionA.annualOpex - solutionData.solutionB.annualOpex))}
													{solutionData.solutionA.annualOpex > solutionData.solutionB.annualOpex ? ' higher' : ' lower'}
												</span>
											</div>
										</>
									) : (
										<>
											<div className="flex justify-between">
												<span className="text-blue-700">Annual OPEX:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(solutionData.solutionA.annualOpex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Lifetime OPEX:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(solutionData.solutionA.lifetimeOpex)}
												</span>
											</div>
										</>
									)}
								</div>
							</div>

							<div className="bg-green-50 p-3 rounded-lg border border-green-200">
								<h5 className="font-medium text-green-900 mb-2 text-xs">
									Cost Analysis
								</h5>
								<div className="space-y-1 text-xs">
									{comparisonMode === "compare" ? (
										<>
											<div className="flex justify-between">
												<span className="text-green-700">{solutionAName} CAPEX:</span>
												<span className="font-semibold text-green-900">
													{formatCurrency(solutionData.solutionA.totalCapex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-green-700">{solutionBName} CAPEX:</span>
												<span className="font-semibold text-green-900">
													{formatCurrency(solutionData.solutionB.totalCapex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-green-700">CAPEX Difference:</span>
												<span className={`font-semibold ${
													solutionData.solutionA.totalCapex > solutionData.solutionB.totalCapex 
														? 'text-red-600' 
														: 'text-green-600'
												}`}>
													{formatCurrency(Math.abs(solutionData.solutionA.totalCapex - solutionData.solutionB.totalCapex))}
													{solutionData.solutionA.totalCapex > solutionData.solutionB.totalCapex ? ' higher' : ' lower'}
												</span>
											</div>
										</>
									) : (
										<>
											<div className="flex justify-between">
												<span className="text-green-700">Total CAPEX:</span>
												<span className="font-semibold text-green-900">
													{formatCurrency(solutionData.solutionA.totalCapex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-green-700">Total TCO:</span>
												<span className="font-semibold text-green-900">
													{formatCurrency(solutionData.solutionA.totalTco)}
												</span>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				);
			case "capex":
				return (
					<div className="space-y-3">
						{/* CAPEX Breakdown Chart/Table */}
						<div className="border p-3 rounded-lg relative">
							<div className="flex items-center justify-between mb-3">
								<h4 className="text-xs font-medium text-gray-900">
									CAPEX Breakdown Analysis
								</h4>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsTableView(!isTableView)}
									className="h-6 w-6 p-0"
								>
									{isTableView ? (
										<BarChart3 className="h-3 w-3" />
									) : (
										<TableIcon className="h-3 w-3" />
									)}
								</Button>
							</div>
							
							{!isTableView ? (
								<div style={{ width: "100%", height: "250px" }}>
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={comparisonMode === "compare" ? 
												[...capexBreakdown.solutionA, ...capexBreakdown.solutionB] : 
												capexBreakdown.solutionA
											}
											margin={{ top: 15, right: 25, left: 15, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis
												dataKey="name"
												tick={{ fontSize: 10 }}
												angle={0}
												textAnchor="end"
												height={80}
											/>
											<YAxis
												tick={{ fontSize: 10 }}
												tickFormatter={(value) => formatCurrency(value)}
											/>
											<Tooltip
												formatter={(value, name) => [
													formatCurrency(Number(value)),
													name,
												]}
											/>
											<Legend wrapperStyle={{ fontSize: "10px" }} />
											{comparisonMode === "compare" ? (
												<>
													<Bar 
														dataKey="value" 
														fill={getChartColors('capex', 'A')} 
														name={`${solutionAName} CAPEX`}
														stackId="a"
													/>
													<Bar 
														dataKey="value" 
														fill={getChartColors('capex', 'B')} 
														name={`${solutionBName} CAPEX`}
														stackId="b"
													/>
												</>
											) : (
												<Bar dataKey="value" fill={getChartColors('capex', 'A')} name="CAPEX Value" />
											)}
										</BarChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className="border rounded-lg overflow-hidden">
									<div className="bg-gray-50 px-3 py-2 border-b">
										<h5 className="font-medium text-gray-900 text-xs">Detailed CAPEX Breakdown</h5>
									</div>
									<div className="max-h-40 overflow-y-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-left">
														Component
													</TableHead>
													{comparisonMode === "compare" ? (
														<>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionAName}
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionBName}
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Difference
															</TableHead>
														</>
													) : (
														<>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Value
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Percentage
															</TableHead>
														</>
													)}
												</TableRow>
											</TableHeader>
											<TableBody className="bg-white divide-y divide-gray-200">
												{comparisonMode === "compare" ? (
													// Comparison mode - show both solutions side by side
													capexBreakdown.solutionA.map((itemA: any, index: number) => {
														const itemB = capexBreakdown.solutionB.find((b: any) => b.name === itemA.name);
														const difference = (itemB?.value || 0) - itemA.value;
														
														return (
															<TableRow
																key={index}
																className="hover:bg-gray-50 transition-all duration-200"
																style={{ height: "28px", minHeight: "28px" }}
															>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden">
																	<div className="overflow-hidden">
																		<div className="text-xs font-medium text-gray-900 truncate">
																			{itemA.name}
																		</div>
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-blue-900">
																		{formatCurrency(itemA.value)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-green-900">
																		{formatCurrency(itemB?.value || 0)}
																	</div>
																</TableCell>
																<TableCell className={`text-center font-mono font-semibold py-3 ${getDifferenceColor(difference)}`}>
																	{difference < 0 ? `-${formatCurrency(Math.abs(difference))}` : `+${formatCurrency(difference)}`}
																</TableCell>
															</TableRow>
														);
													})
												) : (
													// Single mode - show only solution A
													capexBreakdown.solutionA.map((item: any, index: number) => {
														const getValueRange = (value: number) => {
															if (value >= 1000000) return "Major (>1M)";
															if (value >= 100000) return "Medium (100K-1M)";
															if (value >= 10000) return "Small (10K-100K)";
															if (value >= 1000) return "Minor (1K-10K)";
															return "Micro (<1K)";
														};

														return (
															<TableRow
																key={index}
																className="hover:bg-gray-50 transition-all duration-200"
																style={{ height: "28px", minHeight: "28px" }}
															>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden">
																	<div className="overflow-hidden">
																		<div className="text-xs font-medium text-gray-900 truncate">
																			{item.name}
																		</div>
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-green-900">
																		{formatCurrency(item.value)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-gray-900">
																		{item.percentage.toFixed(1)}%
																	</div>
																</TableCell>
															</TableRow>
														);
													})
												)}
											</TableBody>
										</Table>
									</div>
								</div>
							)}
						</div>

						{/* CAPEX Insights with Value Ranges */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div className="bg-green-50 p-3 rounded-lg border border-green-200">
								<h5 className="font-medium text-green-900 mb-2 text-xs">
									CAPEX Summary
								</h5>
								<div className="space-y-1 text-xs">
									{comparisonMode === "compare" ? (
										<>
											<div className="flex justify-between">
												<span className="text-green-700">{solutionAName} Total:</span>
												<span className="font-semibold text-green-900">
													{formatCurrency(solutionData.solutionA.totalCapex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-green-700">{solutionBName} Total:</span>
												<span className="font-semibold text-green-900">
													{formatCurrency(solutionData.solutionB.totalCapex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-green-700">Total Difference:</span>
												<span className={`font-semibold ${
													solutionData.solutionA.totalCapex > solutionData.solutionB.totalCapex 
														? 'text-red-600' 
														: 'text-green-600'
												}`}>
													{formatCurrency(Math.abs(solutionData.solutionA.totalCapex - solutionData.solutionB.totalCapex))}
													{solutionData.solutionA.totalCapex > solutionData.solutionB.totalCapex ? ' higher' : ' lower'}
												</span>
											</div>
										</>
									) : (
										<>
											<div className="flex justify-between">
												<span className="text-green-700">Total CAPEX:</span>
												<span className="font-semibold text-green-900">
													{formatCurrency(solutionData.solutionA.totalCapex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-green-700">
													Major Components (&gt;1M):
												</span>
												<span className="font-semibold text-green-900">
													{
														capexBreakdown.solutionA.filter((item: any) => item.value >= 1000000)
															.length
													}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-green-700">
													Minor Components (&lt;100K):
												</span>
												<span className="font-semibold text-green-900">
													{
														capexBreakdown.solutionA.filter((item: any) => item.value < 100000)
															.length
													}
												</span>
											</div>
										</>
									)}
								</div>
							</div>

							<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
								<h5 className="font-medium text-blue-900 mb-2 text-xs">
									{comparisonMode === "compare" ? "CAPEX Comparison" : "Top CAPEX Components"}
								</h5>
								<div className="space-y-1 text-xs max-h-24 overflow-y-auto">
									{comparisonMode === "compare" ? (
										// Show comparison insights
										<>
											<div className="flex justify-between">
												<span className="text-blue-700">Higher CAPEX:</span>
												<span className="font-semibold text-blue-900">
													{solutionData.solutionA.totalCapex > solutionData.solutionB.totalCapex 
														? solutionAName : solutionBName}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Lower CAPEX:</span>
												<span className="font-semibold text-blue-900">
													{solutionData.solutionA.totalCapex < solutionData.solutionB.totalCapex 
														? solutionAName : solutionBName}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Savings:</span>
												<span className="font-semibold text-green-600">
													{formatCurrency(Math.abs(solutionData.solutionA.totalCapex - solutionData.solutionB.totalCapex))}
												</span>
											</div>
										</>
									) : (
										// Show top components for single solution
										capexBreakdown.solutionA.slice(0, 5).map((item: any, index: number) => (
											<div key={index} className="flex justify-between">
												<span className="text-blue-700 truncate">
													{index + 1}. {item.name}
												</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(item.value)}
												</span>
											</div>
										))
									)}
								</div>
							</div>
						</div>
					</div>
				);
			case "tco":
				return (
					<div className="space-y-3">
						{/* TCO Analysis Chart/Table */}
						<div className="border p-3 rounded-lg relative">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<h4 className="text-xs font-medium text-gray-900">
										Total Cost of Ownership Analysis
									</h4>
									<div className="flex items-center gap-2">
										<span className="text-xs text-gray-600">CAPEX View:</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setIsTcoWithInitialCapex(false)}
											style={{
												backgroundColor: !isTcoWithInitialCapex ? '#10b981' : '#f3f4f6',
												color: !isTcoWithInitialCapex ? 'white' : '#374151',
												borderColor: !isTcoWithInitialCapex ? '#10b981' : '#d1d5db'
											}}
											className="h-6 px-2 text-xs"
										>
											Amortized
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setIsTcoWithInitialCapex(true)}
											style={{
												backgroundColor: isTcoWithInitialCapex ? '#10b981' : '#f3f4f6',
												color: isTcoWithInitialCapex ? 'white' : '#374151',
												borderColor: isTcoWithInitialCapex ? '#10b981' : '#d1d5db'
											}}
											className="h-6 px-2 text-xs"
										>
											Year 0
										</Button>
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsTableView(!isTableView)}
									className="h-6 w-6 p-0"
								>
									{isTableView ? (
										<BarChart3 className="h-3 w-3" />
									) : (
										<TableIcon className="h-3 w-3" />
									)}
								</Button>
							</div>
							
							{!isTableView ? (
								<div style={{ width: "100%", height: "250px" }}>
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={tcoData}
											margin={{ top: 15, right: 25, left: 15, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="year" tick={{ fontSize: 10 }} />
											<YAxis 
												tick={{ fontSize: 10 }}
												tickFormatter={(value) => formatCurrency(value)}
											/>
											<Tooltip
												formatter={(value, name) => [
													formatCurrency(Number(value)),
													name,
												]}
											/>
											<Legend wrapperStyle={{ fontSize: "10px" }} />
											{comparisonMode === "compare" ? (
												<>
													<Bar
														dataKey="annualOpexA"
														fill={getChartColors('opex', 'A')}
														name={`${solutionAName} - Annual OPEX`}
													/>
													<Bar
														dataKey="annualOpexB"
														fill={getChartColors('opex', 'B')}
														name={`${solutionBName} - Annual OPEX`}
													/>
													{!isTcoWithInitialCapex ? (
														<>
															<Bar
																dataKey="capexAmortizedA"
																fill={getChartColors('capex', 'A')}
																name={`${solutionAName} - Annual CAPEX`}
															/>
															<Bar
																dataKey="capexAmortizedB"
																fill={getChartColors('capex', 'B')}
																name={`${solutionBName} - Annual CAPEX`}
															/>
														</>
													) : (
														<>
															<Bar
																dataKey="initialCapexA"
																fill={getChartColors('capex', 'A')}
																name={`${solutionAName} - Initial CAPEX`}
															/>
															<Bar
																dataKey="initialCapexB"
																fill={getChartColors('capex', 'B')}
																name={`${solutionBName} - Initial CAPEX`}
															/>
														</>
													)}
													<Bar
														dataKey="cumulativeTotalCostA"
														fill={getChartColors('cumulative', 'A')}
														name={`${solutionAName} - Cumulative TCO`}
													/>
													<Bar
														dataKey="cumulativeTotalCostB"
														fill={getChartColors('cumulative', 'B')}
														name={`${solutionBName} - Cumulative TCO`}
													/>
												</>
											) : (
												<>
													<Bar
														dataKey="annualOpexA"
														fill={getChartColors('opex', 'A')}
														name="Annual OPEX"
													/>
													{!isTcoWithInitialCapex ? (
														<Bar
															dataKey="capexAmortizedA"
															fill={getChartColors('capex', 'A')}
															name="Annual CAPEX (Amortized)"
														/>
													) : (
														<Bar
															dataKey="initialCapexA"
															fill={getChartColors('capex', 'A')}
															name="Initial CAPEX"
														/>
													)}
													<Bar
														dataKey="totalYearlyCostA"
														fill={getChartColors('total', 'A')}
														name="Total Yearly Cost"
													/>
													<Bar
														dataKey="cumulativeTotalCostA"
														fill={getChartColors('cumulative', 'A')}
														name="Cumulative TCO"
													/>
												</>
											)}
										</BarChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className="border rounded-lg overflow-hidden">
									<div className="bg-gray-50 px-3 py-2 border-b">
										<h5 className="font-medium text-gray-900 text-xs">
											TCO Yearly Breakdown {isTcoWithInitialCapex ? "(CAPEX in Year 0)" : "(CAPEX Amortized)"}
										</h5>
									</div>
									<div className="max-h-40 overflow-y-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-left">
														Year
													</TableHead>
													{comparisonMode === "compare" ? (
														<>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionAName} OPEX
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionBName} OPEX
															</TableHead>
															{!isTcoWithInitialCapex && (
																<>
																	<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																		{solutionAName} CAPEX
																	</TableHead>
																	<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																		{solutionBName} CAPEX
																	</TableHead>
																</>
															)}
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionAName} TCO
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																{solutionBName} TCO
															</TableHead>
														</>
													) : (
														<>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Annual OPEX
															</TableHead>
															{!isTcoWithInitialCapex && (
																<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	CAPEX (Amortized)
																</TableHead>
															)}
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Total Yearly
															</TableHead>
															<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																Cumulative TCO
															</TableHead>
														</>
													)}
												</TableRow>
											</TableHeader>
											<TableBody className="bg-white divide-y divide-gray-200">
												{tcoData.map((item: any, index: number) => (
													<TableRow
														key={index}
														className="hover:bg-gray-50 transition-all duration-200"
														style={{ height: "28px", minHeight: "28px" }}
													>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden">
															<div className="text-xs font-medium text-gray-900">
																{item.year}
															</div>
														</TableCell>
														{comparisonMode === "compare" ? (
															<>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-blue-900">
																		{formatCurrency(item.annualOpexA)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-green-900">
																		{formatCurrency(item.annualOpexB)}
																	</div>
																</TableCell>
																{!isTcoWithInitialCapex && (
																	<>
																		<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																			<div className="text-xs font-semibold text-yellow-900">
																				{formatCurrency(item.capexAmortizedA)}
																			</div>
																		</TableCell>
																		<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																			<div className="text-xs font-semibold text-purple-900">
																				{formatCurrency(item.capexAmortizedB)}
																			</div>
																		</TableCell>
																	</>
																)}
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-red-900">
																		{formatCurrency(item.cumulativeTotalCostA)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-cyan-900">
																		{formatCurrency(item.cumulativeTotalCostB)}
																	</div>
																</TableCell>
															</>
														) : (
															<>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-blue-900">
																		{formatCurrency(item.annualOpexA)}
																	</div>
																</TableCell>
																{!isTcoWithInitialCapex && (
																	<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																		<div className="text-xs font-semibold text-green-900">
																			{formatCurrency(item.capexAmortizedA)}
																		</div>
																	</TableCell>
																)}
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-yellow-900">
																		{formatCurrency(item.totalYearlyCostA)}
																	</div>
																</TableCell>
																<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																	<div className="text-xs font-semibold text-purple-900">
																		{formatCurrency(item.cumulativeTotalCostA)}
																	</div>
																</TableCell>
															</>
														)}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</div>
							)}
						</div>

						{/* TCO Insights */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
								<h5 className="font-medium text-purple-900 mb-2 text-xs">
									TCO Summary
								</h5>
								<div className="space-y-1 text-xs">
									{comparisonMode === "compare" ? (
										<>
											<div className="flex justify-between">
												<span className="text-purple-700">{solutionAName} TCO:</span>
												<span className="font-semibold text-purple-900">
													{formatCurrency(solutionData.solutionA.totalTco)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-purple-700">{solutionBName} TCO:</span>
												<span className="font-semibold text-purple-900">
													{formatCurrency(solutionData.solutionB.totalTco)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-purple-700">TCO Difference:</span>
												<span className={`font-semibold ${
													solutionData.solutionA.totalTco > solutionData.solutionB.totalTco 
														? 'text-red-600' 
														: 'text-green-600'
												}`}>
													{formatCurrency(Math.abs(solutionData.solutionA.totalTco - solutionData.solutionB.totalTco))}
													{solutionData.solutionA.totalTco > solutionData.solutionB.totalTco ? ' higher' : ' lower'}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-purple-700">Savings:</span>
												<span className="font-semibold text-green-600">
													{formatCurrency(Math.abs(solutionData.solutionA.totalTco - solutionData.solutionB.totalTco))}
												</span>
											</div>
										</>
									) : (
										<>
											<div className="flex justify-between">
												<span className="text-purple-700">Total TCO:</span>
												<span className="font-semibold text-purple-900">
													{formatCurrency(solutionData.solutionA.totalTco)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-purple-700">Annual TCO:</span>
												<span className="font-semibold text-purple-900">
													{formatCurrency(solutionData.solutionA.totalTco / plannedYears)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-purple-700">OPEX % of TCO:</span>
												<span className="font-semibold text-purple-900">
													{solutionData.solutionA.totalTco > 0
														? ((solutionData.solutionA.lifetimeOpex / solutionData.solutionA.totalTco) * 100).toFixed(1)
														: 0}
													%
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-purple-700">CAPEX % of TCO:</span>
												<span className="font-semibold text-purple-900">
													{solutionData.solutionA.totalTco > 0
														? ((solutionData.solutionA.totalCapex / solutionData.solutionA.totalTco) * 100).toFixed(1)
														: 0}
													%
												</span>
											</div>
										</>
									)}
								</div>
							</div>

							<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
								<h5 className="font-medium text-blue-900 mb-2 text-xs">
									{comparisonMode === "compare" ? "Cost Comparison" : "Cost Breakdown"}
								</h5>
								<div className="space-y-1 text-xs">
									{comparisonMode === "compare" ? (
										<>
											<div className="flex justify-between">
												<span className="text-blue-700">Higher Cost:</span>
												<span className="font-semibold text-blue-900">
													{solutionData.solutionA.totalTco > solutionData.solutionB.totalTco 
														? solutionAName : solutionBName}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Lower Cost:</span>
												<span className="font-semibold text-blue-900">
													{solutionData.solutionA.totalTco < solutionData.solutionB.totalTco 
														? solutionAName : solutionBName}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">ROI Impact:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(Math.abs(solutionData.solutionA.totalTco - solutionData.solutionB.totalTco))}
												</span>
											</div>
										</>
									) : (
										<>
											<div className="flex justify-between">
												<span className="text-blue-700">Total CAPEX:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(solutionData.solutionA.totalCapex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Lifetime OPEX:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(solutionData.solutionA.lifetimeOpex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Annual OPEX:</span>
												<span className="font-semibold text-blue-900">
													{formatCurrency(solutionData.solutionA.annualOpex)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-700">Planned Years:</span>
												<span className="font-semibold text-blue-900">
													{plannedYears}
												</span>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<Card className="p-3 gap-1">
			{/* Summary Cards */}
			<div className={`grid gap-2 mb-3 ${comparisonMode === "compare" ? "grid-cols-6" : "grid-cols-3"}`}>
				{comparisonMode === "compare" ? (
					<>
						{/* Solution A Summary */}
						<div className="bg-purple-50 p-2 rounded border border-purple-200">
							<div className="text-purple-600 text-xs font-medium">{solutionAName} TCO</div>
							<div className="text-sm font-bold text-purple-800">
								{formatCurrency(solutionData.solutionA.totalTco)}
							</div>
							<div className="text-purple-600 text-xs">lifetime cost</div>
						</div>

						<div className="bg-green-50 p-2 rounded border border-green-200">
							<div className="text-green-600 text-xs font-medium">{solutionAName} CAPEX</div>
							<div className="text-sm font-bold text-green-800">
								{formatCurrency(solutionData.solutionA.totalCapex)}
							</div>
							<div className="text-green-600 text-xs">one-time investment</div>
						</div>

						<div className="bg-blue-50 p-2 rounded border border-blue-200">
							<div className="text-blue-600 text-xs font-medium">{solutionAName} Annual OPEX</div>
							<div className="text-sm font-bold text-blue-800">
								{formatCurrency(solutionData.solutionA.annualOpex)}
							</div>
							<div className="text-blue-600 text-xs">per year</div>
						</div>

						{/* Solution B Summary */}
						<div className="bg-purple-50 p-2 rounded border border-purple-200">
							<div className="text-purple-600 text-xs font-medium">{solutionBName} TCO</div>
							<div className="text-sm font-bold text-purple-800">
								{formatCurrency(solutionData.solutionB.totalTco)}
							</div>
							<div className="text-purple-600 text-xs">lifetime cost</div>
						</div>

						<div className="bg-green-50 p-2 rounded border border-green-200">
							<div className="text-green-600 text-xs font-medium">{solutionBName} CAPEX</div>
							<div className="text-sm font-bold text-green-800">
								{formatCurrency(solutionData.solutionB.totalCapex)}
							</div>
							<div className="text-green-600 text-xs">one-time investment</div>
						</div>

						<div className="bg-blue-50 p-2 rounded border border-blue-200">
							<div className="text-blue-600 text-xs font-medium">{solutionBName} Annual OPEX</div>
							<div className="text-sm font-bold text-blue-800">
								{formatCurrency(solutionData.solutionB.annualOpex)}
							</div>
							<div className="text-blue-600 text-xs">per year</div>
						</div>
					</>
				) : (
					<>
						<div className="bg-purple-50 p-2 rounded border border-purple-200">
							<div className="text-purple-600 text-xs font-medium">Total TCO</div>
							<div className="text-sm font-bold text-purple-800">
								{formatCurrency(solutionData.solutionA.totalTco)}
							</div>
							<div className="text-purple-600 text-xs">lifetime cost</div>
						</div>

						<div className="bg-green-50 p-2 rounded border border-green-200">
							<div className="text-green-600 text-xs font-medium">Total CAPEX</div>
							<div className="text-sm font-bold text-green-800">
								{formatCurrency(solutionData.solutionA.totalCapex)}
							</div>
							<div className="text-green-600 text-xs">one-time investment</div>
						</div>
						<div className="bg-blue-50 p-2 rounded border border-blue-200">
							<div className="text-blue-600 text-xs font-medium">Annual OPEX</div>
							<div className="text-sm font-bold text-blue-800">
								{formatCurrency(solutionData.solutionA.annualOpex)}
							</div>
							<div className="text-blue-600 text-xs">per year</div>
						</div>
					</>
				)}
			</div>

			{/* Comparison Summary Card - Only show in compare mode */}
			{comparisonMode === "compare" && (
				<div className="bg-amber-50 p-3 rounded border border-amber-200 mb-3">
					<h4 className="text-sm font-medium text-amber-900 mb-2">Comparison Summary</h4>
					<div className="grid grid-cols-3 gap-4 text-xs">
						<div className="text-center">
							<div className="text-amber-700">Total Cost Difference</div>
							<div className="font-bold text-lg text-gray-800">
								{formatCurrency(Math.abs(solutionData.solutionA.totalTco - solutionData.solutionB.totalTco))}
							</div>
							<div className="text-amber-600">
								{solutionData.solutionA.totalTco > solutionData.solutionB.totalTco ? `${solutionAName} costs more` : `${solutionBName} costs more`}
							</div>
						</div>
						<div className="text-center">
							<div className="text-amber-700">Initial Investment Difference</div>
							<div className="font-bold text-lg text-gray-800">
								{formatCurrency(Math.abs(solutionData.solutionA.totalCapex - solutionData.solutionB.totalCapex))}
							</div>
							<div className="text-amber-600">
								{solutionData.solutionA.totalCapex > solutionData.solutionB.totalCapex ? `${solutionAName} costs more` : `${solutionBName} costs more`}
							</div>
						</div>
						<div className="text-center">
							<div className="text-amber-700">Yearly Operating Cost Difference</div>
							<div className="font-bold text-lg text-gray-800">
								{formatCurrency(Math.abs(solutionData.solutionA.annualOpex - solutionData.solutionB.annualOpex))}
							</div>
							<div className="text-amber-600">
								{solutionData.solutionA.annualOpex > solutionData.solutionB.annualOpex ? `${solutionAName} costs more` : `${solutionBName} costs more`}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Tab Navigation */}
			<div className="mb-3">
				<Tabs value={selectedChartTab} onValueChange={setSelectedChartTab}>
					<TabsList className="flex w-full overflow-x-auto">
						{chartTabs.map((tab) => (
							<TabsTrigger key={tab.id} value={tab.id} className="text-xs whitespace-nowrap">
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			{/* Chart Content */}
			{opexData.length > 0 && renderChart()}
		</Card>
	);
}

