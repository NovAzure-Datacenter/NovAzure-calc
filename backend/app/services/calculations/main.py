from .solutions.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex
from .solutions.air_cooling.opex import calculate_annual_opex as calculate_air_cooling_opex, calculate_total_opex_over_lifetime as calculate_total_opex_lifetime
from .it_config import (
    calculate_typical_it_cost_per_server,
    calculate_maximum_number_of_chassis_per_rack_for_air,
    calculate_number_of_server_refreshes
)

# Initialising User inputs that will be used in the calculations
advanced = False
percentage_of_utilisation = { '%_of_utilisation': None }
planned_years_of_operation = {'planned_years_of_operation': None}
project_location = {'project_location': None}
data_hall_design_capacity_mw = {'data_hall_design_capacity_mw': None}
first_year_of_operation = {'first_year_of_operation': None}
annualised_air_ppue = { 'annualised_air_ppue': None }

# IT Configuration inputs (used when advanced = True)
include_it_cost = {'include_it_cost': False}  # Default false
data_center_type = {'data_center_type': None}
air_rack_cooling_capacity_kw_per_rack = {'air_rack_cooling_capacity_kw_per_rack': None}

def update_inputs(inputs):
    global advanced
    for key, value in inputs.items():
        if key == 'advanced':
            advanced = bool(value)
        elif key in percentage_of_utilisation:
            percentage_of_utilisation[key] = value
        elif key in planned_years_of_operation:
            planned_years_of_operation[key] = value
        elif key in project_location:
            project_location[key] = value
        elif key in data_hall_design_capacity_mw:
            data_hall_design_capacity_mw[key] = value
        elif key in first_year_of_operation:
            first_year_of_operation[key] = value
        elif key in annualised_air_ppue:
            annualised_air_ppue[key] = value
        # IT Configuration inputs
        elif key in include_it_cost:
            include_it_cost[key] = value
        elif key in data_center_type:
            data_center_type[key] = value
        elif key in air_rack_cooling_capacity_kw_per_rack:
            air_rack_cooling_capacity_kw_per_rack[key] = value
        
def calculate_it_capex(data_hall_capacity_mw, data_center_type, air_rack_cooling_capacity_kw_per_rack, planned_years, utilization_percentage=None):
    """
    Calculate IT equipment CAPEX based on data hall capacity and configuration.
    """
    if not data_hall_capacity_mw or not data_center_type or not air_rack_cooling_capacity_kw_per_rack:
        return {
            'it_servers_capex': 0,
            'it_refresh_capex': 0,
            'total_it_capex': 0,
            'estimated_servers': 0,
            'estimated_racks': 0
        }
    
    # Convert MW to kW for calculations
    total_capacity_kw = data_hall_capacity_mw * 1000
    
    # Calculate maximum servers per rack based on cooling capacity
    max_servers_per_rack = calculate_maximum_number_of_chassis_per_rack_for_air(
        air_rack_cooling_capacity_kw_per_rack, 
        data_center_type
    )
    
    if max_servers_per_rack == 0:
        return {
            'it_servers_capex': 0,
            'it_refresh_capex': 0,
            'total_it_capex': 0,
            'estimated_servers': 0,
            'estimated_racks': 0
        }
    
    # Calculate IT capacity based on actual utilization or default to 80%
    if utilization_percentage is not None:
        it_capacity_kw = total_capacity_kw * utilization_percentage
    else:
        # Fallback to 80% if no utilization data provided (for backward compatibility)
        it_capacity_kw = total_capacity_kw * 0.8
    
    # Calculate server power consumption
    if data_center_type == "General Purpose":
        server_power_kw = 1  # 1kW per server
    else:  # HPC/AI
        server_power_kw = 2  # 2kW per server
    
    total_servers_needed = int(it_capacity_kw / server_power_kw)
    total_racks_needed = int(total_servers_needed / max_servers_per_rack) + 1
    
    cost_per_server = calculate_typical_it_cost_per_server(data_center_type)

    initial_server_capex = total_servers_needed * cost_per_server
    
    number_of_refreshes = calculate_number_of_server_refreshes(planned_years or 0)
    refresh_capex = initial_server_capex * number_of_refreshes
    
    # Total IT CAPEX
    total_it_capex = initial_server_capex + refresh_capex
    
    return {
        'it_servers_capex': initial_server_capex,
        'it_refresh_capex': refresh_capex,
        'total_it_capex': total_it_capex,
        'estimated_servers': total_servers_needed,
        'estimated_racks': total_racks_needed,
        'cost_per_server': cost_per_server,
        'max_servers_per_rack': max_servers_per_rack
    }
    
async def calculate():
    capex_input_data = {
        'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
        'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
        'country': project_location['project_location']
    }
    
    opex_input_data = {
        'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
        'annualised_air_ppue': annualised_air_ppue['annualised_air_ppue'],
        'percentage_of_utilisation': percentage_of_utilisation['%_of_utilisation'],
        'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
        'country': project_location['project_location']
    }
    
    lifetime_opex_input_data = {
        'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
        'annualised_air_ppue': annualised_air_ppue['annualised_air_ppue'],
        'percentage_of_utilisation': percentage_of_utilisation['%_of_utilisation'],
        'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
        'planned_years_of_operation': planned_years_of_operation['planned_years_of_operation'],
        'country': project_location['project_location']
    }
    
    # Calculate cooling CAPEX
    air_cooling_capex = calculate_air_cooling_capex(capex_input_data)
    
    # Calculate IT CAPEX only if advanced mode is enabled and IT costs are requested
    it_capex_result = {'total_it_capex': 0}
    include_it_value = include_it_cost.get('include_it_cost')
    # Simple boolean check - include IT costs if explicitly True
    if advanced and include_it_value is True:
        
        it_capex_result = calculate_it_capex(
            data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
            data_center_type.get('data_center_type'),
            air_rack_cooling_capacity_kw_per_rack.get('air_rack_cooling_capacity_kw_per_rack'),
            planned_years_of_operation.get('planned_years_of_operation'),
            percentage_of_utilisation.get('%_of_utilisation')  # Pass actual user utilization
        )
    
    # Calculate total CAPEX (cooling + IT if included)
    total_capex = air_cooling_capex['total_capex'] + it_capex_result['total_it_capex']
    
    # Calculate OPEX using the original cooling CAPEX (IT doesn't affect cooling OPEX)
    air_cooling_opex = await calculate_air_cooling_opex(opex_input_data, air_cooling_capex['total_capex'])
    total_opex_lifetime = await calculate_total_opex_lifetime(lifetime_opex_input_data, air_cooling_capex['total_capex'])
    
    # Total cost of ownership includes all CAPEX and OPEX
    total_cost_of_ownership = total_opex_lifetime['total_opex_over_lifetime'] + total_capex
    
    return {
        'air_cooling_capex': air_cooling_capex['cooling_equipment_capex'],
        'it_capex': it_capex_result,  # Include IT CAPEX breakdown
        'total_capex': total_capex,   # Updated to include IT costs if enabled
        'opex': air_cooling_opex,
        'total_opex_over_lifetime': total_opex_lifetime,
        'total_cost_of_ownership': total_cost_of_ownership,
        'advanced_mode': advanced,
        'include_it_cost': include_it_cost.get('include_it_cost') if include_it_cost.get('include_it_cost') is not None else False  # Return the original value or False if not set
    }