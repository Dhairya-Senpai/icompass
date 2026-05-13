import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_CONFIG } from '@/config/env'
import { SEED_DATA } from './seed'

/**
 * Root Zustand store.
 * Persisted to localStorage under APP_CONFIG.storageKey.
 * All mutations go through named actions — never mutate state directly.
 */
export const useStore = create(
  persist(
    immer((set, get) => ({
      // ── Auth / Session ──────────────────────────────────────────────────
      role: null,
      myTeamId: 1,

      // ── Domain data ─────────────────────────────────────────────────────
      cohort: SEED_DATA.cohort,
      teams: SEED_DATA.teams,
      interviews: SEED_DATA.interviews,
      courses: SEED_DATA.courses,
      notifications: SEED_DATA.notifications,

      // ── UI state (not persisted — handled in component or router) ────────
      // (intentionally minimal — UI state lives in components or URL)

      // ── Actions: Auth ────────────────────────────────────────────────────
      setRole: (role) => set(s => { s.role = role }),
      clearRole: () => set(s => { s.role = null }),

      // ── Actions: Interviews ──────────────────────────────────────────────
      addInterview: (interview) => set(s => {
        s.interviews.push({
          id: crypto.randomUUID(),
          status: 'pending',
          hypothesisValidated: null,
          createdAt: new Date().toISOString(),
          ...interview,
        })
      }),

      updateInterview: (id, patch) => set(s => {
        const idx = s.interviews.findIndex(i => i.id === id)
        if (idx !== -1) Object.assign(s.interviews[idx], patch)
      }),

      deleteInterview: (id) => set(s => {
        s.interviews = s.interviews.filter(i => i.id !== id)
      }),

      // ── Actions: Courses ─────────────────────────────────────────────────
      toggleModule: (courseId, teamId, moduleIdx) => set(s => {
        const course = s.courses.find(c => c.id === courseId)
        if (!course) return
        const completed = course.completedBy[teamId] ?? []
        course.completedBy[teamId] = completed.includes(moduleIdx)
          ? completed.filter(i => i !== moduleIdx)
          : [...completed, moduleIdx]
      }),

      // ── Actions: Teams ───────────────────────────────────────────────────
      updateHypothesis: (teamId, hypothesis) => set(s => {
        const team = s.teams.find(t => t.id === teamId)
        if (team) team.hypothesis = hypothesis
      }),

      // ── Actions: Notifications ────────────────────────────────────────────
      markNotificationRead: (id) => set(s => {
        const n = s.notifications.find(n => n.id === id)
        if (n) n.read = true
      }),
      markAllRead: () => set(s => { s.notifications.forEach(n => { n.read = true }) }),

      // ── Actions: Cohort / Settings ────────────────────────────────────────
      updateCohortSettings: (patch) => set(s => { Object.assign(s.cohort, patch) }),

      // ── Selectors (computed — call as functions) ──────────────────────────
      getTeamInterviews: (teamId) => get().interviews.filter(i => i.teamId === teamId),
      getUnreadCount: () => get().notifications.filter(n => !n.read).length,
      getTeamProgress: (teamId) => {
        const count = get().interviews.filter(i => i.teamId === teamId).length
        const goal = get().cohort.interviewGoal
        return { count, goal, pct: Math.min(100, Math.round((count / goal) * 100)) }
      },
    })),
    {
      name: APP_CONFIG.storageKey,
      storage: createJSONStorage(() => localStorage),
      // Only persist domain data, not transient UI
      partialize: (s) => ({
        role: s.role,
        myTeamId: s.myTeamId,
        cohort: s.cohort,
        teams: s.teams,
        interviews: s.interviews,
        courses: s.courses,
        notifications: s.notifications,
      }),
    }
  )
)
