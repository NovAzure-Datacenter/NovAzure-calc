"""
IT Configuration Module for Data Center Cost Modeling
"""

import math

#Default IT Configuration Values
DEFAULT_25_SERVER_L2_BOM = 1200
DEFAULT_DIMM_COST_PER_GB = 4
DEFAULT_DIMM_CAPACITY_IN_GB = 96
DEFAULT_DDRS_6400_CHANNELS = 12
DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER = 2
DEFAULT_32_400_SWITCH_COST = 8000
DEFAULT_CPU_PRICE_PER_UNIT = 2400
DEFAULT_TOTAL_CHANNELS = 16
DEFAULT_ASUMPTION_OF_IT_MAINTENANCE_COST_PER_YEAR = 0.08
TYPICAL_IT_COST_PER_SERVER = 16559

# Default IT Configuration Values AIR COOLING
DEFAULT_SWITCH_COST_PER_UNIT = 8000
DEFAULT_HPC_AI_COST_PER_SERVER = 50000
DEFAULT_ANNUAL_IT_MAINTENANCE_COST_PERCENTAGE = 0.08

# Default IT Configuration Values CHASSIS COOLING
DEFAULT_NETWORK_CABLE_COST_PER_SERVER = 200.0
DEFAULT_SERVERS_PER_RACK = 38
DEFAULT_NETWORK_CABLE_COST_PER_SERVER_CHASSIS = 200.0
DEFAULT_SERVERS_PER_RACK_CHASSIS = 38
DEFAULT_DIMM_CAPACITY_IN_GB_CHASSIS = 96
DEFAULT_DIMM_COST_PER_GB_CHASSIS = 4
DEFAULT_DDRS_6400_CHANNELS_CHASSIS = 12
DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER_CHASSIS = 2
DEFAULT_CPU_PRICE_PER_UNIT_CHASSIS = 2400


# Power and Hardware Functions


# def calculate_server_rated_max_power(data_center_type: str):
#     """Get server power multiplier: 1kW for General Purpose, 2kW for HPC/AI."""
#     if data_center_type == "General Purpose":
#         return 1
#     elif data_center_type == "HPC/AI":
#         return 2
#     elif data_center_type == "Select an Option":
#         return ""
#     else:
#         return None


# def calculate_number_of_server_refreshes(planned_years: int):
#     """Calculate server refresh cycles (every 5 years)."""
#     if planned_years >= 5:
#         return math.ceil((planned_years / 5) - 1)
#     else:
#         return 0


# # CPU Cost Functions


# def calculate_total_cpu_price_per_server(
#     number_of_sockets_per_server=None, cpu_price_per_unit=None
# ):
#     """Calculate total CPU cost per server."""
#     sockets = (
#         number_of_sockets_per_server
#         if number_of_sockets_per_server is not None
#         else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
#     )
#     cpu_price = (
#         cpu_price_per_unit
#         if cpu_price_per_unit is not None
#         else DEFAULT_CPU_PRICE_PER_UNIT
#     )
#     return sockets * cpu_price


# # Memory Cost Functions


# def calculate_total_channels(
#     ddrs_6400_channels=None, number_of_sockets_per_server=None
# ):
#     """Calculate total memory channels (channels per socket × number of sockets)."""
#     channels = (
#         ddrs_6400_channels
#         if ddrs_6400_channels is not None
#         else DEFAULT_DDRS_6400_CHANNELS
#     )
#     sockets = (
#         number_of_sockets_per_server
#         if number_of_sockets_per_server is not None
#         else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
#     )
#     return channels * sockets


# def calculate_total_memory_cost_per_server(
#     total_channels=None, dimm_capacity=None, dimm_cost=None
# ):
#     """Calculate total memory cost per server."""
#     channels = (
#         total_channels if total_channels is not None else calculate_total_channels()
#     )
#     capacity = (
#         dimm_capacity if dimm_capacity is not None else DEFAULT_DIMM_CAPACITY_IN_GB
#     )
#     cost_per_gb = dimm_cost if dimm_cost is not None else DEFAULT_DIMM_COST_PER_GB
#     return channels * capacity * cost_per_gb


# # Network Cost Functions


