/**
 * Utility functions for the AI integrations library
 */

import type { ModelProvider } from './types'

/**
 * Convert a provider name to an environment variable name
 */
export function providerToEnvVar(provider: ModelProvider): string {
  return `${provider.toUpperCase().replaceAll('-', '_')}_API_KEY`
}

/**
 * Format a token count to a human-readable string
 */
export function formatTokenCount(count: number): string {
  if (count < 1000) {
    return `${count} tokens`
  }
  return `${(count / 1000).toFixed(1)}k tokens`
}

/**
 * Parse a string number or undefined value
 */
export function parseNumber(
  value: string | undefined | null,
  defaultValue: number,
): number {
  if (!value) return defaultValue
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Parse a boolean string or undefined value
 */
export function parseBoolean(
  value: string | undefined | null,
  defaultValue: boolean,
): boolean {
  if (!value) return defaultValue
  return value.toLowerCase() === 'true'
}

/**
 * Get a type-safe config value with proper casting
 */
export function getConfigValue<
  T extends Record<string, any>,
  K extends keyof T,
>(config: any, key: K, defaultValue: T[K]): T[K] {
  return (config as T)[key] !== undefined ? (config as T)[key] : defaultValue
}
