# unit_validator.py
import re
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
from enum import Enum


class UnitType(Enum):
    POWER = "power"           # MW, kW, W
    ENERGY = "energy"         # MWh, kWh, J
    CURRENCY = "currency"     # USD, EUR, GBP
    TIME = "time"            # years, hours, days
    RATIO = "ratio"          # percentage, dimensionless
    RATE = "rate"            # USD/kWh, USD/year, etc.
    VOLUME = "volume"        # liters, gallons
    TEMPERATURE = "temperature"  # C, F, K
    DIMENSIONLESS = "dimensionless"  # pure numbers


@dataclass
class UnitInfo:
    base_type: UnitType
    scale_factor: float  # conversion to base unit
    symbol: str
    valid_ranges: Optional[Tuple[float, float]] = None  # (min, max) reasonable values


class UnitRegistry:
    """Registry of all supported units with their properties"""
    
    def __init__(self):
        self.units = {
            # Power units
            "W": UnitInfo(UnitType.POWER, 1.0, "W", (0, 1e12)),
            "kW": UnitInfo(UnitType.POWER, 1000.0, "kW", (0, 1e9)),
            "MW": UnitInfo(UnitType.POWER, 1e6, "MW", (0, 1e6)),
            "GW": UnitInfo(UnitType.POWER, 1e9, "GW", (0, 1000)),
            
            # Energy units
            "Wh": UnitInfo(UnitType.ENERGY, 1.0, "Wh", (0, 1e15)),
            "kWh": UnitInfo(UnitType.ENERGY, 1000.0, "kWh", (0, 1e12)),
            "MWh": UnitInfo(UnitType.ENERGY, 1e6, "MWh", (0, 1e9)),
            "GWh": UnitInfo(UnitType.ENERGY, 1e9, "GWh", (0, 1e6)),
            
            # Currency units
            "USD": UnitInfo(UnitType.CURRENCY, 1.0, "USD", (0, 1e12)),
            "EUR": UnitInfo(UnitType.CURRENCY, 1.1, "EUR", (0, 1e12)),  # rough conversion
            "GBP": UnitInfo(UnitType.CURRENCY, 1.25, "GBP", (0, 1e12)),
            
            # Time units
            "hours": UnitInfo(UnitType.TIME, 1.0, "hours", (0, 1e6)),
            "days": UnitInfo(UnitType.TIME, 24.0, "days", (0, 1e5)),
            "years": UnitInfo(UnitType.TIME, 8760.0, "years", (0, 100)),
            
            # Ratios/percentages
            "%": UnitInfo(UnitType.RATIO, 0.01, "%", (0, 100)),
            "ratio": UnitInfo(UnitType.RATIO, 1.0, "ratio", (0, 1)),
            
            # Volume
            "liters": UnitInfo(UnitType.VOLUME, 1.0, "liters", (0, 1e12)),
            "gallons": UnitInfo(UnitType.VOLUME, 3.785, "gallons", (0, 1e12)),
            
            # Temperature
            "C": UnitInfo(UnitType.TEMPERATURE, 1.0, "°C", (-50, 100)),
            "F": UnitInfo(UnitType.TEMPERATURE, 1.0, "°F", (-60, 200)),
            
            # Dimensionless
            "": UnitInfo(UnitType.DIMENSIONLESS, 1.0, "", (None, None)),
            "dimensionless": UnitInfo(UnitType.DIMENSIONLESS, 1.0, "", (None, None)),
        }
        
        # Rate units (composite units)
        self.rate_patterns = {
            r"USD/kWh": (UnitType.RATE, "USD per kWh"),
            r"USD/year": (UnitType.RATE, "USD per year"), 
            r"USD/MW": (UnitType.RATE, "USD per MW"),
            r"kWh/year": (UnitType.RATE, "kWh per year"),
            r"MW/rack": (UnitType.RATE, "MW per rack"),
        }
    
    def parse_unit(self, unit_str: str) -> Optional[Tuple[UnitType, str]]:
        """Parse a unit string and return its type and normalized form"""
        if not unit_str:
            return UnitType.DIMENSIONLESS, ""
            
        # Check direct matches first
        if unit_str in self.units:
            unit_info = self.units[unit_str]
            return unit_info.base_type, unit_str
        
        # Check rate patterns
        for pattern, (unit_type, description) in self.rate_patterns.items():
            if re.match(pattern.replace("/", r"\/"), unit_str):
                return unit_type, unit_str
        
        return None, unit_str
    
    def get_unit_info(self, unit_str: str) -> Optional[UnitInfo]:
        """Get detailed info about a unit"""
        return self.units.get(unit_str)


