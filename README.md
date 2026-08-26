# Indian Railways — Block Planning & Maintenance Management Portal
## Ministry of Railways, Government of India (Southern Railway / Chennai Division)

### Overview
This portal has been developed as an authentic **Indian Government / Indian Railways web application** adhering to the Guidelines for Indian Government Websites (GIGW) design standards.

It features a normal, fluid, fully-responsive layout (no fixed constraints or arbitrary box sizes) with national government branding, accessibility controls, realistic train operations data, and departmental block maintenance workflows.

---

### Key Portal Architecture

1. **Top National / Accessibility Header Bar**:
   - Bilingual Indian Government identity: `भारत सरकार | Government of India` & `रेल मंत्रालय | Ministry of Railways`.
   - Division (`Chennai MAS`), Shift (`Day 06:00 - 14:00`), Date (`25 Aug 2026`).
   - Standard GIGW Accessibility buttons (`A-`, `A`, `A+`).
   - National Tricolor Ribbon accent.

2. **Main Portal Branding & Navigation**:
   - Title: `BLOCK PLANNING & MAINTENANCE` with `Planning Active` status badge.
   - Subtitle: `Indian Railways • Operating & Engineering Department (Control Office, Chennai Division)`.
   - Section Controller terminal status: `MAS-CTRL-04` (COA Link: Active).
   - Government horizontal navigation menu (`Dashboard`, `Block Requests`, `Timetable & Position`, `Safety Approvals`, `Disruption Log`, `Reports & MIS`).
   - Operational Notice / Ticker ribbon.

3. **Core Operational Metrics**:
   - **PENDING REQUESTS:** 24
   - **PLANNED BLOCKS:** 15
   - **CONFLICTS:** 03
   - **AWAITING APPROVAL:** 06

4. **Maintenance Block Requests Queue**:
   - Structured table listing active departmental requests across **Engineering (B-14)**, **TRD (B-16)**, and **S&T (B-12)** with color-coded priority and status tags.

5. **Proposed Block Specification**:
   - Highlighting Section **B-14 (Engineering - Track Maintenance)**.
   - Recommended operational window: **14:20 – 15:05** (45 min duration, 0 train conflicts, Safety Passed, Low traffic impact).
   - Action: `REVIEW BLOCK SPECIFICATION` (modal displaying track isolation, OHE power block, and caution order protocols).

6. **Train & Block Position Timeline (Full Width)**:
   - Synchronized timeline across **13:00 – 16:00** displaying **Train Movements** (*Train 12674 Cheran Exp*, *Train 12623 MAS-TVC Mail*, *Train 16127 Guruvayur Exp*) along with departmental maintenance blocks (**ENG**, **TRD**, **S&T**).

7. **Safety & Approval Matrix**:
   - Interlock check status (Track Availability, Train Conflict, Department Conflict, Safety Conditions).
   - Action: `APPROVE BLOCK` (updates status to *Approved by Controller*).

8. **Disruption Management & Work Overrun**:
   - Alert: `B-14 — WORK OVERRUN` (+12 min).
   - Slot rescheduling: `14:20 – 15:05` $\rightarrow$ `15:20 – 16:05`.
   - Action: `REVISE BLOCK` (dynamically shifts the timeline slot).

9. **Indian Government Standard Footer**:
   - Managed by *Ministry of Railways, Government of India*.
   - Designed & Hosted by *Centre for Railway Information Systems (CRIS)*.
   - Division Helpdesk, System version, and GIGW compliance references.

---

### How to Access

Open [index.html](file:///c:/projects/railway-block-planner/index.html) in any web browser (Google Chrome, Microsoft Edge, Firefox).
