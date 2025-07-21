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