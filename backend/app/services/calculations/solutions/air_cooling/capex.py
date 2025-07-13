from ...it_config import calculate_it_equipment_capex_complete

# Country-specific multipliers (USD per kW)
COUNTRY_MULTIPLIERS = {
    "United States": 3849,
    "Singapore": 3527,
    "United Kingdom": 4952,
    "United Arab Emirates": 3433,
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
    2050: 1.71,
}


def calculate_cooling_equipment_capex(
    first_year_of_operation: int, capacity_mw: float, country: str
):
    nameplate_power_kw = capacity_mw * 1000
    country_multiplier = COUNTRY_MULTIPLIERS[country]
    base_capex = country_multiplier * nameplate_power_kw
    inflation_factor = INFLATION_FACTORS[first_year_of_operation]
    return base_capex * inflation_factor


def calculate_it_capex(
    data_hall_capacity_mw,
    data_center_type,
    air_rack_cooling_capacity_kw_per_rack,
    planned_years,
    it_cost_per_server,
    it_maintenance_cost,
    it_cost_included,
    total_it_cost_per_kw,
    project_location,
    advanced,
    server_rated_max_power=None,
):
    total_it_cost = calculate_it_equipment_capex_complete(
        advanced=advanced,
        it_cost_included=it_cost_included,
        typical_it_cost_per_server=it_cost_per_server,
        data_center_type=data_center_type,
        data_hall_design_capacity_mw=data_hall_capacity_mw,
        planned_number_of_years=planned_years,
        air_rack_cooling_capacity_kw_per_rack=air_rack_cooling_capacity_kw_per_rack,
        project_location=project_location,
        server_rated_max_power=server_rated_max_power
    )

    return round(total_it_cost)


def calculate_cooling_capex(input_data):
    advanced = input_data.get("advanced")
    capacity_mw = input_data.get("data_hall_design_capacity_mw")
    first_year_of_operation = input_data.get("first_year_of_operation")
    country = input_data.get("country")

    cooling_equipment_capex = calculate_cooling_equipment_capex(
        first_year_of_operation, capacity_mw, country
    )

    it_equipment_capex = calculate_it_capex(
        data_hall_capacity_mw=capacity_mw,
        data_center_type=input_data.get("data_center_type"),
        air_rack_cooling_capacity_kw_per_rack=input_data.get("air_rack_cooling_capacity_kw_per_rack"),
        planned_years=input_data.get("planned_years_of_operation"),
        it_cost_per_server=input_data.get("typical_it_cost_per_server", 16559),
        it_maintenance_cost=input_data.get("it_maintenance_cost", 0.08),
        it_cost_included=input_data.get("it_cost_included", True),
        total_it_cost_per_kw=0,  # Not used in new function
        project_location=input_data.get("project_location", "United States"),
        advanced=input_data.get("advanced", False),
        server_rated_max_power=input_data.get("server_rated_max_power", None)
    )

    total_capex = cooling_equipment_capex + it_equipment_capex

    return {
        "cooling_equipment_capex": int(cooling_equipment_capex),
        "it_equipment_capex": int(it_equipment_capex),
        "total_capex": int(total_capex),
    } 