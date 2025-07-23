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
import { comparisonData } from "./mock-data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

// Prepare data for charts
const chartData = comparisonData.map(item => ({
	name: item.metric,
	airCooling: parseFloat(item.airCooling.replace(/,/g, '')),
	liquidCooling: parseFloat(item.liquidCooling.replace(/,/g, '')),
	difference: parseFloat(item.difference.replace(/,/g, '')),
	percentChange: parseFloat(item.percentChange.replace('%', '')),
}));

const pieData = [
	{ name: 'Air Cooling Capex', value: 7865088, color: '#374151' },
	{ name: 'Air Cooling Opex', value: 13987457, color: '#6b7280' },
	{ name: 'Liquid Cooling Capex', value: 6732070, color: '#111827' },
	{ name: 'Liquid Cooling Opex', value: 16415481, color: '#4b5563' },
];

const yearlyData = [
	{ year: 'Year 1', airCooling: 822497, liquidCooling: 984365 },
	{ year: 'Year 2', airCooling: 822497, liquidCooling: 984365 },
	{ year: 'Year 3', airCooling: 822497, liquidCooling: 984365 },
	{ year: 'Year 4', airCooling: 822497, liquidCooling: 984365 },
	{ year: 'Year 5', airCooling: 822497, liquidCooling: 984365 },
];

