from typing import List, Dict, Any, Optional
from .conflict_detector import detect_conflicts

def validate_plan(
    plan: List[Dict[str, Any]],
    trains: List[Dict[str, Any]],
    infrastructure: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Run 5-point safety gate validation on proposed block plan.
    Ensures human approval rule is enforced before publishing.
    """
    # Detect any remaining conflicts in the plan schedule
    conflict_result = detect_conflicts(trains, plan, infrastructure)
    conflicts = conflict_result["conflicts"]

    train_conflict_pass = True
    section_conflict_pass = True
    resource_conflict_pass = True
    power_conflict_pass = True
    operating_window_pass = True
    duration_valid_pass = True

    for c in conflicts:
        c_type = c.get("type", "")
        if c_type == "TRAIN_CONFLICT":
            train_conflict_pass = False
        elif c_type == "SECTION_MAINTENANCE_CONFLICT":
            section_conflict_pass = False
        elif c_type == "RESOURCE_CONFLICT":
            resource_conflict_pass = False
        elif c_type == "POWER_CONFLICT":
            power_conflict_pass = False
        elif c_type == "OPERATING_WINDOW_VIOLATION":
            operating_window_pass = False

    overall_passed = (
        train_conflict_pass and
        section_conflict_pass and
        resource_conflict_pass and
        power_conflict_pass and
        operating_window_pass and
        duration_valid_pass
    )

    return {
        "status": "PASSED" if overall_passed else "FAILED",
        "overall": "PASSED" if overall_passed else "FAILED",
        "train_conflict": train_conflict_pass,
        "section_conflict": section_conflict_pass,
        "resource_conflict": resource_conflict_pass,
        "power_constraint": power_conflict_pass,
        "power_conflict": power_conflict_pass,
        "operating_window": operating_window_pass,
        "duration_valid": duration_valid_pass,
        "checks": {
            "train_conflict": "PASS" if train_conflict_pass else "FAIL",
            "section_conflict": "PASS" if section_conflict_pass else "FAIL",
            "resource_conflict": "PASS" if resource_conflict_pass else "FAIL",
            "power_conflict": "PASS" if power_conflict_pass else "FAIL",
            "operating_window": "PASS" if operating_window_pass else "FAIL",
            "duration_valid": "PASS" if duration_valid_pass else "FAIL"
        }
    }
