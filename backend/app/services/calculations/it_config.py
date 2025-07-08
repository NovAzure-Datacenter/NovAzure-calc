"""
IT Configuration Module for Data Center Cost Modeling
"""

import math

# Default IT Configuration Values
DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER = 2
DEFAULT_CPU_PRICE_PER_UNIT = 2400
DEFAULT_SERVERS_PER_RACK = 14
DEFAULT_TOTAL_CHANNELS = 16
DEFAULT_DIMM_CAPACITY_IN_GB = 96
DEFAULT_DIMM_COST_PER_GB = 4
DEFAULT_DDRS_6400_CHANNELS = 12
DEFAULT_NETWORK_CABLE_COST_PER_SERVER = 100.0
DEFAULT_SWITCH_COST_PER_UNIT = 8000
DEFAULT_25_SERVER_L2_BOM = 1200
DEFAULT_HPC_AI_COST_PER_SERVER = 50000
DEFAULT_ANNUAL_IT_MAINTENANCE_COST_PERCENTAGE = 0.08

# Power and Hardware Functions


def calculate_server_rated_max_power(data_center_type: str):
    """Get server power multiplier: 1kW for General Purpose, 2kW for HPC/AI."""
    if data_center_type == "General Purpose":
        return 1
    elif data_center_type == "HPC/AI":
        return 2
    elif data_center_type == "Select an Option":
        return ""
    else:
        return None


def calculate_number_of_server_refreshes(planned_years: int):
    """Calculate server refresh cycles (every 5 years)."""
    if planned_years >= 5:
        return math.ceil((planned_years / 5) - 1)
    else:
        return 0


# CPU Cost Functions


def calculate_total_cpu_price_per_server(
    number_of_sockets_per_server=None, cpu_price_per_unit=None
):
    """Calculate total CPU cost per server."""
    sockets = (
        number_of_sockets_per_server
        if number_of_sockets_per_server is not None
        else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    )
    cpu_price = (
        cpu_price_per_unit
        if cpu_price_per_unit is not None
        else DEFAULT_CPU_PRICE_PER_UNIT
    )
    return sockets * cpu_price


# Memory Cost Functions


def calculate_total_channels(
    ddrs_6400_channels=None, number_of_sockets_per_server=None
):
    """Calculate total memory channels (channels per socket × number of sockets)."""
    channels = (
        ddrs_6400_channels
        if ddrs_6400_channels is not None
        else DEFAULT_DDRS_6400_CHANNELS
    )
    sockets = (
        number_of_sockets_per_server
        if number_of_sockets_per_server is not None
        else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    )
    return channels * sockets


def calculate_total_memory_cost_per_server(
    total_channels=None, dimm_capacity=None, dimm_cost=None
):
    """Calculate total memory cost per server."""
    channels = (
        total_channels if total_channels is not None else calculate_total_channels()
    )
    capacity = (
        dimm_capacity if dimm_capacity is not None else DEFAULT_DIMM_CAPACITY_IN_GB
    )
    cost_per_gb = dimm_cost if dimm_cost is not None else DEFAULT_DIMM_COST_PER_GB
    return channels * capacity * cost_per_gb


# Network Cost Functions


def calculate_switches_per_rack(servers_per_rack=None):
    """Calculate switches needed per rack (minimum 2 for redundancy)."""
    servers = (
        servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    )
    return max(2, math.ceil(2 * (servers / 32)))


def calculate_total_switch_cost(switch_cost_per_unit=None, switches_per_rack=None):
    """Calculate total switch cost per rack."""
    switch_cost = (
        switch_cost_per_unit
        if switch_cost_per_unit is not None
        else DEFAULT_SWITCH_COST_PER_UNIT
    )
    num_switches = (
        switches_per_rack
        if switches_per_rack is not None
        else calculate_switches_per_rack()
    )
    return switch_cost * num_switches


def calculate_total_network_cost_per_rack(
    total_switch_cost=None, network_cable_cost_per_server=None, servers_per_rack=None
):
    """Calculate total network cost per rack (switches + cables)."""
    switch_cost = (
        total_switch_cost
        if total_switch_cost is not None
        else calculate_total_switch_cost()
    )
    cable_cost = (
        network_cable_cost_per_server
        if network_cable_cost_per_server is not None
        else DEFAULT_NETWORK_CABLE_COST_PER_SERVER
    )
    servers = (
        servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    )
    return switch_cost + (cable_cost * servers)


