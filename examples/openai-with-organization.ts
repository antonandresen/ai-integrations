// Example of using the OpenAI client with an organization ID
import { createOpenAIClient, configure } from '../src'
import type { ChatMessage } from '../src/features/chat'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Configure global settings (optional)
configure({
  debug: true,
})

// Create an OpenAI client with organization ID
const client = createOpenAIClient({
  // API key will be loaded from OPENAI_API_KEY environment variable
  // You can also pass it explicitly: apiKey: 'YOUR_API_KEY'
  organization: process.env.OPENAI_ORGANIZATION_ID,
})

async function main() {
  try {
    // Create a chat completion
    const response = await client.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant.',
        },
        {
          role: 'user',
          content: 'Tell me a short joke about programming.',
        },
      ],
      temperature: 0.7,
    })

    console.log('Chat response:')
    console.log(response.message.content)
    console.log('\nUsage:')
    console.log(response.usage)
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 