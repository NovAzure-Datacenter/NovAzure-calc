from fastapi import APIRouter, HTTPException
from ..schemas.calculations import (
    CoolingSolutionResult,
    CoolingSolutionRequest,
    SingleCoolingSolution,
)
from ..services.calculations.main import calculate, update_inputs, compare

router = APIRouter(prefix="/calculations", tags=["calculations"])


@router.post("/calculate", response_model=SingleCoolingSolution)
async def main_calculate(request: CoolingSolutionRequest):
    try:
        update_inputs(request.model_dump())
        results = await calculate()
        return results

    except HTTPException:
        raise
        update_inputs(request.model_dump())
        results = await calculate()
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
