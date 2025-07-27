#!/usr/bin/env python3
"""
Test script for enhanced exponential function in the calculation engine
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.calculation.parameter import Parameter

def test_exponential_function():
    """Test various exponential function scenarios"""
    
    print("🧪 Testing Enhanced Exponential Function")
    print("=" * 60)
    
    # Test cases with expected results
    test_cases = [
        # Basic exponential (backward compatibility)
        {
            "name": "exp(0) - basic",
            "formula": "exp(0)",
            "expected": 1.0,
            "context": {}
        },
        {
            "name": "exp(1) - basic",
            "formula": "exp(1)",
            "expected": 2.718,
            "context": {}
        },
        # Growth rate scenarios
        {
            "name": "exp(0.05, 1, 'years') - 5% annual growth",
            "formula": "exp(0.05, 1, 'years')",
            "expected": 1.051,
            "context": {}
        },
        {
            "name": "exp(0.10, 2, 'years') - 10% growth over 2 years",
            "formula": "exp(0.10, 2, 'years')",
            "expected": 1.221,
            "context": {}
        },
        {
            "name": "exp(0.05, 6, 'months') - 5% growth over 6 months",
            "formula": "exp(0.05, 6, 'months')",
            "expected": 1.025,
            "context": {}
        },
        {
            "name": "exp(0.20, 1, 'years') - 20% annual growth",
            "formula": "exp(0.20, 1, 'years')",
            "expected": 1.221,
            "context": {}
        },
        # With variables
        {
            "name": "exp(growth_rate, time_period, 'years')",
            "formula": "exp(growth_rate, time_period, 'years')",
            "expected": 1.105,  # exp(0.05, 2, 'years')
            "context": {"growth_rate": 0.05, "time_period": 2}
        },
        {
            "name": "exp(rate, months, 'months')",
            "formula": "exp(rate, months, 'months')",
            "expected": 1.025,  # exp(0.05, 6, 'months')
            "context": {"rate": 0.05, "months": 6}
        }
    ]
    
    passed = 0
    failed = 0
    
    for test in test_cases:
        try:
            # Create parameter with formula
            param_data = {
                "name": "test_param",
                "type": "CALCULATION",
                "formula": test["formula"]
            }
            
            param = Parameter(param_data)
            
            # Evaluate with context
            result = param.evaluate_formula(test["context"])
            
            # Check if result is close to expected (allow small floating point differences)
            if abs(result - test["expected"]) < 0.01:
                print(f"✅ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
                passed += 1
            else:
                print(f"❌ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
                failed += 1
                
        except Exception as e:
            print(f"❌ {test['name']}: ERROR - {str(e)}")
            failed += 1
    
    # Test time unit conversions
    print("\n🧪 Testing Time Unit Conversions")
    print("-" * 40)
    
    time_tests = [
        {
            "name": "exp(0.05, 12, 'months') - should equal exp(0.05, 1, 'years')",
            "formula": "exp(0.05, 12, 'months')",
            "expected": 1.051,
            "context": {}
        },
        {
            "name": "exp(0.05, 52, 'weeks') - should equal exp(0.05, 1, 'years')",
            "formula": "exp(0.05, 52, 'weeks')",
            "expected": 1.051,
            "context": {}
        },
        {
            "name": "exp(0.05, 365, 'days') - should equal exp(0.05, 1, 'years')",
            "formula": "exp(0.05, 365, 'days')",
            "expected": 1.051,
            "context": {}
        }
    ]
    
    for test in time_tests:
        try:
            param_data = {
                "name": "test_param",
                "type": "CALCULATION",
                "formula": test["formula"]
            }
            
            param = Parameter(param_data)
            result = param.evaluate_formula(test["context"])
            
            if abs(result - test["expected"]) < 0.01:
                print(f"✅ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
                passed += 1
            else:
                print(f"❌ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
                failed += 1
                
        except Exception as e:
            print(f"❌ {test['name']}: ERROR - {str(e)}")
            failed += 1
    
    # Test error cases
    print("\n🧪 Testing Error Cases")
    print("-" * 30)
    
    error_cases = [
        {
            "name": "exp() - no arguments",
            "formula": "exp()",
            "expected_error": "Function 'exp' expects 1, 2, or 3 arguments"
        },
        {
            "name": "exp(1, 2, 3, 4) - too many arguments",
            "formula": "exp(1, 2, 3, 4)",
            "expected_error": "Function 'exp' expects 1, 2, or 3 arguments"
        },
        {
            "name": "exp(0.05, 1, 'invalid') - invalid time unit",
            "formula": "exp(0.05, 1, 'invalid')",
            "expected_error": "Invalid time unit"
        }
    ]
    
    for test in error_cases:
        try:
            param_data = {
                "name": "test_param",
                "type": "CALCULATION",
                "formula": test["formula"]
            }
            
            param = Parameter(param_data)
            result = param.evaluate_formula({})
            print(f"❌ {test['name']}: Should have failed but returned {result}")
            failed += 1
            
        except ValueError as e:
            if test["expected_error"] in str(e):
                print(f"✅ {test['name']}: Correctly caught error - {str(e)}")
                passed += 1
            else:
                print(f"❌ {test['name']}: Wrong error message - {str(e)}")
                failed += 1
        except Exception as e:
            print(f"❌ {test['name']}: Unexpected error - {str(e)}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed! Enhanced exponential function is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the implementation.")
    
    return failed == 0

if __name__ == "__main__":
    test_exponential_function() 