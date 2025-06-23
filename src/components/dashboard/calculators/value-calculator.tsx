"use client";

import { useState } from "react";
import { MainCalculator } from "./value-calculator/main-calculator";
import { ResultsComparison } from "./value-calculator/results";
import type {
	CalculatorInputs,
	CalculationResults,
} from "./value-calculator/types";

export default function ValueCalculator() {
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [scenario, setScenario] = useState("greenfield");
	const [dataCenterType, setDataCenterType] = useState("general");
	const [location, setLocation] = useState("uk");
	const [isCalculating, setIsCalculating] = useState(false);
	const [hasCalculated, setHasCalculated] = useState(false);
	const [calculationResults, setCalculationResults] =
		useState<CalculationResults | null>(null);
	const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
		utilization: 80,
		maxDesignITLoad: 2.0,
		yearsOfOperation: 10,
		firstYear: 2024,
		dataHallCapacity: 2.0,
		avgTemperature: 22,
		electricityPrice: 0.12,
		waterPrice: 0.002,
		maxServerPower: 400,
		refreshCycles: 2,
		itCost: 8000,
		maintenance: 8,
		disksPerChassis: 144,
		chassisPerRack: 16,
		powerPerDisk: 15,
		airCapex: 15000,
		upgradePercentage: 70,
		electricalUpgrade: 0,
		existingWaterLoop: false,
	});

	const handleCalculate = async () => {
		setIsCalculating(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Import and use calculation logic
		const { calculateResults } = await import(
			"./value-calculator/calculations"
		);
		const results = calculateResults(
			calculatorInputs,
			scenario,
			dataCenterType,
			location
		);

		setCalculationResults(results);
		setHasCalculated(true);
		setIsCalculating(false);
	};

	const handleReset = () => {
		setHasCalculated(false);
		setCalculationResults(null);
		setCalculatorInputs({
			utilization: 80,
			maxDesignITLoad: 2.0,
			yearsOfOperation: 10,
			firstYear: 2024,
			dataHallCapacity: 2.0,
			avgTemperature: 22,
			electricityPrice: 0.12,
			waterPrice: 0.002,
			maxServerPower: 400,
			refreshCycles: 2,
			itCost: 8000,
			maintenance: 8,
			disksPerChassis: 144,
			chassisPerRack: 16,
			powerPerDisk: 15,
			airCapex: 15000,
			upgradePercentage: 70,
			electricalUpgrade: 0,
			existingWaterLoop: false,
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Value Calculator
					</h1>
					<p className="text-muted-foreground">
						Compare the financial and environmental benefits of Air Cooling vs
						Liquid Cooling
					</p>
				</div>
			</div>

			{/* Main Calculator */}
			<MainCalculator
				showAdvanced={showAdvanced}
				setShowAdvanced={setShowAdvanced}
				scenario={scenario}
				setScenario={setScenario}
				dataCenterType={dataCenterType}
				setDataCenterType={setDataCenterType}
				location={location}
				setLocation={setLocation}
				calculatorInputs={calculatorInputs}
				setCalculatorInputs={setCalculatorInputs}
				onCalculate={handleCalculate}
				onReset={handleReset}
				isCalculating={isCalculating}
			/>

			{/* Results Comparison - Only show after calculation and not while calculating */}
			{hasCalculated && !isCalculating && calculationResults && (
				<ResultsComparison
					results={calculationResults}
					scenario={scenario}
					dataCenterType={dataCenterType}
					location={location}
				/>
			)}
		</div>
	);
}
