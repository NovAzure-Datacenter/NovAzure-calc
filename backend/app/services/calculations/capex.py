from app.mock_db.data_access import get_mock_data

def calculate_cooling_equipment_capex(input):
    data = get_mock_data()
    capex = 0
 
    if input == 5:
        capex = int(data['air_cooled_cost_with_inflation_LE'][0]['value']) - int(data['total_it_cost'][0]['value'])
    elif input == 10:
        capex = int(data['air_cooled_cost_with_inflation_HE'][0]['value']) - int(data['total_it_cost'][0]['value'])
       
    return capex