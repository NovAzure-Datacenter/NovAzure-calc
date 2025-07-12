import pytest
from app.database.connection import db_manager
from app.services.calculations.main import update_inputs, calculate


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    db_manager.connect()
    yield
    db_manager.disconnect()


@pytest.mark.asyncio
async def test_basic_air_cooling_solutions_calculation():
    inputs = {
        "solution_type": "air_cooling",
        "data_hall_design_capacity_mw": 2.0,
        "solution_type": "air_cooling",
        "data_hall_design_capacity_mw": 2.0,
        "first_year_of_operation": 2025,
        "project_location": "United States",
        "percentage_of_utilisation": 0.8,
        "annualised_ppue": 1.26,
        "planned_years_of_operation": 10,
        "advanced": False,
    }

    update_inputs(inputs)
    result = await calculate(inputs["solution_type"])
    result = await calculate(inputs["solution_type"])

    assert "cooling_equipment_capex" in result
    assert "it_equipment_capex" in result
    assert "total_capex" in result
    assert "annual_cooling_opex" in result
    assert "annual_it_maintenance" in result
    assert "total_opex_over_lifetime" in result
    assert "tco_excluding_it" in result

    assert 8100000 > result["cooling_equipment_capex"] > 7900000
    assert result["it_equipment_capex"] == 0
    assert 3000000 > result["annual_cooling_opex"] > 2500000
    assert 30000000 > result["total_opex_over_lifetime"] > 25000000
    assert (
        result["tco_excluding_it"]
        == result["total_opex_over_lifetime"] + result["cooling_equipment_capex"]
    )
    assert result["tco_including_it"] == result["tco_excluding_it"]


@pytest.mark.asyncio
async def test_IT_cost_air_cooling_solutions_calculation():
    inputs = {
        "solution_type": "air_cooling",
        "data_hall_design_capacity_mw": 2.0,
        "first_year_of_operation": 2025,
        "project_location": "United States",
        "percentage_of_utilisation": 0.8,
        "annualised_ppue": 1.26,
        "planned_years_of_operation": 10,
        "advanced": True,
        "include_it_cost": "yes",
    }

    update_inputs(inputs)
    result = await calculate(inputs["solution_type"])

    assert result["it_equipment_capex"] > 0
    # assert 35000000 > result["it_equipment_capex"] > 30000000
    assert result["tco_excluding_it"] < result["tco_including_it"]
    assert (
        result["tco_excluding_it"]
        == result["total_opex_over_lifetime"]
        - result["annual_it_maintenance"]
        + result["cooling_equipment_capex"]
    )
    assert (
        result["tco_including_it"]
        == result["total_opex_over_lifetime"] + result["total_capex"]
    )


@pytest.mark.asyncio
async def test_basic_chassis_cooling_solutions_calculation():
    inputs = {
        "solution_type": "chassis_immersion",
        "data_hall_design_capacity_mw": 2.0,
        "first_year_of_operation": 2025,
        "project_location": "United States",
        "percentage_of_utilisation": 0.8,
        "annualised_ppue": 1.06,
        "planned_years_of_operation": 10,
        "advanced": False,
    }

    update_inputs(inputs)
    result = await calculate(inputs["solution_type"])

    assert "cooling_equipment_capex" in result
    assert "it_equipment_capex" in result
    assert "total_capex" in result
    assert "annual_cooling_opex" in result
    assert "annual_it_maintenance" in result
    assert "total_opex_over_lifetime" in result
    assert "tco_excluding_it" in result

    assert 9000000 > result["cooling_equipment_capex"] > 6000000
    assert result["it_equipment_capex"] == 0
    assert 2500000 > result["annual_cooling_opex"] > 1500000
    assert 25000000 > result["total_opex_over_lifetime"] > 15000000
    assert (
        result["tco_excluding_it"]
        == result["total_opex_over_lifetime"] + result["cooling_equipment_capex"]
    )
    assert result["tco_including_it"] == result["tco_excluding_it"]
