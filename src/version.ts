/**
 * Version information for the ai-integrations library
 */

/**
 * Current version of the library
 */
export const VERSION = '0.0.1'

/**
 * Get user agent string for the library
 */
export function getUserAgent(): string {
  return `ai-integrations/${VERSION} Node.js/${process.versions.node}`
} 