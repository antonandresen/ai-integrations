/**
 * Error types for AI integrations
 */

export interface AIIntegrationsErrorOptions {
  provider?: string
  status?: number
  data?: any
  cause?: Error
}

/**
 * Base error class for all AI integrations errors
 */
export class AIIntegrationsError extends Error {
  readonly provider?: string
  readonly status?: number
  readonly data?: any
  readonly cause?: Error

  constructor(message: string, options: AIIntegrationsErrorOptions = {}) {
    super(message)
    this.name = 'AIIntegrationsError'
    this.provider = options.provider
    this.status = options.status
    this.data = options.data
    this.cause = options.cause
  }
}

/**
 * Error for authentication failures
 */
export class AuthenticationError extends AIIntegrationsError {
  constructor(message: string, options: AIIntegrationsErrorOptions = {}) {
    super(message, { ...options, status: options.status || 401 })
    this.name = 'AuthenticationError'
  }
}

/**
 * Error for rate limiting
 */
export class RateLimitError extends AIIntegrationsError {
  readonly retryAfter?: number

  constructor(
    message: string,
    options: AIIntegrationsErrorOptions & { retryAfter?: number } = {},
  ) {
    super(message, { ...options, status: options.status || 429 })
    this.name = 'RateLimitError'
    this.retryAfter = options.retryAfter
  }
}

/**
 * Error for invalid requests
 */
export class InvalidRequestError extends AIIntegrationsError {
  constructor(message: string, options: AIIntegrationsErrorOptions = {}) {
    super(message, { ...options, status: options.status || 400 })
    this.name = 'InvalidRequestError'
  }
}

/**
 * Error for API timeouts
 */
export class TimeoutError extends AIIntegrationsError {
  constructor(
    message: string = 'Request timed out',
    options: AIIntegrationsErrorOptions = {},
  ) {
    super(message, options)
    this.name = 'TimeoutError'
  }
}

/**
 * Error for when a model doesn't support a capability
 */
export class UnsupportedCapabilityError extends AIIntegrationsError {
  readonly capability: string

  constructor(capability: string, modelId: string, provider?: string) {
    super(
      `Model ${modelId} from ${provider || 'unknown'} does not support ${capability} capability`,
      { provider },
    )
    this.name = 'UnsupportedCapabilityError'
    this.capability = capability
  }
}
