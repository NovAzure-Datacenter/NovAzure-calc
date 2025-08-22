from typing import Dict, List, Optional

from pydantic import BaseModel


class ParameterSchema(BaseModel):
    name: str
    type: str
    unit: Optional[str] = None
    value: Optional[float] = None
    formula: Optional[str] = None


class CalculationRequest(BaseModel):
    parameters: List[ParameterSchema]
    inputs: Dict[str, float]
    target: List[str]


class CalculationResponse(BaseModel):
    result: List[float]
