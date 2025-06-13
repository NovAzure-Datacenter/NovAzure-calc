import json
import os

def get_mock_data():
    # Get directory containing this module
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the JSON file in the same directory
    json_path = os.path.join(current_dir, 'db_collections.json')
    
    with open(json_path, 'r') as file:
        return json.load(file)