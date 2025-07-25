#!/usr/bin/env python3
"""
Test script for logarithmic functions in the calculation engine
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.calculation.parameter import Parameter
from app.core.calculation.calculator import Calculator

def test_logarithmic_functions():
    """Test various logarithmic functions"""
    
    print("🧪 Testing Logarithmic Functions")
    print("=" * 50)
    
    # Test cases with expected results
    test_cases = [
        {
            "name": "log(100, 10)",
            "formula": "log(100, 10)",
            "expected": 2.0,
            "context": {}
        },
        {
            "name": "log(100, 2)",
            "formula": "log(100, 2)",
            "expected": 6.644,
            "context": {}
        },
        {
            "name": "ln(2.718)",
            "formula": "ln(2.718)",
            "expected": 1.0,
            "context": {}
        },
        {
            "name": "ln(x)",
            "formula": "ln(x)",
            "expected": 2.303,  # ln(10)
            "context": {"x": 10}
        },
        {
            "name": "log(x, y)",
            "formula": "log(x, y)",
            "expected": 2.0,  # log(100, 10)
            "context": {"x": 100, "y": 10}
        },
        {
            "name": "log(x + 1, 2)",
            "formula": "log(x + 1, 2)",
            "expected": 3.322,  # log(10, 2)
            "context": {"x": 9}
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
    
    print("\n" + "=" * 50)
    print(f"📊 Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed! Logarithmic functions are working correctly.")
    else:
        print("⚠️  Some tests failed. Check the implementation.")
    
    return failed == 0

def test_error_cases():
    """Test error handling"""
    
    print("\n🧪 Testing Error Cases")
    print("=" * 50)
    
    error_cases = [
        {
            "name": "log(x) - missing base",
            "formula": "log(x)",
            "context": {"x": 100}
        },
        {
            "name": "log(x, y, z) - too many args",
            "formula": "log(x, y, z)",
            "context": {"x": 100, "y": 10, "z": 5}
        },
        {
            "name": "unknown_function(x)",
            "formula": "unknown_function(x)",
            "context": {"x": 100}
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
            result = param.evaluate_formula(test["context"])
            print(f"❌ {test['name']}: Should have failed but returned {result}")
            
        except Exception as e:
            print(f"✅ {test['name']}: Correctly failed with '{str(e)}'")

if __name__ == "__main__":
    print("🚀 Starting Logarithmic Function Tests")
    print("=" * 50)
    
    # Run tests
    success = test_logarithmic_functions()
    test_error_cases()
    
    if success:
        print("\n🎉 All logarithmic functions are working correctly!")
    else:
        print("\n⚠️  Some issues found. Please check the implementation.") 