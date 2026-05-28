## 1. Scaffold Directory Structure & Types

- [ ] 1.1 Create `src/components/`, `src/hooks/`, and `src/types/` directories.
- [ ] 1.2 Create `src/types/index.ts` and move `OptimizationRecord` and `OptimizationResponse` interfaces from `db.ts`/`orchestrator.ts` to this shared location.

## 2. Extract State into Custom Hooks

- [ ] 2.1 Create `src/hooks/useTheme.ts` to manage light/dark mode logic.
- [ ] 2.2 Create `src/hooks/useAppSettings.ts` to manage API keys, active model, and loaded history from indexedDB.
- [ ] 2.3 Create `src/hooks/useLayoutResize.ts` to handle the desktop drag-to-resize column logic.
- [ ] 2.4 Create `src/hooks/useTailorAgent.ts` to encapsulate the `handleOptimize` and scraping logic.

## 3. Extract UI Components

- [ ] 3.1 Create `src/components/layout/Header.tsx` to hold the top nav bar and model/theme switchers.
- [ ] 3.2 Create `src/components/modals/SettingsModal.tsx` for API key configuration.
- [ ] 3.3 Create `src/components/job/JobIngestionCard.tsx` for the target job text/URL inputs and the action button.
- [ ] 3.4 Create `src/components/editor/MasterCVEditor.tsx` for the left-side LaTeX editor.
- [ ] 3.5 Create `src/components/editor/WorkspacePreview.tsx` to handle the Code/Preview tabs and high-fidelity rendering.
- [ ] 3.6 Create `src/components/layout/MobileTabs.tsx` to handle the mobile bottom/top navigation.

## 4. Recompose App.tsx

- [ ] 4.1 Remove all extracted logic and JSX from `src/App.tsx`.
- [ ] 4.2 Recompose `App.tsx` by importing the new hooks and components, passing state down as needed (or via Context if established).
- [ ] 4.3 Verify the application builds without TypeScript or ESLint errors.
- [ ] 4.4 Manually test layout resizing, theme toggling, scraping, and tailoring to ensure feature parity.
