"""
Main calculation service - coordinates between different cooling solutions
"""

from typing import Dict, Any, Literal
from app.services.calculations.solutions.air_cooling.capex import calculate_cooling_capex as calculate_air_cooling_capex
from app.services.calculations.solutions.chassis_immersion.capex import calculate_cooling_capex as calculate_chassis_immersion_capex

# Initialising User inputs that will be used in the calculations

# Typical data pull or Customer data pull
data_source = { 'data_source': 'typical' }
cooling_solution_inputs = { 'cooling_type': None }
cooling_capacity_inputs = { 'cooling_capacity_limit': None }
cost_inclusion_inputs = { 'include_it_cost': None }
chassis_technology_inputs = {'chassis_technology': None}
planned_years_of_operation = {'planned_years_of_operation': None}

def update_inputs(inputs):
    for key, value in inputs.items():
        if key in cooling_solution_inputs:
            cooling_solution_inputs[key] = value
        elif key in cooling_capacity_inputs:
            cooling_capacity_inputs[key] = value
        elif key in cost_inclusion_inputs:
            cost_inclusion_inputs[key] = value
        elif key in chassis_technology_inputs:
            chassis_technology_inputs[key] = value
        elif key in data_source:
            data_source[key] = value
        
def calculate_solution_capex(
    cooling_type: Literal["air_cooling", "chassis_immersion"],
    input_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Calculate CAPEX for a specific cooling solution type
    
    Args:
        cooling_type: Type of cooling solution ("air_cooling" or "chassis_immersion")
        input_data: Dictionary containing calculation inputs
    
    Returns:
        Dictionary with calculation results
    """
    
    if cooling_type == "air_cooling":
        return calculate_air_cooling_capex(input_data)
    elif cooling_type == "chassis_immersion":
        return calculate_chassis_immersion_capex(input_data)
    else:
        raise ValueError(f"Unsupported cooling type: {cooling_type}")

def compare_solutions(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compare air cooling vs chassis immersion solutions
    
    Args:
        input_data: Dictionary containing calculation inputs
    
    Returns:
        Dictionary with comparison results
    """
    
    air_cooling_result = calculate_air_cooling_capex(input_data)
    chassis_immersion_result = calculate_chassis_immersion_capex(input_data)
    
    # Calculate savings/differences
    savings = {
        'cooling_equipment_capex_difference': (
            air_cooling_result['cooling_equipment_capex'] - 
            chassis_immersion_result['cooling_equipment_capex']
        ),
        'total_cost_ownership_difference': (
            air_cooling_result['total_cost_ownership_excl_it'] - 
            chassis_immersion_result['total_cost_ownership_excl_it']
        ),
        'opex_lifetime_difference': (
            air_cooling_result['opex_lifetime'] - 
            chassis_immersion_result['opex_lifetime']
        )
    }
    
    return {
        'air_cooling': air_cooling_result,
        'chassis_immersion': chassis_immersion_result,
        'savings': savings,
        'recommendation': (
            'chassis_immersion' if savings['total_cost_ownership_difference'] > 0 
            else 'air_cooling'
        )
    }