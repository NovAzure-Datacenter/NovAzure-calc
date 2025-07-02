from .defaults import (
    DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER,
    DEFAULT_CPU_PRICE_PER_UNIT
)

# =============================================================================
# CPU COST CALCULATIONS
# =============================================================================

def calculate_total_cpu_price_per_server(number_of_sockets_per_server=None, cpu_price_per_unit=None):
    """
    Calculate total CPU cost per server.
    
    Args:
        number_of_sockets_per_server: Number of CPU sockets (default: 2)
        cpu_price_per_unit: Price per CPU unit (default: $2400)
        
    Returns:
        float: Total CPU cost per server
    """
    sockets = number_of_sockets_per_server if number_of_sockets_per_server is not None else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    cpu_price = cpu_price_per_unit if cpu_price_per_unit is not None else DEFAULT_CPU_PRICE_PER_UNIT
    
    return sockets * cpu_price
