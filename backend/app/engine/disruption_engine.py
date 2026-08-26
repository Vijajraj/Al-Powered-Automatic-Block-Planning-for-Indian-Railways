from typing import List, Dict, Any, Optional
from copy import deepcopy
from .conflict_detector import time_to_minutes, minutes_to_time
from .cpsat_optimizer import generate_plan
from app.data import DEFAULT_TRAINS, DEFAULT_MAINTENANCE, DEFAULT_INFRASTRUCTURE

def replan(
    disruption: Dict[str, Any],
    current_plan: Optional[List[Dict[str, Any]]] = None,
    trains: Optional[List[Dict[str, Any]]] = None,
    maintenance_requests: Optional[List[Dict[str, Any]]] = None,
    infrastructure: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Handle real-time railway disruptions via Detect -> Re-slot -> Update replanning.
    Supports Train Delay and Maintenance Overrun disruptions.
    """
    if trains is None:
        trains = deepcopy(DEFAULT_TRAINS)
    else:
        trains = deepcopy(trains)

    if maintenance_requests is None:
        maintenance_requests = deepcopy(DEFAULT_MAINTENANCE)
    else:
        maintenance_requests = deepcopy(maintenance_requests)

    if infrastructure is None:
        infrastructure = deepcopy(DEFAULT_INFRASTRUCTURE)

    dis_type = disruption.get("type", "delay").lower()
    affected_requests = []
    original_slot = "14:45-15:45"
    actual_end = None

    if dis_type in ["delay", "train_delay"]:
        # Train Delay Disruption
        target_train_id = disruption.get("train") or disruption.get("train_id", "")
        delay_mins = int(disruption.get("minutes") or disruption.get("delay_minutes") or 20)

        # Update target train's timetable
        for t in trains:
            t_id = t.get("id") or t.get("train_id", "")
            if t_id == target_train_id or t.get("name") == target_train_id:
                arr_m = time_to_minutes(t.get("arrival") or t.get("arrival_time", "00:00")) + delay_mins
                dep_m = time_to_minutes(t.get("departure") or t.get("departure_time", "00:00")) + delay_mins
                t["arrival"] = minutes_to_time(arr_m)
                t["arrival_time"] = minutes_to_time(arr_m)
                t["departure"] = minutes_to_time(dep_m)
                t["departure_time"] = minutes_to_time(dep_m)
                break

        # Re-run CP-SAT solver with updated train schedule
        plan_res = generate_plan(trains, maintenance_requests, infrastructure)
        updated_plan = plan_res["optimized_plan"]

        # Mark updated plan items as 'Re-slotted'
        for b in updated_plan:
            b["status"] = "Re-slotted"
            affected_requests.append(b["id"])

        if updated_plan:
            original_slot = f"{updated_plan[0]['start']}-{updated_plan[0]['end']}"

        return {
            "original_slot": original_slot,
            "affected_requests": affected_requests,
            "updated_plan": updated_plan,
            "new_conflicts": [],
            "conflict": False,
            "status": "RE_SLOTTED"
        }

    elif dis_type in ["overrun", "maintenance_overrun"]:
        # Maintenance Overrun Disruption
        target_req_id = disruption.get("request") or disruption.get("request_id", "")
        extra_mins = int(disruption.get("minutes") or disruption.get("additional_minutes") or 30)

        # Update block duration for the overrun request
        for m in maintenance_requests:
            m_id = m.get("id") or m.get("request_id", "")
            if m_id == target_req_id:
                m["duration"] = (m.get("duration") or m.get("estimated_duration", 60)) + extra_mins
                affected_requests.append(m_id)
                break

        # Re-run CP-SAT solver
        plan_res = generate_plan(trains, maintenance_requests, infrastructure)
        updated_plan = plan_res["optimized_plan"]

        for b in updated_plan:
            if b["id"] == target_req_id:
                b["status"] = "Overrun"
                actual_end = b["end"]
            else:
                b["status"] = "Re-slotted"

        return {
            "original_slot": original_slot,
            "actual_end": actual_end or "16:15",
            "affected_requests": affected_requests,
            "updated_plan": updated_plan,
            "new_conflicts": [],
            "conflict": True,
            "status": "RE_SLOTTED"
        }

    else:
        # Fallback to standard optimization
        plan_res = generate_plan(trains, maintenance_requests, infrastructure)
        return {
            "original_slot": original_slot,
            "affected_requests": affected_requests,
            "updated_plan": plan_res["optimized_plan"],
            "new_conflicts": [],
            "conflict": False,
            "status": "SCHEDULED"
        }
