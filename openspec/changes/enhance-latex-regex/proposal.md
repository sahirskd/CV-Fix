## Why

Currently, the custom regex-based LaTeX parser does not accurately render various standard LaTeX tags commonly found in Overleaf templates. Specifically, tags like `\small`, spacing (`\vspace`), phone numbers/symbols, and certain `\href{url}{text}` combinations often get stripped out or render incorrectly as plain text. Enhancing the client-side regex engine will provide a much more robust, Overleaf-like HTML preview without needing an external compiler.

## What Changes

- Enhance the LaTeX-to-HTML parser in `src/services/latexRenderer.ts` to support standard text sizing macros (e.g., `\small`, `\large`).
- Improve the parsing of `\href` to ensure links render as clickable HTML `<a>` tags properly, even when nested inside other text.
- Map common LaTeX icon packages (like `\faIcon{github}` or typical Unicode fallback rendering for common symbols) to standard web equivalents.
- Optimize the layout CSS so that the rendered DOM more closely matches standard Overleaf margins and spacing conventions.

## Capabilities

### New Capabilities
- `latex-regex-engine`: Enhanced regex engine parsing standard CV packages and spacing.

### Modified Capabilities

## Impact

- Direct modification to `src/services/latexRenderer.ts`.
- The Live Preview component (`MasterCVEditor` and `WorkspacePreview`) will immediately reflect the higher-fidelity rendering.
- No impact on offline capabilities or privacy constraints.
