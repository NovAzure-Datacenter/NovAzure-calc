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
        'annualised_air_ppue': 1.2
    },
    {
        'data_hall_design_capacity_mw': 2.0,
        'first_year_of_operation': 2024,
        'project_location': 'Singapore',
        '%_of_utilisation': 0.7,
        'annualised_air_ppue': 1.3
    },
    {
        'data_hall_design_capacity_mw': 0.5,
        'first_year_of_operation': 2025,
        'project_location': 'United Kingdom',
        '%_of_utilisation': 0.9,
        'annualised_air_ppue': 1.1
    },
])
async def test_update_inputs_and_calculate(reset_inputs, inputs):
    update_inputs(inputs)
    result = await calculate()
    
    assert isinstance(result, dict)
    assert 'capex' in result
    assert 'opex' in result
    assert isinstance(result['capex'], dict)
    assert isinstance(result['opex'], dict)
    assert 'total_capex' in result['capex']
    assert 'annual_opex' in result['opex']

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
        'annualised_air_ppue': 1.2
    })
    
    result = await calculate()
    
    assert isinstance(result, dict)
    assert 'capex' in result
    assert 'opex' in result
    assert isinstance(result['capex'], dict)
    assert isinstance(result['opex'], dict)

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
