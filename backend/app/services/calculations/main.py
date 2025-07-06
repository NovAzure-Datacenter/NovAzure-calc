from .solutions.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex
from .solutions.air_cooling.opex import calculate_annual_opex as calculate_air_cooling_opex, calculate_total_opex_over_lifetime as calculate_total_opex_lifetime
from .it_config import (
    calculate_typical_it_cost_per_server,
    calculate_maximum_number_of_chassis_per_rack_for_air,
    calculate_number_of_server_refreshes
)

# Initialising User inputs that will be used in the calculations
advanced = False  # Controls whether to include IT configuration
percentage_of_utilisation = { '%_of_utilisation': None }
planned_years_of_operation = {'planned_years_of_operation': None}
project_location = {'project_location': None}
data_hall_design_capacity_mw = {'data_hall_design_capacity_mw': None}
first_year_of_operation = {'first_year_of_operation': None}
annualised_air_ppue = { 'annualised_air_ppue': None }

# IT Configuration inputs (used when advanced = True)
include_it_cost = {'include_it_cost': None}
data_center_type = {'data_center_type': None}
air_rack_cooling_capacity_kw_per_rack = {'air_rack_cooling_capacity_kw_per_rack': None}

# Advanced Data Centre Configuration inputs (used when advanced = True)
inlet_temperature = {'inlet_temperature': 27}
electricity_price_per_kwh = {'electricity_price_per_kwh': 0.1}
water_price_per_litre = {'water_price_per_litre': 0.0001}
waterloop_enabled = {'waterloop_enabled': True}
required_increase_electrical_kw = {'required_increase_electrical_kw': 1000}

def update_inputs(inputs):
    global advanced
    
    for key, value in inputs.items():
        # Handle advanced mode toggle
        if key == 'advanced':
            advanced = value
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
        elif key in include_it_cost:
            include_it_cost[key] = value
        elif key in data_center_type:
            data_center_type[key] = value
        elif key in air_rack_cooling_capacity_kw_per_rack:
            air_rack_cooling_capacity_kw_per_rack[key] = value
        # Handle advanced data centre configuration inputs
        elif key in inlet_temperature:
            inlet_temperature[key] = value
        elif key in electricity_price_per_kwh:
            electricity_price_per_kwh[key] = value
        elif key in water_price_per_litre:
            water_price_per_litre[key] = value
        elif key in waterloop_enabled:
            waterloop_enabled[key] = value
        elif key in required_increase_electrical_kw:
            required_increase_electrical_kw[key] = value

def build_advanced_config():
    """
    Build the advanced configuration dictionary from the global variables.
    Only includes non-None values to avoid overriding defaults unnecessarily.
    """
    advanced_config = {}
    
    if inlet_temperature.get('inlet_temperature') is not None:
        advanced_config['inlet_temperature'] = inlet_temperature['inlet_temperature']
    if electricity_price_per_kwh.get('electricity_price_per_kwh') is not None:
        advanced_config['electricity_price_per_kwh'] = electricity_price_per_kwh['electricity_price_per_kwh']
    if water_price_per_litre.get('water_price_per_litre') is not None:
        advanced_config['water_price_per_litre'] = water_price_per_litre['water_price_per_litre']
    if waterloop_enabled.get('waterloop_enabled') is not None:
        advanced_config['waterloop_enabled'] = waterloop_enabled['waterloop_enabled']
    if required_increase_electrical_kw.get('required_increase_electrical_kw') is not None:
        advanced_config['required_increase_electrical_kw'] = required_increase_electrical_kw['required_increase_electrical_kw']
    
    return advanced_config if advanced_config else None