class UnitValidator:
    """Validates units for parameters and calculations"""
    
    def __init__(self):
        self.registry = UnitRegistry()
        
        # Define operation rules for dimensional analysis
        self.operation_rules = {
            "Add": self._validate_add_subtract,
            "Subtract": self._validate_add_subtract,
            "Multiply": self._validate_multiply,
            "Divide": self._validate_divide,
            "Power": self._validate_power,
        }
    
    def validate_input_value(self, param_name: str, value: float, expected_unit: str) -> Optional[Dict]:
        """Validate a user input value against expected unit"""
        unit_info = self.registry.get_unit_info(expected_unit)
        
        if not unit_info:
            return {
                "type": "unknown_unit",
                "expected_unit": expected_unit,
                "message": f"Unknown unit '{expected_unit}' for parameter '{param_name}'"
            }
        
        # Check if value is in reasonable range
        if unit_info.valid_ranges:
            min_val, max_val = unit_info.valid_ranges
            if value < min_val or value > max_val:
                return {
                    "type": "value_out_of_range",
                    "expected_unit": expected_unit,
                    "value": value,
                    "valid_range": unit_info.valid_ranges,
                    "message": f"Value {value} {expected_unit} is outside reasonable range {unit_info.valid_ranges}"
                }
        
        # Check for common unit mistakes
        common_mistakes = self._check_common_mistakes(param_name, value, expected_unit)
        if common_mistakes:
            return common_mistakes
        
        return None
    
    def _check_common_mistakes(self, param_name: str, value: float, expected_unit: str) -> Optional[Dict]:
        """Check for common unit input mistakes"""
        
        # Check if user might have entered wrong scale
        if expected_unit == "MW" and value > 1000:
            return {
                "type": "possible_scale_error",
                "expected_unit": expected_unit,
                "value": value,
                "suggestion": f"Did you mean {value/1000:.2f} MW instead of {value} MW?",
                "message": f"Value {value} MW seems very high. Common mistake: entering kW instead of MW."
            }
        
        if expected_unit == "kW" and value < 0.001:
            return {
                "type": "possible_scale_error", 
                "expected_unit": expected_unit,
                "value": value,
                "suggestion": f"Did you mean {value*1000:.2f} W instead of {value} kW?",
                "message": f"Value {value} kW seems very low."
            }
        
        # Check percentage mistakes
        if expected_unit == "%" and value > 1 and value < 100:
            return {
                "type": "percentage_format",
                "expected_unit": expected_unit,
                "value": value,
                "message": f"Enter {value}% as decimal (0.{int(value)}) or with % symbol"
            }
        
        return None
    
    def validate_formula_units(self, ast_node: Any, param_context: Dict[str, str]) -> Tuple[Optional[str], List[Dict]]:
        """
        Validate units through a formula's AST
        Returns: (resulting_unit, list_of_errors)
        """
        errors = []
        
        if isinstance(ast_node, (int, float)):
            return "dimensionless", errors
        
        if isinstance(ast_node, str):  # Variable reference
            if ast_node in param_context:
                return param_context[ast_node], errors
            else:
                errors.append({
                    "type": "undefined_variable",
                    "variable": ast_node,
                    "message": f"Variable '{ast_node}' not found in context"
                })
                return None, errors
        
        if isinstance(ast_node, dict):
            op_type = ast_node["type"]
            
            if op_type in self.operation_rules:
                return self.operation_rules[op_type](ast_node, param_context, errors)
            else:
                errors.append({
                    "type": "unsupported_operation",
                    "operation": op_type,
                    "message": f"Unit validation not implemented for operation: {op_type}"
                })
                return None, errors
        
        return None, errors
    
    def _validate_add_subtract(self, node: Dict, context: Dict[str, str], errors: List) -> Tuple[Optional[str], List]:
        """Addition and subtraction require same units"""
        left_unit, left_errors = self.validate_formula_units(node["left"], context)
        right_unit, right_errors = self.validate_formula_units(node["right"], context)
        
        errors.extend(left_errors + right_errors)
        
        if left_unit and right_unit:
            left_type, _ = self.registry.parse_unit(left_unit)
            right_type, _ = self.registry.parse_unit(right_unit)
            
            if left_type != right_type:
                errors.append({
                    "type": "incompatible_units_arithmetic",
                    "operation": node["type"],
                    "left_unit": left_unit,
                    "right_unit": right_unit,
                    "message": f"Cannot {node['type'].lower()} {left_unit} and {right_unit} - incompatible units"
                })
                return None, errors
            
            return left_unit, errors  # Result has same unit as operands
        
        return left_unit or right_unit, errors
    
    def _validate_multiply(self, node: Dict, context: Dict[str, str], errors: List) -> Tuple[Optional[str], List]:
        """Multiplication combines units"""
        left_unit, left_errors = self.validate_formula_units(node["left"], context)
        right_unit, right_errors = self.validate_formula_units(node["right"], context)
        
        errors.extend(left_errors + right_errors)
        
        if not left_unit or not right_unit:
            return left_unit or right_unit, errors
        
        # Handle dimensionless multiplication
        if left_unit == "dimensionless" or left_unit == "":
            return right_unit, errors
        if right_unit == "dimensionless" or right_unit == "":
            return left_unit, errors
        
        # Combine units (simplified - you'd want more sophisticated logic)
        result_unit = f"{left_unit}*{right_unit}"
        
        # Check for known combinations
        known_combinations = {
            ("MW", "hours"): "MWh",
            ("kW", "hours"): "kWh", 
            ("USD/kWh", "kWh"): "USD",
            ("USD/year", "years"): "USD",
        }
        
        combo_key = (left_unit, right_unit)
        if combo_key in known_combinations:
            result_unit = known_combinations[combo_key]
        elif (right_unit, left_unit) in known_combinations:
            result_unit = known_combinations[(right_unit, left_unit)]
        
        return result_unit, errors
    
    def _validate_divide(self, node: Dict, context: Dict[str, str], errors: List) -> Tuple[Optional[str], List]:
        """Division creates ratios or cancels units"""
        left_unit, left_errors = self.validate_formula_units(node["left"], context)
        right_unit, right_errors = self.validate_formula_units(node["right"], context)
        
        errors.extend(left_errors + right_errors)
        
        if not left_unit or not right_unit:
            return left_unit, errors
        
        # Same units cancel out
        if left_unit == right_unit:
            return "dimensionless", errors
        
        # Handle dimensionless division
        if right_unit == "dimensionless" or right_unit == "":
            return left_unit, errors
        
        # Create rate unit
        result_unit = f"{left_unit}/{right_unit}"
        
        return result_unit, errors
    
    def _validate_power(self, node: Dict, context: Dict[str, str], errors: List) -> Tuple[Optional[str], List]:
        """Power operations - exponent should be dimensionless"""
        base_unit, base_errors = self.validate_formula_units(node["left"], context)
        exp_unit, exp_errors = self.validate_formula_units(node["right"], context)
        
        errors.extend(base_errors + exp_errors)
        
        # Exponent should be dimensionless
        if exp_unit and exp_unit not in ["dimensionless", ""]:
            errors.append({
                "type": "invalid_exponent_unit",
                "exponent_unit": exp_unit,
                "message": f"Exponent must be dimensionless, got {exp_unit}"
            })
        
        # For now, assume power operations result in complex units
        if base_unit:
            return f"{base_unit}^n", errors
        
        return None, errors


