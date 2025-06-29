import pytest
from app.services.calculations.solutions.air_cooling.capex import (
    calculate_cooling_equipment_capex,
    calculate_cooling_capex
)

@pytest.mark.parametrize("country,base_year,capacity_mw,expected_capex", [
    ("United States", 2023, 1.0, 3849000.0),  # 3849 * 1000 * 1.0
    ("Singapore", 2023, 1.0, 3527000.0),  # 3527 * 1000 * 1.0
    ("United Kingdom", 2023, 1.0, 4952000.0),  # 4952 * 1000 * 1.0
    ("United Arab Emirates", 2023, 1.0, 3433000.0),  # 3433 * 1000 * 1.0
    ("United States", 2024, 1.0, 3925980.0),  # 3849 * 1000 * 1.02
    ("United States", 2025, 1.0, 4002960.0),  # 3849 * 1000 * 1.04
    ("United States", 2030, 1.0, 4426350.0), 
])
def test_calculate_cooling_equipment_capex(country, base_year, capacity_mw, expected_capex):
    result = calculate_cooling_equipment_capex(base_year, capacity_mw, country)
    assert result == expected_capex

@pytest.mark.parametrize("input_data,expected_equipment_capex", [
    ({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }, 3849000.0),
    ({
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'country': 'Singapore'
    }, 7195080.0),  # 3527 * 2000 * 1.02
    ({
        'data_hall_design_capacity_mw': 0.5,
        'first_year_of_operation': 2025,
        'country': 'United Kingdom'
    }, 2575040.0),  # 4952 * 500 * 1.04
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