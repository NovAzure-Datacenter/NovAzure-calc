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
    annualised_air_ppue,
    include_it_cost,
    data_center_type,
    air_rack_cooling_capacity_kw_per_rack,
)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    db_manager.connect()
    yield
    db_manager.disconnect()


@pytest.fixture
def reset_inputs():
    percentage_of_utilisation["%_of_utilisation"] = None
    planned_years_of_operation["planned_years_of_operation"] = None
    project_location["project_location"] = None
    data_hall_design_capacity_mw["data_hall_design_capacity_mw"] = None
    first_year_of_operation["first_year_of_operation"] = None
    annualised_air_ppue["annualised_air_ppue"] = None
    include_it_cost["include_it_cost"] = None
    data_center_type["data_center_type"] = None
    air_rack_cooling_capacity_kw_per_rack["air_rack_cooling_capacity_kw_per_rack"] = (
        None
    )
    import app.services.calculations.main as main_module

    main_module.advanced = False
    yield


@pytest.mark.asyncio
async def test_basic_mode_calculation(reset_inputs):
    inputs = {
        "data_hall_design_capacity_mw": 1.0,
        "first_year_of_operation": 2023,
        "project_location": "United States",
        "%_of_utilisation": 0.8,
        "annualised_air_ppue": 1.2,
        "planned_years_of_operation": 10,
        "advanced": False,
    }

    update_inputs(inputs)
    result = await calculate()

    assert isinstance(result, dict)
    assert "air_cooling" in result
    assert "chassis_immersion" in result
    assert "advanced_mode" in result
    assert "include_it_cost" in result

    assert not result["advanced_mode"]
    assert result["include_it_cost"] == "No"

    # Test air cooling structure
    air_cooling = result["air_cooling"]
    assert "cooling_equipment_capex" in air_cooling
    assert "it_equipment_capex" in air_cooling
    assert "total_capex" in air_cooling
    assert "opex" in air_cooling
    assert "total_opex_over_lifetime" in air_cooling
    assert "total_cost_of_ownership" in air_cooling

    # Test chassis immersion structure
    chassis_immersion = result["chassis_immersion"]
    assert "cooling_equipment_capex" in chassis_immersion
    assert "it_equipment_capex" in chassis_immersion
    assert "total_capex" in chassis_immersion
    assert "opex" in chassis_immersion
    assert "total_opex_over_lifetime" in chassis_immersion
    assert "total_cost_of_ownership" in chassis_immersion

    # Verify data types and values
    assert isinstance(air_cooling["cooling_equipment_capex"], (int, float))
    assert isinstance(chassis_immersion["cooling_equipment_capex"], (int, float))
    assert air_cooling["cooling_equipment_capex"] > 0
    assert chassis_immersion["cooling_equipment_capex"] > 0

    # In basic mode, IT equipment CAPEX should be 0
    assert air_cooling["it_equipment_capex"] == 0
    assert chassis_immersion["it_equipment_capex"] == 0


@pytest.mark.asyncio
async def test_advanced_mode_without_it_cost(reset_inputs):
    inputs = {
        "data_hall_design_capacity_mw": 1.0,
        "first_year_of_operation": 2023,
        "project_location": "United States",
        "%_of_utilisation": 0.8,
        "annualised_air_ppue": 1.2,
        "planned_years_of_operation": 10,
        "advanced": True,
        "include_it_cost": "No",
    }

    update_inputs(inputs)
    result = await calculate()

    assert result["include_it_cost"] == "No"

    # Even in advanced mode, if include_it_cost is 'No', IT CAPEX should be 0
    assert result["air_cooling"]["it_equipment_capex"] == 0
    assert result["chassis_immersion"]["it_equipment_capex"] == 0

    # Total CAPEX should equal cooling equipment CAPEX when no IT cost
    assert (
        result["air_cooling"]["total_capex"]
        == result["air_cooling"]["cooling_equipment_capex"]
    )
    assert (
        result["chassis_immersion"]["total_capex"]
        == result["chassis_immersion"]["cooling_equipment_capex"]
    )


@pytest.mark.asyncio
async def test_advanced_mode_with_it_cost(reset_inputs):
    inputs = {
        "data_hall_design_capacity_mw": 1.0,
        "first_year_of_operation": 2023,
        "project_location": "United States",
        "%_of_utilisation": 0.8,
        "annualised_air_ppue": 1.2,
        "planned_years_of_operation": 10,
        "advanced": True,
        "include_it_cost": "Yes",
        "data_center_type": "General Purpose",
        "air_rack_cooling_capacity_kw_per_rack": 16,
    }

    update_inputs(inputs)
    result = await calculate()

    assert result["advanced_mode"]
    assert result["include_it_cost"] == "Yes"

    # IT equipment CAPEX should be greater than 0 when included
    assert result["air_cooling"]["it_equipment_capex"] > 0
    assert result["chassis_immersion"]["it_equipment_capex"] > 0

    # IT CAPEX should be the same for both cooling solutions
    assert (
        result["air_cooling"]["it_equipment_capex"]
        == result["chassis_immersion"]["it_equipment_capex"]
    )

    # Total CAPEX should include IT costs
    expected_air_total = (
        result["air_cooling"]["cooling_equipment_capex"]
        + result["air_cooling"]["it_equipment_capex"]
    )
    expected_chassis_total = (
        result["chassis_immersion"]["cooling_equipment_capex"]
        + result["chassis_immersion"]["it_equipment_capex"]
    )

    assert result["air_cooling"]["total_capex"] == expected_air_total
    assert result["chassis_immersion"]["total_capex"] == expected_chassis_total


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "country,capacity",
    [
        ("United States", 1.0),
        ("Singapore", 2.0),
        ("United Kingdom", 0.5),
        ("United Arab Emirates", 1.5),
    ],
)
async def test_different_countries_and_capacities(reset_inputs, country, capacity):
    inputs = {
        "data_hall_design_capacity_mw": capacity,
        "first_year_of_operation": 2023,
        "project_location": country,
        "%_of_utilisation": 0.8,
        "annualised_air_ppue": 1.2,
        "planned_years_of_operation": 10,
        "advanced": False,
    }

    update_inputs(inputs)
    result = await calculate()

    assert result["air_cooling"]["cooling_equipment_capex"] > 0
    assert result["chassis_immersion"]["cooling_equipment_capex"] > 0

    # Chassis immersion should generally be more expensive than air cooling
    assert (
        result["chassis_immersion"]["cooling_equipment_capex"]
        > result["air_cooling"]["cooling_equipment_capex"]
    )


