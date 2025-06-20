import pytest
from unittest.mock import patch
from app.services.calculations.main import update_inputs, calculate, cooling_solution_inputs, cooling_capacity_inputs, cost_inclusion_inputs, chassis_technology_inputs, data_source

@pytest.fixture
def reset_inputs():
    """Reset all input dictionaries to their default state after each test"""
    # Store original values
    original_cooling_solution = dict(cooling_solution_inputs)
    original_cooling_capacity = dict(cooling_capacity_inputs)
    original_cost_inclusion = dict(cost_inclusion_inputs)
    original_chassis_technology = dict(chassis_technology_inputs)
    original_data_source = dict(data_source)
    
    # Reset values before test
    cooling_solution_inputs.update({'cooling_type': None})
    cooling_capacity_inputs.update({'cooling_capacity_limit': None})
    cost_inclusion_inputs.update({'include_it_cost': None})
    chassis_technology_inputs.update({'chassis_technology': None})
    data_source.update({'data_source': 'typical'})
    
    yield
    
    # Reset values after test
    cooling_solution_inputs.clear()
    cooling_solution_inputs.update(original_cooling_solution)
    cooling_capacity_inputs.clear()
    cooling_capacity_inputs.update(original_cooling_capacity)
    cost_inclusion_inputs.clear()
    cost_inclusion_inputs.update(original_cost_inclusion)
    chassis_technology_inputs.clear()
    chassis_technology_inputs.update(original_chassis_technology)
    data_source.clear()
    data_source.update(original_data_source)

def test_update_inputs(reset_inputs):
    # Test updating all input types
    test_inputs = {
        'cooling_type': 'air_cooling',
        'cooling_capacity_limit': 5,
        'include_it_cost': True,
        'chassis_technology': 'KU:L 2',
        'data_source': 'customer'
    }
    
    update_inputs(test_inputs)
    
    assert cooling_solution_inputs['cooling_type'] == 'air_cooling'
    assert cooling_capacity_inputs['cooling_capacity_limit'] == 5
    assert cost_inclusion_inputs['include_it_cost'] == True
    assert chassis_technology_inputs['chassis_technology'] == 'KU:L 2'
    assert data_source['data_source'] == 'customer'

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
        'include_it_cost': True,
        'data_source': 'typical'
    })
    
    # Call calculate and verify results
    result = calculate()
    
    assert result == expected_result
    mock_air_cooling.assert_called_once_with({
        'data_source': 'typical',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    })

@patch('app.services.calculations.main.calculate_chassis_immersion_capex')
def test_calculate_chassis_immersion(mock_chassis_immersion, reset_inputs):
    # Mock the chassis immersion calculation result
    expected_result = {
        'cooling_equipment_capex': 43510337,
        'it_equipment_capex': 94837982,
        'total_capex': 138348319
    }
    mock_chassis_immersion.return_value = expected_result
    
    # Set up inputs for chassis immersion calculation
    update_inputs({
        'cooling_type': 'chassis_immersion',
        'cooling_capacity_limit': 5,
        'include_it_cost': True,
        'chassis_technology': 'KU:L 2',
        'data_source': 'typical'
    })
    
    # Call calculate and verify results
    result = calculate()
    
    assert result == expected_result
    mock_chassis_immersion.assert_called_once_with({
        'data_source': 'typical',
        'chassis_technology': 'KU:L 2',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    })

@patch('app.services.calculations.main.calculate_chassis_immersion_capex')
def test_calculate_chassis_immersion_different_tech(mock_chassis_immersion, reset_inputs):
    # Mock the chassis immersion calculation result for different technology
    expected_result = {
        'cooling_equipment_capex': 43510337,
        'it_equipment_capex': 94837982,
        'total_capex': 138348319
    }
    mock_chassis_immersion.return_value = expected_result
    
    # Set up inputs with different technology and cooling capacity
    update_inputs({
        'cooling_type': 'chassis_immersion',
        'cooling_capacity_limit': 10,
        'include_it_cost': False,
        'chassis_technology': 'Purpose Optimized Multinode',
        'data_source': 'typical'
    })
    
    # Call calculate and verify results
    result = calculate()
    
    assert result == expected_result
    mock_chassis_immersion.assert_called_once_with({
        'data_source': 'typical',
        'chassis_technology': 'Purpose Optimized Multinode',
        'cooling_capacity_limit': 10,
        'include_it_cost': False
    })

def test_calculate_unsupported_cooling_type(reset_inputs):
    # Test with an unsupported cooling type
    update_inputs({
        'cooling_type': 'unsupported_type',
        'data_source': 'typical'
    })
    
    # Calculate should return None for unsupported cooling types
    result = calculate()
    
    assert result is None

@patch('app.services.calculations.main.calculate_air_cooling_capex')
def test_calculate_air_cooling_with_customer_data(mock_air_cooling, reset_inputs):
    # Mock the air cooling calculation result with customer data
    expected_result = {
        'cooling_equipment_capex': 38612686,
        'it_equipment_capex': 97859534,
        'total_capex': 136472220
    }
    mock_air_cooling.return_value = expected_result
    
    # Set up inputs for air cooling calculation with customer data
    update_inputs({
        'cooling_type': 'air_cooling',
        'cooling_capacity_limit': 5,
        'include_it_cost': True,
        'data_source': 'customer'
    })
    
    # Call calculate and verify results
    result = calculate()
    
    assert result == expected_result
    mock_air_cooling.assert_called_once_with({
        'data_source': 'customer',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    })

@patch('app.services.calculations.main.calculate_chassis_immersion_capex')
def test_calculate_chassis_immersion_customer_data(mock_chassis_immersion, reset_inputs):
    # Mock the chassis immersion calculation result with customer data
    expected_result = {
        'cooling_equipment_capex': 43546299,
        'it_equipment_capex': 12645.064,
        'total_capex': 43558944.064
    }
    mock_chassis_immersion.return_value = expected_result
    
    # Set up inputs for chassis immersion calculation with customer data
    update_inputs({
        'cooling_type': 'chassis_immersion',
        'cooling_capacity_limit': 5,
        'include_it_cost': True,
        'chassis_technology': 'KU:L 2',
        'data_source': 'customer'
    })
    
    # Call calculate and verify results
    result = calculate()
    
    assert result == expected_result
    mock_chassis_immersion.assert_called_once_with({
        'data_source': 'customer',
        'chassis_technology': 'KU:L 2',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    })
