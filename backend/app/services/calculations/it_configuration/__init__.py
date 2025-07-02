# IT Configuration calculations module

from .server_basics import (
    calculate_server_rated_max_power,
    calculate_number_of_server_refreshes
)
from .total_costs import (
    calculate_total_it_cost_per_server,
    calculate_typical_it_cost_per_server
)
from .cpu_costs import calculate_total_cpu_price_per_server
from .memory_costs import calculate_total_memory_cost_per_server, calculate_total_channels
from .network_costs import (
    calculate_total_network_cost_per_server,
    calculate_total_network_cost_per_rack,
    calculate_total_switch_cost,
    calculate_switches_per_rack
)
from .server_l2_bom import calculate_server_l2_bom

__all__ = [
    'calculate_server_rated_max_power',
    'calculate_number_of_server_refreshes',
    'calculate_total_it_cost_per_server',
    'calculate_typical_it_cost_per_server',
    'calculate_total_cpu_price_per_server',
    'calculate_total_memory_cost_per_server',
    'calculate_total_channels',
    'calculate_total_network_cost_per_server',
    'calculate_total_network_cost_per_rack',
    'calculate_total_switch_cost',
    'calculate_switches_per_rack',
    'calculate_server_l2_bom'
]
