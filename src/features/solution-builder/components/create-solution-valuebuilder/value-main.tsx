"use client";

import { useState, useEffect, useMemo } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Plus,
	X,
	Settings,
	Trash2,
	ChevronDown,
	ChevronRight,
	BarChart3,
	Table as TableIcon,
} from "lucide-react";
import {
	PieDemo,
	BarDemo,
	LineDemo,
	AreaDemo,
	RadarDemo,
	TableDemo,
	getDemoWidget,
	getGrayDemoWidget,
	ConfiguredWidget,
	type WidgetType,
} from "./widget-library";
import { CreateSolutionData } from "../../types/types";
import { Parameter, Calculation } from "@/types/types";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
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
import { Slider } from "@/components/ui/slider";

const widgetTypes: WidgetType[] = [
	"pie",
	"bar",
	"line",
	"area",
	"radar",
	"table",
];

interface WidgetConfig {
	id: string;
	type: WidgetType;
	dataSource: {
		calculations?: string[];
		parameters?: string[];
	};
	title?: string;
}

interface DataItem {
	id: string;
	name: string;
	value: number;
	units: string;
}

/**
 * ValueMain component - Main component for managing solution value builder
 * Provides comprehensive interface for creating, editing, and organizing value visualizations
 * Handles widget management, chart configurations, and data visualization
 */
