import pytest
from unittest.mock import patch
from app.services.calculations.chassis_immersion.capex import calculate_cooling_equipment_capex, calculate_it_equipment_capex, total_capex, calculate_cooling_capex

MOCK_DATA = {
    "chassis_total_it_cost": [
        {
            "id": 1,
            "name": "Total IT cost with geographical adjustment",
            "value": 94837982 
        }
    ],
    "chassis_solution_capex_in_absence_of_waterloop": [
        {
            "id": 2,
            "name": "Chassis solution capex in absence of Waterloop",
            "value": 138348319
        }
    ],
    "chassis_markup": [
        {
            "name": "Chassis markup KU:L 2",
            "value": 2250000
        },
        {
            "name": "Chassis markup KU:L Box 3U",
            "value": 2250000
        }
    ],
    "chassis_capex_with_inflation": [
        {
            "name": "Capex with inflation KU:L 2",
            "value": 136134281
        },
        {
            "name": "Capex with inflation KU:L Box 3U",
            "value": 125835281
        }
    ],
    "total_it_cost_per_kw": [
        {
            "name": "Total IT cost per KW",
            "value": 12645.064 
        }
    ]
}

EXPECTED_TYPICAL_COOLING_RESULT = 138348319 - 94837982
EXPECTED_CUSTOMER_KUL_RESULT = (2250000 + 136134281) - 94837982
EXPECTED_CUSTOMER_MULTINODE_RESULT = (2250000 + 125835281) - 94837982
EXPECTED_CUSTOMER_IT_RESULT = int(12645.064)

@pytest.fixture
def mock_get_data():
    with patch('app.mock_db.data_access.get_mock_data', return_value=MOCK_DATA):
        yield

def test_calculate_cooling_equipment_capex_typical_kul(mock_get_data):
    result = calculate_cooling_equipment_capex("typical", "KU:L 2", 5)
    assert result == EXPECTED_TYPICAL_COOLING_RESULT

def test_calculate_cooling_equipment_capex_typical_multinode(mock_get_data):
    result = calculate_cooling_equipment_capex("typical", "Purpose Optimized Multinode", 5)
    assert result == EXPECTED_TYPICAL_COOLING_RESULT

def test_calculate_cooling_equipment_capex_customer_kul(mock_get_data):
    result = calculate_cooling_equipment_capex("customer", "KU:L 2", 5)
    assert result == EXPECTED_CUSTOMER_KUL_RESULT

def test_calculate_cooling_equipment_capex_customer_multinode(mock_get_data):
    result = calculate_cooling_equipment_capex("customer", "Purpose Optimized Multinode", 5)
    assert result == EXPECTED_CUSTOMER_MULTINODE_RESULT

def test_calculate_it_equipment_capex_typical_kul(mock_get_data):
    result = calculate_it_equipment_capex("typical", "KU:L 2", 5)
    assert result == 94837982

def test_calculate_it_equipment_capex_typical_multinode(mock_get_data):
    result = calculate_it_equipment_capex("typical", "Purpose Optimized Multinode", 5)
    assert result == 94837982

def test_calculate_it_equipment_capex_customer_kul(mock_get_data):
    result = calculate_it_equipment_capex("customer", "KU:L 2", 5)
    assert result == EXPECTED_CUSTOMER_IT_RESULT

def test_calculate_it_equipment_capex_customer_multinode(mock_get_data):
    result = calculate_it_equipment_capex("customer", "Purpose Optimized Multinode", 5)
    assert result == EXPECTED_CUSTOMER_IT_RESULT

@patch('app.services.calculations.chassis_immersion.capex.calculate_cooling_equipment_capex')
@patch('app.services.calculations.chassis_immersion.capex.calculate_it_equipment_capex')
def test_total_capex_typical_without_it_cost(mock_it_capex, mock_cooling_capex, mock_get_data):
    mock_cooling_capex.return_value = EXPECTED_TYPICAL_COOLING_RESULT
    mock_it_capex.return_value = 94837982
    
    result = total_capex("typical", "KU:L 2", 5, include_it_cost=False)
    
    assert result == EXPECTED_TYPICAL_COOLING_RESULT
    mock_cooling_capex.assert_called_once_with("typical", "KU:L 2", 5)
    mock_it_capex.assert_called_once_with("typical", "KU:L 2", 5)

