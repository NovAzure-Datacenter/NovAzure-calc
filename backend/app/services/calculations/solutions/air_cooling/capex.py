# Country-specific multipliers (USD per kW)
COUNTRY_MULTIPLIERS = {
    "United States": 3849,
    "Singapore": 3527, 
    "United Kingdom": 4952,
    "United Arab Emirates": 3433
}

# UK Capex Inflation factors applied universally to all countries
INFLATION_FACTORS = {
    2023: 1.0,
    2024: 1.02,
    2025: 1.04,
    2026: 1.06,
    2027: 1.08,
    2028: 1.10,
    2029: 1.13,
    2030: 1.15,
    2031: 1.17,
    2032: 1.20,
    2033: 1.22,
    2034: 1.24,
    2035: 1.27,
    2036: 1.29,
    2037: 1.32,
    2038: 1.35,
    2039: 1.37,
    2040: 1.40,
    2041: 1.43,
    2042: 1.46,
    2043: 1.49,
    2044: 1.52,
    2045: 1.55,
    2046: 1.58,
    2047: 1.61,
    2048: 1.64,
    2049: 1.67,
    2050: 1.71,
}

from ...it_config import (
    calculate_typical_it_cost_per_server,
    calculate_maximum_number_of_chassis_per_rack_for_air,
    calculate_number_of_server_refreshes
)

def calculate_cooling_equipment_capex(first_year_of_operation: int, capacity_mw: float, country: str):
    nameplate_power_kw = capacity_mw * 1000
    country_multiplier = COUNTRY_MULTIPLIERS[country]
    base_capex = country_multiplier * nameplate_power_kw
    inflation_factor = INFLATION_FACTORS[first_year_of_operation]
    return base_capex * inflation_factor

def calculate_it_capex(data_hall_capacity_mw, data_center_type, air_rack_cooling_capacity_kw_per_rack, planned_years):

    nameplate_power_kw = data_hall_capacity_mw * 1000
    
    # Calculate maximum servers per rack based on cooling capacity
    max_servers_per_rack = calculate_maximum_number_of_chassis_per_rack_for_air(
        air_rack_cooling_capacity_kw_per_rack, 
        data_center_type
    )
    
    if max_servers_per_rack == 0:
        return 0
    
    # Estimate total number of racks based on data hall capacity
    # Assume 80% utilization of total capacity for IT load
    it_capacity_kw = nameplate_power_kw * 0.8
    
    # Calculate server power consumption
    if data_center_type == "General Purpose":
        server_power_kw = 1  # 1kW per server
    else:  # HPC/AI
        server_power_kw = 2  # 2kW per server
    
    # Calculate total servers and racks needed
    total_servers_needed = int(it_capacity_kw / server_power_kw)
    
    # Calculate cost per server
    cost_per_server = calculate_typical_it_cost_per_server(data_center_type)
    
    # Calculate initial server CAPEX
    initial_server_capex = total_servers_needed * cost_per_server
    
    # Calculate server refresh costs over planned years
    number_of_refreshes = calculate_number_of_server_refreshes(planned_years or 0)
    refresh_capex = initial_server_capex * number_of_refreshes
    
    # Total IT CAPEX
    total_it_capex = initial_server_capex + refresh_capex
    
    return round(total_it_capex)

def calculate_cooling_capex(input_data):
    '''
    Calculates the cooling CAPEX for an air cooling solution.

    It receives a dictionary with required inputs:
    {
        'data_hall_design_capacity_mw': float,
        'first_year_of_operation': int,
        'country': str,
        'include_it_cost': str (optional),
        'data_center_type': str (optional),
        'air_rack_cooling_capacity_kw_per_rack': float (optional),
        'planned_years_of_operation': int (optional)
    }
    '''
    capacity_mw = input_data.get('data_hall_design_capacity_mw')
    first_year_of_operation = input_data.get('first_year_of_operation')
    country = input_data.get('country')
    
    cooling_equipment_capex = calculate_cooling_equipment_capex(first_year_of_operation, capacity_mw, country)
    
    it_equipment_capex = 0
    if (input_data.get('include_it_cost') and 
        input_data.get('include_it_cost').lower() in ['yes', 'true', '1']):
        
        it_equipment_capex = calculate_it_capex(
            capacity_mw,
            input_data.get('data_center_type'),
            input_data.get('air_rack_cooling_capacity_kw_per_rack'),
            input_data.get('planned_years_of_operation')
        )
    
    # Total CAPEX
    total_capex = cooling_equipment_capex + it_equipment_capex
    
    return {
        'cooling_equipment_capex': cooling_equipment_capex,
        'it_equipment_capex': it_equipment_capex,
        'total_capex': total_capex
    }