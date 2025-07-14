"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ResponsiveContainer,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Bar,
} from "recharts";
import { CalculationResults, AdvancedConfig } from "../types/types";
import {
	DollarSign,
	Calculator,
	TrendingUp,
	Settings,
	Package,
	Wrench,
	Activity,
	BarChart3,
	Zap,
} from "lucide-react";
import { SaveResultsDialog } from "./save-results-dialog";
import { useState } from "react";

interface ResultsSectionProps {
	results: CalculationResults;
	showResults: boolean;
	calculationResult?: any;
	advancedConfig?: AdvancedConfig;
	inputParameters?: any; // Add this new prop for input parameters
}

export function ResultsSection({
	results,
	showResults,
	calculationResult,
	advancedConfig,
	inputParameters,
}: ResultsSectionProps) {
	if (!showResults) return null;

	// Process individual calculation result data
	const processIndividualData = (result: any) => {
		if (!result) return { tableData: [], chartData: [] };

		const tableData = Object.entries(result).map(([key, value]) => ({
			key,
			value,
			isNumeric: typeof value === "number",
			formattedValue:
				typeof value === "number"
					? (value as number).toLocaleString()
					: String(value),
		}));

		const chartData = tableData
			.filter((item) => item.isNumeric)
			.map((item) => ({
				metric: item.key,
				value: item.value as number,
			}));

		return { tableData, chartData };
	};

	const individualData = processIndividualData(calculationResult);

	// Check if IT costs are included in the calculation
	const isITCostIncluded = advancedConfig?.includeITCost === "yes";

	// Filter table data to exclude IT-related metrics if IT costs are not included
	const filteredTableData = individualData.tableData.filter((item) => {
		if (!isITCostIncluded) {
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

	// Filter chart data accordingly
	const filteredChartData = individualData.chartData.filter((item) => {
		if (!isITCostIncluded) {
			const key = item.metric.toLowerCase();
			return (
				!key.includes("it_equipment_capex") &&
				!key.includes("annual_it_maintenance") &&
				!key.includes("tco_including_it")
			);
		}
		return true;
	});

	// Use filtered data
	const displayData = {
		tableData: filteredTableData,
		chartData: filteredChartData,
	};

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

	// Helper function to format currency values
	const formatCurrency = (value: number) => {
		if (value >= 1000000) {
			return `$${(value / 1000000).toFixed(1)}M`;
		} else if (value >= 1000) {
			return `$${(value / 1000).toFixed(1)}K`;
		}
		return `$${value.toLocaleString()}`;
	};

	const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

	const handleSaveProject = async (projectData: {
		projectId?: string;
		name: string;
		description: string;
		start_date: string;
		end_date?: string;
		project_manager?: string;
		budget?: number;
		location?: string;
		status: "active" | "completed" | "on-hold" | "cancelled";
		priority: "critical" | "high" | "medium" | "low";
	}) => {
		try {
			// Here you would typically call your API to save the project

			// For now, just close the dialog
			setIsSaveDialogOpen(false);

			// TODO: Implement actual save functionality
			// const response = await fetch('/api/projects', {
			//     method: projectData.projectId ? 'PUT' : 'POST',
			//     headers: { 'Content-Type': 'application/json' },
			//     body: JSON.stringify({
			//         ...projectData,
			//         results: calculationResult,
			//         config: advancedConfig
			//     })
			// });
		} catch (error) {
			console.error("Error saving project:", error);
		}
	};

	return (
		<>
			<div className="space-y-6">
				{/* Individual Detailed Table */}
				{displayData.tableData.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<BarChart3 className="h-4 w-4" />
								Detailed Financial Breakdown
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<div className="rounded-md border min-w-[600px]">
									<div className="bg-muted/50 px-4 py-3 border-b">
										<div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground">
											<div>Metric</div>
											<div className="text-center">Category</div>
											<div className="text-right">Value</div>
										</div>
									</div>
									<div className="divide-y">
										{displayData.tableData.map((item, index) => {
											const metricInfo = getMetricInfo(item.key);
											const IconComponent = metricInfo.icon;

											return (
												<div
													key={index}
													className="px-4 py-3 hover:bg-muted/30 transition-colors"
												>
													<div className="grid grid-cols-3 gap-4 items-center">
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
															<span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
																{metricInfo.category}
															</span>
														</div>
														<div className="text-right">
															<div className="font-semibold text-sm">
																{item.isNumeric
																	? formatCurrency(item.value as number)
																	: item.formattedValue}
															</div>
															{item.isNumeric && (item.value as number) > 0 && (
																<div className="text-xs text-muted-foreground">
																	{item.formattedValue}
																</div>
															)}
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
				)}

				{/* Individual Chart */}
				{displayData.chartData.length > 0 && (
					<Card className="overflow-hidden">
						<CardHeader className=" border-b">
							<CardTitle className="text-base flex items-center gap-2">
								<TrendingUp className="h-4 w-4" />
								Financial Overview Chart
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<ResponsiveContainer width="100%" height={450}>
								<BarChart
									data={displayData.chartData}
									margin={{ top: 30, right: 40, left: 20, bottom: 40 }}
									barGap={12}
								>
									<defs>
										{/* Primary bar gradient */}
										<linearGradient
											id="barGradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="0%" stopColor="#1f2937" stopOpacity={1} />
											<stop
												offset="50%"
												stopColor="#374151"
												stopOpacity={0.9}
											/>
											<stop
												offset="100%"
												stopColor="#4b5563"
												stopOpacity={0.8}
											/>
										</linearGradient>

										{/* Hover gradient */}
										<linearGradient
											id="barGradientHover"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="0%" stopColor="#111827" stopOpacity={1} />
											<stop
												offset="50%"
												stopColor="#1f2937"
												stopOpacity={0.95}
											/>
											<stop
												offset="100%"
												stopColor="#374151"
												stopOpacity={0.9}
											/>
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
										tickFormatter={(value) => formatMetricName(value)}
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
											"Value",
										]}
										cursor={{
											fill: "rgba(0, 0, 0, 0.08)",
											stroke: "#6b7280",
											strokeWidth: 1,
											strokeDasharray: "3 3",
										}}
									/>

									<Bar
										dataKey="value"
										fill="url(#barGradient)"
										radius={[8, 8, 0, 0]}
										maxBarSize={70}
										filter="url(#shadow)"
										onMouseOver={(data, index) => {
											// Enhanced hover effect
										}}
									/>
								</BarChart>
							</ResponsiveContainer>

							{/* Chart Legend/Info */}
							<div className="mt-4 flex items-center justify-between text-xs text-gray-500">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-gradient-to-b from-gray-700 to-gray-500 rounded-sm"></div>
										<span>Financial Metrics</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
										<span>Values in USD</span>
									</div>
								</div>
								<div className="text-right">
									<span className="font-medium">
										Total Metrics: {displayData.chartData.length}
									</span>
								</div>
							</div>

							{/* Custom Icon Legend */}
							<div className="mt-6 p-4 bg-gray-50 rounded-lg border">
								<h4 className="text-sm font-semibold text-gray-700 mb-3">
									Metric Legend
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									{displayData.chartData.map((item, index) => {
										const metricInfo = getMetricInfo(item.metric);
										const IconComponent = metricInfo.icon;
										return (
											<div
												key={index}
												className="flex items-center gap-2 p-2 bg-white rounded border"
											>
												<div
													className={`p-1 rounded ${metricInfo.color} bg-gray-100`}
												>
													<IconComponent className="h-3 w-3" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="text-xs font-medium text-gray-700 truncate">
														{formatMetricName(item.metric)}
													</div>
													<div className="text-xs text-gray-500">
														{formatCurrency(item.value)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Action Buttons */}
			<div className="flex justify-center space-x-4 mt-6">
				<Button
					variant="outline"
					className="px-6"
					onClick={() => setIsSaveDialogOpen(true)}
				>
					<Zap className="h-4 w-4 mr-2" />
					Save Results
				</Button>
				<Button variant="outline" className="px-6">
					<BarChart3 className="h-4 w-4 mr-2" />
					Export Data
				</Button>
			</div>

			<SaveResultsDialog
				isOpen={isSaveDialogOpen}
				onOpenChange={setIsSaveDialogOpen}
				onSave={handleSaveProject}
				isLoading={false}
				calculationResult={calculationResult}
				advancedConfig={advancedConfig}
				inputParameters={inputParameters}
			/>
		</>
	);
}
