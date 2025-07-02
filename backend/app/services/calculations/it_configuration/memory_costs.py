from .defaults import (
    DEFAULT_DIMM_CAPACITY_IN_GB,
    DEFAULT_DIMM_COST_PER_GB,
    DEFAULT_DDRS_6400_CHANNELS,
    DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
)

# =============================================================================
# MEMORY COST CALCULATIONS
# =============================================================================

def calculate_total_channels(ddrs_6400_channels=None, number_of_sockets_per_server=None):
    """
    Calculate total memory channels.
    
    Args:
        ddrs_6400_channels: DDR5-6400 channels per socket (default: 12)
        number_of_sockets_per_server: Number of sockets per server (default: 2)
        
    Returns:
        int: Total memory channels
    """
    channels = ddrs_6400_channels if ddrs_6400_channels is not None else DEFAULT_DDRS_6400_CHANNELS
    sockets = number_of_sockets_per_server if number_of_sockets_per_server is not None else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    
    return channels * sockets


def calculate_total_memory_cost_per_server(total_channels=None, dimm_capacity=None, dimm_cost=None):
    """
    Calculate total memory cost per server.
    
    Args:
        total_channels: Total memory channels (calculated if not provided)
        dimm_capacity: DIMM capacity in GB (default: 96)
        dimm_cost: Cost per GB of DIMM (default: $4)
        
    Returns:
        float: Total memory cost per server
    """
    channels = total_channels if total_channels is not None else calculate_total_channels()
    capacity = dimm_capacity if dimm_capacity is not None else DEFAULT_DIMM_CAPACITY_IN_GB
    cost_per_gb = dimm_cost if dimm_cost is not None else DEFAULT_DIMM_COST_PER_GB
    
    return channels * capacity * cost_per_gb
