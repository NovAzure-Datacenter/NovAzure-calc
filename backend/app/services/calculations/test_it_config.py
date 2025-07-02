import pytest
import math
from app.services.calculations.it_config import (
    # Power and Hardware Functions
    calculate_server_rated_max_power,
    calculate_number_of_server_refreshes,
    
    # CPU Cost Functions
    calculate_total_cpu_price_per_server,
    
    # Memory Cost Functions
    calculate_total_channels,
    calculate_total_memory_cost_per_server,
    
    # Network Cost Functions
    calculate_switches_per_rack,
    calculate_total_switch_cost,
    calculate_total_network_cost_per_rack,
    calculate_total_network_cost_per_server,
    
    # BOM Functions
    calculate_server_l2_bom,
    
    # Total IT Cost Functions
    calculate_total_it_cost_per_server,
    calculate_typical_it_cost_per_server,
    
    # Rack Capacity Functions
    calculate_maximum_number_of_chassis_per_rack_for_air,
    calculate_total_air_power_kw_per_rack,
    
    # Default Values
    DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER,
    DEFAULT_CPU_PRICE_PER_UNIT,
    DEFAULT_SERVERS_PER_RACK,
    DEFAULT_DIMM_CAPACITY_IN_GB,
    DEFAULT_DIMM_COST_PER_GB,
    DEFAULT_DDRS_6400_CHANNELS,
    DEFAULT_NETWORK_CABLE_COST_PER_SERVER,
    DEFAULT_SWITCH_COST_PER_UNIT,
    DEFAULT_25_SERVER_L2_BOM,
    DEFAULT_HPC_AI_COST_PER_SERVER,
)

# =============================================================================
# POWER AND HARDWARE CALCULATIONS TESTS
# =============================================================================

@pytest.mark.parametrize("data_center_type,expected", [
    ("General Purpose", 1),
    ("HPC/AI", 2),
    ("Select an Option", ""),  # Unselected option
    ("Invalid Type", None),     # Invalid type
    ("", None),                 # Empty string
])
def test_calculate_server_rated_max_power(data_center_type, expected):
    """Test server power calculation for different data center types."""
    result = calculate_server_rated_max_power(data_center_type)
    assert result == expected


@pytest.mark.parametrize("contract_duration,expected", [
    (0, 0),    # No contract
    (3, 0),    # Too short
    (4, 0),    # Borderline
    (5, 0),    # 5 years - no refresh needed
    (6, 1),    # 6 years - 1 refresh
    (7, 1),    # 7 years - 1 refresh
    (10, 1),   # 10 years - 1 refresh
    (11, 2),   # 11 years - 2 refreshes
    (15, 2),   # 15 years - 2 refreshes
    (16, 3),   # 16 years - 3 refreshes
])
def test_calculate_number_of_server_refreshes(contract_duration, expected):
    """Test server refresh calculation for different contract durations."""
    result = calculate_number_of_server_refreshes(contract_duration)
    assert result == expected


# =============================================================================
# CPU COST CALCULATION TESTS
# =============================================================================

def test_calculate_total_cpu_price_per_server_defaults():
    """Test CPU cost calculation with default values."""
    result = calculate_total_cpu_price_per_server()
    expected = DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER * DEFAULT_CPU_PRICE_PER_UNIT
    assert result == expected


@pytest.mark.parametrize("cpu_count,cpu_price,expected", [
    (1, 2000, 2000),
    (2, 2400, 4800),
    (4, 3000, 12000),
    (2, 1500, 3000),
])
def test_calculate_total_cpu_price_per_server_custom(cpu_count, cpu_price, expected):
    """Test CPU cost calculation with custom values."""
    result = calculate_total_cpu_price_per_server(cpu_count, cpu_price)
    assert result == expected


# =============================================================================
# MEMORY COST CALCULATION TESTS
# =============================================================================

def test_calculate_total_channels_defaults():
    """Test memory channel calculation with defaults."""
    result = calculate_total_channels()
    expected = DEFAULT_DDRS_6400_CHANNELS * DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    assert result == expected


