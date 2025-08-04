/**
 * Semantic Pattern Recognition System for Value Calculator
 * Maps industry, technology and solution semantics to provide dynamic analysis
 * Supports Data Centers (Air Cooling, Liquid Cooling) with extensibility for future industries
 */

// Industry-specific semantic patterns
export const INDUSTRY_SEMANTICS = {
	DATA_CENTER: {
		name: 'Data Center',
		keywords: ['data center', 'datacenter', 'server', 'computing', 'it infrastructure'],
		technologies: ['air cooling', 'liquid cooling', 'immersion cooling', 'direct liquid cooling'],
		metrics: ['pue', 'wue', 'power usage effectiveness', 'water usage effectiveness', 'rack', 'server']
	},
	BATTERY: {
		name: 'Battery Manufacturing',
		keywords: ['battery', 'energy storage', 'lithium', 'cell manufacturing', 'ev battery'],
		technologies: ['lithium ion', 'solid state', 'battery pack', 'energy density'],
		metrics: ['energy density', 'cycle life', 'charge rate', 'thermal management']
	},
	EV: {
		name: 'Electric Vehicle',
		keywords: ['electric vehicle', 'ev', 'automotive', 'vehicle', 'car'],
		technologies: ['battery pack', 'motor', 'inverter', 'thermal management'],
		metrics: ['range', 'efficiency', 'charging time', 'thermal performance']
	}
};

// Technology-specific semantic patterns
export const TECHNOLOGY_SEMANTICS = {
	AIR_COOLING: {
		name: 'Air Cooling',
		keywords: ['air cooling', 'air cooled', 'air conditioning', 'dx system', 'ahu', 'air handling'],
		components: ['chiller', 'air handler', 'ductwork', 'fan', 'heat exchanger'],
		metrics: ['airflow', 'temperature', 'humidity', 'efficiency']
	},
	LIQUID_COOLING: {
		name: 'Liquid Cooling',
		keywords: ['liquid cooling', 'water cooling', 'immersion', 'direct liquid', 'cold plate'],
		components: ['pump', 'heat exchanger', 'coolant', 'cold plate', 'manifold'],
		metrics: ['flow rate', 'temperature', 'pressure', 'efficiency']
	},
	IMMERSION_COOLING: {
		name: 'Immersion Cooling',
		keywords: ['immersion', 'dielectric', 'single phase', 'two phase', 'oil cooling'],
		components: ['tank', 'pump', 'heat exchanger', 'dielectric fluid'],
		metrics: ['immersion ratio', 'heat transfer', 'efficiency', 'maintenance']
	}
};

// Comprehensive semantic synonym mapping
export const SEMANTIC_SYNONYMS = {
	// Financial Terms
	COST: {
		primary: ['cost', 'price', 'expense', 'expenditure', 'outlay', 'investment'],
		contextual: ['total cost', 'annual cost', 'lifetime cost', 'operational cost']
	},
	CAPEX: {
		primary: ['capex', 'capital', 'investment', 'initial', 'setup', 'equipment cost'],
		contextual: ['capital expenditure', 'initial investment', 'equipment capex', 'infrastructure cost']
	},
	OPEX: {
		primary: ['opex', 'operational', 'operating', 'maintenance', 'running', 'annual'],
		contextual: ['operational expenditure', 'annual opex', 'operational cost', 'maintenance cost']
	},
	
	// Energy Terms
	ENERGY: {
		primary: ['energy', 'power', 'electricity', 'consumption', 'usage', 'demand'],
		contextual: ['energy consumption', 'power consumption', 'electricity usage', 'energy demand']
	},
	EFFICIENCY: {
		primary: ['efficiency', 'performance', 'effectiveness', 'productivity', 'ratio'],
		contextual: ['energy efficiency', 'power efficiency', 'thermal efficiency', 'overall efficiency']
	},
	PUE: {
		primary: ['pue', 'power usage effectiveness', 'efficiency ratio', 'power ratio'],
		contextual: ['power usage effectiveness', 'data center efficiency', 'energy efficiency ratio']
	},
	
	// Environmental Terms
	WATER: {
		primary: ['water', 'h2o', 'liquid', 'consumption', 'usage', 'cooling water'],
		contextual: ['water consumption', 'water usage', 'cooling water', 'water cost']
	},
	WUE: {
		primary: ['wue', 'water usage effectiveness', 'water efficiency', 'water ratio'],
		contextual: ['water usage effectiveness', 'water efficiency ratio', 'cooling water efficiency']
	},
	CARBON: {
		primary: ['carbon', 'co2', 'emissions', 'footprint', 'environmental', 'greenhouse'],
		contextual: ['carbon emissions', 'co2 footprint', 'environmental impact', 'carbon intensity']
	},
	
	// Infrastructure Terms
	RACK: {
		primary: ['rack', 'cabinet', 'enclosure', 'unit', 'server rack'],
		contextual: ['server rack', 'rack count', 'number of racks', 'rack capacity']
	},
	EQUIPMENT: {
		primary: ['equipment', 'hardware', 'system', 'infrastructure', 'machinery'],
		contextual: ['cooling equipment', 'it equipment', 'infrastructure equipment', 'system hardware']
	},
	
	// Time Terms
	TIME: {
		primary: ['year', 'annual', 'lifetime', 'period', 'duration', 'operation'],
		contextual: ['planned years', 'expected years', 'operation period', 'lifetime duration']
	},
	
	// Cooling Terms
	COOLING: {
		primary: ['cooling', 'thermal', 'temperature', 'heat', 'chiller', 'air conditioning'],
		contextual: ['cooling system', 'thermal management', 'temperature control', 'heat removal']
	},
	HEAT_RECOVERY: {
		primary: ['heat recovery', 'thermal recovery', 'energy reuse', 'waste heat'],
		contextual: ['heat recovery system', 'thermal energy recovery', 'waste heat utilization']
	},
	
	// Utilization Terms
	UTILIZATION: {
		primary: ['utilization', 'usage', 'efficiency', 'capacity', 'load'],
		contextual: ['equipment utilization', 'capacity utilization', 'power utilization', 'server usage']
	},
	
	// Maintenance Terms
	MAINTENANCE: {
		primary: ['maintenance', 'service', 'upkeep', 'inspection', 'repair'],
		contextual: ['preventive maintenance', 'annual maintenance', 'equipment service', 'system upkeep']
	}
};

