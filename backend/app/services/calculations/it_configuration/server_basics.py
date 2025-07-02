import math

# =============================================================================
# BASIC SERVER CALCULATIONS
# =============================================================================

def calculate_server_rated_max_power(data_center_type: str):
    """
    Calculate server power multiplier based on data center type.
    
    Args:
        data_center_type: "General Purpose" or "HPC/AI"
        
    Returns:
        int: 1 for General Purpose, 2 for HPC/AI, "" for unselected, None for invalid
    """
    if data_center_type == "General Purpose":
        return 1
    elif data_center_type == "HPC/AI":
        return 2
    elif data_center_type == "Select an Option":
        return ""
    else:
        return None


def calculate_number_of_server_refreshes(planned_years: int):
    """
    Calculate number of server refreshes needed over planned operation years.
    Servers are typically refreshed every 5 years.
    
    Args:
        planned_years: Number of years of planned operation
        
    Returns:
        int: Number of server refreshes needed
    """
    if planned_years >= 5:
        return math.ceil((planned_years / 5) - 1)
    elif planned_years < 5:
        return 0
    else:
        return 0
