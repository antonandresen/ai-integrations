/// <reference types="axios" />
/// <reference types="eventsource-parser" />

import axios from 'axios'
import { createParser, type ParsedEvent, type ReconnectInterval } from 'eventsource-parser'
import { BaseClient } from '../../core/client'
import { debug } from '../../core/config'
import { UnsupportedCapabilityError } from '../../core/errors'
import { getConfigValue } from '../../core/utils'
import type {
  ChatCompletionFeature,
  ChatCompletionOptions,
  ChatCompletionResponse,
  ChatMessage,
} from '../../features/chat'
import type {
  CodeFeature,
  CodeGenerationOptions,
  CodeGenerationResponse,
} from '../../features/code'
import type {
  EmbeddingFeature,
  EmbeddingOptions,
  EmbeddingResponse,
} from '../../features/embedding'
import type {
  ImageFeature,
  ImageGenerationOptions,
  ImageGenerationResponse,
} from '../../features/image'
import type {
  TextGenerationFeature,
  TextGenerationOptions,
  TextGenerationResponse,
} from '../../features/text'
import type {
  Thread,
  ThreadCreateOptions,
  ThreadFeature,
  ThreadMessage,
  ThreadMessageCreateOptions,
  ThreadRun,
  ThreadRunOptions,
  Assistant,
  AssistantCreateOptions,
} from '../../features/thread'
import { getBestModelForCapability, modelSupportsCapability } from './models'
import type { OpenAIClientConfig } from './types'

/**
 * OpenAI API client with support for text, chat, image, embedding, and code generation
 */
