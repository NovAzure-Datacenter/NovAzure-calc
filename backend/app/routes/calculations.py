from fastapi import APIRouter, HTTPException
from ..schemas.calculations import MainCalculationRequest, MainCalculationResponse
from ..services.calculations.main import update_inputs, calculate

router = APIRouter(prefix="/calculations", tags=["calculations"])


@router.post("/main", response_model=MainCalculationResponse)
async def main_calculate(request: MainCalculationRequest):
    try:
        # Prepare inputs for update_inputs function (exact keys expected by main.py)
        inputs = {
            "%_of_utilisation": request.percentage_of_utilisation,
            "planned_years_of_operation": request.planned_years_of_operation,
            "project_location": request.project_location,
            "data_hall_design_capacity_mw": request.data_hall_design_capacity_mw,
            "first_year_of_operation": request.first_year_of_operation,
            "annualised_air_ppue": request.annualised_air_ppue,
        }
        update_inputs(inputs)

        result = await calculate()

        return MainCalculationResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Main calculation error: {str(e)}")


@router.get("/health")
async def calculations_health():
    return {"status": "healthy", "service": "calculations"}
