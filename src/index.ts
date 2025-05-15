/**
 * ai-integrations
 * A unified API for integrating with various AI models
 */

// Core exports
export * from './core/types'
export * from './core/client'
export * from './core/errors'
export * from './core/config'
export * from './core/utils'

// Factory functions
export * from './factory'

// Provider exports
export * from './providers'

// Feature-specific exports
export * from './features/text'
export * from './features/chat'
export * from './features/code'
export * from './features/image'
export * from './features/embedding'
export * from './features/thread'

// Version information
export * from './version'
