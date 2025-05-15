import { getUserAgent } from '../version'
import { AIIntegrationsError, AuthenticationError } from './errors'
import type { BaseClientConfig, ModelProvider, RequestOptions } from './types'

/**
 * Base client for all AI integrations
 */
export abstract class BaseClient {
  protected readonly config: BaseClientConfig
  readonly provider: ModelProvider

  constructor(provider: ModelProvider, config: BaseClientConfig = {}) {
    this.provider = provider
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      headers: config.headers || {},
      timeout: config.timeout || 60000,
      maxRetries: config.maxRetries || 3,
      defaultModel: config.defaultModel,
    }

    if (!this.config.apiKey) {
      this.config.apiKey = this.getApiKeyFromEnv()
    }
  }

  /**
   * Attempt to get API key from environment variables based on provider
   */
  protected getApiKeyFromEnv(): string | undefined {
    // Check provider-specific env variable first (e.g., OPENAI_API_KEY)
    const providerKey =
      process.env[`${this.provider.toUpperCase().replaceAll('-', '_')}_API_KEY`]
    if (providerKey) return providerKey

    // Fallback to generic AI_INTEGRATIONS_API_KEY
    return process.env.AI_INTEGRATIONS_API_KEY
  }

  /**
   * Validate that API key is present before making requests
   */
  protected validateApiKey(): void {
    if (!this.config.apiKey) {
      throw new AuthenticationError(
        `API key is required for ${this.provider}. Set it in the client config or as an environment variable.`,
      )
    }
  }

  /**
   * Merge default headers with request-specific headers
   */
  protected getHeaders(options?: RequestOptions): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'User-Agent': getUserAgent(),
      ...this.config.headers,
      ...options?.headers,
    }
  }

  /**
   * Handle request errors consistently across providers
   */
  protected handleError(error: any): never {
    if (error instanceof AIIntegrationsError) {
      throw error
    }

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 401) {
        throw new AuthenticationError('Invalid API key or unauthorized')
      }

      throw new AIIntegrationsError(
        `API error ${status}: ${data?.error?.message || JSON.stringify(data)}`,
        {
          status,
          data,
          provider: this.provider,
        },
      )
    }

    throw new AIIntegrationsError(`Network error: ${error.message}`, {
      provider: this.provider,
      cause: error,
    })
  }

  /**
   * Get the provider's base URL with proper endpoint
   */
  protected getBaseUrl(endpoint: string): string {
    const baseUrl = this.config.baseUrl || this.getDefaultBaseUrl()
    return `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
  }

  /**
   * Get default base URL for the provider
   */
  protected abstract getDefaultBaseUrl(): string
}
