## Why

The current front-end architecture is highly monolithic, with the vast majority of the application state, layout logic, and business logic concentrated within a single `App.tsx` file (over 1,000 lines long). This monolith makes the codebase difficult to understand, scale, and maintain, increasing the risk of bugs and merge conflicts. Breaking it down now into modular components and custom hooks will establish a scalable foundation for future feature development without changing any existing user-facing behaviors.

## What Changes

- Extract UI elements from `App.tsx` into modular feature components (e.g., Header, Editor views, Settings Modal) under `src/components/`.
- Extract complex state management and business logic (e.g., theme toggling, API key management, layout resizing) into custom hooks under `src/hooks/`.
- Establish shared TypeScript interfaces under `src/types/`.
- Refactor `App.tsx` to act purely as the root coordinator that composes these new components and hooks.
- **NO functional changes**: Existing features (scraping, tailoring, PDF printing) remain exactly as they are.

## Capabilities

### New Capabilities
- None. (Pure refactor)

### Modified Capabilities
- None. (Pure refactor)

## Impact

- **Affected Code**: `src/App.tsx` will be heavily modified/split.
- **New Code**: `src/components/`, `src/hooks/`, `src/types/` directories will be created and populated.
- **Dependencies**: No new dependencies are expected to be added.
- **Systems**: No impact on external services, APIs, or existing storage mechanisms (`indexedDB`).
