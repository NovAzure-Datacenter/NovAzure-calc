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