from pydantic import BaseModel, Field, model_validator
from typing import Optional


class CoolingSolutionRequest(BaseModel):
    # Basic inputs
    solution_type: str = Field(..., description="Data Center Solution Type")
    data_hall_design_capacity_mw: float = Field(
        ..., description="Data hall design capacity in MW"
    )
    first_year_of_operation: int = Field(..., description="First year of operation")
    project_location: str = Field(..., description="Project location/country")
    percentage_of_utilisation: float = Field(
        ..., description="Percentage of utilisation"
    )
    planned_years_of_operation: int = Field(
        ..., description="Planned years of operation"
    )
    annualised_ppue: float = Field(
        ..., description="Annualised air and chassis immersion PPUE"
    )

    advanced: bool = Field(default=False, description="Use advanced configuration")

    # Optional advanced inputs
    include_it_cost: Optional[str] = Field(default=None, description="Include IT cost")
    air_rack_cooling_capacity_kw_per_rack: Optional[float] = Field(
        default=None, description="Air rack cooling capacity per rack in kW"
    )
    data_center_type: Optional[str] = Field(
        default=None, description="Data center type"
    )

    # Advanced Data Centre Configuration inputs
    inlet_temperature: float = Field(default=27, description="Inlet temperature")
    electricity_price_per_kwh: float = Field(
        default=0, description="Electricity price per kWh"
    )
    water_price_per_litre: float = Field(
        default=0.00134, description="Water price per litre"
    )
    
    chassis_product: Optional[str] = Field(
        default=None, description="Chassis immersion product type"
    )
    air_cooling_technology: Optional[str] = Field(
        default=None, description="Air cooling technology type"
    )

    @model_validator(mode='after')
    def set_default_products(self):
        
        air_cooling_defaults = {
            "United Kingdom": "CRAH with Packaged chiller and economiser",
            "United States": "CRAH with Packaged chiller and economiser",
            "Singapore": "CRAH with chiller/tower",
            "United Arab Emirates": "CRAC DX glycol-cooled system with dry cooler",
        }
        
        if self.chassis_product is None:
            self.chassis_product = "purpose_optimized_multinode"
        
        if self.air_cooling_technology is None:
            self.air_cooling_technology = air_cooling_defaults.get(
                self.project_location
            )
        
        return self




class SingleCoolingSolution(BaseModel):
    cooling_equipment_capex: int = Field(..., description="Cooling equipment CAPEX")
    it_equipment_capex: int = Field(..., description="IT equipment CAPEX")
    total_capex: int = Field(..., description="Total CAPEX")
    annual_cooling_opex: int = Field(..., description="Annual cooling OPEX")
    annual_it_maintenance: int = Field(..., description="Annual IT maintenance cost")
    total_opex_over_lifetime: int = Field(
        ..., description="Total OPEX over planned lifetime"
    )
    tco_excluding_it: int = Field(
        ..., description="Total cost of ownership excluding IT"
    )
    tco_including_it: int = Field(
        ..., description="Total cost of ownership including IT"
    )


class CoolingSolutionResult(BaseModel):
    air_cooling_solution: SingleCoolingSolution = Field(
        ..., description="Air cooling solution"
    )
    chassis_immersion_solution: SingleCoolingSolution = Field(
        ..., description="Chassis immersion solution"
    )
