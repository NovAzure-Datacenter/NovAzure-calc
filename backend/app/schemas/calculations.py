from pydantic import BaseModel, Field
from typing import Optional, Literal

# Request Schemas
class CapexCalculationRequest(BaseModel):
    cooling_capacity_limit: int = Field(..., description="Cooling capacity limit (5 or 10)")
    include_it_cost: bool = Field(..., description="Whether to include IT costs in calculation")

class OpexCalculationRequest(BaseModel):
    cooling_capacity_limit: int = Field(..., description="Cooling capacity limit (5 or 10)")
    include_it_cost: bool = Field(..., description="Whether to include IT costs in calculation")
    planned_years_of_operation: int = Field(..., description="Planned years of operation")

class FullCalculationRequest(BaseModel):
    cooling_type: Literal["air_cooling"] = Field(..., description="Type of cooling solution")
    cooling_capacity_limit: int = Field(..., description="Cooling capacity limit (5 or 10)")
    include_it_cost: bool = Field(..., description="Whether to include IT costs in calculation")
    planned_years_of_operation: Optional[int] = Field(None, description="Planned years of operation (for OPEX)")

# Response Schemas
class CapexCalculationResponse(BaseModel):
    cooling_equipment_capex: int = Field(..., description="Cooling equipment CAPEX")
    it_equipment_capex: int = Field(..., description="IT equipment CAPEX")
    total_capex: int = Field(..., description="Total CAPEX")

class OpexCalculationResponse(BaseModel):
    annual_cooling_opex: int = Field(..., description="Annual cooling OPEX")
    annual_it_equipment_maintenance: int = Field(..., description="Annual IT equipment maintenance")
    opex_lifetime: int = Field(..., description="OPEX over lifetime of operation")

class FullCalculationResponse(BaseModel):
    capex: CapexCalculationResponse
    opex: Optional[OpexCalculationResponse] = None
    calculation_type: str = Field(..., description="Type of calculation performed") 