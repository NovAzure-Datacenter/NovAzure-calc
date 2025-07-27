#!/usr/bin/env python3
"""
Test script to verify ln function works after simplification
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.calculation.parameter import Parameter
import math

def test_ln_function():
    """Test that ln function works correctly"""
    
    print("🧪 Testing Simplified ln Function")
    print("=" * 40)
    
    # Test cases
    test_cases = [
        {"name": "ln(1)", "formula": "ln(1)", "expected": 0.0},
        {"name": "ln(2.718)", "formula": "ln(2.718)", "expected": 1.0},
        {"name": "ln(10)", "formula": "ln(10)", "expected": 2.303},
        {"name": "ln(x)", "formula": "ln(x)", "expected": 1.0, "context": {"x": 2.718}},
    ]
    
    passed = 0
    failed = 0
    
    for test in test_cases:
        try:
            param = Parameter({
                "name": "test",
                "type": "CALCULATION",
                "formula": test["formula"]
            })
            
            context = test.get("context", {})
            result = param.evaluate_formula(context)
            
            if abs(result - test["expected"]) < 0.01:
                print(f"✅ {test['name']}: {result:.3f}")
                passed += 1
            else:
                print(f"❌ {test['name']}: {result:.3f} (expected: {test['expected']:.3f})")
                failed += 1
                
        except Exception as e:
            print(f"❌ {test['name']}: ERROR - {e}")
            failed += 1
    
    # Test error cases
    print("\n🧪 Testing Error Cases")
    print("-" * 25)
    
    error_cases = [
        {"name": "ln(0)", "formula": "ln(0)", "expected_error": "Logarithm of non-positive number"},
        {"name": "ln(-1)", "formula": "ln(-1)", "expected_error": "Logarithm of non-positive number"},
    ]
    
    for test in error_cases:
        try:
            param = Parameter({
                "name": "test",
                "type": "CALCULATION",
                "formula": test["formula"]
            })
            result = param.evaluate_formula({})
            print(f"❌ {test['name']}: Should have failed but returned {result}")
            failed += 1
            
        except ValueError as e:
            if test["expected_error"] in str(e):
                print(f"✅ {test['name']}: Correctly caught error")
                passed += 1
            else:
                print(f"❌ {test['name']}: Wrong error message - {str(e)}")
                failed += 1
    
    print(f"\n📊 Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 ln function works correctly after simplification!")
    else:
        print("⚠️  Some tests failed.")
    
    return failed == 0

if __name__ == "__main__":
    test_ln_function() 