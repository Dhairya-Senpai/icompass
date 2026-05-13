/**
 * Role definitions and nav configuration.
 * Add/remove roles or nav items here without touching components.
 */

export const ROLES = {
  PARTICIPANT: 'participant',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
}

export const ROLE_META = {
  [ROLES.PARTICIPANT]: {
    label: 'Participant',
    description: 'Track interviews, complete courses, use AI tools',
    icon: 'ti-user',
    color: '#2563eb',
    colorBg: '#dbeafe',
  },
  [ROLES.INSTRUCTOR]: {
    label: 'Instructor',
    description: 'Monitor teams, review progress, manage content',
    icon: 'ti-school',
    color: '#0f766e',
    colorBg: '#ccfbf1',
  },
  [ROLES.ADMIN]: {
    label: 'Administrator',
    description: 'Full platform access, analytics, cohort management',
    icon: 'ti-shield',
    color: '#d97706',
    colorBg: '#fef3c7',
  },
}

/** Which nav sections each role can see */
export const ROLE_NAV = {
  [ROLES.PARTICIPANT]: [
    { path: '/dashboard',       icon: 'ti-home',           label: 'Dashboard'         },
    { path: '/interviews',      icon: 'ti-clipboard-list', label: 'My interviews'     },
    { path: '/courses',         icon: 'ti-book',           label: 'Learning center'   },
    { path: '/ai/hypothesis',   icon: 'ti-brain',          label: 'Hypothesis AI',    featureFlag: 'aiHypothesis' },
    { path: '/ai/analysis',     icon: 'ti-message-dots',   label: 'Interview AI',     featureFlag: 'aiAnalysis'   },
  ],
  [ROLES.INSTRUCTOR]: [
    { path: '/dashboard',       icon: 'ti-home',           label: 'Dashboard'         },
    { path: '/teams',           icon: 'ti-users',          label: 'Teams'             },
    { path: '/interviews',      icon: 'ti-clipboard-list', label: 'All interviews'    },
    { path: '/courses',         icon: 'ti-book',           label: 'Courses'           },
  ],
  [ROLES.ADMIN]: [
    { path: '/dashboard',       icon: 'ti-home',           label: 'Dashboard'         },
    { path: '/teams',           icon: 'ti-users',          label: 'Teams'             },
    { path: '/interviews',      icon: 'ti-clipboard-list', label: 'Interviews'        },
    { path: '/courses',         icon: 'ti-book',           label: 'Courses'           },
    { path: '/settings',        icon: 'ti-settings',       label: 'Settings'          },
  ],
}

/** Returns true if the role has access to a given path */
export function canAccess(role, path) {
  if (!role) return false
  const nav = ROLE_NAV[role] || []
  return nav.some(item => item.path === path)
}
