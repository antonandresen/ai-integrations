import { getConfig } from './core/config'
import { InvalidRequestError } from './core/errors'
import { OpenAIClient } from './providers/openai'
import type { BaseClientConfig, ProviderConfig } from './core/types'

// Type for the client constructor function
type ClientConstructor<T> = new (config: BaseClientConfig) => T

// Map of provider names to their client constructors
const providerClients: Record<string, ClientConstructor<any>> = {
  openai: OpenAIClient,
  // Add more providers as they are implemented
  // anthropic: AnthropicClient,
  // google: GoogleClient,
  // mistral: MistralClient,
}

/**
 * Register a new provider client constructor
 */
export function registerProvider<T>(
  provider: string,
  ClientClass: ClientConstructor<T>,
): void {
  providerClients[provider.toLowerCase()] = ClientClass
}

/**
 * Check if a provider is available
 */
export function hasProvider(provider: string): boolean {
  return !!providerClients[provider.toLowerCase()]
}

/**
 * Get all available providers
 */
export function getAvailableProviders(): string[] {
  return Object.keys(providerClients)
}

/**
 * Create a client for a specific AI provider
 */
export function createClient<T>(config: ProviderConfig): T {
  const { provider, ...clientConfig } = config

  if (!provider) {
    const defaultProvider = getConfig().defaultProvider
    if (!defaultProvider) {
      throw new InvalidRequestError(
        'Provider must be specified in config or set as default',
      )
    }
    return createClient({ ...config, provider: defaultProvider })
  }

  const ClientClass = providerClients[provider.toLowerCase()]

  if (!ClientClass) {
    throw new InvalidRequestError(`Provider '${provider}' is not supported`)
  }

  return new ClientClass(clientConfig) as T
}

/**
 * Create an OpenAI client
 */
export function createOpenAIClient(
  config: BaseClientConfig = {},
): OpenAIClient {
  return createClient<OpenAIClient>({ ...config, provider: 'openai' })
}

/**
 * Create a client for the default provider
 */
export function createDefaultClient<T>(config: BaseClientConfig = {}): T {
  const defaultProvider = getConfig().defaultProvider || 'openai'
  return createClient<T>({ ...config, provider: defaultProvider })
}
