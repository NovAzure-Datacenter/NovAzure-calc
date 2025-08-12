"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CogIcon, Settings } from "lucide-react";

// Simple Widget Types
export type WidgetType = "pie" | "bar" | "line" | "area" | "radar" | "table";

// Simple Widget Props
export type WidgetProps = Record<string, never>;

// Demo Data for each widget type
const pieData = [
	{ name: "Revenue", value: 45, color: "#8884d8" },
	{ name: "Growth", value: 25, color: "#82ca9d" },
	{ name: "Efficiency", value: 20, color: "#ffc658" },
	{ name: "Savings", value: 10, color: "#ff7300" },
];

const barData = [
	{ name: "Q1", current: 400, proposed: 350 },
	{ name: "Q2", current: 300, proposed: 280 },
	{ name: "Q3", current: 200, proposed: 180 },
	{ name: "Q4", current: 278, proposed: 250 },
];

const lineData = [
	{ month: "Jan", value: 400 },
	{ month: "Feb", value: 300 },
	{ month: "Mar", value: 200 },
	{ month: "Apr", value: 278 },
	{ month: "May", value: 189 },
	{ month: "Jun", value: 239 },
];

const areaData = [
	{ year: "2020", value: 400 },
	{ year: "2021", value: 300 },
	{ year: "2022", value: 200 },
	{ year: "2023", value: 278 },
	{ year: "2024", value: 189 },
];

const radarData = [
	{ metric: "Revenue", value: 80 },
	{ metric: "Growth", value: 65 },
	{ metric: "Efficiency", value: 90 },
	{ metric: "Savings", value: 75 },
	{ metric: "Cost", value: 60 },
];

const tableData = [
	{
		metric: "Revenue",
		value: "$125K",
		change: "+12%",
		growth: "15%",
		status: "Active",
	},
	{
		metric: "Growth",
		value: "$89K",
		change: "+8%",
		growth: "12%",
		status: "Active",
	},
	{
		metric: "Efficiency",
		value: "$67K",
		change: "+15%",
		growth: "18%",
		status: "Active",
	},
	{
		metric: "Savings",
		value: "$45K",
		change: "+22%",
		growth: "25%",
		status: "Active",
	},
];

