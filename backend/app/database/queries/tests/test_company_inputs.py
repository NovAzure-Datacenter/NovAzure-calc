import pytest
from app.database.connection import db_manager
from app.database.queries.company_inputs import get_cooling_maintenance_rate

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