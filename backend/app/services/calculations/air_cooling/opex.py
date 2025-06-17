from app.mock_db.data_access import get_mock_data

def calculate_annual_cooling_opex(cooling_capacity_limit):
    """
    Annual Cooling Opex:
    - If capacity < 10: Total Opex LE - IT Maintenance LE
    - Else: Total Opex HE - IT Maintenance HE
    """
    data = get_mock_data()

    if cooling_capacity_limit < 10:
        total_opex = int(data['annual_Cooling_Opex_LE'][0]['value'])
        it_maintenance = int(data['annual_IT_Equipment_Maintenance_LE'][0]['value'])
    else:
        total_opex = int(data['annual_Cooling_Opex_HE'][0]['value'])
        it_maintenance = int(data['annual_IT_Equipment_Maintenance_HE'][0]['value'])

    return total_opex - it_maintenance

def calculate_annual_it_maintenance(cooling_capacity_limit):
    """
    Annual IT Equipment Maintenance:
    - If cooling capacity < 10: IT Maintenance LE
    - Else: IT Maintenance HE
    """
    data = get_mock_data()

    if cooling_capacity_limit < 10:
        return int(data['annual_IT_Equipment_Maintenance_LE'][0]['value'])
    else:
        return int(data['annual_IT_Equipment_Maintenance_HE'][0]['value'])

def calculate_opex_lifetime(cooling_capacity_limit, include_it_cost, planned_years_of_operation):
    """
    Opex over Lifetime of Operation (currently N/A logic):

    - If include_it_cost == True:
        - If capacity < 10: use lifetime opex LE
        - Else: use lifetime opex HE

    - Else:
        - Subtract (annual IT maintenance * years) from the total lifetime opex
    """
    data = get_mock_data()

    if cooling_capacity_limit < 10:
        lifetime_opex = int(data['lifetime_Opex_LE'][0]['value'])
        annual_maintenance = int(data['annual_IT_Equipment_Maintenance_LE'][0]['value'])
    else:
        lifetime_opex = int(data['lifetime_Opex_HE'][0]['value'])
        annual_maintenance = int(data['annual_IT_Equipment_Maintenance_HE'][0]['value'])

    if include_it_cost:
        return lifetime_opex
    else:
        return lifetime_opex - (annual_maintenance * planned_years_of_operation)

def calculate_opex(input):
    """
    Entry point for OPEX calculations.

    Input:
    {
        'cooling_capacity_limit': int,
        'include_it_cost': bool,
        'planned_years_of_operation': int
    }

    Output:
    {
        'annual_cooling_opex': int,
        'annual_it_equipment_maintenance': int,
        'opex_lifetime': int
    }
    """
    cooling_capacity_limit = input.get('cooling_capacity_limit')
    include_it_cost = input.get('include_it_cost')
    planned_years = input.get('planned_years_of_operation')

    annual_maintenance = calculate_annual_it_maintenance(cooling_capacity_limit)
    annual_opex = calculate_annual_cooling_opex(cooling_capacity_limit)
    opex_lifetime = calculate_opex_lifetime(cooling_capacity_limit, include_it_cost, planned_years)

    return {
        'annual_cooling_opex': annual_opex,
        'annual_it_equipment_maintenance': annual_maintenance,
        'opex_lifetime': opex_lifetime
    }