# def calculate_switches_per_rack(servers_per_rack=None):
#     """Calculate switches needed per rack (minimum 2 for redundancy)."""
#     servers = (
#         servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
#     )
#     return max(2, math.ceil(2 * (servers / 32)))


# def calculate_total_switch_cost(switch_cost_per_unit=None, switches_per_rack=None):
#     """Calculate total switch cost per rack."""
#     switch_cost = (
#         switch_cost_per_unit
#         if switch_cost_per_unit is not None
#         else DEFAULT_SWITCH_COST_PER_UNIT
#     )
#     num_switches = (
#         switches_per_rack
#         if switches_per_rack is not None
#         else calculate_switches_per_rack()
#     )
#     return switch_cost * num_switches


# def calculate_total_network_cost_per_rack(
#     total_switch_cost=None, network_cable_cost_per_server=None, servers_per_rack=None
# ):
#     """Calculate total network cost per rack (switches + cables)."""
#     switch_cost = (
#         total_switch_cost
#         if total_switch_cost is not None
#         else calculate_total_switch_cost()
#     )
#     cable_cost = (
#         network_cable_cost_per_server
#         if network_cable_cost_per_server is not None
#         else DEFAULT_NETWORK_CABLE_COST_PER_SERVER
#     )
#     servers = (
#         servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
#     )
#     return switch_cost + (cable_cost * servers)


# def calculate_total_network_cost_per_server(
#     total_network_cost_per_rack:int, servers_per_rack:int
# ):
#     """Calculate network cost allocated per server."""
#     rack_cost = (
#         total_network_cost_per_rack
#         if total_network_cost_per_rack is not None
#         else calculate_total_network_cost_per_rack()
#     )
#     servers = (
#         servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
#     )

#     if servers == 0:
#         return 0.0

#     return rack_cost / servers


# # BOM Functions


# def calculate_server_l2_bom():
#     """Get L2 BOM cost (chassis, PSU, cooling, etc.)."""
#     return DEFAULT_25_SERVER_L2_BOM


# # Total IT Cost Functions


# def calculate_total_it_cost_per_server(
#     total_cpu_price_per_server=None,
#     total_memory_cost_per_server=None,
#     server_l2_bom=None,
#     total_network_cost_per_server=None,
# ):
#     """Calculate complete IT cost per server (CPU + Memory + Network + BOM)."""
#     cpu_cost = (
#         total_cpu_price_per_server
#         if total_cpu_price_per_server is not None
#         else calculate_total_cpu_price_per_server()
#     )
#     memory_cost = (
#         total_memory_cost_per_server
#         if total_memory_cost_per_server is not None
#         else calculate_total_memory_cost_per_server()
#     )
#     l2_bom = server_l2_bom if server_l2_bom is not None else calculate_server_l2_bom()
#     network_cost = (
#         total_network_cost_per_server
#         if total_network_cost_per_server is not None
#         else calculate_total_network_cost_per_server()
#     )

#     return cpu_cost + memory_cost + l2_bom + network_cost


# def calculate_typical_it_cost_per_server(data_center_type: str):
#     """Get typical server cost: calculated for General Purpose, $50K for HPC/AI."""
#     if data_center_type == "General Purpose":
#         return calculate_total_it_cost_per_server()
#     else:  # HPC/AI or other high-performance types
#         return DEFAULT_HPC_AI_COST_PER_SERVER


# # Rack Capacity Functions

# def calculate_maximum_number_of_per_rack_for_air(
#     air_rack_cooling_capacity_kw_per_rack, data_center_type
# ):
#     """Calculate max servers per rack based on cooling capacity."""
#     # If no cooling capacity provided, use default servers per rack
#     if (
#         air_rack_cooling_capacity_kw_per_rack is None
#         or air_rack_cooling_capacity_kw_per_rack <= 0
#     ):
#         return DEFAULT_SERVERS_PER_RACK

#     server_power_multiplier = calculate_server_rated_max_power(data_center_type)
#     # If invalid data center type, use default servers per rack
#     if server_power_multiplier is None or server_power_multiplier == "":
#         return DEFAULT_SERVERS_PER_RACK

#     # Calculate based on cooling capacity, but ensure minimum of 1 server per rack
#     calculated_servers = math.floor(
#         air_rack_cooling_capacity_kw_per_rack / server_power_multiplier
#     )
#     return max(1, calculated_servers)


