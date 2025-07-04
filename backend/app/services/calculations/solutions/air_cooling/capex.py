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

# Electrical infrastructure cost per kW
ELECTRICAL_COST_PER_KW = 1500  # USD per kW for electrical infrastructure

def calculate_cooling_equipment_capex(first_year_of_operation: int, capacity_mw: float, country: str, advanced_config=None):
    nameplate_power_kw = capacity_mw * 1000
    country_multiplier = COUNTRY_MULTIPLIERS[country]
    base_capex = country_multiplier * nameplate_power_kw
    inflation_factor = INFLATION_FACTORS[first_year_of_operation]
    
    # Apply advanced configuration adjustments
    advanced_adjustments = {}
    
    # Add electrical capacity increase cost if specified
    if advanced_config and advanced_config.get('required_increase_electrical_kw'):
        electrical_increase_kw = advanced_config['required_increase_electrical_kw']
        electrical_increase_cost = electrical_increase_kw * ELECTRICAL_COST_PER_KW * inflation_factor
        base_capex += electrical_increase_cost
        advanced_adjustments['electrical_increase_cost'] = electrical_increase_cost
        advanced_adjustments['electrical_increase_kw'] = electrical_increase_kw
    
    # Add air replacement cost if specified (for retrofitting scenarios)
    if advanced_config and advanced_config.get('air_replacement_capex_pct'):
        air_replacement_pct = advanced_config['air_replacement_capex_pct']
        air_replacement_cost = base_capex * air_replacement_pct
        base_capex += air_replacement_cost
        advanced_adjustments['air_replacement_cost'] = air_replacement_cost
        advanced_adjustments['air_replacement_pct'] = air_replacement_pct
    
    final_capex = base_capex * inflation_factor
    
    return final_capex, advanced_adjustments

def calculate_cooling_capex(input_data):
    '''
    Calculates the cooling CAPEX for an air cooling solution.

    It receives a dictionary with required inputs:
    {
        'data_hall_design_capacity_mw': float,
        'first_year_of_operation': int,
        'country': str,
        'advanced_config': Optional[dict]  # New advanced configuration
    }
    '''
    capacity_mw = input_data.get('data_hall_design_capacity_mw')
    first_year_of_operation = input_data.get('first_year_of_operation')
    country = input_data.get('country')
    advanced_config = input_data.get('advanced_config')
    
    # Equipment Capex (EXCL: Land, Core, Shell)
    cooling_equipment_capex, advanced_adjustments = calculate_cooling_equipment_capex(
        first_year_of_operation, capacity_mw, country, advanced_config
    )

    # Total Capex (EXCL: IT, Land, Core, Shell)
    total_capex = cooling_equipment_capex
    
    # Calculate base values for response
    nameplate_power_kw = capacity_mw * 1000
    country_multiplier = COUNTRY_MULTIPLIERS[country]
    inflation_factor = INFLATION_FACTORS[first_year_of_operation]
    base_capex_before_inflation = country_multiplier * nameplate_power_kw
    
    return {
        'cooling_equipment_capex': cooling_equipment_capex,
        'total_capex': total_capex,
        'total_capex_excl_it': total_capex,  # For compatibility
        'nameplate_power_kw': nameplate_power_kw,
        'country_multiplier': country_multiplier,
        'inflation_factor': inflation_factor,
        'base_capex_before_inflation': base_capex_before_inflation,
        'advanced_adjustments': advanced_adjustments if advanced_adjustments else None
    }