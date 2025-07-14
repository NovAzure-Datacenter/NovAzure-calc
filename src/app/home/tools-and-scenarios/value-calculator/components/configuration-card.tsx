"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ConfigField, AdvancedConfig } from "../types/types";
import { ConfigurationSection } from "./configuration-section";
import { FIELD_CATEGORIES } from "@/lib/constants/calculator-config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ConfigurationCardProps {
	configFields: ConfigField[];
	onConfigFieldChange: (id: string, value: string | number) => void;
	onCalculationResult: (result: any) => void;
	isCalculateDisabled: boolean;
	isLoading?: boolean;
	advancedConfig?: AdvancedConfig;
	onAdvancedConfigChange?: (config: AdvancedConfig) => void;
	selectedSolutionInfo?: { name: string; description?: string } | null;
	selectedSolutionVariant?: string;
	hideCompareButton?: boolean;
}

interface calcInputs{
    solution_type: string;
    data_hall_design_capacity_mw: number;
    first_year_of_operation: number;
    project_location: string;
    percentage_of_utilisation: number;
    planned_years_of_operation: number;
    annualised_ppue: number;
    advanced: boolean;
}

const ConfigurationCard = forwardRef(function ConfigurationCard(
	{
		configFields,
		onConfigFieldChange,
		onCalculationResult,
		isCalculateDisabled,
		isLoading = false,
		advancedConfig,
		onAdvancedConfigChange,
		selectedSolutionInfo,
		hideCompareButton = false,
	}: ConfigurationCardProps,
	ref
) {
	// Move runCalculation out of useEffect so it can be called on button press only
	const runCalculation = async () => {
		if (!selectedSolutionInfo) return;

		// Map frontend solution name to backend solution_type
		let backendSolutionType = "";
		if (selectedSolutionInfo.name === "Air Cooling") {
			backendSolutionType = "air_cooling";
		} else if (selectedSolutionInfo.name === "Liquid Cooling") {
			backendSolutionType = "chassis_immersion";
		} else {
			backendSolutionType =
				selectedSolutionInfo.name?.toLowerCase().replace(/\s+/g, "_") || "";
		}

        // Prepare the inputs for the calculation
        const inputs: calcInputs = {
            solution_type: backendSolutionType,
            data_hall_design_capacity_mw: 0,
            first_year_of_operation: 0,
            project_location: "",
            percentage_of_utilisation: 0,
            planned_years_of_operation: 0,
            annualised_ppue: 0,
            advanced: false
        };
        // Populate inputs based on configFields
        configFields.forEach(field => {
            switch (field.id) {
                case 'data_hall_capacity':
                    inputs.data_hall_design_capacity_mw = Number(field.value);
                    break;
                case 'first_year_operation':
                    inputs.first_year_of_operation = Number(field.value);
                    break;
                case 'project_location':
                    inputs.project_location = field.value as string;
                    break;
                case 'utilisation_percentage':
                    // Remove % symbol and convert to number
                    const percentageValue = (field.value as string).replace('%', '');
                    inputs.percentage_of_utilisation = Number(percentageValue);
                    break;
                case 'planned_years_operation':
                    inputs.planned_years_of_operation = Number(field.value);
                    break;
                case 'air_annualised_ppue':
                    inputs.annualised_ppue = Number(field.value);
                    break;
                default:
                    break;
            }
        });

		console.log("Prepared inputs for calculation:", inputs);

		// Call the API with the prepared inputs
		try {
			const response = await fetch(
				"http://localhost:8000/calculations/calculate",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(inputs),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to calculate");
			}

			const result = await response.json();
			console.log("Calculation result:", result);
			onCalculationResult(result);
		} catch (error) {
			console.error("Error during calculation:", error);
			console.log("SOlution name: " + selectedSolutionInfo.name);
		}
	};

	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
	// Remove local includeITCost state; make it controlled via advancedConfig prop

	// Function to determine if the solution is air cooling
	const isAirCoolingSolution = (
		solutionInfo: { name: string } | null
	): boolean => {
		if (!solutionInfo) return false;
		return solutionInfo.name === "Air Cooling";
	};

	// Function to determine if the solution is liquid cooling
	const isLiquidCoolingSolution = (
		solutionInfo: { name: string } | null
	): boolean => {
		if (!solutionInfo) return false;
		return solutionInfo.name === "Liquid Cooling";
	};

	const handleAdvancedChange = (
		field: keyof AdvancedConfig,
		value: string | number
	) => {
		if (advancedConfig && onAdvancedConfigChange) {
			onAdvancedConfigChange({
				...advancedConfig,
				[field]: value,
			});
		}
	};

	// Expose runCalculation to parent via ref
	useImperativeHandle(ref, () => ({
		runCalculation: () => {
			return runCalculation();
		},
	}));
	// Separate data center fields from cooling configuration fields using centralized categorization
	const dataCenterFields = configFields.filter((field) =>
		FIELD_CATEGORIES.dataCenter.includes(field.id)
	);

	const airCoolingFields = configFields.filter((field) =>
		FIELD_CATEGORIES.airCooling.includes(field.id)
	);

	const chassisConfigFields = configFields.filter((field) =>
		FIELD_CATEGORIES.liquidCooling.includes(field.id)
	);

	const otherConfigFields = configFields.filter(
		(field) => !Object.values(FIELD_CATEGORIES).flat().includes(field.id)
	);

	// Extract dependency values for air cooling PPUE calculation
	const getDependencyValue = (fieldId: string) => {
		const field = dataCenterFields.find((f) => f.id === fieldId);
		return field?.value || "";
	};

	const airCoolingDependencies = {
		utilisation_percentage: getDependencyValue("utilisation_percentage"),
		project_location: getDependencyValue("project_location"),
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">High Level Configuration</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Required Fields Note */}
				<div className="text-xs text-gray-500 bg-gray-50 rounded-lg">
					<span className="text-red-500">*</span> Required fields must be
					completed before calculation. Advanced fields are optional.
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<div className="text-sm text-gray-500">
							Loading configuration...
						</div>
					</div>
				) : (
					<>
						{/* Data Center Configuration */}
						{dataCenterFields.length > 0 && (
							<>
								<ConfigurationSection
									title="Data Center Configuration"
									fields={dataCenterFields}
									onFieldChange={onConfigFieldChange}
								/>
								<Separator />
							</>
						)}

						{/* Air Cooling Configuration */}
						{airCoolingFields.length > 0 && (
							<>
								<ConfigurationSection
									title="Air Cooling Configuration"
									fields={airCoolingFields}
									onFieldChange={onConfigFieldChange}
									dependencies={airCoolingDependencies}
								/>
								<Separator />
							</>
						)}

						{/* Chassis Configuration */}
						{chassisConfigFields.length > 0 && (
							<>
								<ConfigurationSection
									title="Chassis Immersion Configuration"
									fields={chassisConfigFields}
									onFieldChange={onConfigFieldChange}
								/>
								<Separator />
							</>
						)}

						{/* Other System Configuration */}
						{otherConfigFields.length > 0 && (
							<>
								<ConfigurationSection
									title="System Configuration"
									fields={otherConfigFields}
									onFieldChange={onConfigFieldChange}
								/>
								<Separator />
							</>
						)}

						{/* Advanced Section - Only show if solution is selected */}
						{selectedSolutionInfo && (
							<div className="space-y-4">
								<div className="flex gap-4">
									<Button
										variant="ghost"
										onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
										className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100"
									>
										Advanced
										{isAdvancedOpen ? (
											<ChevronUp className="h-4 w-4" />
										) : (
											<ChevronDown className="h-4 w-4" />
										)}
									</Button>
									{!hideCompareButton && (
										<Button
											onClick={runCalculation}
											className="flex-1 px-8 py-2"
											disabled={isCalculateDisabled}
										>
											Calculate
										</Button>
									)}
								</div>
								{isAdvancedOpen && (
									<div className="bg-white rounded-lg border border-gray-200 p-4">
										<div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
											<strong>Advanced Configuration:</strong> All fields in
											this section are optional and provide additional
											customization for more precise calculations.
										</div>
										<div className="space-y-6">
											{/* Data Centre Configuration - Advanced */}
											<div className="space-y-3">
												<h3 className="text-xs font-medium text-gray-700">
													Data Centre Configuration - Advanced
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<div className="space-y-1">
														<Label
															htmlFor="inletTemperature"
															className="text-xs font-medium"
														>
															Inlet Temperature
														</Label>
														<Input
															id="inletTemperature"
															type="number"
															className="text-xs h-8"
															placeholder="Enter temperature"
															value={advancedConfig?.inletTemperature || ""}
															onChange={(e) =>
																handleAdvancedChange(
																	"inletTemperature",
																	Number(e.target.value)
																)
															}
														/>
													</div>
													<div className="space-y-1">
														<Label
															htmlFor="electricityPrice"
															className="text-xs font-medium"
														>
															Electricity Price ($/kWh)
														</Label>
														<Input
															id="electricityPrice"
															type="number"
															step="0.01"
															className="text-xs h-8"
															placeholder="Enter price"
															value={advancedConfig?.electricityPrice || ""}
															onChange={(e) =>
																handleAdvancedChange(
																	"electricityPrice",
																	Number(e.target.value)
																)
															}
														/>
													</div>
													<div className="space-y-1">
														<Label
															htmlFor="waterPrice"
															className="text-xs font-medium"
														>
															Water Price ($/L)
														</Label>
														<Input
															id="waterPrice"
															type="number"
															step="0.01"
															className="text-xs h-8"
															placeholder="Enter price"
															value={advancedConfig?.waterPrice || ""}
															onChange={(e) =>
																handleAdvancedChange(
																	"waterPrice",
																	Number(e.target.value)
																)
															}
														/>
													</div>
													<div className="space-y-1">
														<Label
															htmlFor="waterloop"
															className="text-xs font-medium"
														>
															Waterloop?
														</Label>
														<Select
															value={advancedConfig?.waterloop || ""}
															onValueChange={(value) =>
																handleAdvancedChange("waterloop", value)
															}
														>
															<SelectTrigger className="text-xs h-8">
																<SelectValue placeholder="Select option" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="yes">Yes</SelectItem>
																<SelectItem value="no">No</SelectItem>
															</SelectContent>
														</Select>
													</div>
													<div className="md:col-span-2 space-y-1">
														<Label
															htmlFor="requiredElectricalPowerIncrease"
															className="text-xs font-medium"
														>
															Required Increase of Electrical Plant Power
														</Label>
														<Input
															id="requiredElectricalPowerIncrease"
															type="number"
															className="text-xs h-8"
															placeholder="Enter power increase"
															value={
																advancedConfig?.requiredElectricalPowerIncrease ||
																""
															}
															onChange={(e) =>
																handleAdvancedChange(
																	"requiredElectricalPowerIncrease",
																	Number(e.target.value)
																)
															}
														/>
													</div>
												</div>
											</div>

											{/* Air Cooling Configuration - Advanced - Only show if air cooling solution is selected */}
											{isAirCoolingSolution(selectedSolutionInfo || null) && (
												<div className="space-y-3">
													<h3 className="text-xs font-medium text-gray-700">
														Air Cooling Configuration - Advanced
													</h3>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
														<div className="space-y-1">
															<Label
																htmlFor="coolingAlternative"
																className="text-xs font-medium"
															>
																Cooling Alternative to be Compared with Chassis
															</Label>
															<Input
																id="coolingAlternative"
																type="text"
																className="text-xs h-8"
																placeholder="Enter cooling alternative"
																value={advancedConfig?.coolingAlternative || ""}
																onChange={(e) =>
																	handleAdvancedChange(
																		"coolingAlternative",
																		e.target.value
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="defaultAirCoolingTechnology"
																className="text-xs font-medium"
															>
																Default Air Cooling Technology in UK
															</Label>
															<Input
																id="defaultAirCoolingTechnology"
																type="text"
																className="text-xs h-8"
																placeholder="Enter technology"
																value={
																	advancedConfig?.defaultAirCoolingTechnology ||
																	""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"defaultAirCoolingTechnology",
																		e.target.value
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="airChassisPerRack"
																className="text-xs font-medium"
															>
																Number of Air Chassis per Rack
															</Label>
															<Input
																id="airChassisPerRack"
																type="number"
																className="text-xs h-8"
																placeholder="Enter number"
																value={advancedConfig?.airChassisPerRack || ""}
																onChange={(e) =>
																	handleAdvancedChange(
																		"airChassisPerRack",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="airCoolingCapexCost"
																className="text-xs font-medium"
															>
																Air Cooling Capex Cost per Rack (Including GC
																Works)
															</Label>
															<Input
																id="airCoolingCapexCost"
																type="number"
																className="text-xs h-8"
																placeholder="Enter cost"
																value={
																	advancedConfig?.airCoolingCapexCost || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"airCoolingCapexCost",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="annualAirCoolingMaintenance"
																className="text-xs font-medium"
															>
																Annual Air Cooling Maintenance (excl. IT
																maintenance, assumed as % of capex)
															</Label>
															<Input
																id="annualAirCoolingMaintenance"
																type="number"
																step="0.01"
																className="text-xs h-8"
																placeholder="Enter percentage"
																value={
																	advancedConfig?.annualAirCoolingMaintenance ||
																	""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"annualAirCoolingMaintenance",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="airWUE"
																className="text-xs font-medium"
															>
																Air WUE
															</Label>
															<Input
																id="airWUE"
																type="number"
																step="0.01"
																className="text-xs h-8"
																placeholder="Enter WUE"
																value={advancedConfig?.airWUE || ""}
																onChange={(e) =>
																	handleAdvancedChange(
																		"airWUE",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
													</div>
												</div>
											)}

											{/* PLC Configuration - Advanced - Only show if liquid cooling solution is selected */}
											{isLiquidCoolingSolution(
												selectedSolutionInfo || null
											) && (
												<div className="space-y-3">
													<h3 className="text-xs font-medium text-gray-700">
														PLC Configuration - Advanced
													</h3>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
														<div className="space-y-1">
															<Label
																htmlFor="chassisTechnology"
																className="text-xs font-medium"
															>
																Chassis Immersion Technology
															</Label>
															<Input
																id="chassisTechnology"
																type="text"
																className="text-xs h-8"
																placeholder="Enter technology"
																value={advancedConfig?.chassisTechnology || ""}
																onChange={(e) =>
																	handleAdvancedChange(
																		"chassisTechnology",
																		e.target.value
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="plcRackCoolingCapacity"
																className="text-xs font-medium"
															>
																PLC Rack Cooling Capacity (kW/rack)
															</Label>
															<Input
																id="plcRackCoolingCapacity"
																type="number"
																className="text-xs h-8"
																placeholder="Enter capacity"
																value={
																	advancedConfig?.plcRackCoolingCapacity || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"plcRackCoolingCapacity",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="annualPLCMaintenance"
																className="text-xs font-medium"
															>
																Annual PLC Maintenance (excl. IT Maintenance,
																assumed as % of Capex)
															</Label>
															<Input
																id="annualPLCMaintenance"
																type="number"
																step="0.01"
																className="text-xs h-8"
																placeholder="Enter percentage"
																value={
																	advancedConfig?.annualPLCMaintenance || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"annualPLCMaintenance",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="includePoCCost"
																className="text-xs font-medium"
															>
																Include PoC Cost
															</Label>
															<Select
																value={advancedConfig?.includePoCCost || ""}
																onValueChange={(value) =>
																	handleAdvancedChange("includePoCCost", value)
																}
															>
																<SelectTrigger className="text-xs h-8">
																	<SelectValue placeholder="Select option" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="yes">Yes</SelectItem>
																	<SelectItem value="no">No</SelectItem>
																</SelectContent>
															</Select>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="totalPoCCost"
																className="text-xs font-medium"
															>
																Total PoC Cost in USD
															</Label>
															<Input
																id="totalPoCCost"
																type="number"
																className="text-xs h-8"
																placeholder="Enter cost"
																value={advancedConfig?.totalPoCCost || ""}
																onChange={(e) =>
																	handleAdvancedChange(
																		"totalPoCCost",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="plcChassisPerRack"
																className="text-xs font-medium"
															>
																Number of PLC chassis per rack
															</Label>
															<Input
																id="plcChassisPerRack"
																type="number"
																className="text-xs h-8"
																placeholder="Enter number"
																value={advancedConfig?.plcChassisPerRack || ""}
																onChange={(e) =>
																	handleAdvancedChange(
																		"plcChassisPerRack",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
													</div>
												</div>
											)}

											{/* Space Configuration */}
											<div className="space-y-3">
												<h3 className="text-xs font-medium text-gray-700">
													Space Configuration
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<div className="space-y-1">
														<Label
															htmlFor="floorSpacePerAirRack"
															className="text-xs font-medium"
														>
															Floor Space Required Per Air Cooled Rack (sq m)
														</Label>
														<Input
															id="floorSpacePerAirRack"
															type="number"
															step="0.01"
															className="text-xs h-8"
															placeholder="Enter space"
															value={advancedConfig?.floorSpacePerAirRack || ""}
															onChange={(e) =>
																handleAdvancedChange(
																	"floorSpacePerAirRack",
																	Number(e.target.value)
																)
															}
														/>
													</div>
													<div className="space-y-1">
														<Label
															htmlFor="floorSpacePerPLCRack"
															className="text-xs font-medium"
														>
															Floor Space Per PLC Rack (sq m)
														</Label>
														<Input
															id="floorSpacePerPLCRack"
															type="number"
															step="0.01"
															className="text-xs h-8"
															placeholder="Enter space"
															value={advancedConfig?.floorSpacePerPLCRack || ""}
															onChange={(e) =>
																handleAdvancedChange(
																	"floorSpacePerPLCRack",
																	Number(e.target.value)
																)
															}
														/>
													</div>
													<div className="space-y-1">
														<Label
															htmlFor="spaceUnit"
															className="text-xs font-medium"
														>
															Unit
														</Label>
														<Select
															value={advancedConfig?.spaceUnit || ""}
															onValueChange={(value) =>
																handleAdvancedChange("spaceUnit", value)
															}
														>
															<SelectTrigger className="text-xs h-8">
																<SelectValue placeholder="Select unit" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="sq_m">
																	Square meters
																</SelectItem>
																<SelectItem value="sq_ft">
																	Square feet
																</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>
											</div>

											{/* IT Configuration - Advanced (Optional) */}
											<div className="space-y-3">
												<h3 className="text-xs font-medium text-gray-700">
													IT Configuration - Advanced
												</h3>
												<div className="mb-4 flex flex-wrap items-center gap-2">
													<input
														id="include-it-cost-checkbox"
														type="checkbox"
														className="accent-purple-600 h-4 w-4"
														checked={advancedConfig?.includeITCost === "yes"}
														onChange={(e) =>
															handleAdvancedChange(
																"includeITCost",
																e.target.checked ? "yes" : "no"
															)
														}
													/>
													<label
														htmlFor="include-it-cost-checkbox"
														className="text-sm text-gray-700 select-none cursor-pointer whitespace-nowrap"
													>
														Include IT Cost in calculations
													</label>
												</div>
												{advancedConfig?.includeITCost === "yes" && (
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
														<div className="space-y-1">
															<Label
																htmlFor="serverRatedMaxPower"
																className="text-xs font-medium"
															>
																Server Rated Max Power
															</Label>
															<Input
																id="serverRatedMaxPower"
																type="number"
																className="text-xs h-8"
																placeholder="Enter power"
																value={
																	advancedConfig?.serverRatedMaxPower || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"serverRatedMaxPower",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="maxChassisPerRackAir"
																className="text-xs font-medium"
															>
																Maximum Number of Chassis per Rack for Air
															</Label>
															<Input
																id="maxChassisPerRackAir"
																type="number"
																className="text-xs h-8"
																placeholder="Enter number"
																value={
																	advancedConfig?.maxChassisPerRackAir || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"maxChassisPerRackAir",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="totalAirPowerPerRack"
																className="text-xs font-medium"
															>
																Total Air Power Per Rack (kW/rack)
															</Label>
															<Input
																id="totalAirPowerPerRack"
																type="number"
																className="text-xs h-8"
																placeholder="Enter power"
																value={
																	advancedConfig?.totalAirPowerPerRack || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"totalAirPowerPerRack",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="typicalITCostPerServer"
																className="text-xs font-medium"
															>
																Typical IT Cost per Server (Incl. Server, Memory
																and Network Cost)
															</Label>
															<Input
																id="typicalITCostPerServer"
																type="number"
																className="text-xs h-8"
																placeholder="Enter cost"
																value={
																	advancedConfig?.typicalITCostPerServer || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"typicalITCostPerServer",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="typicalITCostPerServerAlt"
																className="text-xs font-medium"
															>
																Typical IT Cost per Server
															</Label>
															<Input
																id="typicalITCostPerServerAlt"
																type="number"
																className="text-xs h-8"
																placeholder="Enter cost"
																value={
																	advancedConfig?.typicalITCostPerServerAlt ||
																	""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"typicalITCostPerServerAlt",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="annualITMaintenanceCost"
																className="text-xs font-medium"
															>
																Annual IT Maintenance Cost
															</Label>
															<Input
																id="annualITMaintenanceCost"
																type="number"
																className="text-xs h-8"
																placeholder="Enter cost"
																value={
																	advancedConfig?.annualITMaintenanceCost || ""
																}
																onChange={(e) =>
																	handleAdvancedChange(
																		"annualITMaintenanceCost",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
														<div className="space-y-1">
															<Label
																htmlFor="serverRefreshYears"
																className="text-xs font-medium"
															>
																Number of Server Refresh in Years
															</Label>
															<Input
																id="serverRefreshYears"
																type="number"
																className="text-xs h-8"
																placeholder="Enter years"
																value={advancedConfig?.serverRefreshYears || ""}
																onChange={(e) =>
																	handleAdvancedChange(
																		"serverRefreshYears",
																		Number(e.target.value)
																	)
																}
															/>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						)}

						{/* The Calculate button is now inside the Advanced Section */}
					</>
				)}
			</CardContent>
		</Card>
	);
});

// Fix: forwardRef returns a component, so export default the result of forwardRef, not the function itself
// This ensures the default export is the ref-enabled component
export default ConfigurationCard;
