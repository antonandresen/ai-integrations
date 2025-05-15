// Example of using the OpenAI threads feature
import { createOpenAIClient, configure } from '../src'
import type { Thread, ThreadMessage, ThreadRun } from '../src/features/thread'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Configure global settings (optional)
configure({
  debug: true,
})

// Replace with your actual assistant ID
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'YOUR_ASSISTANT_ID'

async function main() {
  try {
    // Create an OpenAI client
    const client = createOpenAIClient()

    console.log('Creating a new thread...')
    const thread = await client.createThread()
    console.log(`Thread created with ID: ${thread.id}`)

    // Add a user message to the thread
    console.log('Adding a message to the thread...')
    await client.createThreadMessage({
      threadId: thread.id,
      role: 'user',
      content: 'Can you explain how quantum computing works in simple terms?',
    })

    // Run the thread with an assistant
    console.log(`Running the thread with assistant ${ASSISTANT_ID}...`)
    const run = await client.runThread({
      threadId: thread.id,
      assistantId: ASSISTANT_ID,
    })

    console.log(`Run created with ID: ${run.id} and status: ${run.status}`)

    // Wait for the run to complete
    console.log('Waiting for the run to complete...')
    const completedRun = await client.waitForThreadRun(
      thread.id,
      run.id,
      { pollInterval: 1000, timeout: 60000 }
    )

    console.log(`Run completed with status: ${completedRun.status}`)

    // List messages in the thread to see the assistant's response
    console.log('Retrieving messages from the thread...')
    const messages = await client.listThreadMessages(thread.id)

    console.log('\nConversation:')
    messages.reverse().forEach((message) => {
      console.log(`\n${message.role.toUpperCase()}:`)
      console.log(message.content)
    })

  } catch (error) {
    console.error('Error:', error)
  }
}

main() 