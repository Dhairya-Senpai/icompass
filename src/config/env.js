/**
 * Centralized environment configuration.
 * All VITE_* variables are validated here at startup.
 * Import from this module — never use import.meta.env directly in components.
 */

function requireEnv(key, fallback) {
  const val = import.meta.env[key]
  if (val !== undefined && val !== '') return val
  if (fallback !== undefined) return fallback
  console.warn(`[config] Missing env var: ${key}`)
  return ''
}

function boolEnv(key, fallback = true) {
  const val = import.meta.env[key]
  if (val === undefined || val === '') return fallback
  return val === 'true'
}

export const APP_CONFIG = {
  name: requireEnv('VITE_APP_NAME', 'I-Corps Platform'),
  tagline: requireEnv('VITE_APP_TAGLINE', 'Customer Discovery Platform'),
  baseUrl: requireEnv('VITE_BASE_URL', '/'),
  storageKey: requireEnv('VITE_STORAGE_KEY', 'icorps_v1'),
  interviewGoal: parseInt(requireEnv('VITE_DEFAULT_INTERVIEW_GOAL', '15'), 10),
}

export const OLLAMA_CONFIG = {
  baseUrl: requireEnv('VITE_OLLAMA_BASE_URL', 'http://localhost:11434'),
  model: requireEnv('VITE_OLLAMA_MODEL', 'llama3.2'),
  timeout: parseInt(requireEnv('VITE_OLLAMA_TIMEOUT', '60000'), 10),
}

export const FEATURES = {
  aiHypothesis: boolEnv('VITE_FEATURE_AI_HYPOTHESIS', true),
  aiAnalysis: boolEnv('VITE_FEATURE_AI_ANALYSIS', true),
  export: boolEnv('VITE_FEATURE_EXPORT', true),
}