class ParameterUnitValidator:
    """Main validator that integrates with the Parameter system"""
    
    def __init__(self):
        self.validator = UnitValidator()
    
    def validate_all_parameters(self, parameters: List, inputs: Dict[str, float]) -> Dict[str, Any]:
        """Validate units for all parameters - both inputs and calculations"""
        
        validation_results = {
            "input_validation": {},
            "calculation_validation": {},
            "has_errors": False
        }
        
        # Create parameter context (name -> unit mapping)
        param_context = {}
        param_map = {p.name: p for p in parameters}
        
        # Validate user inputs first
        for param_name, input_value in inputs.items():
            param = param_map.get(param_name)
            if param and param.type == "USER":
                param_context[param_name] = param.unit
                
                error = self.validator.validate_input_value(param_name, input_value, param.unit)
                if error:
                    validation_results["input_validation"][param_name] = [error]
                    validation_results["has_errors"] = True
        
        # Add other parameter units to context
        for param in parameters:
            if param.type in ["COMPANY", "GLOBAL"]:
                param_context[param.name] = param.unit
        
        # Validate calculation formulas
        for param in parameters:
            if param.type == "CALCULATION" and param.formula:
                # Parse formula and validate units
                try:
                    from .parser import FormulaParser
                    parser = FormulaParser()
                    ast_node, _ = parser.parse_formula_to_ast(param.formula)
                    
                    result_unit, unit_errors = self.validator.validate_formula_units(ast_node, param_context)
                    
                    if unit_errors:
                        validation_results["calculation_validation"][param.name] = unit_errors
                        validation_results["has_errors"] = True
                    
                    # Check if calculated unit matches expected unit
                    if result_unit and param.unit and result_unit != param.unit:
                        mismatch_error = {
                            "type": "unit_mismatch",
                            "expected_unit": param.unit,
                            "calculated_unit": result_unit,
                            "message": f"Formula produces {result_unit} but parameter expects {param.unit}"
                        }
                        
                        if param.name not in validation_results["calculation_validation"]:
                            validation_results["calculation_validation"][param.name] = []
                        validation_results["calculation_validation"][param.name].append(mismatch_error)
                        validation_results["has_errors"] = True
                    
                    # Update context with calculated unit for downstream calculations
                    if result_unit:
                        param_context[param.name] = result_unit
                        
                except Exception as e:
                    validation_results["calculation_validation"][param.name] = [{
                        "type": "formula_parse_error",
                        "message": f"Could not parse formula for unit validation: {str(e)}"
                    }]
                    validation_results["has_errors"] = True
        
        return validation_results


# Integration with existing Calculator class
def extend_calculator_with_units():
    """Example of how to integrate this with your existing Calculator"""
    
    class EnhancedCalculator:
        def __init__(self, parameters, inputs):
            # ... existing Calculator init ...
            self.unit_validator = ParameterUnitValidator()
        
        def evaluate_with_unit_validation(self, target: str) -> Dict[str, Any]:
            # Validate units first
            unit_validation = self.unit_validator.validate_all_parameters(
                self.parameters, self.inputs
            )
            
            # If there are critical unit errors, you might want to stop here
            if unit_validation["has_errors"]:
                # You can decide whether to proceed or halt calculation
                pass
            
            # Do normal calculation
            result = self.evaluate(target)
            
            # Add unit validation to response
            result["unit_validation"] = unit_validation
            
            return result