"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ValueCalculatorMain from "./value-calculator-main";
import { ValueCalculatorProgress } from "./value-calculator-progress";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	BarChart3,
	TrendingUp,
	DollarSign,
	Calculator,
	Settings,
	Package,
	Activity,
} from "lucide-react";

// Separate Charts Section Component
function ChartsSection({
	calc1Result,
	calc2Result,
	solution1Name,
	solution2Name,
	advancedConfig,
}: {
	calc1Result: any;
	calc2Result: any;
	solution1Name?: string;
	solution2Name?: string;
	advancedConfig?: any;
}) {
	const processComparisonData = (calc1Result: any, calc2Result: any) => {
		// Handle the actual API response format - flat objects with properties like cooling_equipment_capex
		const allKeys = new Set([
			...Object.keys(calc1Result || {}),
			...Object.keys(calc2Result || {}),
		]);

		const tableData = Array.from(allKeys).map((key) => {
			const val1 = calc1Result?.[key] ?? "";
			const val2 = calc2Result?.[key] ?? "";

			// Convert to numbers for comparison if possible
			const num1 = typeof val1 === "number" ? val1 : parseFloat(val1);
			const num2 = typeof val2 === "number" ? val2 : parseFloat(val2);

			const isNumeric = !isNaN(num1) && !isNaN(num2);
			const difference = isNumeric ? num2 - num1 : null;
			const percentageDiff =
				isNumeric && num1 !== 0 ? ((num2 - num1) / num1) * 100 : null;

			return {
				key,
				solution1: val1,
				solution2: val2,
				difference,
				percentageDiff,
				isNumeric,
				isDifferent: val1 !== val2,
			};
		});

		// Filter out IT-related metrics if IT Configuration is not enabled
		const filteredTableData = tableData.filter((item) => {
			if (advancedConfig?.includeITCost !== "yes") {
				// Hide IT-related metrics when IT costs are not included
				const key = item.key.toLowerCase();
				return (
					!key.includes("it_equipment_capex") &&
					!key.includes("annual_it_maintenance") &&
					!key.includes("tco_including_it")
				);
			}
			return true; // Show all metrics when IT costs are included
		});

		// Prepare chart data for numeric values
		const chartData = filteredTableData
			.filter((item) => item.isNumeric)
			.map((item) => ({
				metric: item.key,
				solution1: item.solution1,
				solution2: item.solution2,
				difference: item.difference || 0,
				percentageDiff: item.percentageDiff || 0,
			}));

		return { tableData: filteredTableData, chartData };
	};

	const comparisonData = processComparisonData(calc1Result, calc2Result);

	// Default solution names if not provided
	const sol1Name = solution1Name || "Solution 1";
	const sol2Name = solution2Name || "Solution 2";

	// Helper function to get icon and category for each metric
	const getMetricInfo = (key: string) => {
		const keyLower = key.toLowerCase();

		if (keyLower.includes("capex") || keyLower.includes("total_capex")) {
			return {
				icon: DollarSign,
				category: "Capital Expenditure",
				color: "text-blue-600",
			};
		} else if (keyLower.includes("opex") || keyLower.includes("maintenance")) {
			return {
				icon: Settings,
				category: "Operational Costs",
				color: "text-orange-600",
			};
		} else if (keyLower.includes("tco")) {
			return {
				icon: Calculator,
				category: "Total Cost",
				color: "text-green-600",
			};
		} else if (keyLower.includes("cooling")) {
			return {
				icon: Activity,
				category: "Cooling System",
				color: "text-cyan-600",
			};
		} else if (keyLower.includes("it_equipment")) {
			return {
				icon: Package,
				category: "IT Equipment",
				color: "text-purple-600",
			};
		} else if (keyLower.includes("annual")) {
			return {
				icon: TrendingUp,
				category: "Annual Costs",
				color: "text-indigo-600",
			};
		} else {
			return { icon: BarChart3, category: "Other", color: "text-gray-600" };
		}
	};

	// Helper function to format metric names
	const formatMetricName = (key: string) => {
		return key
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<div className="space-y-6">
			{/* Detailed Comparison Table */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<BarChart3 className="h-4 w-4" />
						Detailed Financial Comparison
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<div className="rounded-md border min-w-[600px]">
							<div className="bg-muted/50 px-4 py-3 border-b">
								<div className="grid grid-cols-5 gap-4 text-xs font-medium text-muted-foreground">
									<div>Metric</div>
									<div className="text-center">{sol1Name}</div>
									<div className="text-center">{sol2Name}</div>
									<div className="text-center">Difference</div>
									<div className="text-center">% Change</div>
								</div>
							</div>
							<div className="divide-y">
								{comparisonData.tableData.map((item, index) => {
									const metricInfo = getMetricInfo(item.key);
									const IconComponent = metricInfo.icon;

									return (
										<div
											key={index}
											className="px-4 py-3 hover:bg-muted/30 transition-colors"
										>
											<div className="grid grid-cols-5 gap-4 items-center">
												<div className="flex items-center gap-3">
													<div
														className={`p-1.5 rounded-md bg-muted ${metricInfo.color}`}
													>
														<IconComponent className="h-3 w-3" />
													</div>
													<div>
														<div className="font-medium text-sm">
															{formatMetricName(item.key)}
														</div>
													</div>
												</div>
												<div className="text-center">
													<div className="font-semibold text-sm">
														{typeof item.solution1 === "number"
															? item.solution1.toLocaleString()
															: item.solution1}
													</div>
												</div>
												<div className="text-center">
													<div className="font-semibold text-sm">
														{typeof item.solution2 === "number"
															? item.solution2.toLocaleString()
															: item.solution2}
													</div>
												</div>
												<div className="text-center">
													<div className="font-semibold text-sm">
														{item.difference !== null
															? item.difference.toLocaleString()
															: "-"}
													</div>
												</div>
												<div className="text-center">
													<div className="font-semibold text-sm">
														{item.percentageDiff !== null
															? `${item.percentageDiff.toFixed(1)}%`
															: "-"}
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Comparison Chart */}
			{comparisonData.chartData.length > 0 && (
				<Card className="overflow-hidden">
					<CardHeader className="border-b">
						<CardTitle className="text-base flex items-center gap-2">
							<TrendingUp className="h-4 w-4" />
							Financial Overview Comparison
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<ResponsiveContainer width="100%" height={450}>
							<BarChart
								data={comparisonData.chartData}
								margin={{ top: 30, right: 40, left: 20, bottom: 40 }}
							>
								<defs>
									{/* Primary bar gradients */}
									<linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#1f2937" stopOpacity={1} />
										<stop offset="50%" stopColor="#374151" stopOpacity={0.9} />
										<stop offset="100%" stopColor="#4b5563" stopOpacity={0.8} />
									</linearGradient>

									<linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#dc2626" stopOpacity={1} />
										<stop offset="50%" stopColor="#ef4444" stopOpacity={0.9} />
										<stop offset="100%" stopColor="#f87171" stopOpacity={0.8} />
									</linearGradient>

									{/* Background pattern */}
									<pattern
										id="gridPattern"
										x="0"
										y="0"
										width="20"
										height="20"
										patternUnits="userSpaceOnUse"
									>
										<rect width="20" height="20" fill="#f9fafb" />
										<path
											d="M 20 0 L 0 0 0 20"
											fill="none"
											stroke="#e5e7eb"
											strokeWidth="0.5"
										/>
									</pattern>

									{/* Shadow filter */}
									<filter
										id="shadow"
										x="-20%"
										y="-20%"
										width="140%"
										height="140%"
									>
										<feDropShadow
											dx="0"
											dy="4"
											stdDeviation="8"
											floodColor="#000000"
											floodOpacity="0.1"
										/>
									</filter>
								</defs>

								{/* Background */}
								<rect
									x="0"
									y="0"
									width="100%"
									height="100%"
									fill="url(#gridPattern)"
									opacity="0.3"
								/>

								<CartesianGrid
									strokeDasharray="4 4"
									stroke="#d1d5db"
									strokeWidth={0.8}
									vertical={false}
									opacity={0.6}
								/>

								<XAxis
									dataKey="metric"
									angle={0}
									textAnchor="middle"
									height={80}
									fontSize={11}
									interval={0}
									tick={{
										fill: "#4b5563",
										fontSize: 10,
										fontWeight: "500",
									}}
									axisLine={{
										stroke: "#9ca3af",
										strokeWidth: 1.5,
									}}
									tickLine={{
										stroke: "#9ca3af",
										strokeWidth: 1,
									}}
									tickFormatter={(value) =>
										value
											.split("_")
											.map(
												(word: string) =>
													word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")
									}
								/>

								<YAxis
									width={70}
									tickFormatter={(value) => {
										if (value >= 1000000) {
											return `$${(value / 1000000).toFixed(1)}M`;
										} else if (value >= 1000) {
											return `$${(value / 1000).toFixed(1)}K`;
										}
										return `$${value.toLocaleString()}`;
									}}
									tick={{
										fill: "#4b5563",
										fontSize: 10,
										fontWeight: "500",
									}}
									axisLine={{
										stroke: "#9ca3af",
										strokeWidth: 1.5,
									}}
									tickLine={{
										stroke: "#9ca3af",
										strokeWidth: 1,
									}}
								/>

								<Tooltip
									contentStyle={{
										backgroundColor: "#ffffff",
										border: "2px solid #e5e7eb",
										borderRadius: "12px",
										boxShadow:
											"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
										fontSize: "12px",
										padding: "12px 16px",
										backdropFilter: "blur(10px)",
										borderWidth: "1px",
									}}
									labelStyle={{
										color: "#1f2937",
										fontWeight: "700",
										fontSize: "12px",
										textTransform: "capitalize",
										marginBottom: "4px",
									}}
									formatter={(value, name) => [
										typeof value === "number"
											? `$${value.toLocaleString()}`
											: value,
										name === "solution1" ? sol1Name : sol2Name,
									]}
									cursor={{
										fill: "rgba(0, 0, 0, 0.08)",
										stroke: "#6b7280",
										strokeWidth: 1,
										strokeDasharray: "3 3",
									}}
								/>

								<Bar
									dataKey="solution1"
									fill="url(#barGradient1)"
									radius={[8, 8, 0, 0]}
									maxBarSize={70}
									filter="url(#shadow)"
									name={sol1Name}
								/>
								<Bar
									dataKey="solution2"
									fill="url(#barGradient2)"
									radius={[8, 8, 0, 0]}
									maxBarSize={70}
									filter="url(#shadow)"
									name={sol2Name}
								/>
							</BarChart>
						</ResponsiveContainer>

						{/* Chart Legend/Info */}
						<div className="mt-4 flex items-center justify-between text-xs text-gray-500">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-gradient-to-b from-gray-700 to-gray-500 rounded-sm"></div>
									<span>{sol1Name}</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-gradient-to-b from-red-700 to-red-500 rounded-sm"></div>
									<span>{sol2Name}</span>
								</div>
							</div>
							<div className="text-right">
								<span className="font-medium">
									Total Metrics: {comparisonData.chartData.length}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default function ValueCalculatorCompareWrapper({
	onBack,
}: { onBack?: () => void } = {}) {
	const [calc1Result, setCalc1Result] = useState<any>(null);
	const [calc2Result, setCalc2Result] = useState<any>(null);
	const [calc1Valid, setCalc1Valid] = useState(false);
	const [calc2Valid, setCalc2Valid] = useState(false);
	const calc1Ref = useRef<any>(null);
	const calc2Ref = useRef<any>(null);

	// Track industry and technology from first calculator
	const [sharedIndustry, setSharedIndustry] = useState("");
	const [sharedTechnology, setSharedTechnology] = useState("");

	// Track solution names
	const [solution1Name, setSolution1Name] = useState("");
	const [solution2Name, setSolution2Name] = useState("");

	// Track advanced configuration
	const [advancedConfig, setAdvancedConfig] = useState<any>(null);

	// Handler to receive calculation result and validity from ValueCalculatorMain
	// Store results in refs, update state in useEffect to avoid React warning
	const calc1ResultBuffer = useRef<{ result: any; valid: boolean } | null>(
		null
	);
	const calc2ResultBuffer = useRef<{ result: any; valid: boolean } | null>(
		null
	);

	const handleCalc1Result = (result: any, valid: boolean) => {
		calc1ResultBuffer.current = { result, valid };
	};
	const handleCalc2Result = (result: any, valid: boolean) => {
		calc2ResultBuffer.current = { result, valid };
	};

	const handleSolution1Name = (name: string) => {
		setSolution1Name(name);
	};

	const handleSolution2Name = (name: string) => {
		setSolution2Name(name);
	};

	const handleAdvancedConfig = (config: any) => {
		setAdvancedConfig(config);
	};

	// Transfer buffered results to state to avoid React warnings
	useEffect(() => {
		const interval = setInterval(() => {
			if (calc1ResultBuffer.current) {
				setCalc1Result(calc1ResultBuffer.current.result);
				setCalc1Valid(calc1ResultBuffer.current.valid);
				calc1ResultBuffer.current = null;
			}
			if (calc2ResultBuffer.current) {
				setCalc2Result(calc2ResultBuffer.current.result);
				setCalc2Valid(calc2ResultBuffer.current.valid);
				calc2ResultBuffer.current = null;
			}
		}, 100);

		return () => clearInterval(interval);
	}, []);

	// Auto-trigger calculations when both calculators are valid
	useEffect(() => {
		if (calc1Valid && calc2Valid) {
			// Small delay to ensure components are fully mounted
			setTimeout(() => {
				if (calc1Ref.current && calc1Ref.current.runCalculation) {
					calc1Ref.current.runCalculation();
				}
				if (calc2Ref.current && calc2Ref.current.runCalculation) {
					calc2Ref.current.runCalculation();
				}
			}, 100);
		}
	}, [calc1Valid, calc2Valid]);

	return (
		<div className="flex flex-col gap-8">
			{/* Single Progress Indicator for Compare Mode */}
			<div className="relative">
				<ValueCalculatorProgress
					currentStep={4}
					selectedIndustry={sharedIndustry}
					selectedTechnology={sharedTechnology}
					selectedSolution=""
					selectedSolutionVariant=""
					isConfigurationComplete={calc1Valid && calc2Valid}
				/>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						// Trigger calculation in both calculators before going back
						if (calc1Ref.current && calc1Ref.current.runCalculation) {
							calc1Ref.current.runCalculation();
						}
						if (calc2Ref.current && calc2Ref.current.runCalculation) {
							calc2Ref.current.runCalculation();
						}
						if (onBack) {
							onBack();
						}
					}}
					className="absolute top-4 right-4 h-8 px-3 text-xs"
				>
					← Back to Single Calculator
				</Button>
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1 min-w-0">
					<ValueCalculatorMain
						ref={calc1Ref}
						hideCompareButton
						onCalculationResult={handleCalc1Result}
						isCompareMode
						onCompareValidityChange={setCalc1Valid}
						hideResultsSection={true}
						hideProgress={true}
						onIndustryChange={setSharedIndustry}
						onTechnologyChange={setSharedTechnology}
						onSolutionNameChange={handleSolution1Name}
						onAdvancedConfigChange={handleAdvancedConfig}
						isFirstCalculator={true}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<ValueCalculatorMain
						ref={calc2Ref}
						hideCompareButton
						onCalculationResult={handleCalc2Result}
						isCompareMode
						onCompareValidityChange={setCalc2Valid}
						hideResultsSection={true}
						hideProgress={true}
						inheritedIndustry={sharedIndustry}
						inheritedTechnology={sharedTechnology}
						onSolutionNameChange={handleSolution2Name}
						onAdvancedConfigChange={handleAdvancedConfig}
						isSecondCalculator={true}
					/>
				</div>
			</div>

			{/* Charts Section - Only show when both calculators have results */}
			{(() => {
				return calc1Valid && calc2Valid && calc1Result && calc2Result ? (
					<ChartsSection
						calc1Result={calc1Result}
						calc2Result={calc2Result}
						solution1Name={solution1Name || "Solution 1"}
						solution2Name={solution2Name || "Solution 2"}
						advancedConfig={advancedConfig}
					/>
				) : (
					<></>
				);
			})()}
		</div>
	);
}
