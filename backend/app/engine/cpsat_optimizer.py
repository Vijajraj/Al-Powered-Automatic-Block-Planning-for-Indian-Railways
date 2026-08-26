from typing import List, Dict, Any, Optional
from ortools.sat.python import cp_model
from .conflict_detector import time_to_minutes, minutes_to_time, parse_slot, detect_conflicts
from .priority_engine import calculate_priority
from .work_time_predictor import predict_duration
from .safety_validator import validate_plan

def generate_plan(
    trains: List[Dict[str, Any]],
    maintenance_requests: List[Dict[str, Any]],
    infrastructure: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    CP-SAT Scheduling Engine for Indian Railways Block Planning.
    Produces a safe, conflict-free maintenance block schedule matching
    all spatio-temporal, resource, and safety constraints.
    """
    model = cp_model.CpModel()

    # Determine operating window bounds (in minutes from midnight)
    block_start_min = time_to_minutes(infrastructure.get("blockStart", "06:00")) if infrastructure else 360
    block_end_min = time_to_minutes(infrastructure.get("blockEnd", "20:00")) if infrastructure else 1200
    power_available = infrastructure.get("powerAvailable", {}) if infrastructure else {}

    # Parse train schedules
    parsed_trains = []
    for t in trains:
        t_id = t.get("id") or t.get("train_id", "")
        t_name = t.get("name", f"Train {t_id}")
        t_sec = t.get("section", "")
        arr = t.get("arrival") or t.get("arrival_time", "00:00")
        dep = t.get("departure") or t.get("departure_time", "00:00")
        arr_m = time_to_minutes(arr)
        dep_m = time_to_minutes(dep)
        if dep_m < arr_m:
            dep_m = arr_m + 30
        parsed_trains.append({
            "id": t_id,
            "name": t_name,
            "section": t_sec,
            "arr_min": arr_m,
            "dep_min": dep_m
        })

    # Prepare maintenance variables & predictions
    maint_vars = {}
    section_intervals: Dict[str, List[Any]] = {}
    resource_intervals: Dict[str, List[Any]] = {}

    penalties = []

    for idx, req in enumerate(maintenance_requests):
        req_id = req.get("id") or req.get("request_id", f"M{idx+1:03d}")
        section = req.get("section", "A-B")
        dept = req.get("department", "Engineering")
        work_type = req.get("workType") or req.get("work_type", "Track Renewal")
        resource = req.get("resource") or req.get("required_resource", "")
        power_req = req.get("powerRequired") or req.get("power_required", False)

        # AI predictions
        priority_info = calculate_priority(req)
        priority_score = priority_info["priority_score"]
        predicted_dur = predict_duration(req)

        # Desired/requested start time
        slot_str = req.get("requestedSlot") or req.get("requested_slot", "")
        req_start_min, req_end_min = parse_slot(slot_str, default_start="09:00", default_duration=predicted_dur)

        # Bound start and end time within operating window
        min_start = max(block_start_min, 0)
        max_end = min(block_end_min, 1440)

        start_var = model.NewIntVar(min_start, max_end - predicted_dur, f"start_{req_id}")
        end_var = model.NewIntVar(min_start + predicted_dur, max_end, f"end_{req_id}")
        model.Add(end_var == start_var + predicted_dur)

        interval_var = model.NewIntervalVar(start_var, predicted_dur, end_var, f"interval_{req_id}")

        maint_vars[req_id] = {
            "req_id": req_id,
            "section": section,
            "department": dept,
            "work_type": work_type,
            "resource": resource,
            "power_required": power_req,
            "duration": predicted_dur,
            "requested_start_min": req_start_min,
            "priority_score": priority_score,
            "start_var": start_var,
            "end_var": end_var,
            "interval_var": interval_var,
            "raw": req
        }

        # Track section intervals for NoOverlap
        section_intervals.setdefault(section, []).append(interval_var)

        # Track resource intervals for NoOverlap
        if resource:
            resource_intervals.setdefault(resource, []).append(interval_var)

        # Hard Constraint: Train conflict avoidance on the same section
        for t in parsed_trains:
            if t["section"] == section:
                # Maintenance block must end before train arrival OR start after train departure
                b_before = model.NewBoolVar(f"before_{req_id}_{t['id']}")
                model.Add(end_var <= t["arr_min"]).OnlyEnforceIf(b_before)
                model.Add(start_var >= t["dep_min"]).OnlyEnforceIf(b_before.Not())

        # Objective Penalty: minimize deviation from preferred slot
        # Weight by priority (critical requests get penalized more for being delayed)
        weight = int(round(105 - priority_score))
        dev_var = model.NewIntVar(0, 1440, f"dev_{req_id}")
        model.Add(dev_var >= start_var - req_start_min)
        model.Add(dev_var >= req_start_min - start_var)
        penalties.append(weight * dev_var)

    # Hard Constraint: No overlapping maintenance on the same section
    for sec, intervals in section_intervals.items():
        if len(intervals) > 1:
            model.AddNoOverlap(intervals)

    # Hard Constraint: No overlapping maintenance using the same mobile resource
    for res, intervals in resource_intervals.items():
        if len(intervals) > 1:
            model.AddNoOverlap(intervals)

    # Set objective
    if penalties:
        model.Minimize(sum(penalties))

    # Solve model
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    status = solver.Solve(model)

    optimized_plan = []
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        for req_id, data in maint_vars.items():
            start_m = solver.Value(data["start_var"])
            end_m = solver.Value(data["end_var"])
            start_str = minutes_to_time(start_m)
            end_str = minutes_to_time(end_m)

            optimized_plan.append({
                "id": req_id,
                "request_id": req_id,
                "department": data["department"],
                "section": data["section"],
                "workType": data["work_type"],
                "work_type": data["work_type"],
                "start": start_str,
                "end": end_str,
                "duration": data["duration"],
                "status": "Feasible"
            })

    # Perform initial conflict check (for initial state before optimization)
    initial_conflicts_res = detect_conflicts(trains, maintenance_requests, infrastructure)

    # Perform safety validation on optimized plan
    safety_res = validate_plan(optimized_plan, trains, infrastructure)

    return {
        "optimized_plan": optimized_plan,
        "conflicts": initial_conflicts_res["conflicts"],
        "safety_validation": safety_res
    }
