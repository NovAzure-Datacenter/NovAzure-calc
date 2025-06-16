import pytest
from unittest.mock import patch
from app.services.calculations.air_cooling.capex import calculate_cooling_equipment_capex, calculate_it_equipment_capex, total_capex

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

# Calculate expected results
EXPECTED_LE_RESULT = 135749738 - 97859534  # 37890204
EXPECTED_HE_RESULT = 136472220 - 97859534  # 38612686

@pytest.fixture
def mock_get_data():
    with patch('app.mock_db.data_access.get_mock_data', return_value=MOCK_DATA):
        yield

def test_calculate_cooling_equipment_capex_le(mock_get_data):
    result = calculate_cooling_equipment_capex(5)
    assert result == EXPECTED_LE_RESULT

def test_calculate_cooling_equipment_capex_he(mock_get_data):
    result = calculate_cooling_equipment_capex(10)
    assert result == EXPECTED_HE_RESULT

def test_calculate_it_equipment_capex(mock_get_data):
    result = calculate_it_equipment_capex(5)
    assert result == 97859534

@patch('app.services.calculations.air_cooling.capex.calculate_cooling_equipment_capex')
@patch('app.services.calculations.air_cooling.capex.calculate_it_equipment_capex')
def test_total_capex(mock_it_capex, mock_cooling_capex, mock_get_data):
    mock_cooling_capex.return_value = EXPECTED_LE_RESULT
    mock_it_capex.return_value = 97859534
    
    result = total_capex(5)
    
    assert result == EXPECTED_LE_RESULT
    mock_cooling_capex.assert_called_once_with(5)
    mock_it_capex.assert_called_once_with(5)

# Note: To test total_capex with include_IT_cost=True, we would need to modify
# the function to accept this as a parameter or use dependency injection to make 
# it more testable. This is left as a future enhancement.
