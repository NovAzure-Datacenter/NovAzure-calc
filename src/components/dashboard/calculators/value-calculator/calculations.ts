import type { CalculatorInputs, CalculationResults } from "./types";
import { mockBaselineData } from "./mock-data";

export function calculateResults(
	inputs: CalculatorInputs,
	scenario: string,
	dataCenterType: string,
	location: string
): CalculationResults {
	const locationData =
		mockBaselineData.locations[
			location as keyof typeof mockBaselineData.locations
		];
	const scenarioData =
		mockBaselineData.scenarios[
			scenario as keyof typeof mockBaselineData.scenarios
		];
	const dcTypeData =
		mockBaselineData.dataCenterTypes[
			dataCenterType as keyof typeof mockBaselineData.dataCenterTypes
		];
	const airCoolingData = mockBaselineData.coolingEfficiency.airCooling;
	const liquidCoolingData = mockBaselineData.coolingEfficiency.liquidCooling;

	// Calculate number of racks based on power requirements
	const totalPowerKW = inputs.maxDesignITLoad * 1000;
	const powerPerRack = dcTypeData.powerDensity;
	const numberOfRacks = Math.ceil(totalPowerKW / powerPerRack);

	// Air Cooling Power Calculations
	const airAnnualPowerConsumption =
		(totalPowerKW * airCoolingData.pue * 8760 * (inputs.utilization / 100)) / 1000; // MWh/year
	const airAnnualOpex =
		airAnnualPowerConsumption * locationData.electricityRate * 1000 +
		((numberOfRacks * inputs.maxServerPower * inputs.maintenance) / 100) * 12;
	const airTotalOpex = airAnnualOpex * inputs.yearsOfOperation;
	const airCapex =
		numberOfRacks * inputs.airCapex * scenarioData.constructionMultiplier;
	const airTotalCost = airCapex + airTotalOpex;

	// Liquid Cooling Power Calculations
	const liquidAnnualPowerConsumption =
		(totalPowerKW * liquidCoolingData.pue * 8760 * (inputs.utilization / 100)) /
		1000; // MWh/year
	const liquidAnnualOpex =
		liquidAnnualPowerConsumption * locationData.electricityRate * 1000 +
		((numberOfRacks * inputs.maxServerPower * inputs.maintenance) / 100) *
			12 *
			liquidCoolingData.maintenanceFactor;
	const liquidTotalOpex = liquidAnnualOpex * inputs.yearsOfOperation;
	const liquidCapex =
		airCapex * mockBaselineData.liquidCoolingPremium.capexMultiplier;
	const liquidTotalCost = liquidCapex + liquidTotalOpex;

	// Environmental Calculations
	
	// Energy Usage (MWh/year)
	const airEnergyUsage = airAnnualPowerConsumption;
	const liquidEnergyUsage = liquidAnnualPowerConsumption;
	
	// Water Usage (liters/year)
	const airWaterUsage = 
		(totalPowerKW / 1000) * airCoolingData.waterUsagePerMW * (inputs.utilization / 100);
	const liquidWaterUsage = 
		(totalPowerKW / 1000) * liquidCoolingData.waterUsagePerMW * (inputs.utilization / 100);

	// CO2 Emissions (metric tons/year)
	const airCO2 = 
		airAnnualPowerConsumption * locationData.co2Factor * locationData.climateFactor;
	const liquidCO2 = 
		liquidAnnualPowerConsumption * locationData.co2Factor * locationData.climateFactor;

	// Floor Space (sqm)
	const airFloorSpace = numberOfRacks * airCoolingData.floorSpacePerRack;
	const liquidFloorSpace = numberOfRacks * liquidCoolingData.floorSpacePerRack;

	return {
		financial: {
			airCooling: {
				capex: airCapex,
				annualOpex: airAnnualOpex,
				totalOpex: airTotalOpex,
				totalCost: airTotalCost,
			},
			liquidCooling: {
				capex: liquidCapex,
				annualOpex: liquidAnnualOpex,
				totalOpex: liquidTotalOpex,
				totalCost: liquidTotalCost,
			},
			savings: {
				capex: airCapex - liquidCapex,
				annualOpex: airAnnualOpex - liquidAnnualOpex,
				totalOpex: airTotalOpex - liquidTotalOpex,
				totalCost: airTotalCost - liquidTotalCost,
				capexPercent: Math.round(((airCapex - liquidCapex) / airCapex) * 100),
				annualOpexPercent: Math.round(
					((airAnnualOpex - liquidAnnualOpex) / airAnnualOpex) * 100
				),
				totalOpexPercent: Math.round(
					((airTotalOpex - liquidTotalOpex) / airTotalOpex) * 100
				),
				totalCostPercent: Math.round(
					((airTotalCost - liquidTotalCost) / airTotalCost) * 100
				),
			},
		},
		environmental: {
			airCooling: {
				pPUE: airCoolingData.pue,
				waterUsage: airWaterUsage,
				energyUsage: airEnergyUsage,
				carbonFootprint: airCO2,
				floorSpace: airFloorSpace,
			},
			liquidCooling: {
				pPUE: liquidCoolingData.pue,
				waterUsage: liquidWaterUsage,
				energyUsage: liquidEnergyUsage,
				carbonFootprint: liquidCO2,
				floorSpace: liquidFloorSpace,
			},
			savings: {
				pPUE: airCoolingData.pue - liquidCoolingData.pue,
				pPUEPercent: Math.round(
					((airCoolingData.pue - liquidCoolingData.pue) / airCoolingData.pue) * 100
				),
				waterUsage: airWaterUsage - liquidWaterUsage,
				waterPercent: Math.round(
					((airWaterUsage - liquidWaterUsage) / airWaterUsage) * 100
				),
				energyUsage: airEnergyUsage - liquidEnergyUsage,
				energyPercent: Math.round(
					((airEnergyUsage - liquidEnergyUsage) / airEnergyUsage) * 100
				),
				carbonFootprint: airCO2 - liquidCO2,
				carbonPercent: Math.round(((airCO2 - liquidCO2) / airCO2) * 100),
				floorSpace: airFloorSpace - liquidFloorSpace,
				floorSpacePercent: Math.round(
					((airFloorSpace - liquidFloorSpace) / airFloorSpace) * 100
				),
			},
		},
	};
}