# def calculate_total_air_power_kw_per_rack(
#     number_of_air_per_rack, data_center_type
# ):
#     """Calculate total power consumption per rack."""
#     return number_of_air_per_rack * calculate_server_rated_max_power(
#         data_center_type
#     )


# def calculate_total_it_cost(
#     data_hall_capacity_mw,
#     data_center_type,
#     air_rack_cooling_capacity_kw_per_rack=None,
#     planned_years=None,
# ):
#     """Calculate total IT cost for the entire data center including server refreshes."""
#     nameplate_power_kw = data_hall_capacity_mw * 1000

#     # Calculate server power consumption
#     server_power_kw = calculate_server_rated_max_power(data_center_type)
#     if server_power_kw is None or server_power_kw == "":
#         server_power_kw = 1  # Default to 1kW if invalid data center type

#     # Calculate maximum servers per rack (with fallback to default)
#     max_servers_per_rack = calculate_maximum_number_of_per_rack_for_air(
#         air_rack_cooling_capacity_kw_per_rack, data_center_type
#     )
#     if max_servers_per_rack == 0:
#         max_servers_per_rack = DEFAULT_SERVERS_PER_RACK

#     # Estimate total number of servers based on data hall capacity
#     # Assume 80% utilization of total capacity for IT load
#     it_capacity_kw = nameplate_power_kw * 0.8
#     total_servers_needed = int(it_capacity_kw / server_power_kw)

#     # Calculate cost per server
#     cost_per_server = calculate_typical_it_cost_per_server(data_center_type)

#     # Calculate initial server cost
#     initial_server_cost = total_servers_needed * cost_per_server

#     # Calculate server refresh costs over planned years
#     if planned_years:
#         number_of_refreshes = calculate_number_of_server_refreshes(planned_years)
#         refresh_cost = initial_server_cost * number_of_refreshes
#     else:
#         refresh_cost = 0

#     # Return just the total IT cost as a number
#     return int(initial_server_cost + refresh_cost)

#IT CAPEX Functions
def calculate_it_equipment_capex_complete(advanced: bool, it_cost_included: bool, typical_it_cost_per_server: int = None, data_center_type: str = None, data_hall_design_capacity_mw: int = None, planned_number_of_years: int = None, air_rack_cooling_capacity_kw_per_rack: int = None, project_location: str = None, server_rated_max_power: int = None):
    
    if not advanced:
        return 0
    
    # Use default values if not provided
    if typical_it_cost_per_server is None:
        typical_it_cost_per_server = TYPICAL_IT_COST_PER_SERVER
    
    nameplate_power_kw = data_hall_design_capacity_mw * 1000
    if server_rated_max_power is None:
        server_rated_max_power = calculate_server_rated_max_power(data_center_type)
    
    total_n_of_servers = nameplate_power_kw / server_rated_max_power
    total_it_cost = calculate_total_it_cost_greenfield_basic(typical_it_cost_per_server, total_n_of_servers)
    total_it_cost_per_kw = calculate_total_it_cost_per_kw_basic(total_it_cost, nameplate_power_kw)
    air_cooled_it_capex = calculate_air_cooled_it_capex_greenfield_basic(total_it_cost_per_kw, nameplate_power_kw)
    
    if advanced:

        if not it_cost_included:
            return 0
        total_it_cost_adv = calculate_total_it_cost_greenfield_advanced(total_it_cost, total_n_of_servers, it_cost_included)
        total_it_cost_per_kw_adv = calculate_total_it_cost_per_kw_advanced(total_it_cost, nameplate_power_kw)
        air_cooled_it_capex_adv = calculate_air_cooled_it_capex_greenfield_advanced(total_it_cost_per_kw_adv, nameplate_power_kw)
        if(project_location == "United States"):
            return air_cooled_it_capex_adv/1000
        elif(project_location == "United Kingdom"):
            return air_cooled_it_capex_adv/1000
        elif(project_location == "Singapore"):
            return air_cooled_it_capex_adv/1000
        elif(project_location == "United Arab Emirates"):
            return air_cooled_it_capex_adv/1000
    else:
        if(project_location == "United States"):
            return air_cooled_it_capex/1000
        elif(project_location == "United Kingdom"):
            return air_cooled_it_capex/1000
        elif(project_location == "Singapore"):
            return air_cooled_it_capex/1000
        elif(project_location == "United Arab Emirates"):
            return air_cooled_it_capex/1000

