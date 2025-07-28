import pytest
from app.core.calculation.calculator import Calculator
from app.core.calculation.parameter import Parameter


class TestCalculator:
    def test_simple_calculation(self):
        parameter_dicts = [
            {"name": "base", "type": "INPUT"},
            {"name": "rate", "type": "INPUT"},
            {"name": "result", "type": "CALCULATION", "formula": "base*rate"},
        ]

        parameters = [Parameter(param) for param in parameter_dicts]

        inputs = {"base": 100, "rate": 0.2}
        calculator = Calculator(parameters, inputs)

        result = calculator.evaluate(["result"])
        assert result["result"] == [20.0]

    def test_parameter_types(self):
        """Tests if all parameter types will work together"""

        parameter_dicts = [
            {"name": "global_rate", "type": "GLOBAL", "value": 0.05},
            {"name": "company_factor", "type": "COMPANY", "value": 1.5},
            {"name": "user_amount", "type": "INPUT"},
            {
                "name": "result",
                "type": "CALCULATION",
                "formula": "user_amount*global_rate * company_factor",
            },
        ]

        parameters = [Parameter(param) for param in parameter_dicts]
        inputs = {"user_amount": 1000.0}
        calculator = Calculator(parameters, inputs)

        result = calculator.evaluate(["result"])
        assert result["result"] == [75.0]

    def test_dependency_chain(self):
        """Nested calculations and more complex formulas"""
        parameter_dicts = [
            {
                "name": "level1_1",
                "type": "INPUT",
            },
            {
                "name": "level1_2",
                "type": "INPUT",
            },
            {
                "name": "level2",
                "type": "CALCULATION",
                "formula": "(level1_2 / level1_1)*10",
            },
            {
                "name": "level3",
                "type": "CALCULATION",
                "formula": "(level2+level1_2)/(level1_1+level1_2)-5",
            },
            {
                "name": "level4",
                "type": "CALCULATION",
                "formula": "level3 * level2 - (level1_1 + level1_2)",
            },
            {
                "name": "result",
                "type": "CALCULATION",
                "formula": "level4 / 2 + (level3 * level1_1)**2",
            },
        ]

        parameters = [Parameter(param) for param in parameter_dicts]
        inputs = {"level1_1": 2, "level1_2": 10.0}
        calculator = Calculator(parameters, inputs)

        result = calculator.evaluate(["result"])
        assert result["result"] == [-6.0]

    def test_multiple_targets(self):
        """Test calculating multiple targets at once"""
        parameter_dicts = [
            {"name": "x", "type": "INPUT"},
            {"name": "y", "type": "INPUT"},
            {"name": "sum", "type": "CALCULATION", "formula": "x + y"},
            {"name": "product", "type": "CALCULATION", "formula": "x * y"},
            {"name": "ratio", "type": "CALCULATION", "formula": "x / y"},
        ]

        parameters = [Parameter(param) for param in parameter_dicts]
        inputs = {"x": 12.0, "y": 4.0}
        calculator = Calculator(parameters, inputs)

        result = calculator.evaluate(["sum", "product", "ratio"])
        assert result["result"] == [16.0, 48.0, 3.0]

    def test_error_handling(self):
        # Test undefined Parameter dependency
        parameter_dicts = [
            {"name": "misspelled", "type": "INPUT"},
            {"name": "result", "type": "CALCULATION", "formula": "missing * 2"},
        ]

        parameters = [Parameter(param) for param in parameter_dicts]
        input = {"misspelled": 1.0}
        calculator = Calculator(parameters, input)

        with pytest.raises(
            ValueError,
            match="Parameter result depends on undefined parameter 'missing'",
        ):
            calculator.evaluate(["result"])

        # Test missing dependency
        parameter_dicts = [
            {"name": "result", "type": "CALCULATION", "formula": "missing * 2"}
        ]

        parameters = [Parameter(param) for param in parameter_dicts]
        calculator = Calculator(parameters, {})

        with pytest.raises(
            ValueError,
            match="Parameter result depends on undefined parameter 'missing'",
        ):
            calculator.evaluate(["result"])

        # Test cyclic dependency
        parameter_dicts = [
            {"name": "a", "type": "CALCULATION", "formula": "b + 1.0"},
            {"name": "b", "type": "CALCULATION", "formula": "a + 1.0"},
        ]

        parameters = [Parameter(param) for param in parameter_dicts]
        calculator = Calculator(parameters, {})

        with pytest.raises(ValueError, match="Cycle detected"):
            calculator.evaluate(["a"])

        # Test missing target
        parameter_dicts = [
            {"name": "valid", "type": "INPUT"},
        ]

        parameters = [Parameter(param) for param in parameter_dicts]
        calculator = Calculator(parameters, {"valid": 5.0})

        with pytest.raises(ValueError, match="Target 'missing_target' was not resolved"):
            calculator.evaluate(["missing_target"])

        # Test invalid parameter definition
        with pytest.raises(
            ValueError, match="GLOBAL parameter 'invalid' requires value"
        ):
            Parameter({"name": "invalid", "type": "GLOBAL"})  # Missing value

        with pytest.raises(
            ValueError, match="CALCULATION parameter 'invalid' requires formula"
        ):
            Parameter({"name": "invalid", "type": "CALCULATION"})  # Missing formula
