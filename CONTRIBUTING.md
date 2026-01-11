# Contributing to EverQuest MCP

Thanks for your interest in contributing!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/ArtSabintsev/everquest-mcp.git
cd everquest-mcp

# Use correct Node version
nvm use

# Install dependencies
npm install

# Build and test
npm run build
npm test
```

## Adding a New Data Source

1. Create a new file in `src/sources/` (e.g., `mysite.ts`)
2. Implement the `EQDataSource` interface:

```typescript
import { EQDataSource, SearchResult, fetchPage, stripHtml } from './base.js';

export class MySiteSource extends EQDataSource {
  name = 'MySite';
  baseUrl = 'https://mysite.com';

  async search(query: string): Promise<SearchResult[]> {
    // Implement search
  }
}

export const mysite = new MySiteSource();
```

3. Add exports in `src/sources/index.ts`:

```typescript
export { mysite } from './mysite.js';
import { mysite } from './mysite.js';

export const sources: EQDataSource[] = [
  // ... existing sources
  mysite,
];
```

4. Optionally add source-specific tools in `src/tools.ts`

## Code Style

- Use TypeScript strict mode
- Use async/await over .then() chains
- Add contextual error logging: `console.error('[SourceName] Error:', error.message)`
- Use the shared `fetchPage()` utility (includes caching, rate limiting, retries)

## Testing

```bash
npm test
```

Tests are in `src/tests/`. Add tests for:
- Input validation
- Tool definitions
- Basic functionality

## Pull Requests

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a PR

## Reporting Issues

Please include:
- What you were trying to do
- What happened
- Error messages (if any)
- Node version: `node --version`
