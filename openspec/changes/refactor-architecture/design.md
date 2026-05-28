## Context

The `CV-Fix` React application currently operates almost entirely out of a single file: `src/App.tsx`, which is over 1,000 lines long. It handles global state, API key persistence, LLM orchestration, document scraping, and complex UI layouts (including draggable split panes and mobile tabs). As the application grows, this monolith becomes harder to navigate, maintain, and test.

## Goals / Non-Goals

**Goals:**
- Extract discrete UI elements into modular React components (`src/components/`).
- Extract complex, domain-specific state management into custom React hooks (`src/hooks/`).
- Define shared TypeScript types for better type-safety and code documentation (`src/types/`).
- Make `App.tsx` a lightweight composition layer.

**Non-Goals:**
- We are NOT changing the underlying `indexedDB` storage schemas.
- We are NOT changing the LLM prompts or the tailoring logic (`src/services/`).
- We are NOT adding new functional features.
- We are NOT migrating to Redux/Zustand; React Context and Custom Hooks will suffice for now.

## Decisions

**Decision 1: React Context vs. Prop Drilling**
- *Rationale*: Given the extraction, passing state (like `masterLatex`, `selectedModel`, `theme`) through many layers of props will be tedious. We will create a `AppContext` (or multiple targeted contexts like `SettingsContext` and `TailorContext`) to provide global state to the deeply nested components without heavy prop drilling.
- *Alternative*: Simple custom hooks + prop drilling. We'll start with custom hooks that manage state and only reach for Context if the prop tree gets too deep. Actually, looking at the layout, most state is needed globally. We will use a `useAppState` hook exported from a context provider.

**Decision 2: Directory Structure**
- *Rationale*: Standard feature-based structure inside `src/`:
  - `src/components/layout/` (Header, ResizableWorkspace)
  - `src/components/editor/` (MasterCVEditor, CodePreview)
  - `src/components/job/` (JobIngestionCard)
  - `src/components/modals/` (SettingsModal)
  - `src/hooks/`
  - `src/types/`

**Decision 3: Preserving the "PWA/Storage" Loading Pattern**
- *Rationale*: Currently, `App.tsx` loads data from `indexedDB` on mount. This logic will be moved into a specific `useAppStorage` or `useSettings` hook that initializes the context, avoiding any race conditions on boot.

## Risks / Trade-offs

- **Risk: Breaking the complex desktop column resizing logic.**
  - *Mitigation*: The resize logic relies heavily on DOM refs (`mainContainerRef`). We will carefully extract this into a `useResizablePanels` hook that returns the ref and width states, ensuring the DOM interactions remain performant and accurate.

- **Risk: Breaking the high-fidelity A4 Print view.**
  - *Mitigation*: The print view uses specific CSS classes (`.no-print`, scaling transform). We will ensure these classes are meticulously preserved when extracting the `WorkspacePreview` component.
