import type { BaseClientConfig } from './types'

/**
 * Global configuration for the ai-integrations library
 */
export interface GlobalConfig extends BaseClientConfig {
  /**
   * Default provider to use when not specified
   */
  defaultProvider?: string

  /**
   * Enable debug logging
   */
  debug?: boolean

  /**
   * Function to use for logging
   */
  logger?: (message: string, ...args: any[]) => void
}

let globalConfig: GlobalConfig = {
  debug: false,
  logger: console.log,
}

/**
 * Set global configuration options
 */
export function configure(config: Partial<GlobalConfig>): void {
  globalConfig = { ...globalConfig, ...config }
}

/**
 * Get current global configuration
 */
export function getConfig(): GlobalConfig {
  return { ...globalConfig }
}

/**
 * Log a message if debug mode is enabled
 */
export function debug(message: string, ...args: any[]): void {
  if (globalConfig.debug && globalConfig.logger) {
    globalConfig.logger(`[ai-integrations] ${message}`, ...args)
  }
}