@patch('app.services.calculations.chassis_immersion.capex.calculate_cooling_equipment_capex')
@patch('app.services.calculations.chassis_immersion.capex.calculate_it_equipment_capex')
def test_total_capex_typical_with_it_cost(mock_it_capex, mock_cooling_capex, mock_get_data):
    mock_cooling_capex.return_value = EXPECTED_TYPICAL_COOLING_RESULT
    mock_it_capex.return_value = 94837982
    expected_total = EXPECTED_TYPICAL_COOLING_RESULT + 94837982
    
    result = total_capex("typical", "KU:L 2", 5, include_it_cost=True)
    
    assert result == expected_total
    mock_cooling_capex.assert_called_once_with("typical", "KU:L 2", 5)
    mock_it_capex.assert_called_once_with("typical", "KU:L 2", 5)

@patch('app.services.calculations.chassis_immersion.capex.calculate_cooling_equipment_capex')
@patch('app.services.calculations.chassis_immersion.capex.calculate_it_equipment_capex')
def test_total_capex_customer_with_it_cost(mock_it_capex, mock_cooling_capex, mock_get_data):
    mock_cooling_capex.return_value = EXPECTED_CUSTOMER_KUL_RESULT
    mock_it_capex.return_value = EXPECTED_CUSTOMER_IT_RESULT
    expected_total = EXPECTED_CUSTOMER_KUL_RESULT + EXPECTED_CUSTOMER_IT_RESULT
    
    result = total_capex("customer", "KU:L 2", 5, include_it_cost=True)
    
    assert result == expected_total
    mock_cooling_capex.assert_called_once_with("customer", "KU:L 2", 5)
    mock_it_capex.assert_called_once_with("customer", "KU:L 2", 5)

def test_calculate_cooling_capex_typical_without_it_cost(mock_get_data):
    input_data = {
        'data_source': 'typical',
        'chassis_technology': "KU:L 2",
        'cooling_capacity_limit': 5,
        'include_it_cost': False
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_TYPICAL_COOLING_RESULT
    assert result['it_equipment_capex'] == 94837982
    assert result['total_capex'] == EXPECTED_TYPICAL_COOLING_RESULT

def test_calculate_cooling_capex_typical_with_it_cost(mock_get_data):
    input_data = {
        'data_source': 'typical',
        'chassis_technology': "KU:L 2",
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_TYPICAL_COOLING_RESULT
    assert result['it_equipment_capex'] == 94837982
    assert result['total_capex'] == EXPECTED_TYPICAL_COOLING_RESULT + 94837982

def test_calculate_cooling_capex_typical_multinode(mock_get_data):
    input_data = {
        'data_source': 'typical',
        'chassis_technology': "Purpose Optimized Multinode",
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_TYPICAL_COOLING_RESULT
    assert result['it_equipment_capex'] == 94837982
    assert result['total_capex'] == EXPECTED_TYPICAL_COOLING_RESULT + 94837982

def test_calculate_cooling_capex_customer_kul(mock_get_data):
    input_data = {
        'data_source': 'customer',
        'chassis_technology': "KU:L 2",
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_CUSTOMER_KUL_RESULT
    assert result['it_equipment_capex'] == EXPECTED_CUSTOMER_IT_RESULT
    assert result['total_capex'] == EXPECTED_CUSTOMER_KUL_RESULT + EXPECTED_CUSTOMER_IT_RESULT

def test_calculate_cooling_capex_customer_multinode(mock_get_data):
    input_data = {
        'data_source': 'customer',
        'chassis_technology': "Purpose Optimized Multinode",
        'cooling_capacity_limit': 5,
        'include_it_cost': True
    }
    
    result = calculate_cooling_capex(input_data)
    
    assert result['cooling_equipment_capex'] == EXPECTED_CUSTOMER_MULTINODE_RESULT
    assert result['it_equipment_capex'] == EXPECTED_CUSTOMER_IT_RESULT
    assert result['total_capex'] == EXPECTED_CUSTOMER_MULTINODE_RESULT + EXPECTED_CUSTOMER_IT_RESULT