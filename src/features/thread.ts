import type { BaseRequestOptions } from '../core/types'
import type { ChatMessage } from './chat'

/**
 * Thread creation options
 */
export interface ThreadCreateOptions extends BaseRequestOptions {
  /**
   * Optional messages to add to the thread
   */
  messages?: ThreadMessage[]

  /**
   * Optional metadata for the thread
   */
  metadata?: Record<string, string>
}

/**
 * A thread message
 */
export interface ThreadMessage {
  /**
   * Role of the message sender
   */
  role: 'user' | 'assistant'

  /**
   * Content of the message
   */
  content: string

  /**
   * Optional file IDs to attach to the message
   */
  fileIds?: string[]

  /**
   * Optional metadata for the message
   */
  metadata?: Record<string, string>
}

/**
 * Message creation options for a thread
 */
export interface ThreadMessageCreateOptions extends BaseRequestOptions {
  /**
   * The ID of the thread to add the message to
   */
  threadId: string

  /**
   * Role of the message sender
   */
  role: 'user'

  /**
   * Content of the message
   */
  content: string

  /**
   * Optional file IDs to attach to the message
   */
  fileIds?: string[]

  /**
   * Optional metadata for the message
   */
  metadata?: Record<string, string>
}

/**
 * Assistant creation options
 */
export interface AssistantCreateOptions extends BaseRequestOptions {
  /**
   * The model to use for the assistant
   */
  model: string

  /**
   * The name of the assistant
   */
  name?: string

  /**
   * The description of the assistant
   */
  description?: string

  /**
   * The instructions for the assistant
   */
  instructions?: string

  /**
   * The tools available to the assistant
   */
  tools?: any[]

  /**
   * Optional file IDs to attach to the assistant
   */
  fileIds?: string[]

  /**
   * Optional metadata for the assistant
   */
  metadata?: Record<string, string>
}

/**
 * An assistant
 */
export interface Assistant {
  /**
   * The ID of the assistant
   */
  id: string

  /**
   * The object type
   */
  object: string

  /**
   * The creation timestamp
   */
  createdAt: number

  /**
   * The name of the assistant
   */
  name: string | null

  /**
   * The description of the assistant
   */
  description: string | null

  /**
   * The model used by the assistant
   */
  model: string

  /**
   * The instructions for the assistant
   */
  instructions: string | null

  /**
   * The tools available to the assistant
   */
  tools: any[]

  /**
   * Optional file IDs attached to the assistant
   */
  fileIds: string[]

  /**
   * Optional metadata for the assistant
   */
  metadata?: Record<string, string>
}

/**
 * Thread run options
 */
export interface ThreadRunOptions extends BaseRequestOptions {
  /**
   * The ID of the thread to run
   */
  threadId: string

  /**
   * The ID of the assistant to use
   */
  assistantId: string

  /**
   * Optional model to use for the run (overrides assistant's model)
   */
  model?: string

  /**
   * Optional instructions for the run (overrides assistant's instructions)
   */
  instructions?: string

  /**
   * Optional tools to use for the run
   */
  tools?: any[]

  /**
   * Optional metadata for the run
   */
  metadata?: Record<string, string>
}

/**
 * A thread
 */
export interface Thread {
  /**
   * The ID of the thread
   */
  id: string

  /**
   * The object type
   */
  object: string

  /**
   * The creation timestamp
   */
  createdAt: number

  /**
   * Optional metadata for the thread
   */
  metadata?: Record<string, string>
}

/**
 * A thread run
 */
export interface ThreadRun {
  /**
   * The ID of the run
   */
  id: string

  /**
   * The object type
   */
  object: string

  /**
   * The ID of the thread
   */
  threadId: string

  /**
   * The ID of the assistant
   */
  assistantId: string

  /**
   * The status of the run
   */
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'expired'

  /**
   * The creation timestamp
   */
  createdAt: number

  /**
   * The completion timestamp
   */
  completedAt?: number

  /**
   * Optional metadata for the run
   */
  metadata?: Record<string, string>

  /**
   * Raw provider-specific response data
   */
  raw?: any
}

/**
 * Interface for thread management feature
 */
export interface ThreadFeature {
  /**
   * Create a new thread
   */
  createThread: (options?: ThreadCreateOptions) => Promise<Thread>

  /**
   * Retrieve a thread
   */
  getThread: (threadId: string) => Promise<Thread>

  /**
   * Add a message to a thread
   */
  createThreadMessage: (options: ThreadMessageCreateOptions) => Promise<ThreadMessage>

  /**
   * List messages in a thread
   */
  listThreadMessages: (threadId: string) => Promise<ThreadMessage[]>

  /**
   * Create a new assistant
   */
  createAssistant?: (options: AssistantCreateOptions) => Promise<Assistant>

  /**
   * Retrieve an assistant
   */
  getAssistant?: (assistantId: string) => Promise<Assistant>

  /**
   * List all assistants
   */
  listAssistants?: (limit?: number) => Promise<Assistant[]>

  /**
   * Run a thread with an assistant
   */
  runThread: (options: ThreadRunOptions) => Promise<ThreadRun>

  /**
   * Retrieve a thread run
   */
  getThreadRun: (threadId: string, runId: string) => Promise<ThreadRun>

  /**
   * Wait for a thread run to complete
   */
  waitForThreadRun: (
    threadId: string,
    runId: string,
    options?: { pollInterval?: number; timeout?: number }
  ) => Promise<ThreadRun>
} 