from app.services.calculations.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex

cooling_solution_inputs = { 'cooling_type': None }
cooling_capacity_inputs = { 'cooling_capacity_limit': None }
cost_inclusion_inputs = { 'include_it_cost': None }

def update_inputs(inputs):
    for key, value in inputs.items():
        if key in cooling_solution_inputs:
            cooling_solution_inputs[key] = value
        elif key in cooling_capacity_inputs:
            cooling_capacity_inputs[key] = value
        elif key in cost_inclusion_inputs:
            cost_inclusion_inputs[key] = value

def calculate():
    if cooling_solution_inputs['cooling_type'] == 'air_cooling':
        input_data = {
            'cooling_capacity_limit': cooling_capacity_inputs['cooling_capacity_limit'],
            'include_it_cost': cost_inclusion_inputs['include_it_cost']
        }
        return calculate_air_cooling_capex(input_data)
    
    return None