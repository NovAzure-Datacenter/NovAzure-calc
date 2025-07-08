from ..connection import get_db


async def get_co2e_intensity_per_kwh(country: str):
    db = get_db()
    collection = db["countries"]

    document = await collection.find_one({"country": country})
    if document is None:
        return None
    return document.get("co2e_intensity_g_per_kwh")


async def get_cooling_capex_rate(country: str):
    db = get_db()
    collection = db["countries"]

    document = await collection.find_one({"country": country})
    if document is None:
        return None
    return document.get("cooling_capex_rate_per_kw")
