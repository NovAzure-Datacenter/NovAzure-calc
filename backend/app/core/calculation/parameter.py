# Parameter model
import re
from typing import List
from .parser import FormulaParser

VARIABLES_REGEX = re.compile(r"\b[a-zA-Z_][a-zA-Z0-9_]*\b")


def is_valid_unit(unit: str) -> bool:
    # You can expand this as needed (e.g., check against a set of allowed units)
    return bool(unit)  # For now, just require non-empty string


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

        self.validate()

    def validate(self, param_map=None):
        # Static parameters: must have a value and a valid unit
        if self.type in ["COMPANY", "GLOBAL"]:
            if self.value is None:
                raise ValueError(f"{self.type} parameter '{self.name}' requires value")
            if not self.unit or not is_valid_unit(self.unit):
                raise ValueError(
                    f"{self.type} parameter '{self.name}' requires a valid unit"
                )

        # User parameter: optionally check unit
        if self.type == "USER":
            if not self.unit or not is_valid_unit(self.unit):
                raise ValueError(f"USER parameter '{self.name}' requires a valid unit")

        # Calculation parameter: must have formula, dependencies, and valid unit propagation
        if self.type == "CALCULATION":
            if not self.formula:
                raise ValueError(
                    f"{self.type} parameter '{self.name}' requires formula"
                )
            self.dependencies = self.extract_dependencies()
            if param_map is not None:
                computed_unit = self.compute_unit(param_map)
                if self.unit and computed_unit != self.unit:
                    raise ValueError(
                        f"Unit mismatch for '{self.name}': expected '{self.unit}', got '{computed_unit}'"
                    )

    def extract_dependencies(self) -> List[str]:
        if not self.formula:
            return []

        variables = set(VARIABLES_REGEX.findall(self.formula))
        return list(variables)

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

        self.ast, variables = FormulaParser().parse_formula_to_ast(self.formula)

        def evaluate_ast(node) -> float:
            if isinstance(node, (float, int)):
                return float(node)
            if isinstance(node, str):
                if node in context:
                    return context[node]
                raise ValueError(f"Variable '{node}' not found in context.")
            if isinstance(node, dict):
                op_type = node["type"]
                if op_type == "Add":
                    left = evaluate_ast(node["left"])
                    right = evaluate_ast(node["right"])
                    return left + right
                elif op_type == "Subtract":
                    left = evaluate_ast(node["left"])
                    right = evaluate_ast(node["right"])
                    return left - right
                elif op_type == "Multiply":
                    left = evaluate_ast(node["left"])
                    right = evaluate_ast(node["right"])
                    return left * right
                elif op_type == "Divide":
                    left = evaluate_ast(node["left"])
                    right = evaluate_ast(node["right"])
                    return left / right
                elif op_type == "Power":
                    left = evaluate_ast(node["left"])
                    right = evaluate_ast(node["right"])
                    return left**right
                elif op_type.startswith("Unary"):
                    return -evaluate_ast(node["operand"])
            raise ValueError(f"Unsupported AST node structure: {node}")

        return evaluate_ast(self.ast)

    def compute_unit(self, param_map: dict) -> str:
        """
        Recursively computes the resulting unit for this parameter.
        For static parameters, returns self.unit.
        For calculation parameters, propagates units through the formula AST.
        """
        if self.type in ["COMPANY", "GLOBAL", "USER"]:
            return self.unit
        elif self.type == "CALCULATION":
            if not self.formula:
                return ""
            ast, _ = FormulaParser().parse_formula_to_ast(self.formula)
            return self._compute_unit_from_ast(ast, param_map)
        return ""

    def _compute_unit_from_ast(self, node, param_map):
        if isinstance(node, (float, int)):
            return ""  # numbers are dimensionless
        if isinstance(node, str):
            # variable: get its unit from param_map
            return param_map[node].unit
        if isinstance(node, dict):
            op_type = node["type"]
            left_unit = (
                self._compute_unit_from_ast(node["left"], param_map)
                if "left" in node
                else ""
            )
            right_unit = (
                self._compute_unit_from_ast(node["right"], param_map)
                if "right" in node
                else ""
            )
            if op_type in ["Add", "Subtract"]:
                if left_unit != right_unit:
                    raise ValueError(
                        f"Unit mismatch in {op_type}: {left_unit} vs {right_unit}"
                    )
                return left_unit
            elif op_type == "Multiply":
                return self._combine_units(left_unit, right_unit, op_type)
            elif op_type == "Divide":
                return self._combine_units(left_unit, right_unit, op_type)
            elif op_type.startswith("Unary"):
                return self._compute_unit_from_ast(node["operand"], param_map)
        raise ValueError(f"Unsupported AST node structure: {node}")

    def _combine_units(self, left, right, op_type):
        if op_type == "Multiply":
            if left and right:
                return f"{left}*{right}"
            return left or right
        elif op_type == "Divide":
            if left and right:
                return f"{left}/{right}"
            elif left:
                return left
            elif right:
                return f"1/{right}"
            else:
                return ""
