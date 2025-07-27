#!/usr/bin/env python3
"""
Test script for the fixed exponential function
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.calculation.parameter import Parameter

def test_fixed_exponential():
    """Test the fixed exponential function"""
    
    print("🧪 Testing Fixed Exponential Function")
    print("=" * 50)
    
    # Test basic exponential (backward compatibility)
    print("\n📊 Testing Basic Exponential (Backward Compatibility)")
    print("-" * 50)
    
    basic_tests = [
        {"name": "exp(0)", "formula": "exp(0)", "expected": 1.0},
        {"name": "exp(1)", "formula": "exp(1)", "expected": 2.718},
        {"name": "exp(2)", "formula": "exp(2)", "expected": 7.389},
        {"name": "exp(-1)", "formula": "exp(-1)", "expected": 0.368},
    ]
    
    for test in basic_tests:
        try:
            param = Parameter({
                "name": "test",
                "type": "CALCULATION",
                "formula": test["formula"]
            })
            result = param.evaluate_formula({})
            if abs(result - test["expected"]) < 0.01:
                print(f"✅ {test['name']}: {result:.3f}")
            else:
                print(f"❌ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
        except Exception as e:
            print(f"❌ {test['name']}: ERROR - {e}")
    
    # Test growth modeling
    print("\n📈 Testing Growth Modeling")
    print("-" * 30)
    
    growth_tests = [
        {"name": "exp(0.05, 1, 'years')", "formula": "exp(0.05, 1, 'years')", "expected": 1.051},
        {"name": "exp(0.10, 2, 'years')", "formula": "exp(0.10, 2, 'years')", "expected": 1.221},
        {"name": "exp(0.05, 6, 'months')", "formula": "exp(0.05, 6, 'months')", "expected": 1.025},
    ]
    
    for test in growth_tests:
        try:
            param = Parameter({
                "name": "test",
                "type": "CALCULATION",
                "formula": test["formula"]
            })
            result = param.evaluate_formula({})
            if abs(result - test["expected"]) < 0.01:
                print(f"✅ {test['name']}: {result:.3f}")
            else:
                print(f"❌ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
        except Exception as e:
            print(f"❌ {test['name']}: ERROR - {e}")
    
    # Test time unit conversions
    print("\n⏰ Testing Time Unit Conversions")
    print("-" * 35)
    
    time_tests = [
        {"name": "exp(0.05, 12, 'months')", "formula": "exp(0.05, 12, 'months')", "expected": 1.051},
        {"name": "exp(0.05, 52, 'weeks')", "formula": "exp(0.05, 52, 'weeks')", "expected": 1.051},
        {"name": "exp(0.05, 365, 'days')", "formula": "exp(0.05, 365, 'days')", "expected": 1.051},
    ]
    
    for test in time_tests:
        try:
            param = Parameter({
                "name": "test",
                "type": "CALCULATION",
                "formula": test["formula"]
            })
            result = param.evaluate_formula({})
            if abs(result - test["expected"]) < 0.01:
                print(f"✅ {test['name']}: {result:.3f}")
            else:
                print(f"❌ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
        except Exception as e:
            print(f"❌ {test['name']}: ERROR - {e}")
    
    print("\n🎉 Test completed!")

if __name__ == "__main__":
    test_fixed_exponential() 