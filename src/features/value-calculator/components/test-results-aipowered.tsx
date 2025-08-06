"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
	Brain, 
	Lightbulb, 
	TrendingUp, 
	BarChart3, 
	PieChart, 
	Target,
	Activity,
	Zap,
	Info,
	CheckCircle,
	AlertCircle,
	Eye,
	Settings,
	Download,
	Share2,
	RefreshCw,
	Sparkles,
	Calculator,
	ChartBar,
	Gauge,
	Thermometer,
	Leaf,
	Building2,
	Wrench,
	Clock,
	Target as TargetIcon,
	TrendingDown,
	TrendingUp as TrendingUpIcon,
	AlertTriangle,
	CheckSquare,
	XCircle,
	HelpCircle,
	Star,
	StarOff
} from "lucide-react";
import { 
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart as RechartsPieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	AreaChart,
	Area,
	RadarChart,
	Radar,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
} from "recharts";
import { 
	analyzeCalculation, 
	generateAIDashboards, 
	generateAIRecommendations,
	AIAnalysis,
	AIDashboard,
	VisualizationSuggestion
} from "../utils/ai-powered";
import { formatCurrency } from "../utils/formatters";
import { extractNumericValue } from "../utils/widgets";

/**
 * AI-Powered Test Results Component
 * Intelligently analyzes calculation names and suggests appropriate visualizations
 */
