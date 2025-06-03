export interface CalculatorInputs {
	utilization: number;
	maxDesignITLoad: number;
	yearsOfOperation: number;
	firstYear: number;
	dataHallCapacity: number;
	avgTemperature: number;
	electricityPrice: number;
	waterPrice: number;
	maxServerPower: number;
	refreshCycles: number;
	itCost: number;
	maintenance: number;
	disksPerChassis: number;
	chassisPerRack: number;
	powerPerDisk: number;
	airCapex: number;
	upgradePercentage: number;
	electricalUpgrade: number;
	existingWaterLoop: boolean;
}

export interface CalculationResults {
	financial: {
		airCooling: {
			capex: number;
			annualOpex: number;
			totalOpex: number;
			totalCost: number;
		};
		liquidCooling: {
			capex: number;
			annualOpex: number;
			totalOpex: number;
			totalCost: number;
		};
		savings: {
			capex: number;
			capexPercent: number;
			annualOpex: number;
			annualOpexPercent: number;
			totalOpex: number;
			totalOpexPercent: number;
			totalCost: number;
			totalCostPercent: number;
		};
	};
	environmental: {
		airCooling: {
			pPUE: number;
			waterUsage: number;
			energyUsage: number;
			carbonFootprint: number;
			floorSpace: number;
		};
		liquidCooling: {
			pPUE: number;
			waterUsage: number;
			energyUsage: number;
			carbonFootprint: number;
			floorSpace: number;
		};
		savings: {
			pPUE: number;
			pPUEPercent: number;
			waterUsage: number;
			waterPercent: number;
			energyUsage: number;
			energyPercent: number;
			carbonFootprint: number;
			carbonPercent: number;
			floorSpace: number;
			floorSpacePercent: number;
		};
	};
}

export interface EnvironmentalMetrics {
	pPUE: number;
	waterUsage: number;
	energyUsage: number;
	carbonFootprint: number;
	floorSpace: number;
}

export interface EnvironmentalSavings {
	pPUE: number;
	pPUEPercent: number;
	waterUsage: number;
	waterPercent: number;
	energyUsage: number;
	energyPercent: number;
	carbonFootprint: number;
	carbonPercent: number;
	floorSpace: number;
	floorSpacePercent: number;
}

export interface EnvironmentalComparison {
	airCooling: EnvironmentalMetrics;
	liquidCooling: EnvironmentalMetrics;
	savings: EnvironmentalSavings;
}