@pytest.mark.parametrize("channels_per_cpu,cpu_count,expected", [
    (8, 1, 8),
    (12, 2, 24),
    (16, 2, 32),
    (8, 4, 32),
])
def test_calculate_total_channels_custom(channels_per_cpu, cpu_count, expected):
    """Test memory channel calculation with custom values."""
    result = calculate_total_channels(channels_per_cpu, cpu_count)
    assert result == expected


def test_calculate_total_memory_cost_per_server_defaults():
    """Test memory cost calculation with defaults."""
    result = calculate_total_memory_cost_per_server()
    expected_channels = DEFAULT_DDRS_6400_CHANNELS * DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    expected = expected_channels * DEFAULT_DIMM_CAPACITY_IN_GB * DEFAULT_DIMM_COST_PER_GB
    assert result == expected


@pytest.mark.parametrize("total_channels,memory_per_channel,cost_per_gb,expected", [
    (24, 64, 3, 4608),   # 24 * 64 * 3 = 4608
    (16, 96, 4, 6144),   # 16 * 96 * 4 = 6144
    (32, 128, 5, 20480), # 32 * 128 * 5 = 20480
])
def test_calculate_total_memory_cost_per_server_custom(total_channels, memory_per_channel, cost_per_gb, expected):
    """Test memory cost calculation with custom values."""
    result = calculate_total_memory_cost_per_server(total_channels, memory_per_channel, cost_per_gb)
    assert result == expected


# =============================================================================
# NETWORK COST CALCULATION TESTS
# =============================================================================

@pytest.mark.parametrize("servers_per_rack,expected", [
    (1, 2),    # Even 1 server needs 2 switches
    (14, 2),   # Standard rack
    (16, 2),   # 16 servers still 2 switches
    (17, 2),   # 17 servers still 2 switches
    (32, 2),   # 32 servers still 2 switches
    (33, 3),   # 33 servers need 3 switches
])
def test_calculate_switches_per_rack(servers_per_rack, expected):
    """Test switch count calculation for different server counts."""
    result = calculate_switches_per_rack(servers_per_rack)
    assert result == expected


def test_calculate_total_switch_cost_defaults():
    """Test switch cost calculation with defaults."""
    result = calculate_total_switch_cost()
    switches = calculate_switches_per_rack()
    expected = switches * DEFAULT_SWITCH_COST_PER_UNIT
    assert result == expected


@pytest.mark.parametrize("switch_cost,switches_per_rack,expected", [
    (8000, 2, 16000),
    (10000, 3, 30000),
    (6000, 2, 12000),
])
def test_calculate_total_switch_cost_custom(switch_cost, switches_per_rack, expected):
    """Test switch cost calculation with custom values."""
    result = calculate_total_switch_cost(switch_cost, switches_per_rack)
    assert result == expected


def test_calculate_total_network_cost_per_rack_defaults():
    """Test network cost per rack with defaults."""
    result = calculate_total_network_cost_per_rack()
    switch_cost = calculate_total_switch_cost()
    cable_cost = DEFAULT_NETWORK_CABLE_COST_PER_SERVER * DEFAULT_SERVERS_PER_RACK
    expected = switch_cost + cable_cost
    assert result == expected


def test_calculate_total_network_cost_per_server_defaults():
    """Test network cost per server with defaults."""
    result = calculate_total_network_cost_per_server()
    rack_cost = calculate_total_network_cost_per_rack()
    expected = rack_cost / DEFAULT_SERVERS_PER_RACK
    assert result == expected


# =============================================================================
# BOM CALCULATION TESTS
# =============================================================================

def test_calculate_server_l2_bom():
    """Test server BOM calculation."""
    result = calculate_server_l2_bom()
    assert result == DEFAULT_25_SERVER_L2_BOM


# =============================================================================
# TOTAL IT COST CALCULATION TESTS
# =============================================================================

