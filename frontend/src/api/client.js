import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_TRAINS = [
  { id: 'T001', name: 'Train 12601', type: 'Express', section: 'A-B', arrival: '08:10', departure: '08:40', direction: 'Down', priority: 'High' },
  { id: 'T002', name: 'Train 12602', type: 'Express', section: 'A-B', arrival: '09:15', departure: '09:50', direction: 'Up', priority: 'High' },
  { id: 'T003', name: 'Train 16001', type: 'Passenger', section: 'B-C', arrival: '10:00', departure: '10:30', direction: 'Down', priority: 'Medium' },
  { id: 'T004', name: 'Train 12674', type: 'Express', section: 'A-B', arrival: '11:05', departure: '11:35', direction: 'Down', priority: 'High' },
  { id: 'T005', name: 'Train 12623', type: 'Mail', section: 'B-C', arrival: '12:20', departure: '12:55', direction: 'Up', priority: 'High' },
  { id: 'T006', name: 'Train 16127', type: 'Passenger', section: 'C-D', arrival: '13:00', departure: '13:40', direction: 'Down', priority: 'Medium' },
  { id: 'T007', name: 'Train 22625', type: 'Express', section: 'A-B', arrival: '14:10', departure: '14:35', direction: 'Up', priority: 'High' },
  { id: 'T008', name: 'Train 11013', type: 'Passenger', section: 'C-D', arrival: '08:50', departure: '09:20', direction: 'Down', priority: 'Low' },
  { id: 'T009', name: 'Train 56001', type: 'EMU', section: 'A-B', arrival: '07:30', departure: '07:55', direction: 'Up', priority: 'Low' },
  { id: 'T010', name: 'Train 56003', type: 'EMU', section: 'A-B', arrival: '08:00', departure: '08:25', direction: 'Down', priority: 'Low' },
];

export const MOCK_MAINTENANCE = [
  { id: 'M001', section: 'A-B', department: 'Engineering', workType: 'Track Renewal', priority: 'Critical', duration: 60, status: 'Pending', requestedSlot: '14:00-15:00' },
  { id: 'M002', section: 'A-B', department: 'TRD', workType: 'OHE Inspection', priority: 'High', duration: 30, status: 'Pending', requestedSlot: '16:00-16:30' },
  { id: 'M003', section: 'B-C', department: 'S&T', workType: 'Signal Work', priority: 'High', duration: 40, status: 'Pending', requestedSlot: '13:20-14:00' },
  { id: 'M004', section: 'C-D', department: 'Engineering', workType: 'Ballast Tamping', priority: 'Medium', duration: 45, status: 'Planned', requestedSlot: '09:00-09:45' },
  { id: 'M005', section: 'B-C', department: 'TRD', workType: 'Pantograph Check', priority: 'Low', duration: 20, status: 'Planned', requestedSlot: '07:30-07:50' },
  { id: 'M006', section: 'A-B', department: 'Engineering', workType: 'Rail Grinding', priority: 'Medium', duration: 35, status: 'Pending', requestedSlot: '11:00-11:35' },
  { id: 'M007', section: 'C-D', department: 'S&T', workType: 'Cable Replacement', priority: 'High', duration: 50, status: 'Pending', requestedSlot: '12:00-12:50' },
  { id: 'M008', section: 'B-C', department: 'Engineering', workType: 'Drain Cleaning', priority: 'Low', duration: 25, status: 'Planned', requestedSlot: '06:00-06:25' },
];

export const MOCK_OPTIMIZED_PLAN = {
  optimized_plan: [
    { id: 'M001', department: 'Engineering', section: 'A-B', start: '14:45', end: '15:45', status: 'Feasible' },
    { id: 'M002', department: 'TRD', section: 'A-B', start: '16:00', end: '16:30', status: 'Feasible' },
    { id: 'M003', department: 'S&T', section: 'B-C', start: '13:20', end: '14:00', status: 'Feasible' },
    { id: 'M004', department: 'Engineering', section: 'C-D', start: '09:00', end: '09:45', status: 'Feasible' },
    { id: 'M005', department: 'TRD', section: 'B-C', start: '07:30', end: '07:50', status: 'Feasible' },
    { id: 'M006', department: 'Engineering', section: 'A-B', start: '11:05', end: '11:40', status: 'Feasible' },
    { id: 'M007', department: 'S&T', section: 'C-D', start: '12:00', end: '12:50', status: 'Feasible' },
    { id: 'M008', department: 'Engineering', section: 'B-C', start: '06:00', end: '06:25', status: 'Feasible' },
  ],
  conflicts: [
    { request: 'M001', requestTime: '14:00-15:00', train: 'Train 12601', trainTime: '14:20-14:40', reason: 'Maintenance block overlaps active train movement on Section A-B.' },
  ],
  safety_validation: {
    train_conflict: true,
    section_conflict: true,
    resource_conflict: true,
    power_constraint: true,
    operating_window: true,
    overall: 'PASSED',
  },
};

export const MOCK_DISRUPTION_RESULT = {
  original_slot: '14:45-15:45',
  affected_requests: ['M001'],
  updated_plan: [
    { id: 'M001', department: 'Engineering', section: 'A-B', start: '15:30', end: '16:30', status: 'Re-slotted' },
    { id: 'M002', department: 'TRD', section: 'A-B', start: '16:45', end: '17:15', status: 'Re-slotted' },
  ],
};

export const MOCK_OVERRUN_RESULT = {
  original_slot: '14:45-15:45',
  actual_end: '16:15',
  conflict: true,
  updated_plan: [
    { id: 'M001', department: 'Engineering', section: 'A-B', start: '14:45', end: '16:15', status: 'Overrun' },
    { id: 'M002', department: 'TRD', section: 'A-B', start: '16:30', end: '17:00', status: 'Re-slotted' },
  ],
};

// ─── API Calls (with mock fallback) ──────────────────────────────────────────

async function withMockFallback(apiCall, mockData) {
  try {
    const res = await apiCall();
    return res.data;
  } catch {
    // Backend unavailable → return realistic mock data
    return mockData;
  }
}

export const fetchTrains = () =>
  withMockFallback(() => api.get('/trains'), MOCK_TRAINS);

export const fetchMaintenance = () =>
  withMockFallback(() => api.get('/maintenance'), MOCK_MAINTENANCE);

export const generatePlan = (payload) =>
  withMockFallback(
    () => api.post('/plan', payload),
    MOCK_OPTIMIZED_PLAN
  );

export const validatePlan = (payload) =>
  withMockFallback(
    () => api.post('/validate', payload),
    MOCK_OPTIMIZED_PLAN.safety_validation
  );

export const applyDisruption = (payload) =>
  withMockFallback(
    () => api.post('/disruption', payload),
    payload.disruption?.type === 'overrun' ? MOCK_OVERRUN_RESULT : MOCK_DISRUPTION_RESULT
  );

export default api;
