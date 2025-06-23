from app.services.calculations.solutions.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex

# Initialising User inputs that will be used in the calculations
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
        
def calculate():
    input_data = {
        'data_hall_design_capacity_mw': data_hall_design_capacity_mw['data_hall_design_capacity_mw'],
        'first_year_of_operation': first_year_of_operation['first_year_of_operation'],
        'country': project_location['project_location']
    }
    air_cooling_capex = calculate_air_cooling_capex(input_data)
    return air_cooling_capex