from ...it_config import calculate_it_equipment_maintenance_per_year

HEAT_RECOVERY_TO_LIQUID_PERCENTAGE = 0.95
HEAT_RECOVERY_TO_AIR_PERCENTAGE = 0.05
BUDGETED_IT_ENERGY_CONSUMPTION = 0.9
BUDGETED_FAN_ENERGY_CONSUMPTION = 0.01
BUDGETED_PUMP_ENERGY_PERCENTAGE = 0.01
WUE = 0.026
COOLING_MAINTENANCE_OPEX_TO_CAPEX_RATIO = 0.08

# Electricity forecast rates ($/kWh) by country and year
ELECTRICITY_RATES = {
    "United Kingdom": {
        2023: 0.167,
        2024: 0.161,
        2025: 0.180,
        2026: 0.170,
        2027: 0.170,
        2028: 0.170,
        2029: 0.174,
        2030: 0.161,
        2031: 0.164,
        2032: 0.168,
        2033: 0.171,
        2034: 0.174,
        2035: 0.178,
        2036: 0.182,
        2037: 0.185,
        2038: 0.189,
        2039: 0.193,
        2040: 0.197,
        2041: 0.200,
        2042: 0.204,
        2043: 0.209,
        2044: 0.213,
        2045: 0.217,
        2046: 0.221,
        2047: 0.226,
        2048: 0.230,
        2049: 0.235,
        2050: 0.240,
    },
    "Singapore": {
        2023: 0.146,
        2024: 0.139,
        2025: 0.137,
        2026: 0.131,
        2027: 0.131,
        2028: 0.131,
        2029: 0.131,
        2030: 0.131,
        2031: 0.134,
        2032: 0.137,
        2033: 0.139,
        2034: 0.142,
        2035: 0.145,
        2036: 0.148,
        2037: 0.151,
        2038: 0.154,
        2039: 0.157,
        2040: 0.160,
        2041: 0.163,
        2042: 0.167,
        2043: 0.170,
        2044: 0.173,
        2045: 0.177,
        2046: 0.180,
        2047: 0.184,
        2048: 0.188,
        2049: 0.191,
        2050: 0.195,
    },
    "United States": {
        2023: 0.122,
        2024: 0.124,
        2025: 0.122,
        2026: 0.120,
        2027: 0.120,
        2028: 0.120,
        2029: 0.121,
        2030: 0.123,
        2031: 0.126,
        2032: 0.130,
        2033: 0.133,
        2034: 0.138,
        2035: 0.143,
        2036: 0.146,
        2037: 0.150,
        2038: 0.155,
        2039: 0.160,
        2040: 0.165,
        2041: 0.170,
        2042: 0.175,
        2043: 0.179,
        2044: 0.183,
        2045: 0.188,
        2046: 0.192,
        2047: 0.196,
        2048: 0.200,
        2049: 0.204,
        2050: 0.208,
    },
    "United Arab Emirates": {
        2023: 0.120,
        2024: 0.122,
        2025: 0.125,
        2026: 0.127,
        2027: 0.130,
        2028: 0.132,
        2029: 0.135,
        2030: 0.138,
        2031: 0.141,
        2032: 0.143,
        2033: 0.146,
        2034: 0.149,
        2035: 0.152,
        2036: 0.155,
        2037: 0.158,
        2038: 0.162,
        2039: 0.165,
        2040: 0.168,
        2041: 0.171,
        2042: 0.175,
        2043: 0.178,
        2044: 0.182,
        2045: 0.186,
        2046: 0.189,
        2047: 0.193,
        2048: 0.197,
        2049: 0.201,
        2050: 0.205,
    },
}


def calculate_IT_power(capacity_kw: float, utilisation: float):
    return capacity_kw * BUDGETED_IT_ENERGY_CONSUMPTION * utilisation


def calculate_pump_power(capacity_kw: float):
    return (
        capacity_kw * BUDGETED_FAN_ENERGY_CONSUMPTION * BUDGETED_PUMP_ENERGY_PERCENTAGE
    )


def calculate_cost_of_water_annually(
    water_price_per_litre: float, capacity_kw: float, utilisation: float
):
    energy_required_per_year_kwh = (
        (
            calculate_IT_power(capacity_kw, utilisation)
            + calculate_pump_power(capacity_kw)
        )
        * 365
        * 24
    )
    water_required_annually = energy_required_per_year_kwh * WUE
    return water_price_per_litre * water_required_annually


def calculate_cost_of_energy_annually(
    country: str,
    first_year_of_operation: int,
    annualised_liquid_pPUE: float,
    capacity_kw: float,
    utilisation: float,
    electricity_price_per_kwh: float,
):
    energy_for_computing_annualy = (
        (
            calculate_IT_power(capacity_kw, utilisation)
            + calculate_pump_power(capacity_kw)
        )
        * 365
        * 24
    )
    energy_for_computing_cooling_annually = (
        energy_for_computing_annualy * annualised_liquid_pPUE
    )
    
    if electricity_price_per_kwh > 0:
        electricity_rate = electricity_price_per_kwh
    else:
        electricity_rate = ELECTRICITY_RATES[country][first_year_of_operation]
    
    return energy_for_computing_cooling_annually * electricity_rate


def calculate_cooling_maintenance_annually(cooling_capex: float):
    return cooling_capex * COOLING_MAINTENANCE_OPEX_TO_CAPEX_RATIO


