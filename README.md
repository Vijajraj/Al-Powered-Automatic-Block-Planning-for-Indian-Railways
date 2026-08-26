# AI-Powered Automatic Block Planning for Indian Railways

> **Ministry of Railways · Southern Railway / Chennai Division**  
> Operational Control-Room Platform for Intelligent Maintenance Block Scheduling, Conflict Detection, Safety Validation, and Real-Time Disruption Replanning.

---

## Live Localhost Access

The React operations interface is active and accessible locally:

```
Local: http://localhost:5173/
```

To run manually:
```bash
cd frontend
npm install
npm run dev
```

---

## System Overview

Railway maintenance blocks (Engineering track renewals, TRD overhead electrical inspections, S&T signaling works) must be scheduled without disrupting dense train timetables.

This system provides a **centralized railway control-room interface** that:
1. **Consumes optimization and planning engine APIs** (`/trains`, `/maintenance`, `/plan`, `/validate`, `/disruption`).
2. **Visualizes shared spatio-temporal constraints** across train traffic and departmental maintenance windows using an interactive **Gantt timeline**.
3. **Detects and resolves scheduling conflicts** with clear operational justifications.
4. **Enforces human-in-the-loop safety approvals** across 5 critical safety checks before executing blocks.
5. **Handles real-time disruptions** (Train Delays and Maintenance Overruns) with instant **Detect -> Re-slot -> Update** replanning.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Backend Engine** | Python 3.11, FastAPI, Google OR-Tools CP-SAT, Pandas, Pydantic v2 |
| **Optimization Solver** | Google OR-Tools CP-SAT (`ortools`) Constraint Programming Solver |
| **Frontend Framework** | React 19, Vite 8 |
| **Styling and UI** | Tailwind CSS v4 (Dark Ops-Room Theme) |
| **Icons and Visuals** | Lucide React, Custom SVG Railway Schematics and Interactive Gantt Timeline |
| **State Management** | Zustand (Global store with reactive updates) |
| **API Client** | Axios with seamless mock fallback & live backend integration |
| **Routing** | React Router DOM v7 |

---

## Backend & AI/Optimization Engine (Person 1 — Completed)

The complete backend scheduling engine is built and active under `/backend`, matching the full flow: **AI Priority Engine → Work-Time Predictor → CP-SAT Optimizer → Safety & Approval Gate → Block Plan → Disruption Re-slotting**.

### Core Engine Modules

1. **AI Priority Engine** (`backend/app/engine/priority_engine.py`)
   - Deterministic weighted model calculating a `0–100` score and level (`Critical`, `High`, `Medium`, `Low`) based on severity, asset criticality, urgency, and safety impact.
2. **Work-Time Predictor** (`backend/app/engine/work_time_predictor.py`)
   - Predicts maintenance block duration in minutes using departmental baselines, complexity multipliers, and heavy machinery setup overheads.
3. **Conflict Detection Engine** (`backend/app/engine/conflict_detector.py`)
   - Detects all 6 core conflict types: Train vs Maintenance, Maintenance vs Maintenance section overlap, Mobile resource contention, Power shutdown availability, Invalid operating window, and Redundant section allocations.
4. **Google OR-Tools CP-SAT Optimizer** (`backend/app/engine/cpsat_optimizer.py`)
   - Formulates constraint programming model with start/end decision variables, hard temporal/resource constraints, and an objective function minimizing train delay penalties and slot inefficiencies.
5. **Safety Validation Gate** (`backend/app/engine/safety_validator.py`)
   - 5-point safety gate checklist enforcing human-in-the-loop approvals before block publication.
6. **Disruption Replanning Engine** (`backend/app/engine/disruption_engine.py`)
   - Real-time **Detect → Re-slot → Update** engine handling Train Delays (`+20 min`) and Maintenance Overruns (`+30 min`).

### Running the Backend

#### Option A: Using `uv` (Recommended — Ultrafast)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment & install dependencies
uv venv --python 3.11
uv pip install -r requirements.txt

# 3. Launch FastAPI server (port 8000)
uv run uvicorn app.main:app --port 8000 --reload

# 4. Run unit tests
uv run python tests/test_engine.py
```

#### Option B: Standard Python 3.11 & `pip`

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
py -3.11 -m pip install -r requirements.txt

# 3. Run FastAPI server (port 8000)
py -3.11 -m uvicorn app.main:app --port 8000 --reload

# 4. Run unit tests
py -3.11 tests/test_engine.py
```

---

## Application Structure and Pages

```
┌─────────────────────────────────────────────────────────────┐
│ AI BLOCK PLANNING                      SYSTEM: ONLINE       │
├──────────────┬──────────────────────────────────────────────┤
│ Dashboard    │ KPI CARDS (Active Sections, Trains, Blocks)  │
│ Maintenance  │                                              │
│ Trains       │ NETWORK / SECTION SCHEMATIC VIEW             │
│ Block Plans  │                                              │
│ Disruptions  │ MAINTENANCE REQUESTS QUEUE                   │
│ Approvals    │                                              │
│              │ BLOCK PLANNING TIMELINE (Gantt View)         │
└──────────────┴──────────────────────────────────────────────┘
```

