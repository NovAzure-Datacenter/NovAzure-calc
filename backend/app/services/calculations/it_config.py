import math

# =============================================================================
# DEFAULT IT CONFIGURATION VALUES
# =============================================================================
DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER = 2
DEFAULT_CPU_PRICE_PER_UNIT = 2400
DEFAULT_TOTAL_CHANNELS = 16
DEFAULT_DIMM_CAPACITY_IN_GB = 96
DEFAULT_DIMM_COST_PER_GB = 4
DEFAULT_NETWORK_CABLE_COST_PER_SERVER = 100.0
DEFAULT_SERVERS_PER_RACK = 14
DEFAULT_SWITCH_COST_PER_UNIT = 8000
DEFAULT_HPC_AI_COST_PER_SERVER = 50000
DEFAULT_25_SERVER_L2_BOM = 1200
DEFAULT_DDRS_6400_CHANNELS = 12

# =============================================================================
# BASIC SERVER CALCULATIONS
# =============================================================================

def calculate_server_rated_max_power(data_center_type: str):
    """
    Calculate server power multiplier based on data center type.
    
    Args:
        data_center_type: "General Purpose" or "HPC/AI"
        
    Returns:
        int: 1 for General Purpose, 2 for HPC/AI, "" for unselected, None for invalid
    """
    if data_center_type == "General Purpose":
        return 1
    elif data_center_type == "HPC/AI":
        return 2
    elif data_center_type == "Select an Option":
        return ""
    else:
        return None


def calculate_number_of_server_refreshes(planned_years: int):
    """
    Calculate number of server refreshes needed over planned operation years.
    Servers are typically refreshed every 5 years.
    
    Args:
        planned_years: Number of years of planned operation
        
    Returns:
        int: Number of server refreshes needed
    """
    if planned_years >= 5:
        return math.ceil((planned_years / 5) - 1)
    elif planned_years < 5:
        return 0
    else:
        return 0

# =============================================================================
# CPU COST CALCULATIONS
# =============================================================================

def calculate_total_cpu_price_per_server(number_of_sockets_per_server=None, cpu_price_per_unit=None):
    """
    Calculate total CPU cost per server.
    
    Args:
        number_of_sockets_per_server: Number of CPU sockets (default: 2)
        cpu_price_per_unit: Price per CPU unit (default: $2400)
        
    Returns:
        float: Total CPU cost per server
    """
    sockets = number_of_sockets_per_server if number_of_sockets_per_server is not None else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    cpu_price = cpu_price_per_unit if cpu_price_per_unit is not None else DEFAULT_CPU_PRICE_PER_UNIT
    
    return sockets * cpu_price

# =============================================================================
# MEMORY COST CALCULATIONS
# =============================================================================

def calculate_total_channels(ddrs_6400_channels=None, number_of_sockets_per_server=None):
    """
    Calculate total memory channels.
    
    Args:
        ddrs_6400_channels: DDR5-6400 channels per socket (default: 12)
        number_of_sockets_per_server: Number of sockets per server (default: 2)
        
    Returns:
        int: Total memory channels
    """
    channels = ddrs_6400_channels if ddrs_6400_channels is not None else DEFAULT_DDRS_6400_CHANNELS
    sockets = number_of_sockets_per_server if number_of_sockets_per_server is not None else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    
    return channels * sockets


def calculate_total_memory_cost_per_server(total_channels=None, dimm_capacity=None, dimm_cost=None):
    """
    Calculate total memory cost per server.
    
    Args:
        total_channels: Total memory channels (calculated if not provided)
        dimm_capacity: DIMM capacity in GB (default: 96)
        dimm_cost: Cost per GB of DIMM (default: $4)
        
    Returns:
        float: Total memory cost per server
    """
    channels = total_channels if total_channels is not None else calculate_total_channels()
    capacity = dimm_capacity if dimm_capacity is not None else DEFAULT_DIMM_CAPACITY_IN_GB
    cost_per_gb = dimm_cost if dimm_cost is not None else DEFAULT_DIMM_COST_PER_GB
    
    return channels * capacity * cost_per_gb

# =============================================================================
# NETWORK COST CALCULATIONS
# =============================================================================

