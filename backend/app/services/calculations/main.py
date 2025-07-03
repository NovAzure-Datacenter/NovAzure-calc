from .solutions.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex
from .solutions.air_cooling.opex import calculate_annual_opex as calculate_air_cooling_opex, calculate_total_opex_over_lifetime as calculate_total_opex_lifetime

# Initialising User inputs that will be used in the calculations
advanced = False
percentage_of_utilisation = { '%_of_utilisation': None }
planned_years_of_operation = {'planned_years_of_operation': None}
project_location = {'project_location': None}
data_hall_design_capacity_mw = {'data_hall_design_capacity_mw': None}
first_year_of_operation = {'first_year_of_operation': None}
annualised_air_ppue = { 'annualised_air_ppue': None }

def update_inputs(inputs):
    for key, value in inputs.items():
        if key in percentage_of_utilisation:
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
        
async def calculate():
    if advanced == False:
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
        
        air_cooling_capex = calculate_air_cooling_capex(capex_input_data)
        air_cooling_opex = await calculate_air_cooling_opex(opex_input_data, air_cooling_capex['total_capex'])
        total_opex_lifetime = await calculate_total_opex_lifetime(lifetime_opex_input_data, air_cooling_capex['total_capex'])
        total_cost_of_ownership = total_opex_lifetime['total_opex_over_lifetime'] + air_cooling_capex['total_capex']
        
        return {
            'air_cooling_capex': air_cooling_capex['cooling_equipment_capex'],
            'total_capex': air_cooling_capex['total_capex'],
            'opex': air_cooling_opex,
            'total_opex_over_lifetime': total_opex_lifetime,
            'total_cost_of_ownership': total_cost_of_ownership
        }
    else:
        pass