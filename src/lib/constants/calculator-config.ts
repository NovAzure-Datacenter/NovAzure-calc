// Centralized calculator configuration
// This file defines all configuration fields for the value calculator
// to eliminate duplication across multiple API routes and components

export interface CalculatorConfigField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select';
  value?: string | number;
  unit?: string;
  required: boolean;
  options?: string[];
  min_value?: number;
  max_value?: number;
  step?: string;
  placeholder?: string;
}

// Common field definitions
export const COMMON_FIELDS: CalculatorConfigField[] = [
  {
    id: 'data_centre_type',
    label: 'Data Centre Type',
    type: 'select',
    value: '',
    options: ['General Purpose', 'HPC/AI'],
    required: true
  },
  {
    id: 'project_location',
    label: 'Project Location',
    type: 'select',
    value: '',
    options: ['United Kingdom', 'United States', 'Singapore', 'United Arab Emirates'],
    required: true
  },
  {
    id: 'utilisation_percentage',
    label: 'Utilisation Percentage',
    type: 'select',
    value: '',
    options: ['20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
    required: true
  },
  {
    id: 'data_hall_capacity',
    label: 'Data Hall Capacity',
    type: 'number',
    value: '',
    unit: 'MW',
    required: true,
    min_value: 0.1,
    max_value: 100,
    step: '0.1',
    placeholder: 'Enter capacity in MW'
  },
  {
    id: 'planned_years_operation',
    label: 'Planned Years of Operation',
    type: 'text',
    value: '',
    unit: 'years',
    required: true,
    placeholder: 'Enter years (5-20)'
  },
  {
    id: 'first_year_operation',
    label: 'First Year of Operation',
    type: 'select',
    value: '',
    options: ['2025', '2026', '2027', '2028', '2029', '2030'],
    required: true
  }
];

// Air cooling specific fields
export const AIR_COOLING_FIELDS: CalculatorConfigField[] = [
  {
    id: 'air_annualized_ppue',
    label: 'Air Annualized pPUE',
    type: 'number',
    value: '',
    unit: '',
    required: true,
    min_value: 1.0,
    max_value: 3.0,
    step: '0.1',
    placeholder: 'Enter pPUE value'
  },
  {
    id: 'default_air_ppue',
    label: 'Default Air Annualised pPUE for Location and Utilisation',
    type: 'number',
    value: '#N/A',
    unit: '',
    required: false,
    min_value: 1.0,
    max_value: 3.0,
    step: '0.1'
  }
];

// Liquid cooling specific fields
export const LIQUID_COOLING_FIELDS: CalculatorConfigField[] = [
  {
    id: 'annualised_liquid_cooled_ppue',
    label: 'Annualised Liquid Cooled pPUE',
    type: 'number',
    value: '#N/A',
    unit: '',
    required: false,
    min_value: 1.0,
    max_value: 2.0,
    step: '0.1'
  }
];

// Helper function to get configuration based on solution type
export function getCalculatorConfig(solutionName?: string): CalculatorConfigField[] {
  const config = [...COMMON_FIELDS];
  
  if (solutionName && /air cooling/i.test(solutionName)) {
    config.push(...AIR_COOLING_FIELDS);
  }
  
  if (solutionName && /liquid cooling/i.test(solutionName)) {
    config.push(...LIQUID_COOLING_FIELDS);
  }
  
  return config;
}

// Field categorization for UI organization
export const FIELD_CATEGORIES = {
  dataCenter: ['data_centre_type', 'project_location', 'utilisation_percentage', 'data_hall_capacity', 'planned_years_operation', 'first_year_operation'],
  airCooling: ['air_annualized_ppue', 'default_air_ppue'],
  liquidCooling: ['annualised_liquid_cooled_ppue']
};

// Validation rules
export const VALIDATION_RULES = {
  data_hall_capacity: {
    min: 0.1,
    max: 100,
    message: 'Capacity must be between 0.1 and 100 MW'
  },
  planned_years_operation: {
    min: 5,
    max: 20,
    message: 'Years must be between 5 and 20'
  },
  air_annualized_ppue: {
    min: 1.0,
    max: 3.0,
    message: 'pPUE must be between 1.0 and 3.0'
  },
  annualised_liquid_cooled_ppue: {
    min: 1.0,
    max: 2.0,
    message: 'Liquid pPUE must be between 1.0 and 2.0'
  }
}; 