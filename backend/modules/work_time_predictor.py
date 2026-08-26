"""
Work-Time Predictor Module
Estimates realistic maintenance duration based on work type, department, complexity, and machine resource.
"""

BASE_DURATIONS = {
    "Track Renewal": 60,
    "Ballast Tamping": 45,
    "Rail Grinding": 35,
    "Drain Cleaning": 25,
    "OHE Inspection": 30,
    "Pantograph Check": 20,
    "Signal Work": 40,
    "Cable Replacement": 50,
}

def predict_duration(request: dict) -> int:
    work_type = request.get("work_type", "")
    base = BASE_DURATIONS.get(work_type, request.get("estimated_duration", 30))
    
    # Complexity modifier
    complexity = request.get("complexity", 1.0)
    adjusted = int(round(base * float(complexity)))
    
    return max(15, adjusted)
