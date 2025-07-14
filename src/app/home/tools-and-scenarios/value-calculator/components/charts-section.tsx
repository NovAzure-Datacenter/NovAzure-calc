"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	Legend,
} from "recharts";
import type { CalculationResults } from "../types/types";

interface ChartsSectionProps {
	airCooling: any;
	chassisImmersion: any;
}

export function ChartsSection({
	airCooling,
	chassisImmersion,
}: ChartsSectionProps) {
	// Bar chart: TCO, CAPEX, OPEX comparison (safe access)
	const barData = [
		{
			solution: "Air Cooling",
			tco: airCooling?.tco_including_it ?? 0,
			capex: airCooling?.total_capex ?? 0,
			opex: airCooling?.total_opex_over_lifetime ?? 0,
		},
		{
			solution: "Chassis Immersion",
			tco: chassisImmersion?.tco_including_it ?? 0,
			capex: chassisImmersion?.total_capex ?? 0,
			opex: chassisImmersion?.total_opex_over_lifetime ?? 0,
		},
	];

	// Pie chart: CAPEX vs OPEX for each solution (safe access)
	const airPie = [
		{ name: "CAPEX", value: airCooling?.total_capex ?? 0, color: "#3b82f6" },
		{
			name: "OPEX",
			value: airCooling?.total_opex_over_lifetime ?? 0,
			color: "#fbbf24",
		},
	];
	const chassisPie = [
		{
			name: "CAPEX",
			value: chassisImmersion?.total_capex ?? 0,
			color: "#3b82f6",
		},
		{
			name: "OPEX",
			value: chassisImmersion?.total_opex_over_lifetime ?? 0,
			color: "#fbbf24",
		},
	];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Bar Chart: TCO, CAPEX, OPEX */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						TCO, CAPEX, OPEX Comparison
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={barData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="solution" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="tco" fill="#4ade80" name="TCO (incl. IT)" />
							<Bar dataKey="capex" fill="#3b82f6" name="CAPEX" />
							<Bar dataKey="opex" fill="#fbbf24" name="OPEX" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Pie Charts: CAPEX vs OPEX */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						Air Cooling: CAPEX vs OPEX
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={airPie}
								cx="50%"
								cy="50%"
								innerRadius={40}
								outerRadius={80}
								dataKey="value"
							>
								{airPie.map((entry, idx) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						Chassis Immersion: CAPEX vs OPEX
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={chassisPie}
								cx="50%"
								cy="50%"
								innerRadius={40}
								outerRadius={80}
								dataKey="value"
							>
								{chassisPie.map((entry, idx) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
}
