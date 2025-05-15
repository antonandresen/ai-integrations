import type { BaseClientConfig } from '../../core/types'

/**
 * Configuration for OpenAI client
 */
export interface OpenAIClientConfig extends BaseClientConfig {
  /**
   * OpenAI organization ID
   */
  organization?: string

  /**
   * OpenAI beta features to enable
   */
  beta?: string[]
}

/**
 * OpenAI API error response
 */
export interface OpenAIErrorResponse {
  error: {
    message: string
    type: string
    param?: string
    code?: string
  }
}

/**
 * OpenAI model list response
 */
export interface OpenAIModelListResponse {
  data: OpenAIModel[]
  object: string
}

/**
 * OpenAI model information
 */
export interface OpenAIModel {
  id: string
  object: string
  created: number
  owned_by: string
}

/**
 * OpenAI chat message
 */
export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  content: string | null
  name?: string
  function_call?: {
    name: string
    arguments: string
  }
  tool_calls?: {
    id: string
    type: string
    function: {
      name: string
      arguments: string
    }
  }[]
}

/**
 * OpenAI chat completion request
 */
export interface OpenAIChatCompletionRequest {
  model: string
  messages: OpenAIChatMessage[]
  functions?: {
    name: string
    description?: string
    parameters?: Record<string, any>
  }[]
  function_call?: 'auto' | 'none' | { name: string }
  tools?: {
    type: 'function'
    function: {
      name: string
      description?: string
      parameters?: Record<string, any>
    }
  }[]
  tool_choice?:
  | 'auto'
  | 'none'
  | { type: 'function'; function: { name: string } }
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  stop?: string | string[]
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  logit_bias?: Record<string, number>
  user?: string
}

/**
 * OpenAI chat completion response
 */
export interface OpenAIChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: OpenAIChatMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
