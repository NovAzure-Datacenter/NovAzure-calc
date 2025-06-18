import pytest
from unittest.mock import patch
from app.services.calculations.air_cooling.opex import (
    calculate_annual_cooling_opex,
    calculate_annual_it_maintenance,
    calculate_opex_lifetime,
    calculate_opex
)

# Correct Mock Data matching what opex.py expects
MOCK_DATA = {
    "annual_Cooling_Opex_LE": [{"id": 1, "name": "Annual Cooling OPEX LE", "value": 1200000}],
    "annual_Cooling_Opex_HE": [{"id": 2, "name": "Annual Cooling OPEX HE", "value": 1500000}],
    "annual_IT_Equipment_Maintenance_LE": [{"id": 3, "name": "Annual IT Equipment Maintenance LE", "value": 300000}],
    "annual_IT_Equipment_Maintenance_HE": [{"id": 4, "name": "Annual IT Equipment Maintenance HE", "value": 400000}],
    "lifetime_Opex_LE": [{"id": 5, "name": "Lifetime OPEX LE", "value": 20000000}],
    "lifetime_Opex_HE": [{"id": 6, "name": "Lifetime OPEX HE", "value": 25000000}]
}

@pytest.fixture
def mock_get_data():
    with patch('app.mock_db.data_access.get_mock_data', return_value=MOCK_DATA):
        yield

# --------- Annual Cooling Opex Tests ---------

def test_annual_cooling_opex_LE(mock_get_data):
    result = calculate_annual_cooling_opex(5)
    assert result == 1200000 - 300000  # 900000

def test_annual_cooling_opex_HE(mock_get_data):
    result = calculate_annual_cooling_opex(10)
    assert result == 1500000 - 400000  # 1100000

# --------- Annual IT Maintenance Tests ---------

def test_annual_it_maintenance_LE(mock_get_data):
    result = calculate_annual_it_maintenance(5)
    assert result == 300000

def test_annual_it_maintenance_HE(mock_get_data):
    result = calculate_annual_it_maintenance(10)
    assert result == 400000

# --------- Lifetime Opex Tests ---------

def test_opex_lifetime_include_it_cost_LE(mock_get_data):
    result = calculate_opex_lifetime(5, include_it_cost=True, planned_years_of_operation=15)
    assert result == 20000000

def test_opex_lifetime_include_it_cost_HE(mock_get_data):
    result = calculate_opex_lifetime(10, include_it_cost=True, planned_years_of_operation=20)
    assert result == 25000000

def test_opex_lifetime_exclude_it_cost_LE(mock_get_data):
    result = calculate_opex_lifetime(5, include_it_cost=False, planned_years_of_operation=10)
    expected = 20000000 - (300000 * 10)  # 17000000
    assert result == expected

def test_opex_lifetime_exclude_it_cost_HE(mock_get_data):
    result = calculate_opex_lifetime(10, include_it_cost=False, planned_years_of_operation=5)
    expected = 25000000 - (400000 * 5)  # 23000000
    assert result == expected

# --------- Entry Point Function Tests ---------

def test_calculate_opex_LE_with_it_cost(mock_get_data):
    input_data = {
        'cooling_capacity_limit': 5,
        'include_it_cost': True,
        'planned_years_of_operation': 12
    }
    result = calculate_opex(input_data)
    assert result['annual_cooling_opex'] == 900000
    assert result['annual_it_equipment_maintenance'] == 300000
    assert result['opex_lifetime'] == 20000000

def test_calculate_opex_HE_without_it_cost(mock_get_data):
    input_data = {
        'cooling_capacity_limit': 10,
        'include_it_cost': False,
        'planned_years_of_operation': 5
    }
    result = calculate_opex(input_data)
    assert result['annual_cooling_opex'] == 1100000
    assert result['annual_it_equipment_maintenance'] == 400000
    assert result['opex_lifetime'] == 23000000