export default function ValueMain({
	formData,
}: {
	formData: CreateSolutionData;
}) {
	const [selectedWidgets, setSelectedWidgets] = useState<
		{ id: string; type: WidgetType }[]
	>([]);
	const [widgetConfigs, setWidgetConfigs] = useState<
		Record<string, WidgetConfig>
	>({});
	const [showConfigDialog, setShowConfigDialog] = useState(false);
	const [currentConfigWidget, setCurrentConfigWidget] = useState<string | null>(
		null
	);
	const [currentWidgetType, setCurrentWidgetType] = useState<
		WidgetType | undefined
	>(undefined);
	const [configData, setConfigData] = useState<{
		title: string;
		selectedCalculations: string[];
		selectedParameters: string[];
	}>({
		title: "",
		selectedCalculations: [],
		selectedParameters: [],
	});

	// Add collapse state for each section
	const [isCalculationsCollapsed, setIsCalculationsCollapsed] = useState(false);
	const [isOpexCollapsed, setIsOpexCollapsed] = useState(false);
	const [isWidgetSystemCollapsed, setIsWidgetSystemCollapsed] = useState(true);

	const availableCalculations = convertCalculationsToDataItems(
		formData.calculations
	);
	const availableParameters = convertParametersToDataItems(formData.parameters);

	const defaultCategories = useMemo(() => ["Global", "CAPEX", "OPEX"], []);

	// Add these missing state variables and functions
	const [availableCalculationsCategories, setAvailableCalculationsCategories] =
		useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [customCategories, setCustomCategories] = useState<string[]>([]);
	const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");

	const handleAddCategory = () => {
		if (
			newCategoryName.trim() &&
			!availableCalculationsCategories.includes(newCategoryName.trim())
		) {
			setCustomCategories((prev) => [...prev, newCategoryName.trim()]);
			setNewCategoryName("");
			setShowAddCategoryDialog(false);
		}
	};

	const handleRemoveCategory = (categoryToRemove: string) => {
		if (defaultCategories.includes(categoryToRemove)) return;
		setCustomCategories((prev) =>
			prev.filter((cat) => cat !== categoryToRemove)
		);
		if (selectedCategory === categoryToRemove) {
			setSelectedCategory("Global");
		}
	};

	// Fix the useEffect
	useEffect(() => {
		const allCategories = [...defaultCategories, ...customCategories];
		setAvailableCalculationsCategories(allCategories);
		if (!selectedCategory || !allCategories.includes(selectedCategory)) {
			setSelectedCategory("Global");
		}
	}, [customCategories, selectedCategory, defaultCategories]); // defaultCategories is now stable

	// Add filtered calculations logic
	const { calculations, parameters } = formData;
	const displayCalculations = calculations.filter(
		(calc) => calc.display_result === true
	);
	const filteredCalculations = displayCalculations.filter((calc) => {
		if (!selectedCategory || selectedCategory === "all") return true;
		if (selectedCategory === "Global") {
			return (
				calc.category?.name?.toLowerCase() === "required" ||
				calc.category?.name?.toLowerCase() === "global"
			);
		}
		if (selectedCategory === "CAPEX") {
			return calc.category?.name?.toLowerCase() === "capex";
		}
		if (selectedCategory === "OPEX") {
			return calc.category?.name?.toLowerCase() === "opex";
		}
		return calc.category?.name === selectedCategory;
	});

	const handleAddWidget = (widgetType: WidgetType) => {
		const newWidget = {
			id: `${widgetType}-${Date.now()}-${Math.random()}`,
			type: widgetType,
		};
		setSelectedWidgets([...selectedWidgets, newWidget]);
	};

	const handleRemoveWidget = (widgetId: string) => {
		setSelectedWidgets(selectedWidgets.filter((w) => w.id !== widgetId));
		const newConfigs = { ...widgetConfigs };
		delete newConfigs[widgetId];
		setWidgetConfigs(newConfigs);
	};

	const handleConfigureWidget = (widgetId: string) => {
		const widget = selectedWidgets.find((w) => w.id === widgetId);
		if (!widget) return;

		const existingConfig = widgetConfigs[widgetId];
		setConfigData({
			title:
				existingConfig?.title ||
				`${widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Chart`,
			selectedCalculations: existingConfig?.dataSource.calculations || [],
			selectedParameters: existingConfig?.dataSource.parameters || [],
		});
		setCurrentConfigWidget(widgetId);
		setCurrentWidgetType(widget.type);
		setShowConfigDialog(true);
	};

	const handleSaveConfig = () => {
		if (!currentConfigWidget) return;

		const widget = selectedWidgets.find((w) => w.id === currentConfigWidget);
		if (!widget) return;

		const newConfig: WidgetConfig = {
			id: currentConfigWidget,
			type: widget.type,
			title: configData.title,
			dataSource: {
				calculations: configData.selectedCalculations,
				parameters: configData.selectedParameters,
			},
		};

		setWidgetConfigs((prev) => ({
			...prev,
			[currentConfigWidget]: newConfig,
		}));

		setShowConfigDialog(false);
		setCurrentConfigWidget(null);
		setCurrentWidgetType(undefined);
		setConfigData({
			title: "",
			selectedCalculations: [],
			selectedParameters: [],
		});
	};

	const renderWidget = (widget: { id: string; type: WidgetType }) => {
		const config = widgetConfigs[widget.id];

		if (config) {
			return (
				<ConfiguredWidget
					type={widget.type}
					config={{
						title:
							config.title ||
							`${
								widget.type.charAt(0).toUpperCase() + widget.type.slice(1)
							} Chart`,
						dataSource: config.dataSource,
					}}
					calculations={availableCalculations}
					parameters={availableParameters}
				/>
			);
		}

		const GrayWidgetComponent = getGrayDemoWidget(widget.type);
		return <GrayWidgetComponent />;
	};

	return (
		<div className="flex flex-col h-full gap-4">
			{/* Calculations Section */}
			<Card className="px-4">
				<div
					className="flex items-center justify-between  cursor-pointer hover:bg-gray-50"
					onClick={() => setIsCalculationsCollapsed(!isCalculationsCollapsed)}
				>
					<h3 className="text-sm font-semibold text-gray-900">Calculations</h3>
					{isCalculationsCollapsed ? (
						<ChevronRight className="h-5 w-5 text-gray-500" />
					) : (
						<ChevronDown className="h-5 w-5 text-gray-500" />
					)}
				</div>

				{!isCalculationsCollapsed && (
					<div className="space-y-4">
						<CategoryTabs
							availableCalculationsCategories={availableCalculationsCategories}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
							defaultCategories={defaultCategories}
							handleRemoveCategory={handleRemoveCategory}
							showAddCategoryDialog={showAddCategoryDialog}
							setShowAddCategoryDialog={setShowAddCategoryDialog}
							newCategoryName={newCategoryName}
							setNewCategoryName={setNewCategoryName}
							handleAddCategory={handleAddCategory}
							filteredCalculations={filteredCalculations}
						/>

						<CalculationsTable filteredCalculations={filteredCalculations} />
					</div>
				)}
			</Card>

			{/* OPEX Visualization Section */}
			<Card className="px-4">
				<div
					className="flex items-center justify-between  cursor-pointer hover:bg-gray-50"
					onClick={() => setIsOpexCollapsed(!isOpexCollapsed)}
				>
					<h3 className="text-sm font-semibold text-gray-900">Charts</h3>
					{isOpexCollapsed ? (
						<ChevronRight className="h-5 w-5 text-gray-500" />
					) : (
						<ChevronDown className="h-5 w-5 text-gray-500" />
					)}
				</div>

				{!isOpexCollapsed && <OpexVisualization formData={formData} />}
			</Card>

			{/* Widget System Section */}
			<Card className="px-4">
				<div
					className="flex items-center justify-between  cursor-pointer hover:bg-gray-50"
					onClick={() => setIsWidgetSystemCollapsed(!isWidgetSystemCollapsed)}
				>
					<h3 className="text-sm font-semibold text-gray-900">Widget System</h3>
					{isWidgetSystemCollapsed ? (
						<ChevronRight className="h-5 w-5 text-gray-500" />
					) : (
						<ChevronDown className="h-5 w-5 text-gray-500" />
					)}
				</div>

				{!isWidgetSystemCollapsed && (
					<WidgetSystem
						widgetTypes={widgetTypes}
						selectedWidgets={selectedWidgets}
						renderWidget={renderWidget}
						onAddWidget={handleAddWidget}
						onConfigureWidget={handleConfigureWidget}
						onRemoveWidget={handleRemoveWidget}
						showConfigDialog={showConfigDialog}
						setShowConfigDialog={setShowConfigDialog}
						configData={configData}
						setConfigData={setConfigData}
						availableCalculations={availableCalculations}
						availableParameters={availableParameters}
						onSaveConfig={handleSaveConfig}
						currentWidgetType={currentWidgetType}
						currentConfigWidget={currentConfigWidget}
					/>
				)}
			</Card>
		</div>
	);
}

/**
 * OpexVisualization component - Handles OPEX analysis and chart visualization only
 * Displays annual and lifetime OPEX data with interactive charts and summary cards
 */
function OpexVisualization({ formData }: { formData: CreateSolutionData }) {
	const { calculations, parameters } = formData;

	const plannedYearsParam = parameters.find(
		(param) =>
			param.name === "Planned Years of Operation" ||
			param.name.toLowerCase().includes("planned years")
	);

	const plannedYears = parseInt(
		plannedYearsParam?.value || plannedYearsParam?.test_value || "4"
	);

	const annualOpexCalc = calculations.find(
		(calc) =>
			calc.name.toLowerCase().includes("annual opex") ||
			calc.name.toLowerCase().includes("annual cooling opex")
	);

	const lifetimeOpexCalc = calculations.find(
		(calc) =>
			calc.name.toLowerCase().includes("lifetime") &&
			calc.name.toLowerCase().includes("opex")
	);

	const annualOpexValue =
		typeof annualOpexCalc?.result === "number" ? annualOpexCalc.result : 0;
	const lifetimeOpexValue =
		typeof lifetimeOpexCalc?.result === "number" ? lifetimeOpexCalc.result : 0;

	const generateOpexData = () => {
		const data = [];
		for (let year = 1; year <= plannedYears; year++) {
			data.push({
				year: `Year ${year}`,
				annualOpex: annualOpexValue,
				cumulativeOpex: annualOpexValue * year,
				lifetimeOpex: lifetimeOpexValue,
			});
		}
		return data;
	};

	const opexData = generateOpexData();

	return (
		<>
			{/* OPEX Chart */}
			{annualOpexCalc && (
				<ChartSection
					annualOpexValue={annualOpexValue}
					lifetimeOpexValue={lifetimeOpexValue}
					plannedYears={plannedYears}
					opexData={opexData}
					formData={formData}
				/>
			)}
		</>
	);
}

