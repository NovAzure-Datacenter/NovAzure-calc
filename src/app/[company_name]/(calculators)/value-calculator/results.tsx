"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Download, Mail } from "lucide-react";
import type { CalculationResults } from "./types";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export function ResultsComparison({
	results,
	scenario,
	dataCenterType,
	location,
}: {
	results: CalculationResults;
	scenario: string;
	dataCenterType: string;
	location: string;
}) {
	// Format numbers to display with commas and fixed decimals
	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("en-US", {
			maximumFractionDigits: 0,
		}).format(Math.round(num));
	};

	// Get financial data from results
	const financial = results.financial;
	const environmental = results.environmental;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Demonstrated Value Comparison</CardTitle>
				<CardDescription>
					Comprehensive analysis of Iceotope Precision Liquid Cooling vs Air
					Cooling benefits
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{/* Financial Comparison Table */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Financial Comparison</h3>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-custom-dark-blue text-white">
										<th className="border bg-custom-dark-blue px-4 py-3 text-left font-medium">
											Column
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											Air Cooling
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											PLC
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											Saving (€)
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											Saving (%)
										</th>
									</tr>
								</thead>
								<tbody className="bg-white">
									<tr className="border-b">
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											Capex
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.airCooling.capex / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.liquidCooling.capex / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.savings.capex / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{financial.savings.capexPercent}%
										</td>
									</tr>
									<tr className="border-b">
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											Annual Opex
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.airCooling.annualOpex / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.liquidCooling.annualOpex / 1000)}{" "}
											k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.savings.annualOpex / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{financial.savings.annualOpexPercent}%
										</td>
									</tr>
									<tr className="border-b">
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											Total Opex
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.airCooling.totalOpex / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.liquidCooling.totalOpex / 1000)}{" "}
											k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											€{formatNumber(financial.savings.totalOpex / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{financial.savings.totalOpexPercent}%
										</td>
									</tr>
									<tr className="bg-blue-50">
										<td className="border border-gray-300 px-4 py-3 font-bold text-custom-dark-blue">
											Total Cost of Ownership
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											€{formatNumber(financial.airCooling.totalCost / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											€{formatNumber(financial.liquidCooling.totalCost / 1000)}{" "}
											k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											€{formatNumber(financial.savings.totalCost / 1000)} k
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-bold text-custom-dark-blue">
											{financial.savings.totalCostPercent}%
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Cost Comparison Chart Placeholder */}
						<div className="space-y-4">
							<h4 className="font-semibold">5-Year Cost Comparison</h4>
							<div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
								<div className="text-center text-gray-500">
									<Building2 className="h-12 w-12 mx-auto mb-2" />
									<p>Interactive Chart</p>
									<p className="text-sm">Total Air Cooling vs Total PLC</p>
								</div>
							</div>
						</div>

						{/* Source of Savings */}
						<div className="space-y-4">
							<h4 className="font-semibold">Source of Savings</h4>
							<div className="bg-gray-50 rounded-lg p-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-4 h-4 bg-blue-500 rounded"></div>
											<span>Opex Saving</span>
										</div>
										<span className="font-semibold">
											{Math.round(
												(financial.savings.totalOpex /
													(financial.savings.totalOpex +
														financial.savings.capex)) *
													100
											)}
											%
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-4 h-4 bg-orange-500 rounded"></div>
											<span>Capex Saving</span>
										</div>
										<span className="font-semibold">
											{Math.round(
												(financial.savings.capex /
													(financial.savings.totalOpex +
														financial.savings.capex)) *
													100
											)}
											%
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Energy and Environmental Comparison */}
					<div className="space-y-6">
						<h3 className="text-lg font-semibold">
							Energy and Other Consumption Comparison
						</h3>

						{/* Energy Table */}
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-custom-dark-blue text-white">
										<th className="border bg-custom-dark-blue px-4 py-3 text-left font-medium">
											Column
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											Air Cooling
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											PLC
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											Saving (€)
										</th>
										<th className="border bg-custom-dark-blue px-4 py-3 text-center font-medium">
											Saving (%)
										</th>
									</tr>
								</thead>
								<tbody className="bg-white">
									<tr className="border-b">
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											pPUE
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{environmental.airCooling.pPUE.toFixed(2)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{environmental.liquidCooling.pPUE.toFixed(2)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{environmental.savings.pPUE.toFixed(2)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{environmental.savings.pPUEPercent}%
										</td>
									</tr>
									<tr className="border-b">
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											Energy Consumption (MWh/year)
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.airCooling.energyUsage)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.liquidCooling.energyUsage)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.savings.energyUsage)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{environmental.savings.energyPercent}%
										</td>
									</tr>
									<tr className="border-b">
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											Water Consumption (litre/year)
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.airCooling.waterUsage)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.liquidCooling.waterUsage)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.savings.waterUsage)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{environmental.savings.waterPercent}%
										</td>
									</tr>
									<tr className="border-b">
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											Total CO2e
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.airCooling.carbonFootprint)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(
												environmental.liquidCooling.carbonFootprint
											)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.savings.carbonFootprint)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{environmental.savings.carbonPercent}%
										</td>
									</tr>
									<tr>
										<td className="border border-gray-300 px-4 py-3 font-medium text-custom-dark-blue">
											Floor space (sqm)
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.airCooling.floorSpace)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.liquidCooling.floorSpace)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center">
											{formatNumber(environmental.savings.floorSpace)}
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center font-semibold">
											{environmental.savings.floorSpacePercent}%
										</td>
									</tr>
								</tbody>
							</table>
						</div>
                                            {/* 87/38/60 */}
						{/* Environmental Impact Indicators */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
							{/* Water Consumption */}
							<div className="text-center space-y-4">
								<h4 className="font-semibold">Water Consumption</h4>
								<div className="w-32 h-32 mx-auto">
									<CircularProgressbar
										value={environmental.savings.waterPercent}
										text={`${environmental.savings.waterPercent}%`}
										styles={buildStyles({
											textSize: '24px',
											pathColor: '#22c55e',
											textColor: '#16a34a',
											trailColor: '#e5e7eb',
											pathTransitionDuration: 1
										})}
									/>
								</div>
								<p className="text-sm text-green-600 font-medium">
									Less Water Consumed
								</p>
							</div>

							{/* CO2 Saving */}
							<div className="text-center space-y-4">
								<h4 className="font-semibold">Total CO2 Saving</h4>
								<div className="w-32 h-32 mx-auto">
									<CircularProgressbar
										value={environmental.savings.carbonPercent}
										text={`${environmental.savings.carbonPercent}%`}
										styles={buildStyles({
											textSize: '24px',
											pathColor: '#ef4444',
											textColor: '#dc2626',
											trailColor: '#e5e7eb',
											pathTransitionDuration: 1
										})}
									/>
								</div>
								<p className="text-sm text-red-600 font-medium">
									CO2 Emissions Evaded
								</p>
							</div>

							{/* Floor Space */}
							<div className="text-center space-y-4">
								<h4 className="font-semibold">Floor Space</h4>
								<div className="w-32 h-32 mx-auto">
									<CircularProgressbar
										value={environmental.savings.floorSpacePercent}
										text={`${environmental.savings.floorSpacePercent}%`}
										styles={buildStyles({
											textSize: '24px',
											pathColor: '#eab308',
											textColor: '#ca8a04',
											trailColor: '#e5e7eb',
											pathTransitionDuration: 1
										})}
									/>
								</div>
								<p className="text-sm text-yellow-600 font-medium">
									Floor Space Saved
								</p>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
						<Button className="bg-custom-dark-blue hover:bg-blue-700">
							<Download className="mr-2 h-4 w-4" />
							Download Full Report
						</Button>
						<Button variant="outline">
							<Mail className="mr-2 h-4 w-4" />
							Email Results
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
