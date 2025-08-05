/**
 * Dynamic Widget System for Value Calculator Results
 * Provides flexible, user-customizable dashboard widgets that adapt to any data structure
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
} from "recharts";
import { 
	Target,
	BarChart3,
	PieChart as PieChartIcon,
	Activity,
	Gauge,
	TrendingUp,
	Info,
	Building2
} from "lucide-react";
import { formatCurrency } from "./formatters";

// Widget Types
export type WidgetType = 
	| 'kpi-card'
	| 'pie-chart'
	| 'bar-chart'
	| 'line-chart'
	| 'area-chart'
	| 'radar-chart'
	| 'data-table'
	| 'progress-chart'
	| 'summary-card';

// Widget Configuration
export interface WidgetConfig {
	id: string;
	type: WidgetType;
	title: string;
	description?: string;
	dataSource: {
		calculations?: string[];
		parameters?: string[];
	};
	displayOptions: {
		showLegend?: boolean;
		showGrid?: boolean;
		height?: number;
		width?: 'full' | 'half' | 'third';
	};
	position: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
	isVisible: boolean;
}

// Data Source Types
export interface DataSource {
	calculations: Array<{ name: string; result: number | string; units?: string; category?: string }>;
	parameters: Array<{ name: string; test_value: number | string; units?: string; category?: string }>;
}

// Widget Props
export interface WidgetProps {
	config: WidgetConfig;
	data: DataSource;
	onConfigChange?: (config: WidgetConfig) => void;
	onDelete?: (widgetId: string) => void;
	isEditing?: boolean;
}

// Widget Registry
export const WIDGET_TYPES: Record<WidgetType, {
	name: string;
	description: string;
	icon: any;
	categories: string[];
	defaultConfig: Partial<WidgetConfig>;
}> = {
	'kpi-card': {
		name: 'KPI Card',
		description: 'Display key performance indicators with trends',
		icon: Target,
		categories: ['financial', 'operational', 'environmental'],
		defaultConfig: {
			displayOptions: { height: 120, width: 'third' },
			position: { x: 0, y: 0, w: 4, h: 1 }
		}
	},
	'pie-chart': {
		name: 'Pie Chart',
		description: 'Show data distribution and proportions',
		icon: PieChartIcon,
		categories: ['financial', 'operational', 'environmental'],
		defaultConfig: {
			displayOptions: { showLegend: true, height: 300, width: 'half' },
			position: { x: 0, y: 0, w: 6, h: 2 }
		}
	},
	'bar-chart': {
		name: 'Bar Chart',
		description: 'Compare values across categories',
		icon: BarChart3,
		categories: ['financial', 'operational', 'environmental'],
		defaultConfig: {
			displayOptions: { showGrid: true, height: 300, width: 'half' },
			position: { x: 0, y: 0, w: 6, h: 2 }
		}
	},
	'line-chart': {
		name: 'Line Chart',
		description: 'Show trends over time or sequences',
		icon: TrendingUp,
		categories: ['operational', 'environmental'],
		defaultConfig: {
			displayOptions: { showGrid: true, height: 300, width: 'half' },
			position: { x: 0, y: 0, w: 6, h: 2 }
		}
	},
	'area-chart': {
		name: 'Area Chart',
		description: 'Display cumulative data over time',
		icon: Activity,
		categories: ['financial', 'operational'],
		defaultConfig: {
			displayOptions: { showGrid: true, height: 300, width: 'half' },
			position: { x: 0, y: 0, w: 6, h: 2 }
		}
	},
	'radar-chart': {
		name: 'Radar Chart',
		description: 'Compare multiple metrics on different axes',
		icon: Gauge,
		categories: ['operational', 'environmental'],
		defaultConfig: {
			displayOptions: { height: 300, width: 'half' },
			position: { x: 0, y: 0, w: 6, h: 2 }
		}
	},
	'data-table': {
		name: 'Data Table',
		description: 'Display detailed data in tabular format',
		icon: Info,
		categories: ['financial', 'operational', 'environmental'],
		defaultConfig: {
			displayOptions: { height: 400, width: 'full' },
			position: { x: 0, y: 0, w: 12, h: 3 }
		}
	},
	'progress-chart': {
		name: 'Progress Chart',
		description: 'Show progress towards goals or targets',
		icon: Target,
		categories: ['operational', 'environmental'],
		defaultConfig: {
			displayOptions: { height: 200, width: 'third' },
			position: { x: 0, y: 0, w: 4, h: 1 }
		}
	},
	'summary-card': {
		name: 'Summary Card',
		description: 'Display summary information with key metrics',
		icon: Info,
		categories: ['financial', 'operational', 'environmental'],
		defaultConfig: {
			displayOptions: { height: 200, width: 'half' },
			position: { x: 0, y: 0, w: 6, h: 2 }
		}
	}
};

// Utility Functions
export function extractNumericValue(value: any): number {
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? 0 : parsed;
	}
	return 0;
}

export function categorizeData(data: DataSource): Record<string, any[]> {
	const categories: Record<string, any[]> = {
		financial: [],
		operational: [],
		environmental: [],
		infrastructure: [],
		other: []
	};

	// Categorize calculations
	data.calculations.forEach(calc => {
		const name = calc.name.toLowerCase();
		if (name.includes('cost') || name.includes('capex') || name.includes('opex') || name.includes('price')) {
			categories.financial.push(calc);
		} else if (name.includes('power') || name.includes('energy') || name.includes('efficiency')) {
			categories.operational.push(calc);
		} else if (name.includes('carbon') || name.includes('water') || name.includes('emission')) {
			categories.environmental.push(calc);
		} else if (name.includes('rack') || name.includes('capacity') || name.includes('infrastructure')) {
			categories.infrastructure.push(calc);
		} else {
			categories.other.push(calc);
		}
	});

	// Categorize parameters
	data.parameters.forEach(param => {
		const name = param.name.toLowerCase();
		if (name.includes('cost') || name.includes('price')) {
			categories.financial.push(param);
		} else if (name.includes('power') || name.includes('efficiency') || name.includes('utilization')) {
			categories.operational.push(param);
		} else if (name.includes('carbon') || name.includes('water') || name.includes('co2')) {
			categories.environmental.push(param);
		} else if (name.includes('rack') || name.includes('capacity')) {
			categories.infrastructure.push(param);
		} else {
			categories.other.push(param);
		}
	});

	return categories;
}

export function generateChartData(widget: WidgetConfig, data: DataSource): any[] {
	const { dataSource } = widget;
	const chartData: any[] = [];

	// Extract data based on widget configuration - use exact matches
	const selectedCalculations = data.calculations.filter(calc => 
		dataSource.calculations?.includes(calc.name)
	);

	const selectedParameters = data.parameters.filter(param => 
		dataSource.parameters?.includes(param.name)
	);

	// Generate appropriate data structure based on widget type
	switch (widget.type) {
		case 'pie-chart':
			return selectedCalculations.map((calc, index) => ({
				name: calc.name,
				value: extractNumericValue(calc.result),
				color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'][index % 5]
			}));

		case 'bar-chart':
			return selectedCalculations.map(calc => ({
				category: calc.name,
				current: extractNumericValue(calc.result),
				proposed: extractNumericValue(calc.result) * 0.8, // Example comparison
				value: extractNumericValue(calc.result)
			}));

		case 'line-chart':
			return Array.from({ length: 12 }, (_, i) => ({
				month: i + 1,
				...selectedCalculations.reduce((acc, calc) => ({
					...acc,
					[calc.name]: extractNumericValue(calc.result) * (0.8 + Math.random() * 0.4)
				}), {})
			}));

		case 'area-chart':
			return Array.from({ length: 10 }, (_, i) => ({
				year: i + 1,
				cumulative: selectedCalculations.reduce((sum, calc) => 
					sum + extractNumericValue(calc.result) * (i + 1), 0
				),
				annual: selectedCalculations.reduce((sum, calc) => 
					sum + extractNumericValue(calc.result), 0
				)
			}));

		case 'radar-chart':
			return selectedCalculations.map(calc => ({
				metric: calc.name,
				value: extractNumericValue(calc.result)
			}));

		default:
			return selectedCalculations.map(calc => ({
				name: calc.name,
				value: extractNumericValue(calc.result),
				units: calc.units
			}));
	}
}

// Widget Components
export function KPICard({ config, data }: WidgetProps) {
	// Use selected calculations from widget configuration
	const selectedCalculations = data.calculations.filter(calc => 
		config.dataSource.calculations?.includes(calc.name)
	);
	
	const selectedParameters = data.parameters.filter(param => 
		config.dataSource.parameters?.includes(param.name)
	);
	
	// Combine calculations and parameters, prioritizing calculations
	const availableMetrics = [...selectedCalculations, ...selectedParameters]
		.filter(item => {
			if ('result' in item) {
				return extractNumericValue(item.result) > 0;
			} else {
				return extractNumericValue(item.test_value) > 0;
			}
		});
	
	const currentMetric = availableMetrics[0];
	const value = currentMetric ? 
		extractNumericValue('result' in currentMetric ? currentMetric.result : currentMetric.test_value) : 0;

	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">{config.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					{formatCurrency(value)}
				</div>
				<div className="text-sm text-muted-foreground">
					{currentMetric?.name || 'No data available'}
				</div>
				{availableMetrics.length > 1 && (
					<div className="text-xs text-gray-500 mt-1">
						+{availableMetrics.length - 1} more metrics
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export function PieChartWidget({ config, data }: WidgetProps) {
	const chartData = generateChartData(config, data);

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="text-sm font-medium">{config.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={config.displayOptions.height || 300}>
					<PieChart>
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
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function BarChartWidget({ config, data }: WidgetProps) {
	const chartData = generateChartData(config, data);

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="text-sm font-medium">{config.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={config.displayOptions.height || 300}>
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="category" />
						<YAxis tickFormatter={(value) => formatCurrency(value)} />
						<Tooltip formatter={(value: any) => formatCurrency(value)} />
						<Legend />
						<Bar dataKey="current" fill="#8884d8" />
						<Bar dataKey="proposed" fill="#82ca9d" />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function DataTableWidget({ config, data }: WidgetProps) {
	// Use selected data sources from widget configuration
	const selectedCalculations = data.calculations.filter(calc => 
		config.dataSource.calculations?.includes(calc.name)
	);
	
	const selectedParameters = data.parameters.filter(param => 
		config.dataSource.parameters?.includes(param.name)
	);
	
	const tableData = [...selectedCalculations, ...selectedParameters]
		.filter(item => {
			if ('result' in item) {
				return item.result !== "Error";
			} else if ('test_value' in item) {
				return item.test_value !== "Error";
			}
			return false;
		});

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="text-sm font-medium">{config.title}</CardTitle>
			</CardHeader>
			<CardContent>
				{tableData.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Metric</TableHead>
								<TableHead>Value</TableHead>
								<TableHead>Units</TableHead>
								<TableHead>Category</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableData.map((item, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">{item.name}</TableCell>
									<TableCell>
										{formatCurrency(extractNumericValue(
											'result' in item ? item.result : item.test_value
										))}
									</TableCell>
									<TableCell>{item.units || '-'}</TableCell>
									<TableCell>
										<Badge variant="outline">
											{item.category || 'Other'}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="text-center py-8 text-gray-500">
						No data selected. Configure this widget to select data sources.
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Widget Factory
export function createWidget(widgetType: WidgetType, title: string, dataSource: any): WidgetConfig {
	const widgetInfo = WIDGET_TYPES[widgetType];
	
	return {
		id: `${widgetType}-${Date.now()}`,
		type: widgetType,
		title,
		description: widgetInfo.description,
		dataSource,
		displayOptions: {
			...widgetInfo.defaultConfig.displayOptions
		},
		position: widgetInfo.defaultConfig.position || { x: 0, y: 0, w: 6, h: 2 },
		isVisible: true
	};
}

// Widget Renderer
export function renderWidget(widget: WidgetConfig, data: DataSource, props: Partial<WidgetProps> = {}) {
	const widgetProps: WidgetProps = {
		config: widget,
		data,
		...props
	};

	switch (widget.type) {
		case 'kpi-card':
			return <KPICard {...widgetProps} />;
		case 'pie-chart':
			return <PieChartWidget {...widgetProps} />;
		case 'bar-chart':
			return <BarChartWidget {...widgetProps} />;
		case 'data-table':
			return <DataTableWidget {...widgetProps} />;
		default:
			return <div>Widget type {widget.type} not implemented</div>;
	}
}
