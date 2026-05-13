import { clsx } from 'clsx'

/** Combines class names, filtering falsy values. */
export function cn(...args) {
  return clsx(...args)
}
