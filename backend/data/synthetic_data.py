"""
Synthetic Railway Dataset for Chennai Division (MAS - AJJ Line)
Sections:
  A-B: Chennai Central (MAS) - Kanchipuram (KPD) [Double Track]
  B-C: Kanchipuram (KPD) - Arcot (AJJ) [Single Track]
  C-D: Arcot (AJJ) - Vellore (VLR) [Single Track]
"""

RAW_TRAINS = [
    {
        "train_id": "12601",
        "name": "Train 12601",
        "train_type": "Express",
        "section": "A-B",
        "arrival_time": "08:10",
        "departure_time": "08:40",
        "direction": "Down",
        "priority": "High"
    },
    {
        "train_id": "12602",
        "name": "Train 12602",
        "train_type": "Express",
        "section": "A-B",
        "arrival_time": "09:15",
        "departure_time": "09:50",
        "direction": "Up",
        "priority": "High"
    },
    {
        "train_id": "16001",
        "name": "Train 16001",
        "train_type": "Passenger",
        "section": "B-C",
        "arrival_time": "10:00",
        "departure_time": "10:30",
        "direction": "Down",
        "priority": "Medium"
    },
    {
        "train_id": "12674",
        "name": "Train 12674",
        "train_type": "Express",
        "section": "A-B",
        "arrival_time": "11:05",
        "departure_time": "11:35",
        "direction": "Down",
        "priority": "High"
    },
    {
        "train_id": "12623",
        "name": "Train 12623",
        "train_type": "Mail",
        "section": "B-C",
        "arrival_time": "12:20",
        "departure_time": "12:55",
        "direction": "Up",
        "priority": "High"
    },
    {
        "train_id": "16127",
        "name": "Train 16127",
        "train_type": "Passenger",
        "section": "C-D",
        "arrival_time": "13:00",
        "departure_time": "13:40",
        "direction": "Down",
        "priority": "Medium"
    },
    {
        "train_id": "22625",
        "name": "Train 22625",
        "train_type": "Express",
        "section": "A-B",
        "arrival_time": "14:20",
        "departure_time": "14:40",
        "direction": "Up",
        "priority": "High"
    },
    {
        "train_id": "11013",
        "name": "Train 11013",
        "train_type": "Passenger",
        "section": "C-D",
        "arrival_time": "08:50",
        "departure_time": "09:20",
        "direction": "Down",
        "priority": "Low"
    },
    {
        "train_id": "56001",
        "name": "Train 56001",
        "train_type": "EMU",
        "section": "A-B",
        "arrival_time": "07:30",
        "departure_time": "07:55",
        "direction": "Up",
        "priority": "Low"
    },
    {
        "train_id": "56003",
        "name": "Train 56003",
        "train_type": "EMU",
        "section": "A-B",
        "arrival_time": "08:00",
        "departure_time": "08:25",
        "direction": "Down",
        "priority": "Low"
    }
]

RAW_MAINTENANCE_REQUESTS = [
    {
        "request_id": "M001",
        "section": "A-B",
        "department": "Engineering",
        "work_type": "Track Renewal",
        "priority": "Critical",
        "estimated_duration": 60,
        "required_resource": "BCM-01",
        "power_required": False,
        "requested_slot": "14:00-15:00",
        "severity": 9,
        "asset_criticality": 10,
        "urgency": 9,
        "safety_impact": 10
    },
    {
        "request_id": "M002",
        "section": "A-B",
        "department": "TRD",
        "work_type": "OHE Inspection",
        "priority": "High",
        "estimated_duration": 30,
        "required_resource": "TowerWagon-02",
        "power_required": True,
        "requested_slot": "16:00-16:30",
        "severity": 7,
        "asset_criticality": 8,
        "urgency": 7,
        "safety_impact": 8
    },
    {
        "request_id": "M003",
        "section": "B-C",
        "department": "S&T",
        "work_type": "Signal Work",
        "priority": "High",
        "estimated_duration": 40,
        "required_resource": "ST-Van-01",
        "power_required": False,
        "requested_slot": "13:20-14:00",
        "severity": 8,
        "asset_criticality": 8,
        "urgency": 7,
        "safety_impact": 8
    },
    {
        "request_id": "M004",
        "section": "C-D",
        "department": "Engineering",
        "work_type": "Ballast Tamping",
        "priority": "Medium",
        "estimated_duration": 45,
        "required_resource": "CSM-03",
        "power_required": False,
        "requested_slot": "09:00-09:45",
        "severity": 5,
        "asset_criticality": 6,
        "urgency": 5,
        "safety_impact": 6
    },
    {
        "request_id": "M005",
        "section": "B-C",
        "department": "TRD",
        "work_type": "Pantograph Check",
        "priority": "Low",
        "estimated_duration": 20,
        "required_resource": "TowerWagon-01",
        "power_required": True,
        "requested_slot": "07:30-07:50",
        "severity": 3,
        "asset_criticality": 4,
        "urgency": 3,
        "safety_impact": 4
    },
    {
        "request_id": "M006",
        "section": "A-B",
        "department": "Engineering",
        "work_type": "Rail Grinding",
        "priority": "Medium",
        "estimated_duration": 35,
        "required_resource": "RGM-01",
        "power_required": False,
        "requested_slot": "11:00-11:35",
        "severity": 6,
        "asset_criticality": 6,
        "urgency": 5,
        "safety_impact": 5
    },
    {
        "request_id": "M007",
        "section": "C-D",
        "department": "S&T",
        "work_type": "Cable Replacement",
        "priority": "High",
        "estimated_duration": 50,
        "required_resource": "ST-Van-02",
        "power_required": False,
        "requested_slot": "12:00-12:50",
        "severity": 7,
        "asset_criticality": 8,
        "urgency": 7,
        "safety_impact": 7
    },
    {
        "request_id": "M008",
        "section": "B-C",
        "department": "Engineering",
        "work_type": "Drain Cleaning",
        "priority": "Low",
        "estimated_duration": 25,
        "required_resource": "Manual-Gang-04",
        "power_required": False,
        "requested_slot": "06:00-06:25",
        "severity": 2,
        "asset_criticality": 3,
        "urgency": 2,
        "safety_impact": 2
    }
]

RAW_INFRASTRUCTURE = {
    "sections": [
        {
            "section": "A-B",
            "from_station": "Chennai (MAS)",
            "to_station": "Kanchipuram (KPD)",
            "track_type": "Double",
            "block_start": "06:00",
            "block_end": "22:00",
            "power_available": True
        },
        {
            "section": "B-C",
            "from_station": "Kanchipuram (KPD)",
            "to_station": "Arcot (AJJ)",
            "track_type": "Single",
            "block_start": "06:00",
            "block_end": "22:00",
            "power_available": True
        },
        {
            "section": "C-D",
            "from_station": "Arcot (AJJ)",
            "to_station": "Vellore (VLR)",
            "track_type": "Single",
            "block_start": "06:00",
            "block_end": "22:00",
            "power_available": True
        }
    ]
}
