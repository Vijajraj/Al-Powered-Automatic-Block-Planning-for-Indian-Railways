"""
FastAPI Scheduling Engine Backend for Indian Railways Automatic Block Planning
Implements Person 1 Specification:
- Priority Engine
- Work-Time Predictor
- Conflict Detection
- CP-SAT Optimizer (Google OR-Tools)
- Safety Validation
- Disruption Re-planning
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from data.synthetic_data import RAW_TRAINS, RAW_MAINTENANCE_REQUESTS, RAW_INFRASTRUCTURE
from modules.priority_engine import calculate_priority
from modules.work_time_predictor import predict_duration
from modules.conflict_detector import detect_conflicts
from modules.optimizer import generate_plan
from modules.safety_validator import validate_plan
from modules.disruption_replanner import replan

app = FastAPI(
    title="AI-Powered Automatic Block Planning Engine",
    description="FastAPI + Google OR-Tools CP-SAT Backend for Indian Railways",
    version="1.0.0"
)

# Enable CORS for React frontend (localhost:5173 / any origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory working state
TRAINS_DB = list(RAW_TRAINS)
MAINTENANCE_DB = []

# Initialize maintenance with priority and predicted duration
for req in RAW_MAINTENANCE_REQUESTS:
    p_info = calculate_priority(req)
    pred_dur = predict_duration(req)
    enriched = dict(req)
    enriched["priority_score"] = p_info["priority_score"]
    enriched["priority"] = p_info["priority_level"]
    enriched["estimated_duration"] = pred_dur
    enriched["duration"] = pred_dur
    enriched["status"] = "Pending"
    MAINTENANCE_DB.append(enriched)

# Pydantic Schemas
class PlanRequest(BaseModel):
    trains: Optional[List[Dict[str, Any]]] = None
    maintenance_requests: Optional[List[Dict[str, Any]]] = None
    infrastructure: Optional[Dict[str, Any]] = None

class ValidateRequest(BaseModel):
    plan: Optional[List[Dict[str, Any]]] = None

class DisruptionRequest(BaseModel):
    current_plan: Optional[List[Dict[str, Any]]] = None
    disruption: Optional[Dict[str, Any]] = None

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "system": "AI-Powered Automatic Block Planning Engine",
        "division": "Chennai Division (MAS)",
        "endpoints": [
            "GET /trains",
            "GET /maintenance",
            "POST /plan",
            "POST /validate",
            "POST /disruption"
        ]
    }

@app.get("/trains")
def get_trains():
    """Returns scheduled trains with arrival/departure times, section, and priority."""
    # Normalize keys for both frontend formats (train_id & id, arrival_time & arrival)
    result = []
    for t in TRAINS_DB:
        t_copy = dict(t)
        t_copy["id"] = t.get("train_id")
        t_copy["arrival"] = t.get("arrival_time")
        t_copy["departure"] = t.get("departure_time")
        result.append(t_copy)
    return result

@app.get("/maintenance")
def get_maintenance():
    """Returns maintenance requests with calculated priority and predicted duration."""
    result = []
    for m in MAINTENANCE_DB:
        m_copy = dict(m)
        m_copy["id"] = m.get("request_id")
        m_copy["workType"] = m.get("work_type")
        result.append(m_copy)
    return result

@app.post("/plan")
def create_plan(payload: PlanRequest):
    """
    Runs CP-SAT Optimization Engine on input trains and maintenance requests.
    Returns:
    - optimized_plan
    - conflicts (pre-optimization detected conflicts)
    - safety_validation
    """
    trains = payload.trains or TRAINS_DB
    maintenance = payload.maintenance_requests or MAINTENANCE_DB
    infra = payload.infrastructure or RAW_INFRASTRUCTURE

    # 1. Detect pre-optimization conflicts
    conflicts_result = detect_conflicts(trains, maintenance, infra)

    # 2. Run CP-SAT solver
    optimized_plan = generate_plan(trains, maintenance, infra)

    # 3. Validate safety
    safety_result = validate_plan(optimized_plan, trains, infra)

    return {
        "optimized_plan": optimized_plan,
        "conflicts": conflicts_result.get("conflicts", []),
        "has_conflict": conflicts_result.get("has_conflict", False),
        "safety_validation": safety_result
    }

@app.post("/validate")
def validate_block_plan(payload: ValidateRequest):
    """Validates an existing or customized block plan against safety criteria."""
    plan = payload.plan or []
    return validate_plan(plan, TRAINS_DB, RAW_INFRASTRUCTURE)

@app.post("/disruption")
def handle_disruption(payload: DisruptionRequest):
    """
    Re-plans maintenance schedule following a train delay or maintenance overrun.
    Implements Detect -> Re-slot -> Update.
    """
    disruption = payload.disruption or {"type": "delay", "train": "12601", "minutes": 20}
    current_plan = payload.current_plan or []

    result = replan(
        disruption=disruption,
        current_plan=current_plan,
        trains=TRAINS_DB,
        maintenance_requests=MAINTENANCE_DB,
        infrastructure=RAW_INFRASTRUCTURE
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