### 1. Dashboard (`/`)
- **Real-Time KPIs**: Dynamic counts for Active Sections, Scheduled Trains, Maintenance Requests, and Planned Blocks.
- **Network / Section Schematic**: Interactive line diagram (**CHENNAI -> KANCHIPURAM -> ARCOT -> VELLORE**). Click any section (`A-B`, `B-C`, `C-D`) to inspect track type, active train count, and maintenance demands.
- **Maintenance Queue**: High-level preview of incoming departmental requests.
- **Operational Timeline**: Quick-look Gantt chart of section activities.

### 2. Maintenance Requests (`/maintenance`)
- Complete data grid: `Request ID`, `Section`, `Department`, `Work Type`, `Priority`, `Duration`, `Requested Slot`, `Status`.
- Multi-dimensional filters: **Department** (Engineering, TRD, S&T), **Priority** (Critical, High, Medium, Low), **Section** (A-B, B-C, C-D), and **Status** (Pending, Planned).

### 3. Train Schedule (`/trains`)
- Live timetable view: `Train ID`, `Train Type`, `Section`, `Arrival`, `Departure`, `Direction`, `Priority`.
- Section filtering allowing controllers to analyze conflicting traffic slots.

### 4. Block Planning (`/block-planning`) — *Core Planning Screen*
- **`[ Generate Optimized Plan ]`**: Requests the optimal schedule from the backend.
- **Shared Gantt Timeline**: Displays train traffic and departmental blocks competing for track access.
- **Conflict Detection and Resolution**:
  - Highlights overlapping slots (e.g., `M001 Engineering` vs `Train 12601` at `14:20–14:40`).
  - `[ OPTIMIZE PLAN ]` re-slots maintenance to a feasible window (`14:45–15:45`).
- **Safety Validation Panel**: 5-point safety checklist:
  - `[x] Train conflict`
  - `[x] Section conflict`
  - `[x] Resource conflict`
  - `[x] Power constraint (OHE)`
  - `[x] Operating window compliance`
  - `Overall Status: PASSED`
- **Human Approval**: Controller clicks `[ APPROVE BLOCK PLAN ]` -> locks plan to `PLAN STATUS: APPROVED`.

### 5. Disruption Management (`/disruptions`) — *Simulation Screen*
- **Scenario A: Train Delay Simulation**
  - Select train (`12601`), add delay (`+20 min`), click `[ APPLY DISRUPTION ]`.
  - Alert: `DISRUPTION DETECTED` (Affects `M001`).
  - Click `[ RE-PLAN ]` -> Block re-slotted to `15:30–16:30` (Status: `RE-SLOTTED`).
- **Scenario B: Maintenance Overrun Simulation**
  - Select request (`M001`), add overrun (`+30 min`), click `[ APPLY ]`.
  - Shows actual end time `16:15` causing a conflict with downstream `M002 TRD`.
  - Click `[ RE-PLAN ]` -> `M002` shifted to `16:30–17:00`.
- **Live Re-planned Gantt**: Immediately reflects changes visually.

### 6. Approvals (`/approvals`)
- Official locked operational schedule for Section Controllers and field inspectors.

---

## 2-Minute Judging Demo Flow

Follow this sequence for an end-to-end demonstration:

1. **Dashboard** -> Show KPI metrics and click on **Section A-B** in the network schematic.
2. **Maintenance Requests** -> Filter by `Engineering` and `Critical` priority.
3. **Train Schedule** -> Highlight train density on section `A-B`.
4. **Block Planning**:
   - Click **`[ Generate Optimized Plan ]`**.
   - Review pre-optimization conflict on the timeline and conflict card (`M001` vs `Train 12601`).
   - Click **`[ OPTIMIZE PLAN ]`** -> observe conflict resolved and safety validation checklist passing (`PASSED`).
   - Click **`[ APPROVE BLOCK PLAN ]`** -> status updates to `APPROVED`.
5. **Disruption Management**:
   - Under **Simulate Train Delay**, select `Train 12601` with `+20 min` delay -> click **`[ APPLY DISRUPTION ]`**.
   - Click **`[ RE-PLAN ]`** -> observe `M001` re-slotted to `15:30–16:30`.
   - Under **Simulate Maintenance Overrun**, add `+30 min` to `M001` -> click **`[ APPLY ]`** -> **`[ RE-PLAN ]`**.
   - Review updated Gantt timeline below.
6. **Approvals** -> Show the finalized, controller-approved schedule.

---

## Backend API Integration

Configured in `frontend/src/api/client.js` with `http://localhost:8000`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/trains` | Fetch active train movements |
| `GET` | `/maintenance` | Fetch maintenance work queue |
| `POST` | `/plan` | Generate collision-free block plan |
| `POST` | `/validate` | Execute safety validation matrix |
| `POST` | `/disruption` | Calculate re-slotted schedule for delays/overruns |

*(Includes automatic fallback to realistic mock fixtures if backend is offline)*.

---

## Build and Production

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```
