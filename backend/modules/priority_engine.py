"""
Priority Engine: Deterministic weighted scoring model
Formula:
  Score = (Severity * 0.35) + (Asset_Criticality * 0.25) + (Urgency * 0.20) + (Safety_Impact * 0.20) * 10
Level Mapping:
  >= 80: Critical
  >= 60: High
  >= 40: Medium
  < 40: Low
"""

def calculate_priority(request: dict) -> dict:
    severity = request.get("severity", 5)
    asset_crit = request.get("asset_criticality", 5)
    urgency = request.get("urgency", 5)
    safety_impact = request.get("safety_impact", 5)

    raw_score = (severity * 0.35) + (asset_crit * 0.25) + (urgency * 0.20) + (safety_impact * 0.20)
    priority_score = round(raw_score * 10, 1)

    if priority_score >= 80:
        priority_level = "Critical"
    elif priority_score >= 60:
        priority_level = "High"
    elif priority_score >= 40:
        priority_level = "Medium"
    else:
        priority_level = "Low"

    return {
        "priority_score": priority_score,
        "priority_level": priority_level
    }
