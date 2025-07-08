"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricsCards } from "./metrics-cards";
import { ChartsSection } from "./charts-section";
import { AdditionalMetrics } from "./additional-metrics";
import { CalculationResults } from "../types/types";

interface ResultsSectionProps {
    results: CalculationResults;
    showResults: boolean;
}

export function ResultsSection({ results, showResults }: ResultsSectionProps) {
    if (!showResults) return null;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <MetricsCards results={results} />

                        {/* Charts */}
                        <ChartsSection />

                        {/* Additional Metrics Grid */}
                        <AdditionalMetrics />
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
