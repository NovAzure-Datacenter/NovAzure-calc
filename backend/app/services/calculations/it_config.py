"""
IT Configuration Module for Data Center Cost Modeling

This module handles IT equipment cost calculations for data center planning.
It supports both "General Purpose" and "HPC/AI" data center configurations
with flexible component-based cost modeling.

Key Features:
- Server power and hardware cost calculations
- Network infrastructure cost modeling  
- Memory and CPU component pricing
- Rack-level capacity planning
- Data center type-specific configurations

The calculations are based on industry-standard server configurations
and can be customized through function parameters or default values.
"""

import math

# =============================================================================
# DEFAULT IT CONFIGURATION VALUES
# =============================================================================
# These defaults represent typical enterprise server configurations
# and can be overridden in function calls for custom scenarios

# Server Hardware Defaults
DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER = 2      # Dual-socket servers are standard
DEFAULT_CPU_PRICE_PER_UNIT = 2400             # Price per CPU socket ($)
DEFAULT_SERVERS_PER_RACK = 14                 # Typical 42U rack utilization

# Memory Configuration Defaults  
DEFAULT_TOTAL_CHANNELS = 16                   # Total memory channels per server
DEFAULT_DIMM_CAPACITY_IN_GB = 96              # Memory module capacity (GB)
DEFAULT_DIMM_COST_PER_GB = 4                  # Cost per GB of server memory ($)
DEFAULT_DDRS_6400_CHANNELS = 12               # DDR5-6400 channels per CPU socket

# Network Infrastructure Defaults
DEFAULT_NETWORK_CABLE_COST_PER_SERVER = 100.0 # Networking cables per server ($)
DEFAULT_SWITCH_COST_PER_UNIT = 8000           # Network switch cost ($)

# Bill of Materials (BOM) Defaults
DEFAULT_25_SERVER_L2_BOM = 1200               # Level 2 BOM cost per server ($)
                                              # Includes chassis, PSU, cooling, etc.

# Data Center Type Specific Defaults
DEFAULT_HPC_AI_COST_PER_SERVER = 50000       # High-performance server cost ($)
DEFAULT_ANNUAL_IT_MAINTENANCE_COST_PERCENTAGE = 0.08  # 8% annual maintenance

# =============================================================================
# SERVER POWER AND HARDWARE SPECIFICATIONS
# =============================================================================

def calculate_server_rated_max_power(data_center_type: str):
    """
    Determine server power rating based on data center type.
    
    This function returns a power multiplier that reflects the different
    power requirements between general-purpose and high-performance computing servers.
    
    Args:
        data_center_type: The type of data center configuration
                         - "General Purpose": Standard enterprise servers (~1kW)
                         - "HPC/AI": High-performance computing servers (~2kW)
                         - "Select an Option": No selection made
        
    Returns:
        int: Power multiplier (1 for General Purpose, 2 for HPC/AI)
        str: Empty string if no option selected
        None: If invalid data center type provided
        
    Business Logic:
        - General Purpose servers typically consume 1kW per server
        - HPC/AI servers with GPUs typically consume 2kW per server
        - This affects rack capacity planning and cooling requirements
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
    Calculate server refresh cycles over the planned operational period.
    
    Enterprise servers typically have a 5-year depreciation cycle and are
    refreshed to maintain performance and warranty coverage.
    
    Args:
        planned_years: Total years of planned data center operation
        
    Returns:
        int: Number of server refresh cycles needed
        
    Business Logic:
        - Servers older than 5 years may lack vendor support
        - Performance degradation occurs over time
        - Technology advances make older servers less efficient
        
    Examples:
        - 3 years: 0 refreshes (servers still current)
        - 7 years: 1 refresh (refresh after year 5)
        - 12 years: 2 refreshes (refresh after years 5 and 10)
    """
    if planned_years >= 5:
        return math.ceil((planned_years / 5) - 1)
    elif planned_years < 5:
        return 0
    else:
        return 0

# =============================================================================
# CPU COST CALCULATIONS
# =============================================================================

