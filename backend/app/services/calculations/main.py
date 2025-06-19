from app.services.calculations.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex
from app.services.calculations.chassis_immersion.capex import calculate_cooling_capex as calculate_chassis_immersion_capex

# Initialising User inputs that will be used in the calculations

# Typical data pull or Customer data pull
data_source = { 'data_source': 'typical' }
cooling_solution_inputs = { 'cooling_type': None }
cooling_capacity_inputs = { 'cooling_capacity_limit': None }
cost_inclusion_inputs = { 'include_it_cost': None }
chassis_technology_inputs = {'chassis_technology': None}

def update_inputs(inputs):
    for key, value in inputs.items():
        if key in cooling_solution_inputs:
            cooling_solution_inputs[key] = value
        elif key in cooling_capacity_inputs:
            cooling_capacity_inputs[key] = value
        elif key in cost_inclusion_inputs:
            cost_inclusion_inputs[key] = value
        elif key in chassis_technology_inputs:
            chassis_technology_inputs[key] = value
        elif key in data_source:
            data_source[key] = value
        
def calculate():
    if cooling_solution_inputs['cooling_type'] == 'air_cooling':
        input_data = {
            'data_source': data_source['data_source'],
            'cooling_capacity_limit': cooling_capacity_inputs['cooling_capacity_limit'],
            'include_it_cost': cost_inclusion_inputs['include_it_cost']
        }
        return calculate_air_cooling_capex(input_data)
    elif cooling_solution_inputs['cooling_type'] == 'chassis_immersion':
        input_data = {
            'data_source': data_source['data_source'],
            'chassis_technology': chassis_technology_inputs['chassis_technology'],
            'cooling_capacity_limit': cooling_capacity_inputs['cooling_capacity_limit'],
            'include_it_cost': cost_inclusion_inputs['include_it_cost']
        }
        return calculate_chassis_immersion_capex(input_data)
    return None