def test_calculate_total_it_cost_per_server_defaults():
    """Test total IT cost calculation with all defaults."""
    cpu_cost = calculate_total_cpu_price_per_server()
    memory_cost = calculate_total_memory_cost_per_server()
    network_cost = calculate_total_network_cost_per_server()
    bom_cost = calculate_server_l2_bom()
    expected = cpu_cost + memory_cost + network_cost + bom_cost
    
    result = calculate_total_it_cost_per_server()
    assert math.isclose(result, expected, rel_tol=1e-9)


@pytest.mark.parametrize("cpu_cost,memory_cost,network_cost,bom_cost,expected", [
    (5000, 8000, 1200, 1000, 15200),
    (6000, 12000, 1500, 1200, 20700),
    (4000, 6000, 1000, 800, 11800),
])
def test_calculate_total_it_cost_per_server_custom(cpu_cost, memory_cost, network_cost, bom_cost, expected):
    """Test total IT cost calculation with custom values."""
    result = calculate_total_it_cost_per_server(cpu_cost, memory_cost, network_cost, bom_cost)
    assert result == expected


@pytest.mark.parametrize("data_center_type,expected_type", [
    ("General Purpose", "calculated"),  # Should use calculated cost
    ("HPC/AI", "default_hpc"),          # Should use HPC default
    ("Other Type", "default_hpc"),      # Should default to HPC cost
])
def test_calculate_typical_it_cost_per_server(data_center_type, expected_type):
    """Test typical IT cost calculation for different data center types."""
    result = calculate_typical_it_cost_per_server(data_center_type)
    
    if expected_type == "calculated":
        # For General Purpose, should match calculated total
        expected = calculate_total_it_cost_per_server()
        assert math.isclose(result, expected, rel_tol=1e-9)
    elif expected_type == "default_hpc":
        # For HPC/AI, should use fixed cost
        assert result == DEFAULT_HPC_AI_COST_PER_SERVER


# =============================================================================
# RACK CAPACITY CALCULATION TESTS
# =============================================================================

@pytest.mark.parametrize("rack_capacity_kw,data_center_type,expected", [
    (10, "General Purpose", 10),  # 10 kW / 1 kW per server = 10 servers
    (10, "HPC/AI", 5),            # 10 kW / 2 kW per server = 5 servers
    (12, "General Purpose", 12),  # 12 kW / 1 kW per server = 12 servers
    (12, "HPC/AI", 6),            # 12 kW / 2 kW per server = 6 servers
    (15, "HPC/AI", 7),            # 15 kW / 2 kW per server = 7.5 -> 7 servers
    (0, "General Purpose", 0),    # No capacity
    (None, "General Purpose", 0), # None capacity
    (-5, "HPC/AI", 0),            # Negative capacity
])
def test_calculate_maximum_number_of_chassis_per_rack_for_air_valid(rack_capacity_kw, data_center_type, expected):
    """Test rack capacity calculation for valid data center types."""
    result = calculate_maximum_number_of_chassis_per_rack_for_air(rack_capacity_kw, data_center_type)
    assert result == expected


@pytest.mark.parametrize("rack_capacity_kw,data_center_type,expected", [
    (10, "Select an Option", 0),  # Unselected option
    (10, "Invalid Type", 0),      # Invalid type
    (10, None, 0),                # None type
])
def test_calculate_maximum_number_of_chassis_per_rack_for_air_invalid(rack_capacity_kw, data_center_type, expected):
    """Test rack capacity calculation for invalid data center types."""
    result = calculate_maximum_number_of_chassis_per_rack_for_air(rack_capacity_kw, data_center_type)
    assert result == expected


@pytest.mark.parametrize("chassis_count,data_center_type,expected", [
    (5, "General Purpose", 5),   # 5 servers * 1 kW = 5 kW
    (5, "HPC/AI", 10),           # 5 servers * 2 kW = 10 kW
    (10, "General Purpose", 10), # 10 servers * 1 kW = 10 kW
    (10, "HPC/AI", 20),          # 10 servers * 2 kW = 20 kW
    (0, "General Purpose", 0),   # No servers
])
def test_calculate_total_air_power_kw_per_rack_valid(chassis_count, data_center_type, expected):
    """Test total power calculation for valid data center types."""
    result = calculate_total_air_power_kw_per_rack(chassis_count, data_center_type)
    assert result == expected


