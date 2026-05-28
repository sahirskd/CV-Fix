## 1. Implement Enhanced Link and Icon Parsing

- [x] 1.1 In `src/services/latexRenderer.ts` (`sanitizeLatexText`), update the `\href` regex replacement to robustly handle standard URLs.
- [x] 1.2 Add regex replacements mapping `\faGithub`, `\faLinkedin`, `\faEnvelope`, and `\faPhone` to inline `<svg>` elements representing those icons, ensuring proper HTML styling.
- [x] 1.3 Map `\faIcon{github}` (and variants) explicitly to the same inline SVG icons.

## 2. Implement Spacing and Typography Parsing

- [x] 2.1 Add a regex replacement for `\vspace{Xpt}` converting it to `<div style="height: Xpt"></div>`.
- [x] 2.2 Add a regex replacement for `\small` (and similar like `\large`) converting it to a `<span style="font-size: 0.875rem">` wrapper.
- [x] 2.3 Modify the `\textbf` and `\textit` regex wrappers to handle any nested spacing or icon artifacts properly.

## 3. Verification

- [x] 3.1 Test the preview renderer by pasting the user's snippet containing `vspace`, `href`, and standard CV sections into the CV-Fix editor.
- [x] 3.2 Verify the DOM outputs valid SVG nodes inside the HTML rendering container for icons.
