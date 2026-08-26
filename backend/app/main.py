from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

from app.models.schemas import (
    Train, MaintenanceRequest, Infrastructure, PlanRequest, PlanResponse,
    SafetyChecks, DisruptionRequest, DisruptionResponse
)
from app.data.synthetic_data import DEFAULT_TRAINS, DEFAULT_MAINTENANCE, DEFAULT_INFRASTRUCTURE
from app.engine.priority_engine import calculate_priority
from app.engine.work_time_predictor import predict_duration
from app.engine.conflict_detector import detect_conflicts
from app.engine.cpsat_optimizer import generate_plan
from app.engine.safety_validator import validate_plan
from app.engine.disruption_engine import replan

app = FastAPI(
    title="AI-Powered Automatic Block Planning Engine",
    description="Operational Control-Room API for Intelligent Maintenance Block Scheduling, CP-SAT Optimization, Safety Validation, and Real-Time Disruption Replanning.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite local dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory datasets (can also be backed by SQLite/JSON)
trains_db: List[Dict[str, Any]] = DEFAULT_TRAINS
maintenance_db: List[Dict[str, Any]] = DEFAULT_MAINTENANCE
infrastructure_db: Dict[str, Any] = DEFAULT_INFRASTRUCTURE

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "system": "AI-Powered Automatic Block Planning Engine — Indian Railways",
        "endpoints": ["/trains", "/maintenance", "/plan", "/validate", "/disruption"]
    }

@app.get("/trains")
def get_trains():
    """Retrieve active train timetables across sections."""
    return trains_db

@app.get("/maintenance")
def get_maintenance():
    """Retrieve maintenance block requests with calculated priority & predicted duration."""
    results = []
    for req in maintenance_db:
        r = dict(req)
        # Calculate AI priority & predict work duration
        priority_info = calculate_priority(r)
        r["priority_score"] = priority_info["priority_score"]
        r["priority_level"] = priority_info["priority_level"]
        r["predicted_duration"] = predict_duration(r)
        results.append(r)
    return results

@app.post("/plan")
def create_plan(payload: Dict[str, Any]):
    """
    Generate optimized conflict-free maintenance block schedule using OR-Tools CP-SAT.
    Input payload: trains, maintenance_requests, infrastructure (optional).
    """
    trains = payload.get("trains") or trains_db
    maint_reqs = payload.get("maintenance_requests") or payload.get("maintenance") or maintenance_db
    infra = payload.get("infrastructure") or infrastructure_db

    # Format trains and maintenance list from dicts or pydantic objects
    trains_list = [t.dict() if hasattr(t, "dict") else dict(t) for t in trains]
    maint_list = [m.dict() if hasattr(m, "dict") else dict(m) for m in maint_reqs]
    infra_dict = infra.dict() if hasattr(infra, "dict") else dict(infra)

    result = generate_plan(trains_list, maint_list, infra_dict)
    return result

@app.post("/validate")
def validate_schedule(payload: Dict[str, Any]):
    """
    Run 5-point safety gate checklist on proposed plan before human approval.
    """
    plan = payload.get("plan") or payload.get("optimized_plan") or []
    trains = payload.get("trains") or trains_db
    infra = payload.get("infrastructure") or infrastructure_db

    plan_list = [p.dict() if hasattr(p, "dict") else dict(p) for p in plan]
    trains_list = [t.dict() if hasattr(t, "dict") else dict(t) for t in trains]

    result = validate_plan(plan_list, trains_list, infra)
    return result

@app.post("/disruption")
def handle_disruption(payload: Dict[str, Any]):
    """
    Real-time disruption re-planning engine (Detect -> Re-slot -> Update).
    Handles Train Delays and Maintenance Overruns.
    """
    current_plan = payload.get("current_plan") or []
    disruption = payload.get("disruption") or payload

    result = replan(disruption, current_plan, trains_db, maintenance_db, infrastructure_db)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