def calculate_total_cpu_price_per_server(number_of_sockets_per_server=None, cpu_price_per_unit=None):
    """
    Calculate the total CPU cost for a single server.
    
    Modern enterprise servers typically use dual-socket configurations
    to balance performance, cost, and power efficiency.
    
    Args:
        number_of_sockets_per_server: CPU sockets per server (default: 2)
                                    - 1 socket: Entry-level servers
                                    - 2 sockets: Standard enterprise configuration
                                    - 4+ sockets: High-end systems (rare)
        cpu_price_per_unit: Cost per CPU socket in USD (default: $2400)
                          - Varies by CPU model, core count, and generation
        
    Returns:
        float: Total CPU cost per server in USD
        
    Business Context:
        CPU costs represent 15-25% of total server cost but significantly
        impact performance and power consumption. Price varies by:
        - Core count (8-64+ cores per socket)
        - Clock speed and architecture generation
        - Enterprise features (virtualization, security)
    """
    sockets = number_of_sockets_per_server if number_of_sockets_per_server is not None else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    cpu_price = cpu_price_per_unit if cpu_price_per_unit is not None else DEFAULT_CPU_PRICE_PER_UNIT
    
    return sockets * cpu_price

# =============================================================================
# MEMORY COST CALCULATIONS
# =============================================================================

def calculate_total_channels(ddrs_6400_channels=None, number_of_sockets_per_server=None):
    """
    Calculate total memory channels available in a server.
    
    Memory channels determine the maximum memory capacity and bandwidth.
    Modern CPUs support 8-12 channels per socket for high-performance applications.
    
    Args:
        ddrs_6400_channels: DDR5-6400 channels per CPU socket (default: 12)
                          - DDR5-6400: Latest generation memory standard
                          - 12 channels: High-end CPU configuration
        number_of_sockets_per_server: CPU sockets per server (default: 2)
        
    Returns:
        int: Total memory channels across all CPU sockets
        
    Technical Context:
        - More channels = higher memory bandwidth
        - DDR5-6400 provides 51.2 GB/s per channel
        - Enterprise workloads benefit from balanced CPU-to-memory ratios
    """
    channels = ddrs_6400_channels if ddrs_6400_channels is not None else DEFAULT_DDRS_6400_CHANNELS
    sockets = number_of_sockets_per_server if number_of_sockets_per_server is not None else DEFAULT_NUMBER_OF_SOCKETS_PER_SERVER
    
    return channels * sockets


def calculate_total_memory_cost_per_server(total_channels=None, dimm_capacity=None, dimm_cost=None):
    """
    Calculate total memory cost for a single server.
    
    Memory costs vary significantly based on capacity, speed, and generation.
    This calculation assumes all channels are populated for maximum capacity.
    
    Args:
        total_channels: Total memory channels (calculated if not provided)
        dimm_capacity: Memory module capacity in GB (default: 96GB)
                      - Common capacities: 32GB, 64GB, 96GB, 128GB per DIMM
        dimm_cost: Cost per GB of server memory (default: $4/GB)
                  - Server memory costs 2-3x consumer memory
                  - Includes ECC (error correction) premium
        
    Returns:
        float: Total memory cost per server in USD
        
    Business Context:
        Memory typically represents 25-40% of server cost. Higher capacity
        modules cost more per GB but reduce power consumption and slot usage.
        
    Example:
        24 channels × 96GB/DIMM × $4/GB = $9,216 per server
    """
    channels = total_channels if total_channels is not None else calculate_total_channels()
    capacity = dimm_capacity if dimm_capacity is not None else DEFAULT_DIMM_CAPACITY_IN_GB
    cost_per_gb = dimm_cost if dimm_cost is not None else DEFAULT_DIMM_COST_PER_GB
    
    return channels * capacity * cost_per_gb

# =============================================================================
# NETWORK INFRASTRUCTURE COST CALCULATIONS
# =============================================================================

