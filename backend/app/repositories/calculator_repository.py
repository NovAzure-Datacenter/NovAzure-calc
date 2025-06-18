from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class CalculatorRepository:
    def __init__(self, db: AsyncIOMotorDatabase, collection_name: str = "technologies"):
        self.db = db
        self.collection = db[collection_name]
        self.collection_names = [
            "total_it_cost",
            "air_cooled_cost_with_inflation_LE",
            "air_cooled_cost_with_inflation_HE",
            "chassis_solution_capex_in_absence_of_waterloop",
            "chassis_total_it_cost",
            "chassis_markup",
            "chassis_capex_with_inflation",
            "total_it_cost_per_kw",
            "annual_Cooling_Opex_LE",
            "annual_Cooling_Opex_HE",
            "annual_IT_Equipment_Maintenance_LE",
            "annual_IT_Equipment_Maintenance_HE",
            "lifetime_Opex_LE",
            "lifetime_Opex_HE"
        ]
    
    async def get_mock_value(self, document_id: str, mock_key: str, index: int = 0):
        query = {"_id": ObjectId(document_id)}
        projection = {"_id": 0, f"mock_data.{mock_key}": 1}
        result = await self.collection.find_one(query, projection)
        if not result:
            return 0
        try:
            return result["mock_data"][mock_key][index]["value"]
        except (KeyError, IndexError, TypeError):
            return 0