def calculate_total_network_cost_per_server(
    total_network_cost_per_rack=None, servers_per_rack=None
):
    """Calculate network cost allocated per server."""
    rack_cost = (
        total_network_cost_per_rack
        if total_network_cost_per_rack is not None
        else calculate_total_network_cost_per_rack()
    )
    servers = (
        servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    )

    if servers == 0:
        return 0.0

    return rack_cost / servers


# BOM Functions


def calculate_server_l2_bom():
    """Get L2 BOM cost (chassis, PSU, cooling, etc.)."""
    return DEFAULT_25_SERVER_L2_BOM


# Total IT Cost Functions


def calculate_total_it_cost_per_server(
    total_cpu_price_per_server=None,
    total_memory_cost_per_server=None,
    server_l2_bom=None,
    total_network_cost_per_server=None,
):
    """Calculate complete IT cost per server (CPU + Memory + Network + BOM)."""
    cpu_cost = (
        total_cpu_price_per_server
        if total_cpu_price_per_server is not None
        else calculate_total_cpu_price_per_server()
    )
    memory_cost = (
        total_memory_cost_per_server
        if total_memory_cost_per_server is not None
        else calculate_total_memory_cost_per_server()
    )
    l2_bom = server_l2_bom if server_l2_bom is not None else calculate_server_l2_bom()
    network_cost = (
        total_network_cost_per_server
        if total_network_cost_per_server is not None
        else calculate_total_network_cost_per_server()
    )

    return cpu_cost + memory_cost + l2_bom + network_cost


def calculate_typical_it_cost_per_server(data_center_type: str):
    """Get typical server cost: calculated for General Purpose, $50K for HPC/AI."""
    if data_center_type == "General Purpose":
        return calculate_total_it_cost_per_server()
    else:  # HPC/AI or other high-performance types
        return DEFAULT_HPC_AI_COST_PER_SERVER


# Rack Capacity Functions

def calculate_maximum_number_of_chassis_per_rack_for_air(
    air_rack_cooling_capacity_kw_per_rack, data_center_type
):
    """Calculate max servers per rack based on cooling capacity."""
    # If no cooling capacity provided, use default servers per rack
    if air_rack_cooling_capacity_kw_per_rack is None or air_rack_cooling_capacity_kw_per_rack <= 0:
        return DEFAULT_SERVERS_PER_RACK
    
    server_power_multiplier = calculate_server_rated_max_power(data_center_type)
    # If invalid data center type, use default servers per rack
    if server_power_multiplier is None or server_power_multiplier == "":

        return DEFAULT_SERVERS_PER_RACK
    
    # Calculate based on cooling capacity, but ensure minimum of 1 server per rack
    calculated_servers = math.floor(air_rack_cooling_capacity_kw_per_rack / server_power_multiplier)
    return max(1, calculated_servers)



def calculate_total_air_power_kw_per_rack(
    number_of_air_chassis_per_rack, data_center_type
):
    """Calculate total power consumption per rack."""
    return number_of_air_chassis_per_rack * calculate_server_rated_max_power(data_center_type)


def calculate_total_it_cost(data_hall_capacity_mw, data_center_type, air_rack_cooling_capacity_kw_per_rack=None, planned_years=None):
    """Calculate total IT cost for the entire data center including server refreshes."""
    nameplate_power_kw = data_hall_capacity_mw * 1000
    
    # Calculate server power consumption
    server_power_kw = calculate_server_rated_max_power(data_center_type)
    if server_power_kw is None or server_power_kw == "":
        server_power_kw = 1  # Default to 1kW if invalid data center type
    
    # Calculate maximum servers per rack (with fallback to default)
    max_servers_per_rack = calculate_maximum_number_of_chassis_per_rack_for_air(
        air_rack_cooling_capacity_kw_per_rack, 
        data_center_type
    )
    if max_servers_per_rack == 0:
        max_servers_per_rack = DEFAULT_SERVERS_PER_RACK
    
    # Estimate total number of servers based on data hall capacity
    # Assume 80% utilization of total capacity for IT load
    it_capacity_kw = nameplate_power_kw * 0.8
    total_servers_needed = int(it_capacity_kw / server_power_kw)
    
    # Calculate cost per server
    cost_per_server = calculate_typical_it_cost_per_server(data_center_type)
    
    # Calculate initial server cost
    initial_server_cost = total_servers_needed * cost_per_server
    
    # Calculate server refresh costs over planned years
    if planned_years:
        number_of_refreshes = calculate_number_of_server_refreshes(planned_years)
        refresh_cost = initial_server_cost * number_of_refreshes
    else:
        refresh_cost = 0
    
    # Return just the total IT cost as a number
    return int(initial_server_cost + refresh_cost)
