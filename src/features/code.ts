import type { BaseRequestOptions } from '../core/types'

/**
 * Options for code generation
 */
export interface CodeGenerationOptions extends BaseRequestOptions {
  /**
   * The prompt or instructions for code generation
   */
  prompt: string

  /**
   * Programming language to generate code in
   */
  language?: string

  /**
   * Maximum number of tokens to generate
   */
  maxTokens?: number

  /**
   * Controls randomness: 0 = deterministic, 1 = maximum randomness
   */
  temperature?: number

  /**
   * Alternative to temperature for controlling randomness
   */
  topP?: number

  /**
   * Stop sequences that signal the model to stop generating
   */
  stop?: string | string[]

  /**
   * Optional context code to consider when generating
   */
  context?: string
}

/**
 * Response from a code generation request
 */
export interface CodeGenerationResponse {
  /**
   * The generated code
   */
  code: string

  /**
   * Language of the generated code
   */
  language: string

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
 * Options for code completion (in-context)
 */
export interface CodeCompletionOptions extends BaseRequestOptions {
  /**
   * The code to complete
   */
  code: string

  /**
   * Programming language of the code
   */
  language: string

  /**
   * Maximum number of tokens to generate
   */
  maxTokens?: number

  /**
   * Controls randomness: 0 = deterministic, 1 = maximum randomness
   */
  temperature?: number

  /**
   * Alternative to temperature for controlling randomness
   */
  topP?: number

  /**
   * Stop sequences that signal the model to stop generating
   */
  stop?: string | string[]

  /**
   * Optional line number where the completion should start
   */
  lineNumber?: number
}

/**
 * Response from a code completion request
 */
export interface CodeCompletionResponse {
  /**
   * The completed code snippet
   */
  completion: string

  /**
   * Model used for completion
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
 * Interface for code generation and completion capability
 */
export interface CodeFeature {
  /**
   * Generate code from a prompt
   */
  generateCode: (
    options: CodeGenerationOptions,
  ) => Promise<CodeGenerationResponse>

  /**
   * Complete code in-context
   */
  completeCode?: (
    options: CodeCompletionOptions,
  ) => Promise<CodeCompletionResponse>

  /**
   * Generate code with streaming response
   */
  generateCodeStream?: (
    options: CodeGenerationOptions & { stream: true },
  ) => AsyncIterable<CodeGenerationResponse>

  /**
   * Complete code with streaming response
   */
  completeCodeStream?: (
    options: CodeCompletionOptions & { stream: true },
  ) => AsyncIterable<CodeCompletionResponse>
}
