import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function ComparisonView() {
	const comparisonData = [
		{
			calculator: "UPS Efficiency Comparison",
			vendor: "Schneider Electric",
			tco: "$125,000",
			capex: "$85,000",
			opex: "$40,000",
			payback: "2.3 years",
			co2e: "45 tonnes",
			ranking: 1,
			trend: "up",
		},
		{
			calculator: "Alternative UPS Solution",
			vendor: "Generic Vendor",
			tco: "$145,000",
			capex: "$90,000",
			opex: "$55,000",
			payback: "3.1 years",
			co2e: "62 tonnes",
			ranking: 2,
			trend: "down",
		},
		{
			calculator: "Legacy UPS System",
			vendor: "Legacy Provider",
			tco: "$165,000",
			capex: "$95,000",
			opex: "$70,000",
			payback: "4.2 years",
			co2e: "78 tonnes",
			ranking: 3,
			trend: "same",
		},
	];

	const chartData = [
		{ name: "CAPEX", schneider: 85000, generic: 90000, legacy: 95000 },
		{ name: "OPEX (5yr)", schneider: 40000, generic: 55000, legacy: 70000 },
		{ name: "TCO", schneider: 125000, generic: 145000, legacy: 165000 },
	];

	const co2Data = [
		{ year: "Year 1", schneider: 9, generic: 12, legacy: 16 },
		{ year: "Year 2", schneider: 18, generic: 25, legacy: 31 },
		{ year: "Year 3", schneider: 27, generic: 37, legacy: 47 },
		{ year: "Year 4", schneider: 36, generic: 50, legacy: 62 },
		{ year: "Year 5", schneider: 45, generic: 62, legacy: 78 },
	];

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "up":
				return <TrendingUp className="h-4 w-4 text-green-500" />;
			case "down":
				return <TrendingDown className="h-4 w-4 text-red-500" />;
			default:
				return <Minus className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Comparison View</h1>
					<p className="text-muted-foreground">
						Side-by-side analysis of TCO, CAPEX, OPEX, payback, CO₂e and vendor
						rankings
					</p>
				</div>
				<Button>Export Report</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Best TCO</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$125,000</div>
						<p className="text-xs text-muted-foreground">
							Schneider Electric UPS
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Fastest Payback
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2.3 years</div>
						<p className="text-xs text-muted-foreground">
							Schneider Electric UPS
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Lowest CO₂e</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">45 tonnes</div>
						<p className="text-xs text-muted-foreground">
							Schneider Electric UPS
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Detailed Comparison Table</CardTitle>
					<CardDescription>
						Complete side-by-side analysis of all evaluated solutions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Solution</TableHead>
								<TableHead>Vendor</TableHead>
								<TableHead>TCO</TableHead>
								<TableHead>CAPEX</TableHead>
								<TableHead>OPEX (5yr)</TableHead>
								<TableHead>Payback</TableHead>
								<TableHead>CO₂e (5yr)</TableHead>
								<TableHead>Ranking</TableHead>
								<TableHead>Trend</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{comparisonData.map((item, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">
										{item.calculator}
									</TableCell>
									<TableCell>{item.vendor}</TableCell>
									<TableCell>{item.tco}</TableCell>
									<TableCell>{item.capex}</TableCell>
									<TableCell>{item.opex}</TableCell>
									<TableCell>{item.payback}</TableCell>
									<TableCell>{item.co2e}</TableCell>
									<TableCell>
										<Badge
											variant={item.ranking === 1 ? "default" : "secondary"}
										>
											#{item.ranking}
										</Badge>
									</TableCell>
									<TableCell>{getTrendIcon(item.trend)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Cost Comparison</CardTitle>
						<CardDescription>
							CAPEX, OPEX, and Total Cost of Ownership breakdown
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
								<Bar
									dataKey="schneider"
									fill="#8884d8"
									name="Schneider Electric"
								/>
								<Bar dataKey="generic" fill="#82ca9d" name="Generic Vendor" />
								<Bar dataKey="legacy" fill="#ffc658" name="Legacy Provider" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>CO₂e Emissions Over Time</CardTitle>
						<CardDescription>
							Cumulative carbon footprint comparison over 5 years
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={co2Data}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="year" />
								<YAxis />
								<Tooltip formatter={(value) => `${value} tonnes CO₂e`} />
								<Line
									type="monotone"
									dataKey="schneider"
									stroke="#8884d8"
									name="Schneider Electric"
								/>
								<Line
									type="monotone"
									dataKey="generic"
									stroke="#82ca9d"
									name="Generic Vendor"
								/>
								<Line
									type="monotone"
									dataKey="legacy"
									stroke="#ffc658"
									name="Legacy Provider"
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
