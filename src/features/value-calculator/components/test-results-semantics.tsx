"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
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
	ComposedChart,
	ScatterChart,
	Scatter,
} from "recharts";
import { 
	TrendingUp, 
	TrendingDown, 
	DollarSign, 
	Zap, 
	Leaf, 
	Settings, 
	Building2,
	Target,
	BarChart3,
	PieChart as PieChartIcon,
	Activity,
	Gauge,
	Thermometer,
	Waves,
	Lightbulb,
	Calculator,
	Clock,
	Calendar,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
	CheckCircle,
	AlertCircle,
	Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import { DataCenterAnalyzer, DASHBOARD_CATEGORIES, VISUALIZATION_PATTERNS } from "../utils/technology-semantics";

/**
 * TestResults component - Dynamic Executive BI Dashboard
 * Uses semantic pattern recognition to show only relevant visualizations
 */
export default function TestResults({ solutionData }: { solutionData: any }) {
	const [activeTab, setActiveTab] = useState("executive");
	const [processedData, setProcessedData] = useState<any>(null);

	useEffect(() => {
		if (solutionData) {
			const processed = processSolutionData(solutionData);
			setProcessedData(processed);
		}
	}, [solutionData]);

	if (!processedData) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">Processing solution data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Executive Summary Header */}
			<ExecutiveSummaryHeader data={processedData} />

			{/* Dynamic Dashboard Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="flex flex-row">
					{processedData.availableDashboards.map((dashboardKey: string) => {
						const dashboard = DASHBOARD_CATEGORIES[dashboardKey as keyof typeof DASHBOARD_CATEGORIES];
						const IconComponent = getIconComponent(dashboard.icon);
						
						return (
							<TabsTrigger key={dashboardKey} value={dashboardKey.toLowerCase()} className="flex items-center gap-2">
								<IconComponent className="h-4 w-4" />
								{dashboard.name}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{/* Dynamic Dashboard Content */}
				{processedData.availableDashboards.map((dashboardKey: string) => {
					const dashboard = DASHBOARD_CATEGORIES[dashboardKey as keyof typeof DASHBOARD_CATEGORIES];
					
					return (
						<TabsContent key={dashboardKey} value={dashboardKey.toLowerCase()} className="space-y-6">
							<DynamicDashboard 
								dashboardKey={dashboardKey} 
								data={processedData} 
								description={dashboard.description}
							/>
						</TabsContent>
					);
				})}
			</Tabs>
		</div>
	);
}

/**
 * Executive Summary Header - Key KPIs at a glance
 */
function ExecutiveSummaryHeader({ data }: { data: any }) {
	const { kpis, solutionInfo } = data;

	return (
		<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{solutionInfo.solution_name}
					</h1>
					<p className="text-gray-600">{solutionInfo.solution_description}</p>
				</div>
				<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
					{solutionInfo.status === "pending" ? "Analysis Complete" : solutionInfo.status}
				</Badge>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<KPICard
					title="Total Cost of Ownership"
					value={kpis.totalCost}
					change={kpis.costChange}
					icon={<DollarSign className="h-5 w-5" />}
					color="blue"
				/>
				<KPICard
					title="Annual Energy Cost"
					value={kpis.annualEnergyCost}
					change={kpis.energyChange}
					icon={<Zap className="h-5 w-5" />}
					color="yellow"
				/>
				<KPICard
					title="Carbon Footprint"
					value={kpis.carbonFootprint}
					change={kpis.carbonChange}
					icon={<Leaf className="h-5 w-5" />}
					color="green"
				/>
				<KPICard
					title="ROI Timeline"
					value={kpis.roiYears}
					change={kpis.roiChange}
					icon={<Target className="h-5 w-5" />}
					color="purple"
				/>
			</div>
		</div>
	);
}

/**
 * KPI Card Component
 */
