export const mockBaselineData = {
	locations: {
		uk: {
			electricityRate: 0.15, // €/kWh
			waterRate: 0.003, // €/L
			co2Factor: 0.233, // kg CO2/kWh
			climateFactor: 1.0,
		},
		usa: {
			electricityRate: 0.13,
			waterRate: 0.002,
			co2Factor: 0.386,
			climateFactor: 1.1,
		},
		uae: {
			electricityRate: 0.08,
			waterRate: 0.005,
			co2Factor: 0.49,
			climateFactor: 1.4,
		},
		singapore: {
			electricityRate: 0.18,
			waterRate: 0.004,
			co2Factor: 0.408,
			climateFactor: 1.2,
		},
	},
	coolingEfficiency: {
		airCooling: {
			pue: 1.7,
			maintenanceFactor: 1.2,
			floorSpacePerRack: 2.5, // sqm
			waterUsagePerMW: 15000, // L/year per MW
		},
		liquidCooling: {
			pue: 1.05,
			maintenanceFactor: 0.8,
			floorSpacePerRack: 1.0, // sqm
			waterUsagePerMW: 2000, // L/year per MW
		},
	},
	scenarios: {
		greenfield: {
			constructionMultiplier: 1.0,
			installationComplexity: 1.0,
		},
		retrofit: {
			constructionMultiplier: 1.3,
			installationComplexity: 1.5,
		},
	},
	dataCenterTypes: {
		general: {
			densityFactor: 1.0,
			powerDensity: 5, // kW per rack
		},
		hpc: {
			densityFactor: 2.5,
			powerDensity: 15, // kW per rack
		},
	},
	liquidCoolingPremium: {
		capexMultiplier: 0.9, // 10% less capex
		opexMultiplier: 0.6, // 40% less opex
	},
};
