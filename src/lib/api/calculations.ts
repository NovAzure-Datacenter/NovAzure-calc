// API client for calculation endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CapexCalculationRequest {
  data_hall_design_capacity_mw: number;
  base_year: number;
  country: "USA" | "Singapore" | "UK" | "UAE";
}

export interface OpexCalculationRequest {
  cooling_capacity_limit: number;
  include_it_cost: boolean;
  planned_years_of_operation: number;
}

export interface FullCalculationRequest {
  cooling_type: "air_cooling" | "chassis_immersion";
  data_hall_design_capacity_mw: number;
  base_year: number;
  country: "USA" | "Singapore" | "UK" | "UAE";
  planned_years_of_operation?: number;
}

export interface CapexCalculationResponse {
  cooling_equipment_capex: number;
  total_capex_excl_it: number;
  annual_cooling_capex: number;
  opex_lifetime: number;
  total_cost_ownership_excl_it: number;
  
  // Calculation details
  nameplate_power_kw: number;
  country_multiplier: number;
  inflation_factor: number;
  base_capex_before_inflation: number;
}

export interface OpexCalculationResponse {
  annual_cooling_opex: number;
  annual_it_equipment_maintenance: number;
  opex_lifetime: number;
}

export interface FullCalculationResponse {
  capex: CapexCalculationResponse;
  opex?: OpexCalculationResponse;
  calculation_type: string;
}

export interface ComparisonResponse {
  air_cooling: CapexCalculationResponse;
  chassis_immersion: CapexCalculationResponse;
  savings: {
    cooling_equipment_capex_difference: number;
    total_cost_ownership_difference: number;
    opex_lifetime_difference: number;
  };
  recommendation: "air_cooling" | "chassis_immersion";
}

class CalculationAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async calculateCapex(
    data: CapexCalculationRequest
  ): Promise<CapexCalculationResponse> {
    return this.makeRequest<CapexCalculationResponse>('/calculations/capex', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateOpex(
    data: OpexCalculationRequest
  ): Promise<OpexCalculationResponse> {
    return this.makeRequest<OpexCalculationResponse>('/calculations/opex', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateFull(
    data: FullCalculationRequest
  ): Promise<FullCalculationResponse> {
    return this.makeRequest<FullCalculationResponse>('/calculations/full', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async compare(
    data: CapexCalculationRequest
  ): Promise<ComparisonResponse> {
    return this.makeRequest<ComparisonResponse>('/calculations/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.makeRequest<{ status: string; service: string }>('/calculations/health');
  }
}

export const calculationAPI = new CalculationAPI(); 