def calculate_it_equipment_maintenance_per_year(advanced: bool, it_cost_included: bool, typical_it_cost_per_server: int = None, data_center_type: str = None, data_hall_design_capacity_mw: int = None, planned_number_of_years: int = None, air_rack_cooling_capacity_kw_per_rack: int = None, project_location: str = None, it_maintenance_cost: float = None, server_rated_max_power: int = None):
    # Return 0 if IT cost is not included
    if not it_cost_included or not advanced:
        return 0
    
    nameplate_power_kw = data_hall_design_capacity_mw * 1000
    if(server_rated_max_power is None):
        server_rated_max_power = calculate_server_rated_max_power(data_center_type)
    total_n_of_servers = calculate_total_n_of_servers(server_rated_max_power, nameplate_power_kw)
    
    # Calculate total IT capex for maintenance calculation
    total_it_capex = calculate_it_equipment_capex_complete(advanced, it_cost_included, typical_it_cost_per_server, data_center_type, data_hall_design_capacity_mw, planned_number_of_years, air_rack_cooling_capacity_kw_per_rack, project_location, server_rated_max_power)
    
    if advanced:
        return calculate_it_maintenance_cost_advanced(it_maintenance_cost, total_it_capex)
    else:
        return DEFAULT_ASUMPTION_OF_IT_MAINTENANCE_COST_PER_YEAR * total_it_capex
    


def calculate_it_equipment_capex(advanced: bool):
    if(advanced == True):
        return calculate_input_type_filter()/1000
    else:
        return calculate_total_it_cost_with_geographical_adjustments()/1000


def calculate_input_type_filter(advanced:bool):
    if(advanced == False):
        return calculate_project_type_filter() / calculate_greenfield_basic()
    else:
        return calculate_project_type_filter() / calculate_greenfield_advanced()

def calculate_project_type_filter(project_type:str):
    #if(project_type == "Greenfield"):
    return calculate_greenfield_basic()

#greenfield basic

def calculate_greenfield_basic(country_filter: str):
    if(country_filter == "United States"):
        return calculate_air_cooled_it_capex_greenfield_basic(0, 0)  # Placeholder values
    elif(country_filter == "United Kingdom"):
        return calculate_air_cooled_it_capex_greenfield_basic(0, 0)  # Placeholder values
    elif(country_filter == "Singapore"):
        return calculate_air_cooled_it_capex_greenfield_basic(0, 0)  # Placeholder values
    elif(country_filter == "United Arab Emirates"):
        return calculate_air_cooled_it_capex_greenfield_basic(0, 0)  # Placeholder values
    else:
        return 0

def calculate_air_cooled_it_capex_greenfield_basic(total_it_cost_per_kw:int, nameplate_power_kw: int):
    return total_it_cost_per_kw * nameplate_power_kw

def calculate_total_it_cost_per_kw_basic(total_it_cost:int, nameplate_power_kw:int):
    return total_it_cost / math.ceil(nameplate_power_kw)

def calculate_total_it_cost_greenfield_basic(typical_it_cost_per_server:int, total_n_of_servers:int):
    if(typical_it_cost_per_server is not None):
        return typical_it_cost_per_server * total_n_of_servers
    else:
        return TYPICAL_IT_COST_PER_SERVER * total_n_of_servers

#greenfield advanced

def calculate_greenfield_advanced(country_filter: str):
    if(country_filter == "United States"):
        return calculate_air_cooled_it_capex_greenfield_advanced(0, 0)  # Placeholder values
    elif(country_filter == "United Kingdom"):
        return calculate_air_cooled_it_capex_greenfield_advanced(0, 0)  # Placeholder values
    elif(country_filter == "Singapore"):
        return calculate_air_cooled_it_capex_greenfield_advanced(0, 0)  # Placeholder values
    elif(country_filter == "United Arab Emirates"):
        return calculate_air_cooled_it_capex_greenfield_advanced(0, 0)  # Placeholder values
    else:
        return 0


