## Context

The CV-Fix application parses LaTeX using a custom regex engine (`src/services/latexRenderer.ts`). Currently, certain standard macros (e.g., `\small`, `\vspace`, `\faIcon`, and sometimes `\href`) fail to render correctly in the HTML preview. This causes the preview to look unpolished compared to Overleaf.

## Goals / Non-Goals

**Goals:**
- Properly render `\href{url}{text}` even with complex internal contents.
- Map text sizing macros like `\small`, `\large`, `\huge` to Tailwind CSS classes.
- Support basic LaTeX icons/symbols (`\faGithub`, `\faLinkedin`, `\faEnvelope`, `\faPhone`) by rendering standard raw SVG tags or Unicode equivalents directly into the HTML string.
- Support `\vspace{Xpt}` by injecting a spacing `div`.

**Non-Goals:**
- Implementing a full-blown AST parser or WebAssembly LaTeX engine (Tectonic).
- Supporting complex mathematical environments or TikZ drawing.

## Decisions

- **Icon Rendering:** Since the parser returns raw HTML strings (and not React nodes), we cannot directly instantiate `lucide-react` components. We will map common LaTeX icon commands to raw inline SVG strings (matching Lucide paths) or to simple SVG images so they render flawlessly inside the `innerHTML`.
- **Spacing:** `\vspace` and `\vspace*` commands will be parsed and mapped to `<div style="height: X"></div>` or `<div class="mb-2"></div>` to preserve visual structure.
- **Link Parsing:** The `\href` regex will be strengthened to ensure it captures properly without truncating if the text contains inner braces or escaped characters.

## Risks / Trade-offs

- **Risk:** Regex is inherently brittle for parsing recursive structures (like nested braces in LaTeX).
  - **Mitigation:** We will keep the regex simple and rely on standard CV conventions. CVs rarely have deeply nested brace structures outside of simple macros.