@pytest.mark.parametrize("chassis_count,data_center_type", [
    (5, "Select an Option"),  # Unselected option - returns empty string
    (5, "Invalid Type"),      # Invalid type - returns None
    (5, None),                # None type - returns None
])
def test_calculate_total_air_power_kw_per_rack_invalid(chassis_count, data_center_type):
    """Test total power calculation for invalid data center types."""
    if data_center_type == "Select an Option":
        # This specific case returns empty string
        result = calculate_total_air_power_kw_per_rack(chassis_count, data_center_type)
        assert result == ""
    else:
        # Invalid Type and None return None, which causes TypeError when multiplied
        with pytest.raises(TypeError):
            calculate_total_air_power_kw_per_rack(chassis_count, data_center_type)


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

def test_full_server_cost_calculation_general_purpose():
    """Test complete server cost calculation for General Purpose data center."""
    data_center_type = "General Purpose"
    
    # Calculate all components
    cpu_cost = calculate_total_cpu_price_per_server()
    memory_cost = calculate_total_memory_cost_per_server()
    network_cost = calculate_total_network_cost_per_server()
    bom_cost = calculate_server_l2_bom()
    
    # Calculate total using function
    total_cost = calculate_typical_it_cost_per_server(data_center_type)
    
    # Should match sum of components for General Purpose
    expected_total = cpu_cost + memory_cost + network_cost + bom_cost
    assert math.isclose(total_cost, expected_total, rel_tol=1e-9)


def test_full_server_cost_calculation_hpc_ai():
    """Test complete server cost calculation for HPC/AI data center."""
    data_center_type = "HPC/AI"
    
    # Calculate total using function
    total_cost = calculate_typical_it_cost_per_server(data_center_type)
    
    # Should use fixed HPC cost
    assert total_cost == DEFAULT_HPC_AI_COST_PER_SERVER


def test_rack_capacity_integration():
    """Test integration between rack capacity and power calculations."""
    rack_capacity_kw = 20
    data_center_type = "HPC/AI"
    
    # Calculate maximum servers that fit
    max_servers = calculate_maximum_number_of_chassis_per_rack_for_air(rack_capacity_kw, data_center_type)
    assert max_servers == 10
    
    # Calculate total power for that many servers
    total_power = calculate_total_air_power_kw_per_rack(max_servers, data_center_type)
    assert total_power == 20  # Should match rack capacity


# =============================================================================
# EDGE CASE TESTS
# =============================================================================

def test_memory_calculation_with_zero_channels():
    """Test memory cost calculation with zero channels."""
    result = calculate_total_memory_cost_per_server(0, 32, 6)
    assert result == 0


def test_network_cost_with_zero_servers():
    """Test network cost calculation with zero servers."""
    result = calculate_total_network_cost_per_server(1000, 0)
    # Should handle division by zero gracefully by returning 0
    assert result == 0.0


def test_negative_values_handling():
    """Test handling of negative input values."""
    # CPU cost with negative values should still calculate
    result = calculate_total_cpu_price_per_server(-1, 2000)
    assert result == -2000  # Negative count * positive price
    
    # Memory cost with negative memory per channel
    result = calculate_total_memory_cost_per_server(24, -32, 6)
    assert result == -4608


# =============================================================================
# PERFORMANCE TESTS
# =============================================================================

def test_calculation_performance():
    """Test that calculations complete within reasonable time."""
    import time
    
    start_time = time.time()
    
    # Run multiple calculations
    for _ in range(100):
        calculate_typical_it_cost_per_server("General Purpose")
        calculate_maximum_number_of_chassis_per_rack_for_air(15, "HPC/AI")
        calculate_total_air_power_kw_per_rack(8, "General Purpose")
    
    end_time = time.time()
    
    # Should complete 100 iterations in under 1 second
    assert (end_time - start_time) < 1.0