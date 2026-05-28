## ADDED Requirements

### Requirement: Document new component architecture
The README SHALL include a "Project Architecture" section outlining the newly introduced `src/components`, `src/context`, `src/hooks`, and `src/types` directories.

#### Scenario: Architecture overview
- **WHEN** a developer views the README
- **THEN** they can understand that the `App.tsx` monolith was refactored into distinct functional modules.

### Requirement: Document key application features
The README SHALL document the core application features, specifically mentioning the Master LaTeX template setup, Job Ingestion tools, and the Dual-Panel Mutated Workspace (code and preview).

#### Scenario: Features overview
- **WHEN** a user views the README
- **THEN** they know exactly what CV-Fix offers and how its UI components are structured.

### Requirement: Document local AI integration models
The README SHALL explicitly specify the three supported LLM execution modes: Google Gemini 2.0 Flash (API), Anthropic Claude 3.5 Sonnet (API), and the Local Keyless Gemini CLI integration via Tauri.

#### Scenario: Models overview
- **WHEN** a user wants to configure CV-Fix
- **THEN** they understand the options they have for setting up their preferred API or local CLI environment.

### Requirement: Document Installation and Running
The README SHALL provide clear CLI commands for installing dependencies and running the Vite dev server, as well as the Tauri desktop dev server.

#### Scenario: Local development setup
- **WHEN** a new contributor clones the repository
- **THEN** they can successfully run `npm install` and `npm run dev` or `npm run tauri dev`.
