import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // ── Data from backend ──────────────────────────────────────────
  trains: [],
  maintenance: [],
  planResult: null,
  approvedPlan: null,
  disruptionResult: null,

  // ── UI state ───────────────────────────────────────────────────
  lang: 'EN',
  loading: {},
  planGenerated: false,
  conflictResolved: false,
  safetyPassed: false,
  planApproved: false,

  // ── Setters ────────────────────────────────────────────────────
  setLang: (lang) => set({ lang }),
  setTrains: (trains) => set({ trains }),
  setMaintenance: (maintenance) => set({ maintenance }),
  setPlanResult: (planResult) => set({ planResult, planGenerated: true }),
  setApprovedPlan: (approvedPlan) => set({ approvedPlan, planApproved: true }),
  setDisruptionResult: (disruptionResult) => set({ disruptionResult }),
  setConflictResolved: (v) => set({ conflictResolved: v }),
  setSafetyPassed: (v) => set({ safetyPassed: v }),

  setLoading: (key, val) =>
    set((state) => ({ loading: { ...state.loading, [key]: val } })),

  isLoading: (key) => get().loading[key] === true,

  resetPlan: () =>
    set({
      planResult: null,
      approvedPlan: null,
      disruptionResult: null,
      planGenerated: false,
      conflictResolved: false,
      safetyPassed: false,
      planApproved: false,
    }),
}));

export default useAppStore;
