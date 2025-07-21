# Parameter model


class Parameter:
    def __init__(self, data: dict):
        self.name = data["name"]
        self.type = data["type"] # COMPANY/USER/CALCULATION/GLOBAL
        self.unit = data.get('unit', '')
        self.value = data.get('value') # For static parameters only (GLOBAL/COMPANY)
        self.formula = data.get('formula') # For CALCULATION parameters only
        self.dependencies = data.get('dependencies', [])
        
        # Runtime states
        self.ast = None
        self.evaluated = False
        self.result = None
        
        self.validate()
        
    def resolve_value(self):
        pass
    
    def extract_dependencies(self):
        pass
    
    def compile_ast(self):
        pass
    
    def validate(self):
        if self.type in ["COMPANY", "GLOBAL"] and self.value == None:
            raise ValueError(f"{self.type} parameter {self.name} requires value")
        
        if self.type == "CALCULATION":
            if not self.formula:
                raise ValueError(f"{self.type} parameter {self.name} requires formula")
            
            self.dependencies = self.extract_dependencies()