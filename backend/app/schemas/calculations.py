from pydantic import BaseModel, Field

class CoolingSolutionResult(BaseModel):
    cooling_equipment_capex: int = Field(
        ..., description="Cooling equipment CAPEX"
    )
    it_equipment_capex: int = Field(
        ..., description="IT equipment CAPEX"
    )
    total_capex: int = Field(
        ..., description="Total CAPEX"
    )
    annual_cooling_opex: int = Field(
        ..., description="annual cooling OPEX"
    )
    annual_it_maintenance_cost: int = Field(
        ..., description="annual IT maintenance cost"
    )
    total_opex_over_lifetime: int = Field(
        ..., description="Total OPEX over planned lifetime"
    )
    tco_excluding_it: int = Field(
        ..., description="Total cost of ownership excluding IT"
    )
    tco_including_it: int = Field(
        ..., description="Total cost of ownership including IT"
    )

class CoolingSolutionRequest(BaseModel):
    air_cooling_solution: CoolingSolutionResult = Field(
        ..., description="Air cooling solution"
    )
    chassis_immersion_solution: CoolingSolutionResult = Field(
        ..., description="Chassis immersion solution"
    )