import pytest
from app.services.calculations.solutions.chassis_immersion.capex import (
    calculate_chassis_solution_capex_with_markup,
    calculate_cooling_capex,
    calculate_it_capex
)

@pytest.mark.parametrize("country,base_year,capacity_mw,expected_capex", [
    ("United States", 2023, 1.0, 4985865),
    ("Singapore", 2023, 1.0, 5116064),  
    ("United Kingdom", 2023, 1.0, 4977159), 
    ("United Arab Emirates", 2023, 1.0, 5035388),  
    ("United States", 2024, 1.0, 5079582),  
    ("United States", 2025, 1.0, 5173299),  
    ("United States", 2030, 1.0, 5688744), 
])
def test_calculate_chassis_solution_capex_with_markup(country, base_year, capacity_mw, expected_capex):
    result = calculate_chassis_solution_capex_with_markup(base_year, capacity_mw, country)
    assert result == expected_capex

@pytest.mark.parametrize("input_data,expected_cooling_capex,expected_it_capex", [
    ({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }, 4985865, 0),  # No IT cost
    ({
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'country': 'Singapore'
    }, 10108366, 0),  # No IT cost
    ({
        'data_hall_design_capacity_mw': 0.5,
        'first_year_of_operation': 2025,
        'country': 'United Kingdom'
    }, 2731028, 0),  # No IT cost
])
def test_calculate_cooling_capex_without_it(input_data, expected_cooling_capex, expected_it_capex):
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == expected_cooling_capex
    assert result['it_equipment_capex'] == expected_it_capex
    assert result['total_capex'] == expected_cooling_capex + expected_it_capex
    assert len(result) == 3

@pytest.mark.parametrize("input_data", [
    ({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'country': 'United States',
        'include_it_cost': 'Yes',
        'data_center_type': 'General Purpose',
        'air_rack_cooling_capacity_kw_per_rack': 16,
        'planned_years_of_operation': 10
    }),
    ({
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'country': 'Singapore',
        'include_it_cost': 'Yes',
        'data_center_type': 'HPC/AI',
        'air_rack_cooling_capacity_kw_per_rack': 20,
        'planned_years_of_operation': 15
    })
])
def test_calculate_cooling_capex_with_it(input_data):
    result = calculate_cooling_capex(input_data)
    
    assert 'cooling_equipment_capex' in result
    assert 'it_equipment_capex' in result
    assert 'total_capex' in result
    
    # IT equipment CAPEX should be greater than 0 when included
    assert result['it_equipment_capex'] > 0
    assert result['total_capex'] == result['cooling_equipment_capex'] + result['it_equipment_capex']
    assert result['total_capex'] > result['cooling_equipment_capex']

def test_calculate_it_capex():
    it_result = calculate_it_capex(
        data_hall_capacity_mw=1.0,
        data_center_type='General Purpose',
        air_rack_cooling_capacity_kw_per_rack=16,
        planned_years=10
    )
    
    assert isinstance(it_result, int)
    assert it_result > 0

def test_calculate_it_capex_no_inputs():
    it_result = calculate_it_capex(
        data_hall_capacity_mw=None,
        data_center_type=None,
        air_rack_cooling_capacity_kw_per_rack=None,
        planned_years=None
    )
    
    assert it_result == 0

def test_calculate_cooling_capex_structure():
    input_data = {
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }
    result = calculate_cooling_capex(input_data)
    
    assert isinstance(result, dict)
    assert 'cooling_equipment_capex' in result
    assert 'it_equipment_capex' in result
    assert 'total_capex' in result
    assert isinstance(result['cooling_equipment_capex'], (int, float))
    assert isinstance(result['it_equipment_capex'], (int, float))
    assert isinstance(result['total_capex'], (int, float))

def test_hpc_ai_vs_general_purpose():
    base_input = {
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'country': 'United States',
        'include_it_cost': 'Yes',
        'air_rack_cooling_capacity_kw_per_rack': 16,
        'planned_years_of_operation': 10
    }
    
    # Test General Purpose
    gp_input = {**base_input, 'data_center_type': 'General Purpose'}
    gp_result = calculate_cooling_capex(gp_input)
    
    # Test HPC/AI
    hpc_input = {**base_input, 'data_center_type': 'HPC/AI'}
    hpc_result = calculate_cooling_capex(hpc_input)
    
    # HPC/AI should have higher IT costs
    assert hpc_result['it_equipment_capex'] > gp_result['it_equipment_capex']
    assert hpc_result['total_capex'] > gp_result['total_capex']
    
    # Cooling equipment CAPEX should be the same
    assert hpc_result['cooling_equipment_capex'] == gp_result['cooling_equipment_capex']
