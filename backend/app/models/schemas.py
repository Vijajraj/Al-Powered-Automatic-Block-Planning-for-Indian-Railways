from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class Train(BaseModel):
    id: str = Field(..., alias="train_id")
    name: Optional[str] = None
    type: str = Field("Express", alias="train_type")
    section: str
    arrival: str = Field(..., alias="arrival_time")
    departure: str = Field(..., alias="departure_time")
    direction: str = "Down"
    priority: Union[str, int] = "High"

    class Config:
        populate_by_name = True

class MaintenanceRequest(BaseModel):
    id: str = Field(..., alias="request_id")
    section: str
    department: str  # Engineering, TRD, S&T
    workType: str = Field(..., alias="work_type")
    priority: str = "High"  # Critical, High, Medium, Low
    duration: int = Field(60, alias="estimated_duration")
    requestedSlot: Optional[str] = Field(None, alias="requested_slot")
    resource: Optional[str] = Field(None, alias="required_resource")
    powerRequired: bool = Field(False, alias="power_required")
    severity: Optional[float] = 5.0
    assetCriticality: Optional[float] = Field(5.0, alias="asset_criticality")
    urgency: Optional[float] = 5.0
    safetyImpact: Optional[float] = Field(5.0, alias="safety_impact")
    status: str = "Pending"

    class Config:
        populate_by_name = True

class Infrastructure(BaseModel):
    sections: List[str] = ["A-B", "B-C", "C-D", "D-E"]
    trackType: Dict[str, str] = Field(default_factory=lambda: {"A-B": "double", "B-C": "single", "C-D": "single", "D-E": "double"})
    blockStart: str = "06:00"
    blockEnd: str = "20:00"
    powerAvailable: Dict[str, bool] = Field(default_factory=lambda: {"A-B": True, "B-C": True, "C-D": True, "D-E": True})

    class Config:
        populate_by_name = True

class PlanBlock(BaseModel):
    id: str
    request_id: Optional[str] = None
    department: str
    section: str
    workType: Optional[str] = None
    start: str
    end: str
    duration: int
    status: str = "Feasible"

    class Config:
        populate_by_name = True

class ConflictItem(BaseModel):
    type: Optional[str] = "TRAIN_CONFLICT"
    request_id: Optional[str] = None
    request: Optional[str] = None
    requestTime: Optional[str] = None
    train_id: Optional[str] = None
    train: Optional[str] = None
    trainTime: Optional[str] = None
    section: Optional[str] = None
    reason: str

class SafetyChecks(BaseModel):
    train_conflict: Union[bool, str] = True
    section_conflict: Union[bool, str] = True
    resource_conflict: Union[bool, str] = True
    power_constraint: Union[bool, str] = True
    power_conflict: Optional[Union[bool, str]] = True
    operating_window: Union[bool, str] = True
    duration_valid: Optional[Union[bool, str]] = True
    overall: str = "PASSED"
    status: Optional[str] = "PASSED"

class PlanRequest(BaseModel):
    trains: List[Train]
    maintenance_requests: List[MaintenanceRequest]
    infrastructure: Optional[Infrastructure] = None

class PlanResponse(BaseModel):
    optimized_plan: List[PlanBlock]
    conflicts: List[ConflictItem]
    safety_validation: SafetyChecks

class DisruptionPayload(BaseModel):
    type: str  # "delay" or "overrun"
    train: Optional[str] = None
    train_id: Optional[str] = None
    minutes: Optional[int] = 20
    delay_minutes: Optional[int] = None
    request: Optional[str] = None
    request_id: Optional[str] = None
    additional_minutes: Optional[int] = None

class DisruptionRequest(BaseModel):
    current_plan: List[Dict[str, Any]] = []
    disruption: DisruptionPayload

class DisruptionResponse(BaseModel):
    original_slot: Optional[str] = None
    actual_end: Optional[str] = None
    affected_requests: List[str] = []
    updated_plan: List[PlanBlock]
    new_conflicts: List[ConflictItem] = []
    conflict: bool = False
    status: str = "RE_SLOTTED"
