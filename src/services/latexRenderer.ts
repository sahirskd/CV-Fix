/**
 * High-fidelity client-side LaTeX-to-HTML parser and renderer
 * Focuses on parsing resume structures (e.g. sections, subheadings, bullet items, bold, lists, links)
 * and rendering them to a beautiful, printable CSS A4 canvas.
 */

export interface ParsedResume {
  name: string;
  contact: string[];
  sections: {
    title: string;
    contentHtml: string;
  }[];
}

/**
 * Sanitizes LaTeX syntax strings into clean HTML
 */
export function sanitizeLatexText(text: string): string {
  if (!text) return '';
  
  // Base CSS classes for icons
  const iconClasses = "w-3.5 h-3.5 inline-block -mt-0.5 align-middle text-slate-700 dark:text-slate-300 mr-1";
  const githubIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="${iconClasses}"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`;
  const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="${iconClasses}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
  const envelopeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="${iconClasses}"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>`;
  const phoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="${iconClasses}"><path fill-rule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clip-rule="evenodd"/></svg>`;

  return text
    // Replace LaTeX special escaped characters first to protect them using HTML entities
    .replace(/\\\{/g, '&#123;')
    .replace(/\\\}/g, '&#125;')
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\\|/g, '|')
    
    // Remove typical dollar math modes early so they don't break subsequent parsing
    .replace(/\$([^$]+)\$/g, '$1')
    // Remove stray dollar signs that user may have pasted
    .replace(/\$/g, '')
    
    // Icons parsing (match \faGithub, \faIcon{github}, etc.)
    .replace(/\\?faGithub\b/g, githubIcon)
    .replace(/\\?faLinkedin[a-zA-Z]*\b/g, linkedinIcon)
    .replace(/\\?faEnvelope[a-zA-Z]*\b/g, envelopeIcon)
    .replace(/\\?faPhone[a-zA-Z]*\b/g, phoneIcon)
    .replace(/\\?faIcon\{github\}/gi, githubIcon)
    .replace(/\\?faIcon\{linkedin\}/gi, linkedinIcon)
    .replace(/\\?faIcon\{envelope\}/gi, envelopeIcon)
    .replace(/\\?faIcon\{phone\}/gi, phoneIcon)

    // Typography & Sizing
    .replace(/\\?small\b\s*/g, '<span style="font-size: 0.875rem;">')
    .replace(/\\?large\b\s*/g, '<span style="font-size: 1.125rem;">')
    
    // Handle LaTeX bold, italics, emph
    .replace(/\\?textbf\s*\{([^{}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\?textit\s*\{([^{}]+)\}/g, '<em>$1</em>')
    .replace(/\\?emph\s*\{([^{}]+)\}/g, '<em>$1</em>')
    
    // Robust href link matching (allow spaces between \href and braces, and between the braces)
    .replace(/\\?href\s*\{([^}]+)\}\s*\{([^}]+)\}/g, '<a href="$1" class="text-blue-600 dark:text-cyan-400 hover:underline print:text-black print:no-underline" target="_blank" rel="noopener">$2</a>')
    // Fallback for completely malformed href missing curly braces (e.g. \hrefhttps://url.com)
    .replace(/\\?href(https?:\/\/[^\s}]+)/g, '<a href="$1" class="text-blue-600 dark:text-cyan-400 hover:underline print:text-black print:no-underline" target="_blank" rel="noopener">$1</a>')
    
    // Clean up trailing double backslashes
    .replace(/\\\\/g, '<br/>')
    
    // Spacing commands (vspace) mapped to margins/padding
    .replace(/\\?vspace\*?\{([^}]+)\}/g, '<div style="height: $1; margin-top: $1;"></div>')
    
    // Clean up LaTeX symbol macros
    .replace(/\\?textbullet\s?/g, '• ')
    .replace(/\\?cdot\s?/g, '· ')
    .replace(/\\?vcenter\{\\?hbox\{\\?tiny\$?\\?bullet\$?\}\}/g, '•')
    
    // Finally, remove all remaining unescaped structural braces { and } which are leftover noise
    .replace(/[{}]/g, '');
}

/**
 * Parses LaTeX source code into structured name, contact details, and custom HTML sections
 */
export function parseLatexToHtml(latex: string): ParsedResume {
  // Strip out LaTeX comments
  const cleanLatex = latex
    .split('\n')
    .map(line => {
      // Find comment symbol not preceded by backslash
      let commentIdx = -1;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '%' && (i === 0 || line[i - 1] !== '\\')) {
          commentIdx = i;
          break;
        }
      }
      return commentIdx === -1 ? line : line.substring(0, commentIdx);
    })
    .join('\n');

  const docStartIdx = cleanLatex.indexOf('\\begin{document}');
  const docEndIdx = cleanLatex.indexOf('\\end{document}');
  const bodyText = docStartIdx !== -1 
    ? cleanLatex.slice(docStartIdx + '\\begin{document}'.length, docEndIdx !== -1 ? docEndIdx : undefined)
    : cleanLatex;

  let name = '';
  let contact: string[] = [];
  const sections: { title: string; contentHtml: string }[] = [];

  // 1. Try to parse Name and Header links (usually inside \\begin{center} ... \\end{center} or first few lines)
  const centerMatch = bodyText.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  const headerBlock = centerMatch ? centerMatch[1] : bodyText.slice(0, 1000);

  if (headerBlock) {
    // Extract Name
    const nameMatch = headerBlock.match(/\\Huge\s*\\scshape\s*([^\\}]+)/) || 
                      headerBlock.match(/\\Huge\s*([^\\}]+)/) || 
                      headerBlock.match(/\\textbf\{([^{}]+)\}/);
    if (nameMatch) {
      name = sanitizeLatexText(nameMatch[1].trim());
    }

    // Extract contact items (usually separated by $|$ or \\\\)
    const linksText = headerBlock.replace(/\\Huge.*?\\\\|\\textbf\{.*?\}|\\Huge.*/g, '');
    const items = linksText
      .split(/\||\\\||\$\$|\\+/g)
      .map(i => i.trim())
      .filter(i => i.length > 5);
    
    contact = items.map(item => sanitizeLatexText(item));
  }

  if (!name) {
    name = 'Candidate Profile';
  }

  // 2. Parse LaTeX sections: \\section{Section Name}
  const sectionRegex = /\\section\{([^}]+)\}([\s\S]*?)(?=\\section\{|$)/g;
  let match;

  while ((match = sectionRegex.exec(bodyText)) !== null) {
    const sectionTitle = match[1].trim();
    const sectionBody = match[2].trim();
    
    let sectionHtml: string;
    
    // Check if section contains tabular/subheading blocks
    if (sectionBody.includes('\\resumeSubheading') || sectionBody.includes('\\resumeProjectHeading')) {
      sectionHtml = parseSubheadingsToHtml(sectionBody);
    } else if (sectionBody.includes('\\begin{itemize}') || sectionBody.includes('\\begin{enumerate}')) {
      // General list block
      sectionHtml = parseListToHtml(sectionBody);
    } else {
      // Simple paragraph text
      sectionHtml = `<p class="text-sm leading-relaxed text-slate-800 dark:text-slate-200">${sanitizeLatexText(sectionBody)}</p>`;
    }

    sections.push({
      title: sectionTitle,
      contentHtml: sectionHtml
    });
  }

  return {
    name,
    contact,
    sections
  };
}

/**
 * Parses resume subheadings (Experience / Education entries) into readable elements
 */
function parseSubheadingsToHtml(text: string): string {
  let html = '<div class="space-y-4">';

  interface Token {
    type: 'subheading' | 'project' | 'item' | 'item_start';
    company?: string;
    location?: string;
    title?: string;
    date?: string;
    content?: string;
  }

  // Let's parse linearly using simple index splitters or replacements
  // We will build a unified parser scanning commands sequentially:
  let idx = 0;
  const tokens: Token[] = [];

  while (idx < text.length) {
    const subMatch = text.slice(idx).match(/^\\resumeSubheading\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}/);
    if (subMatch) {
      tokens.push({
        type: 'subheading',
        company: subMatch[1],
        location: subMatch[2],
        title: subMatch[3],
        date: subMatch[4]
      });
      idx += subMatch[0].length;
      continue;
    }

    const projMatch = text.slice(idx).match(/^\\resumeProjectHeading\s*\{([^}]+)\}\s*\{([^}]+)\}/);
    if (projMatch) {
      tokens.push({
        type: 'project',
        title: projMatch[1],
        date: projMatch[2]
      });
      idx += projMatch[0].length;
      continue;
    }

    const itemMatch = text.slice(idx).match(/^\\resumeItem\s*\{([^}]+)\}/);
    if (itemMatch) {
      tokens.push({
        type: 'item',
        content: itemMatch[1]
      });
      idx += itemMatch[0].length;
      continue;
    }

    const itemStart = text.slice(idx).match(/^\\item/);
    if (itemStart) {
      tokens.push({ type: 'item_start' });
      idx += itemStart[0].length;
      continue;
    }

    // Standard list container starts/ends
    const envMatch = text.slice(idx).match(/^\\(begin|end)\{[^}]+\}/);
    if (envMatch) {
      idx += envMatch[0].length;
      continue;
    }

    // Skip normal white space and plain characters
    idx++;
  }

  // Compile tokens into structured blocks
  let currentGroup = '';
  let inList = false;

  for (const token of tokens) {
    if (token.type === 'subheading') {
      if (inList) {
        currentGroup += '</ul>';
        inList = false;
      }
      currentGroup += `
        <div class="mb-2">
          <div class="flex justify-between items-baseline text-sm font-semibold text-slate-900 dark:text-slate-100">
            <span>${sanitizeLatexText(token.company || '')}</span>
            <span class="text-xs font-normal text-slate-500 dark:text-slate-400">${sanitizeLatexText(token.location || '')}</span>
          </div>
          <div class="flex justify-between items-baseline text-xs italic text-slate-700 dark:text-slate-300">
            <span>${sanitizeLatexText(token.title || '')}</span>
            <span class="not-italic text-slate-500 dark:text-slate-400">${sanitizeLatexText(token.date || '')}</span>
          </div>
        </div>
      `;
    } else if (token.type === 'project') {
      if (inList) {
        currentGroup += '</ul>';
        inList = false;
      }
      currentGroup += `
        <div class="mb-1">
          <div class="flex justify-between items-baseline text-sm font-semibold text-slate-900 dark:text-slate-100">
            <span>${sanitizeLatexText(token.title || '')}</span>
            <span class="text-xs font-normal text-slate-500 dark:text-slate-400">${sanitizeLatexText(token.date || '')}</span>
          </div>
        </div>
      `;
    } else if (token.type === 'item') {
      if (!inList) {
        currentGroup += '<ul class="list-disc pl-4 text-xs space-y-1 text-slate-700 dark:text-slate-300 mb-2">';
        inList = true;
      }
      currentGroup += `<li>${sanitizeLatexText(token.content || '')}</li>`;
    }
  }

  if (inList) {
    currentGroup += '</ul>';
  }

  // Handle general items that are not structured in resumeItem commands (fallback lists)
  if (currentGroup === '') {
    return parseListToHtml(text);
  }

  html += currentGroup + '</div>';
  return html;
}

/**
 * Parses raw LaTeX itemize lists into styled HTML lists
 */
function parseListToHtml(text: string): string {
  const cleanText = text;
  
  // Extract custom item listings
  // Handle skills blocks like: \textbf{Languages}{: JavaScript...}
  const bulletRegex = /\\item\s*\{?\s*([\s\S]*?)(?=\\item|\\end\{|$)/g;
  let listItemsHtml = '';
  let match;

  while ((match = bulletRegex.exec(cleanText)) !== null) {
    const itemContent = match[1].trim();
    if (itemContent) {
      // Strip colon wrappers like \textbf{Languages}{: ...} into clean spacing
      const cleanedContent = itemContent.replace(/\{:([\s\S]*?)\}/g, ': $1');
      listItemsHtml += `<li class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-1">${sanitizeLatexText(cleanedContent)}</li>`;
    }
  }

  if (listItemsHtml) {
    return `<ul class="list-disc pl-4 space-y-1 mb-2">${listItemsHtml}</ul>`;
  }

  return `<p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${sanitizeLatexText(cleanText)}</p>`;
}

/**
 * Creates CSS layout configurations that lock the resume preview into a strict standard 1-page A4
 */
export const LATEX_A4_PRINT_STYLES = `
@media print {
  body {
    background: white !important;
    color: black !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .no-print {
    display: none !important;
  }
  .print-page {
    width: 210mm !important;
    height: 297mm !important;
    padding: 15mm 20mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    background: white !important;
    color: black !important;
    font-family: 'Times New Roman', Times, serif !important;
  }
  /* Dark mode overrides for print */
  .dark {
    color-scheme: light !important;
  }
  .dark .print-page {
    background: white !important;
    color: black !important;
  }
  .dark .print-page * {
    color: black !important;
    border-color: black !important;
  }
}

/* Screen A4 Preview styles */
.preview-canvas {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  background-color: white;
  color: black;
  font-family: 'Times New Roman', Times, serif;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  /* Scale preview slightly on mobile/tablet viewports to fit screen container */
  .preview-container {
    transform: scale(0.85);
    transform-origin: top center;
    max-height: 1200px;
    overflow-y: auto;
  }
}

@media (max-width: 640px) {
  .preview-container {
    transform: scale(0.65);
    transform-origin: top center;
    max-height: 900px;
  }
}
`;
