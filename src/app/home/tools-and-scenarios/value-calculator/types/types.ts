export interface Product {
  id: string;
  name: string;
  description?: string;
}

export interface Solution {
  id: string;
  name: string;
  description?: string;
  products: Product[];
}

export interface Technology {
  id: string;
  name: string;
  description?: string;
  solutions: Solution[];
}

export interface Industry {
  id: string;
  name: string;
  description?: string;
  technologies: Technology[];
}


export type IndustryData = Record<string, Industry>;

export interface ConfigField {
    id: string;
    label: string;
    type: "number" | "text" | "select";
    value: string | number;
    options?: string[];
    unit?: string;
    required?: boolean;
}

export interface ConfigFieldAPI {
  id: string;
  label: string;
  type: string;
  value?: string;
  unit?: string;
  options?: string[];
  required?: boolean;
  min_value?: number;
  max_value?: number;
}

export interface ProductConfigResponse {
  product_id: string;
  config_fields: ConfigFieldAPI[];
  global_fields_1: ConfigFieldAPI[];
  global_fields_2: ConfigFieldAPI[];
}

export interface AdvancedConfig {
    // Data Centre Configuration - Advanced
    inletTemperature: number;
    electricityPrice: number;
    waterPrice: number;
    waterloop: string;
    requiredElectricalPowerIncrease: number;
    
    // Air Cooling Configuration - Advanced
    coolingAlternative: string;
    defaultAirCoolingTechnology: string;
    airChassisPerRack: number;
    airCoolingCapexCost: number;
    annualAirCoolingMaintenance: number;
    airWUE: number;
    
    // PLC Configuration - Advanced
    chassisTechnology: string;
    plcRackCoolingCapacity: number;
    annualPLCMaintenance: number;
    includePoCCost: string;
    totalPoCCost: number;
    plcChassisPerRack: number;
    
    // IT Configuration - Advanced
    serverRatedMaxPower: number;
    maxChassisPerRackAir: number;
    totalAirPowerPerRack: number;
    includeITCost: string;
    typicalITCostPerServer: number;
    typicalITCostPerServerAlt: number;
    annualITMaintenanceCost: number;
    serverRefreshYears: number;
    
    // Space Configuration
    floorSpacePerAirRack: number;
    floorSpacePerPLCRack: number;
    spaceUnit: string;
}

export interface CalculationResults {
    costSavings: number;
    energyEfficiency: number;
    roi: number;
    paybackPeriod: number;
    carbonReduction: number;
}