export default function TestResultsAIPowered({ solutionData }: { solutionData: any }) {
	const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
	const [showAnalysis, setShowAnalysis] = useState(false);
	const [selectedCalculation, setSelectedCalculation] = useState<any>(null);

	// Process solution data
	const processedData = useMemo(() => {
		if (!solutionData) return { calculations: [], parameters: [] };
		
		return {
			calculations: solutionData.calculations?.filter((calc: any) => calc.result !== "Error") || [],
			parameters: solutionData.parameters || []
		};
	}, [solutionData]);

	// Generate AI analysis
	const aiAnalysis = useMemo(() => {
		if (!processedData.calculations.length) return [];
		return processedData.calculations.map(analyzeCalculation);
	}, [processedData.calculations]);

	// Generate AI dashboards
	const aiDashboards = useMemo(() => {
		return generateAIDashboards(processedData.calculations, processedData.parameters);
	}, [processedData.calculations, processedData.parameters]);

	// Generate AI recommendations
	const aiRecommendations = useMemo(() => {
		return generateAIRecommendations(processedData.calculations, processedData.parameters);
	}, [processedData.calculations, processedData.parameters]);

	// Get category icon
	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'financial': return <TrendingUp className="h-4 w-4" />;
			case 'operational': return <Activity className="h-4 w-4" />;
			case 'environmental': return <Leaf className="h-4 w-4" />;
			case 'infrastructure': return <Building2 className="h-4 w-4" />;
			default: return <Info className="h-4 w-4" />;
		}
	};

	// Get confidence color
	const getConfidenceColor = (confidence: number) => {
		if (confidence > 0.8) return "bg-green-100 text-green-800";
		if (confidence > 0.5) return "bg-yellow-100 text-yellow-800";
		return "bg-red-100 text-red-800";
	};

	// Get priority color
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return "bg-red-100 text-red-800";
			case 'medium': return "bg-yellow-100 text-yellow-800";
			case 'low': return "bg-blue-100 text-blue-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	// Render visualization based on type
	const renderVisualization = (visualization: any, data: any[]) => {
		const chartData = generateChartData(visualization.type, data);
		
		switch (visualization.type) {
			case 'pie-chart':
				return (
					<ResponsiveContainer width="100%" height={300}>
						<RechartsPieChart>
							<Pie
								data={chartData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{chartData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip formatter={(value: any) => formatCurrency(value)} />
						</RechartsPieChart>
					</ResponsiveContainer>
				);

			case 'bar-chart':
				return (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="category" />
							<YAxis tickFormatter={(value) => formatCurrency(value)} />
							<Tooltip formatter={(value: any) => formatCurrency(value)} />
							<Legend />
							<Bar dataKey="value" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				);

			case 'line-chart':
				return (
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis tickFormatter={(value) => formatCurrency(value)} />
							<Tooltip formatter={(value: any) => formatCurrency(value)} />
							<Legend />
							<Line type="monotone" dataKey="value" stroke="#8884d8" />
						</LineChart>
					</ResponsiveContainer>
				);

			case 'kpi-card':
				const kpiData = chartData[0];
				return (
					<div className="text-center p-6">
						<div className="text-3xl font-bold text-blue-600">
							{formatCurrency(kpiData?.value || 0)}
						</div>
						<div className="text-sm text-gray-600 mt-2">
							{kpiData?.name || 'KPI'}
						</div>
					</div>
				);

			default:
				return (
					<div className="text-center py-8 text-gray-500">
						<Info className="h-8 w-8 mx-auto mb-2" />
						<p>Visualization type "{visualization.type}" not implemented</p>
					</div>
				);
		}
	};

	// Generate chart data
	const generateChartData = (type: string, calculations: any[]): any[] => {
		switch (type) {
			case 'pie-chart':
				return calculations.map((calc, index) => ({
					name: calc.name,
					value: extractNumericValue(calc.result),
					color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'][index % 5]
				}));

			case 'bar-chart':
				return calculations.map(calc => ({
					category: calc.name,
					value: extractNumericValue(calc.result)
				}));

			case 'line-chart':
				return Array.from({ length: 12 }, (_, i) => ({
					month: i + 1,
					value: calculations.reduce((sum, calc) => 
						sum + extractNumericValue(calc.result) * (0.8 + Math.random() * 0.4), 0
					)
				}));

			case 'kpi-card':
				const firstCalc = calculations[0];
				return [{
					name: firstCalc?.name || 'KPI',
					value: extractNumericValue(firstCalc?.result || 0)
				}];

			default:
				return calculations.map(calc => ({
					name: calc.name,
					value: extractNumericValue(calc.result)
				}));
		}
	};

	if (!solutionData) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">No solution data available for AI analysis</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* AI Analysis Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Brain className="h-8 w-8 text-blue-600" />
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							AI-Powered Analysis
						</h1>
						<p className="text-gray-600">
							Intelligent insights and visualization suggestions
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => setShowAnalysis(!showAnalysis)}>
						<Brain className="h-4 w-4 mr-2" />
						{showAnalysis ? 'Hide' : 'Show'} Analysis
					</Button>
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="sm">
						<Share2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* AI Recommendations */}
			{aiRecommendations.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lightbulb className="h-5 w-5 text-yellow-600" />
							AI Recommendations
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{aiRecommendations.map((recommendation, index) => (
								<div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
									<Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
									<p className="text-sm text-gray-700">{recommendation}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* AI Analysis Details */}
			{showAnalysis && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calculator className="h-5 w-5 text-purple-600" />
							AI Analysis Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{aiAnalysis.map((analysis: AIAnalysis, index: number) => (
								<div key={index} className="border rounded-lg p-4">
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-2">
											{getCategoryIcon(analysis.category)}
											<h3 className="font-semibold">{analysis.calculationName}</h3>
											<Badge className={getConfidenceColor(analysis.confidence)}>
												{(analysis.confidence * 100).toFixed(0)}% confidence
											</Badge>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSelectedCalculation(analysis)}
										>
											<Settings className="h-4 w-4" />
										</Button>
									</div>
									
									<p className="text-sm text-gray-600 mb-3">{analysis.reasoning}</p>
									
									<div className="space-y-2">
										<h4 className="text-sm font-medium">Suggested Visualizations:</h4>
										<div className="flex flex-wrap gap-2">
											{analysis.suggestedVisualizations.map((suggestion: VisualizationSuggestion, idx: number) => (
												<Badge
													key={idx}
													variant="outline"
													className={`flex items-center gap-1 ${getPriorityColor(suggestion.priority)}`}
												>
													{getVisualizationIcon(suggestion.type)}
													{suggestion.title}
													<span className="text-xs">
														({(suggestion.confidence * 100).toFixed(0)}%)
													</span>
												</Badge>
											))}
										</div>
									</div>
									
									{analysis.insights.length > 0 && (
										<div className="mt-3">
											<h4 className="text-sm font-medium mb-2">Insights:</h4>
											<div className="space-y-1">
												{analysis.insights.map((insight: string, idx: number) => (
													<div key={idx} className="flex items-start gap-2 text-sm">
														<CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
														<span className="text-gray-700">{insight}</span>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* AI-Generated Dashboards */}
			{aiDashboards.length > 0 && (
				<Tabs value={selectedDashboard || aiDashboards[0]?.id} onValueChange={setSelectedDashboard}>
					<TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
						{aiDashboards.map((dashboard) => (
							<TabsTrigger key={dashboard.id} value={dashboard.id} className="flex items-center gap-2">
								{getCategoryIcon(dashboard.category)}
								{dashboard.title}
							</TabsTrigger>
						))}
					</TabsList>
					
					{aiDashboards.map((dashboard) => (
						<TabsContent key={dashboard.id} value={dashboard.id}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Brain className="h-5 w-5 text-blue-600" />
										{dashboard.title}
									</CardTitle>
									<p className="text-sm text-gray-600">{dashboard.description}</p>
									<div className="flex items-center gap-2 mt-2">
										<Badge variant="outline">
											{dashboard.audience} audience
										</Badge>
										<Badge className={getConfidenceColor(dashboard.priority)}>
											{(dashboard.priority * 100).toFixed(0)}% priority
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
										{dashboard.visualizations.map((visualization) => (
											<Card key={visualization.id} className="h-full">
												<CardHeader className="pb-2">
													<CardTitle className="text-sm font-medium">
														{visualization.title}
													</CardTitle>
													<p className="text-xs text-gray-600">
														{visualization.description}
													</p>
												</CardHeader>
												<CardContent>
													{renderVisualization(visualization, processedData.calculations)}
												</CardContent>
											</Card>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					))}
				</Tabs>
			)}

			{/* Calculation Analysis Dialog */}
			{selectedCalculation && (
				<Dialog open={!!selectedCalculation} onOpenChange={() => setSelectedCalculation(null)}>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<Brain className="h-5 w-5 text-blue-600" />
								AI Analysis: {selectedCalculation.calculationName}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="font-medium mb-2">Analysis Details</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span>Category:</span>
											<Badge variant="outline">{selectedCalculation.category}</Badge>
										</div>
										<div className="flex justify-between">
											<span>Confidence:</span>
											<Badge className={getConfidenceColor(selectedCalculation.confidence)}>
												{(selectedCalculation.confidence * 100).toFixed(0)}%
											</Badge>
										</div>
										<div className="flex justify-between">
											<span>Reasoning:</span>
											<span className="text-gray-600">{selectedCalculation.reasoning}</span>
										</div>
									</div>
								</div>
								<div>
									<h4 className="font-medium mb-2">Insights</h4>
									<div className="space-y-1">
										{selectedCalculation.insights.map((insight: string, index: number) => (
											<div key={index} className="flex items-start gap-2 text-sm">
												<CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
												<span>{insight}</span>
											</div>
										))}
									</div>
								</div>
							</div>
							
							<div>
								<h4 className="font-medium mb-2">Visualization Suggestions</h4>
								<div className="space-y-2">
									{selectedCalculation.suggestedVisualizations.map((suggestion: VisualizationSuggestion, index: number) => (
										<div key={index} className="border rounded-lg p-3">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													{getVisualizationIcon(suggestion.type)}
													<span className="font-medium">{suggestion.title}</span>
												</div>
												<Badge className={getPriorityColor(suggestion.priority)}>
													{suggestion.priority}
												</Badge>
											</div>
											<p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
											<div className="flex items-center justify-between text-xs text-gray-500">
												<span>Confidence: {(suggestion.confidence * 100).toFixed(0)}%</span>
												<span>{suggestion.reasoning}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

// Helper function to get visualization icon
function getVisualizationIcon(type: string) {
	switch (type) {
		case 'pie-chart': return <PieChart className="h-4 w-4" />;
		case 'bar-chart': return <BarChart3 className="h-4 w-4" />;
		case 'line-chart': return <TrendingUpIcon className="h-4 w-4" />;
		case 'area-chart': return <Activity className="h-4 w-4" />;
		case 'radar-chart': return <Gauge className="h-4 w-4" />;
		case 'kpi-card': return <TargetIcon className="h-4 w-4" />;
		case 'data-table': return <ChartBar className="h-4 w-4" />;
		default: return <Info className="h-4 w-4" />;
	}
}
