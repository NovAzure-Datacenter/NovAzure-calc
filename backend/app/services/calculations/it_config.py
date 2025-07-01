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
"""
Number of Server Refreshes Calculation Service
"""

def calculate_number_of_server_refreshes(planned_years: int){
    if planned_years >= 5:
        return math.ceil((planned_years / 5) - 1)
    elif planned_years == "HPC/AI":
        return 2
    elif planned_years < 5:
        return 0
}
