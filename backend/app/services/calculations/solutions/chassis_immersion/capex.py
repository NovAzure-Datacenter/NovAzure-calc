from ...it_config import calculate_it_equipment_capex_complete

# Company inputs - hard coded for now
COOLANT_PRICE_PER_KW = 40
MANIFOLD_CAPEX_PER_RACK = 1200
RACK_COOLING_CAPACITY_LIMIT = 16  # kW/rack (Default)
CHASSIS_UPLIFT_COST = -150
SERVER_RATED_MAX_POWER = 1
HYBRID_COOLER_CAPACITY = 800  # kW
HYBRID_COOLER_CAPEX_800KW_UNIT = 131100
CDU_POWER_RATING = 250  # kW
PUMPS_CDU_CAPEX = 35000
RACK_EXTENSION_CAPEX = 0
RACK_CAPEX = 1200
HEAT_RECOVERY_TO_AIR_PERCENT = 0.05  # 5%
DX_SYSTEM_CAPACITY = 600  # kW
DX_SYSTEM_CAPEX_COST = 69000
PACKAGED_PROCESS_WATER_PUMP_ROOM_CAPEX = 117300
KERBSIDE_DELIVERY_COST_PER_RACK = 131
RACK_MOUNTED_PDU_CAPEX = 138
RACK_MOUNTED_PDU_PER_RACK = 2
FIXED_MARKUP = 300.00  # $/KW

# CW pumps, pipework and valves capex per kW by country
CW_PUMPS_PIPEWORK_VALVES_CAPEX = {
    "United Kingdom": 171.1243,
    "United States": 191.5800,
    "Singapore": 255.3510,
    "United Arab Emirates": 187.9314,
}

# Default air cooling technology by country
DEFAULT_AIR_COOLING_TECHNOLOGY = {
    "United Kingdom": "CRAH with Packaged chiller and economiser",
    "United States": "CRAH with Packaged chiller and economiser",
    "Singapore": "CRAH with chiller/tower",
    "United Arab Emirates": "CRAC DX glycol-cooled system with dry cooler",
}

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


# Helper functions
def calculate_number_of_racks(nameplate_power_kw: float):
    return nameplate_power_kw / RACK_COOLING_CAPACITY_LIMIT


def calculate_number_of_chassis_per_rack():
    return RACK_COOLING_CAPACITY_LIMIT / SERVER_RATED_MAX_POWER


# Functions using helpers
def calculate_chassis_equipment_price_per_kw(nameplate_power_kw: float):
    number_of_racks = calculate_number_of_racks(nameplate_power_kw)
    number_of_chassis_per_rack = calculate_number_of_chassis_per_rack()
    manifold_cost = MANIFOLD_CAPEX_PER_RACK * number_of_racks
    chassis_cost = CHASSIS_UPLIFT_COST * number_of_racks * number_of_chassis_per_rack
    return (manifold_cost + chassis_cost) / nameplate_power_kw


def calculate_air_cooled_equipment_base_capex_per_kw(
    nameplate_power_kw: float, country: str
):
    if country == "United Kingdom":
        return ((nameplate_power_kw - 3000) * (1078 - 1130) / (7500 - 3000)) + 1130
    elif country == "United States":
        return ((nameplate_power_kw - 3000) * (804 - 883) / (7500 - 3000)) + 883
    elif country == "Singapore":
        return ((nameplate_power_kw - 3000) * (1198 - 1324) / (7500 - 3000)) + 1324
    elif country == "United Arab Emirates":
        return ((nameplate_power_kw - 3000) * (1060 - 1098) / (7500 - 3000)) + 1098


# Component calculations (1-14)
def calculate_chassis_equipment_and_coolant_price_per_kw(nameplate_power_kw: float):
    return (
        calculate_chassis_equipment_price_per_kw(nameplate_power_kw)
        + COOLANT_PRICE_PER_KW
    )


def calculate_cw_pumps_pipework_valves_capex_per_kw(country: str):
    return CW_PUMPS_PIPEWORK_VALVES_CAPEX[country]


def calculate_hybrid_cooler_capex_per_kw(nameplate_power_kw: float):
    return (
        ((nameplate_power_kw / HYBRID_COOLER_CAPACITY) + 1)
        * HYBRID_COOLER_CAPEX_800KW_UNIT
        / nameplate_power_kw
    )


def calculate_cdu_capex_per_kw(nameplate_power_kw: float):
    return (
        ((nameplate_power_kw / CDU_POWER_RATING) + 1)
        * PUMPS_CDU_CAPEX
        / nameplate_power_kw
    )


