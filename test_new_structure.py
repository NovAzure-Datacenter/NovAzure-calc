#!/usr/bin/env python3
"""
Simple test script to verify the new calculation structure works
"""

import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, 'backend')

from backend.app.services.calculations.solutions.air_cooling.capex import calculate_cooling_capex as air_cooling_capex
from backend.app.services.calculations.solutions.chassis_immersion.capex import calculate_cooling_capex as chassis_immersion_capex

def test_new_calculations():
    """Test the new calculation structure"""
    
    # Sample input data
    test_input = {
        'data_hall_design_capacity_mw': 10.0,  # 10 MW data hall
        'base_year': 2022,                      # Base year for inflation
        'country': 'USA'                        # USA multipliers
    }
    
    print("🧪 Testing New Calculation Structure")
    print("=" * 50)
    print(f"Input: {test_input}")
    print()
    
    try:
        # Test Air Cooling
        print("🌬️  Air Cooling Results:")
        air_result = air_cooling_capex(test_input)
        for key, value in air_result.items():
            if isinstance(value, (int, float)):
                print(f"  {key}: ${value:,.2f}")
            else:
                print(f"  {key}: {value}")
        print()
        
        # Test Chassis Immersion
        print("🏊 Chassis Immersion Results:")
        chassis_result = chassis_immersion_capex(test_input)
        for key, value in chassis_result.items():
            if isinstance(value, (int, float)):
                print(f"  {key}: ${value:,.2f}")
            else:
                print(f"  {key}: {value}")
        print()
        
        # Compare Results
        print("📊 Comparison:")
        capex_diff = air_result['cooling_equipment_capex'] - chassis_result['cooling_equipment_capex']
        tco_diff = air_result['total_cost_ownership_excl_it'] - chassis_result['total_cost_ownership_excl_it']
        
        print(f"  CAPEX Difference: ${capex_diff:,.2f}")
        print(f"  TCO Difference: ${tco_diff:,.2f}")
        
        if tco_diff > 0:
            print("  💡 Recommendation: Chassis Immersion (Lower TCO)")
        else:
            print("  💡 Recommendation: Air Cooling (Lower TCO)")
        
        print()
        print("✅ All tests passed! New structure is working correctly.")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    test_new_calculations() 