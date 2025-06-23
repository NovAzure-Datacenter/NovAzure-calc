import pytest
from app.database.connection import db_manager
from app.database.queries.company_inputs import (
    get_cooling_maintenance_rate,
    get_budget_IT_energy,
    get_budget_fan_energy,
    get_actual_fan_power,
    get_water_price_per_litre,
    get_water_use_per_kwh
)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    db_manager.connect()
    yield
    db_manager.disconnect()

@pytest.mark.parametrize("country,expected_rate", [
    ("United States", 0.075),
    ("United Kingdom", 0.08),
    ("Singapore", 0.085),
    ("United Arab Emirates", 0.08),
    ("Germany", 0.08),  # default case
])
async def test_get_cooling_maintenance_rate(country, expected_rate):
    result = await get_cooling_maintenance_rate(country)
    assert result == expected_rate

async def test_get_budget_IT_energy():
    result = await get_budget_IT_energy()
    assert result is not None
    assert isinstance(result, (int, float))

async def test_get_budget_fan_energy():
    result = await get_budget_fan_energy()
    assert result is not None
    assert isinstance(result, (int, float))

async def test_get_actual_fan_power():
    result = await get_actual_fan_power()
    assert result is not None
    assert isinstance(result, (int, float))

async def test_get_water_price_per_litre():
    result = await get_water_price_per_litre()
    assert result is not None
    assert isinstance(result, (int, float))

async def test_get_water_use_per_kwh():
    result = await get_water_use_per_kwh()
    assert result is not None
    assert isinstance(result, (int, float))