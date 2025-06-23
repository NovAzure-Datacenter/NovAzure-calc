from app.mock_db.data_access import get_mock_data

def calculate_cooling_equipment_capex(data_source, chassis_technology, cooling_capacity_limit):
    data = get_mock_data()
    
    # Cooling capacity limit used in chassis immersion cooling, why?
    if data_source == "typical":
        if chassis_technology == "KU:L 2":
            return int(data['chassis_solution_capex_in_absence_of_waterloop'][0]['value']) - int(data['chassis_total_it_cost'][0]['value'])
        elif chassis_technology == "Purpose Optimized Multinode":
            return int(data['chassis_solution_capex_in_absence_of_waterloop'][0]['value']) - int(data['chassis_total_it_cost'][0]['value'])
    elif data_source == "customer":
        # Chassis markup for both technologies are the same, ['chassis_markup'][0]['value'] == ['chassis_markup'][1]['value']
        # Chassis total IT cost is also the same
        if chassis_technology == "KU:L 2":
            return (int(data['chassis_markup'][0]['value']) + int(data['chassis_capex_with_inflation'][0]['value'])) - int(data['chassis_total_it_cost'][0]['value'])
        elif chassis_technology == "Purpose Optimized Multinode":
            return (int(data['chassis_markup'][1]['value']) + int(data['chassis_capex_with_inflation'][1]['value'])) - int(data['chassis_total_it_cost'][0]['value'])
 
    return 0

def calculate_it_equipment_capex(data_source, chassis_technology, cooling_capacity_limit):
    data = get_mock_data()
    if data_source == "typical":
        if chassis_technology == "KU:L 2":
            return int(data['chassis_total_it_cost'][0]['value'])
        elif chassis_technology == "Purpose Optimized Multinode":
            return int(data['chassis_total_it_cost'][0]['value'])
    elif data_source == "customer":
        # Comparing both technologies KU:L 2 and Purpose Optimized Multinode will result in the same cost
        return int(float(data['total_it_cost_per_kw'][0]['value']))
 
    return 0

def total_capex(data_source, chassis_technology, cooling_capacity_limit, include_it_cost):
    CECPX = calculate_cooling_equipment_capex(data_source, chassis_technology, cooling_capacity_limit)
    ITCPX = calculate_it_equipment_capex(data_source, chassis_technology, cooling_capacity_limit)
    
    if include_it_cost:
        return CECPX + ITCPX
    else:
        return CECPX
    
def calculate_cooling_capex(input):
    """
    This is the entry point function for chassis cooling capex that will be called from services/calculations/main.py.
    It receives a dictionary with required inputs:
    {
        'data_source': string,
        'chassis_technology': string,
        'cooling_capacity_limit': int,
        'include_it_cost': bool
    }
    """
    data_source = input.get('data_source')
    chassis_technology = input.get('chassis_technology')
    cooling_capacity_limit = input.get('cooling_capacity_limit')
    include_it_cost = input.get('include_it_cost')
    
    cooling_equipment_capex = calculate_cooling_equipment_capex(data_source, chassis_technology, cooling_capacity_limit)
    it_equipment_capex = calculate_it_equipment_capex(data_source, chassis_technology, cooling_capacity_limit)
    total = total_capex(data_source, chassis_technology, cooling_capacity_limit, include_it_cost)
    
    return {
        'cooling_equipment_capex': cooling_equipment_capex,
        'it_equipment_capex': it_equipment_capex,
        'total_capex': total
    }