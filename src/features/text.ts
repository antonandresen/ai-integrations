import type { BaseRequestOptions } from '../core/types'

/**
 * Options for text generation requests
 */
export interface TextGenerationOptions extends BaseRequestOptions {
  /**
   * The prompt to generate text from
   */
  prompt: string

  /**
   * Number of different completions to generate
   */
  n?: number

  /**
   * Controls randomness: 0 = deterministic, 1 = maximum randomness
   */
  temperature?: number

  /**
   * The maximum number of tokens to generate
   */
  maxTokens?: number

  /**
   * Alternative to temperature for controlling randomness
   */
  topP?: number

  /**
   * Penalize new tokens based on whether they appear in the text so far
   */
  presencePenalty?: number

  /**
   * Penalize new tokens based on their frequency in the text so far
   */
  frequencyPenalty?: number

  /**
   * Stop sequence(s) that signal the model to stop generating
   */
  stop?: string | string[]
}

/**
 * Response from a text generation request
 */
export interface TextGenerationResponse {
  /**
   * The generated text
   */
  text: string

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
 * Interface for text generation capability
 */
export interface TextGenerationFeature {
  /**
   * Generate text from a prompt
   */
  generateText: (
    options: TextGenerationOptions,
  ) => Promise<TextGenerationResponse>

  /**
   * Generate text with streaming responses
   */
  generateTextStream?: (
    options: TextGenerationOptions & { stream: true },
  ) => AsyncIterable<TextGenerationResponse>
}
