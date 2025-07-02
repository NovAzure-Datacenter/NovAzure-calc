import pytest
from app.database.connection import db_manager
from app.services.calculations.main import (
    update_inputs,
    calculate,
    calculate_it_capex,
    percentage_of_utilisation,
    planned_years_of_operation,
    project_location,
    data_hall_design_capacity_mw,
    first_year_of_operation,
    annualised_air_ppue,
    # IT Configuration inputs
    include_it_cost,
    data_center_type,
    air_rack_cooling_capacity_kw_per_rack
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
    # Reset IT Configuration inputs
    include_it_cost['include_it_cost'] = None
    data_center_type['data_center_type'] = None
    air_rack_cooling_capacity_kw_per_rack['air_rack_cooling_capacity_kw_per_rack'] = None
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

# =============================================================================
# IT CAPEX INTEGRATION TESTS
# =============================================================================

def test_update_inputs_with_it_configuration(reset_inputs):
    """Test that update_inputs correctly handles IT configuration inputs."""
    test_inputs = {
        'include_it_cost': 'yes',
        'data_center_type': 'HPC/AI',
        'air_rack_cooling_capacity_kw_per_rack': 12.0,
        'data_hall_design_capacity_mw': 10.0,
    }
    
    update_inputs(test_inputs)
    
    assert include_it_cost['include_it_cost'] == 'yes'
    assert data_center_type['data_center_type'] == 'HPC/AI'
    assert air_rack_cooling_capacity_kw_per_rack['air_rack_cooling_capacity_kw_per_rack'] == 12.0


@pytest.mark.parametrize("capacity_mw,dc_type,cooling_capacity,planned_years,expected_keys", [
    (10.0, "General Purpose", 12.0, 10, ['it_servers_capex', 'it_refresh_capex', 'total_it_capex', 'estimated_servers', 'estimated_racks']),
    (5.0, "HPC/AI", 15.0, 15, ['it_servers_capex', 'it_refresh_capex', 'total_it_capex', 'estimated_servers', 'estimated_racks']),
    (None, "General Purpose", 12.0, 10, ['it_servers_capex', 'it_refresh_capex', 'total_it_capex', 'estimated_servers', 'estimated_racks']),
])
def test_calculate_it_capex_structure(capacity_mw, dc_type, cooling_capacity, planned_years, expected_keys):
    """Test that calculate_it_capex returns the expected structure."""
    result = calculate_it_capex(capacity_mw, dc_type, cooling_capacity, planned_years)
    
    # Check that all expected keys are present
    for key in expected_keys:
        assert key in result
    
    # Check that values are numeric (or 0 for invalid inputs)
    assert isinstance(result['total_it_capex'], (int, float))
    assert isinstance(result['estimated_servers'], int)
    assert isinstance(result['estimated_racks'], int)


@pytest.mark.parametrize("capacity_mw,dc_type,cooling_capacity,planned_years", [
    (10.0, "General Purpose", 12.0, 10),
    (5.0, "HPC/AI", 15.0, 15),
    (20.0, "General Purpose", 10.0, 5),
])
def test_calculate_it_capex_valid_inputs(capacity_mw, dc_type, cooling_capacity, planned_years):
    """Test calculate_it_capex with valid inputs."""
    result = calculate_it_capex(capacity_mw, dc_type, cooling_capacity, planned_years)
    
    # Should have positive values for valid inputs
    assert result['total_it_capex'] > 0
    assert result['estimated_servers'] > 0
    assert result['estimated_racks'] > 0
    
    # Initial server CAPEX should be positive
    assert result['it_servers_capex'] > 0
    
    # Refresh CAPEX should be non-negative (could be 0 for short periods)
    assert result['it_refresh_capex'] >= 0
    
    # Total should equal servers + refresh
    assert result['total_it_capex'] == result['it_servers_capex'] + result['it_refresh_capex']


@pytest.mark.parametrize("capacity_mw,dc_type,cooling_capacity,planned_years", [
    (None, "General Purpose", 12.0, 10),    # Missing capacity
    (10.0, None, 12.0, 10),                # Missing DC type
    (10.0, "General Purpose", None, 10),    # Missing cooling capacity
    (10.0, "Invalid Type", 12.0, 10),      # Invalid DC type
])
def test_calculate_it_capex_invalid_inputs(capacity_mw, dc_type, cooling_capacity, planned_years):
    """Test calculate_it_capex with invalid inputs."""
    result = calculate_it_capex(capacity_mw, dc_type, cooling_capacity, planned_years)
    
    # Should return zero values for invalid inputs
    assert result['total_it_capex'] == 0
    assert result['estimated_servers'] == 0
    assert result['estimated_racks'] == 0
    assert result['it_servers_capex'] == 0
    assert result['it_refresh_capex'] == 0


def test_calculate_it_capex_server_estimation_logic():
    """Test the server estimation logic in calculate_it_capex."""
    capacity_mw = 10.0  # 10MW data hall
    dc_type = "General Purpose"  # 1kW per server
    cooling_capacity = 12.0  # 12kW per rack
    planned_years = 10
    
    result = calculate_it_capex(capacity_mw, dc_type, cooling_capacity, planned_years)
    
    # For 10MW at 80% utilization = 8MW = 8000kW IT capacity
    # General Purpose servers use 1kW each: 8000kW / 1kW = 8000 servers
    expected_servers = 8000
    assert result['estimated_servers'] == expected_servers
    
    # Max 12 servers per rack (12kW / 1kW), so 8000 servers / 12 = 666.67 -> 667 racks
    expected_racks = 667  # math.floor(8000/12) + 1
    assert result['estimated_racks'] == expected_racks


def test_calculate_it_capex_hpc_vs_general_purpose():
    """Test cost differences between HPC/AI and General Purpose."""
    capacity_mw = 5.0
    cooling_capacity = 12.0
    planned_years = 10
    
    gp_result = calculate_it_capex(capacity_mw, "General Purpose", cooling_capacity, planned_years)
    hpc_result = calculate_it_capex(capacity_mw, "HPC/AI", cooling_capacity, planned_years)
    
    # HPC/AI should have higher cost per server but fewer total servers
    # (same power budget, but 2kW per server vs 1kW)
    assert hpc_result['estimated_servers'] == gp_result['estimated_servers'] // 2
    assert hpc_result['total_it_capex'] > gp_result['total_it_capex']


@pytest.mark.asyncio
async def test_calculate_with_it_costs_included(reset_inputs):
    """Test main calculate function with IT costs included."""
    # Set up basic inputs
    inputs = {
        'data_hall_design_capacity_mw': 5.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 10,
        # IT Configuration
        'include_it_cost': 'yes',
        'data_center_type': 'General Purpose',
        'air_rack_cooling_capacity_kw_per_rack': 12.0
    }
    
    update_inputs(inputs)
    result = await calculate()
    
    # Should include IT CAPEX breakdown
    assert 'it_capex' in result
    assert 'total_it_capex' in result['it_capex']
    assert result['it_capex']['total_it_capex'] > 0
    
    # Total CAPEX should include both cooling and IT
    assert 'total_capex' in result
    assert result['total_capex'] > result['air_cooling_capex']
    
    # Should indicate IT costs were included
    assert result['include_it_cost'] == 'yes'


@pytest.mark.asyncio
async def test_calculate_with_it_costs_excluded(reset_inputs):
    """Test main calculate function with IT costs excluded."""
    inputs = {
        'data_hall_design_capacity_mw': 5.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 10,
        # IT Configuration - explicitly exclude
        'include_it_cost': 'no',
        'data_center_type': 'General Purpose',
        'air_rack_cooling_capacity_kw_per_rack': 12.0
    }
    
    update_inputs(inputs)
    result = await calculate()
    
    # IT CAPEX should be zero
    assert 'it_capex' in result
    assert result['it_capex']['total_it_capex'] == 0
    
    # Total CAPEX should equal cooling CAPEX only
    assert result['total_capex'] == result['air_cooling_capex']
    
    # Should indicate IT costs were not included
    assert result['include_it_cost'] == 'no'


@pytest.mark.asyncio
async def test_calculate_without_it_configuration(reset_inputs):
    """Test main calculate function without IT configuration inputs."""
    inputs = {
        'data_hall_design_capacity_mw': 5.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 10
        # No IT configuration inputs
    }
    
    update_inputs(inputs)
    result = await calculate()
    
    # IT CAPEX should be zero (no IT configuration provided)
    assert 'it_capex' in result
    assert result['it_capex']['total_it_capex'] == 0
    
    # Total CAPEX should equal cooling CAPEX only
    assert result['total_capex'] == result['air_cooling_capex']
    
    # Should indicate IT costs were not included
    assert result['include_it_cost'] == 'No'


@pytest.mark.parametrize("include_it_value,should_include", [
    ("yes", True),
    ("Yes", True),
    ("YES", True),
    ("true", True),
    ("True", True),
    ("1", True),
    ("no", False),
    ("No", False),
    ("false", False),
    ("0", False),
    ("", False),
    ("maybe", False),  # Invalid value should default to False
])
@pytest.mark.asyncio
async def test_calculate_it_cost_inclusion_logic(reset_inputs, include_it_value, should_include):
    """Test different values for include_it_cost parameter."""
    inputs = {
        'data_hall_design_capacity_mw': 5.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 10,
        'include_it_cost': include_it_value,
        'data_center_type': 'General Purpose',
        'air_rack_cooling_capacity_kw_per_rack': 12.0
    }
    
    update_inputs(inputs)
    result = await calculate()
    
    if should_include:
        # IT costs should be included
        assert result['it_capex']['total_it_capex'] > 0
        assert result['total_capex'] > result['air_cooling_capex']
    else:
        # IT costs should not be included
        assert result['it_capex']['total_it_capex'] == 0
        assert result['total_capex'] == result['air_cooling_capex']


@pytest.mark.asyncio
async def test_calculate_total_cost_of_ownership_with_it(reset_inputs):
    """Test that total cost of ownership includes IT costs when enabled."""
    inputs = {
        'data_hall_design_capacity_mw': 5.0,
        'first_year_of_operation': 2023,
        'project_location': 'United States',
        '%_of_utilisation': 0.8,
        'annualised_air_ppue': 1.2,
        'planned_years_of_operation': 10,
        'include_it_cost': 'yes',
        'data_center_type': 'General Purpose',
        'air_rack_cooling_capacity_kw_per_rack': 12.0
    }
    
    update_inputs(inputs)
    result = await calculate()
    
    # Total cost of ownership should include IT CAPEX
    expected_tco = result['total_capex'] + result['total_opex_over_lifetime']['total_opex_over_lifetime']
    assert result['total_cost_of_ownership'] == expected_tco
    
    # TCO should be higher than just cooling costs
    cooling_only_tco = result['air_cooling_capex'] + result['total_opex_over_lifetime']['total_opex_over_lifetime']
    assert result['total_cost_of_ownership'] > cooling_only_tco


# =============================================================================
# IT CAPEX REFRESH LOGIC TESTS
# =============================================================================

@pytest.mark.parametrize("planned_years,expected_refreshes", [
    (3, 0),   # No refreshes needed
    (5, 0),   # Exactly 5 years, no refresh
    (6, 1),   # After 5 years, 1 refresh
    (10, 1),  # Exactly 10 years, 1 refresh  
    (11, 2),  # After 10 years, 2 refreshes
    (15, 2),  # Exactly 15 years, 2 refreshes
    (16, 3),  # After 15 years, 3 refreshes
])
def test_it_capex_refresh_calculation(planned_years, expected_refreshes):
    """Test server refresh calculation in IT CAPEX."""
    capacity_mw = 5.0
    dc_type = "General Purpose"
    cooling_capacity = 12.0
    
    result = calculate_it_capex(capacity_mw, dc_type, cooling_capacity, planned_years)
    
    if expected_refreshes == 0:
        assert result['it_refresh_capex'] == 0
    else:
        # Refresh CAPEX should be initial CAPEX × number of refreshes
        expected_refresh_capex = result['it_servers_capex'] * expected_refreshes
        assert result['it_refresh_capex'] == expected_refresh_capex
