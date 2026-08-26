import pandas as pd
from typing import List, Dict, Any

DEFAULT_SECTIONS = ["A-B", "B-C", "C-D", "D-E"]

DEFAULT_INFRASTRUCTURE = {
    "sections": DEFAULT_SECTIONS,
    "trackType": {"A-B": "double", "B-C": "single", "C-D": "single", "D-E": "double"},
    "blockStart": "06:00",
    "blockEnd": "20:00",
    "powerAvailable": {"A-B": True, "B-C": True, "C-D": True, "D-E": True}
}

DEFAULT_TRAINS: List[Dict[str, Any]] = [
    {"id": "T001", "name": "Train 12601", "type": "Express", "section": "A-B", "arrival": "14:20", "departure": "14:40", "direction": "Down", "priority": "High"},
    {"id": "T002", "name": "Train 12602", "type": "Express", "section": "A-B", "arrival": "09:15", "departure": "09:50", "direction": "Up", "priority": "High"},
    {"id": "T003", "name": "Train 16001", "type": "Passenger", "section": "B-C", "arrival": "10:00", "departure": "10:30", "direction": "Down", "priority": "Medium"},
    {"id": "T004", "name": "Train 12674", "type": "Express", "section": "A-B", "arrival": "11:05", "departure": "11:35", "direction": "Down", "priority": "High"},
    {"id": "T005", "name": "Train 12623", "type": "Mail", "section": "B-C", "arrival": "12:20", "departure": "12:55", "direction": "Up", "priority": "High"},
    {"id": "T006", "name": "Train 16127", "type": "Passenger", "section": "C-D", "arrival": "13:00", "departure": "13:40", "direction": "Down", "priority": "Medium"},
    {"id": "T007", "name": "Train 22625", "type": "Express", "section": "A-B", "arrival": "14:10", "departure": "14:35", "direction": "Up", "priority": "High"},
    {"id": "T008", "name": "Train 11013", "type": "Passenger", "section": "C-D", "arrival": "08:50", "departure": "09:20", "direction": "Down", "priority": "Low"},
    {"id": "T009", "name": "Train 56001", "type": "EMU", "section": "A-B", "arrival": "07:30", "departure": "07:55", "direction": "Up", "priority": "Low"},
    {"id": "T010", "name": "Train 56003", "type": "EMU", "section": "A-B", "arrival": "08:00", "departure": "08:25", "direction": "Down", "priority": "Low"},
    {"id": "T011", "name": "Train 12615", "type": "Superfast", "section": "D-E", "arrival": "15:00", "departure": "15:35", "direction": "Down", "priority": "High"},
    {"id": "T012", "name": "Train 16057", "type": "Express", "section": "D-E", "arrival": "16:30", "departure": "17:00", "direction": "Up", "priority": "Medium"}
]

DEFAULT_MAINTENANCE: List[Dict[str, Any]] = [
    {
        "id": "M001",
        "section": "A-B",
        "department": "Engineering",
        "workType": "Track Renewal",
        "priority": "Critical",
        "duration": 60,
        "status": "Pending",
        "requestedSlot": "14:00-15:00",
        "resource": "Heavy Crane #1",
        "powerRequired": False,
        "severity": 9.0,
        "assetCriticality": 9.5,
        "urgency": 9.0,
        "safetyImpact": 10.0
    },
    {
        "id": "M002",
        "section": "A-B",
        "department": "TRD",
        "workType": "OHE Inspection",
        "priority": "High",
        "duration": 30,
        "status": "Pending",
        "requestedSlot": "16:00-16:30",
        "resource": "Tower Wagon #1",
        "powerRequired": True,
        "severity": 7.5,
        "assetCriticality": 8.0,
        "urgency": 7.0,
        "safetyImpact": 8.0
    },
    {
        "id": "M003",
        "section": "B-C",
        "department": "S&T",
        "workType": "Signal Work",
        "priority": "High",
        "duration": 40,
        "status": "Pending",
        "requestedSlot": "13:20-14:00",
        "resource": "Signal Kit #1",
        "powerRequired": False,
        "severity": 8.0,
        "assetCriticality": 8.5,
        "urgency": 7.5,
        "safetyImpact": 8.5
    },
    {
        "id": "M004",
        "section": "C-D",
        "department": "Engineering",
        "workType": "Ballast Tamping",
        "priority": "Medium",
        "duration": 45,
        "status": "Planned",
        "requestedSlot": "09:00-09:45",
        "resource": "Tamper Unit #2",
        "powerRequired": False,
        "severity": 5.0,
        "assetCriticality": 6.0,
        "urgency": 5.0,
        "safetyImpact": 4.0
    },
    {
        "id": "M005",
        "section": "B-C",
        "department": "TRD",
        "workType": "Pantograph Check",
        "priority": "Low",
        "duration": 20,
        "status": "Planned",
        "requestedSlot": "07:30-07:50",
        "resource": "Tower Wagon #2",
        "powerRequired": True,
        "severity": 3.0,
        "assetCriticality": 4.0,
        "urgency": 3.0,
        "safetyImpact": 2.0
    },
    {
        "id": "M006",
        "section": "A-B",
        "department": "Engineering",
        "workType": "Rail Grinding",
        "priority": "Medium",
        "duration": 35,
        "status": "Pending",
        "requestedSlot": "11:00-11:35",
        "resource": "Rail Grinder #1",
        "powerRequired": False,
        "severity": 6.0,
        "assetCriticality": 6.0,
        "urgency": 6.0,
        "safetyImpact": 5.0
    },
    {
        "id": "M007",
        "section": "C-D",
        "department": "S&T",
        "workType": "Cable Replacement",
        "priority": "High",
        "duration": 50,
        "status": "Pending",
        "requestedSlot": "12:00-12:50",
        "resource": "Wiring Van #1",
        "powerRequired": False,
        "severity": 7.0,
        "assetCriticality": 7.5,
        "urgency": 7.0,
        "safetyImpact": 7.5
    },
    {
        "id": "M008",
        "section": "B-C",
        "department": "Engineering",
        "workType": "Drain Cleaning",
        "priority": "Low",
        "duration": 25,
        "status": "Planned",
        "requestedSlot": "06:00-06:25",
        "resource": "Manual Crew #3",
        "powerRequired": False,
        "severity": 2.0,
        "assetCriticality": 3.0,
        "urgency": 2.0,
        "safetyImpact": 2.0
    },
    {
        "id": "M009",
        "section": "D-E",
        "department": "Engineering",
        "workType": "Sleeper Replacement",
        "priority": "High",
        "duration": 45,
        "status": "Pending",
        "requestedSlot": "15:10-15:55",  # Intentional conflict with Train T011 (15:00-15:35)
        "resource": "Heavy Crane #1",
        "powerRequired": False,
        "severity": 8.0,
        "assetCriticality": 8.0,
        "urgency": 7.5,
        "safetyImpact": 7.0
    },
    {
        "id": "M010",
        "section": "D-E",
        "department": "TRD",
        "workType": "Substation Maintenance",
        "priority": "Medium",
        "duration": 40,
        "status": "Pending",
        "requestedSlot": "17:15-17:55",
        "resource": "Tower Wagon #1",
        "powerRequired": True,
        "severity": 6.0,
        "assetCriticality": 7.0,
        "urgency": 5.5,
        "safetyImpact": 6.0
    }
]

def get_trains_df() -> pd.DataFrame:
    return pd.DataFrame(DEFAULT_TRAINS)

def get_maintenance_df() -> pd.DataFrame:
    return pd.DataFrame(DEFAULT_MAINTENANCE)
