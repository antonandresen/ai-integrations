# Contributing to ai-integrations

Thank you for considering contributing to ai-integrations! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies with `pnpm install`
3. Create a `.env` file based on `.env.example`
4. Run tests with `pnpm test`

## Development Workflow

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Run tests to ensure your changes don't break existing functionality
4. Submit a pull request

## Project Structure

- `src/core/` - Core functionality and interfaces
- `src/features/` - Feature-specific interfaces (text, chat, image, etc.)
- `src/providers/` - Provider implementations
- `tests/` - Test files
- `examples/` - Example usage

## Adding a New Provider

1. Create a new directory in `src/providers/` with your provider name
2. Create the following files:
   - `index.ts` - Re-exports from other files
   - `client.ts` - Provider client implementation
   - `models.ts` - Model definitions and utilities
   - `types.ts` - Provider-specific types

3. Implement the provider client by extending `BaseClient` and implementing needed interfaces
4. Update the provider map in `src/factory.ts`
5. Add tests for your provider
6. Add an example usage in the `examples/` directory

## Implementing Features

When implementing provider features:

1. First check the feature interface in `src/features/` to understand the expected behavior
2. Implement the feature in your provider's client
3. Add appropriate error handling
4. Document any provider-specific behavior or limitations
5. Add tests for the new feature

## Code Style

This project uses ESLint and Prettier. Before submitting a PR:

1. Run `pnpm lint` to check for lint errors
2. Run `pnpm format` to format the code

## Testing

Add tests for any new features or bugfixes:

1. Add unit tests for core functionality
2. Add integration tests if necessary
3. Run tests with `pnpm test`

## Documentation

Update documentation when adding or changing features:

1. Update the README.md if necessary
2. Update or add JSDoc comments to public API functions
3. Add examples if appropriate

## Pull Request Process

1. Update the README.md if necessary
2. Update the version number according to [semantic versioning](https://semver.org/)
3. The PR should pass all CI checks
4. Your PR will be reviewed by maintainers

## Questions?

If you have any questions or need help, feel free to open an issue or discussion. 