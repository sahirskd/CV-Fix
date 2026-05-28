## ADDED Requirements

### Requirement: Render LaTeX icons as inline HTML SVG
The system SHALL parse common LaTeX icon commands (`\faGithub`, `\faLinkedin`, `\faEnvelope`, `\faPhone`) and render them as inline HTML SVGs to match the high-fidelity appearance of Overleaf.

#### Scenario: User includes a Github icon
- **WHEN** the LaTeX text contains `\faGithub` or `\faIcon{github}`
- **THEN** the parser outputs a clean SVG path block representing the Github logo

### Requirement: Render LaTeX text sizing and spacing macros
The system SHALL parse sizing macros (`\small`, `\large`) and spacing (`\vspace{Xpt}`) and convert them into HTML styling to respect the document layout.

#### Scenario: User shrinks text using \small
- **WHEN** the LaTeX text contains `\small` 
- **THEN** the subsequent text is wrapped or styled with a smaller font class (e.g., `<span style="font-size: 0.85em;">`)

#### Scenario: User adds vertical space
- **WHEN** the LaTeX text contains `\vspace{5pt}`
- **THEN** the parser outputs a div or span with equivalent spacing (`<div style="height: 5pt"></div>`)

### Requirement: Robust Link parsing
The system SHALL accurately parse `\href{url}{text}` macros, ensuring that URLs are correctly hyperlinked and text is visibly styled as a link.

#### Scenario: User links their Github profile
- **WHEN** the LaTeX text contains `\href{https://github.com/sahirskd}{github.com/sahirskd}`
- **THEN** it renders as `<a href="https://github.com/sahirskd">github.com/sahirskd</a>` in the HTML
