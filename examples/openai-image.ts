// Example of using the OpenAI client to generate images
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

    console.log('Generating images with OpenAI DALL-E...')

    // Generate an image
    const response = await client.generateImage({
      prompt: 'A futuristic city with flying cars and robots, photorealistic style',
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3',
      quality: 'standard',
    })

    console.log('\nImage Generation Complete:')
    console.log('========================')
    console.log(`Generated ${response.images.length} image(s)`)
    console.log(`Model: ${response.model}`)

    // Display URLs for each generated image
    response.images.forEach((image, index) => {
      console.log(`\nImage #${index + 1}:`)
      if (image.url) {
        console.log(`URL: ${image.url}`)
      }
      if (image.b64Json) {
        console.log('Base64 data available (not displayed due to length)')
      }
    })

    // Generate another image with different parameters
    console.log('\nGenerating another image with different style...')
    const response2 = await client.generateImage({
      prompt: 'A peaceful nature scene with mountains, river, and wildlife',
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3',
      style: 'vivid',
    })

    console.log('\nSecond Image:')
    console.log('============')
    if (response2.images[0].url) {
      console.log(`URL: ${response2.images[0].url}`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 