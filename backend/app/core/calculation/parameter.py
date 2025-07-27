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
            "log": self._log_function,  # Enhanced logarithm function
            "ln": lambda x: self._log_function(x, math.e),  # Natural log using log with base e
            "sqrt": math.sqrt,
            "sin": self._sin_function,  # Enhanced sine function
            "cos": math.cos,
            "tan": math.tan,
            "abs": abs,
            "round": round,
            "floor": math.floor,
            "ceil": math.ceil,
            "exp": self._exp_function,  # Enhanced exponential function
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
                            if len(evaluated_args) == 1:
                                return math_functions[func_name](evaluated_args[0])
                            elif len(evaluated_args) == 2:
                                return math_functions[func_name](evaluated_args[0], evaluated_args[1])
                            else:
                                raise ValueError(f"Function '{func_name}' expects 1 or 2 arguments: log(x) or log(x, base)")
                        elif func_name == "ln":
                            if len(evaluated_args) == 1:
                                return math_functions[func_name](evaluated_args[0])
                            else:
                                raise ValueError(f"Function '{func_name}' expects exactly 1 argument: ln(x)")
                        elif func_name == "sin":
                            if len(evaluated_args) == 1:
                                return math_functions[func_name](evaluated_args[0])
                            elif len(evaluated_args) == 2:
                                return math_functions[func_name](evaluated_args[0], evaluated_args[1])
                            else:
                                raise ValueError(f"Function '{func_name}' expects 1 or 2 arguments: sin(angle) or sin(angle, 'degrees')")
                        elif func_name == "exp":
                            if len(evaluated_args) == 3:
                                return math_functions[func_name](evaluated_args[0], evaluated_args[1], evaluated_args[2])
                            else:
                                raise ValueError(f"Function '{func_name}' expects exactly 3 arguments: exp(growth_rate, time_period, time_unit)")
                        elif len(evaluated_args) == 1:
                            return math_functions[func_name](evaluated_args[0])
                        else:
                            raise ValueError(f"Function '{func_name}' called with wrong number of arguments")
                    else:
                        raise ValueError(f"Unknown function: {func_name}")
            raise ValueError(f"Unsupported AST node structure: {node}")

        return evaluate_ast(self.ast)

    def _log_function(self, x: float, base: float = 10) -> float:
        """
        Returns:
            The logarithm of x with the specified base
        """
        if x <= 0:
            raise ValueError(f"Logarithm of non-positive number ({x}) is undefined.")
        if base <= 0 or base == 1:
            raise ValueError(f"Base for logarithm must be positive and not 1. Got {base}")
        return math.log(x, base)

    def _sin_function(self, angle: float, unit: str = "radians") -> float:
        """
        Enhanced sine function that accepts both radians and degrees.
        """
        if unit.lower() == "degrees":
            # Convert degrees to radians
            angle_radians = math.radians(angle)
        elif unit.lower() == "radians":
            angle_radians = angle
        else:
            raise ValueError(f"Invalid unit '{unit}'. Use 'radians' or 'degrees'")
        
        return math.sin(angle_radians)

    def _exp_function(self, x: float, time_period: float, time_unit: str) -> float:
        """
        Args:
            x: The growth rate (as decimal, e.g., 0.05 for 5%)
            time_period: The time period to grow over (must be specified)
            time_unit: The unit of time ("years", "months", "weeks", "days")
            
        Returns:
            e^(growth_rate * time_period) - the exponential growth factor
            
        Example:
            exp(0.05, 1, "years") -> e^(0.05 * 1) = 1.051 (5% annual growth)
        """
        # All parameters must be explicitly defined - no assumptions
        growth_rate = x
        time_in_years = self._convert_time_to_years(time_period, time_unit)
        exponent = growth_rate * time_in_years
        
        # Check for potential overflow
        if exponent > 700:
            raise ValueError(f"Exponential overflow: e^{exponent} is too large to calculate safely.")
        
        # Check for potential underflow
        if exponent < -700:
            return 0.0
        
        return math.exp(exponent)
    
    def _convert_time_to_years(self, time_period: float, time_unit: str) -> float:
        """
        Convert various time units to years for consistent exponential calculations.   
        """
        time_unit = time_unit.lower()
        
        if time_unit == "years":
            return time_period
        elif time_unit == "months":
            return time_period / 12
        elif time_unit == "weeks":
            return time_period / 52
        elif time_unit == "days":
            return time_period / 365
        else:
            raise ValueError(f"Invalid time unit '{time_unit}'. Use: years, months, weeks, days")
