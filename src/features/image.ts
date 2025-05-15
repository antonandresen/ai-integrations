import type { BaseRequestOptions } from '../core/types'

// Use a more generic type for binary data
export type BinaryData = Uint8Array | ArrayBuffer

/**
 * Image size options
 */
export type ImageSize =
  | '256x256'
  | '512x512'
  | '1024x1024'
  | '1024x1792'
  | '1792x1024'
  | '1280x720'
  | '720x1280'
  | string

/**
 * Image quality options
 */
export type ImageQuality = 'standard' | 'hd' | string

/**
 * Image format options
 */
export type ImageFormat = 'png' | 'jpeg' | 'webp'

/**
 * Response format for image generation
 */
export type ImageResponseFormat =
  | 'url' // Return URL to the generated image
  | 'b64_json' // Return base64-encoded JSON
  | 'binary' // Return binary image data

/**
 * Options for image generation
 */
export interface ImageGenerationOptions extends BaseRequestOptions {
  /**
   * The prompt to generate images from
   */
  prompt: string

  /**
   * Negative prompt (what not to include)
   */
  negativePrompt?: string

  /**
   * Number of images to generate
   */
  n?: number

  /**
   * Size of the generated images
   */
  size?: ImageSize

  /**
   * Quality of the images
   */
  quality?: ImageQuality

  /**
   * Format to return the images in
   */
  responseFormat?: ImageResponseFormat

  /**
   * Controls randomness in generation
   */
  seed?: number

  /**
   * Controls how closely the image matches the prompt
   */
  cfgScale?: number

  /**
   * Number of diffusion steps
   */
  steps?: number

  /**
   * Image generation style
   */
  style?: string
}

/**
 * A generated image
 */
export interface GeneratedImage {
  /**
   * URL to the generated image (if responseFormat is 'url')
   */
  url?: string

  /**
   * Base64-encoded image data (if responseFormat is 'b64_json')
   */
  b64Json?: string

  /**
   * Binary image data (if responseFormat is 'binary')
   */
  binary?: BinaryData

  /**
   * Revision ID
   */
  revisionId?: string
}

/**
 * Response from an image generation request
 */
export interface ImageGenerationResponse {
  /**
   * The generated images
   */
  images: GeneratedImage[]

  /**
   * Model used for generation
   */
  model: string

  /**
   * Raw provider-specific response data
   */
  raw?: any
}

/**
 * Options for image editing
 */
export interface ImageEditOptions extends BaseRequestOptions {
  /**
   * The image to edit
   */
  image: BinaryData | string

  /**
   * The prompt describing the edit to make
   */
  prompt: string

  /**
   * Mask image where the edit should be applied
   */
  mask?: BinaryData | string

  /**
   * Size of the edited image
   */
  size?: ImageSize

  /**
   * Number of images to generate
   */
  n?: number

  /**
   * Format to return the images in
   */
  responseFormat?: ImageResponseFormat
}

/**
 * Options for image variation
 */
export interface ImageVariationOptions extends BaseRequestOptions {
  /**
   * The image to create variations of
   */
  image: BinaryData | string

  /**
   * Number of variations to generate
   */
  n?: number

  /**
   * Size of the variations
   */
  size?: ImageSize

  /**
   * Format to return the images in
   */
  responseFormat?: ImageResponseFormat
}

/**
 * Interface for image generation capability
 */
export interface ImageFeature {
  /**
   * Generate images from a text prompt
   */
  generateImage: (
    options: ImageGenerationOptions,
  ) => Promise<ImageGenerationResponse>

  /**
   * Edit an existing image according to a prompt
   */
  editImage?: (options: ImageEditOptions) => Promise<ImageGenerationResponse>

  /**
   * Create variations of an existing image
   */
  createImageVariation?: (
    options: ImageVariationOptions,
  ) => Promise<ImageGenerationResponse>
}
