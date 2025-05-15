// Example of using the OpenAI client to generate embeddings
import { createOpenAIClient, configure } from '../src'
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

    console.log('Generating embeddings from OpenAI...')

    // Generate embeddings for a single text
    const singleEmbedding = await client.createEmbedding({
      input: 'The quick brown fox jumps over the lazy dog',
      model: 'text-embedding-3-small',
    })

    console.log('\nSingle Embedding:')
    console.log('================')
    console.log(`Model: ${singleEmbedding.model}`)
    console.log(`Dimensions: ${singleEmbedding.data[0].embedding.length}`)
    console.log(`First 5 values: ${singleEmbedding.data[0].embedding.slice(0, 5)}`)

    if (singleEmbedding.usage) {
      console.log(`Tokens: ${singleEmbedding.usage.totalTokens}`)
    }

    // Generate embeddings for multiple texts
    const batchEmbedding = await client.createEmbedding({
      input: [
        'The quick brown fox jumps over the lazy dog',
        'The five boxing wizards jump quickly',
        'How vexingly quick daft zebras jump',
      ],
      model: 'text-embedding-3-small',
    })

    console.log('\nBatch Embeddings:')
    console.log('================')
    console.log(`Count: ${batchEmbedding.data.length}`)
    console.log(`Model: ${batchEmbedding.model}`)

    for (let i = 0; i < batchEmbedding.data.length; i++) {
      const embedding = batchEmbedding.data[i]
      console.log(`\nEmbedding #${i + 1}:`)
      console.log(`- Text: ${embedding.text}`)
      console.log(`- Dimensions: ${embedding.embedding.length}`)
      console.log(`- First 3 values: ${embedding.embedding.slice(0, 3).join(', ')}`)
    }

    if (batchEmbedding.usage) {
      console.log(`\nTotal tokens: ${batchEmbedding.usage.totalTokens}`)
    }

    // Calculate similarity between two embeddings
    const vector1 = batchEmbedding.data[0].embedding
    const vector2 = batchEmbedding.data[1].embedding

    // Simple cosine similarity calculation
    const similarity = calculateCosineSimilarity(vector1, vector2)
    console.log('\nSimilarity between first two texts:')
    console.log(`${similarity.toFixed(4)} (${similarity < 0.5 ? 'Not similar' : 'Similar'})`)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimensions')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

main() 