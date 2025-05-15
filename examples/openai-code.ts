import dotenv from 'dotenv'
// Example of using the OpenAI client to generate code
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
    const client = createOpenAIClient()

    console.log('Generating code with OpenAI...')

    // Generate a React component
    const reactResponse = await client.generateCode({
      prompt:
        'Create a React component that displays a counter with increment and decrement buttons, using React hooks',
      language: 'typescript',
      model: 'gpt-4', // Using GPT-4 for better code quality
      temperature: 0.3, // Lower temperature for more deterministic output
    })

    console.log('\nReact Component:')
    console.log('===============')
    console.log(reactResponse.code)
    console.log('\nModel:', reactResponse.model)

    if (reactResponse.usage) {
      console.log('\nToken Usage:')
      console.log('- Prompt tokens:', reactResponse.usage.promptTokens)
      console.log('- Completion tokens:', reactResponse.usage.completionTokens)
      console.log('- Total tokens:', reactResponse.usage.totalTokens)
    }

    // Generate code with context
    console.log('\nGenerating algorithm with context...')
    const algoResponse = await client.generateCode({
      prompt: 'Implement a depth-first search algorithm for this graph class',
      language: 'python',
      context: `
class Graph:
    def __init__(self):
        self.graph = {}
        
    def add_edge(self, u, v):
        if u not in self.graph:
            self.graph[u] = []
        self.graph[u].append(v)
`,
      model: 'gpt-4',
      temperature: 0.2,
    })

    console.log('\nPython Algorithm:')
    console.log('================')
    console.log(algoResponse.code)
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