/**
 * ChartSection component - Renders different chart types with tab navigation
 * Displays summary cards and interactive charts for various financial metrics
 * Includes tab system for switching between TCO, CAPEX, and OPEX chart types
 */
function ChartSection({
	annualOpexValue,
	lifetimeOpexValue,
	plannedYears,
	opexData,
	formData,
}: {
	annualOpexValue: number;
	lifetimeOpexValue: number;
	plannedYears: number;
	opexData: any[];
	formData: CreateSolutionData;
}) {
	const [selectedChartTab, setSelectedChartTab] = useState("tco");
	const [localPlannedYears, setLocalPlannedYears] = useState(plannedYears);
	const [isTableView, setIsTableView] = useState(false);

	const chartTabs = [
		{ id: "tco", label: "TCO Analysis", color: "purple" },
		{ id: "capex", label: "CAPEX Analysis", color: "green" },
		{ id: "opex", label: "OPEX Analysis", color: "blue" },
	];

	// Debug: Log all calculations to see what we have
	console.log("All calculations:", formData.calculations);

	// Get required calculations - look for multiple possible category names
	const requiredCalculations = formData.calculations.filter(
		(calc) =>
			calc.category?.name?.toLowerCase() === "required" ||
			calc.category?.name?.toLowerCase() === "essential" ||
			calc.category?.name?.toLowerCase() === "global"
	);

	// Get CAPEX calculations - look for multiple possible category names
	const capexCalculations = formData.calculations.filter(
		(calc) =>
			calc.category?.name?.toLowerCase() === "capex" ||
			calc.name.toLowerCase().includes("capex") ||
			calc.name.toLowerCase().includes("capital")
	);

	// Extract key metrics using exact calculation names
	const totalCapex = Number(
		requiredCalculations.find((calc) => calc.name === "Total CAPEX")?.result ||
			0
	);

	const totalTco = Number(
		requiredCalculations.find((calc) => calc.name === "Total Cost of Ownership")
			?.result || 0
	);

	const annualOpex = Number(
		requiredCalculations.find((calc) => calc.name === "Annual OPEX")?.result ||
			annualOpexValue
	);

	const lifetimeOpex = Number(
		requiredCalculations.find(
			(calc) => calc.name === "OPEX for lifetime operation"
		)?.result || lifetimeOpexValue
	);

	// Debug: Log the exact values being extracted
	console.log("Extracted values:", {
		totalCapex: requiredCalculations.find((calc) => calc.name === "Total CAPEX")
			?.result,
		totalTco: requiredCalculations.find(
			(calc) => calc.name === "Total Cost of Ownership"
		)?.result,
		annualOpex: requiredCalculations.find((calc) => calc.name === "Annual OPEX")
			?.result,
		lifetimeOpex: requiredCalculations.find(
			(calc) => calc.name === "OPEX for lifetime operation"
		)?.result,
	});

	// Extract CAPEX breakdown from calculations
	const capexBreakdown = capexCalculations.map((calc) => ({
		name: calc.name,
		value: Number(calc.result || 0),
		percentage: 0, // Will be calculated
		category: calc.category?.name || "capex",
	}));

	// Calculate percentages and sort by value
	const totalCapexValue = capexBreakdown.reduce(
		(sum, item) => sum + item.value,
		0
	);
	capexBreakdown.forEach((item) => {
		item.percentage =
			totalCapexValue > 0 ? (item.value / totalCapexValue) * 100 : 0;
	});
	capexBreakdown.sort((a, b) => b.value - a.value);

	console.log("CAPEX Breakdown:", capexBreakdown);

	// Update data generation functions to use localPlannedYears
	const generateOpexInsights = () => {
		const data = [];
		for (let year = 1; year <= localPlannedYears; year++) {
			const yearOpex = annualOpex;
			const cumulativeOpex = yearOpex * year;
			const capexAmortized = totalCapex / localPlannedYears;
			const totalYearlyCost = yearOpex + capexAmortized;
			const cumulativeTotalCost = yearOpex * year + capexAmortized * year;

			data.push({
				year: `Year ${year}`,
				annualOpex: yearOpex,
				cumulativeOpex: cumulativeOpex,
				capexAmortized: capexAmortized,
				totalYearlyCost: totalYearlyCost,
				cumulativeTotalCost: cumulativeTotalCost,
				lifetimeOpex: lifetimeOpex,
			});
		}
		return data;
	};

	const generateTcoData = () => {
		const data = [];
		for (let year = 1; year <= localPlannedYears; year++) {
			const yearOpex = annualOpex;
			const cumulativeOpex = yearOpex * year;
			const capexAmortized = totalCapex / localPlannedYears;
			const cumulativeCapex = capexAmortized * year;
			const totalYearlyCost = yearOpex + capexAmortized;
			const cumulativeTotalCost = cumulativeOpex + cumulativeCapex;

			data.push({
				year: `Year ${year}`,
				annualOpex: yearOpex,
				cumulativeOpex: cumulativeOpex,
				capexAmortized: capexAmortized,
				cumulativeCapex: cumulativeCapex,
				totalYearlyCost: totalYearlyCost,
				cumulativeTotalCost: cumulativeTotalCost,
				totalTco: totalTco,
			});
		}
		return data;
	};

	const opexInsightsData = generateOpexInsights();
	const tcoData = generateTcoData();

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
											data={opexInsightsData}
											margin={{ top: 15, right: 25, left: 15, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="year" tick={{ fontSize: 10 }} />
											<YAxis tick={{ fontSize: 10 }} />
											<Tooltip
												formatter={(value, name) => [
													Number(value).toLocaleString("en-US", {
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}),
													name,
												]}
											/>
											<Legend wrapperStyle={{ fontSize: "10px" }} />
											<Bar
												dataKey="annualOpex"
												fill="#3b82f6"
												name="Annual OPEX"
											/>
											<Bar
												dataKey="cumulativeOpex"
												fill="#10b981"
												name="Cumulative OPEX"
											/>
											<Bar
												dataKey="totalYearlyCost"
												fill="#f59e0b"
												name="Total Yearly Cost (OPEX + CAPEX)"
											/>
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
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Annual OPEX
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Cumulative OPEX
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														CAPEX (Amortized)
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Total Yearly Cost
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Cumulative Total
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody className="bg-white divide-y divide-gray-200">
												{opexInsightsData.map((item, index) => (
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
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-blue-900">
																{item.annualOpex.toLocaleString("en-US")}
															</div>
														</TableCell>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-green-900">
																{item.cumulativeOpex.toLocaleString("en-US")}
															</div>
														</TableCell>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-orange-900">
																{item.capexAmortized.toLocaleString("en-US")}
															</div>
														</TableCell>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-yellow-900">
																{item.totalYearlyCost.toLocaleString("en-US")}
															</div>
														</TableCell>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-purple-900">
																{item.cumulativeTotalCost.toLocaleString("en-US")}
															</div>
														</TableCell>
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
									<div className="flex justify-between">
										<span className="text-blue-700">Annual OPEX:</span>
										<span className="font-semibold text-blue-900">
											{annualOpex.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-blue-700">Lifetime OPEX:</span>
										<span className="font-semibold text-blue-900">
											{lifetimeOpex.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-blue-700">OPEX per Year:</span>
										<span className="font-semibold text-blue-900">
											{(lifetimeOpex / localPlannedYears).toLocaleString(
												"en-US"
											)}
										</span>
									</div>
								</div>
							</div>

							<div className="bg-green-50 p-3 rounded-lg border border-green-200">
								<h5 className="font-medium text-green-900 mb-2 text-xs">
									Cost Analysis
								</h5>
								<div className="space-y-1 text-xs">
									<div className="flex justify-between">
										<span className="text-green-700">Total CAPEX:</span>
										<span className="font-semibold text-green-900">
											{totalCapex.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-green-700">CAPEX per Year:</span>
										<span className="font-semibold text-green-900">
											{(totalCapex / localPlannedYears).toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-green-700">Total TCO:</span>
										<span className="font-semibold text-green-900">
											{totalTco.toLocaleString("en-US")}
										</span>
									</div>
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
											data={capexBreakdown}
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
												scale="log"
												domain={["auto", "auto"]}
											/>
											<Tooltip
												formatter={(value, name) => [
													Number(value).toLocaleString("en-US", {
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}),
													name,
												]}
											/>
											<Legend wrapperStyle={{ fontSize: "10px" }} />
											<Bar dataKey="value" fill="#10b981" name="CAPEX Value" />
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
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Value
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Percentage
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Range
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody className="bg-white divide-y divide-gray-200">
												{capexBreakdown.map((item, index) => {
													const getValueRange = (value: number) => {
														if (value >= 1000000) return "Major (>1M)";
														if (value >= 100000) return "Medium (100K-1M)";
														if (value >= 10000) return "Small (10K-100K)";
														if (value >= 1000) return "Minor (1K-10K)";
														return "Micro (<1K)";
													};

													const getRangeColor = (value: number) => {
														if (value >= 1000000)
															return "text-red-600 font-semibold";
														if (value >= 100000)
															return "text-orange-600 font-semibold";
														if (value >= 10000)
															return "text-yellow-600 font-semibold";
														if (value >= 1000) return "text-blue-600 font-semibold";
														return "text-gray-600";
													};

													return (
														<TableRow
															key={index}
															className="hover:bg-gray-50 transition-all duration-200"
															style={{ height: "28px", minHeight: "28px" }}
														>
															<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden">
																<div className="overflow-hidden">
																	<div className="flex flex-col">
																		<div className="text-xs font-medium text-gray-900 truncate">
																			{item.name}
																		</div>
																	</div>
																</div>
															</TableCell>
															<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																<div className="overflow-hidden text-center">
																	<div
																		className={`text-xs font-semibold ${getRangeColor(
																			item.value
																		)}`}
																	>
																		{item.value.toLocaleString("en-US")}
																	</div>
																</div>
															</TableCell>
															<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																<div className="overflow-hidden text-center">
																	<div className="text-xs font-semibold text-gray-900">
																		{item.percentage.toFixed(1)}%
																	</div>
																</div>
															</TableCell>
															<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
																<div className="overflow-hidden text-center">
																	<div
																		className={`text-xs font-semibold ${getRangeColor(
																			item.value
																		)}`}
																	>
																		{getValueRange(item.value)}
																	</div>
																</div>
															</TableCell>
														</TableRow>
													);
												})}
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
									<div className="flex justify-between">
										<span className="text-green-700">Total CAPEX:</span>
										<span className="font-semibold text-green-900">
											{totalCapexValue.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-green-700">
											Major Components (&gt;1M):
										</span>
										<span className="font-semibold text-green-900">
											{
												capexBreakdown.filter((item) => item.value >= 1000000)
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
												capexBreakdown.filter((item) => item.value < 100000)
													.length
											}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-green-700">Value Range:</span>
										<span className="font-semibold text-green-900">
											{Math.max(
												...capexBreakdown.map((item) => item.value)
											).toLocaleString("en-US")}{" "}
											-{" "}
											{Math.min(
												...capexBreakdown.map((item) => item.value)
											).toLocaleString("en-US")}
										</span>
									</div>
								</div>
							</div>

							<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
								<h5 className="font-medium text-blue-900 mb-2 text-xs">
									Top CAPEX Components
								</h5>
								<div className="space-y-1 text-xs max-h-24 overflow-y-auto">
									{capexBreakdown.slice(0, 5).map((item, index) => (
										<div key={index} className="flex justify-between">
											<span className="text-blue-700 truncate">
												{index + 1}. {item.name}
											</span>
											<span className="font-semibold text-blue-900">
												{item.value.toLocaleString("en-US")}
											</span>
										</div>
									))}
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
								<h4 className="text-xs font-medium text-gray-900">
									Total Cost of Ownership Analysis
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
											data={tcoData}
											margin={{ top: 15, right: 25, left: 15, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="year" tick={{ fontSize: 10 }} />
											<YAxis tick={{ fontSize: 10 }} />
											<Tooltip
												formatter={(value, name) => [
													Number(value).toLocaleString("en-US", {
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}),
													name,
												]}
											/>
											<Legend wrapperStyle={{ fontSize: "10px" }} />
											<Bar
												dataKey="annualOpex"
												fill="#3b82f6"
												name="Annual OPEX"
											/>
											<Bar
												dataKey="capexAmortized"
												fill="#10b981"
												name="Annual CAPEX (Amortized)"
											/>
											<Bar
												dataKey="totalYearlyCost"
												fill="#f59e0b"
												name="Total Yearly Cost"
											/>
											<Bar
												dataKey="cumulativeTotalCost"
												fill="#8b5cf6"
												name="Cumulative TCO"
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className="border rounded-lg overflow-hidden">
									<div className="bg-gray-50 px-3 py-2 border-b">
										<h5 className="font-medium text-gray-900 text-xs">TCO Yearly Breakdown</h5>
									</div>
									<div className="max-h-40 overflow-y-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-left">
														Year
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Annual OPEX
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														CAPEX (Amortized)
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Total Yearly
													</TableHead>
													<TableHead className="px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
														Cumulative TCO
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody className="bg-white divide-y divide-gray-200">
												{tcoData.map((item, index) => (
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
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-blue-900">
																{item.annualOpex.toLocaleString("en-US")}
															</div>
														</TableCell>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-green-900">
																{item.capexAmortized.toLocaleString("en-US")}
															</div>
														</TableCell>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-yellow-900">
																{item.totalYearlyCost.toLocaleString("en-US")}
															</div>
														</TableCell>
														<TableCell className="py-1 px-3 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
															<div className="text-xs font-semibold text-purple-900">
																{item.cumulativeTotalCost.toLocaleString("en-US")}
															</div>
														</TableCell>
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
									<div className="flex justify-between">
										<span className="text-purple-700">Total TCO:</span>
										<span className="font-semibold text-purple-900">
											{totalTco.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-purple-700">Annual TCO:</span>
										<span className="font-semibold text-purple-900">
											{(totalTco / localPlannedYears).toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-purple-700">OPEX % of TCO:</span>
										<span className="font-semibold text-purple-900">
											{totalTco > 0
												? ((lifetimeOpex / totalTco) * 100).toFixed(1)
												: 0}
											%
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-purple-700">CAPEX % of TCO:</span>
										<span className="font-semibold text-purple-900">
											{totalTco > 0
												? ((totalCapex / totalTco) * 100).toFixed(1)
												: 0}
											%
										</span>
									</div>
								</div>
							</div>

							<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
								<h5 className="font-medium text-blue-900 mb-2 text-xs">
									Cost Breakdown
								</h5>
								<div className="space-y-1 text-xs">
									<div className="flex justify-between">
										<span className="text-blue-700">Total CAPEX:</span>
										<span className="font-semibold text-blue-900">
											{totalCapex.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-blue-700">Lifetime OPEX:</span>
										<span className="font-semibold text-blue-900">
											{lifetimeOpex.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-blue-700">Annual OPEX:</span>
										<span className="font-semibold text-blue-900">
											{annualOpex.toLocaleString("en-US")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-blue-700">Planned Years:</span>
										<span className="font-semibold text-blue-900">
											{localPlannedYears}
										</span>
									</div>
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
			{/* Planned Years Slider */}
			<div className="mb-4 p-3 bg-gray-50 rounded-lg border">
				<div className="flex items-center justify-between mb-2">
					<label className="text-sm font-medium text-gray-700">
						Planned Years of Operation
					</label>
					<span className="text-sm font-semibold text-gray-900">
						{localPlannedYears} years
					</span>
				</div>
				<Slider
					value={[localPlannedYears]}
					onValueChange={(value) => setLocalPlannedYears(value[0])}
					max={20}
					min={1}
					step={1}
					className="w-full"
				/>
				<div className="flex justify-between text-xs text-gray-500 mt-1">
					<span>1 year</span>
					<span>20 years</span>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-3 gap-2 mb-3">
				<div className="bg-purple-50 p-2 rounded border border-purple-200">
					<div className="text-purple-600 text-xs font-medium">Total TCO</div>
					<div className="text-sm font-bold text-purple-800">
						{totalTco.toLocaleString("en-US", {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						})}
					</div>
					<div className="text-purple-600 text-xs">lifetime cost</div>
				</div>

				<div className="bg-green-50 p-2 rounded border border-green-200">
					<div className="text-green-600 text-xs font-medium">Total CAPEX</div>
					<div className="text-sm font-bold text-green-800">
						{totalCapex.toLocaleString("en-US", {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						})}
					</div>
					<div className="text-green-600 text-xs">one-time investment</div>
				</div>
				<div className="bg-blue-50 p-2 rounded border border-blue-200">
					<div className="text-blue-600 text-xs font-medium">Annual OPEX</div>
					<div className="text-sm font-bold text-blue-800">
						{annualOpex.toLocaleString("en-US", {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						})}
					</div>
					<div className="text-blue-600 text-xs">per year</div>
				</div>
			</div>
			{/* Tab Navigation */}
			<div className="mb-3">
				<Tabs value={selectedChartTab} onValueChange={setSelectedChartTab}>
					<TabsList className="grid w-full grid-cols-3">
						{chartTabs.map((tab) => (
							<TabsTrigger key={tab.id} value={tab.id} className="text-xs">
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			{/* Chart Content */}
			{opexInsightsData.length > 0 && renderChart()}
		</Card>
	);
}

/**
 * CategoryTabs component - Manages category-based filtering and tab navigation
 * Provides tab interface for filtering calculations by category (Global, CAPEX, OPEX)
 * Handles custom category creation and removal with add/remove functionality
 */
function CategoryTabs({
	availableCalculationsCategories,
	selectedCategory,
	setSelectedCategory,
	defaultCategories,
	handleRemoveCategory,
	showAddCategoryDialog,
	setShowAddCategoryDialog,
	newCategoryName,
	setNewCategoryName,
	handleAddCategory,
	filteredCalculations,
}: {
	availableCalculationsCategories: string[];
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;
	defaultCategories: string[];
	handleRemoveCategory: (category: string) => void;
	showAddCategoryDialog: boolean;
	setShowAddCategoryDialog: (show: boolean) => void;
	newCategoryName: string;
	setNewCategoryName: (name: string) => void;
	handleAddCategory: () => void;
	filteredCalculations: any[];
}) {
	return (
		<>
			<div className="flex items-center justify-between">
				<Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
					<TabsList className="flex-wrap">
						{availableCalculationsCategories.map((category) => (
							<TabsTrigger key={category} value={category} className="relative">
								{category}
								{!defaultCategories.includes(category) && (
									<Button
										size="icon"
										variant="ghost"
										className="absolute -top-1 -right-1 h-4 w-4 p-0 hover:bg-red-100"
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveCategory(category);
										}}
									>
										<X className="h-2 w-2 text-red-500" />
									</Button>
								)}
							</TabsTrigger>
						))}
						<TabsTrigger
							value="add"
							onClick={(e) => {
								e.preventDefault();
								setShowAddCategoryDialog(true);
							}}
							className="text-blue-600 hover:text-blue-700"
						>
							<Plus className="h-3 w-3 mr-1" />
							Add
						</TabsTrigger>
					</TabsList>
				</Tabs>
				<span className="text-sm text-gray-500">
					{filteredCalculations.length} calculation
					{filteredCalculations.length !== 1 ? "s" : ""} displayed
				</span>
			</div>

			<Dialog
				open={showAddCategoryDialog}
				onOpenChange={setShowAddCategoryDialog}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add New Category</DialogTitle>
						<DialogDescription>
							Create a new category to organize your calculations.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="category-name" className="text-right">
								Category Name
							</Label>
							<div className="col-span-3">
								<Input
									id="category-name"
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									placeholder="Enter category name"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleAddCategory();
										}
									}}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowAddCategoryDialog(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAddCategory}
							disabled={
								!newCategoryName.trim() ||
								availableCalculationsCategories.includes(newCategoryName.trim())
							}
						>
							Add Category
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

/**
 * CalculationsTable component - Displays filtered calculations in a structured table format
 * Renders calculation results with category badges and formatted numerical values
 * Provides responsive table layout with proper data formatting and display logic
 */
function CalculationsTable({
	filteredCalculations,
}: {
	filteredCalculations: any[];
}) {
	return (
		<>
			{filteredCalculations.length > 0 ? (
				<div className="border rounded-lg">
					<div className="max-h-[55vh] overflow-y-auto overflow-x-auto relative">
						<div className="min-w-full">
							<Table className="w-full min-w-[800px] table-fixed">
								<TableHeader className="sticky top-0 bg-gray-50 z-10">
									<TableRow>
										<TableHead className="bg-gray-50 px-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-left">
											Calculation Name
										</TableHead>
										<TableHead className="bg-gray-50 px-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
											Category
										</TableHead>
										<TableHead className="bg-gray-50 px-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
											Result
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className="bg-white divide-y divide-gray-200">
									{filteredCalculations.map((calculation) => (
										<TableRow
											key={calculation.id}
											className="hover:bg-gray-50 transition-all duration-200"
											style={{ height: "32px", minHeight: "32px" }}
										>
											<TableCell className="py-1 px-2 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden">
												<div className="overflow-hidden">
													<div className="flex flex-col">
														<div className="text-xs font-medium text-gray-900 truncate">
															{calculation.name}
														</div>
														{calculation.description && (
															<div className="text-xs text-gray-500 truncate">
																{calculation.description}
															</div>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell className="py-1 px-2 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
												<div className="overflow-hidden text-center">
													{calculation.category && (
														<span
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																calculation.category.color ||
																"bg-blue-100 text-blue-800"
															}`}
														>
															{calculation.category.name.toLowerCase() ===
															"required"
																? "Global"
																: calculation.category.name}
														</span>
													)}
												</div>
											</TableCell>
											<TableCell className="py-1 px-2 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden text-center">
												<div className="overflow-hidden text-center">
													<div className="text-xs font-semibold text-gray-900">
														{typeof calculation.result === "number"
															? calculation.result.toLocaleString("en-US", {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
															  })
															: calculation.result?.toString() || "N/A"}
													</div>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			) : (
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
					<div className="text-gray-500">
						<p className="text-sm font-medium">No calculations to display</p>
						<p className="text-xs mt-1">
							Calculations with{" "}
							<code className="bg-gray-200 px-1 rounded">
								display_result: true
							</code>{" "}
							will appear here
						</p>
					</div>
				</div>
			)}
		</>
	);
}

/**
 * WidgetSystem component - Manages widget creation, configuration, and display system
 * Provides carousel interface for widget selection and grid layout for active widgets
 * Handles widget configuration dialogs and data source management for custom visualizations
 */
function WidgetSystem({
	widgetTypes,
	selectedWidgets,
	renderWidget,
	onAddWidget,
	onConfigureWidget,
	onRemoveWidget,
	showConfigDialog,
	setShowConfigDialog,
	configData,
	setConfigData,
	availableCalculations,
	availableParameters,
	onSaveConfig,
	currentWidgetType,
	currentConfigWidget,
}: {
	widgetTypes: WidgetType[];
	selectedWidgets: { id: string; type: WidgetType }[];
	renderWidget: (widget: { id: string; type: WidgetType }) => React.ReactNode;
	onAddWidget: (widgetType: WidgetType) => void;
	onConfigureWidget: (widgetId: string) => void;
	onRemoveWidget: (widgetId: string) => void;
	showConfigDialog: boolean;
	setShowConfigDialog: (show: boolean) => void;
	configData: {
		title: string;
		selectedCalculations: string[];
		selectedParameters: string[];
	};
	setConfigData: (data: any) => void;
	availableCalculations: DataItem[];
	availableParameters: DataItem[];
	onSaveConfig: () => void;
	currentWidgetType: WidgetType | undefined;
	currentConfigWidget: string | null;
}) {
	return (
		<>
			<WidgetCarousel widgetTypes={widgetTypes} onAddWidget={onAddWidget} />
			<MainContentCard
				selectedWidgets={selectedWidgets}
				renderWidget={renderWidget}
				onConfigureWidget={onConfigureWidget}
				onRemoveWidget={onRemoveWidget}
			/>
			<ConfigurationDialog
				open={showConfigDialog}
				onOpenChange={setShowConfigDialog}
				configData={configData}
				setConfigData={setConfigData}
				availableCalculations={availableCalculations}
				availableParameters={availableParameters}
				onSaveConfig={onSaveConfig}
				currentWidgetType={currentWidgetType}
				renderWidget={renderWidget}
				currentConfigWidget={currentConfigWidget}
			/>
		</>
	);
}

function WidgetCarousel({
	widgetTypes,
	onAddWidget,
}: {
	widgetTypes: WidgetType[];
	onAddWidget: (widgetType: WidgetType) => void;
}) {
	return (
		<div className="flex-shrink-0">
			<Carousel
				opts={{
					align: "start",
					loop: true,
					slidesToScroll: 1,
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-2 md:-ml-4">
					{widgetTypes.map((widgetType) => {
						const DemoComponent = getDemoWidget(widgetType);
						return (
							<CarouselItem
								key={widgetType}
								className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
							>
								<div className="h-[150px] md:h-[160px] relative group">
									<DemoComponent />
									<Button
										size="icon"
										variant="default"
										className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
										onClick={() => onAddWidget(widgetType)}
									>
										<Plus className="h-3 w-3" />
									</Button>
								</div>
							</CarouselItem>
						);
					})}
				</CarouselContent>
				<CarouselPrevious className="left-2 md:left-4 h-8 w-8" />
				<CarouselNext className="right-2 md:right-4 h-8 w-8" />
			</Carousel>
		</div>
	);
}

function MainContentCard({
	selectedWidgets,
	renderWidget,
	onConfigureWidget,
	onRemoveWidget,
}: {
	selectedWidgets: { id: string; type: WidgetType }[];
	renderWidget: (widget: { id: string; type: WidgetType }) => React.ReactNode;
	onConfigureWidget: (widgetId: string) => void;
	onRemoveWidget: (widgetId: string) => void;
}) {
	function EmptyState() {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<p className="text-muted-foreground mb-4">
						Select a widget type from above to add to your dashboard.
					</p>
					<Button variant="outline" disabled>
						<Plus className="h-4 w-4 mr-2" />
						Add Widget
					</Button>
				</div>
			</div>
		);
	}

	function WidgetGrid({
		selectedWidgets,
		renderWidget,
		onConfigureWidget,
		onRemoveWidget,
	}: {
		selectedWidgets: { id: string; type: WidgetType }[];
		renderWidget: (widget: { id: string; type: WidgetType }) => React.ReactNode;
		onConfigureWidget: (widgetId: string) => void;
		onRemoveWidget: (widgetId: string) => void;
	}) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{selectedWidgets.map((widget) => (
					<div key={widget.id} className="relative group">
						<div className="h-[300px]">{renderWidget(widget)}</div>
						<div className="absolute top-2 right-2 flex gap-1 z-20">
							<Button
								size="icon"
								variant="outline"
								className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 bg-white/90 hover:bg-white"
								onClick={() => onConfigureWidget(widget.id)}
							>
								<Settings className="h-2 w-2" />
							</Button>
							<Button
								size="icon"
								variant="destructive"
								className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
								onClick={() => onRemoveWidget(widget.id)}
							>
								<Trash2 className="h-2 w-2" />
							</Button>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Value Builder Dashboard</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-full">
					{selectedWidgets.length === 0 ? (
						<EmptyState />
					) : (
						<WidgetGrid
							selectedWidgets={selectedWidgets}
							renderWidget={renderWidget}
							onConfigureWidget={onConfigureWidget}
							onRemoveWidget={onRemoveWidget}
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function ConfigurationDialog({
	open,
	onOpenChange,
	configData,
	setConfigData,
	availableCalculations,
	availableParameters,
	onSaveConfig,
	currentWidgetType,
	renderWidget,
	currentConfigWidget,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	configData: {
		title: string;
		selectedCalculations: string[];
		selectedParameters: string[];
	};
	setConfigData: (data: any) => void;
	availableCalculations: DataItem[];
	availableParameters: DataItem[];
	onSaveConfig: () => void;
	currentWidgetType: WidgetType | undefined;
	renderWidget: (widget: { id: string; type: WidgetType }) => React.ReactNode;
	currentConfigWidget: string | null;
}) {
	const getWidgetInstructions = (widgetType?: WidgetType) => {
		switch (widgetType) {
			case "pie":
				return {
					title: "Configure Pie Chart Widget",
					description:
						"Pie charts are perfect for showing proportions and percentages. Select data sources that represent parts of a whole.",
					instructions: [
						"Choose 3-8 data sources for optimal visualization",
						"Select values that represent percentages or proportions",
						"Consider using calculations that show cost breakdowns or resource allocation",
						"Parameters work well for fixed values, calculations for dynamic results",
					],
				};
			default:
				return {
					title: "Configure Widget",
					description:
						"Select data sources and configure your widget settings.",
					instructions: [
						"Choose data sources from the dropdown menus below",
						"Select calculations for dynamic values or parameters for fixed values",
						"Give your widget a descriptive title",
					],
				};
		}
	};

	const widgetInstructions = getWidgetInstructions(currentWidgetType);
	const previewWidget =
		currentConfigWidget && currentWidgetType
			? {
					id: currentConfigWidget,
					type: currentWidgetType,
			  }
			: null;

	function TitleInput({
		value,
		onChange,
	}: {
		value: string;
		onChange: (value: string) => void;
	}) {
		return (
			<div className="grid gap-2">
				<Label htmlFor="title">Widget Title</Label>
				<Input
					id="title"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Enter widget title"
				/>
			</div>
		);
	}

	function DataSelector({
		label,
		placeholder,
		selectedItems,
		availableItems,
		onSelectionChange,
		bgColor,
		textColor,
	}: {
		label: string;
		placeholder: string;
		selectedItems: string[];
		availableItems: DataItem[];
		onSelectionChange: (selected: string[]) => void;
		bgColor: string;
		textColor: string;
	}) {
		const handleAddItem = (itemId: string) => {
			if (itemId && !selectedItems.includes(itemId)) {
				onSelectionChange([...selectedItems, itemId]);
			}
		};

		const handleRemoveItem = (itemId: string) => {
			onSelectionChange(selectedItems.filter((id) => id !== itemId));
		};

		return (
			<div className="grid gap-2">
				<Label>{label}</Label>
				<Select value="" onValueChange={handleAddItem}>
					<SelectTrigger>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						{availableItems.map((item) => (
							<SelectItem key={item.id} value={item.id}>
								{item.name} ({item.value.toLocaleString()} {item.units})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="flex flex-wrap gap-1 mt-2">
					{selectedItems.map((itemId) => {
						const item = availableItems.find((i) => i.id === itemId);
						return item ? (
							<div
								key={itemId}
								className={`flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded text-xs`}
							>
								<span>{item.name}</span>
								<Button
									size="icon"
									variant="ghost"
									className="h-4 w-4 p-0"
									onClick={() => handleRemoveItem(itemId)}
								>
									<X className="h-2 w-2" />
								</Button>
							</div>
						) : null;
					})}
				</div>
			</div>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
				<DialogHeader className="w-full">
					<DialogTitle>{widgetInstructions.title}</DialogTitle>
					<DialogDescription>
						{widgetInstructions.description}
					</DialogDescription>

					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
						<h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
						<ul className="text-sm text-blue-800 space-y-1">
							{widgetInstructions.instructions.map((instruction, index) => (
								<li key={index} className="flex items-start gap-2">
									<span className="text-blue-600 mt-0.5">•</span>
									<span>{instruction}</span>
								</li>
							))}
						</ul>
					</div>
				</DialogHeader>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
					<div className="space-y-4">
						<TitleInput
							value={configData.title}
							onChange={(value) =>
								setConfigData((prev: any) => ({ ...prev, title: value }))
							}
						/>
						<DataSelector
							label="Calculations"
							placeholder="Select calculations"
							selectedItems={configData.selectedCalculations}
							availableItems={availableCalculations}
							onSelectionChange={(selected) =>
								setConfigData((prev: any) => ({
									...prev,
									selectedCalculations: selected,
								}))
							}
							bgColor="bg-blue-100"
							textColor="text-blue-800"
						/>
						<DataSelector
							label="Parameters"
							placeholder="Select parameters"
							selectedItems={configData.selectedParameters}
							availableItems={availableParameters}
							onSelectionChange={(selected) =>
								setConfigData((prev: any) => ({
									...prev,
									selectedParameters: selected,
								}))
							}
							bgColor="bg-green-100"
							textColor="text-green-800"
						/>
					</div>

					<div className="space-y-4">
						<h3 className="font-medium text-gray-900">Preview</h3>
						{previewWidget ? (
							<div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
								<div className="h-[300px]">{renderWidget(previewWidget)}</div>
							</div>
						) : (
							<div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-[300px] flex items-center justify-center">
								<p className="text-gray-500 text-sm">
									Configure data sources to see preview
								</p>
							</div>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={onSaveConfig}>Save Configuration</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function convertParametersToDataItems(parameters: Parameter[]): DataItem[] {
	return parameters.map((param) => ({
		id: param.id,
		name: param.name,
		value: parseFloat(param.value) || 0,
		units: param.unit || "units",
	}));
}

function convertCalculationsToDataItems(
	calculations: Calculation[]
): DataItem[] {
	return calculations.map((calc) => ({
		id: calc.id,
		name: calc.name,
		value: parseFloat(calc.result?.toString() || "0") || 0,
		units: calc.units || "units",
	}));
}
