from .solutions.air_cooling.capex import (
    calculate_cooling_capex as calculate_air_cooling_capex,
)
from .solutions.air_cooling.opex import (
    calculate_annual_opex as calculate_air_cooling_opex,
    calculate_total_opex_over_lifetime as calculate_total_opex_lifetime,
)
from .solutions.chassis_immersion.capex import (
    calculate_cooling_capex as calculate_chassis_immersion_capex,
)

# Initialising User inputs that will be used in the calculations
advanced = False  # Controls whether to include IT configuration
percentage_of_utilisation = {"%_of_utilisation": None}
planned_years_of_operation = {"planned_years_of_operation": None}
project_location = {"project_location": None}
data_hall_design_capacity_mw = {"data_hall_design_capacity_mw": None}
first_year_of_operation = {"first_year_of_operation": None}
annualised_air_ppue = {"annualised_air_ppue": None}

# IT Configuration inputs (used when advanced = True)
include_it_cost = {"include_it_cost": None}
data_center_type = {"data_center_type": None}
air_rack_cooling_capacity_kw_per_rack = {"air_rack_cooling_capacity_kw_per_rack": None}

# Advanced Data Centre Configuration inputs (used when advanced = True)
inlet_temperature = {'inlet_temperature': 27}
electricity_price_per_kwh = {'electricity_price_per_kwh': 0.1}
water_price_per_litre = {'water_price_per_litre': 0.0001}
waterloop_enabled = {'waterloop_enabled': True}
required_increase_electrical_kw = {'required_increase_electrical_kw': 1000}

def update_inputs(inputs):
    global advanced

    for key, value in inputs.items():
        # Handle advanced mode toggle
        if key == "advanced":
            advanced = value
        elif key in percentage_of_utilisation:
            percentage_of_utilisation[key] = value
        elif key in planned_years_of_operation:
            planned_years_of_operation[key] = value
        elif key in project_location:
            project_location[key] = value
        elif key in data_hall_design_capacity_mw:
            data_hall_design_capacity_mw[key] = value
        elif key in first_year_of_operation:
            first_year_of_operation[key] = value
        elif key in annualised_air_ppue:
            annualised_air_ppue[key] = value
        elif key in include_it_cost:
            include_it_cost[key] = value
        elif key in data_center_type:
            data_center_type[key] = value
        elif key in air_rack_cooling_capacity_kw_per_rack:
            air_rack_cooling_capacity_kw_per_rack[key] = value
        # Advanced Data Centre Configuration inputs
        elif key in inlet_temperature:
            inlet_temperature[key] = value
        elif key in electricity_price_per_kwh:
            electricity_price_per_kwh[key] = value
        elif key in water_price_per_litre:
            water_price_per_litre[key] = value
        elif key in waterloop_enabled:
            waterloop_enabled[key] = value
        elif key in required_increase_electrical_kw:
            required_increase_electrical_kw[key] = value

def build_advanced_config():
    advanced_config = {}
    if inlet_temperature.get('inlet_temperature') is not None:
        advanced_config['inlet_temperature'] = inlet_temperature['inlet_temperature']
    if electricity_price_per_kwh.get('electricity_price_per_kwh') is not None:
        advanced_config['electricity_price_per_kwh'] = (
            electricity_price_per_kwh['electricity_price_per_kwh']
        )
    if water_price_per_litre.get('water_price_per_litre') is not None:
        advanced_config['water_price_per_litre'] = (
            water_price_per_litre['water_price_per_litre']
        )
    if waterloop_enabled.get('waterloop_enabled') is not None:
        advanced_config['waterloop_enabled'] = waterloop_enabled['waterloop_enabled']
    if (required_increase_electrical_kw.get('required_increase_electrical_kw') 
            is not None):
        advanced_config['required_increase_electrical_kw'] = (
            required_increase_electrical_kw['required_increase_electrical_kw']
        )
    return advanced_config if advanced_config else None


