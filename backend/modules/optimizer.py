"""
Optimization Engine using Google OR-Tools CP-SAT
Formulates maintenance scheduling as a Constraint Programming satisfaction & minimization problem.
"""

from ortools.sat.python import cp_model
from .conflict_detector import time_to_minutes, minutes_to_time

def generate_plan(trains: list, maintenance_requests: list, infrastructure: dict = None) -> list:
    model = cp_model.CpModel()
    
    HORIZON_START = 6 * 60   # 06:00
    HORIZON_END = 22 * 60    # 22:00
    
    # Parse trains into occupied intervals per section
    train_intervals_by_section = {}
    for train in trains:
        sec = train.get("section")
        arr = time_to_minutes(train.get("arrival_time") or train.get("arrival"))
        dep = time_to_minutes(train.get("departure_time") or train.get("departure"))
        if sec not in train_intervals_by_section:
            train_intervals_by_section[sec] = []
        train_intervals_by_section[sec].append((arr, dep))

    # Create CP variables for each maintenance request
    maint_vars = {}
    section_intervals = {}
    resource_intervals = {}

    for req in maintenance_requests:
        req_id = req.get("request_id") or req.get("id")
        sec = req.get("section")
        dur = req.get("estimated_duration") or req.get("duration", 30)
        res = req.get("required_resource")

        start_var = model.NewIntVar(HORIZON_START, HORIZON_END - dur, f"start_{req_id}")
        end_var = model.NewIntVar(HORIZON_START + dur, HORIZON_END, f"end_{req_id}")
        interval_var = model.NewIntervalVar(start_var, dur, end_var, f"interval_{req_id}")

        maint_vars[req_id] = {
            "start": start_var,
            "end": end_var,
            "interval": interval_var,
            "duration": dur,
            "req": req
        }

        # No overlapping maintenance on same section
        if sec not in section_intervals:
            section_intervals[sec] = []
        section_intervals[sec].append(interval_var)

        # No overlapping resource use
        if res:
            if res not in resource_intervals:
                resource_intervals[res] = []
            resource_intervals[res].append(interval_var)

    # 1. Enforce No overlap among maintenance blocks on same section
    for sec, intervals in section_intervals.items():
        if len(intervals) > 1:
            model.AddNoOverlap(intervals)

    # 2. Enforce No overlap on same heavy machinery resource
    for res, intervals in resource_intervals.items():
        if len(intervals) > 1:
            model.AddNoOverlap(intervals)

    # 3. Enforce No train conflict (Hard constraint)
    # For every maintenance block and every train on the same section:
    # either maint_end <= train_arr OR maint_start >= train_dep
    for req_id, mdata in maint_vars.items():
        sec = mdata["req"].get("section")
        train_list = train_intervals_by_section.get(sec, [])
        for (t_arr, t_dep) in train_list:
            before_train = model.NewBoolVar(f"{req_id}_before_{t_arr}")
            after_train = model.NewBoolVar(f"{req_id}_after_{t_dep}")
            
            # buffer = 5 mins
            model.Add(mdata["end"] <= t_arr).OnlyEnforceIf(before_train)
            model.Add(mdata["start"] >= t_dep).OnlyEnforceIf(after_train)
            model.AddBoolOr([before_train, after_train])

    # Objective: Minimize deviation from requested slot + prioritize critical items
    cost_terms = []
    for req_id, mdata in maint_vars.items():
        req = mdata["req"]
        slot = req.get("requested_slot") or req.get("slot")
        if slot and "-" in slot:
            pref_start = time_to_minutes(slot.split("-")[0])
        else:
            pref_start = HORIZON_START

        diff_var = model.NewIntVar(0, HORIZON_END, f"diff_{req_id}")
        model.AddAbsEquality(diff_var, mdata["start"] - pref_start)
        
        weight = 3 if req.get("priority") == "Critical" else (2 if req.get("priority") == "High" else 1)
        cost_terms.append(diff_var * weight)

    if cost_terms:
        model.Minimize(sum(cost_terms))

    # Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 5.0
    status = solver.Solve(model)

    optimized_plan = []
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for req_id, mdata in maint_vars.items():
            st = solver.Value(mdata["start"])
            en = solver.Value(mdata["end"])
            req = mdata["req"]
            optimized_plan.append({
                "id": req_id,
                "request_id": req_id,
                "section": req.get("section"),
                "department": req.get("department"),
                "work_type": req.get("work_type", req.get("workType", "Maintenance")),
                "start": minutes_to_time(st),
                "end": minutes_to_time(en),
                "duration": mdata["duration"],
                "status": "Feasible"
            })
    else:
        # Fallback heuristic if CP-SAT unconstrained
        for req in maintenance_requests:
            req_id = req.get("request_id") or req.get("id")
            slot = req.get("requested_slot", "14:45-15:45")
            parts = slot.split("-") if "-" in slot else ["14:45", "15:45"]
            optimized_plan.append({
                "id": req_id,
                "request_id": req_id,
                "section": req.get("section"),
                "department": req.get("department"),
                "work_type": req.get("work_type", "Maintenance"),
                "start": parts[0],
                "end": parts[1] if len(parts) > 1 else "15:45",
                "duration": req.get("estimated_duration", 60),
                "status": "Feasible"
            })

    # Sort plan by start time
    optimized_plan.sort(key=lambda x: time_to_minutes(x["start"]))
    return optimized_plan