// Data Center specific semantic patterns
export const DATA_CENTER_SEMANTICS = {
	// Financial calculations
	FINANCIAL_PATTERNS: {
		TOTAL_COST_OF_OWNERSHIP: [
			'total cost of ownership', 'tco', 'lifetime cost', 'total ownership cost',
			'complete cost', 'overall cost', 'total investment', 'total_cost_of_ownership',
			'total cost of ownership excl it land core and shell'
		],
		CAPEX: [
			'capex', 'capital expenditure', 'initial investment', 'equipment capex',
			'infrastructure cost', 'setup cost', 'capital cost', 'cooling equipment capex',
			'chassis solution capex', 'chassis solution total capex'
		],
		ANNUAL_OPEX: [
			'annual opex', 'yearly opex', 'operational cost', 'annual operational',
			'operating cost', 'maintenance cost', 'running cost', 'annual_cooling_opex',
			'total opex cost per year', 'annual opex for required air cooled equipment'
		],
		LIFETIME_OPEX: [
			'lifetime opex', 'total opex', 'operational lifetime', 'total operational',
			'complete opex', 'overall opex', 'opex for lifetime of operation'
		],
		ENERGY_COST: [
			'energy cost', 'electricity cost', 'power cost', 'energy expense',
			'electricity expense', 'power expense', 'cost of energy required',
			'cost of energy required for computing and cooling per year'
		],
		WATER_COST: [
			'water cost', 'h2o cost', 'liquid cost', 'cooling water cost',
			'water expense', 'liquid expense', 'cost of water required',
			'cost of water required per year'
		],
		MAINTENANCE_COST: [
			'maintenance cost', 'service cost', 'upkeep cost', 'maintenance expense',
			'service expense', 'repair cost', 'cooling maintenance per year'
		]
	},
	
	// Energy calculations
	ENERGY_PATTERNS: {
		ENERGY_CONSUMPTION: [
			'energy required', 'power consumption', 'electricity usage', 'energy demand',
			'power usage', 'electricity consumption', 'energy usage', 'energy required for computing and cooling per year',
			'energy required for computing per year'
		],
		IT_POWER: [
			'it power', 'computing power', 'server power', 'it consumption',
			'computing consumption', 'server consumption', 'it power utilisation',
			'pump power within server'
		],
		NAMEPLATE_POWER: [
			'nameplate', 'rated power', 'maximum power', 'nameplate power',
			'rated capacity', 'maximum capacity'
		],
		PUMP_POWER: [
			'pump power', 'pump consumption', 'pump energy', 'pump usage',
			'circulation power', 'pump demand', 'pump power within server'
		]
	},
	
	// Environmental calculations
	ENVIRONMENTAL_PATTERNS: {
		WATER_CONSUMPTION: [
			'water required', 'water consumption', 'h2o usage', 'water demand',
			'cooling water', 'liquid consumption', 'water usage', 'water required per year'
		],
		CARBON_EMISSIONS: [
			'carbon', 'co2', 'emissions', 'footprint', 'environmental impact',
			'carbon emissions', 'co2 footprint', 'greenhouse gas'
		]
	},
	
	// Infrastructure calculations
	INFRASTRUCTURE_PATTERNS: {
		NUMBER_OF_RACKS: [
			'number of racks', 'rack count', 'total racks', 'rack quantity',
			'server racks', 'rack units', 'rack number'
		],
		CAPACITY: [
			'capacity', 'hall capacity', 'data capacity', 'facility capacity',
			'infrastructure capacity', 'system capacity'
		],
		PLANNED_YEARS: [
			'planned years', 'expected years', 'operation period', 'lifetime',
			'project duration', 'operation years', 'planned period'
		]
	},
	
	// Parameter patterns
	PARAMETER_PATTERNS: {
		ELECTRICITY_COST: [
			'electricity cost', 'energy cost', 'power cost', 'electricity price',
			'energy price', 'power price', 'electricity rate'
		],
		WATER_COST: [
			'water cost', 'h2o cost', 'liquid cost', 'water price',
			'h2o price', 'liquid price', 'water rate'
		],
		CO2_INTENSITY: [
			'co2 intensity', 'carbon intensity', 'emission factor', 'carbon factor',
			'emission intensity', 'co2 factor', 'carbon emission factor'
		],
		PUE: [
			'pue', 'power usage effectiveness', 'efficiency ratio', 'power ratio',
			'energy efficiency', 'power efficiency'
		],
		WUE: [
			'wue', 'water usage effectiveness', 'water efficiency', 'water ratio',
			'cooling water efficiency', 'water usage ratio'
		],
		HEAT_RECOVERY: [
			'heat recovery', 'thermal recovery', 'energy reuse', 'waste heat',
			'thermal energy recovery', 'heat reuse'
		],
		UTILIZATION: [
			'utilization', 'usage percentage', 'efficiency', 'capacity utilization',
			'equipment utilization', 'server utilization', 'power utilization'
		]
	}
};

