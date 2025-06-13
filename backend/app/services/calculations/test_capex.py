import pytest
from unittest.mock import patch
from app.services.calculations.capex import calculate_cooling_equipment_capex

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