// Standalone Demo Widgets for Carousel
export function PieDemo() {
	return (
		<Card className="h-full py-0 gap-0">
			<CardHeader className="pb-1 absolute z-10  select-none">
				<CardTitle className="text-xs font-medium ">Pie Chart</CardTitle>
			</CardHeader>
			<CardContent className="pt-4 ">
				<PieChart width={120} height={120}>
					<Pie
						data={pieData}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={false}
						outerRadius={50}
						fill="#8884d8"
						dataKey="value"
						isAnimationActive={false}
					>
						{pieData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
				</PieChart>
			</CardContent>
		</Card>
	);
}

export function BarDemo() {
	return (
		<Card className="h-full py-0 gap-0">
			<CardHeader className="pb-1 absolute z-10  select-none">
				<CardTitle className="text-xs font-medium ">Bar Chart</CardTitle>
			</CardHeader>
			<CardContent className="pt-4 select-none">
				<BarChart
					width={140}
					height={140}
					data={barData}
					margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
				>
					<XAxis dataKey="name" fontSize={8} />
					<Bar dataKey="current" fill="#8884d8" isAnimationActive={false} />
					<Bar dataKey="proposed" fill="#82ca9d" isAnimationActive={false} />
				</BarChart>
			</CardContent>
		</Card>
	);
}

export function LineDemo() {
	return (
		<Card className="h-full py-0 gap-0">
			<CardHeader className="pb-1 absolute z-10  select-none">
				<CardTitle className="text-xs font-medium ">Line Chart</CardTitle>
			</CardHeader>
			<CardContent className="pt-4 select-none">
				<LineChart
					width={140}
					height={140}
					data={lineData}
					margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
						</linearGradient>
					</defs>
					<XAxis
						dataKey="month"
						fontSize={8}
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#6b7280" }}
					/>
					<Area
						type="monotone"
						dataKey="value"
						stroke="none"
						fill="url(#lineGradient)"
						fillOpacity={0.3}
					/>
					<Line
						type="monotone"
						dataKey="value"
						stroke="#8884d8"
						strokeWidth={3}
						dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
						activeDot={{
							r: 6,
							stroke: "#8884d8",
							strokeWidth: 2,
							fill: "#fff",
						}}
						isAnimationActive={false}
					/>
				</LineChart>
			</CardContent>
		</Card>
	);
}

export function AreaDemo() {
	return (
		<Card className="h-full py-0 gap-0">
			<CardHeader className="pb-1 absolute z-10  select-none">
				<CardTitle className="text-xs font-medium ">Area Chart</CardTitle>
			</CardHeader>
			<CardContent className="pt-4 select-none">
				<AreaChart
					width={140}
					height={140}
					data={areaData}
					margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
				>
					<XAxis dataKey="year" fontSize={8} />
					<Area
						type="monotone"
						dataKey="value"
						stroke="#8884d8"
						fill="#8884d8"
						fillOpacity={0.6}
						isAnimationActive={false}
					/>
				</AreaChart>
			</CardContent>
		</Card>
	);
}

export function RadarDemo() {
	return (
		<Card className="h-full py-0 gap-0">
			<CardHeader className="pb-1 absolute z-10  select-none">
				<CardTitle className="text-xs font-medium ">Radar Chart</CardTitle>
			</CardHeader>
			<CardContent className="pt-4 select-none">
				<RadarChart
					width={140}
					height={140}
					data={radarData}
					margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
				>
					<PolarGrid />
					<PolarAngleAxis dataKey="metric" fontSize={6} />
					<PolarRadiusAxis fontSize={6} />
					<Radar
						name="Metrics"
						dataKey="value"
						stroke="#8884d8"
						fill="#8884d8"
						fillOpacity={0.6}
						isAnimationActive={false}
					/>
				</RadarChart>
			</CardContent>
		</Card>
	);
}

export function TableDemo() {
	return (
		<Card className="h-full py-0 gap-0">
			<CardHeader className="pb-1 absolute z-10">
				<CardTitle className="text-xs font-medium whitespace-nowrap">
					Data Table
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-4 select-none">
				<div className="max-h-[100px] overflow-y-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-xs">Metric</TableHead>
								<TableHead className="text-xs">Value</TableHead>
								<TableHead className="text-xs">Change</TableHead>
								<TableHead className="text-xs">Growth</TableHead>
								<TableHead className="text-xs">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableData.map((item, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium text-xs py-0.5">
										{item.metric}
									</TableCell>
									<TableCell className="text-xs py-0.5">{item.value}</TableCell>
									<TableCell
										className={`text-xs py-0.5 ${
											item.change.startsWith("+")
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{item.change}
									</TableCell>
									<TableCell className="text-xs py-0.5">
										{item.growth}
									</TableCell>
									<TableCell className="text-xs py-0.5">
										<span
											className={`px-1 py-0.5 rounded text-[8px] ${
												item.status === "Active"
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{item.status}
										</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

// Demo registry for easy access
export const demoWidgets = {
	pie: PieDemo,
	bar: BarDemo,
	line: LineDemo,
	area: AreaDemo,
	radar: RadarDemo,
	table: TableDemo,
};

// Helper function to get demo widget component
export function getDemoWidget(type: WidgetType) {
	return demoWidgets[type];
}

// Gray Demo Widgets for Unconfigured State
export function GrayPieDemo() {
	const grayPieData = [
		{ name: "Revenue", value: 45, color: "#9ca3af" },
		{ name: "Growth", value: 25, color: "#9ca3af" },
		{ name: "Efficiency", value: 20, color: "#9ca3af" },
		{ name: "Savings", value: 10, color: "#9ca3af" },
	];

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none bg-gray-50/50">
			<CardHeader className="z-10 pointer-events-none opacity-40">
				<CardTitle className="text-sm font-medium whitespace-nowrap">
					Pie Chart
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none relative">
				<div className="opacity-40">
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={grayPieData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={false}
								outerRadius={80}
								fill="#9ca3af"
								dataKey="value"
								isAnimationActive={false}
							>
								{grayPieData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<p className="text-xs text-gray-600 font-medium">
							Click <Settings className="w-4 h-4 inline-block" /> to configure
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function GrayBarDemo() {
	const grayBarData = [
		{ name: "Q1", value: 400, color: "#9ca3af" },
		{ name: "Q2", value: 300, color: "#9ca3af" },
		{ name: "Q3", value: 200, color: "#9ca3af" },
		{ name: "Q4", value: 278, color: "#9ca3af" },
	];

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none bg-gray-50/50">
			<CardHeader className="z-10 pointer-events-none opacity-40">
				<CardTitle className="text-sm font-medium whitespace-nowrap">
					Bar Chart
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none relative">
				<div className="opacity-40">
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={grayBarData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" fontSize={12} />
							<YAxis fontSize={12} />
							<Bar dataKey="value" fill="#9ca3af" isAnimationActive={false}>
								{grayBarData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<p className="text-xs text-gray-600 font-medium">
							Click <Settings className="w-4 h-4 inline-block" /> to configure
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function GrayLineDemo() {
	const grayLineData = [
		{ month: "Jan", value: 400 },
		{ month: "Feb", value: 300 },
		{ month: "Mar", value: 200 },
		{ month: "Apr", value: 278 },
		{ month: "May", value: 189 },
		{ month: "Jun", value: 239 },
	];

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none bg-gray-50/50">
			<CardHeader className="z-10 pointer-events-none opacity-40">
				<CardTitle className="text-sm font-medium whitespace-nowrap">
					Line Chart
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none relative">
				<div className="opacity-40">
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={grayLineData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" fontSize={12} />
							<YAxis fontSize={12} />
							<Line
								type="monotone"
								dataKey="value"
								stroke="#9ca3af"
								strokeWidth={2}
								isAnimationActive={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<p className="text-xs text-gray-600 font-medium">
							Click <Settings className="w-4 h-4 inline-block" /> to configure
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function GrayAreaDemo() {
	const grayAreaData = [
		{ year: "2020", value: 400 },
		{ year: "2021", value: 300 },
		{ year: "2022", value: 200 },
		{ year: "2023", value: 278 },
		{ year: "2024", value: 189 },
	];

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none bg-gray-50/50">
			<CardHeader className="z-10 pointer-events-none opacity-40">
				<CardTitle className="text-sm font-medium whitespace-nowrap">
					Area Chart
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none relative">
				<div className="opacity-40">
					<ResponsiveContainer width="100%" height={250}>
						<AreaChart data={grayAreaData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="year" fontSize={12} />
							<YAxis fontSize={12} />
							<Area
								type="monotone"
								dataKey="value"
								stroke="#9ca3af"
								fill="#9ca3af"
								fillOpacity={0.3}
								isAnimationActive={false}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<p className="text-xs text-gray-600 font-medium">
							Click <Settings className="w-4 h-4 inline-block" /> to configure
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function GrayRadarDemo() {
	const grayRadarData = [
		{ metric: "Revenue", value: 80 },
		{ metric: "Growth", value: 65 },
		{ metric: "Efficiency", value: 90 },
		{ metric: "Savings", value: 75 },
		{ metric: "Cost", value: 60 },
	];

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none bg-gray-50/50">
			<CardHeader className="z-10 pointer-events-none opacity-40">
				<CardTitle className="text-sm font-medium whitespace-nowrap">
					Radar Chart
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none relative">
				<div className="opacity-40">
					<ResponsiveContainer width="100%" height={250}>
						<RadarChart data={grayRadarData}>
							<PolarGrid />
							<PolarAngleAxis dataKey="metric" fontSize={10} />
							<PolarRadiusAxis fontSize={10} />
							<Radar
								name="Metrics"
								dataKey="value"
								stroke="#9ca3af"
								fill="#9ca3af"
								fillOpacity={0.3}
								isAnimationActive={false}
							/>
						</RadarChart>
					</ResponsiveContainer>
				</div>
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<p className="text-xs text-gray-600 font-medium">
							Click <Settings className="w-4 h-4 inline-block" /> to configure
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function GrayTableDemo() {
	const grayTableData = [
		{
			metric: "Revenue",
			value: "$125K",
			change: "+12%",
			growth: "15%",
			status: "Active",
		},
		{
			metric: "Growth",
			value: "$89K",
			change: "+8%",
			growth: "12%",
			status: "Active",
		},
		{
			metric: "Efficiency",
			value: "$67K",
			change: "+15%",
			growth: "18%",
			status: "Active",
		},
		{
			metric: "Savings",
			value: "$45K",
			change: "+22%",
			growth: "25%",
			status: "Active",
		},
	];

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none bg-gray-50/50">
			<CardHeader className="z-10 pointer-events-none opacity-40">
				<CardTitle className="text-sm font-medium whitespace-nowrap">
					Data Table
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none relative">
				<div className="opacity-40">
					<div className="max-h-[200px] overflow-y-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-sm text-gray-400">
										Metric
									</TableHead>
									<TableHead className="text-sm text-gray-400">Value</TableHead>
									<TableHead className="text-sm text-gray-400">
										Change
									</TableHead>
									<TableHead className="text-sm text-gray-400">
										Growth
									</TableHead>
									<TableHead className="text-sm text-gray-400">
										Status
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{grayTableData.map((item, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium text-sm py-2 text-gray-400">
											{item.metric}
										</TableCell>
										<TableCell className="text-sm py-2 text-gray-400">
											{item.value}
										</TableCell>
										<TableCell className="text-sm py-2 text-gray-400">
											{item.change}
										</TableCell>
										<TableCell className="text-sm py-2 text-gray-400">
											{item.growth}
										</TableCell>
										<TableCell className="text-sm py-2 text-gray-400">
											<span className="px-1 py-0.5 rounded text-xs bg-gray-100 text-gray-400">
												{item.status}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<p className="text-xs text-gray-600 font-medium">
							Click <Settings className="w-4 h-4 inline-block" /> to configure
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Gray demo registry for easy access
export const grayDemoWidgets = {
	pie: GrayPieDemo,
	bar: GrayBarDemo,
	line: GrayLineDemo,
	area: GrayAreaDemo,
	radar: GrayRadarDemo,
	table: GrayTableDemo,
};

// Helper function to get gray demo widget component
export function getGrayDemoWidget(type: WidgetType) {
	return grayDemoWidgets[type];
}

// Widget Configuration Types
export interface WidgetConfig {
	title: string;
	dataSource: {
		calculations?: string[];
		parameters?: string[];
	};
}

export interface DataItem {
	id: string;
	name: string;
	value: number;
	units: string;
}

// Unified Widget Configuration Function
export function ConfiguredWidget({
	type,
	config,
	calculations,
	parameters,
}: {
	type: WidgetType;
	config: WidgetConfig;
	calculations: DataItem[];
	parameters: DataItem[];
}) {
	// Get selected data based on config
	const selectedCalculations = calculations.filter((calc) =>
		config.dataSource.calculations?.includes(calc.id)
	);
	const selectedParameters = parameters.filter((param) =>
		config.dataSource.parameters?.includes(param.id)
	);

	// Combine calculations and parameters
	const allData = [...selectedCalculations, ...selectedParameters];

	// Color palette for charts
	const colors = [
		"#8884d8",
		"#82ca9d",
		"#ffc658",
		"#ff7300",
		"#8dd1e1",
		"#ff6b6b",
		"#4ecdc4",
		"#45b7d1",
	];

	// Render different widget types
	switch (type) {
		case "pie":
			return renderPieWidget(config.title, allData, colors);
		case "bar":
			return renderBarWidget(config.title, allData, colors);
		case "line":
			return renderLineWidget(config.title, allData, colors);
		case "area":
			return renderAreaWidget(config.title, allData, colors);
		case "radar":
			return renderRadarWidget(config.title, allData, colors);
		case "table":
			return renderTableWidget(config.title, allData);
		default:
			return <div>Unsupported widget type</div>;
	}
}

function renderPieWidget(title: string, data: DataItem[], colors: string[]) {
	const pieData = data.map((item, index) => ({
		name: item.name,
		value: item.value,
		color: colors[index % colors.length],
	}));

	const total = pieData.reduce((sum, item) => sum + item.value, 0);

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none">
			<CardHeader className="z-10 pointer-events-none">
				<CardTitle className="text-sm font-medium whitespace-nowrap ">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none">
				<ResponsiveContainer width="100%" height={250}>
					<PieChart>
						<Pie
							data={pieData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({ name, value }) => {
								const percentage = ((value / total) * 100).toFixed(1);
								return `${percentage}%`;
							}}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							isAnimationActive={false}
						>
							{pieData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

function renderBarWidget(title: string, data: DataItem[], colors: string[]) {
	const barData = data.map((item, index) => ({
		name: item.name,
		value: item.value,
		units: item.units,
		color: colors[index % colors.length],
	}));

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none">
			<CardHeader className="z-10 pointer-events-none">
				<CardTitle className="text-sm font-medium whitespace-nowrap ">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none">
				<ResponsiveContainer width="100%" height={250}>
					<BarChart data={barData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" fontSize={12} />
						<YAxis fontSize={12} />
						<Tooltip />
						<Bar dataKey="value" fill={colors[0]} isAnimationActive={false}>
							{barData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

function renderLineWidget(title: string, data: DataItem[], colors: string[]) {
	const lineData = data.map((item, index) => ({
		name: item.name,
		value: item.value,
		units: item.units,
	}));

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none">
			<CardHeader className="z-10 pointer-events-none">
				<CardTitle className="text-sm font-medium whitespace-nowrap ">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none">
				<ResponsiveContainer width="100%" height={250}>
					<LineChart data={lineData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" fontSize={12} />
						<YAxis fontSize={12} />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="value"
							stroke={colors[0]}
							strokeWidth={2}
							dot={{ r: 3 }}
							isAnimationActive={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

function renderAreaWidget(title: string, data: DataItem[], colors: string[]) {
	const areaData = data.map((item, index) => ({
		name: item.name,
		value: item.value,
		units: item.units,
	}));

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none">
			<CardHeader className="z-10 pointer-events-none">
				<CardTitle className="text-sm font-medium whitespace-nowrap ">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none">
				<ResponsiveContainer width="100%" height={250}>
					<AreaChart data={areaData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" fontSize={12} />
						<YAxis fontSize={12} />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="value"
							stroke={colors[0]}
							fill={colors[0]}
							fillOpacity={0.6}
							isAnimationActive={false}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

function renderRadarWidget(title: string, data: DataItem[], colors: string[]) {
	const radarData = data.map((item, index) => ({
		metric: item.name,
		value: item.value,
	}));

	return (
		<Card className="h-full py-2 gap-0 pointer-events-none">
			<CardHeader className="z-10 pointer-events-none">
				<CardTitle className="text-sm font-medium whitespace-nowrap ">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none">
				<ResponsiveContainer width="100%" height={250}>
					<RadarChart data={radarData}>
						<PolarGrid />
						<PolarAngleAxis dataKey="metric" fontSize={10} />
						<PolarRadiusAxis fontSize={10} />
						<Radar
							name="Metrics"
							dataKey="value"
							stroke={colors[0]}
							fill={colors[0]}
							fillOpacity={0.6}
							isAnimationActive={false}
						/>
						<Tooltip />
					</RadarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

function renderTableWidget(title: string, data: DataItem[]) {
	return (
		<Card className="h-full py-2 gap-0 pointer-events-none">
			<CardHeader className="z-10 pointer-events-none">
				<CardTitle className="text-sm font-medium whitespace-nowrap ">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 pb-4 pointer-events-none">
				<div className="max-h-[200px] overflow-y-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-sm">Metric</TableHead>
								<TableHead className="text-sm">Value</TableHead>
								<TableHead className="text-sm">Units</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((item, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium text-sm py-2">
										{item.name}
									</TableCell>
									<TableCell className="text-sm py-2">
										{item.value.toLocaleString()}
									</TableCell>
									<TableCell className="text-sm py-2">{item.units}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

// Legacy widget components (keeping for backward compatibility)
export function PieWidget(): React.JSX.Element {
	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">
					Revenue Distribution
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-2">
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={pieData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							{pieData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function BarWidget(): React.JSX.Element {
	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">
					Quarterly Performance
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={barData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" fontSize={12} />
						<YAxis fontSize={12} />
						<Tooltip />
						<Bar dataKey="current" fill="#8884d8" />
						<Bar dataKey="proposed" fill="#82ca9d" />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function LineWidget(): React.JSX.Element {
	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">Monthly Trends</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={lineData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" fontSize={12} />
						<YAxis fontSize={12} />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="value"
							stroke="#8884d8"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function AreaWidget(): React.JSX.Element {
	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">Cumulative Growth</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={areaData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="year" fontSize={12} />
						<YAxis fontSize={12} />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="value"
							stroke="#8884d8"
							fill="#8884d8"
							fillOpacity={0.6}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function RadarWidget(): React.JSX.Element {
	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">
					Performance Metrics
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<ResponsiveContainer width="100%" height={300}>
					<RadarChart data={radarData}>
						<PolarGrid />
						<PolarAngleAxis dataKey="metric" fontSize={10} />
						<PolarRadiusAxis fontSize={10} />
						<Radar
							name="Metrics"
							dataKey="value"
							stroke="#8884d8"
							fill="#8884d8"
							fillOpacity={0.6}
						/>
						<Tooltip />
					</RadarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function TableWidget(): React.JSX.Element {
	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">
					Financial Overview
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="max-h-[250px] overflow-y-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-sm">Metric</TableHead>
								<TableHead className="text-sm">Value</TableHead>
								<TableHead className="text-sm">Change</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableData.map((item, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium text-sm py-2">
										{item.metric}
									</TableCell>
									<TableCell className="text-sm py-2">{item.value}</TableCell>
									<TableCell
										className={`text-sm py-2 ${
											item.change.startsWith("+")
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{item.change}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

// Widget registry for easy access
export const widgets = {
	pie: PieWidget,
	bar: BarWidget,
	line: LineWidget,
	area: AreaWidget,
	radar: RadarWidget,
	table: TableWidget,
};

// Helper function to get widget component
export function getWidgetComponent(type: WidgetType) {
	return widgets[type];
}
