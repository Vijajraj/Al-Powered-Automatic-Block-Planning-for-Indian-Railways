from typing import Dict, Any

# Base durations in minutes for standard work types
WORK_TYPE_BASE_DURATIONS = {
    "Track Renewal": 60,
    "OHE Inspection": 30,
    "Signal Work": 40,
    "Ballast Tamping": 45,
    "Pantograph Check": 20,
    "Rail Grinding": 35,
    "Cable Replacement": 50,
    "Drain Cleaning": 25,
    "Sleeper Replacement": 45,
    "Substation Maintenance": 40,
}

DEPARTMENT_OVERHEAD = {
    "Engineering": 5,
    "TRD": 0,
    "S&T": 0,
}

def predict_duration(request: Dict[str, Any]) -> int:
    """
    Predict maintenance block duration in minutes based on work type,
    department, complexity, and resource requirements.
    """
    work_type = request.get("workType") or request.get("work_type", "")
    department = request.get("department", "Engineering")
    explicit_duration = request.get("duration") or request.get("estimated_duration")
    complexity = request.get("complexity", "Normal")  # Normal, High, Low
    resource = request.get("resource") or request.get("required_resource", "")

    # Base duration lookup or explicit initial estimate
    base_duration = WORK_TYPE_BASE_DURATIONS.get(work_type, explicit_duration or 45)

    multiplier = 1.0
    if complexity == "High":
        multiplier *= 1.15
    elif complexity == "Low":
        multiplier *= 0.9

    # Additional resource setup overhead if heavy machinery involved
    machinery_overhead = 0
    if "Crane" in str(resource) or "Tamper" in str(resource) or "Grinder" in str(resource):
        machinery_overhead = 5

    dept_overhead = DEPARTMENT_OVERHEAD.get(department, 0)

    predicted = int(round(base_duration * multiplier)) + machinery_overhead + dept_overhead
    return max(15, predicted)
