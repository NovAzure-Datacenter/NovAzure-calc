from app.database.connection import get_db


async def get_cooling_maintenance_rate(country: str):
    db = get_db()
    collection = db["company_inputs"]
    
    document = await collection.find_one({"name": "cooling_maintenance_rate"})
    country_overrides = document.get("country_overrides", {})
    if country in country_overrides:
        return country_overrides[country]
    return document.get("value", 0.08)