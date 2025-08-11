import pint

from typing import Dict, Optional

from .parameter import Parameter


class UnitCalculator:
    def __init__(self):
        self.ureg = pint.UnitRegistry()

    @staticmethod
    def calculate_unit(ast_node, context: Dict[str, "Parameter"]) -> Optional[str]:
        calculator = UnitCalculator()
        return calculator._calculate_with_pint(ast_node, context)

    def _calculate_with_pint(self, ast_node, context: Dict[str, "Parameter"]) -> Optional[str]:
        if isinstance(ast_node, (float, int)):
            return None

        if isinstance(ast_node, str):
            if ast_node in context:
                unit_str = context[ast_node].unit

                if unit_str == None or unit_str == "":
                    return None

                try:
                    unit = self.ureg(unit_str)
                    return f"{unit.units:~}"
                except:
                    return unit_str

            return None

        if isinstance(ast_node, dict):
            return self._calculate_formula_with_pint(ast_node, context)

    def _calculate_formula_with_pint(self, ast_node, context: Dict[str, "Parameter"]) -> Optional[str]:
        op_type = ast_node["type"]

        if op_type in ["Add", "Subtract"]:
            left_unit = self._calculate_with_pint(ast_node["left"], context)
            right_unit = self._calculate_with_pint(ast_node["right"], context)

            if left_unit is None and right_unit is None:
                return None
            if left_unit is None:
                return right_unit
            elif right_unit is None:
                return left_unit
            elif left_unit == right_unit:
                return left_unit
            else:
                try:
                    left_pint = self.ureg(left_unit)
                    right_pint = self.ureg(right_unit)

                    left_quantity = 1*left_pint
                    right_quantity = 1*right_pint

                    if op_type == "Add":
                        result = left_quantity + right_quantity
                    else:
                        result = left_quantity - right_quantity

                    return f"{result.units:~}" # type: ignore
                except:
                    raise ValueError(f"Incompatible units for {op_type.lower()}: '{left_unit}' and '{right_unit}'")

        elif op_type == "Multiply":
            left_unit = self._calculate_with_pint(ast_node["left"], context)
            right_unit = self._calculate_with_pint(ast_node["right"], context)

            if left_unit is None and right_unit is None:
                return None
            if left_unit is None:
                return right_unit
            elif right_unit is None:
                return left_unit
            else:
                left_pint = self.ureg(left_unit)
                right_pint = self.ureg(right_unit)
                result = left_pint * right_pint
                return f"{result.units:~}"

        elif op_type == "Divide":
            left_unit = self._calculate_with_pint(ast_node["left"], context)
            right_unit = self._calculate_with_pint(ast_node["right"], context)

            if left_unit is None and right_unit is None:
                return None
            if left_unit is None:
                return right_unit
            elif right_unit is None:
                return f"1/{right_unit}"
            else:
                left_pint = self.ureg(left_unit)
                right_pint = self.ureg(right_unit)
                result = left_pint / right_pint
                return f"{result.units:~}"
