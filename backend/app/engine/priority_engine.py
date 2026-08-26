from typing import Dict, Any, Tuple

# Weights for deterministic model (summing to 10.0)
WEIGHT_SEVERITY = 3.0
WEIGHT_CRITICALITY = 2.5
WEIGHT_URGENCY = 2.5
WEIGHT_SAFETY = 2.0

# Nominal defaults if specific numerical inputs are missing
PRIORITY_LABEL_MAP = {
    "CRITICAL": (9.0, 9.0, 9.0, 9.5),
    "HIGH": (7.5, 7.5, 7.0, 8.0),
    "MEDIUM": (5.0, 5.5, 5.0, 5.0),
    "LOW": (3.0, 3.0, 3.0, 2.0),
}

DEPARTMENT_CRITICALITY_BOOST = {
    "Engineering": 0.5,
    "TRD": 0.8,
    "S&T": 1.0,
}

def calculate_priority(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate deterministic maintenance request priority score (0-100)
    and assign priority level (Critical / High / Medium / Low).
    """
    priority_label = str(request.get("priority", "Medium")).upper()
    default_vals = PRIORITY_LABEL_MAP.get(priority_label, PRIORITY_LABEL_MAP["MEDIUM"])

    severity = float(request.get("severity") or default_vals[0])
    asset_criticality = float(request.get("assetCriticality") or request.get("asset_criticality") or default_vals[1])
    urgency = float(request.get("urgency") or default_vals[2])
    safety_impact = float(request.get("safetyImpact") or request.get("safety_impact") or default_vals[3])

    dept = request.get("department", "Engineering")
    dept_boost = DEPARTMENT_CRITICALITY_BOOST.get(dept, 0.0)

    # Calculate weighted raw score out of 100 (since individual metrics are 0-10)
    raw_score = (
        (severity * WEIGHT_SEVERITY) +
        ((asset_criticality + dept_boost) * WEIGHT_CRITICALITY) +
        (urgency * WEIGHT_URGENCY) +
        (safety_impact * WEIGHT_SAFETY)
    )

    priority_score = min(100.0, max(0.0, round(raw_score, 1)))

    if priority_score >= 80.0:
        priority_level = "Critical"
    elif priority_score >= 60.0:
        priority_level = "High"
    elif priority_score >= 40.0:
        priority_level = "Medium"
    else:
        priority_level = "Low"

    return {
        "priority_score": priority_score,
        "priority_level": priority_level,
        "severity": severity,
        "asset_criticality": asset_criticality,
        "urgency": urgency,
        "safety_impact": safety_impact
    }
