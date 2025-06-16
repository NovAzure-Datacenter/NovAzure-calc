import pytest
from unittest.mock import patch
from app.services.calculations.main import update_inputs, calculate, cooling_solution_inputs, cooling_capacity_inputs, cost_inclusion_inputs

@pytest.fixture
def reset_inputs():
    """Reset all input dictionaries to their default state after each test"""
    # Store original values
    original_cooling_solution = dict(cooling_solution_inputs)
    original_cooling_capacity = dict(cooling_capacity_inputs)
    original_cost_inclusion = dict(cost_inclusion_inputs)
    
    # Reset values before test
    cooling_solution_inputs.update({'cooling_type': None})
    cooling_capacity_inputs.update({'cooling_capacity_limit': None})
    cost_inclusion_inputs.update({'include_it_cost': None})
    
    yield
    
    # Reset values after test
    cooling_solution_inputs.clear()
    cooling_solution_inputs.update(original_cooling_solution)
    cooling_capacity_inputs.clear()
    cooling_capacity_inputs.update(original_cooling_capacity)
    cost_inclusion_inputs.clear()
    cost_inclusion_inputs.update(original_cost_inclusion)

def test_update_inputs(reset_inputs):
    # Test updating all input types
    test_inputs = {
        'cooling_type': 'air_cooling',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    }
    
    update_inputs(test_inputs)
    
    assert cooling_solution_inputs['cooling_type'] == 'air_cooling'
    assert cooling_capacity_inputs['cooling_capacity_limit'] == 5
    assert cost_inclusion_inputs['include_it_cost'] == True

@patch('app.services.calculations.main.calculate_air_cooling_capex')
def test_calculate_air_cooling(mock_air_cooling, reset_inputs):
    # Mock the air cooling calculation result
    expected_result = {
        'cooling_equipment_capex': 37890204,
        'it_equipment_capex': 97859534,
        'total_capex': 135749738
    }
    mock_air_cooling.return_value = expected_result
    
    # Set up inputs for air cooling calculation
    update_inputs({
        'cooling_type': 'air_cooling',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    })
    
    # Call calculate and verify results
    result = calculate()
    
    assert result == expected_result
    mock_air_cooling.assert_called_once_with({
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    })

def test_calculate_unsupported_cooling_type(reset_inputs):
    # Test with an unsupported cooling type
    update_inputs({'cooling_type': 'unsupported_type'})
    
    # Calculate should return None for unsupported cooling types
    result = calculate()
    
    assert result is None