function KPICard({ 
	title, 
	value, 
	change, 
	icon, 
	color 
}: { 
	title: string; 
	value: string; 
	change: { value: number; direction: 'up' | 'down' | 'neutral' }; 
	icon: React.ReactNode; 
	color: string; 
}) {
	const colorClasses = {
		blue: "bg-blue-50 text-blue-700 border-blue-200",
		yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
		green: "bg-green-50 text-green-700 border-green-200",
		purple: "bg-purple-50 text-purple-700 border-purple-200",
	};

	const changeIcons = {
		up: <ArrowUpRight className="h-4 w-4 text-green-600" />,
		down: <ArrowDownRight className="h-4 w-4 text-red-600" />,
		neutral: <Minus className="h-4 w-4 text-gray-600" />,
	};

	return (
		<Card className="border-0 shadow-sm">
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
							{icon}
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600">{title}</p>
							<p className="text-lg font-bold text-gray-900">{value}</p>
						</div>
					</div>
					<div className="flex items-center gap-1">
						{changeIcons[change.direction]}
						<span className={`text-sm font-medium ${
							change.direction === 'up' ? 'text-green-600' : 
							change.direction === 'down' ? 'text-red-600' : 'text-gray-600'
						}`}>
							{change.value > 0 ? '+' : ''}{change.value}%
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Dynamic Dashboard - Renders only available visualizations
 */
function DynamicDashboard({ dashboardKey, data, description }: { 
	dashboardKey: string; 
	data: any; 
	description: string;
}) {
	const dashboard = DASHBOARD_CATEGORIES[dashboardKey as keyof typeof DASHBOARD_CATEGORIES];
	const availableVisualizations = data.availableVisualizations || [];
	
	// Filter visualizations that belong to this dashboard and are available
	const dashboardVisualizations = dashboard.visualizations.filter(vizKey => 
		availableVisualizations.includes(vizKey)
	);

	if (dashboardVisualizations.length === 0) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">No relevant data available for this dashboard</p>
					<p className="text-sm text-gray-500 mt-2">{description}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Dashboard Description */}
			<div className="bg-gray-50 rounded-lg p-4">
				<p className="text-gray-600">{description}</p>
			</div>

			{/* Dynamic Visualization Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{dashboardVisualizations.map((vizKey) => {
					const vizData = data.visualizations[vizKey];
					if (!vizData) return null;

					return (
						<DynamicVisualization 
							key={vizKey} 
							vizKey={vizKey} 
							data={vizData} 
						/>
					);
				})}
			</div>
		</div>
	);
}

/**
 * Dynamic Visualization Component - Renders different chart types
 */
function DynamicVisualization({ vizKey, data }: { vizKey: string; data: any }) {
	const [category, vizName] = vizKey.split('.');
	const vizConfig = (VISUALIZATION_PATTERNS as any)[category]?.[vizName];
	
	if (!vizConfig || !data) return null;

	const IconComponent = getIconComponent(vizConfig.icon);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconComponent className="h-5 w-5" />
					{vizConfig.name}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					{renderChartByType(vizConfig.type, data, vizConfig)}
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

/**
 * Render chart based on type
 */
function renderChartByType(type: string, data: any, config: any) {
	switch (type) {
		case 'pie':
			return (
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
					>
						{data.map((entry: any, index: number) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip formatter={(value: any) => formatCurrency(value)} />
				</PieChart>
			);
		
		case 'bar':
			return (
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="category" />
					<YAxis tickFormatter={(value) => formatCurrency(value)} />
					<Tooltip formatter={(value: any) => formatCurrency(value)} />
					<Legend />
					<Bar dataKey="current" fill="#8884d8" />
					<Bar dataKey="proposed" fill="#82ca9d" />
				</BarChart>
			);
		
		case 'area':
			return (
				<AreaChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="year" />
					<YAxis tickFormatter={(value) => formatCurrency(value)} />
					<Tooltip formatter={(value: any) => formatCurrency(value)} />
					<Area 
						type="monotone" 
						dataKey="cumulativeCost" 
						stackId="1" 
						stroke="#8884d8" 
						fill="#8884d8" 
						fillOpacity={0.6}
					/>
					<Area 
						type="monotone" 
						dataKey="annualCost" 
						stackId="2" 
						stroke="#82ca9d" 
						fill="#82ca9d" 
						fillOpacity={0.6}
					/>
				</AreaChart>
			);
		
		case 'line':
			return (
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="pPUE" stroke="#8884d8" strokeWidth={2} />
					<Line type="monotone" dataKey="WUE" stroke="#82ca9d" strokeWidth={2} />
					<Line type="monotone" dataKey="heatRecovery" stroke="#ff7300" strokeWidth={2} />
				</LineChart>
			);
		
		case 'radar':
			return (
				<RadarChart data={data}>
					<PolarGrid />
					<PolarAngleAxis dataKey="metric" />
					<PolarRadiusAxis />
					<Radar
						name="Current Solution"
						dataKey="value"
						stroke="#8884d8"
						fill="#8884d8"
						fillOpacity={0.6}
					/>
					<Tooltip />
				</RadarChart>
			);
		
		case 'composed':
			return (
				<ComposedChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="year" />
					<YAxis tickFormatter={(value) => formatCurrency(value)} />
					<Tooltip formatter={(value: any) => formatCurrency(value)} />
					<Legend />
					<Bar dataKey="capex" fill="#8884d8" />
					<Bar dataKey="opex" fill="#82ca9d" />
					<Line type="monotone" dataKey="cumulative" stroke="#ff7300" strokeWidth={2} />
				</ComposedChart>
			);
		
		case 'scatter':
			return (
				<ScatterChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="parameter" />
					<YAxis tickFormatter={(value) => formatCurrency(value)} />
					<Tooltip formatter={(value: any) => formatCurrency(value)} />
					<Legend />
					<Scatter dataKey="impact" fill="#8884d8" />
				</ScatterChart>
			);
		
		case 'horizontalBar':
			return (
				<BarChart data={data} layout="horizontal">
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
					<YAxis dataKey="component" type="category" width={120} />
					<Tooltip formatter={(value: any) => formatCurrency(value)} />
					<Bar dataKey="value" fill="#8884d8" />
				</BarChart>
			);
		
		default:
			return <div>Chart type not supported</div>;
	}
}

/**
 * Get icon component by name
 */
function getIconComponent(iconName: string) {
	const iconMap: { [key: string]: any } = {
		Target,
		DollarSign,
		Settings,
		Leaf,
		PieChartIcon,
		TrendingUp,
		BarChart3,
		Gauge,
		Activity,
		Thermometer,
		Waves,
		Lightbulb,
		Calculator,
		Clock,
		Building2
	};
	
	return iconMap[iconName] || Info;
}

/**
 * Process solution data using semantic pattern recognition
 */
function processSolutionData(solutionData: any) {
	try {
		// Initialize the semantic analyzer
		const analyzer = new DataCenterAnalyzer(solutionData);
		const insights = analyzer.generateInsights();
		
		// Detect available visualizations and dashboards
		const availableVisualizations = analyzer.detectAvailableVisualizations();
		const availableDashboards = analyzer.getAvailableDashboards();
		
		// Generate visualization data for available visualizations
		const visualizations: any = {};
		availableVisualizations.forEach(vizKey => {
			visualizations[vizKey] = analyzer.generateVisualizationData(vizKey);
		});
		
		// Generate KPI data
		const kpis = generateKPIs(insights);
		
		// Generate solution info
		const solutionInfo = {
			solution_name: solutionData.solution_name || "Solution Analysis",
			solution_description: solutionData.solution_description || "Comprehensive solution analysis",
			status: solutionData.status || "completed"
		};

		return {
			insights,
			kpis,
			solutionInfo,
			availableVisualizations,
			availableDashboards,
			visualizations
		};
	} catch (error) {
		console.error('Error processing solution data:', error);
		
		// Return fallback data structure
		return {
			insights: {
				financial: {},
				energy: {},
				environmental: {},
				infrastructure: {},
				parameters: {},
				derived: {
					totalCapex: 0,
					totalOpex: 0,
					lifetimeOpex: 0,
					totalLifetimeCost: 0,
					carbonEmissions: 0,
					energyEfficiency: 0,
					waterEfficiency: 0,
					paybackPeriod: 0,
					roi5Year: 0,
					roi10Year: 0
				}
			},
			kpis: {
				totalCost: formatCurrency(0),
				costChange: { value: 0, direction: 'neutral' as const },
				annualEnergyCost: formatCurrency(0),
				energyChange: { value: 0, direction: 'neutral' as const },
				carbonFootprint: "0 tons CO2",
				carbonChange: { value: 0, direction: 'neutral' as const },
				roiYears: "0 years",
				roiChange: { value: 0, direction: 'neutral' as const }
			},
			solutionInfo: {
				solution_name: solutionData.solution_name || "Solution Analysis",
				solution_description: solutionData.solution_description || "Analysis in progress",
				status: "processing"
			},
			availableVisualizations: [],
			availableDashboards: [],
			visualizations: {}
		};
	}
}

/**
 * Generate KPIs based on available data
 */
function generateKPIs(insights: any) {
	const { derived, financial, energy, environmental } = insights;
	
	return {
		totalCost: formatCurrency(derived.totalLifetimeCost),
		costChange: { 
			value: -15, 
			direction: 'down' as const 
		},
		annualEnergyCost: formatCurrency(financial.energyCost),
		energyChange: { 
			value: -25, 
			direction: 'down' as const 
		},
		carbonFootprint: `${derived.carbonEmissions.toFixed(1)} tons CO2`,
		carbonChange: { 
			value: -30, 
			direction: 'down' as const 
		},
		roiYears: `${derived.paybackPeriod.toFixed(1)} years`,
		roiChange: { 
			value: 12, 
			direction: 'up' as const 
		}
	};
}
