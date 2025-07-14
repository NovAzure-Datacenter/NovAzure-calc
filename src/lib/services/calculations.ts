// TypeScript conversion of the Python calculation logic

// Country-specific multipliers (USD per kW)
const COUNTRY_MULTIPLIERS: Record<string, number> = {
  "United States": 3849,
  "Singapore": 3527,
  "United Kingdom": 4952,
  "United Arab Emirates": 3433,
};

// UK Capex Inflation factors applied universally to all countries
const INFLATION_FACTORS: Record<number, number> = {
  2023: 1.0,
  2024: 1.02,
  2025: 1.04,
  2026: 1.06,
  2027: 1.08,
  2028: 1.10,
  2029: 1.13,
  2030: 1.15,
  2031: 1.17,
  2032: 1.20,
  2033: 1.22,
  2034: 1.24,
  2035: 1.27,
  2036: 1.29,
  2037: 1.32,
  2038: 1.35,
  2039: 1.37,
  2040: 1.40,
  2041: 1.43,
  2042: 1.46,
  2043: 1.49,
  2044: 1.52,
  2045: 1.55,
  2046: 1.58,
  2047: 1.61,
  2048: 1.64,
  2049: 1.67,
  2050: 1.71,
};

// Electricity forecast rates ($/kWh) by country and year
const ELECTRICITY_RATES: Record<string, Record<number, number>> = {
  "United Kingdom": {
    2023: 0.167,
    2024: 0.161,
    2025: 0.180,
    2026: 0.170,
    2027: 0.170,
    2028: 0.170,
    2029: 0.174,
    2030: 0.161,
    2031: 0.164,
    2032: 0.168,
    2033: 0.171,
    2034: 0.174,
    2035: 0.178,
    2036: 0.182,
    2037: 0.185,
    2038: 0.189,
    2039: 0.193,
    2040: 0.197,
    2041: 0.200,
    2042: 0.204,
    2043: 0.209,
    2044: 0.213,
    2045: 0.217,
    2046: 0.221,
    2047: 0.226,
    2048: 0.230,
    2049: 0.235,
    2050: 0.240,
  },
  "Singapore": {
    2023: 0.146,
    2024: 0.139,
    2025: 0.137,
    2026: 0.131,
    2027: 0.131,
    2028: 0.131,
    2029: 0.131,
    2030: 0.131,
    2031: 0.134,
    2032: 0.137,
    2033: 0.139,
    2034: 0.142,
    2035: 0.145,
    2036: 0.148,
    2037: 0.151,
    2038: 0.154,
    2039: 0.157,
    2040: 0.160,
    2041: 0.163,
    2042: 0.167,
    2043: 0.170,
    2044: 0.173,
    2045: 0.177,
    2046: 0.180,
    2047: 0.184,
    2048: 0.188,
    2049: 0.191,
    2050: 0.195,
  },
  "United States": {
    2023: 0.122,
    2024: 0.124,
    2025: 0.122,
    2026: 0.120,
    2027: 0.120,
    2028: 0.120,
    2029: 0.121,
    2030: 0.123,
    2031: 0.126,
    2032: 0.130,
    2033: 0.133,
    2034: 0.138,
    2035: 0.143,
    2036: 0.146,
    2037: 0.150,
    2038: 0.155,
    2039: 0.160,
    2040: 0.165,
    2041: 0.170,
    2042: 0.175,
    2043: 0.179,
    2044: 0.183,
    2045: 0.188,
    2046: 0.192,
    2047: 0.196,
    2048: 0.200,
    2049: 0.204,
    2050: 0.208,
  },
  "United Arab Emirates": {
    2023: 0.120,
    2024: 0.122,
    2025: 0.125,
    2026: 0.127,
    2027: 0.130,
    2028: 0.132,
    2029: 0.135,
    2030: 0.138,
    2031: 0.141,
    2032: 0.143,
    2033: 0.146,
    2034: 0.149,
    2035: 0.152,
    2036: 0.155,
    2037: 0.158,
    2038: 0.162,
    2039: 0.165,
    2040: 0.168,
    2041: 0.171,
    2042: 0.175,
    2043: 0.178,
    2044: 0.182,
    2045: 0.186,
    2046: 0.189,
    2047: 0.193,
    2048: 0.197,
    2049: 0.201,
    2050: 0.205,
  },
};

// Default values for calculations
const DEFAULT_VALUES = {
  budgeted_it_energy: 0.7,
  budgeted_fan_energy: 0.3,
  actual_fan_power: 1.0,
  water_price_per_litre: 0.00134,
  water_use_per_kwh: 2.0,
  maintenance_rate: 0.08,
  typical_it_cost_per_server: 16559,
  it_maintenance_cost: 0.08,
  air_rack_cooling_capacity_kw_per_rack: 30,
};

