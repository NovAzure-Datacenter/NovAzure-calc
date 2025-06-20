import pytest
from unittest.mock import patch
from app.services.calculations.air_cooling.capex import calculate_cooling_equipment_capex, calculate_it_equipment_capex, total_capex, calculate_cooling_capex

MOCK_DATA = {
    "total_it_cost": [
        {
            "id": 1,
            "name": "Total IT Cost",
            "value": 97859534 
        }
    ],
    "air_cooled_cost_with_inflation_LE": [
        {
            "id": 2,
            "name": "Lower Efficiency Air Cooling",
            "value": 135749738
        }
    ],
    "air_cooled_cost_with_inflation_HE": [
        {
            "id": 3,
            "name": "Higher Efficiency Air Cooling",
            "value": 136472220 
        }
    ]
}

EXPECTED_LE_RESULT = 135749738 - 97859534 
EXPECTED_HE_RESULT = 136472220 - 97859534 

@pytest.fixture
def mock_get_data():
    with patch('app.mock_db.data_access.get_mock_data', return_value=MOCK_DATA):
        yield

def test_calculate_cooling_equipment_capex_typical_le(mock_get_data):
    result = calculate_cooling_equipment_capex('typical', 5)
    assert result == EXPECTED_LE_RESULT

def test_calculate_cooling_equipment_capex_typical_he(mock_get_data):
    result = calculate_cooling_equipment_capex('typical', 10)
    assert result == EXPECTED_HE_RESULT

def test_calculate_cooling_equipment_capex_customer(mock_get_data):
    result = calculate_cooling_equipment_capex('customer', 5)
    assert result == EXPECTED_HE_RESULT

def test_calculate_it_equipment_capex_typical(mock_get_data):
    result = calculate_it_equipment_capex('typical', 5)
    assert result == 97859534

def test_calculate_it_equipment_capex_customer(mock_get_data):
    result = calculate_it_equipment_capex('customer', 5)
    assert result == 97859534

@patch('app.services.calculations.air_cooling.capex.calculate_cooling_equipment_capex')
@patch('app.services.calculations.air_cooling.capex.calculate_it_equipment_capex')
def test_total_capex_typical_without_it_cost(mock_it_capex, mock_cooling_capex, mock_get_data):
    mock_cooling_capex.return_value = EXPECTED_LE_RESULT
    mock_it_capex.return_value = 97859534
    
    result = total_capex('typical', 5, include_it_cost=False)
    
    assert result == EXPECTED_LE_RESULT
    mock_cooling_capex.assert_called_once_with('typical', 5)
    mock_it_capex.assert_called_once_with('typical', 5)

@patch('app.services.calculations.air_cooling.capex.calculate_cooling_equipment_capex')
@patch('app.services.calculations.air_cooling.capex.calculate_it_equipment_capex')
def test_total_capex_typical_with_it_cost(mock_it_capex, mock_cooling_capex, mock_get_data):
    mock_cooling_capex.return_value = EXPECTED_LE_RESULT
    mock_it_capex.return_value = 97859534
    expected_total = EXPECTED_LE_RESULT + 97859534
    
    result = total_capex('typical', 5, include_it_cost=True)
    
    assert result == expected_total
    mock_cooling_capex.assert_called_once_with('typical', 5)
    mock_it_capex.assert_called_once_with('typical', 5)

@patch('app.services.calculations.air_cooling.capex.calculate_cooling_equipment_capex')
@patch('app.services.calculations.air_cooling.capex.calculate_it_equipment_capex')
def test_total_capex_customer_with_it_cost(mock_it_capex, mock_cooling_capex, mock_get_data):
    mock_cooling_capex.return_value = EXPECTED_HE_RESULT
    mock_it_capex.return_value = 97859534
    expected_total = EXPECTED_HE_RESULT + 97859534
    
    result = total_capex('customer', 5, include_it_cost=True)
    
    assert result == expected_total
    mock_cooling_capex.assert_called_once_with('customer', 5)
    mock_it_capex.assert_called_once_with('customer', 5)

def test_calculate_cooling_capex_typical_without_it_cost(mock_get_data):
    input_data = {
        'data_source': 'typical',
        'cooling_capacity_limit': 5,
        'include_it_cost': False
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_LE_RESULT
    assert result['it_equipment_capex'] == 97859534
    assert result['total_capex'] == EXPECTED_LE_RESULT

def test_calculate_cooling_capex_typical_with_it_cost(mock_get_data):
    input_data = {
        'data_source': 'typical',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_LE_RESULT
    assert result['it_equipment_capex'] == 97859534
    assert result['total_capex'] == EXPECTED_LE_RESULT + 97859534

def test_calculate_cooling_capex_typical_high_efficiency(mock_get_data):
    input_data = {
        'data_source': 'typical',
        'cooling_capacity_limit': 10,
        'include_it_cost': True
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_HE_RESULT
    assert result['it_equipment_capex'] == 97859534
    assert result['total_capex'] == EXPECTED_HE_RESULT + 97859534

def test_calculate_cooling_capex_customer(mock_get_data):
    input_data = {
        'data_source': 'customer',
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_HE_RESULT
    assert result['it_equipment_capex'] == 97859534
    assert result['total_capex'] == EXPECTED_HE_RESULT + 97859534
