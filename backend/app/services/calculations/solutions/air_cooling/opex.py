from app.database.queries.company_inputs import (
    get_budget_IT_energy,
    get_budget_fan_energy,
    get_actual_fan_power,
    get_water_price_per_litre,
    get_water_use_per_kwh,
)

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


async def calculate_cost_of_energy(
    capacity_mw: float,
    ppue: float,
    utilisation: float,
    first_year_of_operation: int,
    country: str,
):
    budgeted_it_energy = await get_budget_IT_energy()
    budgeted_fan_energy = await get_budget_fan_energy()
    actual_fan_power = await get_actual_fan_power()

    capacity_kw = capacity_mw * 1000
    fan_power = capacity_kw * budgeted_fan_energy * actual_fan_power
    it_power = capacity_kw * budgeted_it_energy * utilisation

    energy_per_year = (fan_power + it_power) * 365 * 24
    total_energy = ppue * energy_per_year
    electricity_rate = ELECTRICITY_RATES[country][first_year_of_operation]

    return total_energy * electricity_rate


async def calculate_cost_of_energy_over_planned_period(
    capacity_mw: float,
    ppue: float,
    utilisation: float,
    first_year_of_operation: int,
    planned_years: int,
    country: str,
):
    budgeted_it_energy = await get_budget_IT_energy()
    budgeted_fan_energy = await get_budget_fan_energy()
    actual_fan_power = await get_actual_fan_power()

    capacity_kw = capacity_mw * 1000
    fan_power = capacity_kw * budgeted_fan_energy * actual_fan_power
    it_power = capacity_kw * budgeted_it_energy * utilisation

    energy_per_year = (fan_power + it_power) * 365 * 24
    total_energy_per_year = ppue * energy_per_year

    total_energy_cost = 0
    for year_offset in range(planned_years):
        current_year = first_year_of_operation + year_offset
        if current_year in ELECTRICITY_RATES[country]:
            electricity_rate = ELECTRICITY_RATES[country][current_year]
            total_energy_cost += total_energy_per_year * electricity_rate
        else:
            # Use the last available year's rate if beyond forecast
            last_year = max(ELECTRICITY_RATES[country].keys())
            electricity_rate = ELECTRICITY_RATES[country][last_year]
            total_energy_cost += total_energy_per_year * electricity_rate

    return total_energy_cost


async def calculate_cost_of_water_annually(energy_required_per_year_kwh: float):
    water_price = await get_water_price_per_litre()
    water_use = await get_water_use_per_kwh()

    water_required = energy_required_per_year_kwh * water_use
    return water_required * water_price


async def calculate_cooling_maintenance_annually(total_capex: float, country: str):
    maintenance_rate = 0.08
    return total_capex * maintenance_rate


async def calculate_total_opex_over_lifetime(input_data, total_capex: float):
    """
    Calculates the total OPEX over the lifetime of operation for an
    air cooling solution.

    It receives a dictionary with required inputs:
    {
        'data_hall_design_capacity_mw': float,
        'annualised_air_ppue': float,
        'percentage_of_utilisation': float,
        'first_year_of_operation': int,
        'planned_years_of_operation': int,
        'country': str
    }
    And the total_capex value calculated separately.
    """
    capacity_mw = input_data.get("data_hall_design_capacity_mw")
    ppue = input_data.get("annualised_air_ppue")
    utilisation = input_data.get("percentage_of_utilisation")
    first_year_of_operation = input_data.get("first_year_of_operation")
    planned_years = input_data.get("planned_years_of_operation")
    country = input_data.get("country")

    # Cost of energy over planned period with varying electricity rates
    cost_of_energy_planned_period = await calculate_cost_of_energy_over_planned_period(
        capacity_mw, ppue, utilisation, first_year_of_operation, planned_years, country
    )

    # Annual water and maintenance costs
    budgeted_it_energy = await get_budget_IT_energy()
    budgeted_fan_energy = await get_budget_fan_energy()
    actual_fan_power = await get_actual_fan_power()

    capacity_kw = capacity_mw * 1000
    fan_power = capacity_kw * budgeted_fan_energy * actual_fan_power
    it_power = capacity_kw * budgeted_it_energy * utilisation
    energy_per_year = (fan_power + it_power) * 365 * 24

    annual_water_cost = await calculate_cost_of_water_annually(energy_per_year)
    annual_maintenance_cost = await calculate_cooling_maintenance_annually(
        total_capex, country
    )

    # Total water and maintenance costs over planned years
    total_water_cost = annual_water_cost * planned_years
    total_maintenance_cost = annual_maintenance_cost * planned_years

    # Total OPEX over lifetime
    total_opex_lifetime = (
        cost_of_energy_planned_period + total_water_cost + total_maintenance_cost
    )

    return {"total_opex_over_lifetime": total_opex_lifetime}


async def calculate_annual_opex(input_data, total_capex: float):
    """
    Calculates the annual OPEX for an air cooling solution.

    It receives a dictionary with required inputs:
    {
        'data_hall_design_capacity_mw': float,
        'annualised_air_ppue': float,
        'percentage_of_utilisation': float,
        'first_year_of_operation': int,
        'country': str
    }
    And the total_capex value calculated separately.
    """
    capacity_mw = input_data.get("data_hall_design_capacity_mw")
    ppue = input_data.get("annualised_air_ppue")
    utilisation = input_data.get("percentage_of_utilisation")
    first_year_of_operation = input_data.get("first_year_of_operation")
    country = input_data.get("country")

    cost_of_energy = await calculate_cost_of_energy(
        capacity_mw, ppue, utilisation, first_year_of_operation, country
    )

    budgeted_it_energy = await get_budget_IT_energy()
    budgeted_fan_energy = await get_budget_fan_energy()
    actual_fan_power = await get_actual_fan_power()

    capacity_kw = capacity_mw * 1000
    fan_power = capacity_kw * budgeted_fan_energy * actual_fan_power
    it_power = capacity_kw * budgeted_it_energy * utilisation
    energy_per_year = (fan_power + it_power) * 365 * 24

    cost_of_water = await calculate_cost_of_water_annually(energy_per_year)
    maintenance_cost = await calculate_cooling_maintenance_annually(
        total_capex, country
    )

    annual_opex = cost_of_energy + cost_of_water + maintenance_cost

    return {"annual_opex": annual_opex}
