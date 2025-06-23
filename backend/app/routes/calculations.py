from fastapi import APIRouter, HTTPException
from app.schemas.calculations import (
    CapexCalculationRequest,
    OpexCalculationRequest, 
    FullCalculationRequest,
    CapexCalculationResponse,
    OpexCalculationResponse,
    FullCalculationResponse
)
from app.services.calculations.solutions.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex
from app.services.calculations.solutions.chassis_immersion.capex import calculate_cooling_capex as calculate_chassis_immersion_capex
from app.services.calculations.air_cooling.opex import calculate_opex
from app.services.calculations.main import compare_solutions

router = APIRouter(prefix="/calculations", tags=["calculations"])

@router.post("/capex", response_model=CapexCalculationResponse)
async def calculate_capex(request: CapexCalculationRequest):
    """
    Calculate CAPEX for cooling solutions
    """
    try:
        input_data = {
            'data_hall_design_capacity_mw': request.data_hall_design_capacity_mw,
            'base_year': request.base_year,
            'country': request.country
        }
        
        # Default to air cooling for now - can be extended to support cooling type selection
        result = calculate_air_cooling_capex(input_data)
        return CapexCalculationResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@router.post("/opex", response_model=OpexCalculationResponse)
async def calculate_opex_endpoint(request: OpexCalculationRequest):
    """
    Calculate OPEX for cooling solutions
    """
    try:
        input_data = {
            'cooling_capacity_limit': request.cooling_capacity_limit,
            'include_it_cost': request.include_it_cost,
            'planned_years_of_operation': request.planned_years_of_operation
        }
        
        result = calculate_opex(input_data)
        return OpexCalculationResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@router.post("/full", response_model=FullCalculationResponse)
async def calculate_full(request: FullCalculationRequest):
    """
    Calculate both CAPEX and OPEX for cooling solutions
    """
    try:
        # Calculate CAPEX based on cooling type
        capex_input = {
            'data_hall_design_capacity_mw': request.data_hall_design_capacity_mw,
            'base_year': request.base_year,
            'country': request.country
        }
        
        if request.cooling_type == "air_cooling":
            capex_result = calculate_air_cooling_capex(capex_input)
        elif request.cooling_type == "chassis_immersion":
            capex_result = calculate_chassis_immersion_capex(capex_input)
        else:
            raise ValueError(f"Unsupported cooling type: {request.cooling_type}")
            
        capex_response = CapexCalculationResponse(**capex_result)
        
        # Calculate OPEX if years provided (using legacy OPEX calculation for now)
        opex_response = None
        if request.planned_years_of_operation:
            # For now, use a simplified mapping to legacy OPEX calculation
            # This would need to be updated to match new requirements
            opex_input = {
                'cooling_capacity_limit': 10,  # Default value
                'include_it_cost': False,      # Excluding IT as per new requirements
                'planned_years_of_operation': request.planned_years_of_operation
            }
            opex_result = calculate_opex(opex_input)
            opex_response = OpexCalculationResponse(**opex_result)
        
        return FullCalculationResponse(
            capex=capex_response,
            opex=opex_response,
            calculation_type=request.cooling_type
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@router.post("/compare")
async def compare_cooling_solutions(request: CapexCalculationRequest):
    """
    Compare air cooling vs chassis immersion solutions
    """
    try:
        input_data = {
            'data_hall_design_capacity_mw': request.data_hall_design_capacity_mw,
            'base_year': request.base_year,
            'country': request.country
        }
        
        result = compare_solutions(input_data)
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

@router.get("/health")
async def calculations_health():
    """
    Health check for calculations service
    """
    return {"status": "healthy", "service": "calculations"} 