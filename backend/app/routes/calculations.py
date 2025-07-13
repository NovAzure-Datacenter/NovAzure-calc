from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..schemas.calculations import (
    CoolingSolutionResult,
    CoolingSolutionRequest,
    SingleCoolingSolution,
)
from ..services.calculations.main import calculate, update_inputs, compare

# Import the IT capex functions
from ..services.calculations.it_config import (
    calculate_it_equipment_capex_complete,
    calculate_it_equipment_maintenance_per_year,
)

router = APIRouter(prefix="/calculations", tags=["calculations"])


class ITCapexRequest(BaseModel):
    advanced: bool
    it_cost_included: bool
    typical_it_cost_per_server: Optional[int] = None
    data_center_type: str
    data_hall_design_capacity_mw: int
    planned_number_of_years: int
    air_rack_cooling_capacity_kw_per_rack: int
    project_location: str
    it_maintenance_cost: Optional[float] = None
    server_rated_max_power: Optional[int] = None


@router.post("/it-capex")
async def calculate_it_capex(request: ITCapexRequest):
    try:
        result = calculate_it_equipment_capex_complete(
            advanced=request.advanced,
            it_cost_included=request.it_cost_included,
            data_center_type=request.data_center_type,
            data_hall_design_capacity_mw=request.data_hall_design_capacity_mw,
            planned_number_of_years=request.planned_number_of_years,
            air_rack_cooling_capacity_kw_per_rack=request.air_rack_cooling_capacity_kw_per_rack,
            project_location=request.project_location,
            typical_it_cost_per_server=request.typical_it_cost_per_server,
            server_rated_max_power=request.server_rated_max_power,
        )
        return {"it_capex": result}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"IT Capex calculation error: {str(e)}"
        )


@router.post("/it-maintenance")
async def calculate_it_maintenance(request: ITCapexRequest):
    try:
        result = calculate_it_equipment_maintenance_per_year(
            advanced=request.advanced,
            it_cost_included=request.it_cost_included,
            typical_it_cost_per_server=request.typical_it_cost_per_server,
            data_center_type=request.data_center_type,
            data_hall_design_capacity_mw=request.data_hall_design_capacity_mw,
            planned_number_of_years=request.planned_number_of_years,
            air_rack_cooling_capacity_kw_per_rack=request.air_rack_cooling_capacity_kw_per_rack,
            project_location=request.project_location,
            it_maintenance_cost=request.it_maintenance_cost,
            server_rated_max_power=request.server_rated_max_power,
        )
        return {"it_maintenance": result}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"IT Maintenance calculation error: {str(e)}"
        )


@router.post("/calculate", response_model=SingleCoolingSolution)
async def main_calculate(request: CoolingSolutionRequest):
    try:
        update_inputs(request.model_dump())
        results = await calculate(request.solution_type)
        return results

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Main calculation error: {str(e)}")


@router.post("/compare", response_model=CoolingSolutionResult)
async def compare_calculate(request: CoolingSolutionRequest):
    try:
        update_inputs(request.model_dump())
        results = await compare()
        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Compare calculation error: {str(e)}"
        )
