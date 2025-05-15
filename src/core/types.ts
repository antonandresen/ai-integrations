/**
 * Core type definitions for AI integrations
 */

// Common types for all AI models
export type ModelProvider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'mistral'
  | 'cohere'
  | 'llama'
  | 'huggingface'
  | 'azure-openai'
  | 'replicate'
  | 'stability'
  | string

export type ModelCapability =
  | 'text'
  | 'chat'
  | 'code'
  | 'image'
  | 'embedding'
  | 'audio-transcription'
  | 'audio-generation'
  | 'vision'

// Base configuration interfaces
export interface BaseClientConfig {
  apiKey?: string
  baseUrl?: string
  headers?: Record<string, string>
  timeout?: number
  maxRetries?: number
  defaultModel?: string
}

export interface ProviderConfig extends BaseClientConfig {
  provider: ModelProvider
}

// Response types
export interface ApiResponse<T> {
  data: T
  status: number
  headers?: Record<string, string>
}

// Request options
export interface RequestOptions {
  signal?: AbortSignal
  headers?: Record<string, string>
}

// Base model interfaces
export interface ModelInfo {
  id: string
  provider: ModelProvider
  capabilities: ModelCapability[]
  contextWindow?: number
  tokenLimit?: number
  pricingInfo?: {
    inputPrice?: number
    outputPrice?: number
    currency?: string
  }
}

// Events and streaming
export type EventCallback<T> = (event: T) => void | Promise<void>

export interface StreamEvents {
  data: (chunk: any) => void
  error: (error: Error) => void
  end: () => void
}

// Common options for all AI requests
export interface BaseRequestOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  streamCallback?: EventCallback<any>
  requestOptions?: RequestOptions
}
