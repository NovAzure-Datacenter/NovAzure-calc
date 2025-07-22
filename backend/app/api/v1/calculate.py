from fastapi import APIRouter
from app.core.calculation.calculator import Calculator
from app.core.calculation.parameter import Parameter
from app.core.schemas import CalculationRequest, CalculationResponse

router = APIRouter()


@router.post("/calculate", response_model=CalculationResponse)
def calculate(request: CalculationRequest):
    parameters = [Parameter(param.dict()) for param in request.parameters]

    calculator = Calculator(parameters=parameters, inputs=request.inputs)
    target = request.target
    result = calculator.evaluate(target)
    return result
