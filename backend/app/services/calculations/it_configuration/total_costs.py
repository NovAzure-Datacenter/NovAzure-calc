from .defaults import DEFAULT_HPC_AI_COST_PER_SERVER
from .cpu_costs import calculate_total_cpu_price_per_server
from .memory_costs import calculate_total_memory_cost_per_server
from .network_costs import calculate_total_network_cost_per_server
from .server_l2_bom import calculate_server_l2_bom

# =============================================================================
# TOTAL IT COST CALCULATIONS
# =============================================================================

def calculate_total_it_cost_per_server(total_cpu_price_per_server=None, total_memory_cost_per_server=None, 
                                     server_l2_bom=None, total_network_cost_per_server=None):
    """
    Calculate total IT cost per server by combining all components.
    
    Args:
        total_cpu_price_per_server: CPU cost per server (calculated if not provided)
        total_memory_cost_per_server: Memory cost per server (calculated if not provided)
        server_l2_bom: L2 BOM cost (default: $1200)
        total_network_cost_per_server: Network cost per server (calculated if not provided)
        
    Returns:
        float: Total IT cost per server
    """
    cpu_cost = total_cpu_price_per_server if total_cpu_price_per_server is not None else calculate_total_cpu_price_per_server()
    memory_cost = total_memory_cost_per_server if total_memory_cost_per_server is not None else calculate_total_memory_cost_per_server()
    l2_bom = server_l2_bom if server_l2_bom is not None else calculate_server_l2_bom()
    network_cost = total_network_cost_per_server if total_network_cost_per_server is not None else calculate_total_network_cost_per_server()
    
    return cpu_cost + memory_cost + l2_bom + network_cost


def calculate_typical_it_cost_per_server(data_center_type: str):
    """
    Get typical IT cost per server based on data center type.
    
    Args:
        data_center_type: "General Purpose" or "HPC/AI"
        
    Returns:
        float: Typical IT cost per server
    """
    if data_center_type == "General Purpose":
        return calculate_total_it_cost_per_server()
    else:  # HPC/AI or other types
        return DEFAULT_HPC_AI_COST_PER_SERVER
