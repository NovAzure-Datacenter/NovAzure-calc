from app.mock_db.data_access import get_mock_data

def calculate_cooling_equipment_capex(input):
    data = get_mock_data()
    capex = 0
 
    if input == 5:
        capex = int(data['air_cooled_cost_with_inflation_LE'][0]['value']) - int(data['total_it_cost'][0]['value'])
    elif input == 10:
        capex = int(data['air_cooled_cost_with_inflation_HE'][0]['value']) - int(data['total_it_cost'][0]['value'])
       
    return capex
    
def calculate_it_equipment_capex(input):
    data = get_mock_data()
    capex = 0
 
    if input == 5 or 10:
        capex = int(data['total_it_cost'][0]['value'])
       
    return capex
    
def total_capex(input):
    capex = 0
    include_IT_cost = False
    # Calculating cooling equipment capex and IT equipment capex both depend on an input, so how is that calculated?
    # 5 is used as an example input value for demonstration purposes.
    CECPX = calculate_cooling_equipment_capex(5)
    ITCPX = calculate_it_equipment_capex(5)
 
    if include_IT_cost:
       capex = CECPX + ITCPX
    else:
        capex = CECPX
    return capex
    