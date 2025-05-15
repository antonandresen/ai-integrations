import dotenv from 'dotenv'
// Example of creating and using OpenAI assistants
import { configure, createOpenAIClient } from '../src'

// Load environment variables from .env file
dotenv.config()

// Configure global settings (optional)
configure({
  debug: true,
})

async function main() {
  try {
    // Create an OpenAI client
    const client = createOpenAIClient()

    // First, create a new assistant
    console.log('Creating a new assistant...')
    const assistant = await client.createAssistant({
      model: 'gpt-4-turbo',
      name: 'Math Tutor',
      description: 'A helpful assistant that can answer math questions',
      instructions:
        'You are a professional math tutor. Your role is to help users understand mathematical concepts clearly and solve problems step-by-step. Always provide explanations that are easy to follow.',
    })

    console.log(`Assistant created:`)
    console.log(`- ID: ${assistant.id}`)
    console.log(`- Name: ${assistant.name}`)
    console.log(`- Model: ${assistant.model}`)

    // Create a thread for conversation
    console.log('\nCreating a new thread...')
    const thread = await client.createThread()
    console.log(`Thread created with ID: ${thread.id}`)

    // Add a question to the thread
    console.log('\nAdding a question to the thread...')
    await client.createThreadMessage({
      threadId: thread.id,
      role: 'user',
      content:
        'Can you explain how to solve a quadratic equation and provide an example?',
    })

    // Run the thread with our assistant
    console.log('\nRunning the thread with our assistant...')
    const run = await client.runThread({
      threadId: thread.id,
      assistantId: assistant.id,
    })

    console.log(`Run created with ID: ${run.id}`)
    console.log('Waiting for the assistant to respond...')

    // Wait for the run to complete
    const completedRun = await client.waitForThreadRun(thread.id, run.id, {
      pollInterval: 1000,
      timeout: 60000,
    })

    console.log(`Run completed with status: ${completedRun.status}`)

    // Get the assistant's response
    console.log("\nRetrieving the assistant's response...")
    const messages = await client.listThreadMessages(thread.id)

    console.log('\nConversation:')
    messages.reverse().forEach((message) => {
      console.log(`\n${message.role.toUpperCase()}:`)
      console.log(message.content)
    })

    // List all assistants for this account
    console.log('\nListing all assistants:')
    const assistants = await client.listAssistants(10)

    console.log(`Found ${assistants.length} assistants:`)
    assistants.forEach((assistant, index) => {
      console.log(
        `${index + 1}. ${assistant.name || 'Unnamed'} (${assistant.id})`,
      )
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
