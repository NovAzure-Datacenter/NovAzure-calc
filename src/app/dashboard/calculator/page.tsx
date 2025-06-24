"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Download } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	Legend,
} from "recharts";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell } from "recharts";
import { LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { transformCalculatorState } from "@/lib/backend-prep/key-relable";

export default function TCOCalculator() {
	// 1. Define the initial state object
	const initialState = {
		dataCentreType: "none",
		utilisation: "none",
		yearsOfOperation: "",
		projectLocation: "none",
		dataHallCapacity: "",
		firstYear: "none",
		airCoolingPUE: "",
		liquidCoolingPUE: "",
		showResultTable: false,
	};

	// 2. Single useState for all state
	const [state, setState] = useState(initialState);

	// Add loading and results state
	const [isCalculating, setIsCalculating] = useState(false);
	const [calculationResults, setCalculationResults] = useState<any>(null);
	const [calculationError, setCalculationError] = useState<string | null>(null);

	useEffect(() => {
		// Log original state with old labels
		console.log('Original Calculator State (Old Labels):', {
			dataCentreType: state.dataCentreType,
			utilisation: state.utilisation,
			yearsOfOperation: state.yearsOfOperation,
			projectLocation: state.projectLocation,
			dataHallCapacity: state.dataHallCapacity,
			firstYear: state.firstYear,
			airCoolingPUE: state.airCoolingPUE,
			liquidCoolingPUE: state.liquidCoolingPUE,
			showResultTable: state.showResultTable,
		});

		// Transform and log state with new labels
		const transformedState = transformCalculatorState(state);
		console.log('Transformed Calculator State (New Labels):', transformedState);
	}, [state])

	const [capitalisedNames, setCapitalisedNames] = useState({
		industryId: "",
		technologyId: "",
		solutionId: "",
		solutionVariantId: "",
	});
	
	const searchParams = useSearchParams();
	
	useEffect(() => {
		const industryId = searchParams.get('industryId');
		const technologyId = searchParams.get('technologyId');
		const solutionId = searchParams.get('solutionId');
		const solutionVariantId = searchParams.get('solutionVariantId');
		
		// if (industryId || technologyId || solutionId || solutionVariantId) {
		// 	console.log('Calculator Page - Navigation State from URL:', {
		// 		industryId: industryId || 'Not provided',
		// 		technologyId: technologyId || 'Not provided',
		// 		solutionId: solutionId || 'Not provided',
		// 		solutionVariantId: solutionVariantId || 'Not provided'
		// 	});
		// }

		const capitalisedNames = {
			industryId: industryId ? industryId.charAt(0).toUpperCase() + industryId.slice(1) : "",
			technologyId: technologyId ? technologyId.charAt(0).toUpperCase() + technologyId.slice(1) : "",
			solutionId: solutionId ? solutionId.charAt(0).toUpperCase() + solutionId.slice(1) : "",
			solutionVariantId: solutionVariantId ? solutionVariantId.charAt(0).toUpperCase() + solutionVariantId.slice(1) : ""
		};
		setCapitalisedNames(capitalisedNames);



	}, [searchParams]);

	// 3. Update all usages: state.field, setState(prev => ({ ...prev, field: value }))
	// Example for userName:
	// value={state.userName}
	// onChange={e => setState(prev => ({ ...prev, userName: e.target.value }))}

	// 4. Update reset logic
	function handleReset() {
		setState(initialState);
		setCalculationResults(null);
		setCalculationError(null);
	}

	// API call handler for Show Result button
	const handleShowResult = async () => {
		console.log('🚀 Starting calculation process...');
		console.log('📊 Current form state:', state);
		
		try {
			setIsCalculating(true);
			setCalculationError(null);
			
			// Transform data using your existing function
			const transformedData = transformCalculatorState(state);
			console.log('🔄 Transformed data:', transformedData);
			
			// Prepare API request body with null checks
			const requestBody = {
				percentage_of_utilisation: parseFloat(transformedData['%_of_utilisation'] || '0') || 0,
				planned_years_of_operation: parseInt(transformedData['planned_years_of_operation'] || '0') || 0,
				project_location: transformedData['project_location'] || '',
				data_hall_design_capacity_mw: parseFloat(transformedData['data_hall_design_capacity_mw'] || '0') || 0,
				first_year_of_operation: parseInt(transformedData['first_year_of_operation'] || '0') || 0,
				annualised_air_ppue: parseFloat(transformedData['annualised_air_ppue'] || '0') || 0
			};

			console.log('📤 Request body being sent to API:', requestBody);
			
			// Make API call to backend
			const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
			console.log('🌐 API URL:', `${API_BASE_URL}/calculations/main`);
			
			console.log('⏳ Making API call...'); 
			const response = await fetch(`${API_BASE_URL}/calculations/main`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});
			
			console.log('📥 Response status:', response.status);
			console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
			
			if (!response.ok) {
				const errorData = await response.text();
				console.error('❌ API Error Response:', errorData);
				throw new Error(`API Error ${response.status}: ${errorData}`);
			}
			
			const results = await response.json();
			console.log('✅ Raw API response:', results);
			console.log('✅ Response keys:', Object.keys(results));
			console.log('✅ Response structure:', JSON.stringify(results, null, 2));
			
			setCalculationResults(results);
			setState(prev => ({ ...prev, showResultTable: true }));
			console.log('✅ Results stored and table shown');
			
		} catch (error) {
			console.error('❌ Calculation error:', error);
			console.error('❌ Error details:', {
				message: error instanceof Error ? error.message : 'Unknown error',
				stack: error instanceof Error ? error.stack : 'No stack trace',
				type: typeof error
			});
			
			const errorMessage = error instanceof Error ? error.message : 'Failed to calculate results';
			setCalculationError(errorMessage);
		} finally {
			setIsCalculating(false);
			console.log('🏁 Calculation process finished');
		}
	};

	// 5. Update validation logic
	const allRequiredFilled =
		state.dataCentreType !== "none" &&
		state.utilisation !== "none" &&
		!!state.yearsOfOperation &&
		state.projectLocation !== "none" &&
		!!state.dataHallCapacity &&
		!!state.airCoolingPUE;

	const dataCentreTypeOptions = ["General Purpose", "HPC/AI"];
	
	// Get dynamic header text based on selected industry
	const getDynamicHeaderText = () => {
		if (!capitalisedNames.industryId) return "Data Centre Configuration";
		
		switch (capitalisedNames.industryId.toLowerCase()) {
			case "data centres":
				return "Data Centre Configuration";
			case "renewable energy":
				return "Renewable Energy Configuration";
			case "transportation":
				return "Transportation Infrastructure Configuration";
			case "buildings & hvac":
				return "Building & HVAC Configuration";
			default:
				return `${capitalisedNames.industryId} Configuration`;
		}
	};

	// Get dynamic solution configuration text based on selected technology
	const getSolutionConfigText = () => {
		if (!capitalisedNames.technologyId) return "Solution Configuration";
		
		switch (capitalisedNames.technologyId.toLowerCase()) {
			case "cooling systems":
				return "Cooling Solution Configuration";
			case "energy management":
				return "Energy Management Configuration";
			case "solar systems":
				return "Solar System Configuration";
			case "ev charging":
				return "EV Charging Configuration";
			case "building automation":
				return "Building Automation Configuration";
			default:
				return `${capitalisedNames.technologyId} Configuration`;
		}
	};

	// Get dynamic solution variant configuration text based on selected solution
	const getSolutionVariantConfigText = () => {
		if (!capitalisedNames.solutionId) return "Solution Variant Configuration";
		
		switch (capitalisedNames.solutionId.toLowerCase()) {
			case "liquid cooling":
				return "Liquid Cooling Variant Configuration";
			case "free air cooling":
				return "Free Air Cooling Variant Configuration";
			case "adiabatic cooling":
				return "Adiabatic Cooling Variant Configuration";
			case "power monitoring":
				return "Power Monitoring Variant Configuration";
			case "solar inverters":
				return "Solar Inverter Variant Configuration";
			case "fast charging":
				return "Fast Charging Variant Configuration";
			case "hvac controls":
				return "HVAC Control Variant Configuration";
			default:
				return `${capitalisedNames.solutionId} Variant Configuration`;
		}
	};

	// Get dynamic facility type label based on selected industry
	const getFacilityTypeLabel = () => {
		if (!capitalisedNames.industryId) return "Data Centre Type";
		
		switch (capitalisedNames.industryId.toLowerCase()) {
			case "data centres":
				return "Data Centre Type";
			case "renewable energy":
				return "Energy Facility Type";
			case "transportation":
				return "Transportation Hub Type";
			case "buildings & hvac":
				return "Building Type";
			default:
				return `${capitalisedNames.industryId} Type`;
		}
	};

	// Get dynamic capacity label based on selected industry
	const getCapacityLabel = () => {
		if (!capitalisedNames.industryId) return "Data Hall Design Capacity MW";
		
		switch (capitalisedNames.industryId.toLowerCase()) {
			case "data centres":
				return "Data Hall Design Capacity MW";
			case "renewable energy":
				return "Solar Farm Capacity MW";
			case "transportation":
				return "Charging Station Capacity kW";
			case "buildings & hvac":
				return "Building Load Capacity kW";
			default:
				return `${capitalisedNames.industryId} Capacity MW`;
		}
	};

	// Get dynamic solution name based on selected solution variant
	const getSolutionName = () => {
		if (!capitalisedNames.solutionVariantId) return "Chassis Immersion Precision Liquid Cooling";
		
		switch (capitalisedNames.solutionVariantId.toLowerCase()) {
			case "direct-to-chip":
				return "Direct-to-Chip Liquid Cooling";
			case "immersion-cooling":
				return "Immersion Cooling System";
			case "economizer-systems":
				return "Air-Side Economizer System";
			case "evaporative-enhancement":
				return "Evaporative Cooling Enhancement";
			case "smart-meters":
				return "Smart Power Metering System";
			case "string-inverters":
				return "String Inverter System";
			case "ultra-fast-chargers":
				return "Ultra-Fast DC Charging System";
			case "smart-thermostats":
				return "Smart Thermostat System";
			default:
				return capitalisedNames.solutionVariantId;
		}
	};

	// Get dynamic efficiency label based on selected solution
	const getEfficiencyLabel = () => {
		if (!capitalisedNames.solutionId) return "Annualised Air pPUE";
		
		switch (capitalisedNames.solutionId.toLowerCase()) {
			case "liquid cooling":
			case "free air cooling":
			case "adiabatic cooling":
				return "Annualised Air pPUE";
			case "power monitoring":
				return "Power Monitoring Efficiency";
			case "solar inverters":
				return "Solar Inverter Efficiency";
			case "fast charging":
				return "Charging Station Efficiency";
			case "hvac controls":
				return "HVAC System Efficiency";
			default:
				return `${capitalisedNames.solutionId} Efficiency`;
		}
	};

	const utilisationOptions = [
		"20%",
		"30%",
		"40%",
		"50%",
		"60%",
		"70%",
		"80%",
		"90%",
		"100%",
	];
	const projectLocationOptions = ["United States", "United Kingdom", "Singapore", "United Arab Emirates"];
	const yearOptions = Array.from({ length: 21 }, (_, i) =>
		(2020 + i).toString()
	);

	function handleExportPDF() {
		const dashboard = document.getElementById("tco-dashboard-export");
		if (!dashboard) return;
		html2canvas(dashboard, { scale: 2 }).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				orientation: "landscape",
				unit: "px",
				format: [canvas.width, canvas.height],
			});
			pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
			pdf.save("tco-dashboard.pdf");
		});
	}

	// Helper functions for formatting calculation results
	const formatCurrency = (value: number): string => {
		return `$${(value / 1000).toFixed(0)}`;
	};

	const formatPercentage = (value: number): string => {
		return `${value.toFixed(0)}%`;
	};

	const calculateSavings = (airValue: number, liquidValue: number) => {
		const savingAmount = airValue - liquidValue;
		const savingPercentage = airValue > 0 ? ((savingAmount / airValue) * 100) : 0;
		return {
			amount: savingAmount,
			percentage: savingPercentage
		};
	};

	// Calculate display values from API results
	const getDisplayValues = () => {
		console.log('🧮 getDisplayValues called with calculationResults:', calculationResults);
		
		if (!calculationResults) {
			console.log('⚠️ No calculation results available, returning default values');
			// Return default/loading values
			return {
				airCoolingCapex: 0,
				liquidCoolingCapex: 0,
				airTotalCapex: 0,
				liquidTotalCapex: 0,
				airAnnualOpex: 0,
				liquidAnnualOpex: 0,
				airLifetimeOpex: 0,
				liquidLifetimeOpex: 0,
				airTotalTCO: 0,
				liquidTotalTCO: 0,
				airPUE: parseFloat(state.airCoolingPUE) || 1.54,
				liquidPUE: 1.13 // Fixed value for liquid cooling
			};
		}

		// Extract values from API response
		const airCoolingCapex = calculationResults.air_cooling_capex || 0;
		const liquidCoolingCapex = airCoolingCapex * 0.92; // Assume 8% savings for liquid
		
		const airTotalCapex = calculationResults.total_capex || 0;
		const liquidTotalCapex = airTotalCapex * 0.92;
		
		const airAnnualOpex = calculationResults.opex?.annual_opex || 0;
		const liquidAnnualOpex = airAnnualOpex * 0.64; // Assume 36% savings for liquid
		
		const airLifetimeOpex = calculationResults.total_opex_over_lifetime?.total_opex_over_lifetime || 0;
		const liquidLifetimeOpex = airLifetimeOpex * 0.64;
		
		const airTotalTCO = calculationResults.total_cost_of_ownership || 0;
		const liquidTotalTCO = liquidTotalCapex + liquidLifetimeOpex;

		const displayValues = {
			airCoolingCapex,
			liquidCoolingCapex,
			airTotalCapex,
			liquidTotalCapex,
			airAnnualOpex,
			liquidAnnualOpex,
			airLifetimeOpex,
			liquidLifetimeOpex,
			airTotalTCO,
			liquidTotalTCO,
			airPUE: parseFloat(state.airCoolingPUE) || 1.54,
			liquidPUE: 1.13
		};
		
		console.log('📊 Calculated display values:', displayValues);
		console.log('💰 Key extracted values:', {
			airCoolingCapex: calculationResults.air_cooling_capex,
			totalCapex: calculationResults.total_capex,
			annualOpex: calculationResults.opex?.annual_opex,
			lifetimeOpex: calculationResults.total_opex_over_lifetime?.total_opex_over_lifetime,
			totalTCO: calculationResults.total_cost_of_ownership
		});

		return displayValues;
	};

	useEffect(() => {
		console.log(capitalisedNames.solutionId)
	}, [])

	return (
		<div className="flex justify-center w-full bg-muted min-h-screen overflow-y-auto">
			<div className="w-full max-w-5xl space-y-6 p-4 md:p-8">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							{capitalisedNames.solutionId} Vs. Base {capitalisedNames.technologyId} Solution
						</h1>
						<p className="text-muted-foreground">
							Please ensure ALL entries are filled out before clicking show
							result
						</p>
					</div>
					{/* Definitions & Assumptions */}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="flex items-center gap-2 px-6 py-2 text-sm font-medium border-gray-300 hover:bg-gray-50 transition-colors"
							>
								<Info className="w-4 h-4" />
								Definitions & Assumptions
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle className="text-2xl font-semibold">
									Definitions & Assumptions
								</DialogTitle>
							</DialogHeader>
							<div className="mt-4">
								<Card className="overflow-x-auto border-none shadow-none">
									<table className="min-w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="text-left font-semibold px-4 py-2">
													Term
												</th>
												<th className="text-left font-semibold px-4 py-2">
													Definition
												</th>
											</tr>
										</thead>
										<tbody>
											<tr className="border-b">
												<td className="px-4 py-2 font-medium">
													Data Centre Type
												</td>
												<td className="px-4 py-2">
													Specifies the data center&apos;s primary workload, either
													General Purpose or HPC/AI, which influences cost and
													design benchmarks.
												</td>
											</tr>
											<tr className="border-b">
												<td className="px-4 py-2 font-medium">
													% of Utilisation
												</td>
												<td className="px-4 py-2">
													The actual IT power consumption as a percentage of the
													maximum designed IT power capacity.
												</td>
											</tr>
											<tr className="border-b">
												<td className="px-4 py-2 font-medium">
													Planned Number of Years of Operation
												</td>
												<td className="px-4 py-2">
													The expected operational lifespan of the cooling
													system, used for calculating lifetime costs.
												</td>
											</tr>
											<tr className="border-b">
												<td className="px-4 py-2 font-medium">
													Project Location
												</td>
												<td className="px-4 py-2">
													The country where the data center is located, which
													influences climate-based cooling costs and other
													regional benchmarks.
												</td>
											</tr>
											<tr className="border-b">
												<td className="px-4 py-2 font-medium">
													Data Hall Design Capacity MW
												</td>
												<td className="px-4 py-2">
													The maximum electrical power (in megawatts) that the
													installed IT equipment is designed to consume.
												</td>
											</tr>
											<tr className="border-b">
												<td className="px-4 py-2 font-medium">
													First Year of Operation
												</td>
												<td className="px-4 py-2">
													The year when the data center will begin operating,
													which adjusts costs for future price forecasts.
												</td>
											</tr>
											<tr className="border-b">
												<td className="px-4 py-2 font-medium">
													Annualised Air pPUE
												</td>
												<td className="px-4 py-2">
													Annualised partial Power Usage Effectiveness for the
													air cooling solution. It measures the ratio of total
													facility power to IT equipment power.
												</td>
											</tr>
											<tr>
												<td className="px-4 py-2 font-medium">
													Annualised Liquid Cooled pPUE
												</td>
												<td className="px-4 py-2">
													Annualised partial Power Usage Effectiveness for the
													Chassis Immersion liquid cooling solution, which is
													generally more efficient than air cooling.
												</td>
											</tr>
										</tbody>
									</table>
								</Card>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{/* Industry Type */}
				<div className="grid gap-6">
					<Card className="shadow-lg">
						<CardContent>
							{/* Solution Configuration */}
							<div className="w-full mb-10">
								<h2 className="text-xl font-semibold mb-4">
									{getSolutionConfigText()}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<div className="mb-1 flex items-center justify-between">
											<Label
												className="text-xs text-muted-foreground mb-2"
												htmlFor="dataCentreType"
											>
												{getFacilityTypeLabel()} *
											</Label>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														Type of facility this configuration applies to
														(e.g., Colocation, Enterprise)
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<Select
											value={state.dataCentreType}
											onValueChange={(value) =>
												setState((prev) => ({ ...prev, dataCentreType: value }))
											}
										>
											<SelectTrigger className="h-8 w-full">
												<SelectValue placeholder="Select an Option" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">Select an Option</SelectItem>
												{dataCentreTypeOptions.map((opt) => (
													<SelectItem key={opt} value={opt}>
														{opt}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<div className="mb-2 flex items-center justify-between">
											<Label
												className="text-xs text-muted-foreground"
												htmlFor="utilisation"
											>
												% of Utilisation *
											</Label>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															aria-label="Info about utilisation"
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														Actual IT power consumption vs maximum IT design.
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<Select
											value={state.utilisation}
											onValueChange={(value) =>
												setState((prev) => ({ ...prev, utilisation: value }))
											}
										>
											<SelectTrigger className="h-8 w-full">
												<SelectValue placeholder="Select an Option" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">Select an Option</SelectItem>
												{utilisationOptions.map((opt) => (
													<SelectItem key={opt} value={opt}>
														{opt}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<div className="mb-2 flex items-center justify-between">
											<Label
												className="text-xs text-muted-foreground"
												htmlFor="yearsOfOperation"
											>
												Planned Number of Years of Operation *
											</Label>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															aria-label="Info about years of operation"
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														Expected operational lifespan of the new cooling
														system. The maximum number of years of operation is
														20 years.
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<Input
											type="number"
											min="1"
											max="20"
											value={state.yearsOfOperation}
											onChange={(e) =>
												setState((prev) => ({
													...prev,
													yearsOfOperation: e.target.value,
												}))
											}
											className="w-full border rounded px-3 py-2"
											placeholder="Enter years (max 20)"
										/>
									</div>
									<div>
										<div className="mb-2 flex items-center justify-between">
											<Label
												className="text-xs text-muted-foreground"
												htmlFor="projectLocation"
											>
												Project Location *
											</Label>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															aria-label="Info about project location"
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														Please choose the country where your data center is
														located. If you can&apos;t find it in the dropdown, pick
														the country that has the most similar climate.
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<Select
											value={state.projectLocation}
											onValueChange={(value) =>
												setState((prev) => ({
													...prev,
													projectLocation: value,
												}))
											}
										>
											<SelectTrigger className="h-8 w-full">
												<SelectValue placeholder="Select an Option" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">Select an Option</SelectItem>
												{projectLocationOptions.map((opt) => (
													<SelectItem key={opt} value={opt}>
														{opt}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<div className="mb-2 flex items-center justify-between">
											<Label
												className="text-xs text-muted-foreground"
												htmlFor="dataHallCapacity"
											>
												{getCapacityLabel()} *
											</Label>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															aria-label="Info about data hall capacity"
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														The maximum amount of electrical energy consumed by
														or dedicated to the installed IT equipment. The
														value should be greater than 0.5 MW but no more than
														10 MW.
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<Input
											type="number"
											min="0.5"
											max="10"
											step="0.01"
											value={state.dataHallCapacity}
											onChange={(e) =>
												setState((prev) => ({
													...prev,
													dataHallCapacity: e.target.value,
												}))
											}
											className="w-full border rounded px-3 py-2"
											placeholder="e.g. 2.5"
										/>
									</div>
									<div>
										<div className="mb-2 flex items-center justify-between">
											<Label
												className="text-xs text-muted-foreground"
												htmlFor="firstYear"
											>
												First Year of Operation *
											</Label>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															aria-label="Info about first year of operation"
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														Planned commencement year for the data center or
														hall.
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<Select
											value={state.firstYear}
											onValueChange={(value) =>
												setState((prev) => ({ ...prev, firstYear: value }))
											}
										>
											<SelectTrigger className="h-8 w-full">
												<SelectValue placeholder="Select an Option" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">Select an Option</SelectItem>
												{yearOptions.map((opt) => (
													<SelectItem key={opt} value={opt}>
														{opt}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
							{/* Solution Variant Configuration */}
							<div className="w-full mb-10">
								<h2 className="text-xl font-semibold mb-4">
									{getSolutionVariantConfigText()}
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<div className="flex items-center gap-2 mb-2">
											<Label
												className="text-xs text-muted-foreground"
												htmlFor="airCoolingPUE"
												title={getEfficiencyLabel()}
											>
												{getEfficiencyLabel()} *
											</Label>
											<span className="text-xs text-muted-foreground font-semibold ml-1">
												1.54
											</span>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															aria-label="Info about Air Cooling pPUE"
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														Typical Air Annualised pPUE (partial Power Usage
														Effectiveness for cooling) for the selected location
														at selected load. Please ensure any inputted pPUE
														value is above 1.00 and below 3.00. The suggested
														average market value is to the right and based on
														the selected load of 40%. At 100% of load, the
														selected location has average market pPUE of 1.2.
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<div className="flex items-center gap-2">
											<Input
												type="number"
												step="0.01"
												min="1"
												value={state.airCoolingPUE}
												onChange={(e) =>
													setState((prev) => ({
														...prev,
														airCoolingPUE: e.target.value,
													}))
												}
												className="w-full border rounded px-3 py-2"
												placeholder="Enter value (1.00 - 3.00)"
											/>
										</div>
									</div>

									{capitalisedNames.solutionId === "liquid cooling" && <div>
										<div className="flex items-center gap-2 mb-1">
											<h3 className="text-md font-semibold">
												{getSolutionName()}
											</h3>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															tabIndex={0}
															aria-label="Info about Chassis Immersion Precision Liquid Cooling"
															className="focus:outline-none"
														>
															<Info className="w-4 h-4 text-muted-foreground" />
														</button>
													</TooltipTrigger>
													<TooltipContent side="top" className="max-w-xs">
														Chassis Immersion is our advanced liquid cooling
														solution, providing efficient thermal management for
														high-density compute environments. Select your
														configuration and enter the required values for
														accurate TCO calculation.
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<Label
											className="text-xs text-muted-foreground mb-2"
											htmlFor="liquidCoolingPUE"
											title="Annualized partial Power Usage Effectiveness for Chassis Immersion Liquid Cooling"
										>
											Annualised Liquid Cooled pPUE at selected % of load:
										</Label>
										<div className="flex items-center gap-2">
											<Input
												type="number"
												step="0.01"
												min="0"
												value={"1.13"}
												readOnly
												className="w-full border rounded px-3 py-2 bg-muted cursor-not-allowed"
											/>
											<span className="text-xs text-muted-foreground font-semibold ml-1">
												1.13
											</span>
										</div>
									</div>}
								</div>
								{/* Always show Advanced button, warning, and asterisk note below the Cooling Configuration section */}
								<div className="flex flex-col items-start gap-2 mt-4 mb-8">
									<Button disabled={!allRequiredFilled}>Advanced...</Button>
									<p className="text-sm text-muted-foreground italic">
										An asterisk * denotes that the field is required to view
										results
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Show Result Button */}
				<div className="flex flex-col items-center mt-12 gap-6">
					{/* Error Display */}
					{calculationError && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl w-full">
							<p className="text-red-800 text-sm font-medium">
								Calculation Error: {calculationError}
							</p>
						</div>
					)}
					
					<div className="flex gap-6 mt-4">
						<Button
							type="button"
							className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg"
							onClick={handleShowResult}
							disabled={!allRequiredFilled || isCalculating}
						>
							{isCalculating ? 'Calculating...' : 'Show Result'}
						</Button>
						<Button
							type="button"
							className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg"
							onClick={handleReset}
						>
							Reset
						</Button>
					</div>

					{/* Show Result Table */}
					{state.showResultTable && (
						<div
							id="tco-dashboard-export"
							className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-16"
						>
							{/* Loading State */}
							{isCalculating && (
								<div className="flex justify-center items-center py-16">
									<div className="text-center">
										<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#11182A] mx-auto mb-4"></div>
										<p className="text-lg font-medium">Calculating results...</p>
										<p className="text-sm text-gray-600">This may take a few moments</p>
									</div>
								</div>
							)}

							{/* Results Tables - Only show when not calculating */}
							{!isCalculating && (
								<>
									{/* No Results Message */}
									{!calculationResults && (
										<div className="text-center py-16">
											<p className="text-lg text-gray-600">
												Click "Show Result" to view calculation results
											</p>
										</div>
									)}

									{/* Results Tables - Only show when we have calculation results */}
									{calculationResults && (
										<>
							{/* Demonstrated Value Comparison Table */}
							<div>
								<h2 className="text-2xl font-semibold mb-6 text-center">
									Demonstrated Value Comparison
								</h2>
								<div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
									<div className="min-w-[800px]">
										<Table className="w-full">
											<TableHeader>
												<TableRow className="bg-gray-100 border-b border-gray-300">
													<TableHead className="text-left font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">
														Metric
													</TableHead>
													<TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">
														Air Cooled Solution
													</TableHead>
													<TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">
														Chassis Immersion Solution
													</TableHead>
													<TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">
														Potential Saving
													</TableHead>
													<TableHead className="text-center font-semibold text-gray-900 py-3 px-4">
														Potential Saving (%)
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												<TableRow className="hover:bg-gray-50 border-b border-gray-200">
													<TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">
														Cooling Equipment Capex (Excl: Land, Core & Shell)
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().airCoolingCapex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().liquidCoolingCapex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(calculateSavings(getDisplayValues().airCoolingCapex, getDisplayValues().liquidCoolingCapex).amount)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4">
																		{formatPercentage(calculateSavings(getDisplayValues().airCoolingCapex, getDisplayValues().liquidCoolingCapex).percentage)}
													</TableCell>
												</TableRow>
												<TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
													<TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">
														Total capex
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().airTotalCapex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().liquidTotalCapex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(calculateSavings(getDisplayValues().airTotalCapex, getDisplayValues().liquidTotalCapex).amount)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4">
																		{formatPercentage(calculateSavings(getDisplayValues().airTotalCapex, getDisplayValues().liquidTotalCapex).percentage)}
													</TableCell>
												</TableRow>
												<TableRow className="hover:bg-gray-50 border-b border-gray-200">
													<TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">
														Annual Cooling Opex
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().airAnnualOpex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().liquidAnnualOpex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(calculateSavings(getDisplayValues().airAnnualOpex, getDisplayValues().liquidAnnualOpex).amount)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4">
																		{formatPercentage(calculateSavings(getDisplayValues().airAnnualOpex, getDisplayValues().liquidAnnualOpex).percentage)}
													</TableCell>
												</TableRow>
												<TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
													<TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">
														Opex for Lifetime of Operation
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().airLifetimeOpex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(getDisplayValues().liquidLifetimeOpex)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">
																		{formatCurrency(calculateSavings(getDisplayValues().airLifetimeOpex, getDisplayValues().liquidLifetimeOpex).amount)}
													</TableCell>
													<TableCell className="font-semibold text-center py-3 px-4">
																		{formatPercentage(calculateSavings(getDisplayValues().airLifetimeOpex, getDisplayValues().liquidLifetimeOpex).percentage)}
													</TableCell>
												</TableRow>
												<TableRow className="hover:bg-gray-50 bg-gray-100 border-t-2 border-gray-400">
													<TableCell className="font-bold text-gray-900 py-4 px-4 border-r border-gray-200 text-base">
														Total Cost of Ownership (Excl: IT, Land, Core &
														Shell)
													</TableCell>
													<TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">
																		{formatCurrency(getDisplayValues().airTotalTCO)}
													</TableCell>
													<TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">
																		{formatCurrency(getDisplayValues().liquidTotalTCO)}
													</TableCell>
													<TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">
																		{formatCurrency(calculateSavings(getDisplayValues().airTotalTCO, getDisplayValues().liquidTotalTCO).amount)}
													</TableCell>
													<TableCell className="font-bold text-center py-4 px-4 text-base">
																		{formatPercentage(calculateSavings(getDisplayValues().airTotalTCO, getDisplayValues().liquidTotalTCO).percentage)}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</div>
								</div>
							</div>
										</>
									)}
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
