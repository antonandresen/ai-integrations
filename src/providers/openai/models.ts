import type { ModelInfo } from '../../core/types'

/**
 * Available OpenAI models with their capabilities
 */
export const OPENAI_MODELS: Record<string, ModelInfo> = {
  'gpt-4o': {
    id: 'gpt-4o',
    provider: 'openai',
    capabilities: ['text', 'chat', 'code', 'vision'],
    contextWindow: 128000,
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    provider: 'openai',
    capabilities: ['text', 'chat', 'code', 'vision'],
    contextWindow: 128000,
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    provider: 'openai',
    capabilities: ['text', 'chat', 'code', 'vision'],
    contextWindow: 128000,
  },
  'gpt-4': {
    id: 'gpt-4',
    provider: 'openai',
    capabilities: ['text', 'chat', 'code'],
    contextWindow: 8192,
  },
  'gpt-4-vision-preview': {
    id: 'gpt-4-vision-preview',
    provider: 'openai',
    capabilities: ['text', 'chat', 'code', 'vision'],
    contextWindow: 128000,
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    provider: 'openai',
    capabilities: ['text', 'chat', 'code'],
    contextWindow: 16385,
  },
  'dall-e-3': {
    id: 'dall-e-3',
    provider: 'openai',
    capabilities: ['image'],
  },
  'text-embedding-ada-002': {
    id: 'text-embedding-ada-002',
    provider: 'openai',
    capabilities: ['embedding'],
  },
  'text-embedding-3-small': {
    id: 'text-embedding-3-small',
    provider: 'openai',
    capabilities: ['embedding'],
  },
  'text-embedding-3-large': {
    id: 'text-embedding-3-large',
    provider: 'openai',
    capabilities: ['embedding'],
  },
}

/**
 * Default model to use for each capability
 */
export const DEFAULT_MODELS = {
  text: 'gpt-3.5-turbo',
  chat: 'gpt-3.5-turbo',
  code: 'gpt-4o',
  image: 'dall-e-3',
  embedding: 'text-embedding-3-small',
}

/**
 * Get the best model for a specific capability
 */
export function getBestModelForCapability(capability: string): string {
  return (
    DEFAULT_MODELS[capability as keyof typeof DEFAULT_MODELS] ||
    DEFAULT_MODELS.chat
  )
}

/**
 * Check if a model supports a specific capability
 */
export function modelSupportsCapability(
  modelId: string,
  capability: string,
): boolean {
  const model = OPENAI_MODELS[modelId]
  if (!model) return false
  return model.capabilities.includes(capability as any)
}
