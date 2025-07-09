from fastapi import APIRouter, HTTPException
from ..schemas.calculations import CoolingSolutionResult, CoolingSolutionRequest
from ..services.calculations.main import calculate, update_inputs

router = APIRouter(prefix="/calculations", tags=["calculations"])

@router.post("/calculate", response_model=CoolingSolutionResult)
async def main_calculate(request: CoolingSolutionRequest):
    try:
        update_inputs(request.model_dump())
        results = await calculate()
        return results

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Main calculation error: {str(e)}")