def calculate_switches_per_rack(servers_per_rack=None):
    """
    Calculate number of switches needed per rack.
    Formula: max(2, ceil(2 * servers_per_rack / 32))
    
    Args:
        servers_per_rack: Number of servers per rack (default: 14)
        
    Returns:
        int: Number of switches per rack
    """
    servers = servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    return max(2, math.ceil(2 * (servers / 32)))


def calculate_total_switch_cost(switch_cost_per_unit=None, switches_per_rack=None):
    """
    Calculate total switch cost per rack.
    
    Args:
        switch_cost_per_unit: Cost per switch unit (default: $8000)
        switches_per_rack: Number of switches per rack (calculated if not provided)
        
    Returns:
        float: Total switch cost per rack
    """
    switch_cost = switch_cost_per_unit if switch_cost_per_unit is not None else DEFAULT_SWITCH_COST_PER_UNIT
    num_switches = switches_per_rack if switches_per_rack is not None else calculate_switches_per_rack()
    
    return switch_cost * num_switches


def calculate_total_network_cost_per_rack(total_switch_cost=None, network_cable_cost_per_server=None, servers_per_rack=None):
    """
    Calculate total network cost per rack.
    
    Args:
        total_switch_cost: Total switch cost (calculated if not provided)
        network_cable_cost_per_server: Cable cost per server (default: $100)
        servers_per_rack: Number of servers per rack (default: 14)
        
    Returns:
        float: Total network cost per rack
    """
    switch_cost = total_switch_cost if total_switch_cost is not None else calculate_total_switch_cost()
    cable_cost = network_cable_cost_per_server if network_cable_cost_per_server is not None else DEFAULT_NETWORK_CABLE_COST_PER_SERVER
    servers = servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    
    return switch_cost + (cable_cost * servers)


def calculate_total_network_cost_per_server(total_network_cost_per_rack=None, servers_per_rack=None):
    """
    Calculate network cost per server.
    
    Args:
        total_network_cost_per_rack: Total network cost per rack (calculated if not provided)
        servers_per_rack: Number of servers per rack (default: 14)
        
    Returns:
        float: Network cost per server
    """
    rack_cost = total_network_cost_per_rack if total_network_cost_per_rack is not None else calculate_total_network_cost_per_rack()
    servers = servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    
    return rack_cost / servers

# =============================================================================
# SERVER L2 BOM (BILL OF MATERIALS) CALCULATIONS
# =============================================================================

def calculate_server_l2_bom():
    """
    Calculate Level 2 Bill of Materials cost for server.
    This includes chassis, power supplies, and other components.
    
    Returns:
        float: L2 BOM cost (currently fixed at $1200)
    """
    return DEFAULT_25_SERVER_L2_BOM

# =============================================================================
# TOTAL IT COST CALCULATIONS
# =============================================================================

def calculate_total_it_cost_per_server(total_cpu_price_per_server=None, total_memory_cost_per_server=None, 
                                     server_l2_bom=None, total_network_cost_per_server=None):
    """
    Calculate total IT cost per server by combining all components.
    
    Args:
        total_cpu_price_per_server: CPU cost per server (calculated if not provided)
        total_memory_cost_per_server: Memory cost per server (calculated if not provided)
        server_l2_bom: L2 BOM cost (default: $1200)
        total_network_cost_per_server: Network cost per server (calculated if not provided)
        
    Returns:
        float: Total IT cost per server
    """
    cpu_cost = total_cpu_price_per_server if total_cpu_price_per_server is not None else calculate_total_cpu_price_per_server()
    memory_cost = total_memory_cost_per_server if total_memory_cost_per_server is not None else calculate_total_memory_cost_per_server()
    l2_bom = server_l2_bom if server_l2_bom is not None else calculate_server_l2_bom()
    network_cost = total_network_cost_per_server if total_network_cost_per_server is not None else calculate_total_network_cost_per_server()
    
    return cpu_cost + memory_cost + l2_bom + network_cost


def calculate_typical_it_cost_per_server(data_center_type: str):
    """
    Get typical IT cost per server based on data center type.
    
    Args:
        data_center_type: "General Purpose" or "HPC/AI"
        
    Returns:
        float: Typical IT cost per server
    """
    if data_center_type == "General Purpose":
        return calculate_total_it_cost_per_server()
    else:  # HPC/AI or other types
        return DEFAULT_HPC_AI_COST_PER_SERVER