def calculate_switches_per_rack(servers_per_rack=None):
    """
    Calculate the number of network switches required per server rack.
    
    Network switches provide connectivity between servers and to the data center
    network backbone. The calculation ensures adequate port density and redundancy.
    
    Args:
        servers_per_rack: Number of servers per rack (default: 14)
                         - Typical range: 12-20 servers per 42U rack
                         - Depends on server height and cooling requirements
        
    Returns:
        int: Number of switches required per rack
        
    Formula Logic:
        - Each server needs 2 network connections (redundancy)
        - 32-port switches are standard (leaving ports for uplinks)
        - Minimum 2 switches per rack for redundancy
        - Formula: max(2, ceil(2 × servers_per_rack ÷ 32))
        
    Example:
        14 servers × 2 connections = 28 ports needed
        28 ports ÷ 32 ports/switch = 0.875 → ceil = 1 switch
        max(2, 1) = 2 switches (redundancy minimum)
    """
    servers = servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    return max(2, math.ceil(2 * (servers / 32)))


def calculate_total_switch_cost(switch_cost_per_unit=None, switches_per_rack=None):
    """
    Calculate total network switch cost per rack.
    
    Args:
        switch_cost_per_unit: Cost per network switch (default: $8000)
                            - Enterprise switches with 10GbE/25GbE ports
                            - Includes management and redundancy features
        switches_per_rack: Number of switches per rack (calculated if not provided)
        
    Returns:
        float: Total switch cost per rack in USD
    """
    switch_cost = switch_cost_per_unit if switch_cost_per_unit is not None else DEFAULT_SWITCH_COST_PER_UNIT
    num_switches = switches_per_rack if switches_per_rack is not None else calculate_switches_per_rack()
    
    return switch_cost * num_switches


def calculate_total_network_cost_per_rack(total_switch_cost=None, network_cable_cost_per_server=None, servers_per_rack=None):
    """
    Calculate total network infrastructure cost per rack.
    
    This includes both switches and the cables needed to connect all servers
    to the network infrastructure.
    
    Args:
        total_switch_cost: Total switch cost (calculated if not provided)
        network_cable_cost_per_server: Cable cost per server (default: $100)
                                     - Includes copper/fiber cables, transceivers
                                     - 2 cables per server for redundancy
        servers_per_rack: Number of servers per rack (default: 14)
        
    Returns:
        float: Total network cost per rack in USD
        
    Cost Components:
        - Switches: Provide network connectivity and switching
        - Cables: Connect servers to switches (redundant connections)
        - Transceivers: Convert electrical to optical signals (if needed)
    """
    switch_cost = total_switch_cost if total_switch_cost is not None else calculate_total_switch_cost()
    cable_cost = network_cable_cost_per_server if network_cable_cost_per_server is not None else DEFAULT_NETWORK_CABLE_COST_PER_SERVER
    servers = servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    
    return switch_cost + (cable_cost * servers)


def calculate_total_network_cost_per_server(total_network_cost_per_rack=None, servers_per_rack=None):
    """
    Calculate network infrastructure cost allocated per server.
    
    This allocates the rack-level network costs across all servers in the rack
    to determine the per-server network cost contribution.
    
    Args:
        total_network_cost_per_rack: Total network cost per rack (calculated if not provided)
        servers_per_rack: Number of servers per rack (default: 14)
        
    Returns:
        float: Network cost per server in USD, or 0 if no servers
        
    Business Logic:
        Network infrastructure is shared across all servers in a rack,
        so costs are divided equally among all servers for cost modeling.
        If there are no servers, the cost per server is 0.
    """
    rack_cost = total_network_cost_per_rack if total_network_cost_per_rack is not None else calculate_total_network_cost_per_rack()
    servers = servers_per_rack if servers_per_rack is not None else DEFAULT_SERVERS_PER_RACK
    
    # Handle division by zero case
    if servers == 0:
        return 0.0
    
    return rack_cost / servers

# =============================================================================
# SERVER BILL OF MATERIALS (BOM) CALCULATIONS  
# =============================================================================

def calculate_server_l2_bom():
    """
    Calculate Level 2 Bill of Materials cost for server components.
    
    L2 BOM includes the secondary components needed to build a complete server
    beyond the main compute components (CPU, memory, network).
    
    Returns:
        float: L2 BOM cost per server in USD (currently $1200)
        
    Components Included in L2 BOM:
        - Server chassis and enclosure
        - Power supply units (redundant PSUs)
        - Cooling fans and heat sinks
        - Motherboard and basic I/O
        - Storage controllers
        - Management controllers (BMC/iDRAC)
        - Cables and connectors
        
    Business Context:
        L2 BOM costs are relatively stable across server generations
        and represent the "commodity" components that don't scale
        with performance requirements like CPU and memory do.
    """
    return DEFAULT_25_SERVER_L2_BOM

