// Example of using the OpenAI client with streaming responses
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
    const client = createOpenAIClient()

    console.log('Starting streaming chat with OpenAI...\n')

    // Example conversation
    const messages: ChatMessage[] = [
      {
        role: 'system' as MessageRole,
        content: 'You are a helpful assistant that provides detailed explanations. Break your answers into clear paragraphs.'
      },
      {
        role: 'user' as MessageRole,
        content: 'Write a short story about a robot discovering human emotions for the first time.'
      },
    ]

    console.log('Assistant: ')

    // Get the streaming response
    const stream = client.createChatCompletionStream({
      messages,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 500,
      stream: true,
    })

    // Process the stream chunks as they arrive
    let lastContent = ''
    for await (const chunk of stream) {
      // Extract only the new content
      const newContent = chunk.message.content.substring(lastContent.length)

      // Print the new content (without a newline to allow continuous output)
      process.stdout.write(newContent)

      // Update the last content
      lastContent = chunk.message.content
    }

    console.log('\n\nStreaming complete!')
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 