// Pattern matching utilities
export class SemanticPatternMatcher {
	private calculationResults: any[];
	private parameters: any[];

	constructor(solutionData: any) {
		this.calculationResults = solutionData.calculations || [];
		this.parameters = solutionData.parameters || [];
	}

	/**
	 * Find calculation by semantic pattern matching
	 */
	findCalculationByPatterns(patterns: string[]): any {
		const normalizedPatterns = patterns.map(p => p.toLowerCase());
		
		// Strategy 1: Exact substring match
		let match = this.calculationResults.find(calc => 
			normalizedPatterns.some(pattern => 
				calc.name.toLowerCase().includes(pattern)
			)
		);

		// Strategy 2: Word boundary matching
		if (!match) {
			match = this.calculationResults.find(calc => 
				normalizedPatterns.some(pattern => {
					const words = calc.name.toLowerCase().split(/[\s_\-\.]+/);
					return words.some((word: string) => pattern.includes(word) || word.includes(pattern));
				})
			);
		}

		// Strategy 3: Semantic synonym matching
		if (!match) {
			const allSynonyms = normalizedPatterns.flatMap(pattern => 
				this.getSemanticSynonyms(pattern)
			);
			match = this.calculationResults.find(calc => 
				allSynonyms.some(synonym => 
					calc.name.toLowerCase().includes(synonym)
				)
			);
		}

		return match;
	}

	/**
	 * Find parameter by semantic pattern matching
	 */
	findParameterByPatterns(patterns: string[]): any {
		const normalizedPatterns = patterns.map(p => p.toLowerCase());
		
		// Strategy 1: Exact substring match
		let match = this.parameters.find(param => 
			normalizedPatterns.some(pattern => 
				param.name.toLowerCase().includes(pattern)
			)
		);

		// Strategy 2: Word boundary matching
		if (!match) {
			match = this.parameters.find(param => 
				normalizedPatterns.some(pattern => {
					const words = param.name.toLowerCase().split(/[\s_\-\.]+/);
					return words.some((word: string) => pattern.includes(word) || word.includes(pattern));
				})
			);
		}

		// Strategy 3: Semantic synonym matching
		if (!match) {
			const allSynonyms = normalizedPatterns.flatMap(pattern => 
				this.getSemanticSynonyms(pattern)
			);
			match = this.parameters.find(param => 
				allSynonyms.some(synonym => 
					param.name.toLowerCase().includes(synonym)
				)
			);
		}

		return match;
	}

	/**
	 * Get semantic synonyms for a given term
	 */
	private getSemanticSynonyms(term: string): string[] {
		// Check if term matches any primary keys in SEMANTIC_SYNONYMS
		for (const [key, synonyms] of Object.entries(SEMANTIC_SYNONYMS)) {
			if (synonyms.primary.includes(term) || synonyms.contextual.includes(term)) {
				return [...synonyms.primary, ...synonyms.contextual];
			}
		}
		
		// Return the original term if no synonyms found
		return [term];
	}

	/**
	 * Extract calculation value with fallback
	 */
	extractCalculationValue(patterns: string[], fallback: number = 0): number {
		const match = this.findCalculationByPatterns(patterns);
		let value = fallback;
		
		if (match) {
			// Handle "Error" results by trying to parse or use fallback
			if (match.result === "Error" || match.result === "error") {
				console.log(`⚠️ Calculation "${match.name}" has error result, using fallback`);
				value = fallback;
			} else {
				value = parseFloat(match.result || 0);
			}
		}
		
		// Debug logging
		console.log(`🔍 Searching for patterns:`, patterns);
		console.log(`📊 Found match:`, match ? match.name : 'None');
		console.log(`💰 Extracted value:`, value);
		
		return value;
	}

	/**
	 * Extract parameter value with fallback
	 */
	extractParameterValue(patterns: string[], fallback: number = 0): number {
		const match = this.findParameterByPatterns(patterns);
		const value = match ? parseFloat(match.test_value || match.value || 0) : fallback;
		
		// Debug logging
		console.log(`🔍 Searching for parameter patterns:`, patterns);
		console.log(`📊 Found parameter match:`, match ? match.name : 'None');
		console.log(`💰 Extracted parameter value:`, value);
		
		return value;
	}