def calculate_it_capex(data_hall_capacity_mw, data_center_type, air_rack_cooling_capacity_kw_per_rack, planned_years):
    """
    Calculate IT equipment CAPEX based on data hall capacity and configuration.
    
    Args:
        data_hall_capacity_mw: Total data hall electrical capacity in MW
        data_center_type: "General Purpose" or "HPC/AI"
        air_rack_cooling_capacity_kw_per_rack: Cooling capacity per rack in kW
        planned_years: Years of planned operation (for refresh calculations)
        
    Returns:
        dict: IT CAPEX breakdown including servers, refreshes, and totals
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
    
    # Estimate total number of racks based on data hall capacity
    # Assume 80% utilization of total capacity for IT load
    it_capacity_kw = total_capacity_kw * 0.8
    
    # Calculate server power consumption
    if data_center_type == "General Purpose":
        server_power_kw = 1  # 1kW per server
    else:  # HPC/AI
        server_power_kw = 2  # 2kW per server
    
    # Calculate total servers and racks needed
    total_servers_needed = int(it_capacity_kw / server_power_kw)
    total_racks_needed = int(total_servers_needed / max_servers_per_rack) + 1
    
    # Calculate cost per server
    cost_per_server = calculate_typical_it_cost_per_server(data_center_type)
    
    # Calculate initial server CAPEX
    initial_server_capex = total_servers_needed * cost_per_server
    
    # Calculate server refresh costs over planned years
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
    # Auto-detect advanced mode if IT configuration inputs are provided
    has_it_inputs = (
        include_it_cost.get('include_it_cost') is not None or
        data_center_type.get('data_center_type') is not None or
        air_rack_cooling_capacity_kw_per_rack.get('air_rack_cooling_capacity_kw_per_rack') is not None
    )
    
    # Use advanced mode if explicitly set OR if IT inputs are provided
    use_advanced_mode = advanced or has_it_inputs
    
    # Build advanced configuration if any advanced parameters are set
    advanced_config = build_advanced_config()
    
    if not use_advanced_mode:
        # Basic mode - only cooling calculations
        capex_input_data = {
            'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
            'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
            'country': project_location['project_location'],
            'advanced_config': advanced_config
        }
        
        opex_input_data = {
            'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
            'annualised_air_ppue': annualised_air_ppue['annualised_air_ppue'],
            'percentage_of_utilisation': percentage_of_utilisation['%_of_utilisation'],
            'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
            'country': project_location['project_location'],
            'advanced_config': advanced_config
        }
        
        lifetime_opex_input_data = {
            'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
            'annualised_air_ppue': annualised_air_ppue['annualised_air_ppue'],
            'percentage_of_utilisation': percentage_of_utilisation['%_of_utilisation'],
            'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
            'planned_years_of_operation': planned_years_of_operation['planned_years_of_operation'],
            'country': project_location['project_location'],
            'advanced_config': advanced_config
        }
        
        air_cooling_capex = calculate_air_cooling_capex(capex_input_data)
        air_cooling_opex = await calculate_air_cooling_opex(opex_input_data, air_cooling_capex['total_capex'])
        total_opex_lifetime = await calculate_total_opex_lifetime(lifetime_opex_input_data, air_cooling_capex['total_capex'])
        total_cost_of_ownership = total_opex_lifetime['total_opex_over_lifetime'] + air_cooling_capex['total_capex']
        
        return {
            'air_cooling_capex': air_cooling_capex['cooling_equipment_capex'],
            'it_capex': {'total_it_capex': 0},  # Include zero IT CAPEX for consistency
            'total_capex': air_cooling_capex['total_capex'],
            'opex': air_cooling_opex,
            'total_opex_over_lifetime': total_opex_lifetime,
            'total_cost_of_ownership': total_cost_of_ownership,
            'include_it_cost': 'No',  # Show IT costs were not included
            'advanced_mode': False,
            'advanced_config_used': advanced_config is not None,
            'advanced_adjustments': {
                'capex_adjustments': air_cooling_capex.get('advanced_adjustments'),
                'opex_adjustments': total_opex_lifetime.get('advanced_adjustments')
            }
        }
    else:
        # Advanced mode - includes IT configuration and advanced data centre configuration
        capex_input_data = {
            'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
            'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
            'country': project_location['project_location'],
            'advanced_config': advanced_config
        }
        
        opex_input_data = {
            'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
            'annualised_air_ppue': annualised_air_ppue['annualised_air_ppue'],
            'percentage_of_utilisation': percentage_of_utilisation['%_of_utilisation'],
            'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
            'country': project_location['project_location'],
            'advanced_config': advanced_config
        }
        
        lifetime_opex_input_data = {
            'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
            'annualised_air_ppue': annualised_air_ppue['annualised_air_ppue'],
            'percentage_of_utilisation': percentage_of_utilisation['%_of_utilisation'],
            'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
            'planned_years_of_operation': planned_years_of_operation['planned_years_of_operation'],
            'country': project_location['project_location'],
            'advanced_config': advanced_config
        }
        
        # Calculate cooling CAPEX
        air_cooling_capex = calculate_air_cooling_capex(capex_input_data)
        
        # Calculate IT CAPEX if requested
        it_capex_result = {'total_it_capex': 0}
        include_it_cost_value = include_it_cost.get('include_it_cost')
        if (include_it_cost_value and 
            str(include_it_cost_value).lower() in ['yes', 'true', '1']):
            
            it_capex_result = calculate_it_capex(
                data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
                data_center_type.get('data_center_type'),
                air_rack_cooling_capacity_kw_per_rack.get('air_rack_cooling_capacity_kw_per_rack'),
                planned_years_of_operation.get('planned_years_of_operation')
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
            'include_it_cost': include_it_cost.get('include_it_cost') or 'No',  # Show if IT costs were included
            'advanced_mode': True,
            'advanced_config_used': advanced_config is not None,
            'advanced_adjustments': {
                'capex_adjustments': air_cooling_capex.get('advanced_adjustments'),
                'opex_adjustments': total_opex_lifetime.get('advanced_adjustments')
            }
        }