def calculate_annual_it_cost(input_data, cooling_capex: float):
    """
    Calculate annual IT maintenance cost
    """
    # Get IT-specific parameters from input data
    it_cost_included = input_data.get("it_cost_included", True)
    typical_it_cost_per_server = input_data.get("typical_it_cost_per_server", 16559)
    data_center_type = input_data.get("data_center_type", "General Purpose")
    data_hall_design_capacity_mw = input_data.get("data_hall_design_capacity_mw", 1)
    planned_number_of_years = input_data.get("planned_years_of_operation", 10)
    air_rack_cooling_capacity_kw_per_rack = input_data.get(
        "air_rack_cooling_capacity_kw_per_rack", 30
    )
    project_location = input_data.get("country", "United States")
    it_maintenance_cost = input_data.get("it_maintenance_cost", 0.08)
    server_rated_max_power = input_data.get("server_rated_max_power", None)
    advanced = input_data.get("advanced", False)

    # Calculate annual IT maintenance cost
    annual_it_maintenance = calculate_it_equipment_maintenance_per_year(
        advanced=advanced,
        it_cost_included=it_cost_included,
        typical_it_cost_per_server=typical_it_cost_per_server,
        data_center_type=data_center_type,
        data_hall_design_capacity_mw=data_hall_design_capacity_mw,
        planned_number_of_years=planned_number_of_years,
        air_rack_cooling_capacity_kw_per_rack=air_rack_cooling_capacity_kw_per_rack,
        project_location=project_location,
        it_maintenance_cost=it_maintenance_cost,
        server_rated_max_power=server_rated_max_power,
    )

    return int(annual_it_maintenance)


def calculate_annual_opex_for_air_cooled_equipment(
    air_cooled_capex: float,
    country: str,
    first_year_of_operation: int,
    annualised_liquid_pPUE: float,
    capacity_kw: float,
    utilisation: float,
    water_price_per_litre: float,
    input_data,
    electricity_price_per_kwh: float,
):
    total_opex_annually = (
        calculate_cooling_maintenance_annually(air_cooled_capex)
        + calculate_cost_of_energy_annually(
            country,
            first_year_of_operation,
            annualised_liquid_pPUE,
            capacity_kw,
            utilisation,
            electricity_price_per_kwh,
        )
        + calculate_cost_of_water_annually(
            water_price_per_litre, capacity_kw, utilisation
        )
        + calculate_annual_it_cost(input_data, air_cooled_capex)
    )
    return total_opex_annually * HEAT_RECOVERY_TO_AIR_PERCENTAGE


def calculate_annual_opex(input_data, cooling_capex: float):
    capacity_kw = input_data.get("data_hall_design_capacity_mw") * 1000
    annual_it_cost = calculate_annual_it_cost(input_data, cooling_capex)
    electricity_price_per_kwh = input_data.get("electricity_price_per_kwh", 0)
    
    return (
        HEAT_RECOVERY_TO_LIQUID_PERCENTAGE
        * (
            calculate_cost_of_water_annually(
                input_data.get("water_price_per_litre"),
                capacity_kw,
                input_data.get("percentage_of_utilisation"),
            )
            + calculate_cost_of_energy_annually(
                input_data.get("country"),
                input_data.get("first_year_of_operation"),
                input_data.get("annualised_ppue"),
                capacity_kw,
                input_data.get("percentage_of_utilisation"),
                electricity_price_per_kwh,
            )
            + calculate_cooling_maintenance_annually(cooling_capex)
        )
        + calculate_annual_opex_for_air_cooled_equipment(
            cooling_capex,
            input_data.get("country"),
            input_data.get("first_year_of_operation"),
            input_data.get("annualised_ppue"),
            capacity_kw,
            input_data.get("percentage_of_utilisation"),
            input_data.get("water_price_per_litre"),
            input_data,
            electricity_price_per_kwh,
        )
        + annual_it_cost
    )


def calculate_total_opex_over_lifetime(input_data, cooling_capex: float):
    annual_opex = calculate_annual_opex(input_data, cooling_capex)
    planned_years = input_data.get("planned_years_of_operation")
    annual_it_cost = calculate_annual_it_cost(input_data, cooling_capex)

    # Calculate total IT maintenance over lifetime
    total_it_maintenance = annual_it_cost * planned_years

    # Calculate total OPEX over lifetime (cooling + IT maintenance)
    total_opex_lifetime = (annual_opex * planned_years) + total_it_maintenance

    return int(total_opex_lifetime)


def calculate_chassis_opex(input_data, cooling_capex: float):
    chassis_product = input_data.get("chassis_product")
    
    opex_cooling_capex = cooling_capex
    if chassis_product == "KU:L 2":
        opex_cooling_capex = cooling_capex / 1.8  
    
    annual_opex = calculate_annual_opex(input_data, opex_cooling_capex)
    annual_it_cost = calculate_annual_it_cost(input_data, opex_cooling_capex)
    
    if chassis_product == "KU:L 2":
        annual_opex *= 1.3
    
    planned_years = input_data.get("planned_years_of_operation")
    total_it_maintenance = annual_it_cost * planned_years
    total_opex_lifetime = (annual_opex * planned_years) + total_it_maintenance

    return {
        "annual_cooling_opex": int(annual_opex),
        "annual_it_maintenance": int(annual_it_cost),
        "total_opex_over_lifetime": int(total_opex_lifetime),
    }
