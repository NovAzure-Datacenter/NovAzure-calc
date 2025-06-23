from pydantic import BaseModel, Field
from typing import Optional, Literal

# Request Schemas
class CapexCalculationRequest(BaseModel):
    data_hall_design_capacity_mw: float = Field(..., description="Data Hall Design Capacity in MW (Maximum Nameplate Input)")
    base_year: int = Field(..., description="Base year for inflation calculations")
    country: Literal["USA", "Singapore", "UK", "UAE"] = Field(..., description="Country for region-specific calculations")

class OpexCalculationRequest(BaseModel):
    cooling_capacity_limit: int = Field(..., description="Cooling capacity limit (5 or 10)")
    include_it_cost: bool = Field(..., description="Whether to include IT costs in calculation")
    planned_years_of_operation: int = Field(..., description="Planned years of operation")

class FullCalculationRequest(BaseModel):
    cooling_type: Literal["air_cooling", "chassis_immersion"] = Field(..., description="Type of cooling solution")
    data_hall_design_capacity_mw: float = Field(..., description="Data Hall Design Capacity in MW (Maximum Nameplate Input)")
    base_year: int = Field(..., description="Base year for inflation calculations")
    country: Literal["USA", "Singapore", "UK", "UAE"] = Field(..., description="Country for region-specific calculations")
    planned_years_of_operation: Optional[int] = Field(None, description="Planned years of operation (for OPEX)")

# Response Schemas
class CapexCalculationResponse(BaseModel):
    cooling_equipment_capex: float = Field(..., description="Cooling Equipment CAPEX (Excl: Land, Core & Shell)")
    total_capex_excl_it: float = Field(..., description="Total CAPEX (Excl: IT)")
    annual_cooling_capex: float = Field(..., description="Annual Cooling CAPEX")
    opex_lifetime: float = Field(..., description="OPEX For Lifetime of Operation")
    total_cost_ownership_excl_it: float = Field(..., description="Total Cost of Ownership (Excl: IT, Land, Core & Shell)")
    
    # Calculation details
    nameplate_power_kw: float = Field(..., description="Calculated nameplate power in kW")
    country_multiplier: float = Field(..., description="Country-specific multiplier used")
    inflation_factor: float = Field(..., description="Inflation factor applied")
    base_capex_before_inflation: float = Field(..., description="Base CAPEX before inflation adjustment")

class OpexCalculationResponse(BaseModel):
    annual_cooling_opex: int = Field(..., description="Annual cooling OPEX")
    annual_it_equipment_maintenance: int = Field(..., description="Annual IT equipment maintenance")
    opex_lifetime: int = Field(..., description="OPEX over lifetime of operation")

class FullCalculationResponse(BaseModel):
    capex: CapexCalculationResponse
    opex: Optional[OpexCalculationResponse] = None
    calculation_type: str = Field(..., description="Type of calculation performed") 