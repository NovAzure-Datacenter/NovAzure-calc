import pytest
from app.database.connection import db_manager
from app.services.calculations.main import update_inputs, calculate


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    db_manager.connect()
    yield
    db_manager.disconnect()


@pytest.mark.asyncio
async def test_cooling_solutions_comparison():
    inputs = {
        "data_hall_design_capacity_mw": 1.0,
        "first_year_of_operation": 2025,
        "project_location": "United States",
        "percentage_of_utilisation": 0.8,
        "annualised_air_ppue": 1.2,
        "planned_years_of_operation": 10,
        "advanced": False,
    }

    update_inputs(inputs)
    result = await calculate()

    assert "air_cooling_solution" in result
    assert "chassis_immersion_solution" in result

    air_cooling = result["air_cooling_solution"]
    chassis_immersion = result["chassis_immersion_solution"]

    assert air_cooling["cooling_equipment_capex"] > 0
    assert air_cooling["total_capex"] > 0
    assert chassis_immersion["cooling_equipment_capex"] > 0
    assert chassis_immersion["total_capex"] > 0

    assert (
        air_cooling["cooling_equipment_capex"]
        < chassis_immersion["cooling_equipment_capex"]
    )
    assert air_cooling["total_capex"] < chassis_immersion["total_capex"]
    assert air_cooling["annual_cooling_opex"] > chassis_immersion["annual_cooling_opex"]
    assert (
        air_cooling["total_opex_over_lifetime"]
        > chassis_immersion["total_opex_over_lifetime"]
    )
    assert air_cooling["tco_excluding_it"] > chassis_immersion["tco_excluding_it"]
    assert air_cooling["tco_including_it"] > chassis_immersion["tco_including_it"]