def calculate_rack_and_rack_extension_capex_per_kw(nameplate_power_kw: float):
    return (
        (RACK_EXTENSION_CAPEX + RACK_CAPEX)
        * calculate_number_of_racks(nameplate_power_kw)
        / nameplate_power_kw
    )


def calculate_air_cooled_equipment_capex_per_kw(
    nameplate_power_kw: float, country: str
):
    return (
        HEAT_RECOVERY_TO_AIR_PERCENT
        * calculate_air_cooled_equipment_base_capex_per_kw(nameplate_power_kw, country)
    )


def calculate_pressurisation_ahu_capex_per_kw(nameplate_power_kw: float, country: str):
    if country == "United Kingdom" or country == "United States":
        return 60 + ((36 - 60) / (7500 - 3000)) * (nameplate_power_kw - 3000)
    elif country == "Singapore" or "United Arab Emirates":
        return 90 + ((36 - 90) / (7500 - 3000)) * (nameplate_power_kw - 3000)


def calculate_dx_system_capex_per_kw(nameplate_power_kw: float):
    return (
        (nameplate_power_kw / DX_SYSTEM_CAPACITY)
        * DX_SYSTEM_CAPEX_COST
        / nameplate_power_kw
    )


def calculate_packaged_process_water_plant_capex_per_kw(nameplate_power_kw: float):
    return PACKAGED_PROCESS_WATER_PUMP_ROOM_CAPEX / nameplate_power_kw


def calculate_kerbside_delivery_capex_per_kw(nameplate_power_kw: float):
    return (
        calculate_number_of_racks(nameplate_power_kw)
        * KERBSIDE_DELIVERY_COST_PER_RACK
        / nameplate_power_kw
    )


def calculate_rack_mounted_pdu_capex_per_kw(nameplate_power_kw: float):
    return (
        calculate_number_of_racks(nameplate_power_kw)
        * RACK_MOUNTED_PDU_CAPEX
        * RACK_MOUNTED_PDU_PER_RACK
        / nameplate_power_kw
    )


def calculate_primary_electrical_plant_cost_per_kw():
    return 0


def calculate_chassis_gc_works_cost_per_kw():
    return 3310  # Company Input


def calculate_total_it_cost_per_kw():
    return 0


# Main calculation pipeline
def calculate_total_price_per_kw_nameplate(nameplate_power_kw: float, country: str):
    return (
        calculate_chassis_equipment_and_coolant_price_per_kw(nameplate_power_kw)
        + calculate_cw_pumps_pipework_valves_capex_per_kw(country)
        + calculate_hybrid_cooler_capex_per_kw(nameplate_power_kw)
        + calculate_cdu_capex_per_kw(nameplate_power_kw)
        + calculate_rack_and_rack_extension_capex_per_kw(nameplate_power_kw)
        + calculate_air_cooled_equipment_capex_per_kw(nameplate_power_kw, country)
        + calculate_pressurisation_ahu_capex_per_kw(nameplate_power_kw, country)
        + calculate_dx_system_capex_per_kw(nameplate_power_kw)
        + calculate_packaged_process_water_plant_capex_per_kw(nameplate_power_kw)
        + calculate_kerbside_delivery_capex_per_kw(nameplate_power_kw)
        + calculate_rack_mounted_pdu_capex_per_kw(nameplate_power_kw)
        + calculate_primary_electrical_plant_cost_per_kw()
        + calculate_chassis_gc_works_cost_per_kw()
        + calculate_total_it_cost_per_kw()
    )


def calculate_chassis_solution_total_capex(nameplate_power_kw: float, country: str):
    return (
        calculate_total_price_per_kw_nameplate(nameplate_power_kw, country)
        * nameplate_power_kw
    )


def calculate_chassis_solution_capex_with_inflation(
    first_year_of_operation: int, nameplate_power_kw: float, country: str
):
    return (
        calculate_chassis_solution_total_capex(nameplate_power_kw, country)
        * INFLATION_FACTORS[first_year_of_operation]
    )


def calculate_chassis_solution_capex_with_markup(
    first_year_of_operation: int, capacity_mw: float, country: str
):
    nameplate_power_kw = capacity_mw * 1000
    markup = nameplate_power_kw * FIXED_MARKUP
    result = (
        calculate_chassis_solution_capex_with_inflation(
            first_year_of_operation, nameplate_power_kw, country
        )
        + markup
    )
    return round(result)


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
    capacity_mw = input_data.get("data_hall_design_capacity_mw")
    first_year_of_operation = input_data.get("first_year_of_operation")
    country = input_data.get("country")

    cooling_equipment_capex = calculate_chassis_solution_capex_with_markup(
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
