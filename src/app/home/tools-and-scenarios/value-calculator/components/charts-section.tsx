"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const pieData = [
    { name: "Energy Savings", value: 35, color: "#4ade80" },
    { name: "Space Optimization", value: 25, color: "#3b82f6" },
    { name: "Maintenance Reduction", value: 20, color: "#fbbf24" },
    { name: "Other Benefits", value: 20, color: "#a855f7" },
];

const barData = [
    { category: "Current", cost: 100, efficiency: 60 },
    { category: "Optimized", cost: 65, efficiency: 85 },
];

const trendData = [
    { month: "Jan", savings: 10, efficiency: 65 },
    { month: "Feb", savings: 25, efficiency: 70 },
    { month: "Mar", savings: 40, efficiency: 75 },
    { month: "Apr", savings: 55, efficiency: 80 },
    { month: "May", savings: 65, efficiency: 82 },
    { month: "Jun", savings: 75, efficiency: 85 },
];

export function ChartsSection() {
    return (
        <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Cost vs Efficiency Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="cost" fill="#ef4444" name="Cost Index" />
                                <Bar dataKey="efficiency" fill="#22c55e" name="Efficiency %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Savings Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
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
            </div>

            {/* Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="savings" stroke="#3b82f6" name="Savings %" />
                            <Line type="monotone" dataKey="efficiency" stroke="#10b981" name="Efficiency %" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    );
}
