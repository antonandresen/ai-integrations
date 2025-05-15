# ai-integrations [![npm](https://img.shields.io/npm/v/ai-integrations.svg)](https://npmjs.com/package/ai-integrations)

[![Unit Test](https://github.com/antonandresen/ai-integrations/actions/workflows/unit-test.yml/badge.svg)](https://github.com/antonandresen/ai-integrations/actions/workflows/unit-test.yml)

A unified API for integrating with various AI models including OpenAI, Anthropic, Google AI, Mistral, and more.

## Features

- 🔄 **Single API** - Consistent interface across all providers
- 🧩 **Multi-provider** - Support for OpenAI, Anthropic, Google, Mistral, and more
- 🛠️ **Capability-based** - Text, chat, code, image generation, embeddings, and more
- 🔌 **Plugin system** - Easily extend with custom providers
- 🌊 **Streaming support** - Real-time streaming for text and chat responses
- 🏗️ **Type-safe** - Full TypeScript support with detailed types

## Quick Start Guide

1. **Install the package**

```bash
npm install ai-integrations
# or
pnpm add ai-integrations
```

2. **Set up your environment variables**

Create a `.env` file with your API keys:

```
OPENAI_API_KEY=sk-your-api-key-here
```

3. **Generate text with OpenAI**

```typescript
import { createOpenAIClient } from 'ai-integrations';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Create an OpenAI client
  const client = createOpenAIClient();
  
  // Generate text
  const response = await client.generateText({
    prompt: 'Explain quantum computing in simple terms',
    model: 'gpt-3.5-turbo',
  });
  
  console.log(response.text);
}

main();
```

4. **Explore more examples**

Check out the [examples directory](./examples) for more code samples.

## Basic Usage

### Quick Start

```typescript
import { createOpenAIClient } from 'ai-integrations';

// Create a client for OpenAI
const client = createOpenAIClient({
  apiKey: 'your-api-key', // Or use OPENAI_API_KEY environment variable
});

// Generate text
const textResponse = await client.generateText({
  prompt: 'Write a short poem about coding',
  model: 'gpt-4', // Optional, uses default model if not specified
});

console.log(textResponse.text);
```

### Chat Completions

```typescript
import { createClient, type ChatCompletionFeature } from 'ai-integrations';

// Create a client for Anthropic
const client = createClient<ChatCompletionFeature>({
  provider: 'anthropic',
  apiKey: 'your-anthropic-api-key',
});

// Chat with the model
const chatResponse = await client.createChatCompletion({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
});

console.log(chatResponse.message.content);
```

### Image Generation

```typescript
import { createClient, type ImageFeature } from 'ai-integrations';

// Create a client for Stable Diffusion
const client = createClient<ImageFeature>({
  provider: 'stability',
  apiKey: 'your-stability-api-key',
});

// Generate an image
const imageResponse = await client.generateImage({
  prompt: 'A cosmic cat riding a rainbow through space',
  n: 1,
  size: '1024x1024',
});

// Get the image URL
const imageUrl = imageResponse.images[0].url;
```

### Code Generation

```typescript
import { createOpenAIClient } from 'ai-integrations';

const client = createOpenAIClient({
  apiKey: 'your-api-key',
});

// Generate code based on a prompt
const codeResponse = await client.generateCode({
  prompt: 'Write a React component that displays a counter with increment and decrement buttons',
  language: 'typescript',
});

console.log(codeResponse.code);
```

### Streaming Responses

```typescript
import { createOpenAIClient } from 'ai-integrations';

const client = createOpenAIClient({
  apiKey: 'your-api-key',
});

// Stream chat responses
const stream = client.createChatCompletionStream({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Write a short story about a robot discovering emotions.' },
  ],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.message.content || '');
}
```

### Thread and Assistant Support

```typescript
import { createOpenAIClient } from 'ai-integrations';

const client = createOpenAIClient();

// Create an assistant
const assistant = await client.createAssistant({
  model: 'gpt-4-turbo',
  name: 'Research Assistant',
  instructions: 'You help with academic research and literature reviews.',
});

// Create a thread for conversation
const thread = await client.createThread();

// Add a message to the thread
await client.createThreadMessage({
  threadId: thread.id,
  role: 'user',
  content: 'What are the most cited papers on transformer models?',
});

// Run the thread with the assistant
const run = await client.runThread({
  threadId: thread.id,
  assistantId: assistant.id,
});

// Wait for the run to complete
const completedRun = await client.waitForThreadRun(thread.id, run.id);

// Get the assistant's response
const messages = await client.listThreadMessages(thread.id);
console.log(messages[0].content); // Assistant's response
```

## Configuration

### Global Configuration

```typescript
import { configure } from 'ai-integrations';

// Set global configuration
configure({
  defaultProvider: 'openai',
  debug: true,
  // Global client options
  timeout: 30000,
  maxRetries: 2,
});
```

### Environment Variables

The library automatically looks for API keys in environment variables:

- `OPENAI_API_KEY` - For OpenAI
- `ANTHROPIC_API_KEY` - For Anthropic
- `GOOGLE_AI_API_KEY` - For Google AI
- `MISTRAL_API_KEY` - For Mistral
- `AI_INTEGRATIONS_API_KEY` - Fallback for any provider

## Supported Providers

- OpenAI (GPT-4, GPT-3.5, DALL-E, etc.)
- Anthropic (Claude 3, Claude 2, etc.)
- Google (Gemini Pro, PaLM, etc.)
- Mistral AI (Mistral Large, Medium, etc.)
- Cohere (Command, Embed, etc.)
- More coming soon!

## Key Features

### Provider-Agnostic Interface

Each capability (text, chat, image, etc.) has a standardized interface that works the same regardless of which AI provider you're using:

```typescript
// With OpenAI
const openaiClient = createOpenAIClient({ apiKey: 'sk-...' });
const response = await openaiClient.generateText({ prompt: 'Hello' });

// With Anthropic (same interface, different provider)
const anthropicClient = createClient<TextGenerationFeature>({ 
  provider: 'anthropic', 
  apiKey: 'sk-ant-...' 
});
const response = await anthropicClient.generateText({ prompt: 'Hello' });
```

### Feature-Based Architecture

The library is organized around capabilities rather than providers, making it easy to switch between providers:

```typescript
// Text generation
client.generateText({ prompt: 'Write a poem' });

// Chat completions
client.createChatCompletion({ messages: [...] });

// Image generation
client.generateImage({ prompt: 'A cat in space' });

// Embeddings
client.createEmbedding({ input: 'Hello world' });

// Code generation
client.generateCode({ prompt: 'Sort an array', language: 'javascript' });
```

### Streaming Support

All compatible providers support streaming for real-time responses:

```typescript
const stream = client.createChatCompletionStream({ 
  messages: [...],
  stream: true
});

for await (const chunk of stream) {
  // Process each chunk as it arrives
  console.log(chunk.message.content);
}
```

## Project Structure

The library follows a clean, modular architecture:

```
src/
├── core/            # Core types and shared functionality
├── features/        # Feature-specific interfaces (text, chat, etc.)
├── providers/       # Provider implementations
│   ├── openai/      # OpenAI integration
│   ├── anthropic/   # Anthropic integration (coming soon)
│   └── ...          # Other providers
├── factory.ts       # Client factory functions
└── index.ts         # Main exports
```

## Advanced Usage

### Custom Headers and Options

Add custom headers or request options to any API call:

```typescript
const response = await client.generateText({
  prompt: 'Hello',
  requestOptions: {
    headers: { 'Custom-Header': 'value' },
    signal: abortController.signal, // For cancellation
  }
});
```

### Error Handling

All errors are standardized with detailed information:

```typescript
try {
  const response = await client.generateText({ prompt: 'Hello' });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Try again in ${error.retryAfter} seconds`);
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else {
    console.log(`Error: ${error.message}`);
  }
}
```

## Contributing

Contributions are welcome! Please check out our [contributing guide](CONTRIBUTING.md) to get started.

## License

[MIT](LICENSE)

### Custom Providers

You can extend the library with custom providers:

```typescript
import { BaseClient, TextGenerationFeature } from 'ai-integrations';

class MyCustomProvider extends BaseClient implements TextGenerationFeature {
  constructor(config) {
    super('my-provider', config);
  }

  async generateText(options) {
    // Implement your custom text generation logic
    // ...
  }

  protected getDefaultBaseUrl(): string {
    return 'https://api.mycustomprovider.com/v1';
  }
}

// Register your provider
registerProvider('my-provider', MyCustomProvider);

// Use your custom provider
const client = createClient({
  provider: 'my-provider',
  apiKey: 'your-custom-api-key',
});
```