interface CalculationInputs {
  data_hall_design_capacity_mw: number;
  first_year_of_operation: number;
  project_location: string;
  percentage_of_utilisation: number;
  planned_years_of_operation: number;
  annualised_ppue: number;
  advanced?: boolean;
  include_it_cost?: string;
  air_rack_cooling_capacity_kw_per_rack?: number;
  data_center_type?: string;
  inlet_temperature?: number;
  electricity_price_per_kwh?: number;
  water_price_per_litre?: number;
  solution_type: string;
}

interface CapexResult {
  cooling_equipment_capex: number;
  it_equipment_capex: number;
  total_capex: number;
}

interface OpexResult {
  annual_cooling_opex: number;
  annual_it_maintenance: number;
  total_opex_over_lifetime: number;
}

interface CalculationResult {
  cooling_equipment_capex: number;
  it_equipment_capex: number;
  total_capex: number;
  annual_cooling_opex: number;
  annual_it_maintenance: number;
  total_opex_over_lifetime: number;
  tco_excluding_it: number;
  tco_including_it: number;
}

// Air Cooling CAPEX calculations
function calculateAirCoolingCapex(inputData: CalculationInputs): CapexResult {
  const capacity_mw = inputData.data_hall_design_capacity_mw;
  const first_year_of_operation = inputData.first_year_of_operation;
  const country = inputData.project_location;

  const nameplate_power_kw = capacity_mw * 1000;
  const country_multiplier = COUNTRY_MULTIPLIERS[country] || COUNTRY_MULTIPLIERS["United States"];
  const base_capex = country_multiplier * nameplate_power_kw;
  const inflation_factor = INFLATION_FACTORS[first_year_of_operation] || 1.0;
  const cooling_equipment_capex = base_capex * inflation_factor;

  // Simplified IT equipment CAPEX calculation
  const it_equipment_capex = capacity_mw * 1000 * 2000; // Simplified calculation
  const total_capex = cooling_equipment_capex + it_equipment_capex;

  return {
    cooling_equipment_capex: Math.round(cooling_equipment_capex),
    it_equipment_capex: Math.round(it_equipment_capex),
    total_capex: Math.round(total_capex),
  };
}

// Air Cooling OPEX calculations
function calculateAirCoolingOpex(inputData: CalculationInputs, coolingCapex: number): OpexResult {
  const capacity_mw = inputData.data_hall_design_capacity_mw;
  const ppue = inputData.annualised_ppue;
  const utilisation = inputData.percentage_of_utilisation;
  const first_year_of_operation = inputData.first_year_of_operation;
  const country = inputData.project_location;
  const planned_years = inputData.planned_years_of_operation;

  const capacity_kw = capacity_mw * 1000;
  const fan_power = capacity_kw * DEFAULT_VALUES.budgeted_fan_energy * DEFAULT_VALUES.actual_fan_power;
  const it_power = capacity_kw * DEFAULT_VALUES.budgeted_it_energy * utilisation;
  const energy_per_year = (fan_power + it_power) * 365 * 24;
  const total_energy = ppue * energy_per_year;
  const electricity_rate = ELECTRICITY_RATES[country]?.[first_year_of_operation] || ELECTRICITY_RATES["United States"][first_year_of_operation] || 0.12;

  const cost_of_energy = total_energy * electricity_rate;
  const cost_of_water = energy_per_year * DEFAULT_VALUES.water_use_per_kwh * DEFAULT_VALUES.water_price_per_litre;
  const maintenance_cost = coolingCapex * DEFAULT_VALUES.maintenance_rate;

  const annual_opex = cost_of_energy + cost_of_water + maintenance_cost;
  const annual_it_cost = capacity_kw * 100; // Simplified IT maintenance calculation
  const total_opex_lifetime = (annual_opex * planned_years) + (annual_it_cost * planned_years);

  return {
    annual_cooling_opex: Math.round(annual_opex),
    annual_it_maintenance: Math.round(annual_it_cost),
    total_opex_over_lifetime: Math.round(total_opex_lifetime),
  };
}

