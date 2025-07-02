from .defaults import DEFAULT_25_SERVER_L2_BOM

# =============================================================================
# SERVER L2 BOM (BILL OF MATERIALS) CALCULATIONS
# =============================================================================

def calculate_server_l2_bom():
    """
    Calculate Level 2 Bill of Materials cost for server.
    This includes chassis, power supplies, and other components.
    
    Returns:
        float: L2 BOM cost (currently fixed at $1200)
    """
    return DEFAULT_25_SERVER_L2_BOM
