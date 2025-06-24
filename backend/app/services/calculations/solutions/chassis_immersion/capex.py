"""
Chassis Immersion CAPEX Calculation Service
Calculates chassis immersion cooling equipment costs based on country-specific multipliers and inflation
"""

from typing import Dict, Any
from datetime import datetime

# Country-specific multipliers for chassis immersion (USD per kW)
# These would typically be different from air cooling due to technology differences
COUNTRY_MULTIPLIERS = {
    "USA": 4620,      # ~20% premium over air cooling
    "Singapore": 4232, # ~20% premium over air cooling
    "UK": 5942,       # ~20% premium over air cooling  
    "UAE": 4120       # ~20% premium over air cooling
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
    2050: 1.70,
}

def get_inflation_factor(base_year: int) -> float:
    """
    Get inflation factor for the given base year using UK Capex Inflation data
    Base year represents when costs were established - older years get higher inflation factors
    """
    # Look up inflation factor directly - base year determines the inflation to apply
    if base_year in INFLATION_FACTORS:
        return INFLATION_FACTORS[base_year]
    elif base_year < min(INFLATION_FACTORS.keys()):
        # For years before 2023, use 2023 rate (1.0 - no inflation)
        return INFLATION_FACTORS[2023]
    else:
        # For years after 2050, use 2050 rate (highest inflation)
        return INFLATION_FACTORS[2050]

def calculate_cooling_capex(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate chassis immersion cooling CAPEX based on data hall capacity, country, and base year
    
    Args:
        input_data: Dictionary containing:
            - data_hall_design_capacity_mw: float (Maximum Nameplate Input in MW)
            - base_year: int (For inflation calculations)
            - country: str (USA, Singapore, UK, UAE)
    
    Returns:
        Dictionary with calculation results
    """
    
    # Extract inputs
    capacity_mw = input_data['data_hall_design_capacity_mw']
    base_year = input_data['base_year']
    country = input_data['country']
    
    # Validate country
    if country not in COUNTRY_MULTIPLIERS:
        raise ValueError(f"Unsupported country: {country}. Supported countries: {list(COUNTRY_MULTIPLIERS.keys())}")
    
    # Calculate nameplate power in kW
    nameplate_power_kw = capacity_mw * 1000
    
    # Get country-specific multiplier for chassis immersion
    country_multiplier = COUNTRY_MULTIPLIERS[country]
    
    # Calculate base CAPEX before inflation
    base_capex_before_inflation = country_multiplier * nameplate_power_kw
    
    # Get inflation factor (using UK data universally)
    inflation_factor = get_inflation_factor(base_year)
    
    # Calculate final CAPEX with inflation
    cooling_equipment_capex = base_capex_before_inflation * inflation_factor
    
    # For chassis immersion, total CAPEX (excl IT) is same as cooling equipment CAPEX
    total_capex_excl_it = cooling_equipment_capex
    
    # Assume 25-year asset life for annual CAPEX calculation
    asset_life_years = 25
    annual_cooling_capex = cooling_equipment_capex / asset_life_years
    
    # Chassis immersion typically has lower OPEX due to higher efficiency
    # Assume 8% of CAPEX per year over 10 years (vs 10% for air cooling)
    annual_opex_rate = 0.08
    opex_years = 10
    opex_lifetime = cooling_equipment_capex * annual_opex_rate * opex_years
    
    # Total cost of ownership = CAPEX + Lifetime OPEX
    total_cost_ownership_excl_it = cooling_equipment_capex + opex_lifetime
    
    return {
        'cooling_equipment_capex': round(cooling_equipment_capex, 2),
        'total_capex_excl_it': round(total_capex_excl_it, 2),
        'annual_cooling_capex': round(annual_cooling_capex, 2),
        'opex_lifetime': round(opex_lifetime, 2),
        'total_cost_ownership_excl_it': round(total_cost_ownership_excl_it, 2),
        
        # Calculation details
        'nameplate_power_kw': nameplate_power_kw,
        'country_multiplier': country_multiplier,
        'inflation_factor': inflation_factor,
        'base_capex_before_inflation': round(base_capex_before_inflation, 2)
    }