import pytest
from app.services.calculations.main import (
    update_inputs,
    calculate,
    percentage_of_utilisation,
    planned_years_of_operation,
    project_location,
    data_hall_design_capacity_mw,
    first_year_of_operation,
    annualised_air_ppue
)

@pytest.fixture
def reset_inputs():
    """Reset all input dictionaries to their default state before each test"""
    percentage_of_utilisation['%_of_utilisation'] = None
    planned_years_of_operation['planned_years_of_operation'] = None
    project_location['project_location'] = None
    data_hall_design_capacity_mw['data_hall_design_capacity_mw'] = None
    first_year_of_operation['first_year_of_operation'] = None
    annualised_air_ppue['annualised_air_ppue'] = None
    yield

@pytest.mark.parametrize("inputs,expected_result", [
    ({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States'
    }, {
        'cooling_equipment_capex': 3849000.0,
        'total_capex': 3849000.0
    }),
    ({
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'project_location': 'Singapore'
    }, {
        'cooling_equipment_capex': 7195080.0,
        'total_capex': 7195080.0
    }),
    ({
        'data_hall_design_capacity_mw': 0.5,
        'first_year_of_operation': 2025,
        'project_location': 'United Kingdom'
    }, {
        'cooling_equipment_capex': 2575040.0,
        'total_capex': 2575040.0
    }),
    ({
        'data_hall_design_capacity_mw': 1.5,
        'first_year_of_operation': 2030,
        'project_location': 'United Arab Emirates'
    }, {
        'cooling_equipment_capex': 5921925.0,  # 3433 * 1500 * 1.15
        'total_capex': 5921925.0
    }),
])
def test_update_inputs_and_calculate(reset_inputs, inputs, expected_result):
    update_inputs(inputs)
    result = calculate()
    
    assert result['cooling_equipment_capex'] == expected_result['cooling_equipment_capex']
    assert result['total_capex'] == expected_result['total_capex']

def test_update_inputs_individual_fields(reset_inputs):
    test_inputs = {
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'project_location': 'United States'
    }
    
    update_inputs(test_inputs)
    
    assert data_hall_design_capacity_mw['data_hall_design_capacity_mw'] == 2.0
    assert first_year_of_operation['first_year_of_operation'] == 2024
    assert project_location['project_location'] == 'United States'

def test_calculate_structure(reset_inputs):
    update_inputs({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States'
    })
    
    result = calculate()
    
    assert isinstance(result, dict)
    assert 'cooling_equipment_capex' in result
    assert 'total_capex' in result
    assert isinstance(result['cooling_equipment_capex'], (int, float))
    assert isinstance(result['total_capex'], (int, float))

def test_update_inputs_unused_fields(reset_inputs):
    test_inputs = {
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'planned_years_of_operation': 10,
        'annualised_air_ppue': 1.5
    }
    
    update_inputs(test_inputs)
    
    # Check that all fields are updated correctly
    assert data_hall_design_capacity_mw['data_hall_design_capacity_mw'] == 1.0
    assert first_year_of_operation['first_year_of_operation'] == 2023
    assert project_location['project_location'] == 'United States'
    assert percentage_of_utilisation['%_of_utilisation'] == 0.8
    assert planned_years_of_operation['planned_years_of_operation'] == 10
    assert annualised_air_ppue['annualised_air_ppue'] == 1.5
