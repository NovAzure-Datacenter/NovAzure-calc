import pytest
from app.database.connection import db_manager
from app.services.calculations.main import (
    update_inputs,
    calculate,
    percentage_of_utilisation,
    planned_years_of_operation,
    project_location,
    data_hall_design_capacity_mw,
    first_year_of_operation,
    annualised_air_ppue
)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    db_manager.connect()
    yield
    db_manager.disconnect()

@pytest.fixture
def reset_inputs():
    """Reset all input dictionaries to their default state before each test"""
    percentage_of_utilisation['%_of_utilisation'] = None
    planned_years_of_operation['planned_years_of_operation'] = None
    project_location['project_location'] = None
    data_hall_design_capacity_mw['data_hall_design_capacity_mw'] = None
    first_year_of_operation['first_year_of_operation'] = None
    annualised_air_ppue['annualised_air_ppue'] = None
    yield

@pytest.mark.asyncio
@pytest.mark.parametrize("inputs", [
    {
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 10
    },
    {
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'project_location': 'Singapore',
        '%_of_utilisation': 0.7,
        'annualised_air_ppue': 1.3,
        'planned_years_of_operation': 15
    },
    {
        'data_hall_design_capacity_mw': 0.5,
        'first_year_of_operation': 2025,
        'project_location': 'United Kingdom',
        '%_of_utilisation': 0.9,
        'annualised_air_ppue': 1.1,
        'planned_years_of_operation': 20
    },
])
async def test_update_inputs_and_calculate(reset_inputs, inputs):
    update_inputs(inputs)
    result = await calculate()
    
    assert isinstance(result, dict)
    assert 'air_cooling_capex' in result
    assert 'total_capex' in result
    assert 'opex' in result
    assert 'total_opex_over_lifetime' in result
    assert 'total_cost_of_ownership' in result
    
    assert isinstance(result['air_cooling_capex'], (int, float))
    assert isinstance(result['total_capex'], (int, float))
    assert isinstance(result['opex'], dict)
    assert isinstance(result['total_opex_over_lifetime'], dict)
    assert isinstance(result['total_cost_of_ownership'], (int, float))
    
    assert 'annual_opex' in result['opex']
    assert 'total_opex_over_lifetime' in result['total_opex_over_lifetime']
    
    # Verify total cost of ownership calculation
    expected_tco = result['total_capex'] + result['total_opex_over_lifetime']['total_opex_over_lifetime']
    assert abs(result['total_cost_of_ownership'] - expected_tco) < 0.01

def test_update_inputs_individual_fields(reset_inputs):
    test_inputs = {
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'project_location': 'United States'
    }
    
    update_inputs(test_inputs)
    
    assert data_hall_design_capacity_mw['data_hall_design_capacity_mw'] == 2.0
    assert first_year_of_operation['first_year_of_operation'] == 2024
    assert project_location['project_location'] == 'United States'

@pytest.mark.asyncio
async def test_calculate_structure(reset_inputs):
    update_inputs({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 10
    })
    
    result = await calculate()
    
    assert isinstance(result, dict)
    assert 'air_cooling_capex' in result
    assert 'total_capex' in result
    assert 'opex' in result
    assert 'total_opex_over_lifetime' in result
    assert 'total_cost_of_ownership' in result
    assert isinstance(result['air_cooling_capex'], (int, float))
    assert isinstance(result['total_capex'], (int, float))
    assert isinstance(result['opex'], dict)
    assert isinstance(result['total_opex_over_lifetime'], dict)
    assert isinstance(result['total_cost_of_ownership'], (int, float))

def test_update_inputs_unused_fields(reset_inputs):
    test_inputs = {
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'planned_years_of_operation': 10,
        'annualised_air_ppue': 1.5
    }
    
    update_inputs(test_inputs)
    
    # Check that all fields are updated correctly
    assert data_hall_design_capacity_mw['data_hall_design_capacity_mw'] == 1.0
    assert first_year_of_operation['first_year_of_operation'] == 2023
    assert project_location['project_location'] == 'United States'
    assert percentage_of_utilisation['%_of_utilisation'] == 0.8
    assert planned_years_of_operation['planned_years_of_operation'] == 10
    assert annualised_air_ppue['annualised_air_ppue'] == 1.5

@pytest.mark.asyncio
async def test_total_cost_of_ownership_calculation(reset_inputs):
    """Test that total cost of ownership is correctly calculated as CAPEX + lifetime OPEX"""
    update_inputs({
        'data_hall_design_capacity_mw': 1.5,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.75,
        'annualised_air_ppue': 1.25,
        'planned_years_of_operation': 12
    })
    
    result = await calculate()
    
    total_capex = result['total_capex']
    air_cooling_capex = result['air_cooling_capex']
    lifetime_opex = result['total_opex_over_lifetime']['total_opex_over_lifetime']
    tco = result['total_cost_of_ownership']
    
    assert isinstance(total_capex, (int, float))
    assert isinstance(air_cooling_capex, (int, float))
    assert isinstance(lifetime_opex, (int, float))
    assert isinstance(tco, (int, float))
    
    assert total_capex > 0
    assert air_cooling_capex > 0
    assert lifetime_opex > 0
    assert tco > 0
    
    # Air cooling capex should be part of total capex
    assert air_cooling_capex <= total_capex
    
    # TCO should equal total CAPEX + lifetime OPEX
    assert abs(tco - (total_capex + lifetime_opex)) < 0.01
    
    # TCO should be greater than either total CAPEX or lifetime OPEX alone
    assert tco > total_capex
    assert tco > lifetime_opex

@pytest.mark.asyncio
async def test_lifetime_opex_structure(reset_inputs):
    """Test that lifetime OPEX returns the expected structure"""
    update_inputs({
        'data_hall_design_capacity_mw': 1.0,
        'first_year_of_operation': 2023,
        'project_location': 'Singapore',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 8
    })
    
    result = await calculate()
    
    lifetime_opex = result['total_opex_over_lifetime']
    
    assert isinstance(lifetime_opex, dict)
    assert 'total_opex_over_lifetime' in lifetime_opex
    assert isinstance(lifetime_opex['total_opex_over_lifetime'], (int, float))
    assert lifetime_opex['total_opex_over_lifetime'] > 0
