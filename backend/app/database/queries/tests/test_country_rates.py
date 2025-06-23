import pytest
from app.database.connection import db_manager
from app.database.queries.country_rates import (
    get_co2e_intensity_per_kwh,
    get_cooling_capex_rate
)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    db_manager.connect()
    yield
    db_manager.disconnect()

@pytest.mark.parametrize("country", [
    "United States",
    "United Kingdom", 
    "Singapore",
    "United Arab Emirates",
])
async def test_get_co2e_intensity_per_kwh(country):
    result = await get_co2e_intensity_per_kwh(country)
    assert result == 181

@pytest.mark.parametrize("country,expected_capex_rate", [
    ("United States", 3849),
    ("United Kingdom", 4952), 
    ("Singapore", 3527),
    ("United Arab Emirates", 3433),
])
async def test_get_cooling_capex_rate(country, expected_capex_rate):
    result = await get_cooling_capex_rate(country)
    assert result == expected_capex_rate

async def test_get_co2e_intensity_per_kwh_nonexistent_country():
    result = await get_co2e_intensity_per_kwh("Nonexistent Country")
    assert result is None

async def test_get_cooling_capex_rate_nonexistent_country():
    result = await get_cooling_capex_rate("Nonexistent Country")
    assert result is None 