async def calculate():
    # Prepare input data for both cooling solutions
    input_data = {
        "data_hall_design_capacity_mw": data_hall_design_capacity_mw[
            "data_hall_design_capacity_mw"
        ],
        "first_year_of_operation": first_year_of_operation["first_year_of_operation"],
        "country": project_location["project_location"],
        "advanced_config": build_advanced_config()
    }

    # Add IT configuration if in advanced mode
    if advanced:
        input_data.update(
            {
                "include_it_cost": include_it_cost.get("include_it_cost"),
                "data_center_type": data_center_type.get("data_center_type"),
                "air_rack_cooling_capacity_kw_per_rack": (
                    air_rack_cooling_capacity_kw_per_rack.get(
                        "air_rack_cooling_capacity_kw_per_rack"
                    )
                ),
                "planned_years_of_operation": planned_years_of_operation.get(
                    "planned_years_of_operation"
                ),
                "advanced_config": (
                    build_advanced_config() if build_advanced_config() else None
                )
            }
        )

    # Calculate both cooling solutions CAPEX
    air_cooling_capex = calculate_air_cooling_capex(input_data)
    chassis_immersion_capex = calculate_chassis_immersion_capex(input_data)

    # Prepare OPEX input data
    opex_input_data = {
        "data_hall_design_capacity_mw": data_hall_design_capacity_mw[
            "data_hall_design_capacity_mw"
        ],
        "annualised_air_ppue": annualised_air_ppue["annualised_air_ppue"],
        "percentage_of_utilisation": percentage_of_utilisation["%_of_utilisation"],
        "first_year_of_operation": first_year_of_operation["first_year_of_operation"],
        "country": project_location["project_location"],
    }

    lifetime_opex_input_data = {
        "data_hall_design_capacity_mw": data_hall_design_capacity_mw[
            "data_hall_design_capacity_mw"
        ],
        "annualised_air_ppue": annualised_air_ppue["annualised_air_ppue"],
        "percentage_of_utilisation": percentage_of_utilisation["%_of_utilisation"],
        "first_year_of_operation": first_year_of_operation["first_year_of_operation"],
        "planned_years_of_operation": planned_years_of_operation[
            "planned_years_of_operation"
        ],
        "country": project_location["project_location"],
    }

    # Calculate air cooling OPEX (chassis immersion OPEX not available yet)
    air_cooling_opex = await calculate_air_cooling_opex(
        opex_input_data, air_cooling_capex["cooling_equipment_capex"]
    )
    total_opex_lifetime = await calculate_total_opex_lifetime(
        lifetime_opex_input_data, air_cooling_capex["cooling_equipment_capex"]
    )

    # Calculate total cost of ownership
    air_total_cost_of_ownership = (
        total_opex_lifetime["total_opex_over_lifetime"]
        + air_cooling_capex["total_capex"]
    )
    chassis_total_cost_of_ownership = chassis_immersion_capex[
        "total_capex"
    ]  # No OPEX yet for chassis

    return {
        "air_cooling": {
            "cooling_equipment_capex": air_cooling_capex["cooling_equipment_capex"],
            "it_equipment_capex": air_cooling_capex["it_equipment_capex"],
            "total_capex": air_cooling_capex["total_capex"],
            "opex": air_cooling_opex,
            "total_opex_over_lifetime": total_opex_lifetime,
            "total_cost_of_ownership": air_total_cost_of_ownership,
        },
        "chassis_immersion": {
            "cooling_equipment_capex": chassis_immersion_capex[
                "cooling_equipment_capex"
            ],
            "it_equipment_capex": chassis_immersion_capex["it_equipment_capex"],
            "total_capex": chassis_immersion_capex["total_capex"],
            "opex": {"annual_opex": 0},  # Placeholder
            "total_opex_over_lifetime": {"total_opex_over_lifetime": 0},  # Placeholder
            "total_cost_of_ownership": chassis_total_cost_of_ownership,
        },
        "include_it_cost": include_it_cost.get("include_it_cost") or "No",
        "advanced_config": (
            build_advanced_config() if build_advanced_config() else None
        ),
        "advanced_mode": advanced,
    }
