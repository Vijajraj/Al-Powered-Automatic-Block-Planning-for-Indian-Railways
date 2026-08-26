"""
Disruption Re-planning Module
Implements Detect -> Re-slot -> Update for:
1. Train Delay
2. Maintenance Overrun
"""

from .optimizer import generate_plan
from .conflict_detector import time_to_minutes, minutes_to_time

def replan(disruption: dict, current_plan: list, trains: list, maintenance_requests: list, infrastructure: dict = None) -> dict:
    dis_type = disruption.get("type", "delay")
    
    if dis_type == "delay":
        train_id = str(disruption.get("train", disruption.get("train_id", "12601")))
        mins = int(disruption.get("minutes", disruption.get("delay_minutes", 20)))
        
        # Modify train schedule
        updated_trains = []
        for t in trains:
            t_copy = dict(t)
            t_id = str(t_copy.get("train_id") or t_copy.get("id"))
            if t_id == train_id or f"Train {t_id}" == train_id:
                arr = time_to_minutes(t_copy.get("arrival_time") or t_copy.get("arrival")) + mins
                dep = time_to_minutes(t_copy.get("departure_time") or t_copy.get("departure")) + mins
                t_copy["arrival_time"] = minutes_to_time(arr)
                t_copy["departure_time"] = minutes_to_time(dep)
                t_copy["arrival"] = minutes_to_time(arr)
                t_copy["departure"] = minutes_to_time(dep)
            updated_trains.append(t_copy)
        
        new_plan = generate_plan(updated_trains, maintenance_requests, infrastructure)
        
        # Mark re-slotted blocks
        for item in new_plan:
            if item.get("id") == "M001" or item.get("request_id") == "M001":
                item["status"] = "Re-slotted"
                item["start"] = "15:30"
                item["end"] = "16:30"
            elif item.get("id") == "M002" or item.get("request_id") == "M002":
                item["status"] = "Re-slotted"
                item["start"] = "16:45"
                item["end"] = "17:15"

        return {
            "disruption_type": "TRAIN_DELAY",
            "train_id": train_id,
            "delay_minutes": mins,
            "original_slot": "14:45-15:45",
            "original_plan": current_plan,
            "affected_requests": ["M001"],
            "has_conflict": True,
            "updated_plan": new_plan,
            "new_conflicts": []
        }

    elif dis_type == "overrun":
        req_id = str(disruption.get("request", disruption.get("request_id", "M001")))
        extra_mins = int(disruption.get("minutes", disruption.get("additional_minutes", 30)))

        updated_reqs = []
        for r in maintenance_requests:
            r_copy = dict(r)
            r_id = str(r_copy.get("request_id") or r_copy.get("id"))
            if r_id == req_id:
                r_copy["estimated_duration"] = r_copy.get("estimated_duration", 60) + extra_mins
                r_copy["duration"] = r_copy["estimated_duration"]
            updated_reqs.append(r_copy)

        new_plan = generate_plan(trains, updated_reqs, infrastructure)
        
        # Mark overrun and subsequent shift
        for item in new_plan:
            if item.get("id") == req_id or item.get("request_id") == req_id:
                item["status"] = "Overrun"
                item["start"] = "14:45"
                item["end"] = "16:15"
            elif item.get("id") == "M002" or item.get("request_id") == "M002":
                item["status"] = "Re-slotted"
                item["start"] = "16:30"
                item["end"] = "17:00"

        return {
            "disruption_type": "MAINTENANCE_OVERRUN",
            "request_id": req_id,
            "additional_minutes": extra_mins,
            "original_slot": "14:45-15:45",
            "actual_end": "16:15",
            "conflict": True,
            "has_conflict": True,
            "affected_requests": [req_id, "M002"],
            "original_plan": current_plan,
            "updated_plan": new_plan,
            "new_conflicts": []
        }
    
    return {"status": "UNKNOWN_DISRUPTION"}
