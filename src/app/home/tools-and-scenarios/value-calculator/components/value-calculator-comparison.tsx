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
import { useState, useEffect } from "react";
import { getIndustriesBySelectedIds } from "@/lib/actions/industry/industry";
import { getTechnologiesBySelectedIds } from "@/lib/actions/technology/technology";
import { getSolutionTypesByIndustryAndTechnology } from "@/lib/actions/solution/solution";

// Interface for comparison row data
interface ComparisonRow {
    metric: string;
    variantA: number;
    variantB: number;
    difference: number;
    percentChange: string;
}


export default function ValueCalculatorComparison({
    hasCalculated,
    selectedIndustry,
    selectedTechnology,
    selectedSolution,
    solutionVariantA,
    solutionVariantB,
    fetchedSolutionA,
    fetchedSolutionB,
    resultData,
    comparisonMode,
}: {
    hasCalculated: boolean;
    selectedIndustry: string;
    selectedTechnology: string;
    selectedSolution: string;
    solutionVariantA: string;
    solutionVariantB: string;
    fetchedSolutionA?: any | null;
    fetchedSolutionB?: any | null;
    resultData?: any | null;
    comparisonMode?: "single" | "compare" | null;
}) {
    // State for resolved names
    const [industryName, setIndustryName] = useState<string>("");
    const [technologyName, setTechnologyName] = useState<string>("");
    const [solutionName, setSolutionName] = useState<string>("");
    const [isLoadingNames, setIsLoadingNames] = useState<boolean>(false);

    // Function to resolve industry ID to name
    const resolveIndustryName = async (industryId: string) => {
        if (!industryId) {
            setIndustryName("");
            return;
        }

        setIsLoadingNames(true);
        try {
            const result = await getIndustriesBySelectedIds([industryId]);
            if (result.success && result.industries && result.industries.length > 0) {
                setIndustryName(result.industries[0].name);
            } else {
                setIndustryName(industryId);
            }
        } catch (error) {
            setIndustryName(industryId);
        } finally {
            setIsLoadingNames(false);
        }
    };

    // Function to resolve technology ID to name
    const resolveTechnologyName = async (technologyId: string) => {
        if (!technologyId) {
            setTechnologyName("");
            return;
        }

        setIsLoadingNames(true);
        try {
            const result = await getTechnologiesBySelectedIds([technologyId]);
            if (result.success && result.technologies && result.technologies.length > 0) {
                setTechnologyName(result.technologies[0].name);
            } else {
                setTechnologyName(technologyId);
            }
        } catch (error) {
            setTechnologyName(technologyId);
        } finally {
            setIsLoadingNames(false);
        }
    };

    // Function to resolve solution ID to name
    const resolveSolutionName = async (solutionId: string) => {
        if (!solutionId) {
            setSolutionName("");
            return;
        }

        // Handle custom solution IDs (they start with "custom_")
        if (solutionId.startsWith("custom_")) {
            // For custom solutions, try to get the name from fetched solution data
            if (fetchedSolutionA && fetchedSolutionA.id === solutionId.replace("custom_", "")) {
                setSolutionName(fetchedSolutionA.solution_name || "Custom Solution");
                return;
            }
            if (fetchedSolutionB && fetchedSolutionB.id === solutionId.replace("custom_", "")) {
                setSolutionName(fetchedSolutionB.solution_name || "Custom Solution");
                return;
            }
            setSolutionName("Custom Solution");
            return;
        }

        setIsLoadingNames(true);
        try {
            const result = await getSolutionTypesByIndustryAndTechnology(selectedIndustry, selectedTechnology);
            if (result.success && result.solutionTypes) {
                const solution = result.solutionTypes.find((s: any) => s.id === solutionId);
                if (solution) {
                    setSolutionName(solution.name);
                } else {
                    setSolutionName(solutionId);
                }
            } else {
                setSolutionName(solutionId);
            }
        } catch (error) {
            setSolutionName(solutionId);
        } finally {
            setIsLoadingNames(false);
        }
    };

    // Effect to resolve names when IDs change
    useEffect(() => {
        if (selectedIndustry) {
            resolveIndustryName(selectedIndustry);
        }
        if (selectedTechnology) {
            resolveTechnologyName(selectedTechnology);
        }
        if (selectedSolution) {
            resolveSolutionName(selectedSolution);
        }
    }, [selectedIndustry, selectedTechnology, selectedSolution]);

    useEffect(() => {
        console.log("Result Data:", resultData);
        console.log("Comparison Mode:", comparisonMode);
    }, [resultData, comparisonMode]);

    // Transform resultData into comparison format
    const transformResultData = (): ComparisonRow[] => {
        if (!resultData || typeof resultData !== 'object') {
            return [];
        }

        const comparisonRows: ComparisonRow[] = [];
        
        if (comparisonMode === "single") {
            // Single mode - use solutionA data directly
            const singleData = resultData.solutionA || resultData;
            if (!singleData || typeof singleData !== 'object') {
                return [];
            }

            const keys = Object.keys(singleData);
            
            // Transform each key-value pair into a table row
            keys.forEach(key => {
                const value = singleData[key];
                
                // Format the key name for display
                const formattedMetric = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())
                    .replace(/\b\w+/g, word => {
                        // Capitalize first letter of each word
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    });
                
                const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
                
                comparisonRows.push({
                    metric: formattedMetric,
                    variantA: numericValue,
                    variantB: numericValue, // Same value for single mode
                    difference: 0,
                    percentChange: "0.0%"
                });
            });
        } else if (comparisonMode === "compare") {
            // Compare mode - use both solutionA and solutionB data
            const solutionAData = resultData.solutionA;
            const solutionBData = resultData.solutionB;
            
            if (!solutionAData || !solutionBData) {
                return [];
            }

            // Get all unique keys from both solutions
            const allKeys = new Set([
                ...Object.keys(solutionAData),
                ...Object.keys(solutionBData)
            ]);

            // Transform each key-value pair into a table row
            allKeys.forEach(key => {
                const valueA = solutionAData[key];
                const valueB = solutionBData[key];
                
                // Format the key name for display
                const formattedMetric = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())
                    .replace(/\b\w+/g, word => {
                        // Capitalize first letter of each word
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    });
                
                const numericValueA = typeof valueA === 'number' ? valueA : parseFloat(String(valueA)) || 0;
                const numericValueB = typeof valueB === 'number' ? valueB : parseFloat(String(valueB)) || 0;
                const difference = numericValueB - numericValueA;
                const percentChange = numericValueA !== 0 ? ((difference / numericValueA) * 100).toFixed(1) + '%' : '0.0%';
            
            comparisonRows.push({
                    metric: formattedMetric,
                    variantA: numericValueA,
                    variantB: numericValueB,
                    difference: difference,
                    percentChange: percentChange
                });
            });
        }

        return comparisonRows;
    };

    const comparisonRows = transformResultData();

    const getDifferenceColor = (difference: number) => {
        if (difference < 0) return "text-green-600"; // Negative difference is good (cost savings)
        if (difference > 0) return "text-red-600"; // Positive difference is bad (cost increase)
        return "text-gray-600";
    };

    const getPercentChangeColor = (percentChange: string) => {
        const value = parseFloat(percentChange.replace(/[^0-9.-]/g, ''));
        if (value < 0) return "text-green-600"; // Negative change is good (cost savings)
        if (value > 0) return "text-red-600"; // Positive change is bad (cost increase)
        return "text-gray-600";
    };

    // Helper function to format currency values with reduced decimal places
    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}K`;
        } else {
            return `$${value.toFixed(0)}`;
        }
    };

    // Helper function to format percentage values
    const formatPercentage = (percentChange: string) => {
        const value = parseFloat(percentChange.replace(/[^0-9.-]/g, ''));
        if (Math.abs(value) < 0.1) return "0.0%";
        return value.toFixed(1) + "%";
    };


    console.log("Data: ", resultData);


    return (
        hasCalculated ? (
            <div className="space-y-6">
                {/* Configuration Summary */}
                <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-4 text-muted-foreground">Configuration Summary</h3>
                    <div className={`grid gap-6 ${comparisonMode === "compare" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
                        {/* Single Mode - Show only Solution A */}
                        {comparisonMode === "single" && fetchedSolutionA && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {fetchedSolutionA?.solution_name || "Selected Solution"}
                                    </h4>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Industry:</span>
                                        <span className="font-medium">
                                            {isLoadingNames ? "Loading..." : (industryName || "Not selected")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Technology:</span>
                                        <span className="font-medium">
                                            {isLoadingNames ? "Loading..." : (technologyName || "Not selected")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Solution:</span>
                                        <span className="font-medium">
                                            {isLoadingNames ? "Loading..." : (solutionName || "Not selected")}
                                        </span>
                                    </div>
                                
                                    {fetchedSolutionA?.solution_description && (
                                        <div className="pt-2 border-t">
                                            <div className="text-muted-foreground mb-1">Description:</div>
                                            <div className="text-sm text-gray-700">
                                                {fetchedSolutionA.solution_description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Compare Mode - Show both solutions */}
                        {comparisonMode === "compare" && (
                            <>
                                {/* Solution A Configuration */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {fetchedSolutionA?.solution_name || "Solution A"}
                                        </h4>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Industry:</span>
                                            <span className="font-medium">
                                                {isLoadingNames ? "Loading..." : (industryName || "Not selected")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Technology:</span>
                                            <span className="font-medium">
                                                {isLoadingNames ? "Loading..." : (technologyName || "Not selected")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Solution:</span>
                                            <span className="font-medium">
                                                {isLoadingNames ? "Loading..." : (solutionName || "Not selected")}
                                            </span>
                                        </div>
                                 
                                        {fetchedSolutionA?.solution_description && (
                                            <div className="pt-2 border-t">
                                                <div className="text-muted-foreground mb-1">Description:</div>
                                                <div className="text-sm text-gray-700">
                                                    {fetchedSolutionA.solution_description}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Solution B Configuration */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {fetchedSolutionB?.solution_name || "Solution B"}
                                        </h4>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Industry:</span>
                                            <span className="font-medium">
                                                {isLoadingNames ? "Loading..." : (industryName || "Not selected")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Technology:</span>
                                            <span className="font-medium">
                                                {isLoadingNames ? "Loading..." : (technologyName || "Not selected")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Solution:</span>
                                            <span className="font-medium">
                                                {isLoadingNames ? "Loading..." : (solutionName || "Not selected")}
                                            </span>
                                        </div>
                               
                                        {fetchedSolutionB?.solution_description && (
                                            <div className="pt-2 border-t">
                                                <div className="text-muted-foreground mb-1">Description:</div>
                                                <div className="text-sm text-gray-700">
                                                    {fetchedSolutionB.solution_description}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* No solution selected */}
                        {!fetchedSolutionA && !fetchedSolutionB && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No solution selected for comparison</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comparison Table */}
                {comparisonMode === "single" ? (
                    // Single mode - show results for one solution
                    <div className="border rounded-lg shadow-sm">
                        <div className="bg-muted/50 px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Results Summary</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Financial metrics for {fetchedSolutionA?.solution_name || "Selected Solution"}
                            </p>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow className="border-b-2 border-gray-200">
                                        <TableHead className="w-48 bg-background font-semibold text-gray-900 py-4">
                                            Metric
                                        </TableHead>
                                        <TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                                {fetchedSolutionA?.solution_name || "Selected Solution"}
                                            </Badge>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comparisonRows.map((row, index) => (
                                        <TableRow 
                                            key={index} 
                                            className={`hover:bg-muted/50 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                            }`}
                                        >
                                            <TableCell className="font-medium text-gray-900 py-3">
                                                {row.metric}
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-gray-900 py-3">
                                                {formatCurrency(row.variantA)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : comparisonMode === "compare" ? (
                    // Compare mode - show results for both solutions
                    <div className="border rounded-lg shadow-sm">
                        <div className="bg-muted/50 px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Comparison Results</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Side-by-side comparison of financial metrics
                            </p>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow className="border-b-2 border-gray-200">
                                        <TableHead className="w-48 bg-background font-semibold text-gray-900 py-4">
                                            Metric
                                        </TableHead>
                                        <TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                                {fetchedSolutionA?.solution_name || "Solution A"}
                                            </Badge>
                                        </TableHead>
                                        <TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                                                {fetchedSolutionB?.solution_name || "Solution B"}
                                            </Badge>
                                        </TableHead>
                                        <TableHead className="w-32 bg-background font-semibold text-center text-gray-900 py-4">
                                            Difference
                                        </TableHead>
                                        <TableHead className="w-24 bg-background font-semibold text-center text-gray-900 py-4">
                                            % Change
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comparisonRows.map((row, index) => (
                                        <TableRow 
                                            key={index} 
                                            className={`hover:bg-muted/50 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                            }`}
                                        >
                                            <TableCell className="font-medium text-gray-900 py-3">
                                                {row.metric}
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-gray-900 py-3">
                                                {formatCurrency(row.variantA)}
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-gray-900 py-3">
                                                {formatCurrency(row.variantB)}
                                            </TableCell>
                                            <TableCell className={`text-center font-mono font-semibold py-3 ${getDifferenceColor(row.difference)}`}>
                                                {row.difference < 0 ? `-${formatCurrency(Math.abs(row.difference))}` : `+${formatCurrency(row.difference)}`}
                                            </TableCell>
                                            <TableCell className={`text-center font-mono font-semibold py-3 ${getPercentChangeColor(row.percentChange)}`}>
                                                {formatPercentage(row.percentChange)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : null}

            
            </div>
        ) : (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Please complete configuration and click Calculate to view comparison results.</p>
            </div>
        )
    );
}