def calculate_air_cooled_it_capex_greenfield_advanced(total_it_cost_per_kw:int, nameplate_power_kw: int):
    return total_it_cost_per_kw * nameplate_power_kw

def calculate_total_it_cost_per_kw_advanced(total_it_cost:int, nameplate_power_kw:int):
    return total_it_cost / nameplate_power_kw

def calculate_total_it_cost_greenfield_advanced(typical_it_cost_per_server:int, total_n_of_servers:int, include_it_cost:bool):
    if include_it_cost:
        return typical_it_cost_per_server * math.floor(total_n_of_servers)
    else:
        return 0


def calculate_total_it_cost_with_geographical_adjustments(total_it_cost_per_kw:int, nameplate_power_kw:int):
    return total_it_cost_per_kw * nameplate_power_kw

#GetTotal it cost per chassis = need to do calculation
def calculate_it_cost_reduction_due_to_low_network_cost(total_server_cost:int, total_it_cost_per_chassis:int):
    if total_it_cost_per_chassis > 0:
        return total_server_cost / total_it_cost_per_chassis
    else:
        return 1.0  # Default to no reduction if chassis cost is 0

def calculate_total_server_cost(total_network_cost_per_server:int, total_memory_cost_per_server:int, twentyfive_server_l2_bom:int, total_cpu_price_per_server:int):
    return total_network_cost_per_server + total_memory_cost_per_server + DEFAULT_25_SERVER_L2_BOM + total_cpu_price_per_server

def calculate_total_network_cost_per_server(total_network_cost_per_rack:int):
    return total_network_cost_per_rack / DEFAULT_SERVERS_PER_RACK

def calculate_total_network_cost_per_rack():
    return (DEFAULT_NETWORK_CABLE_COST_PER_SERVER_CHASSIS * DEFAULT_SERVERS_PER_RACK_CHASSIS) + DEFAULT_32_400_SWITCH_COST

def calculate_total_memory_cost_per_server(total_channels:int):
    return total_channels * DEFAULT_DIMM_CAPACITY_IN_GB * DEFAULT_DIMM_COST_PER_GB

def calculate_total_channels():
    return DEFAULT_DDRS_6400_CHANNELS * DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER

def calculate_total_cpu_price_per_server():
    return DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER * DEFAULT_CPU_PRICE_PER_UNIT

def calculate_total_n_of_servers(server_rated_max_power:int, nameplate_power_kw:int):
    return nameplate_power_kw / server_rated_max_power

def calculate_server_rated_max_power(data_center_type:str):
    if(data_center_type == "General Purpose"):
        return 1
    elif(data_center_type == "HPC/AI"):
        return 2

def calculate_nameplate_power_kw(data_hall_design_capacity_mw:int):
    return data_hall_design_capacity_mw * 1000


#IT maintenance cost

def calculate_it_maintenance_cost(advanced:bool):
    if(advanced == True):
        return calculate_it_maintenance_cost_advanced()
    else:
        return calculate_it_maintenance_cost_basic()

def calculate_it_maintenance_cost_advanced(maintenance_cost_per_year: float = None, total_it_cost: float = None):
    if maintenance_cost_per_year is not None and maintenance_cost_per_year > 0:
        return maintenance_cost_per_year * total_it_cost
    else:
        return DEFAULT_ASUMPTION_OF_IT_MAINTENANCE_COST_PER_YEAR * total_it_cost

def calculate_total_it_cost_maintenance(it_cost_reduction_due_to_low_network_cost:int, total_n_of_servers:int):
    return it_cost_reduction_due_to_low_network_cost * TYPICAL_IT_COST_PER_SERVER * total_n_of_servers

def calculate_it_maintenance_cost_basic(assumption_of_it_maintenance_cost_per_year:int, total_it_cost_with_geographical_adjustments:int):
    return DEFAULT_ASUMPTION_OF_IT_MAINTENANCE_COST_PER_YEAR * total_it_cost_with_geographical_adjustments

def calculate_assumption_of_it_maintenance_cost_per_year(total_network_cost_per_server:int, total_memory_cost_per_server:int, total_cpu_price_per_server:int, twentyfive_server_l2_bom:int):
    return total_network_cost_per_server + total_memory_cost_per_server + total_cpu_price_per_server + DEFAULT_25_SERVER_L2_BOM