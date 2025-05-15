import type { BaseRequestOptions } from '../core/types'

/**
 * Message role in a conversation
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'function' | 'tool'

/**
 * A message in a conversation
 */
export interface ChatMessage {
  /**
   * The role of the message author
   */
  role: MessageRole

  /**
   * The content of the message
   */
  content: string

  /**
   * Optional name of the author
   */
  name?: string

  /**
   * Function call details if applicable
   */
  functionCall?: {
    name: string
    arguments: string
  }

  /**
   * Tool call details if applicable
   */
  toolCalls?: {
    id: string
    type: string
    function?: {
      name: string
      arguments: string
    }
  }[]
}

/**
 * Function definition for function calling
 */
export interface FunctionDefinition {
  /**
   * Name of the function
   */
  name: string

  /**
   * Description of what the function does
   */
  description?: string

  /**
   * Parameters in JSON Schema format
   */
  parameters?: Record<string, any>
}

/**
 * Tool definition
 */
export interface ToolDefinition {
  /**
   * Type of tool
   */
  type: 'function'

  /**
   * Function definition
   */
  function: FunctionDefinition
}

/**
 * Options for chat completion
 */
export interface ChatCompletionOptions extends BaseRequestOptions {
  /**
   * The messages in the conversation
   */
  messages: ChatMessage[]

  /**
   * Available functions that the model can call
   */
  functions?: FunctionDefinition[]

  /**
   * Controls function calling behavior
   */
  functionCall?: 'auto' | 'none' | { name: string }

  /**
   * Available tools that the model can use
   */
  tools?: ToolDefinition[]

  /**
   * Controls tool usage behavior
   */
  toolChoice?:
    | 'auto'
    | 'none'
    | { type: 'function'; function: { name: string } }

  /**
   * Number of chat completion choices to generate
   */
  n?: number

  /**
   * Controls output randomness
   */
  temperature?: number

  /**
   * Alternative to temperature for controlling randomness
   */
  topP?: number

  /**
   * Sequences where the API will stop generating
   */
  stop?: string | string[]
}

/**
 * Response from a chat completion request
 */
export interface ChatCompletionResponse {
  /**
   * The generated message
   */
  message: ChatMessage

  /**
   * Model used for generation
   */
  model: string

  /**
   * Token usage information
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  /**
   * Raw provider-specific response data
   */
  raw?: any
}

/**
 * Interface for chat completion capability
 */
export interface ChatCompletionFeature {
  /**
   * Generate a response in a conversation
   */
  createChatCompletion: (
    options: ChatCompletionOptions,
  ) => Promise<ChatCompletionResponse>

  /**
   * Generate a response with streaming
   */
  createChatCompletionStream?: (
    options: ChatCompletionOptions & { stream: true },
  ) => AsyncIterable<ChatCompletionResponse>
}
