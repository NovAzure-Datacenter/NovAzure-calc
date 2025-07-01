"""
Server Rated Max Power Calculation Service
"""

def calculate_server_rated_max_power(data_center_type: str){
    if data_center_type == "General Purpose":
        return 1
    elif data_center_type == "HPC/AI":
        return 2
    elif data_center_type == "Select an Option":
        return ""
    else:
        return None 
}