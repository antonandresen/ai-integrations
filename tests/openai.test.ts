import { beforeEach, describe, expect, test, vi } from 'vitest'
import { configure, createOpenAIClient } from '../src'

// Mock the axios module
vi.mock('axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: 'This is a test response',
            },
            finish_reason: 'stop',
          },
        ],
        model: 'gpt-4',
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      },
    }),
  },
}))

describe('OpenAI Client', () => {
  // Reset configuration before each test
  beforeEach(() => {
    configure({ debug: false })
  })

  test('should create an OpenAI client', () => {
    const client = createOpenAIClient({ apiKey: 'test-api-key' })
    expect(client).toBeDefined()
    expect(client.provider).toBe('openai')
  })

  test('should generate text using OpenAI', async () => {
    const client = createOpenAIClient({ apiKey: 'test-api-key' })
    const response = await client.generateText({
      prompt: 'Write a test prompt',
      model: 'gpt-4',
    })

    expect(response).toBeDefined()
    expect(response.text).toEqual('This is a test response')
    expect(response.model).toEqual('gpt-4')
    expect(response.usage).toBeDefined()
    expect(response.usage!.totalTokens).toEqual(30)
  })

  // Add more tests as functionality is implemented
})
