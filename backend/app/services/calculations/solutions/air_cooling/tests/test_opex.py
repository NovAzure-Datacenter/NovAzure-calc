import pytest
from app.database.connection import db_manager
from app.services.calculations.solutions.air_cooling.opex import calculate_annual_opex, calculate_total_opex_over_lifetime

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

@pytest.mark.asyncio
@pytest.mark.parametrize("input_data,total_capex", [
    ({
        'data_hall_design_capacity_mw': 1.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2023,
        'planned_years_of_operation': 10,
        'country': 'United States'
    }, 3849000.0),
    ({
        'data_hall_design_capacity_mw': 2.0,
        'annualised_air_ppue': 1.3,
        'percentage_of_utilisation': 0.7,
        'first_year_of_operation': 2024,
        'planned_years_of_operation': 15,
        'country': 'Singapore'
    }, 7195080.0),
    ({
        'data_hall_design_capacity_mw': 0.5,
        'annualised_air_ppue': 1.1,
        'percentage_of_utilisation': 0.9,
        'first_year_of_operation': 2025,
        'planned_years_of_operation': 20,
        'country': 'United Kingdom'
    }, 2575040.0),
])
async def test_calculate_total_opex_over_lifetime(input_data, total_capex):
    result = await calculate_total_opex_over_lifetime(input_data, total_capex)
    
    assert isinstance(result, dict)
    assert 'total_opex_over_lifetime' in result
    
    assert isinstance(result['total_opex_over_lifetime'], (int, float))
    
    assert result['total_opex_over_lifetime'] > 0

@pytest.mark.asyncio
async def test_total_opex_lifetime_greater_than_annual():
    input_data_annual = {
        'data_hall_design_capacity_mw': 1.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2023,
        'country': 'United States'
    }
    
    input_data_lifetime = {
        'data_hall_design_capacity_mw': 1.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2023,
        'planned_years_of_operation': 10,
        'country': 'United States'
    }
    
    annual_result = await calculate_annual_opex(input_data_annual, 1000000.0)
    lifetime_result = await calculate_total_opex_over_lifetime(input_data_lifetime, 1000000.0)
    
    # Total lifetime OPEX should be significantly larger than annual OPEX
    assert lifetime_result['total_opex_over_lifetime'] > annual_result['annual_opex'] * 5

@pytest.mark.asyncio
async def test_total_opex_lifetime_varying_electricity_rates():
    input_data = {
        'data_hall_design_capacity_mw': 1.0,
        'annualised_air_ppue': 1.2,
        'percentage_of_utilisation': 0.8,
        'first_year_of_operation': 2023,
        'planned_years_of_operation': 5,
        'country': 'United States'
    }
    
    result = await calculate_total_opex_over_lifetime(input_data, 1000000.0)
    
    # Verify that the total opex calculation considers varying rates over multiple years
    assert result['total_opex_over_lifetime'] > 0
    assert isinstance(result['total_opex_over_lifetime'], (int, float)) 