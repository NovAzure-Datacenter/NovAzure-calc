from fastapi import APIRouter, HTTPException
from ..schemas.calculations import (
    CapexCalculationRequest,
    OpexCalculationRequest, 
    FullCalculationRequest,
    CapexCalculationResponse,
    OpexCalculationResponse,
    FullCalculationResponse,
    MainCalculationRequest,
    MainCalculationResponse
)
from ..services.calculations.solutions.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex
from ..services.calculations.solutions.chassis_immersion.capex import calculate_cooling_capex as calculate_chassis_immersion_capex
from ..services.calculations.solutions.air_cooling.opex import calculate_annual_opex
from ..services.calculations.main import update_inputs, calculate

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
        
        result = await calculate_annual_opex(input_data, 1000000)  # Dummy total_capex for now
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
            opex_result = await calculate_annual_opex(opex_input, capex_result.get('total_capex_excl_it', 1000000))
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
        # Air cooling calculation
        air_cooling_result = calculate_air_cooling_capex({
            'data_hall_design_capacity_mw': request.data_hall_design_capacity_mw,
            'base_year': request.base_year,
            'country': request.country
        })
        
        # Chassis immersion calculation
        chassis_immersion_result = calculate_chassis_immersion_capex({
            'data_hall_design_capacity_mw': request.data_hall_design_capacity_mw,
            'base_year': request.base_year,
            'country': request.country
        })
        
        # Return comparison results
        return {
            'air_cooling': air_cooling_result,
            'chassis_immersion': chassis_immersion_result,
            'comparison': {
                'capex_difference': air_cooling_result.get('total_capex_excl_it', 0) - chassis_immersion_result.get('total_capex_excl_it', 0),
                'capex_savings_percentage': round(((air_cooling_result.get('total_capex_excl_it', 0) - chassis_immersion_result.get('total_capex_excl_it', 0)) / air_cooling_result.get('total_capex_excl_it', 1)) * 100, 2) if air_cooling_result.get('total_capex_excl_it', 0) > 0 else 0
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

@router.post("/main", response_model=MainCalculationResponse)
async def main_calculate(request: MainCalculationRequest):
    """
    Main calculation endpoint that uses the update_inputs and calculate functions from main.py
    """
    try:
        # Prepare inputs for update_inputs function (using the exact keys expected by main.py)
        inputs = {
            '%_of_utilisation': request.percentage_of_utilisation,
            'planned_years_of_operation': request.planned_years_of_operation,
            'project_location': request.project_location,
            'data_hall_design_capacity_mw': request.data_hall_design_capacity_mw,
            'first_year_of_operation': request.first_year_of_operation,
            'annualised_air_ppue': request.annualised_air_ppue
        }
        
        # Update inputs in the main calculation service
        update_inputs(inputs)
        
        # Run the calculation
        result = await calculate()
        
        return MainCalculationResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Main calculation error: {str(e)}")

@router.get("/health")
async def calculations_health():
    """
    Health check for calculations service
    """
    return {"status": "healthy", "service": "calculations"} 