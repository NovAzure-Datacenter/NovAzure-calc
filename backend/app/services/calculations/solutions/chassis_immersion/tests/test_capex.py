import pytest
from app.services.calculations.solutions.chassis_immersion.capex import (
    calculate_chassis_solution_capex_with_markup,
    calculate_cooling_capex
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

@pytest.mark.parametrize("input_data,expected_equipment_capex", [
    ({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }, 4985865),
    ({
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'country': 'Singapore'
    }, 10108366),  
    ({
        'data_hall_design_capacity_mw': 0.5,
        'first_year_of_operation': 2025,
        'country': 'United Kingdom'
    }, 2731028), 
])
def test_calculate_cooling_capex(input_data, expected_equipment_capex):
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == expected_equipment_capex
    assert result['total_capex'] == expected_equipment_capex
    assert len(result) == 2

def test_calculate_cooling_capex_structure():
    input_data = {
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }
    result = calculate_cooling_capex(input_data)
    
    assert isinstance(result, dict)
    assert 'cooling_equipment_capex' in result
    assert 'total_capex' in result
    assert isinstance(result['cooling_equipment_capex'], (int, float))
    assert isinstance(result['total_capex'], (int, float))