# =============================================================================
# COMPREHENSIVE IT COST CALCULATIONS
# =============================================================================

def calculate_total_it_cost_per_server(total_cpu_price_per_server=None, total_memory_cost_per_server=None, 
                                     server_l2_bom=None, total_network_cost_per_server=None):
    """
    Calculate the complete IT cost for a single server by combining all components.
    
    This is the primary function for determining per-server IT costs, combining
    all major cost components into a total server price.
    
    Args:
        total_cpu_price_per_server: CPU cost per server (calculated if not provided)
        total_memory_cost_per_server: Memory cost per server (calculated if not provided)
        server_l2_bom: L2 BOM cost (calculated if not provided)
        total_network_cost_per_server: Network cost per server (calculated if not provided)
        
    Returns:
        float: Complete IT cost per server in USD
        
    Cost Breakdown (typical percentages):
        - CPU: 15-25% of total server cost
        - Memory: 25-40% of total server cost  
        - Network: 10-15% of total server cost
        - L2 BOM: 8-12% of total server cost
        
    Example Calculation:
        CPU: $4,800 (2 × $2,400)
        Memory: $9,216 (24 × 96GB × $4/GB)
        Network: $1,400 (switches + cables allocated per server)
        L2 BOM: $1,200 (chassis, PSU, cooling)
        Total: $16,616 per server
    """
    cpu_cost = total_cpu_price_per_server if total_cpu_price_per_server is not None else calculate_total_cpu_price_per_server()
    memory_cost = total_memory_cost_per_server if total_memory_cost_per_server is not None else calculate_total_memory_cost_per_server()
    l2_bom = server_l2_bom if server_l2_bom is not None else calculate_server_l2_bom()
    network_cost = total_network_cost_per_server if total_network_cost_per_server is not None else calculate_total_network_cost_per_server()
    
    return cpu_cost + memory_cost + l2_bom + network_cost


def calculate_typical_it_cost_per_server(data_center_type: str):
    """
    Get typical IT cost per server based on data center type and configuration.
    
    This function provides standardized server costs for different data center
    types, useful for quick estimates and budget planning.
    
    Args:
        data_center_type: Type of data center configuration
                         - "General Purpose": Standard enterprise servers
                         - "HPC/AI": High-performance computing servers
        
    Returns:
        float: Typical IT cost per server in USD
        
    Data Center Type Differences:
        
        General Purpose:
        - Standard CPU configurations (2-socket, moderate core count)
        - Balanced memory configurations (256GB-1TB per server)
        - Standard network connectivity (1-10 GbE)
        - Cost optimized for general enterprise workloads
        
        HPC/AI:
        - High-performance CPUs and/or GPU accelerators
        - Large memory configurations (1TB+ per server)
        - High-speed networking (25-100 GbE, InfiniBand)
        - Optimized for compute-intensive workloads
        - Significantly higher cost per server
    """
    if data_center_type == "General Purpose":
        return calculate_total_it_cost_per_server()
    else:  # HPC/AI or other high-performance types
        return DEFAULT_HPC_AI_COST_PER_SERVER


# =============================================================================
# RACK CAPACITY AND POWER CALCULATIONS
# =============================================================================

