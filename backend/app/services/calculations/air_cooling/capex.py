from app.mock_db.data_access import get_mock_data

# Typical - High Efficiency calculation same as customer calculation
def calculate_cooling_equipment_capex(data_source, cooling_capacity_limit):
    data = get_mock_data()
    if data_source == 'typical':
        if cooling_capacity_limit == 5:
            return int(data['air_cooled_cost_with_inflation_LE'][0]['value']) - int(data['total_it_cost'][0]['value'])
        elif cooling_capacity_limit == 10:
            return int(data['air_cooled_cost_with_inflation_HE'][0]['value']) - int(data['total_it_cost'][0]['value'])
    elif data_source == 'customer':
        return int(data['air_cooled_cost_with_inflation_HE'][0]['value']) - int(data['total_it_cost'][0]['value'])
    return 0
    
def calculate_it_equipment_capex(data_source, cooling_capacity_limit):
    data = get_mock_data()
    # IT Equipment Capex runs on the assumption that the total number of servers is static at 4546
    
    # Both Typical and Customer data sources result in the same calculation
    # If cooling capacity limit was either 5 or 10, the result of the calculation remains the same
    # Thus I return the total IT cost without any conditions
    return int(data['total_it_cost'][0]['value']) 
    
def total_capex(data_source, cooling_capacity_limit, include_it_cost):
    CECPX = calculate_cooling_equipment_capex(data_source, cooling_capacity_limit)
    ITCPX = calculate_it_equipment_capex(data_source, cooling_capacity_limit)
    
    if include_it_cost:
        return CECPX + ITCPX
    else:
        return CECPX
    
def calculate_cooling_capex(input):
    """
    This is the entry point function for air cooling capex that will be called from services/calculations/main.py.
    It receives a dictionary with required inputs:
    {   
        'data_source': string,
        'cooling_capacity_limit': int,
        'include_it_cost': bool
    }
    """
    data_source = input.get('data_source')
    cooling_capacity_limit = input.get('cooling_capacity_limit')
    include_it_cost = input.get('include_it_cost')
    
    cooling_equipment_capex = calculate_cooling_equipment_capex(data_source, cooling_capacity_limit)
    it_equipment_capex = calculate_it_equipment_capex(data_source, cooling_capacity_limit)
    total = total_capex(data_source, cooling_capacity_limit, include_it_cost)
    
    return {
        'cooling_equipment_capex': cooling_equipment_capex,
        'it_equipment_capex': it_equipment_capex,
        'total_capex': total
    }