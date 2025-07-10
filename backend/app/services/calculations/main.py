from typing import Dict, Any, Optional
from pydantic import BaseModel

from .solutions.air_cooling.capex import (
    calculate_cooling_capex as calculate_air_cooling_capex,
)
from .solutions.air_cooling.opex import (
    calculate_cooling_opex as calculate_air_cooling_opex,
)
from .solutions.chassis_immersion.capex import (
    calculate_cooling_capex as calculate_chassis_immersion_capex,
)


class CalculationInputs(BaseModel):
    # Basic inputs
    data_hall_design_capacity_mw: float = None
    first_year_of_operation: int = None
    project_location: str = None
    percentage_of_utilisation: float = None
    planned_years_of_operation: int = None
    annualised_air_ppue: float = None

    advanced: bool = False

    include_it_cost: Optional[str] = None
    air_rack_cooling_capacity_kw_per_rack: Optional[float] = None
    data_center_type: Optional[str] = None

    # Advanced Data Centre Configuration inputs
    inlet_temperature: float = 27
    electricity_price_per_kwh: float = 0.1
    water_price_per_litre: float = 0.0001


class CoolingSolutionsCalculator:
    def __init__(self):
        self.inputs = CalculationInputs()

    def update_inputs(self, input_data: Dict[str, Any]) -> None:
        for key, value in input_data.items():
            if hasattr(self.inputs, key):
                setattr(self.inputs, key, value)

    def _build_base_input_data(self) -> Dict[str, Any]:
        return {
            "data_hall_design_capacity_mw": self.inputs.data_hall_design_capacity_mw,
            "first_year_of_operation": self.inputs.first_year_of_operation,
            "country": self.inputs.project_location,
            "advanced_config": self._build_advanced_config(),
        }

    def _build_advanced_config(self) -> Optional[Dict[str, Any]]:
        if not self.inputs.advanced:
            return None

        return {
            "inlet_temperature": self.inputs.inlet_temperature,
            "electricity_price_per_kwh": self.inputs.electricity_price_per_kwh,
            "water_price_per_litre": self.inputs.water_price_per_litre,
        }

    def _build_capex_input_data(self) -> Dict[str, Any]:
        input_data = self._build_base_input_data()

        if self.inputs.advanced:
            input_data.update(
                {
                    "include_it_cost": self.inputs.include_it_cost,
                    "data_center_type": self.inputs.data_center_type,
                    "air_rack_cooling_capacity_kw_per_rack": (
                        self.inputs.air_rack_cooling_capacity_kw_per_rack
                    ),
                    "planned_years_of_operation": (
                        self.inputs.planned_years_of_operation
                    ),
                }
            )

        return input_data

    def _build_opex_input_data(self) -> Dict[str, Any]:
        return {
            "data_hall_design_capacity_mw": self.inputs.data_hall_design_capacity_mw,
            "annualised_air_ppue": self.inputs.annualised_air_ppue,
            "percentage_of_utilisation": self.inputs.percentage_of_utilisation,
            "first_year_of_operation": self.inputs.first_year_of_operation,
            "planned_years_of_operation": self.inputs.planned_years_of_operation,
            "country": self.inputs.project_location,
        }

    async def _calculate_air_cooling_solution(self) -> Dict[str, Any]:
        capex_input = self._build_capex_input_data()
        air_cooling_capex = calculate_air_cooling_capex(capex_input)

        opex_input = self._build_opex_input_data()
        air_cooling_opex = await calculate_air_cooling_opex(
            opex_input, air_cooling_capex["cooling_equipment_capex"]
        )

        # Come back to TCO in the future
        tco_excluding_it = (
            air_cooling_capex["cooling_equipment_capex"]
            + air_cooling_opex["total_opex_over_lifetime"]
        )
        tco_including_it = (
            air_cooling_capex["total_capex"]
            + air_cooling_opex["total_opex_over_lifetime"]
        )

        return {
            "cooling_equipment_capex": air_cooling_capex["cooling_equipment_capex"],
            "it_equipment_capex": air_cooling_capex["it_equipment_capex"],
            "total_capex": air_cooling_capex["total_capex"],
            "annual_cooling_opex": air_cooling_opex["annual_cooling_opex"],
            "annual_it_maintenance": air_cooling_opex["annual_it_maintenance"],
            "total_opex_over_lifetime": air_cooling_opex["total_opex_over_lifetime"],
            "tco_excluding_it": tco_excluding_it,
            "tco_including_it": tco_including_it,
        }

    async def _calculate_chassis_immersion_solution(self) -> Dict[str, Any]:
        capex_input = self._build_capex_input_data()
        chassis_immersion_capex = calculate_chassis_immersion_capex(capex_input)

        # TODO: Implement chassis immersion OPEX calculations
        annual_cooling_opex = 0
        annual_it_maintenance = 0
        total_opex_over_lifetime = 0

        tco_excluding_it = (
            chassis_immersion_capex["cooling_equipment_capex"]
            + total_opex_over_lifetime
        )
        tco_including_it = (
            chassis_immersion_capex["total_capex"] + total_opex_over_lifetime
        )

        return {
            "cooling_equipment_capex": chassis_immersion_capex[
                "cooling_equipment_capex"
            ],
            "it_equipment_capex": chassis_immersion_capex["it_equipment_capex"],
            "total_capex": chassis_immersion_capex["total_capex"],
            "annual_cooling_opex": annual_cooling_opex,
            "annual_it_maintenance": annual_it_maintenance,
            "total_opex_over_lifetime": total_opex_over_lifetime,
            "tco_excluding_it": tco_excluding_it,
            "tco_including_it": tco_including_it,
        }

    async def compare(self) -> Dict[str, Any]:
        air_cooling_solution = await self._calculate_air_cooling_solution()
        chassis_immersion_solution = await self._calculate_chassis_immersion_solution()

        return {
            "air_cooling_solution": air_cooling_solution,
            "chassis_immersion_solution": chassis_immersion_solution,
        }

    async def calculate(self, solution_type: str) -> Dict[str, Any]:
        if solution_type == "air_cooling":
            return await self._calculate_air_cooling_solution()
        elif solution_type == "chassis_immersion":
            return await self._calculate_chassis_immersion_solution()
        else:
            raise ValueError(f"Invalid solution type: {solution_type}")


calculations = CoolingSolutionsCalculator()


def update_inputs(inputs: Dict[str, Any]) -> None:
    calculations.update_inputs(inputs)


async def calculate() -> Dict[str, Any]:
    return await calculations.calculate()


async def compare() -> Dict[str, Any]:
    return await calculations.compare()
