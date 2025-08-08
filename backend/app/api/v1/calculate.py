from fastapi import APIRouter

from app.core.calculation.calculator import Calculator
from app.core.calculation.parameter import Parameter
from app.core.schemas import CalculationRequest, CalculationResponse

router = APIRouter()


@router.post("/calculate", response_model=CalculationResponse)
def calculate(request: CalculationRequest):
    parameters = [Parameter(param.model_dump()) for param in request.parameters]

    calculator = Calculator(parameters=parameters, inputs=request.inputs)
    targets = request.target
    result = calculator.evaluate(targets)
    return result
