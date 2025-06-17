from app.mock_db.data_access import get_mock_data

def calculate_cooling_equipment_capex(chassis_technology, cooling_capacity_limit):
    data = get_mock_data()
    
    if chassis_technology == "KU:L 2":
        return int(data['chassis_solution_capex_in_absence_of_waterloop'][0]['value']) - int(data['chassis_total_it_cost'][0]['value'])
    elif chassis_technology == "Purpose Optimized Multinode":
        return int(data['chassis_solution_capex_in_absence_of_waterloop'][0]['value']) - int(data['chassis_total_it_cost'][0]['value'])
 
    return 0

def calculate_it_equipment_capex(chassis_technology, cooling_capacity_limit):
    data = get_mock_data()
    if chassis_technology == "KU:L 2":
        return int(data['chassis_total_it_cost'][0]['value'])
    elif chassis_technology == "Purpose Optimized Multinode":
        return int(data['chassis_total_it_cost'][0]['value'])
 
    return 0

def total_capex(chassis_technology, cooling_capacity_limit, include_it_cost):
    CECPX = calculate_cooling_equipment_capex(chassis_technology, cooling_capacity_limit)
    ITCPX = calculate_it_equipment_capex(chassis_technology, cooling_capacity_limit)
    
    if include_it_cost:
        return CECPX + ITCPX
    else:
        return CECPX
    
def calculate_cooling_capex(input):
    """
    This is the entry point function for chassis cooling capex that will be called from services/calculations/main.py.
    It receives a dictionary with required inputs:
    {
        'chassis_technology': string,
        'cooling_capacity_limit': int,
        'include_it_cost': bool
    }
    """
    
    chassis_technology = input.get('chassis_technology')
    cooling_capacity_limit = input.get('cooling_capacity_limit')
    include_it_cost = input.get('include_it_cost')
    
    cooling_equipment_capex = calculate_cooling_equipment_capex(chassis_technology, cooling_capacity_limit)
    it_equipment_capex = calculate_it_equipment_capex(chassis_technology, cooling_capacity_limit)
    total = total_capex(chassis_technology, cooling_capacity_limit, include_it_cost)
    
    return {
        'cooling_equipment_capex': cooling_equipment_capex,
        'it_equipment_capex': it_equipment_capex,
        'total_capex': total
    }