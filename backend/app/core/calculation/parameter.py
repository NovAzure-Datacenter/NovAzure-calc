# Parameter model
import re
import math
from typing import List
from .parser import FormulaParser

VARIABLES_REGEX = re.compile(r"\b[a-zA-Z_][a-zA-Z0-9_]*\b")


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

    def validate(self):
        if self.type in ["COMPANY", "GLOBAL"] and self.value is None:
            raise ValueError(f"{self.type} parameter '{self.name}' requires value")

        if self.type == "CALCULATION":
            if not self.formula:
                raise ValueError(
                    f"{self.type} parameter '{self.name}' requires formula"
                )
            self.dependencies = self.extract_dependencies()

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

        # Mathematical functions dictionary
        math_functions = {
            "log": lambda x, base: math.log(x, base),  # Logarithm with custom base
            "ln": lambda x: math.log(x),  # Natural logarithm (base e)
            "sqrt": math.sqrt,
            "sin": math.sin,
            "cos": math.cos,
            "tan": math.tan,
            "abs": abs,
            "round": round,
            "floor": math.floor,
            "ceil": math.ceil,
            "exp": math.exp,
        }

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
                elif op_type == "Function":
                    func_name = node["name"]
                    arguments = node["arguments"]
                    
                    if func_name in math_functions:
                        # Evaluate all arguments
                        evaluated_args = [evaluate_ast(arg) for arg in arguments]
                        
                        # Handle special cases for functions with multiple arguments
                        if func_name == "log":
                            if len(evaluated_args) == 2:
                                return math_functions[func_name](evaluated_args[0], evaluated_args[1])
                            else:
                                raise ValueError(f"Function '{func_name}' expects exactly 2 arguments: log(x, base)")
                        elif len(evaluated_args) == 1:
                            return math_functions[func_name](evaluated_args[0])
                        else:
                            raise ValueError(f"Function '{func_name}' called with wrong number of arguments")
                    else:
                        raise ValueError(f"Unknown function: {func_name}")
            raise ValueError(f"Unsupported AST node structure: {node}")

        return evaluate_ast(self.ast)
