import dotenv from 'dotenv'
// Example of using the OpenAI client to generate text
import { configure, createOpenAIClient } from '../src'

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

    console.log('Generating text from OpenAI...')

    // Generate text
    const response = await client.generateText({
      prompt: 'Write a short poem about artificial intelligence',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 100,
    })

    console.log('\nGenerated Text:')
    console.log('==============')
    console.log(response.text)
    console.log('\nModel:', response.model)

    if (response.usage) {
      console.log('\nToken Usage:')
      console.log('- Prompt tokens:', response.usage.promptTokens)
      console.log('- Completion tokens:', response.usage.completionTokens)
      console.log('- Total tokens:', response.usage.totalTokens)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