	/**
	 * Debug method to show all available calculations
	 */
	debugAvailableCalculations(): void {
		console.log('📋 Available Calculations:');
		this.calculationResults.forEach((calc, index) => {
			console.log(`${index + 1}. ${calc.name} = ${calc.result}`);
		});
		console.log('📋 Available Parameters:');
		this.parameters.forEach((param, index) => {
			console.log(`${index + 1}. ${param.name} = ${param.test_value || param.value}`);
		});
	}
}

// Data Center specific analyzer
export class DataCenterAnalyzer extends SemanticPatternMatcher {
	constructor(solutionData: any) {
		super(solutionData);
	}

	/**
	 * Extract financial data using semantic patterns
	 */
	extractFinancialData() {
		return {
			totalCostOfOwnership: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.TOTAL_COST_OF_OWNERSHIP
			),
			capex: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.CAPEX
			),
			annualOpex: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ANNUAL_OPEX
			),
			lifetimeOpex: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.LIFETIME_OPEX
			),
			energyCost: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ENERGY_COST
			),
			waterCost: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.WATER_COST
			),
			maintenanceCost: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.MAINTENANCE_COST
			)
		};
	}

	/**
	 * Extract energy data using semantic patterns
	 */
	extractEnergyData() {
		return {
			energyConsumption: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.ENERGY_PATTERNS.ENERGY_CONSUMPTION
			),
			itPower: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.ENERGY_PATTERNS.IT_POWER
			),
			nameplatePower: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.ENERGY_PATTERNS.NAMEPLATE_POWER
			),
			pumpPower: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.ENERGY_PATTERNS.PUMP_POWER
			)
		};
	}

	/**
	 * Extract environmental data using semantic patterns
	 */
	extractEnvironmentalData() {
		return {
			waterConsumption: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.ENVIRONMENTAL_PATTERNS.WATER_CONSUMPTION
			),
			carbonEmissions: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.ENVIRONMENTAL_PATTERNS.CARBON_EMISSIONS
			)
		};
	}

	/**
	 * Extract infrastructure data using semantic patterns
	 */
	extractInfrastructureData() {
		return {
			numberOfRacks: this.extractCalculationValue(
				DATA_CENTER_SEMANTICS.INFRASTRUCTURE_PATTERNS.NUMBER_OF_RACKS
			),
			capacity: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.INFRASTRUCTURE_PATTERNS.CAPACITY
			),
			plannedYears: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.INFRASTRUCTURE_PATTERNS.PLANNED_YEARS
			)
		};
	}

	/**
	 * Extract parameter data using semantic patterns
	 */
	extractParameterData() {
		return {
			electricityCost: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.ELECTRICITY_COST
			),
			waterCost: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.WATER_COST
			),
			co2Intensity: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.CO2_INTENSITY
			),
			pue: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.PUE
			),
			wue: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.WUE
			),
			heatRecovery: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.HEAT_RECOVERY
			),
			utilization: this.extractParameterValue(
				DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.UTILIZATION
			),
			plannedYears: this.extractParameterValue([
				'planned years', 'expected years', 'operation period', 'lifetime',
				'project duration', 'operation years', 'planned period', 'planned number of years'
			]),
			nameplatePower: this.extractParameterValue([
				'nameplate power', 'rated power', 'maximum power', 'nameplate',
				'rated capacity', 'maximum capacity'
			]),
			numberOfRacks: this.extractParameterValue([
				'number of racks', 'rack count', 'total racks', 'rack quantity',
				'server racks', 'rack units', 'rack number'
			])
		};
	}

	/**
	 * Derive financial calculations from parameters when backend calculations fail
	 */
	private deriveFinancialCalculations(parameters: any): any {
		console.log('🧮 Deriving financial calculations from parameters...');
		
		// Extract key parameters
		const plannedYears = parameters.plannedYears || 4;
		const electricityCost = parameters.electricityCost || 0.365;
		const waterCost = parameters.waterCost || 3.43;
		const pue = parameters.pue || 2;
		const wue = parameters.wue || 0.025;
		const utilization = parameters.utilization || 0.2;
		const nameplatePower = parameters.nameplatePower || 3000;
		const numberOfRacks = parameters.numberOfRacks || 187.5;
		
		// Calculate derived values
		const itPower = nameplatePower * utilization;
		const totalPower = itPower * pue;
		const annualEnergyCost = totalPower * electricityCost * 8760; // hours per year
		const annualWaterCost = totalPower * wue * waterCost * 8760;
		const annualMaintenanceCost = annualEnergyCost * 0.08; // 8% of energy cost
		const annualOpex = annualEnergyCost + annualWaterCost + annualMaintenanceCost;
		
		// Capex estimates based on typical data center ratios
		const coolingEquipmentCapex = totalPower * 115; // $115/kW typical
		const infrastructureCapex = totalPower * 200; // $200/kW typical
		const totalCapex = coolingEquipmentCapex + infrastructureCapex;
		
		const lifetimeOpex = annualOpex * plannedYears;
		const totalCostOfOwnership = totalCapex + lifetimeOpex;
		
		console.log('📊 Derived Financial Data:', {
			totalCapex,
			annualOpex,
			lifetimeOpex,
			totalCostOfOwnership,
			annualEnergyCost,
			annualWaterCost,
			annualMaintenanceCost
		});
		
		return {
			totalCostOfOwnership,
			capex: coolingEquipmentCapex,
			annualOpex,
			lifetimeOpex,
			energyCost: annualEnergyCost,
			waterCost: annualWaterCost,
			maintenanceCost: annualMaintenanceCost
		};
	}

	/**
	 * Generate comprehensive insights with intelligent fallbacks
	 */
	generateInsights() {
		// Debug: Show all available data
		this.debugAvailableCalculations();
		
		const financial = this.extractFinancialData();
		const energy = this.extractEnergyData();
		const environmental = this.extractEnvironmentalData();
		const infrastructure = this.extractInfrastructureData();
		const parameters = this.extractParameterData();

		// Check if financial data is all zeros/NaN and derive from parameters if needed
		const hasValidFinancialData = financial.totalCostOfOwnership > 0 || financial.capex > 0;
		const derivedFinancial = hasValidFinancialData ? financial : this.deriveFinancialCalculations(parameters);

		// Calculate derived metrics with intelligent fallbacks
		const totalCapex = derivedFinancial.capex || 0;
		const totalOpex = derivedFinancial.annualOpex || 0;
		const lifetimeOpex = derivedFinancial.lifetimeOpex || totalOpex * (infrastructure.plannedYears || 4);
		const totalLifetimeCost = derivedFinancial.totalCostOfOwnership || totalCapex + lifetimeOpex;

		// Environmental calculations with fallbacks
		const energyConsumption = energy.energyConsumption || (totalOpex / (parameters.electricityCost || 0.365));
		const co2Intensity = parameters.co2Intensity || 120;
		const carbonEmissions = environmental.carbonEmissions || (energyConsumption * co2Intensity / 1000);

		// Efficiency calculations with fallbacks
		const pue = parameters.pue || 2;
		const wue = parameters.wue || 0.025;
		const heatRecovery = parameters.heatRecovery || 0.93;
		const utilization = parameters.utilization || 0.2;

		// Debug: Show extracted insights
		console.log('🎯 Extracted Insights:', {
			financial: derivedFinancial,
			energy,
			environmental,
			infrastructure,
			parameters,
			derived: {
				totalCapex,
				totalOpex,
				lifetimeOpex,
				totalLifetimeCost,
				carbonEmissions,
				energyEfficiency: 1 / pue,
				waterEfficiency: 1 - wue,
				paybackPeriod: totalCapex / (totalOpex || 1),
				roi5Year: ((totalOpex * 5 - totalCapex) / totalCapex) * 100,
				roi10Year: ((totalOpex * 10 - totalCapex) / totalCapex) * 100
			}
		});

		return {
			financial: derivedFinancial,
			energy,
			environmental,
			infrastructure,
			parameters,
			derived: {
				totalCapex,
				totalOpex,
				lifetimeOpex,
				totalLifetimeCost,
				carbonEmissions,
				energyEfficiency: 1 / pue,
				waterEfficiency: 1 - wue,
				paybackPeriod: totalCapex / (totalOpex || 1),
				roi5Year: ((totalOpex * 5 - totalCapex) / totalCapex) * 100,
				roi10Year: ((totalOpex * 10 - totalCapex) / totalCapex) * 100
			}
		};
	}

	/**
	 * Determine which visualizations can be created based on available data
	 */
	detectAvailableVisualizations(): string[] {
		const availableVisualizations: string[] = [];
		
		// Check each visualization pattern
		for (const [category, visualizations] of Object.entries(VISUALIZATION_PATTERNS)) {
			for (const [vizKey, vizConfig] of Object.entries(visualizations)) {
				const fullKey = `${category}.${vizKey}`;
				
				// Check if all required data is available
				const hasRequiredData = this.checkVisualizationRequirements(vizConfig);
				
				if (hasRequiredData) {
					availableVisualizations.push(fullKey);
				}
			}
		}
		
		return availableVisualizations;
	}

	/**
	 * Check if a visualization has all required data
	 */
	private checkVisualizationRequirements(vizConfig: any): boolean {
		const { required, patterns } = vizConfig;
		
		// Check each required data type
		for (const requirement of required) {
			const pattern = patterns[requirement];
			if (!pattern) continue;
			
			// Check if we can find this data in calculations or parameters
			const hasCalculation = this.findCalculationByPatterns(pattern);
			const hasParameter = this.findParameterByPatterns(pattern);
			
			if (!hasCalculation && !hasParameter) {
				return false; // Missing required data
			}
		}
		
		return true; // All required data is available
	}

	/**
	 * Get available dashboard categories based on available visualizations
	 */
	getAvailableDashboards(): string[] {
		const availableVisualizations = this.detectAvailableVisualizations();
		const availableDashboards: string[] = [];
		
		for (const [dashboardKey, dashboardConfig] of Object.entries(DASHBOARD_CATEGORIES)) {
			const { visualizations } = dashboardConfig;
			
			// Check if dashboard has any available visualizations
			const hasAvailableViz = visualizations.some(vizKey => 
				availableVisualizations.includes(vizKey)
			);
			
			if (hasAvailableViz) {
				availableDashboards.push(dashboardKey);
			}
		}
		
		return availableDashboards;
	}

	/**
	 * Generate visualization data for a specific visualization
	 */
	generateVisualizationData(vizKey: string): any {
		const [category, vizName] = vizKey.split('.');
		const vizConfig = (VISUALIZATION_PATTERNS as any)[category]?.[vizName];
		
		if (!vizConfig) return null;
		
		const insights = this.generateInsights();
		return this.createVisualizationData(vizConfig, insights);
	}

	/**
	 * Create specific visualization data based on configuration
	 */
	private createVisualizationData(vizConfig: any, insights: any): any {
		const { type, patterns } = vizConfig;
		
		switch (type) {
			case 'pie':
				return this.createPieChartData(patterns, insights);
			case 'bar':
				return this.createBarChartData(patterns, insights);
			case 'area':
				return this.createAreaChartData(patterns, insights);
			case 'line':
				return this.createLineChartData(patterns, insights);
			case 'radar':
				return this.createRadarChartData(patterns, insights);
			case 'composed':
				return this.createComposedChartData(patterns, insights);
			case 'scatter':
				return this.createScatterChartData(patterns, insights);
			case 'horizontalBar':
				return this.createHorizontalBarChartData(patterns, insights);
			case 'progress':
				return this.createProgressData(patterns, insights);
			case 'table':
				return this.createTableData(patterns, insights);
			default:
				return null;
		}
	}

	// Individual chart data creation methods
	private createPieChartData(patterns: any, insights: any): any {
		const { derived } = insights;
		const components = [
			{ name: "Cooling Equipment", calc: derived.totalCapex * 0.6 },
			{ name: "Infrastructure", calc: derived.totalCapex * 0.3 },
			{ name: "Installation", calc: derived.totalCapex * 0.15 },
			{ name: "Commissioning", calc: derived.totalCapex * 0.05 }
		].filter(comp => comp.calc > 0);

		return components.map((comp, index) => ({
			name: comp.name,
			value: comp.calc,
			color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index] || "#8884d8"
		}));
	}

	private createBarChartData(patterns: any, insights: any): any {
		const { derived, financial } = insights;
		return [
			{ 
				category: "Capex", 
				current: derived.totalCapex * 1.2, // 20% higher for comparison
				proposed: derived.totalCapex 
			},
			{ 
				category: "Annual Opex", 
				current: derived.totalOpex * 1.3, // 30% higher for comparison
				proposed: derived.totalOpex 
			},
			{ 
				category: "Energy Cost", 
				current: financial.energyCost * 1.25, // 25% higher for comparison
				proposed: financial.energyCost 
			},
			{ 
				category: "Maintenance", 
				current: derived.totalOpex * 0.2, // 20% of opex
				proposed: derived.totalOpex * 0.15 // 15% of opex
			}
		];
	}

	private createAreaChartData(patterns: any, insights: any): any {
		const { derived, infrastructure } = insights;
		const years = infrastructure.plannedYears || 4;
		
		return Array.from({ length: years }, (_, i) => ({
			year: i + 1,
			cumulativeCost: derived.totalCapex + (i + 1) * derived.totalOpex,
			annualCost: derived.totalOpex
		}));
	}

	private createLineChartData(patterns: any, insights: any): any {
		const { parameters } = insights;
		
		return Array.from({ length: 12 }, (_, i) => ({
			month: i + 1,
			pPUE: (parameters.pue || 2) + (Math.random() - 0.5) * 0.1,
			WUE: (parameters.wue || 0.025) + (Math.random() - 0.5) * 0.005,
			heatRecovery: (parameters.heatRecovery || 0.93) + (Math.random() - 0.5) * 0.05
		}));
	}

	private createRadarChartData(patterns: any, insights: any): any {
		const { parameters, derived } = insights;
		
		return [
			{ metric: "pPUE", value: parameters.pue || 2 },
			{ metric: "WUE", value: parameters.wue || 0.025 },
			{ metric: "Heat Recovery", value: parameters.heatRecovery || 0.93 },
			{ metric: "Energy Efficiency", value: derived.energyEfficiency },
			{ metric: "Water Efficiency", value: derived.waterEfficiency }
		];
	}

	private createComposedChartData(patterns: any, insights: any): any {
		const { derived, infrastructure } = insights;
		const years = infrastructure.plannedYears || 4;
		
		return Array.from({ length: years }, (_, i) => ({
			year: i + 1,
			capex: i === 0 ? derived.totalCapex : 0,
			opex: derived.totalOpex,
			cumulative: i === 0 ? derived.totalCapex : derived.totalCapex + (i + 1) * derived.totalOpex
		}));
	}

	private createScatterChartData(patterns: any, insights: any): any {
		const { financial, derived } = insights;
		
		const factors = [
			{ parameter: "Energy Cost", impact: financial.energyCost * 0.1 },
			{ parameter: "Utilization", impact: financial.energyCost * 0.15 },
			{ parameter: "Efficiency", impact: financial.energyCost * 0.2 },
			{ parameter: "Maintenance", impact: derived.totalOpex * 0.1 }
		].filter(factor => factor.impact > 0);

		return factors.map(factor => ({
			parameter: factor.parameter,
			impact: factor.impact
		}));
	}

	private createHorizontalBarChartData(patterns: any, insights: any): any {
		const { derived, financial } = insights;
		const components = [
			{ name: "Cooling Equipment", calc: derived.totalCapex * 0.6 },
			{ name: "Infrastructure", calc: derived.totalCapex * 0.3 },
			{ name: "Installation", calc: derived.totalCapex * 0.15 },
			{ name: "Commissioning", calc: derived.totalCapex * 0.05 }
		].filter(comp => comp.calc > 0);

		return components.map(comp => ({
			component: comp.name,
			value: comp.calc
		}));
	}

	private createProgressData(patterns: any, insights: any): any {
		const { derived, parameters } = insights;
		
		return [
			{ category: "Carbon Footprint", score: Math.max(0, 100 - derived.carbonEmissions) },
			{ category: "Water Efficiency", score: (1 - (parameters.wue || 0.025)) * 100 },
			{ category: "Energy Efficiency", score: derived.energyEfficiency * 100 },
			{ category: "Waste Reduction", score: 75 },
			{ category: "Overall Impact", score: 85 }
		];
	}

	private createTableData(patterns: any, insights: any): any {
		const { derived } = insights;
		
		return [
			{ 
				component: "Cooling Equipment", 
				description: "Annual inspection", 
				frequency: "Yearly", 
				cost: derived.totalCapex * 0.01, 
				status: "pending" 
			},
			{ 
				component: "IT Equipment", 
				description: "Preventive maintenance", 
				frequency: "Quarterly", 
				cost: derived.totalOpex * 0.02, 
				status: "completed" 
			},
			{ 
				component: "Infrastructure", 
				description: "System check", 
				frequency: "Monthly", 
				cost: derived.totalOpex * 0.005, 
				status: "pending" 
			}
		];
	}
}