export class OpenAIClient
  extends BaseClient
  implements
  TextGenerationFeature,
  ChatCompletionFeature,
  ImageFeature,
  EmbeddingFeature,
  CodeFeature,
  ThreadFeature {
  constructor(config: OpenAIClientConfig = {}) {
    super('openai', config)
  }

  /**
   * Generate text from a prompt
   */
  async generateText(
    options: TextGenerationOptions,
  ): Promise<TextGenerationResponse> {
    // Ensure API key is present
    this.validateApiKey()

    // Use text generation via chat API which is more reliable
    const model = options.model || getBestModelForCapability('text')

    // Verify the model supports text generation
    if (!modelSupportsCapability(model, 'text')) {
      throw new UnsupportedCapabilityError('text', model, this.provider)
    }

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(options.requestOptions),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      // Build the request body
      const requestBody = {
        model,
        messages: [
          {
            role: 'user',
            content: options.prompt,
          },
        ],
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        presence_penalty: options.presencePenalty,
        frequency_penalty: options.frequencyPenalty,
        stop: options.stop,
        n: options.n || 1,
        stream: false,
      }

      debug(`OpenAI text generation request: ${JSON.stringify(requestBody)}`)

      // Make API call to OpenAI
      const response = await axios.post(
        this.getBaseUrl('chat/completions'),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          signal: options.requestOptions?.signal,
        },
      )

      const responseData = response.data
      debug(`OpenAI text generation response: ${JSON.stringify(responseData)}`)

      // Extract the text from the response
      return {
        text: responseData.choices[0].message.content,
        model: responseData.model,
        usage: responseData.usage
          ? {
            promptTokens: responseData.usage.prompt_tokens,
            completionTokens: responseData.usage.completion_tokens,
            totalTokens: responseData.usage.total_tokens,
          }
          : undefined,
        raw: responseData,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Generate a response in a conversation
   */
  async createChatCompletion(
    options: ChatCompletionOptions,
  ): Promise<ChatCompletionResponse> {
    // Ensure API key is present
    this.validateApiKey()

    // Use chat model
    const model = options.model || getBestModelForCapability('chat')

    // Verify the model supports chat
    if (!modelSupportsCapability(model, 'chat')) {
      throw new UnsupportedCapabilityError('chat', model, this.provider)
    }

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(options.requestOptions),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      // Map our generic tools/functions format to OpenAI's format
      const requestBody: any = {
        model,
        messages: options.messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        stop: options.stop,
        n: options.n || 1,
        stream: false,
      }

      // Handle function calling features
      if (options.functions?.length) {
        requestBody.functions = options.functions

        if (options.functionCall) {
          requestBody.function_call = options.functionCall
        }
      }

      // Handle tool calling features
      if (options.tools?.length) {
        requestBody.tools = options.tools

        if (options.toolChoice) {
          requestBody.tool_choice = options.toolChoice
        }
      }

      debug(`OpenAI chat completion request: ${JSON.stringify(requestBody)}`)

      // Make API call to OpenAI
      const response = await axios.post(
        this.getBaseUrl('chat/completions'),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          signal: options.requestOptions?.signal,
        },
      )

      const responseData = response.data
      debug(`OpenAI chat completion response: ${JSON.stringify(responseData)}`)

      // Extract the message from the response
      return {
        message: responseData.choices[0].message,
        model: responseData.model,
        usage: responseData.usage
          ? {
            promptTokens: responseData.usage.prompt_tokens,
            completionTokens: responseData.usage.completion_tokens,
            totalTokens: responseData.usage.total_tokens,
          }
          : undefined,
        raw: responseData,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Generate images from a text prompt
   */
  async generateImage(
    options: ImageGenerationOptions,
  ): Promise<ImageGenerationResponse> {
    // Placeholder for the actual implementation
    // Will make API call to OpenAI images endpoint
    throw new Error('Method not implemented.')
  }

  /**
   * Generate embeddings from text
   */
  async createEmbedding(options: EmbeddingOptions): Promise<EmbeddingResponse> {
    // Ensure API key is present
    this.validateApiKey()

    // Use embedding model
    const model = options.model || getBestModelForCapability('embedding')

    // Verify the model supports embeddings
    if (!modelSupportsCapability(model, 'embedding')) {
      throw new UnsupportedCapabilityError('embedding', model, this.provider)
    }

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(options.requestOptions),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      // Build the request body
      const requestBody = {
        model,
        input: options.input,
        dimensions: options.dimensions,
        user: options.user,
      }

      debug(`OpenAI embedding request: ${JSON.stringify(requestBody)}`)

      // Make API call to OpenAI
      const response = await axios.post(
        this.getBaseUrl('embeddings'),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          signal: options.requestOptions?.signal,
        },
      )

      const responseData = response.data
      debug(`OpenAI embedding response: ${JSON.stringify({
        ...responseData,
        data: responseData?.data ? `[${responseData.data.length} embeddings]` : undefined,
      })}`)

      // Format the response
      return {
        data: responseData.data.map((item: any, index: number) => ({
          embedding: item.embedding,
          index,
          // If input was a string array, include the original text
          ...(Array.isArray(options.input) && index < options.input.length
            ? { text: options.input[index] }
            : {}),
        })),
        model: responseData.model,
        usage: responseData.usage
          ? {
            promptTokens: responseData.usage.prompt_tokens,
            totalTokens: responseData.usage.total_tokens,
          }
          : undefined,
        raw: responseData,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Generate code from a prompt
   */
  async generateCode(
    options: CodeGenerationOptions,
  ): Promise<CodeGenerationResponse> {
    // Implement code generation using chat completion with system prompt
    const systemPrompt = `You are an expert programmer. Generate only code in ${options.language || 'the appropriate language'} without explanation.${options.context ? ' Consider the following context: ' + options.context : ''}`;

    try {
      const chatResponse = await this.createChatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: options.prompt },
        ],
        model: options.model || getBestModelForCapability('code'),
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        topP: options.topP,
        stop: options.stop,
      });

      return {
        code: chatResponse.message.content,
        language: options.language || 'unknown',
        model: chatResponse.model,
        usage: chatResponse.usage,
        raw: chatResponse.raw,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get the default base URL for OpenAI
   */
  protected getDefaultBaseUrl(): string {
    return 'https://api.openai.com/v1'
  }

  /**
   * Generate a response with streaming
   */
  async *createChatCompletionStream(
    options: ChatCompletionOptions & { stream: true },
  ): AsyncIterable<ChatCompletionResponse> {
    // Ensure API key is present
    this.validateApiKey()

    // Use chat model
    const model = options.model || getBestModelForCapability('chat')

    // Verify the model supports chat
    if (!modelSupportsCapability(model, 'chat')) {
      throw new UnsupportedCapabilityError('chat', model, this.provider)
    }

    const headers: Record<string, string> = {
      ...this.getHeaders(options.requestOptions),
    }

    if (this.config.apiKey) {
      headers.Authorization = `Bearer ${this.config.apiKey}`
    }

    const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
      this.config,
      'organization',
      undefined
    )

    if (organization) {
      headers['OpenAI-Organization'] = organization
    }

    // Map our generic tools/functions format to OpenAI's format
    const requestBody: any = {
      model,
      messages: options.messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      stop: options.stop,
      n: 1, // Stream only supports n=1
      stream: true,
    }

    // Handle function calling features
    if (options.functions?.length) {
      requestBody.functions = options.functions

      if (options.functionCall) {
        requestBody.function_call = options.functionCall
      }
    }

    // Handle tool calling features
    if (options.tools?.length) {
      requestBody.tools = options.tools

      if (options.toolChoice) {
        requestBody.tool_choice = options.toolChoice
      }
    }

    debug(`OpenAI chat completion stream request: ${JSON.stringify(requestBody)}`)

    try {
      const response = await axios.post(
        this.getBaseUrl('chat/completions'),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          responseType: 'stream',
          signal: options.requestOptions?.signal,
        },
      )

      // Create a message content accumulator
      let accumulatedMessage: ChatMessage = {
        role: 'assistant',
        content: '',
      }

      // Parse the streaming response
      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data

          // The stream has ended
          if (data === '[DONE]') {
            return
          }

          try {
            const json = JSON.parse(data)
            const delta = json.choices[0]?.delta

            // Accumulate content if it exists
            if (delta?.content) {
              accumulatedMessage.content += delta.content
            }

            // Handle function calls or tool calls
            if (delta?.function_call) {
              accumulatedMessage.functionCall = accumulatedMessage.functionCall || {
                name: '',
                arguments: ''
              }

              if (delta.function_call.name) {
                accumulatedMessage.functionCall.name += delta.function_call.name
              }

              if (delta.function_call.arguments) {
                accumulatedMessage.functionCall.arguments += delta.function_call.arguments
              }
            }

            if (delta?.tool_calls) {
              accumulatedMessage.toolCalls = accumulatedMessage.toolCalls || []

              delta.tool_calls.forEach((toolCall: any, index: number) => {
                if (!accumulatedMessage.toolCalls![index]) {
                  accumulatedMessage.toolCalls![index] = {
                    id: toolCall.id || '',
                    type: toolCall.type || '',
                    function: toolCall.function ? {
                      name: toolCall.function.name || '',
                      arguments: toolCall.function.arguments || '',
                    } : undefined,
                  }
                } else {
                  if (toolCall.id) {
                    accumulatedMessage.toolCalls![index].id = toolCall.id
                  }
                  if (toolCall.type) {
                    accumulatedMessage.toolCalls![index].type = toolCall.type
                  }
                  if (toolCall.function) {
                    accumulatedMessage.toolCalls![index].function = accumulatedMessage.toolCalls![index].function || {
                      name: '',
                      arguments: '',
                    }
                    if (toolCall.function.name) {
                      accumulatedMessage.toolCalls![index].function!.name += toolCall.function.name
                    }
                    if (toolCall.function.arguments) {
                      accumulatedMessage.toolCalls![index].function!.arguments += toolCall.function.arguments
                    }
                  }
                }
              })
            }

            // Create a response object
            const streamResponse: ChatCompletionResponse = {
              message: { ...accumulatedMessage },
              model,
              raw: json,
            }

            return streamResponse
          } catch (error) {
            debug(`Error parsing stream: ${error}`)
            return undefined
          }
        }
      })

      // Handle the stream data
      for await (const chunk of response.data) {
        const parsedChunk = parser.feed(chunk.toString())
        if (parsedChunk) {
          yield parsedChunk
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Create a new thread
   */
  async createThread(options: ThreadCreateOptions = {}): Promise<Thread> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(options.requestOptions),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      const requestBody: any = {
        metadata: options.metadata || {},
      }

      // Add messages if provided
      if (options.messages?.length) {
        requestBody.messages = options.messages.map(message => ({
          role: message.role,
          content: message.content,
          file_ids: message.fileIds || [],
          metadata: message.metadata || {},
        }))
      }

      debug(`OpenAI create thread request: ${JSON.stringify(requestBody)}`)

      // Make API call to OpenAI
      const response = await axios.post(
        this.getBaseUrl('threads'),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          signal: options.requestOptions?.signal,
        },
      )

      const responseData = response.data
      debug(`OpenAI create thread response: ${JSON.stringify(responseData)}`)

      return {
        id: responseData.id,
        object: responseData.object,
        createdAt: responseData.created_at,
        metadata: responseData.metadata,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Retrieve a thread
   */
  async getThread(threadId: string): Promise<Thread> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      // Make API call to OpenAI
      const response = await axios.get(
        this.getBaseUrl(`threads/${threadId}`),
        {
          headers,
          timeout: this.config.timeout,
        }
      )

      const responseData = response.data
      debug(`OpenAI get thread response: ${JSON.stringify(responseData)}`)

      return {
        id: responseData.id,
        object: responseData.object,
        createdAt: responseData.created_at,
        metadata: responseData.metadata,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Add a message to a thread
   */
  async createThreadMessage(options: ThreadMessageCreateOptions): Promise<ThreadMessage> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(options.requestOptions),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      const requestBody: any = {
        role: options.role,
        content: options.content,
        file_ids: options.fileIds || [],
        metadata: options.metadata || {},
      }

      debug(`OpenAI create thread message request: ${JSON.stringify(requestBody)}`)

      // Make API call to OpenAI
      const response = await axios.post(
        this.getBaseUrl(`threads/${options.threadId}/messages`),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          signal: options.requestOptions?.signal,
        },
      )

      const responseData = response.data
      debug(`OpenAI create thread message response: ${JSON.stringify(responseData)}`)

      return {
        role: responseData.role,
        content: responseData.content[0].text.value,
        fileIds: responseData.file_ids || [],
        metadata: responseData.metadata,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * List messages in a thread
   */
  async listThreadMessages(threadId: string): Promise<ThreadMessage[]> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      // Make API call to OpenAI
      const response = await axios.get(
        this.getBaseUrl(`threads/${threadId}/messages`),
        {
          headers,
          timeout: this.config.timeout,
        }
      )

      const responseData = response.data
      debug(`OpenAI list thread messages response: ${JSON.stringify(responseData)}`)

      return responseData.data.map((message: any) => ({
        role: message.role,
        content: message.content[0].text.value,
        fileIds: message.file_ids || [],
        metadata: message.metadata,
      }))
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Run a thread with an assistant
   */
  async runThread(options: ThreadRunOptions): Promise<ThreadRun> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(options.requestOptions),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      const requestBody: any = {
        assistant_id: options.assistantId,
        metadata: options.metadata || {},
      }

      // Add optional parameters if provided
      if (options.model) {
        requestBody.model = options.model
      }

      if (options.instructions) {
        requestBody.instructions = options.instructions
      }

      if (options.tools) {
        requestBody.tools = options.tools
      }

      debug(`OpenAI run thread request: ${JSON.stringify(requestBody)}`)

      // Make API call to OpenAI
      const response = await axios.post(
        this.getBaseUrl(`threads/${options.threadId}/runs`),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          signal: options.requestOptions?.signal,
        },
      )

      const responseData = response.data
      debug(`OpenAI run thread response: ${JSON.stringify(responseData)}`)

      return {
        id: responseData.id,
        object: responseData.object,
        threadId: responseData.thread_id,
        assistantId: responseData.assistant_id,
        status: responseData.status,
        createdAt: responseData.created_at,
        completedAt: responseData.completed_at,
        metadata: responseData.metadata,
        raw: responseData,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Retrieve a thread run
   */
  async getThreadRun(threadId: string, runId: string): Promise<ThreadRun> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      // Make API call to OpenAI
      const response = await axios.get(
        this.getBaseUrl(`threads/${threadId}/runs/${runId}`),
        {
          headers,
          timeout: this.config.timeout,
        }
      )

      const responseData = response.data
      debug(`OpenAI get thread run response: ${JSON.stringify(responseData)}`)

      return {
        id: responseData.id,
        object: responseData.object,
        threadId: responseData.thread_id,
        assistantId: responseData.assistant_id,
        status: responseData.status,
        createdAt: responseData.created_at,
        completedAt: responseData.completed_at,
        metadata: responseData.metadata,
        raw: responseData,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Wait for a thread run to complete
   */
  async waitForThreadRun(
    threadId: string,
    runId: string,
    options: { pollInterval?: number; timeout?: number } = {}
  ): Promise<ThreadRun> {
    const pollInterval = options.pollInterval || 1000
    const timeout = options.timeout || 60000
    const startTime = Date.now()

    let run = await this.getThreadRun(threadId, runId)

    while (
      ['queued', 'in_progress'].includes(run.status) &&
      Date.now() - startTime < timeout
    ) {
      // Wait for the specified interval
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      // Check the run status again
      run = await this.getThreadRun(threadId, runId)
    }

    if (['queued', 'in_progress'].includes(run.status)) {
      throw new Error(`Thread run timed out after ${timeout}ms`)
    }

    return run
  }

  /**
   * Create a new assistant
   */
  async createAssistant(options: AssistantCreateOptions): Promise<Assistant> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(options.requestOptions),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      const requestBody: any = {
        model: options.model,
        name: options.name,
        description: options.description,
        instructions: options.instructions,
        tools: options.tools || [],
        file_ids: options.fileIds || [],
        metadata: options.metadata || {},
      }

      debug(`OpenAI create assistant request: ${JSON.stringify(requestBody)}`)

      // Make API call to OpenAI
      const response = await axios.post(
        this.getBaseUrl('assistants'),
        requestBody,
        {
          headers,
          timeout: this.config.timeout,
          signal: options.requestOptions?.signal,
        },
      )

      const responseData = response.data
      debug(`OpenAI create assistant response: ${JSON.stringify(responseData)}`)

      return {
        id: responseData.id,
        object: responseData.object,
        createdAt: responseData.created_at,
        name: responseData.name,
        description: responseData.description,
        model: responseData.model,
        instructions: responseData.instructions,
        tools: responseData.tools,
        fileIds: responseData.file_ids || [],
        metadata: responseData.metadata || {},
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Retrieve an assistant
   */
  async getAssistant(assistantId: string): Promise<Assistant> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      // Make API call to OpenAI
      const response = await axios.get(
        this.getBaseUrl(`assistants/${assistantId}`),
        {
          headers,
          timeout: this.config.timeout,
        }
      )

      const responseData = response.data
      debug(`OpenAI get assistant response: ${JSON.stringify(responseData)}`)

      return {
        id: responseData.id,
        object: responseData.object,
        createdAt: responseData.created_at,
        name: responseData.name,
        description: responseData.description,
        model: responseData.model,
        instructions: responseData.instructions,
        tools: responseData.tools,
        fileIds: responseData.file_ids || [],
        metadata: responseData.metadata || {},
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * List all assistants
   */
  async listAssistants(limit: number = 20): Promise<Assistant[]> {
    // Ensure API key is present
    this.validateApiKey()

    try {
      const headers: Record<string, string> = {
        ...this.getHeaders(),
      }

      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }

      const organization = getConfigValue<OpenAIClientConfig, 'organization'>(
        this.config,
        'organization',
        undefined
      )

      if (organization) {
        headers['OpenAI-Organization'] = organization
      }

      // Make API call to OpenAI
      const response = await axios.get(
        this.getBaseUrl(`assistants?limit=${limit}`),
        {
          headers,
          timeout: this.config.timeout,
        }
      )

      const responseData = response.data
      debug(`OpenAI list assistants response: ${JSON.stringify(responseData)}`)

      return responseData.data.map((assistant: any) => ({
        id: assistant.id,
        object: assistant.object,
        createdAt: assistant.created_at,
        name: assistant.name,
        description: assistant.description,
        model: assistant.model,
        instructions: assistant.instructions,
        tools: assistant.tools,
        fileIds: assistant.file_ids || [],
        metadata: assistant.metadata || {},
      }))
    } catch (error) {
      return this.handleError(error)
    }
  }
}
