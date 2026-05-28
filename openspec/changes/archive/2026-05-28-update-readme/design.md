## Context

CV-Fix has been refactored into a modern, component-driven React application utilizing Vite, Tailwind, and Tauri for local native access. The `README.md` must be updated to serve as a comprehensive onboarding guide and showcase of these capabilities.

## Goals / Non-Goals

**Goals:**
- Provide a clear overview of the project and its value proposition.
- Document the new architecture (`src/components`, `src/context`, `src/hooks`).
- Provide step-by-step setup instructions for web (Vite) and native (Tauri/CLI) modes.
- Highlight the 3 supported LLM modes: Gemini API, Claude API, and Local keyless Gemini CLI.

**Non-Goals:**
- Creating a separate documentation website.
- Writing extensive API documentation for every internal function.

## Decisions

- **Structure**: The README will follow a standard open-source structure: Badges -> Hero -> Features -> Architecture -> Installation -> Usage -> Technologies.
- **Visuals**: We will assume that any screenshots can be added later by the maintainer, but we'll include placeholders.
- **Tone**: Professional, focusing on the "local AI resume tailoring" aspect.

## Risks / Trade-offs

- **Risk**: The README might get out of sync with future refactors.
  - **Mitigation**: Keep the architecture section high-level, focusing on directory concepts rather than specific file names.
