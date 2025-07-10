"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ValueCalculatorMain from "./value-calculator-main";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Separate Charts Section Component
function ChartsSection({ calc1Result, calc2Result }: { calc1Result: any, calc2Result: any }) {
  const processComparisonData = (calc1Result: any, calc2Result: any) => {
    // Handle the actual API response format - flat objects with properties like cooling_equipment_capex
    const allKeys = new Set([
      ...Object.keys(calc1Result || {}),
      ...Object.keys(calc2Result || {})
    ]);

    const tableData = Array.from(allKeys).map(key => {
      const val1 = calc1Result?.[key] ?? '';
      const val2 = calc2Result?.[key] ?? '';
      
      // Convert to numbers for comparison if possible
      const num1 = typeof val1 === 'number' ? val1 : parseFloat(val1);
      const num2 = typeof val2 === 'number' ? val2 : parseFloat(val2);
      
      const isNumeric = !isNaN(num1) && !isNaN(num2);
      const difference = isNumeric ? num2 - num1 : null;
      const percentageDiff = isNumeric && num1 !== 0 ? ((num2 - num1) / num1) * 100 : null;
      
      return {
        key,
        solution1: val1,
        solution2: val2,
        difference,
        percentageDiff,
        isNumeric,
        isDifferent: val1 !== val2
      };
    });

    // Prepare chart data for numeric values
    const chartData = tableData
      .filter(item => item.isNumeric)
      .map(item => ({
        metric: item.key,
        solution1: item.solution1,
        solution2: item.solution2,
        difference: item.difference || 0,
        percentageDiff: item.percentageDiff || 0
      }));

    return { tableData, chartData };
  };

  const comparisonData = processComparisonData(calc1Result, calc2Result);

  return (
    <div className="mt-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparisonData.tableData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Numeric Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparisonData.chartData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Different Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparisonData.tableData.filter(item => item.isDifferent).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Single Chart */}
      {comparisonData.chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistics Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
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
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name === 'solution1' ? 'Solution 1' : 'Solution 2'
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="solution1" 
                  fill="#3b82f6" 
                  name="Solution 1"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="solution2" 
                  fill="#ef4444" 
                  name="Solution 2"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Comparison Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-right py-2">Solution 1</th>
                  <th className="text-right py-2">Solution 2</th>
                  <th className="text-right py-2">Difference</th>
                  <th className="text-right py-2">% Change</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.tableData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{item.key}</td>
                    <td className="text-right py-2">
                      {typeof item.solution1 === 'number' 
                        ? item.solution1.toLocaleString() 
                        : item.solution1}
                    </td>
                    <td className="text-right py-2">
                      {typeof item.solution2 === 'number' 
                        ? item.solution2.toLocaleString() 
                        : item.solution2}
                    </td>
                    <td className="text-right py-2">
                      {item.difference !== null 
                        ? item.difference.toLocaleString() 
                        : '-'}
                    </td>
                    <td className="text-right py-2">
                      {item.percentageDiff !== null 
                        ? `${item.percentageDiff.toFixed(1)}%` 
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ValueCalculatorCompareWrapper({ onBack }: { onBack?: () => void } = {}) {
  const [calc1Result, setCalc1Result] = useState<any>(null);
  const [calc2Result, setCalc2Result] = useState<any>(null);
  const [calc1Valid, setCalc1Valid] = useState(false);
  const [calc2Valid, setCalc2Valid] = useState(false);
  const calc1Ref = useRef<any>(null);
  const calc2Ref = useRef<any>(null);

  // Handler to receive calculation result and validity from ValueCalculatorMain
  // Store results in refs, update state in useEffect to avoid React warning
  const calc1ResultBuffer = useRef<{result: any, valid: boolean} | null>(null);
  const calc2ResultBuffer = useRef<{result: any, valid: boolean} | null>(null);

  const handleCalc1Result = (result: any, valid: boolean) => {
    calc1ResultBuffer.current = { result, valid };
  };
  const handleCalc2Result = (result: any, valid: boolean) => {
    calc2ResultBuffer.current = { result, valid };
  };

  // Transfer buffered results to state to avoid React warnings
  useEffect(() => {
    const interval = setInterval(() => {
      if (calc1ResultBuffer.current) {
        setCalc1Result(calc1ResultBuffer.current.result);
        setCalc1Valid(calc1ResultBuffer.current.valid);
        calc1ResultBuffer.current = null;
      }
      if (calc2ResultBuffer.current) {
        setCalc2Result(calc2ResultBuffer.current.result);
        setCalc2Valid(calc2ResultBuffer.current.valid);
        calc2ResultBuffer.current = null;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Auto-trigger calculations when both calculators are valid
  useEffect(() => {
    if (calc1Valid && calc2Valid) {
      // Small delay to ensure components are fully mounted
      setTimeout(() => {
        if (calc1Ref.current && calc1Ref.current.runCalculation) {
          calc1Ref.current.runCalculation();
        }
        if (calc2Ref.current && calc2Ref.current.runCalculation) {
          calc2Ref.current.runCalculation();
        }
      }, 100);
    }
  }, [calc1Valid, calc2Valid]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <ValueCalculatorMain 
            ref={calc1Ref}
            hideCompareButton 
            onCalculationResult={handleCalc1Result} 
            isCompareMode 
            onCompareValidityChange={setCalc1Valid}
            hideResultsSection={true}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ValueCalculatorMain 
            ref={calc2Ref}
            hideCompareButton 
            onCalculationResult={handleCalc2Result} 
            isCompareMode 
            onCompareValidityChange={setCalc2Valid}
            hideResultsSection={true}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            // Trigger calculation in both calculators before going back
            if (calc1Ref.current && calc1Ref.current.runCalculation) {
              calc1Ref.current.runCalculation();
            }
            if (calc2Ref.current && calc2Ref.current.runCalculation) {
              calc2Ref.current.runCalculation();
            }
            if (onBack) {
              onBack();
            }
          }}
          className="mt-2"
        >
          ← Back to Single Calculator
        </Button>
      </div>

      {/* Charts Section - Only show when both calculators have results */}
      {(() => {
        return calc1Valid && calc2Valid && calc1Result && calc2Result ? (
          <ChartsSection calc1Result={calc1Result} calc2Result={calc2Result} />
        ) : (
          <div className="mt-8 p-4 bg-yellow-100 rounded">
            <h4 className="font-semibold mb-2">Waiting for results...</h4>
            <p>Calc1 Valid: {calc1Valid.toString()}</p>
            <p>Calc2 Valid: {calc2Valid.toString()}</p>
            <p>Calc1 Result: {calc1Result ? 'Available' : 'Not available'}</p>
            <p>Calc2 Result: {calc2Result ? 'Available' : 'Not available'}</p>
          </div>
        );
      })()}
    </div>
  );
}
