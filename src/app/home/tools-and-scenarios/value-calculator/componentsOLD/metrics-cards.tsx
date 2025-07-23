"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CalculationResults } from "../types/types";

interface MetricsCardsProps {
    results: CalculationResults;
}

export function MetricsCards({ results }: MetricsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        ${Math.round(results.costSavings).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Annual Cost Savings</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {results.energyEfficiency.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Energy Efficiency</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {results.roi.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">ROI</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                        {results.paybackPeriod.toFixed(1)} yrs
                    </div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                </CardContent>
            </Card>
        </div>
    );
}
