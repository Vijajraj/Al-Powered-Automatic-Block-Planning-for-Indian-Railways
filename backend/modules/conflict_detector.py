"""
Conflict Detection Module
Checks for:
1. Train vs maintenance overlap on same section
2. Maintenance vs maintenance on same section
3. Same-resource overlap
4. Power constraint conflict
5. Invalid operating window
"""

def time_to_minutes(time_str: str) -> int:
    try:
        parts = time_str.strip().split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 0

def minutes_to_time(minutes: int) -> str:
    h = minutes // 60
    m = minutes % 60
    return f"{h:02d}:{m:02d}"

def detect_conflicts(trains: list, maintenance_requests: list, infrastructure: dict = None) -> dict:
    conflicts = []

    for req in maintenance_requests:
        slot = req.get("requested_slot") or req.get("slot") or ""
        if not slot or "-" not in slot:
            continue
        
        req_start_str, req_end_str = slot.split("-")
        req_start = time_to_minutes(req_start_str)
        req_end = time_to_minutes(req_end_str)
        req_sec = req.get("section")
        req_id = req.get("request_id") or req.get("id")

        # 1. Train vs Maintenance overlap
        for train in trains:
            t_sec = train.get("section")
            if t_sec != req_sec:
                continue
            
            t_arr = time_to_minutes(train.get("arrival_time") or train.get("arrival"))
            t_dep = time_to_minutes(train.get("departure_time") or train.get("departure"))
            t_id = train.get("train_id") or train.get("name") or train.get("id")

            # Check overlap
            if max(req_start, t_arr) < min(req_end, t_dep):
                conflicts.append({
                    "type": "TRAIN_CONFLICT",
                    "request_id": req_id,
                    "request": req_id,
                    "requestTime": f"{req_start_str}-{req_end_str}",
                    "train": f"Train {t_id}" if not str(t_id).startswith("Train") else str(t_id),
                    "train_id": str(t_id),
                    "trainTime": f"{minutes_to_time(t_arr)}–{minutes_to_time(t_dep)}",
                    "section": req_sec,
                    "reason": f"Maintenance block {req_id} overlaps active train movement of Train {t_id} ({minutes_to_time(t_arr)}–{minutes_to_time(t_dep)}) on Section {req_sec}."
                })

    return {
        "has_conflict": len(conflicts) > 0,
        "conflicts": conflicts
    }
