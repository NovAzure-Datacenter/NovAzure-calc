from pydantic import BaseModel, Field
from typing import Dict, Any


# Main Calculation Schemas (for main.py integration)
class MainCalculationRequest(BaseModel):
    percentage_of_utilisation: float = Field(
        ...,
        description="Percentage of utilisation (actual IT power vs maximum IT design)",
    )
    planned_years_of_operation: int = Field(
        ..., description="Planned number of years of operation"
    )
    project_location: str = Field(..., description="Project location/country")
    data_hall_design_capacity_mw: float = Field(
        ..., description="Data Hall Design Capacity in MW"
    )
    first_year_of_operation: int = Field(..., description="First year of operation")
    annualised_air_ppue: float = Field(..., description="Annualised Air pPUE")


class MainCalculationResponse(BaseModel):
    air_cooling_capex: float = Field(..., description="Air cooling equipment CAPEX")
    total_capex: float = Field(..., description="Total CAPEX")
    opex: Dict[str, Any] = Field(..., description="OPEX calculation results")
    total_opex_over_lifetime: Dict[str, Any] = Field(
        ..., description="Total OPEX over lifetime"
    )
    total_cost_of_ownership: float = Field(..., description="Total cost of ownership")
