"""
Air Cooling CAPEX Calculation Service
Calculates cooling equipment costs based on country-specific multipliers and inflation
"""

from typing import Dict, Any
from datetime import datetime

# Country-specific multipliers (USD per kW)
COUNTRY_MULTIPLIERS = {
    "USA": 3849,
    "Singapore": 3527, 
    "UK": 4952,
    "UAE": 3433
}

# Inflation factors by base year (these would typically come from a database or external service)
# For now, using sample inflation factors - you'll want to update with real data
INFLATION_FACTORS = {
    2020: 1.0,
    2021: 1.045,  # 4.5% inflation
    2022: 1.092,  # 9.2% inflation
    2023: 1.125,  # 12.5% cumulative
    2024: 1.158,  # 15.8% cumulative
    2025: 1.190,  # 19.0% cumulative
}

def get_inflation_factor(base_year: int) -> float:
    """
    Get inflation factor for the given base year
    Current year is used as the reference point
    """
    current_year = datetime.now().year
    
    # If base year is current year or future, no inflation adjustment
    if base_year >= current_year:
        return 1.0
    
    # Look up inflation factor, default to 1.0 if not found
    return INFLATION_FACTORS.get(base_year, 1.0)

def calculate_cooling_capex(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate air cooling CAPEX based on data hall capacity, country, and base year
    
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
    
    # Get country-specific multiplier
    country_multiplier = COUNTRY_MULTIPLIERS[country]
    
    # Calculate base CAPEX before inflation
    base_capex_before_inflation = country_multiplier * nameplate_power_kw
    
    # Get inflation factor
    inflation_factor = get_inflation_factor(base_year)
    
    # Calculate final CAPEX with inflation
    cooling_equipment_capex = base_capex_before_inflation * inflation_factor
    
    # For air cooling, total CAPEX (excl IT) is same as cooling equipment CAPEX
    total_capex_excl_it = cooling_equipment_capex
    
    # Assume 25-year asset life for annual CAPEX calculation
    asset_life_years = 25
    annual_cooling_capex = cooling_equipment_capex / asset_life_years
    
    # For this calculation, assume OPEX lifetime is 10% of CAPEX per year over 10 years
    # (This would be more sophisticated in real implementation)
    annual_opex_rate = 0.10
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