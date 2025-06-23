from app.database.connection import get_db


async def get_cooling_maintenance_rate(country: str):
    db = get_db()
    collection = db["company_inputs"]
    
    document = await collection.find_one({"name": "cooling_maintenance_rate"})
    country_overrides = document.get("country_overrides", {})
    if country in country_overrides:
        return country_overrides[country]
    return document.get("value")

async def get_budget_IT_energy():
    db = get_db()
    collection = db["company_inputs"]
    
    document = await collection.find_one({"name": "budgeted_it_energy_consumption"})
    return document.get("value")
    
async def get_budget_fan_energy():
    db = get_db()
    collection = db["company_inputs"]
    
    document = await collection.find_one({"name": "budgeted_fan_energy_consumption"})
    return document.get("value")

async def get_actual_fan_power():
    db = get_db()
    collection = db["company_inputs"]

    document = await collection.find_one({"name": "actual_fan_power_consumption"})
    return document.get("value")

async def get_water_price_per_litre():
    db = get_db()
    collection = db["company_inputs"]

    document = await collection.find_one({"name": "water_price_per_litre"})
    return document.get("value")

async def get_water_use_per_kwh():
    db = get_db()
    collection = db["company_inputs"]

    document = await collection.find_one({"name": "water_use_per_kwh"})
    return document.get("value")
