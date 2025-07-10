"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { CalculationResults } from "../types/types";

interface ResultsSectionProps {
    results: CalculationResults;
    showResults: boolean;
    calculationResult?: any;
}

export function ResultsSection({ results, showResults, calculationResult }: ResultsSectionProps) {
    if (!showResults) return null;

    // Process individual calculation result data
    const processIndividualData = (result: any) => {
        if (!result) return { tableData: [], chartData: [] };
        
        const tableData = Object.entries(result).map(([key, value]) => ({
            key,
            value,
            isNumeric: typeof value === 'number',
            formattedValue: typeof value === 'number' ? (value as number).toLocaleString() : String(value)
        }));

        const chartData = tableData
            .filter(item => item.isNumeric)
            .map(item => ({
                metric: item.key,
                value: item.value as number
            }));

        return { tableData, chartData };
    };

    const individualData = processIndividualData(calculationResult);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Individual Chart */}
                        {individualData.chartData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Calculation Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={individualData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="metric" 
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                                fontSize={11}
                                                interval={0}
                                            />
                                            <YAxis />
                                            <Tooltip 
                                                formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : value, 'Value']}
                                            />
                                            <Bar 
                                                dataKey="value" 
                                                fill="#3b82f6" 
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Individual Detailed Table */}
                        {individualData.tableData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detailed Calculation Data</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2">Metric</th>
                                                    <th className="text-right py-2">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {individualData.tableData.map((item, index) => (
                                                    <tr key={index} className="border-b hover:bg-gray-50">
                                                        <td className="py-2 font-medium">{item.key}</td>
                                                        <td className="text-right py-2">{item.formattedValue}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
                <Button variant="outline" className="px-6">
                    Save
                </Button>
                <Button variant="outline" className="px-6">
                    Export
                </Button>
            </div>
        </>
    );
}
