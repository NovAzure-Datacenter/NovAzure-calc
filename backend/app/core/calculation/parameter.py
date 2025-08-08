# Parameter model
from .parser import FormulaParser


class Parameter:
    def __init__(self, data: dict):
        self.name = data["name"]
        self.type = data["type"]  # COMPANY/USER/CALCULATION/GLOBAL
        self.unit = data.get("unit", "")
        self.value = data.get("value")  # For static parameters only (GLOBAL/COMPANY)
        self.formula = data.get("formula")  # For CALCULATION parameters only
        self.dependencies = []

        # Runtime states
        self.ast = None
        self.evaluated = False
        self.result = None
        self.unit_resolved = False

        self.validate()

    def validate(self):
        if self.type in ["COMPANY", "GLOBAL"] and self.value is None:
            raise ValueError(f"{self.type} parameter '{self.name}' requires value")

        if self.type == "CALCULATION":
            if not self.formula:
                raise ValueError(f"{self.type} parameter '{self.name}' requires formula")
            self.ast, variables = FormulaParser().parse_formula_to_ast(self.formula)
            self.dependencies = list(variables)

    def resolve_unit(self, context: dict[str, "Parameter"]):
        if self.unit_resolved:
            return self.unit

    def resolve_value(self, context: dict[str, float]):
        if self.evaluated:
            return self.result

        if self.type in ["COMPANY", "GLOBAL"]:
            self.result = self.value

        # User value can only be a number ?!?
        elif self.type == "USER":
            self.result = context[self.name]

        elif self.type == "CALCULATION":
            self.result = self.evaluate_formula(context)

        self.evaluated = True
        return self.result

    def evaluate_formula(self, context: dict[str, float]) -> float:
        if not self.formula:
            raise ValueError(f"No formula available for parameter {self.name}")

        return self._evaluate_ast(self.ast, context)

    def _evaluate_ast(self, node, context: dict[str, float]) -> float:
        if isinstance(node, (float, int)):
            return float(node)

        if isinstance(node, str):
            if node in context:
                return context[node]
            raise ValueError(f"Variable '{node}' not found in context.")

        if isinstance(node, dict):
            return self._evaluate_operation(node, context)

        raise ValueError(f"Unsupported AST node structure: {node}")

    def _evaluate_operation(self, node, context: dict[str, float]) -> float:
        op_type = node["type"]

        if op_type == "Add":
            return self._evaluate_ast(node["left"], context) + self._evaluate_ast(node["right"], context)

        elif op_type == "Subtract":
            return self._evaluate_ast(node["left"], context) - self._evaluate_ast(node["right"], context)

        elif op_type == "Multiply":
            return self._evaluate_ast(node["left"], context) * self._evaluate_ast(node["right"], context)

        elif op_type == "Divide":
            return self._evaluate_ast(node["left"], context) / self._evaluate_ast(node["right"], context)

        elif op_type == "Power":
            return self._evaluate_ast(node["left"], context) ** self._evaluate_ast(node["right"], context)

        elif op_type.startswith("Unary"):
            return -self._evaluate_ast(node["operand"], context)

        raise ValueError(f"Unsupported AST node structure: {node}")