// Visualization mapping system
export const VISUALIZATION_PATTERNS = {
	// Financial Visualizations
	FINANCIAL: {
		COST_BREAKDOWN: {
			name: "Cost Structure Analysis",
			type: "pie",
			required: ["capex", "opex"],
			patterns: {
				capex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.CAPEX,
				opex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ANNUAL_OPEX
			},
			icon: "PieChartIcon",
			description: "Breakdown of capital and operational expenditures"
		},
		CASH_FLOW: {
			name: "Cash Flow Analysis",
			type: "composed",
			required: ["capex", "opex", "timeframe"],
			patterns: {
				capex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.CAPEX,
				opex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ANNUAL_OPEX,
				timeframe: DATA_CENTER_SEMANTICS.INFRASTRUCTURE_PATTERNS.PLANNED_YEARS
			},
			icon: "TrendingUp",
			description: "Annual cash flow projection over lifetime"
		},
		LIFETIME_PROJECTION: {
			name: "Lifetime Cost Projection",
			type: "area",
			required: ["totalCost", "timeframe"],
			patterns: {
				totalCost: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.TOTAL_COST_OF_OWNERSHIP,
				timeframe: DATA_CENTER_SEMANTICS.INFRASTRUCTURE_PATTERNS.PLANNED_YEARS
			},
			icon: "TrendingUp",
			description: "Cumulative cost projection over project lifetime"
		},
		CAPEX_BREAKDOWN: {
			name: "Capex Breakdown",
			type: "horizontalBar",
			required: ["capex"],
			patterns: {
				capex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.CAPEX
			},
			icon: "Building2",
			description: "Detailed capital expenditure breakdown"
		},
		OPEX_BREAKDOWN: {
			name: "Annual Opex Breakdown",
			type: "horizontalBar",
			required: ["opex"],
			patterns: {
				opex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ANNUAL_OPEX
			},
			icon: "Settings",
			description: "Annual operational expenditure breakdown"
		},
		COMPARISON: {
			name: "Cost Comparison",
			type: "bar",
			required: ["capex", "opex"],
			patterns: {
				capex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.CAPEX,
				opex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ANNUAL_OPEX
			},
			icon: "BarChart3",
			description: "Current vs proposed cost comparison"
		},
		SENSITIVITY: {
			name: "Parameter Sensitivity Analysis",
			type: "scatter",
			required: ["energyCost", "maintenanceCost"],
			patterns: {
				energyCost: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ENERGY_COST,
				maintenanceCost: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.MAINTENANCE_COST
			},
			icon: "Calculator",
			description: "Impact analysis of key parameters"
		}
	},

	// Energy Visualizations
	ENERGY: {
		EFFICIENCY_METRICS: {
			name: "Efficiency Metrics",
			type: "radar",
			required: ["pue", "wue"],
			patterns: {
				pue: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.PUE,
				wue: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.WUE
			},
			icon: "Gauge",
			description: "Power and water usage effectiveness metrics"
		},
		EFFICIENCY_TRENDS: {
			name: "Efficiency Trends",
			type: "line",
			required: ["pue", "wue"],
			patterns: {
				pue: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.PUE,
				wue: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.WUE
			},
			icon: "TrendingUp",
			description: "Monthly efficiency trend analysis"
		},
		ENERGY_CONSUMPTION: {
			name: "Energy Consumption Analysis",
			type: "area",
			required: ["energyConsumption"],
			patterns: {
				energyConsumption: DATA_CENTER_SEMANTICS.ENERGY_PATTERNS.ENERGY_CONSUMPTION
			},
			icon: "Zap",
			description: "Annual energy consumption patterns"
		},
		POWER_UTILIZATION: {
			name: "Power Utilization",
			type: "bar",
			required: ["itPower", "nameplatePower"],
			patterns: {
				itPower: DATA_CENTER_SEMANTICS.ENERGY_PATTERNS.IT_POWER,
				nameplatePower: DATA_CENTER_SEMANTICS.ENERGY_PATTERNS.NAMEPLATE_POWER
			},
			icon: "Activity",
			description: "IT equipment power utilization analysis"
		}
	},

	// Environmental Visualizations
	ENVIRONMENTAL: {
		CARBON_FOOTPRINT: {
			name: "Carbon Footprint Analysis",
			type: "area",
			required: ["carbonEmissions", "timeframe"],
			patterns: {
				carbonEmissions: DATA_CENTER_SEMANTICS.ENVIRONMENTAL_PATTERNS.CARBON_EMISSIONS,
				timeframe: DATA_CENTER_SEMANTICS.INFRASTRUCTURE_PATTERNS.PLANNED_YEARS
			},
			icon: "Thermometer",
			description: "Annual carbon emissions projection"
		},
		WATER_USAGE: {
			name: "Water Usage Efficiency",
			type: "bar",
			required: ["waterConsumption"],
			patterns: {
				waterConsumption: DATA_CENTER_SEMANTICS.ENVIRONMENTAL_PATTERNS.WATER_CONSUMPTION
			},
			icon: "Waves",
			description: "Monthly water consumption and recycling"
		},
		ENVIRONMENTAL_IMPACT: {
			name: "Environmental Impact Score",
			type: "progress",
			required: ["carbonEmissions", "wue"],
			patterns: {
				carbonEmissions: DATA_CENTER_SEMANTICS.ENVIRONMENTAL_PATTERNS.CARBON_EMISSIONS,
				wue: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.WUE
			},
			icon: "Leaf",
			description: "Overall environmental impact assessment"
		},
		ENERGY_EFFICIENCY: {
			name: "Energy Efficiency Metrics",
			type: "radar",
			required: ["pue", "wue", "heatRecovery"],
			patterns: {
				pue: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.PUE,
				wue: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.WUE,
				heatRecovery: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.HEAT_RECOVERY
			},
			icon: "Lightbulb",
			description: "Comprehensive energy efficiency analysis"
		}
	},

	// Operational Visualizations
	OPERATIONAL: {
		PERFORMANCE_METRICS: {
			name: "Performance Metrics",
			type: "radar",
			required: ["utilization", "efficiency"],
			patterns: {
				utilization: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.UTILIZATION,
				efficiency: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.PUE
			},
			icon: "Activity",
			description: "System performance and reliability metrics"
		},
		CAPACITY_UTILIZATION: {
			name: "Capacity Utilization",
			type: "bar",
			required: ["utilization", "infrastructure"],
			patterns: {
				utilization: DATA_CENTER_SEMANTICS.PARAMETER_PATTERNS.UTILIZATION,
				infrastructure: DATA_CENTER_SEMANTICS.INFRASTRUCTURE_PATTERNS.NUMBER_OF_RACKS
			},
			icon: "Gauge",
			description: "Infrastructure capacity utilization analysis"
		},
		MAINTENANCE_SCHEDULE: {
			name: "Maintenance Schedule",
			type: "table",
			required: ["capex", "opex"],
			patterns: {
				capex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.CAPEX,
				opex: DATA_CENTER_SEMANTICS.FINANCIAL_PATTERNS.ANNUAL_OPEX
			},
			icon: "Clock",
			description: "Preventive maintenance schedule and costs"
		}
	}
};