export default function ValueCalculatorComparison({
    hasCalculated,
    selectedIndustry,
    selectedTechnology,
    selectedSolution,
    solutionVariantA,
    solutionVariantB,
}: {
    hasCalculated: boolean;
    selectedIndustry: string;
    selectedTechnology: string;
    selectedSolution: string;
    solutionVariantA: string;
    solutionVariantB: string;
}) {
    const getDifferenceColor = (difference: string) => {
        const value = parseFloat(difference.replace(/[^0-9.-]/g, ''));
        if (value < 0) return "text-green-600"; // Negative difference is good (cost savings)
        if (value > 0) return "text-red-600"; // Positive difference is bad (cost increase)
        return "text-gray-600";
    };

    const getPercentChangeColor = (percentChange: string) => {
        const value = parseFloat(percentChange.replace(/[^0-9.-]/g, ''));
        if (value < 0) return "text-green-600"; // Negative change is good (cost savings)
        if (value > 0) return "text-red-600"; // Positive change is bad (cost increase)
        return "text-gray-600";
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: ${entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        hasCalculated ? (
            <div className="space-y-6">
                {/* Configuration Summary */}
                <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-4 text-muted-foreground">Configuration Summary</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Air Cooling (Variant A) Configuration */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                <h4 className="text-sm font-medium text-gray-900">Air Cooling (Variant A)</h4>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Industry:</span>
                                    <span className="font-medium">{selectedIndustry || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Technology:</span>
                                    <span className="font-medium">{selectedTechnology || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Solution:</span>
                                    <span className="font-medium">{selectedSolution || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Variant:</span>
                                    <span className="font-medium">{solutionVariantA || "Not selected"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Liquid Cooling (Variant B) Configuration */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-3 bg-black rounded-full"></div>
                                <h4 className="text-sm font-medium text-gray-900">Liquid Cooling (Variant B)</h4>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Industry:</span>
                                    <span className="font-medium">{selectedIndustry || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Technology:</span>
                                    <span className="font-medium">{selectedTechnology || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Solution:</span>
                                    <span className="font-medium">{selectedSolution || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Variant:</span>
                                    <span className="font-medium">{solutionVariantB || "Not selected"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="border rounded-md">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                    <TableHead className="w-48 bg-background font-medium">Metric</TableHead>
                                    <TableHead className="w-32 bg-background font-medium text-center">
                                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                            Air Cooling
                                        </Badge>
                                    </TableHead>
                                    <TableHead className="w-32 bg-background font-medium text-center">
                                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                            Liquid Cooling
                                        </Badge>
                                    </TableHead>
                                    <TableHead className="w-32 bg-background font-medium text-center">Difference</TableHead>
                                    <TableHead className="w-24 bg-background font-medium text-center">% Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comparisonData.map((row, index) => (
                                    <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium">
                                            {row.metric}
                                        </TableCell>
                                        <TableCell className="text-center font-mono">
                                            ${row.airCooling}
                                        </TableCell>
                                        <TableCell className="text-center font-mono">
                                            ${row.liquidCooling}
                                        </TableCell>
                                        <TableCell className={`text-center font-mono ${getDifferenceColor(row.difference)}`}>
                                            {row.difference.startsWith('-') ? row.difference : `+${row.difference}`}
                                        </TableCell>
                                        <TableCell className={`text-center font-mono ${getPercentChangeColor(row.percentChange)}`}>
                                            {row.percentChange}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Charts and Graphs */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Visual Analysis</h3>
                    
                    {/* Bar Chart - Capex vs Opex Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Capex vs Opex Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData.slice(0, 4)}>
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis 
                                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                        fontSize={12}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="airCooling" fill="#374151" name="Air Cooling" />
                                    <Bar dataKey="liquidCooling" fill="#111827" name="Liquid Cooling" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Line Chart - Annual Opex Over Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Annual Operating Expenses Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={yearlyData}>
                                    <XAxis dataKey="year" fontSize={12} />
                                    <YAxis 
                                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                                        fontSize={12}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="airCooling" 
                                        stroke="#374151" 
                                        strokeWidth={2}
                                        name="Air Cooling"
                                        dot={{ fill: '#374151', strokeWidth: 2, r: 4 }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="liquidCooling" 
                                        stroke="#111827" 
                                        strokeWidth={2}
                                        name="Liquid Cooling"
                                        dot={{ fill: '#111827', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Area Chart - Cumulative Cost Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Cumulative Cost Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={yearlyData.map((item, index) => ({
                                    ...item,
                                    airCoolingCumulative: item.airCooling * (index + 1),
                                    liquidCoolingCumulative: item.liquidCooling * (index + 1),
                                }))}>
                                    <XAxis dataKey="year" fontSize={12} />
                                    <YAxis 
                                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                        fontSize={12}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area 
                                        type="monotone" 
                                        dataKey="airCoolingCumulative" 
                                        stackId="1"
                                        stroke="#374151" 
                                        fill="#374151" 
                                        fillOpacity={0.6}
                                        name="Air Cooling Cumulative"
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="liquidCoolingCumulative" 
                                        stackId="1"
                                        stroke="#111827" 
                                        fill="#111827" 
                                        fillOpacity={0.6}
                                        name="Liquid Cooling Cumulative"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pie Chart - Cost Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Air Cooling Cost Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={pieData.filter((_, index) => index < 2)}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.filter((_, index) => index < 2).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Liquid Cooling Cost Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={pieData.filter((_, index) => index >= 2)}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.filter((_, index) => index >= 2).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gray-50 border-gray-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-900">Air Cooling (Variant A)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Total Capex:</span>
                                        <span className="font-mono font-medium">$7,865,088</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Annual Opex:</span>
                                        <span className="font-mono font-medium">$822,497</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">TCO:</span>
                                        <span className="font-mono font-medium">$19,542,545</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-50 border-gray-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-900">Liquid Cooling (Variant B)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Total Capex:</span>
                                        <span className="font-mono font-medium">$6,732,070</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Annual Opex:</span>
                                        <span className="font-mono font-medium">$984,365</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">TCO:</span>
                                        <span className="font-mono font-medium">$20,837,551</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-50 border-gray-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-900">Key Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-700">Lower Capex: -$1.13M (-14.4%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-700">Higher Opex: +$2.43M (+17.4%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-700">Higher TCO: +$1.30M (+6.6%)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Please complete configuration and click Calculate to view comparison results.</p>
            </div>
        )
    );
}