@pytest.mark.asyncio
async def test_total_cost_of_ownership_calculation(reset_inputs):
    inputs = {
        "data_hall_design_capacity_mw": 1.0,
        "first_year_of_operation": 2023,
        "project_location": "United States",
        "%_of_utilisation": 0.8,
        "annualised_air_ppue": 1.2,
        "planned_years_of_operation": 10,
        "advanced": False,
    }

    update_inputs(inputs)
    result = await calculate()

    air_cooling = result["air_cooling"]
    chassis_immersion = result["chassis_immersion"]

    # Air cooling TCO should equal total capex + lifetime opex
    expected_air_tco = (
        air_cooling["total_capex"]
        + air_cooling["total_opex_over_lifetime"]["total_opex_over_lifetime"]
    )
    assert abs(air_cooling["total_cost_of_ownership"] - expected_air_tco) < 0.01

    # Chassis immersion TCO should equal total capex (no opex yet)
    expected_chassis_tco = chassis_immersion["total_capex"]
    assert (
        abs(chassis_immersion["total_cost_of_ownership"] - expected_chassis_tco) < 0.01
    )


def test_update_inputs_functionality(reset_inputs):
    test_inputs = {
        "data_hall_design_capacity_mw": 2.0,
        "first_year_of_operation": 2024,
        "project_location": "Singapore",
        "%_of_utilisation": 0.7,
        "annualised_air_ppue": 1.3,
        "planned_years_of_operation": 15,
        "advanced": True,
        "include_it_cost": "Yes",
        "data_center_type": "HPC/AI",
        "air_rack_cooling_capacity_kw_per_rack": 20,
    }

    update_inputs(test_inputs)

    assert data_hall_design_capacity_mw["data_hall_design_capacity_mw"] == 2.0
    assert first_year_of_operation["first_year_of_operation"] == 2024
    assert project_location["project_location"] == "Singapore"
    assert percentage_of_utilisation["%_of_utilisation"] == 0.7
    assert annualised_air_ppue["annualised_air_ppue"] == 1.3
    assert planned_years_of_operation["planned_years_of_operation"] == 15
    assert include_it_cost["include_it_cost"] == "Yes"
    assert data_center_type["data_center_type"] == "HPC/AI"
    assert (
        air_rack_cooling_capacity_kw_per_rack["air_rack_cooling_capacity_kw_per_rack"]
        == 20
    )

    import app.services.calculations.main as main_module

    assert main_module.advanced


@pytest.mark.asyncio
async def test_hpc_ai_vs_general_purpose(reset_inputs):
    base_inputs = {
        "data_hall_design_capacity_mw": 1.0,
        "first_year_of_operation": 2023,
        "project_location": "United States",
        "%_of_utilisation": 0.8,
        "annualised_air_ppue": 1.2,
        "planned_years_of_operation": 10,
        "advanced": True,
        "include_it_cost": "Yes",
        "air_rack_cooling_capacity_kw_per_rack": 16,
    }

    # Test General Purpose
    gp_inputs = {**base_inputs, "data_center_type": "General Purpose"}
    update_inputs(gp_inputs)
    gp_result = await calculate()

    # Test HPC/AI
    hpc_inputs = {**base_inputs, "data_center_type": "HPC/AI"}
    update_inputs(hpc_inputs)
    hpc_result = await calculate()

    # HPC/AI should have higher IT costs due to more expensive servers
    assert (
        hpc_result["air_cooling"]["it_equipment_capex"]
        > gp_result["air_cooling"]["it_equipment_capex"]
    )
    assert (
        hpc_result["chassis_immersion"]["it_equipment_capex"]
        > gp_result["chassis_immersion"]["it_equipment_capex"]
    )
    assert (
        hpc_result["air_cooling"]["total_capex"]
        > gp_result["air_cooling"]["total_capex"]
    )
    assert (
        hpc_result["chassis_immersion"]["total_capex"]
        > gp_result["chassis_immersion"]["total_capex"]
    )

    # Cooling equipment CAPEX should be the same for both
    assert (
        hpc_result["air_cooling"]["cooling_equipment_capex"]
        == gp_result["air_cooling"]["cooling_equipment_capex"]
    )
    assert (
        hpc_result["chassis_immersion"]["cooling_equipment_capex"]
        == gp_result["chassis_immersion"]["cooling_equipment_capex"]
    )