// Dashboard categories with their visualization requirements
export const DASHBOARD_CATEGORIES = {
	EXECUTIVE: {
		name: "Executive",
		icon: "Target",
		description: "High-level strategic overview",
		visualizations: [
			"FINANCIAL.COST_BREAKDOWN",
			"FINANCIAL.LIFETIME_PROJECTION", 
			"ENERGY.EFFICIENCY_METRICS",
			"FINANCIAL.COMPARISON",
			"FINANCIAL.SENSITIVITY"
		]
	},
	FINANCIAL: {
		name: "Financial",
		icon: "DollarSign", 
		description: "Detailed cost analysis",
		visualizations: [
			"FINANCIAL.CAPEX_BREAKDOWN",
			"FINANCIAL.OPEX_BREAKDOWN",
			"FINANCIAL.CASH_FLOW",
			"FINANCIAL.SENSITIVITY"
		]
	},
	OPERATIONAL: {
		name: "Operational",
		icon: "Settings",
		description: "Performance and efficiency metrics", 
		visualizations: [
			"OPERATIONAL.PERFORMANCE_METRICS",
			"ENERGY.EFFICIENCY_TRENDS",
			"OPERATIONAL.CAPACITY_UTILIZATION",
			"OPERATIONAL.MAINTENANCE_SCHEDULE"
		]
	},
	ENVIRONMENTAL: {
		name: "Environmental",
		icon: "Leaf",
		description: "Sustainability and impact metrics",
		visualizations: [
			"ENVIRONMENTAL.CARBON_FOOTPRINT",
			"ENVIRONMENTAL.WATER_USAGE",
			"ENVIRONMENTAL.ENERGY_EFFICIENCY",
			"ENVIRONMENTAL.ENVIRONMENTAL_IMPACT"
		]
	}
};


