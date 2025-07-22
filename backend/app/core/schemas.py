from pydantic import BaseModel
from typing import Optional, Dict, List

class ParameterSchema(BaseModel):
    name: str
    type: str
    unit: Optional[str] = None
    value: Optional[float] = None
    formula: Optional[str] = None
    
class CalculationRequest(BaseModel):
    parameters: List[ParameterSchema]
    inputs: Dict[str, float]
    target: str

class CalculationResponse(BaseModel):
    result: float