def calculate_maximum_number_of_chassis_per_rack_for_air(air_rack_cooling_capacity_kw_per_rack, data_center_type):
    """
    Calculate maximum server chassis that can fit in a rack based on air cooling capacity.
    
    This is a critical calculation for data center planning as it determines
    the server density achievable with air cooling systems.
    
    Args:
        air_rack_cooling_capacity_kw_per_rack: Maximum cooling capacity per rack (kW)
                                             - Typical range: 5-15 kW for air cooling
                                             - Higher densities require liquid cooling
        data_center_type: Type of data center ("General Purpose" or "HPC/AI")
                         - Affects server power consumption per chassis
        
    Returns:
        int: Maximum number of server chassis per rack
        
    Cooling Constraints:
        - Air cooling is limited by airflow and temperature differential
        - Higher power densities create hot spots and cooling challenges
        - Liquid cooling required for >15-20 kW per rack densities
        
    Business Impact:
        - Higher density = lower real estate costs per server
        - Lower density = easier cooling and maintenance access
        - Optimal density balances CAPEX and OPEX considerations
        
    Example:
        10 kW cooling capacity ÷ 2 kW per HPC server = 5 servers max
        10 kW cooling capacity ÷ 1 kW per GP server = 10 servers max
    """
    if air_rack_cooling_capacity_kw_per_rack is None or air_rack_cooling_capacity_kw_per_rack <= 0:
        return 0
    
    server_power_multiplier = calculate_server_rated_max_power(data_center_type)
    if server_power_multiplier is None or server_power_multiplier == "":
        return 0
    
    return math.floor(air_rack_cooling_capacity_kw_per_rack / server_power_multiplier)


def calculate_total_air_power_kw_per_rack(number_of_air_chassis_per_rack, data_center_type):
    """
    Calculate total power consumption per rack based on number of chassis and server type.
    
    This calculation determines the actual power load that will be placed on
    the data center's power and cooling infrastructure.
    
    Args:
        number_of_air_chassis_per_rack: Number of server chassis in the rack
                                      - Limited by cooling capacity and physical space
        data_center_type: Type of data center ("General Purpose" or "HPC/AI")
                         - Determines power consumption per chassis
        
    Returns:
        float: Total power consumption per rack in kW
        
    Power Planning Considerations:
        - Must not exceed rack cooling capacity
        - Should include safety margin (typically 80% utilization)
        - Affects UPS sizing and electrical distribution design
        - Impacts data center PUE (Power Usage Effectiveness)
        
    Example:
        5 HPC servers × 2 kW per server = 10 kW total rack power
        10 GP servers × 1 kW per server = 10 kW total rack power
    """
    return number_of_air_chassis_per_rack * calculate_server_rated_max_power(data_center_type)

# =============================================================================
# MODULE USAGE GUIDE AND EXAMPLES
# =============================================================================

"""
USAGE EXAMPLES:

1. Calculate total server cost for General Purpose data center:
   >>> cost = calculate_typical_it_cost_per_server("General Purpose")
   >>> print(f"GP Server Cost: ${cost:,.2f}")

2. Calculate rack capacity for air cooling:
   >>> max_servers = calculate_maximum_number_of_chassis_per_rack_for_air(12, "HPC/AI")
   >>> print(f"Max HPC servers per rack: {max_servers}")

3. Calculate component costs separately:
   >>> cpu_cost = calculate_total_cpu_price_per_server()
   >>> memory_cost = calculate_total_memory_cost_per_server()
   >>> network_cost = calculate_total_network_cost_per_server()
   >>> bom_cost = calculate_server_l2_bom()
   >>> total = cpu_cost + memory_cost + network_cost + bom_cost

4. Custom server configuration:
   >>> custom_cost = calculate_total_it_cost_per_server(
   ...     total_cpu_price_per_server=6000,      # Higher-end CPUs
   ...     total_memory_cost_per_server=15000,   # More memory
   ... )

INTEGRATION WITH MAIN CALCULATIONS:
This module is designed to integrate with the main data center cost calculations
in main.py. The key integration points are:

- calculate_typical_it_cost_per_server(): Primary function for cost estimates
- calculate_maximum_number_of_chassis_per_rack_for_air(): For capacity planning
- calculate_number_of_server_refreshes(): For lifecycle cost modeling

CUSTOMIZATION:
All functions accept optional parameters to override defaults. For organization-
specific configurations, modify the DEFAULT_* constants at the top of the file
or pass custom values to the functions.

DATA SOURCES:
Current defaults are based on typical enterprise server configurations circa 2024.
For more accurate modeling, update defaults with:
- Vendor quotes for actual hardware costs
- Organization-specific server standards
- Current market pricing for components
- Site-specific power and cooling constraints
"""