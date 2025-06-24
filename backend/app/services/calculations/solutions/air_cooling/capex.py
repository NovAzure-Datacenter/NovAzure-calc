# Country-specific multipliers (USD per kW)
COUNTRY_MULTIPLIERS = {
    "United States": 3849,
    "Singapore": 3527, 
    "United Kingdom": 4952,
    "United Arab Emirates": 3433
}

# UK Capex Inflation factors applied universally to all countries
INFLATION_FACTORS = {
    2023: 1.0,
    2024: 1.02,
    2025: 1.04,
    2026: 1.06,
    2027: 1.08,
    2028: 1.10,
    2029: 1.13,
    2030: 1.15,
    2031: 1.17,
    2032: 1.20,
    2033: 1.22,
    2034: 1.24,
    2035: 1.27,
    2036: 1.29,
    2037: 1.32,
    2038: 1.35,
    2039: 1.37,
    2040: 1.40,
    2041: 1.43,
    2042: 1.46,
    2043: 1.49,
    2044: 1.52,
    2045: 1.55,
    2046: 1.58,
    2047: 1.61,
    2048: 1.64,
    2049: 1.67,
    2050: 1.71,
}

    
def calculate_cooling_equipment_capex(first_year_of_operation: int, capacity_mw: float, country: str):

    nameplate_power_kw = capacity_mw * 1000
    country_multiplier = COUNTRY_MULTIPLIERS[country]
    base_capex = country_multiplier * nameplate_power_kw
    inflation_factor = INFLATION_FACTORS[first_year_of_operation]
    return base_capex * inflation_factor

def calculate_cooling_capex(input_data):
    '''
    Calculates the cooling CAPEX for an air cooling solution.

    It receives a dictionary with required inputs:
    {
        'data_hall_design_capacity_mw': float,
        'first_year_of_operation': int,
        'country': str
    }
    '''
    capacity_mw = input_data.get('data_hall_design_capacity_mw')
    first_year_of_operation = input_data.get('first_year_of_operation')
    country = input_data.get('country')
    
    # Equipment Capex (EXCL: Land, Core, Shell)
    cooling_equipment_capex = calculate_cooling_equipment_capex(first_year_of_operation, capacity_mw, country)

    # Total Capex (EXCL: IT, Land, Core, Shell)
    total_capex= cooling_equipment_capex
    
    return {
        'cooling_equipment_capex': cooling_equipment_capex,
        'total_capex': total_capex
    }