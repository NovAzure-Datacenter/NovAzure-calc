import pytest
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId
from app.repositories.calculator_repository import CalculatorRepository

# Simulated mock_db data as would be returned from MongoDB
MOCK_DB = {
    "mock_data": {
        "total_it_cost": [
            {"name": "Total IT Cost", "value": 97859534}
        ],
        "air_cooled_cost_with_inflation_LE": [
            {"name": "Lower Efficiency Air Cooling", "value": 135749738}
        ],
        "chassis_markup": [
            {"name": "Chassis markup KU:L 2", "value": 2250000},
            {"name": "Chassis markup KU:L Box 3U", "value": 2250000}
        ],
        "total_it_cost_per_kw": [
            {"name": "Total IT cost per KW", "value": 12645.064}
        ],
        "annual_Cooling_Opex_LE": [
            {"name": "Annual Cooling OPEX LE", "value": 18654697}
        ]
    }
}

@pytest.fixture
def mock_db():
    mock_db = MagicMock()
    mock_db.__getitem__.return_value = AsyncMock()
    return mock_db

@pytest.mark.asyncio
async def test_get_mock_value_total_it_cost(mock_db):
    document_id = "123456789012345678901234"
    mock_key = "total_it_cost"
    mock_collection = mock_db["technologies"]
    mock_collection.find_one.return_value = {"mock_data": MOCK_DB["mock_data"]}
    repo = CalculatorRepository(mock_db)
    result = await repo.get_mock_value(document_id, mock_key)
    # Should return the value for total_it_cost
    assert result == 97859534

@pytest.mark.asyncio
async def test_get_mock_value_air_cooled_cost_with_inflation_LE(mock_db):
    document_id = "123456789012345678901234"
    mock_key = "air_cooled_cost_with_inflation_LE"
    mock_collection = mock_db["technologies"]
    mock_collection.find_one.return_value = {"mock_data": MOCK_DB["mock_data"]}
    repo = CalculatorRepository(mock_db)
    result = await repo.get_mock_value(document_id, mock_key)
    # Should return the value for air_cooled_cost_with_inflation_LE
    assert result == 135749738

@pytest.mark.asyncio
async def test_get_mock_value_chassis_markup_index_1(mock_db):
    document_id = "123456789012345678901234"
    mock_key = "chassis_markup"
    mock_collection = mock_db["technologies"]
    mock_collection.find_one.return_value = {"mock_data": MOCK_DB["mock_data"]}
    repo = CalculatorRepository(mock_db)
    result = await repo.get_mock_value(document_id, mock_key, index=1)
    # Should return the value at index 1 for chassis_markup
    assert result == 2250000

@pytest.mark.asyncio
async def test_get_mock_value_total_it_cost_per_kw_float(mock_db):
    document_id = "123456789012345678901234"
    mock_key = "total_it_cost_per_kw"
    mock_collection = mock_db["technologies"]
    mock_collection.find_one.return_value = {"mock_data": MOCK_DB["mock_data"]}
    repo = CalculatorRepository(mock_db)
    result = await repo.get_mock_value(document_id, mock_key)
    # Should return the float value for total_it_cost_per_kw
    assert result == 12645.064

@pytest.mark.asyncio
async def test_get_mock_value_missing_key_returns_0(mock_db):
    document_id = "123456789012345678901234"
    mock_key = "not_in_db"
    mock_collection = mock_db["technologies"]
    mock_collection.find_one.return_value = {"mock_data": MOCK_DB["mock_data"]}
    repo = CalculatorRepository(mock_db)
    result = await repo.get_mock_value(document_id, mock_key)
    # Should return 0 if the key is missing
    assert result == 0

@pytest.mark.asyncio
async def test_get_mock_value_no_document_returns_0(mock_db):
    document_id = "123456789012345678901234"
    mock_key = "total_it_cost"
    mock_collection = mock_db["technologies"]
    mock_collection.find_one.return_value = None
    repo = CalculatorRepository(mock_db)
    result = await repo.get_mock_value(document_id, mock_key)
    # Should return 0 if the document is not found
    assert result == 0