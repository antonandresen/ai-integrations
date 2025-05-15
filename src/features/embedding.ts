import type { BaseRequestOptions } from '../core/types'

/**
 * Input type for embedding generation
 */
export type EmbeddingInput = string | string[]

/**
 * Format of embeddings to return
 */
export type EmbeddingFormat = 'float' | 'base64'

/**
 * Options for embedding generation
 */
export interface EmbeddingOptions extends BaseRequestOptions {
  /**
   * The input text to generate embeddings for
   */
  input: EmbeddingInput

  /**
   * Dimensions of the embedding vectors
   */
  dimensions?: number

  /**
   * Format to return the embeddings in
   */
  format?: EmbeddingFormat

  /**
   * Normalize embedding vectors
   */
  normalize?: boolean

  /**
   * User identifier for tracking usage
   */
  user?: string
}

/**
 * A single embedding vector
 */
export interface EmbeddingVector {
  /**
   * The embedding values
   */
  embedding: number[]

  /**
   * Index in the batch
   */
  index: number

  /**
   * Original text that was embedded
   */
  text?: string
}

/**
 * Response from an embedding request
 */
export interface EmbeddingResponse {
  /**
   * The generated embeddings
   */
  data: EmbeddingVector[]

  /**
   * Model used for generation
   */
  model: string

  /**
   * Token usage information
   */
  usage?: {
    promptTokens: number
    totalTokens: number
  }

  /**
   * Raw provider-specific response data
   */
  raw?: any
}

/**
 * Interface for embedding generation capability
 */
export interface EmbeddingFeature {
  /**
   * Generate embeddings from text
   */
  createEmbedding: (options: EmbeddingOptions) => Promise<EmbeddingResponse>

  /**
   * Batch generate embeddings
   */
  createEmbeddingBatch?: (
    options: EmbeddingOptions & { input: string[] },
  ) => Promise<EmbeddingResponse>

  /**
   * Calculate cosine similarity between two embeddings
   */
  calculateSimilarity?: (embedding1: number[], embedding2: number[]) => number
}
