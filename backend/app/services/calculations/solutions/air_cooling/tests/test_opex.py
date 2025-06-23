import pytest
from app.database.connection import db_manager
from app.services.calculations.solutions.air_cooling.opex import calculate_annual_opex

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    db_manager.connect()
    yield
    db_manager.disconnect()

@pytest.mark.asyncio
@pytest.mark.parametrize("input_data,total_capex", [
    ({
        'data_hall_design_capacity_mw': 1.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }, 3849000.0),
    ({
        'data_hall_design_capacity_mw': 2.0,
        'annualised_air_ppue': 1.3,
        'percentage_of_utilisation': 0.7,
        'first_year_of_operation': 2024,
        'country': 'Singapore'
    }, 7195080.0),
    ({
        'data_hall_design_capacity_mw': 0.5,
        'annualised_air_ppue': 1.1,
        'percentage_of_utilisation': 0.9,
        'first_year_of_operation': 2025,
        'country': 'United Kingdom'
    }, 2575040.0),
])
async def test_calculate_annual_opex(input_data, total_capex):
    result = await calculate_annual_opex(input_data, total_capex)
    
    assert isinstance(result, dict)
    assert 'annual_opex' in result
    assert isinstance(result['annual_opex'], (int, float))
    assert result['annual_opex'] > 0

@pytest.mark.asyncio
async def test_calculate_annual_opex_structure():
    input_data = {
        'data_hall_design_capacity_mw': 1.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }
    
    result = await calculate_annual_opex(input_data, 3849000.0)
    
    assert isinstance(result, dict)
    assert 'annual_opex' in result
    assert isinstance(result['annual_opex'], (int, float))
    assert result['annual_opex'] > 0

@pytest.mark.asyncio
async def test_calculate_annual_opex_different_countries():
    base_input = {
        'data_hall_design_capacity_mw': 1.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2023
    }
    
    countries = ['United States', 'Singapore', 'United Kingdom', 'United Arab Emirates']
    
    for country in countries:
        input_data = {**base_input, 'country': country}
        result = await calculate_annual_opex(input_data, 1000000.0)
        
        assert result['annual_opex'] > 0
        assert isinstance(result['annual_opex'], (int, float)) 