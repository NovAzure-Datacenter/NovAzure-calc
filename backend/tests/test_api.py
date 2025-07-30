from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_calculation():
    """Test the calculation api endpoints"""
    request_body = {
        "parameters": [
            {"name": "tax_rate", "type": "GLOBAL", "value": 0.2},
            {"name": "discount", "type": "COMPANY", "value": 50},
            {"name": "price", "type": "USER"},
            {"name": "quantity", "type": "USER"},
            {"name": "subtotal", "type": "CALCULATION", "formula": "price * quantity"},
            {"name": "tax", "type": "CALCULATION", "formula": "subtotal * tax_rate"},
            {
                "name": "final",
                "type": "CALCULATION",
                "formula": "subtotal + tax - discount",
            },
        ],
        "inputs": {"price": 100, "quantity": 5},
        "target": "final",
    }

    response = client.post("/api/v1/calculate", json=request_body)
    assert response.status_code == 200

    assert response.json() == {"result": 550.0}
