// Example of using the OpenAI client for chat completions
import { createOpenAIClient, configure } from '../src'
import { ChatMessage, MessageRole } from '../src/features/chat'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Enable debug logging
configure({
  debug: true,
})

async function main() {
  try {
    // Create an OpenAI client
    // apiKey will be loaded from OPENAI_API_KEY environment variable if not provided
    const client = createOpenAIClient()

    console.log('Starting chat with OpenAI...')

    // Example conversation
    const messages: ChatMessage[] = [
      { role: 'system' as MessageRole, content: 'You are a helpful assistant that specializes in explaining complex concepts simply.' },
      { role: 'user' as MessageRole, content: 'Can you explain quantum computing to me like I\'m 10 years old?' },
    ]

    // Send the chat completion request
    const response = await client.createChatCompletion({
      messages,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 300,
    })

    console.log('\nAssistant Response:')
    console.log('==================')
    console.log(response.message.content)
    console.log('\nModel:', response.model)

    if (response.usage) {
      console.log('\nToken Usage:')
      console.log('- Prompt tokens:', response.usage.promptTokens)
      console.log('- Completion tokens:', response.usage.completionTokens)
      console.log('- Total tokens:', response.usage.totalTokens)
    }

    // Continue the conversation
    messages.push(response.message)
    messages.push({ role: 'user' as MessageRole, content: 'Thanks! Can you give me a simple example of how it might be used?' })

    // Send another chat completion request
    const followUpResponse = await client.createChatCompletion({
      messages,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 300,
    })

    console.log('\nFollow-up Response:')
    console.log('==================')
    console.log(followUpResponse.message.content)

  } catch (error) {
    console.error('Error:', error)
  }
}

main() 