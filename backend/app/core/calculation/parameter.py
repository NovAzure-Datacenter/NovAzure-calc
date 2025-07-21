# Parameter model
import re
from typing import List

VARIABLES_REGEX = re.compile(r"\b[a-zA-Z_][a-zA-Z0-9_]*\b")

class Parameter:
    def __init__(self, data: dict):
        self.name = data["name"]
        self.type = data["type"] # COMPANY/USER/CALCULATION/GLOBAL
        self.unit = data.get('unit', '')
        self.value = data.get('value') # For static parameters only (GLOBAL/COMPANY)
        self.formula = data.get('formula') # For CALCULATION parameters only
        
        # Runtime states
        self.ast = None
        self.evaluated = False
        self.result = None
        
        self.validate()
        
    def validate(self):
        if self.type in ["COMPANY", "GLOBAL"] and self.value == None:
            raise ValueError(f"{self.type} parameter {self.name} requires value")
        
        if self.type == "CALCULATION":
            if not self.formula:
                raise ValueError(f"{self.type} parameter {self.name} requires formula")
            self.dependencies = self.extract_dependencies()    
        else: 
            self.dependencies = []
        
    def extract_dependencies(self) -> List[str]:
        if not self.formula:
            return []
            
        variables = set(VARIABLES_REGEX.findall(self.formula))
        return list(variables)
    
    def resolve_value(self):
        pass
    
    def compile_ast(self):
        pass