// Chassis Immersion CAPEX calculations (simplified)
function calculateChassisImmersionCapex(inputData: CalculationInputs): CapexResult {
  const capacity_mw = inputData.data_hall_design_capacity_mw;
  const first_year_of_operation = inputData.first_year_of_operation;
  const country = inputData.project_location;

  const nameplate_power_kw = capacity_mw * 1000;
  const country_multiplier = COUNTRY_MULTIPLIERS[country] || COUNTRY_MULTIPLIERS["United States"];
  const base_capex = country_multiplier * nameplate_power_kw * 0.8; // 20% reduction for immersion
  const inflation_factor = INFLATION_FACTORS[first_year_of_operation] || 1.0;
  const cooling_equipment_capex = base_capex * inflation_factor;

  const it_equipment_capex = capacity_mw * 1000 * 2000; // Same as air cooling for now
  const total_capex = cooling_equipment_capex + it_equipment_capex;

  return {
    cooling_equipment_capex: Math.round(cooling_equipment_capex),
    it_equipment_capex: Math.round(it_equipment_capex),
    total_capex: Math.round(total_capex),
  };
}

// Chassis Immersion OPEX calculations (simplified)
function calculateChassisImmersionOpex(inputData: CalculationInputs, coolingCapex: number): OpexResult {
  const capacity_mw = inputData.data_hall_design_capacity_mw;
  const ppue = inputData.annualised_ppue;
  const utilisation = inputData.percentage_of_utilisation;
  const first_year_of_operation = inputData.first_year_of_operation;
  const country = inputData.project_location;
  const planned_years = inputData.planned_years_of_operation;

  const capacity_kw = capacity_mw * 1000;
  const fan_power = capacity_kw * DEFAULT_VALUES.budgeted_fan_energy * DEFAULT_VALUES.actual_fan_power * 0.6; // 40% reduction for immersion
  const it_power = capacity_kw * DEFAULT_VALUES.budgeted_it_energy * utilisation;
  const energy_per_year = (fan_power + it_power) * 365 * 24;
  const total_energy = ppue * energy_per_year;
  const electricity_rate = ELECTRICITY_RATES[country]?.[first_year_of_operation] || ELECTRICITY_RATES["United States"][first_year_of_operation] || 0.12;

  const cost_of_energy = total_energy * electricity_rate;
  const cost_of_water = energy_per_year * DEFAULT_VALUES.water_use_per_kwh * DEFAULT_VALUES.water_price_per_litre * 1.5; // Higher water usage for immersion
  const maintenance_cost = coolingCapex * DEFAULT_VALUES.maintenance_rate * 1.2; // Slightly higher maintenance for immersion

  const annual_opex = cost_of_energy + cost_of_water + maintenance_cost;
  const annual_it_cost = capacity_kw * 100; // Same as air cooling
  const total_opex_lifetime = (annual_opex * planned_years) + (annual_it_cost * planned_years);

  return {
    annual_cooling_opex: Math.round(annual_opex),
    annual_it_maintenance: Math.round(annual_it_cost),
    total_opex_over_lifetime: Math.round(total_opex_lifetime),
  };
}

// Main calculation function
export async function calculateSolution(inputData: CalculationInputs): Promise<CalculationResult> {
  let capex: CapexResult;
  let opex: OpexResult;

  if (inputData.solution_type === "air_cooling") {
    capex = calculateAirCoolingCapex(inputData);
    opex = calculateAirCoolingOpex(inputData, capex.cooling_equipment_capex);
  } else if (inputData.solution_type === "chassis_immersion") {
    capex = calculateChassisImmersionCapex(inputData);
    opex = calculateChassisImmersionOpex(inputData, capex.cooling_equipment_capex);
  } else {
    throw new Error(`Invalid solution type: ${inputData.solution_type}`);
  }

  const tco_excluding_it = capex.cooling_equipment_capex + opex.total_opex_over_lifetime - opex.annual_it_maintenance;
  const tco_including_it = capex.total_capex + opex.total_opex_over_lifetime;

  return {
    cooling_equipment_capex: capex.cooling_equipment_capex,
    it_equipment_capex: capex.it_equipment_capex,
    total_capex: capex.total_capex,
    annual_cooling_opex: opex.annual_cooling_opex,
    annual_it_maintenance: opex.annual_it_maintenance,
    total_opex_over_lifetime: opex.total_opex_over_lifetime,
    tco_excluding_it: Math.round(tco_excluding_it),
    tco_including_it: Math.round(tco_including_it),
  };
}

// Compare function
export async function compareSolutions(inputData: CalculationInputs): Promise<{
  air_cooling_solution: CalculationResult;
  chassis_immersion_solution: CalculationResult;
}> {
  const airCoolingData = { ...inputData, solution_type: "air_cooling" };
  const chassisImmersionData = { ...inputData, solution_type: "chassis_immersion" };

  const air_cooling_solution = await calculateSolution(airCoolingData);
  const chassis_immersion_solution = await calculateSolution(chassisImmersionData);

  return {
    air_cooling_solution,
    chassis_immersion_solution,
  };
} 