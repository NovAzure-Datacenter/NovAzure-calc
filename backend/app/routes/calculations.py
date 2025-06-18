from fastapi import APIRouter, HTTPException
from app.schemas.calculations import (
    CapexCalculationRequest,
    OpexCalculationRequest, 
    FullCalculationRequest,
    CapexCalculationResponse,
    OpexCalculationResponse,
    FullCalculationResponse
)
from app.services.calculations.air_cooling.capex import calculate_cooling_capex
from app.services.calculations.air_cooling.opex import calculate_opex

router = APIRouter(prefix="/calculations", tags=["calculations"])

@router.post("/capex", response_model=CapexCalculationResponse)
async def calculate_capex(request: CapexCalculationRequest):
    """
    Calculate CAPEX for cooling solutions
    """
    try:
        input_data = {
            'cooling_capacity_limit': request.cooling_capacity_limit,
            'include_it_cost': request.include_it_cost
        }
        
        result = calculate_cooling_capex(input_data)
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
        # Calculate CAPEX
        capex_input = {
            'cooling_capacity_limit': request.cooling_capacity_limit,
            'include_it_cost': request.include_it_cost
        }
        capex_result = calculate_cooling_capex(capex_input)
        capex_response = CapexCalculationResponse(**capex_result)
        
        # Calculate OPEX if years provided
        opex_response = None
        if request.planned_years_of_operation:
            opex_input = {
                'cooling_capacity_limit': request.cooling_capacity_limit,
                'include_it_cost': request.include_it_cost,
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

@router.get("/health")
async def calculations_health():
    """
    Health check for calculations service
    """
    return {"status": "healthy", "service": "calculations"} 