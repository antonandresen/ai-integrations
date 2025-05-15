# AI Integrations Examples

This directory contains example code demonstrating how to use the `ai-integrations` library.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file in the examples directory based on this template:
   ```
   # OpenAI API Key
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # Anthropic API Key (if using Anthropic examples)
   ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
   
   # Other provider keys as needed
   ```

3. Run examples with:
   ```bash
   pnpm examples:text     # Text generation
   pnpm examples:chat     # Chat completions
   pnpm examples:stream   # Streaming responses
   pnpm examples:embed    # Embeddings generation
   pnpm examples:image    # Image generation
   pnpm examples:code     # Code generation
   ```

## Examples

- **openai-text.ts**: Basic text generation using OpenAI
- **openai-chat.ts**: Chat completions with conversation history
- **openai-streaming.ts**: Streaming text responses
- **openai-embeddings.ts**: Generate vector embeddings
- **openai-image.ts**: Generate images with DALL-E
- **openai-code.ts**: Generate code in various languages

## Adding Custom Examples

To create your own examples:

1. Create a new `.ts` file in this directory
2. Import the library functions you need
3. Set up a client with the provider you want to use
4. Make the appropriate API calls
5. Handle the responses 