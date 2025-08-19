from typing import Dict, Optional

import pint

from .parameter import Parameter


class UnitCalculator:
    def __init__(self):
        self.ureg = pint.UnitRegistry()

        self.ureg.define("USD = [currency]")
        self.ureg.define("EUR = 1.1 * USD")
        self.ureg.define("GBP = 1.3 * USD")

        self.currency_symbols = {"$": "USD", "€": "EUR", "£": "GBP"}

    def _format_unit(self, unit_str: str) -> str:
        if not unit_str:
            return unit_str

        formatted = unit_str
        for symbol, unit_name in self.currency_symbols.items():
            formatted = formatted.replace(unit_name, symbol)

        formatted = formatted.replace(" / ", "/")
        return formatted

    def _parse_compound_unit(self, unit_str: str) -> str:
        if not unit_str or "/" not in unit_str:
            return unit_str

        parsed = unit_str
        for symbol, unit_name in self.currency_symbols.items():
            parsed = parsed.replace(symbol, unit_name)

        return parsed

    @staticmethod
    def calculate_unit(ast_node, context: Dict[str, "Parameter"]) -> Optional[str]:
        calculator = UnitCalculator()
        result = calculator._calculate_with_pint(ast_node, context)
        if result:
            return calculator._format_unit(result)
        return result

    def _calculate_with_pint(self, ast_node, context: Dict[str, "Parameter"]) -> Optional[str]:
        if isinstance(ast_node, (float, int)):
            return None

        if isinstance(ast_node, str):
            if ast_node in context:
                unit_str = context[ast_node].unit

                if unit_str is None or unit_str == "":
                    return None

                if unit_str in self.currency_symbols:
                    return self.currency_symbols[unit_str]

                if "/" in unit_str:
                    return self._parse_compound_unit(unit_str)

                try:
                    unit = self.ureg(unit_str)
                    return f"{unit.units:~}"
                except Exception:
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

                    left_quantity = 1 * left_pint
                    right_quantity = 1 * right_pint

                    if op_type == "Add":
                        result = left_quantity + right_quantity
                    else:
                        result = left_quantity - right_quantity

                    return f"{result.units:~}"  # type: ignore
                except Exception:
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
