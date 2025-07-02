import math
from .defaults import (
    DEFAULT_SERVERS_PER_RACK,
    DEFAULT_SWITCH_COST_PER_UNIT,
    DEFAULT_NETWORK_CABLE_COST_PER_SERVER
)

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
