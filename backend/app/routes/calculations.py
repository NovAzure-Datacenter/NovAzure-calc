from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..schemas.calculations import (
    CoolingSolutionResult,
    CoolingSolutionRequest,
    SingleCoolingSolution,
)
from ..services.calculations.main import calculate, update_inputs, compare
# Import the IT capex functions (update the import path as needed)
from ..services.calculations.it_config import (
    calculate_it_equipment_capex_complete,
    calculate_it_equipment_maintenance_per_year
)

router = APIRouter(prefix="/calculations", tags=["calculations"])

class ITCapexRequest(BaseModel):
    advanced: bool
    it_cost_included: bool
    total_it_cost_per_kw: Optional[int] = 0
    data_center_type: str
    data_hall_design_capacity_mw: float
    planned_number_of_years: int
    number_of_server_refreshes: int
    air_rack_cooling_capacity_kw_per_rack: float
    project_location: str
    it_cost_per_server: Optional[int] = None
    it_maintenance_cost: Optional[float] = None

@router.post("/it-capex")
async def calculate_it_capex(request: ITCapexRequest):
    try:
        result = calculate_it_equipment_capex_complete(
            advanced=request.advanced,
            it_cost_included=request.it_cost_included,
            total_it_cost_per_kw=request.total_it_cost_per_kw,
            data_center_type=request.data_center_type,
            data_hall_design_capacity_mw=request.data_hall_design_capacity_mw,
            planned_number_of_years=request.planned_number_of_years,
            number_of_server_refreshes=request.number_of_server_refreshes,
            air_rack_cooling_capacity_kw_per_rack=request.air_rack_cooling_capacity_kw_per_rack,
            project_location=request.project_location,
            it_cost_per_server=request.it_cost_per_server
        )
        return {"it_capex": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IT Capex calculation error: {str(e)}")

@router.post("/it-maintenance")
async def calculate_it_maintenance(request: ITCapexRequest):
    try:
        result = calculate_it_equipment_maintenance_per_year(
            advanced=request.advanced,
            it_cost_included=request.it_cost_included,
            total_it_cost_per_kw=request.total_it_cost_per_kw,
            data_center_type=request.data_center_type,
            data_hall_design_capacity_mw=request.data_hall_design_capacity_mw,
            planned_number_of_years=request.planned_number_of_years,
            number_of_server_refreshes=request.number_of_server_refreshes,
            air_rack_cooling_capacity_kw_per_rack=request.air_rack_cooling_capacity_kw_per_rack,
            project_location=request.project_location,
            it_maintenance_cost=request.it_maintenance_cost,
            it_cost_per_server=request.it_cost_per_server
        )
        return {"it_maintenance": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IT Maintenance calculation error: {str(e)}")


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
