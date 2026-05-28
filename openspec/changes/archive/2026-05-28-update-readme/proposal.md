## Why

The `CV-Fix` codebase has recently undergone a major architectural refactoring (transitioning from a monolith `App.tsx` to a component-driven React architecture using Contexts and Custom Hooks). The current `README.md` is likely outdated or lacks details about the new architecture, available features, and setup instructions. Updating the README now is crucial to ensure that other developers or users understand the new codebase structure and how to contribute or use the application effectively.

## What Changes

- Overhaul the `README.md` file to reflect the new component-driven architecture.
- Add a section documenting the new directory structure (`src/components`, `src/hooks`, `src/context`, `src/types`).
- Detail the core features: Master LaTeX template editing, Target Job ingestion via URL scraping or direct text, and the AI optimization workflow (Gemini / Claude / Local CLI).
- Update the local development setup instructions (using Vite + Tauri, etc.).

## Capabilities

### New Capabilities
- `readme-documentation`: Comprehensive documentation covering the project architecture, features, and setup instructions.

### Modified Capabilities

## Impact

- No codebase runtime impact.
- Improves developer onboarding and repository documentation.
