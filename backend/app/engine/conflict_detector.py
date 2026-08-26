from typing import List, Dict, Any, Tuple, Optional

def time_to_minutes(time_str: str) -> int:
    """Convert 'HH:MM' string to minutes from midnight."""
    try:
        parts = time_str.strip().split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 0

def minutes_to_time(mins: int) -> str:
    """Convert minutes from midnight to 'HH:MM' string."""
    h = (mins // 60) % 24
    m = mins % 60
    return f"{h:02d}:{m:02d}"

def parse_slot(slot_str: Optional[str], default_start: str = "00:00", default_duration: int = 60) -> Tuple[int, int]:
    """Parse 'HH:MM-HH:MM' or return start/end in minutes."""
    if not slot_str or "-" not in slot_str:
        s_min = time_to_minutes(default_start)
        return s_min, s_min + default_duration
    try:
        parts = slot_str.split("-")
        return time_to_minutes(parts[0]), time_to_minutes(parts[1])
    except Exception:
        s_min = time_to_minutes(default_start)
        return s_min, s_min + default_duration

def intervals_overlap(s1: int, e1: int, s2: int, e2: int) -> bool:
    """Check if two time intervals [s1, e1) and [s2, e2) overlap."""
    return max(s1, s2) < min(e1, e2)

def detect_conflicts(
    trains: List[Dict[str, Any]],
    maintenance_requests: List[Dict[str, Any]],
    infrastructure: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Detect scheduling conflicts across the 6 core rules:
    1. Train vs maintenance
    2. Maintenance vs maintenance
    3. Same-resource overlap
    4. Power conflict
    5. Invalid operating window
    6. Same-section overlap
    """
    conflicts: List[Dict[str, Any]] = []

    block_start_min = time_to_minutes(infrastructure.get("blockStart", "06:00")) if infrastructure else 360
    block_end_min = time_to_minutes(infrastructure.get("blockEnd", "20:00")) if infrastructure else 1200
    power_avail = infrastructure.get("powerAvailable", {}) if infrastructure else {}

    # Parse train windows
    parsed_trains = []
    for t in trains:
        t_id = t.get("id") or t.get("train_id", "")
        t_name = t.get("name", f"Train {t_id}")
        t_sec = t.get("section", "")
        arr = t.get("arrival") or t.get("arrival_time", "00:00")
        dep = t.get("departure") or t.get("departure_time", "00:00")
        arr_min = time_to_minutes(arr)
        dep_min = time_to_minutes(dep)
        if dep_min < arr_min:
            dep_min += 30  # Safety buffer
        parsed_trains.append({
            "id": t_id,
            "name": t_name,
            "section": t_sec,
            "arr_min": arr_min,
            "dep_min": dep_min,
            "arr_str": arr,
            "dep_str": dep
        })

    # Parse maintenance windows
    parsed_maint = []
    for m in maintenance_requests:
        m_id = m.get("id") or m.get("request_id", "")
        m_sec = m.get("section", "")
        m_dept = m.get("department", "")
        m_res = m.get("resource") or m.get("required_resource", "")
        m_power = m.get("powerRequired") or m.get("power_required", False)
        dur = m.get("duration") or m.get("estimated_duration", 60)

        if "start" in m and "end" in m:
            s_min = time_to_minutes(m["start"])
            e_min = time_to_minutes(m["end"])
            slot_str = f"{m['start']}-{m['end']}"
        else:
            slot_str = m.get("requestedSlot") or m.get("requested_slot", "")
            s_min, e_min = parse_slot(slot_str, default_duration=dur)

        parsed_maint.append({
            "id": m_id,
            "section": m_sec,
            "department": m_dept,
            "resource": m_res,
            "powerRequired": m_power,
            "duration": dur,
            "s_min": s_min,
            "e_min": e_min,
            "slot_str": slot_str,
            "raw": m
        })

    # 1. Train vs Maintenance & 6. Same-section overlap
    for m in parsed_maint:
        for t in parsed_trains:
            if m["section"] == t["section"]:
                if intervals_overlap(m["s_min"], m["e_min"], t["arr_min"], t["dep_min"]):
                    conflicts.append({
                        "type": "TRAIN_CONFLICT",
                        "request_id": m["id"],
                        "request": m["id"],
                        "requestTime": m["slot_str"],
                        "train_id": t["id"],
                        "train": t["name"],
                        "trainTime": f"{t['arr_str']}-{t['dep_str']}",
                        "section": m["section"],
                        "reason": f"Maintenance block {m['id']} overlaps active train movement of {t['name']} on Section {m['section']}."
                    })

    # 2. Maintenance vs Maintenance (same section) & 3. Same-resource overlap
    for i in range(len(parsed_maint)):
        for j in range(i + 1, len(parsed_maint)):
            m1 = parsed_maint[i]
            m2 = parsed_maint[j]

            # Same section overlap
            if m1["section"] == m2["section"]:
                if intervals_overlap(m1["s_min"], m1["e_min"], m2["s_min"], m2["e_min"]):
                    conflicts.append({
                        "type": "SECTION_MAINTENANCE_CONFLICT",
                        "request_id": m1["id"],
                        "request": m1["id"],
                        "requestTime": m1["slot_str"],
                        "conflicting_request_id": m2["id"],
                        "conflicting_slot": m2["slot_str"],
                        "section": m1["section"],
                        "reason": f"Maintenance block {m1['id']} overlaps with maintenance block {m2['id']} on Section {m1['section']}."
                    })

            # Same resource overlap (even across different sections)
            if m1["resource"] and m2["resource"] and m1["resource"] == m2["resource"]:
                if intervals_overlap(m1["s_min"], m1["e_min"], m2["s_min"], m2["e_min"]):
                    conflicts.append({
                        "type": "RESOURCE_CONFLICT",
                        "request_id": m1["id"],
                        "conflicting_request_id": m2["id"],
                        "resource": m1["resource"],
                        "reason": f"Resource contention for '{m1['resource']}' between blocks {m1['id']} and {m2['id']}."
                    })

    # 4. Power conflict & 5. Invalid operating window
    for m in parsed_maint:
        # Operating window check
        if m["s_min"] < block_start_min or m["e_min"] > block_end_min:
            conflicts.append({
                "type": "OPERATING_WINDOW_VIOLATION",
                "request_id": m["id"],
                "request": m["id"],
                "requestTime": m["slot_str"],
                "reason": f"Maintenance block {m['id']} is outside section operating window ({infrastructure.get('blockStart', '06:00')}-{infrastructure.get('blockEnd', '20:00')})."
            })

        # Power constraint check
        if m["powerRequired"]:
            sec_power = power_avail.get(m["section"], True)
            if not sec_power:
                conflicts.append({
                    "type": "POWER_CONFLICT",
                    "request_id": m["id"],
                    "request": m["id"],
                    "section": m["section"],
                    "reason": f"Power shutdown required for {m['id']} on Section {m['section']}, but power grid is unavailable."
                })

    return {
        "has_conflict": len(conflicts) > 0,
        "conflicts": conflicts
    }
