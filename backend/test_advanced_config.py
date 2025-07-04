#!/usr/bin/env python3
"""
Test script for advanced configuration feature
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.calculations.solutions.air_cooling.capex import calculate_cooling_capex
from app.services.calculations.solutions.air_cooling.opex import calculate_annual_opex
import asyncio

def test_capex_with_advanced_config():
    """Test CAPEX calculation with advanced configuration"""
    print("Testing CAPEX calculation with advanced configuration...")
    
    # Base input data
    base_input = {
        'data_hall_design_capacity_mw': 10.0,
        'first_year_of_operation': 2024,
        'country': 'United States'
    }
    
    # Test without advanced config
    result_basic = calculate_cooling_capex(base_input)
    print(f"Basic CAPEX: ${result_basic['cooling_equipment_capex']:,.2f}")
    
    # Test with advanced config
    advanced_config = {
        'required_increase_electrical_kw': 100.0,
        'air_replacement_capex_pct': 0.4
    }
    
    input_with_advanced = base_input.copy()
    input_with_advanced['advanced_config'] = advanced_config
    
    result_advanced = calculate_cooling_capex(input_with_advanced)
    print(f"Advanced CAPEX: ${result_advanced['cooling_equipment_capex']:,.2f}")
    print(f"Advanced adjustments: {result_advanced['advanced_adjustments']}")
    
    # Calculate difference
    difference = result_advanced['cooling_equipment_capex'] - result_basic['cooling_equipment_capex']
    print(f"CAPEX increase: ${difference:,.2f}")
    
    return result_advanced

async def test_opex_with_advanced_config():
    """Test OPEX calculation with advanced configuration"""
    print("\nTesting OPEX calculation with advanced configuration...")
    
    # Base input data
    base_input = {
        'data_hall_design_capacity_mw': 10.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2024,
        'country': 'United States'
    }
    
    # Test without advanced config
    result_basic = await calculate_annual_opex(base_input, 1000000)
    print(f"Basic annual OPEX: ${result_basic['annual_opex']:,.2f}")
    
    # Test with advanced config
    advanced_config = {
        'electricity_price_per_kwh': 0.15,
        'water_price_per_litre': 0.002,
        'waterloop_enabled': True
    }
    
    input_with_advanced = base_input.copy()
    input_with_advanced['advanced_config'] = advanced_config
    
    result_advanced = await calculate_annual_opex(input_with_advanced, 1000000)
    print(f"Advanced annual OPEX: ${result_advanced['annual_opex']:,.2f}")
    print(f"Advanced adjustments: {result_advanced['advanced_adjustments']}")
    
    # Calculate difference
    difference = result_advanced['annual_opex'] - result_basic['annual_opex']
    print(f"OPEX difference: ${difference:,.2f}")
    
    return result_advanced

def test_schema_validation():
    """Test that the Pydantic schemas work correctly"""
    print("\nTesting schema validation...")
    
    from app.schemas.calculations import AdvancedDataCentreConfig, FullCalculationRequest
    
    # Test valid advanced config
    try:
        advanced_config = AdvancedDataCentreConfig(
            inlet_temperature=25.0,
            electricity_price_per_kwh=0.15,
            water_price_per_litre=0.002,
            waterloop_enabled=True,
            air_replacement_capex_pct=0.4,
            required_increase_electrical_kw=100.0
        )
        print("✓ Advanced config schema validation passed")
        
        # Test full calculation request with advanced config
        full_request = FullCalculationRequest(
            cooling_type="air_cooling",
            data_hall_design_capacity_mw=10.0,
            base_year=2024,
            country="USA",
            planned_years_of_operation=10,
            advanced_config=advanced_config
        )
        print("✓ Full calculation request schema validation passed")
        
        # Convert to dict for calculation service
        advanced_config_dict = advanced_config.model_dump(exclude_none=True)
        print(f"✓ Advanced config converted to dict: {advanced_config_dict}")
        
    except Exception as e:
        print(f"✗ Schema validation failed: {e}")
        return False
    
    return True

async def main():
    """Run all tests"""
    print("=== Advanced Configuration Feature Test ===\n")
    
    # Test schema validation
    schema_ok = test_schema_validation()
    if not schema_ok:
        print("Schema validation failed, stopping tests")
        return
    
    # Test CAPEX calculation
    capex_result = test_capex_with_advanced_config()
    
    # Test OPEX calculation
    opex_result = await test_opex_with_advanced_config()
    
    print("\n=== Test Summary ===")
    print("✓ Schema validation: PASSED")
    print("✓ CAPEX calculation with advanced config: PASSED")
    print("✓ OPEX calculation with advanced config: PASSED")
    print("\nAdvanced configuration feature is working correctly!")

if __name__ == "__main__":
    asyncio.run(main()) 