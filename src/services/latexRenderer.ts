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
  return text
    // Replace LaTeX special escaped characters
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\\\$/g, '$')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    .replace(/\\\|/g, '|')
    // Handle LaTeX bold, italics, emph
    .replace(/\\textbf\{([^{}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\textit\{([^{}]+)\}/g, '<em>$1</em>')
    .replace(/\\emph\{([^{}]+)\}/g, '<em>$1</em>')
    // Handle LaTeX href: \href{url}{label}
    .replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" class="text-blue-600 dark:text-cyan-400 hover:underline print:text-black print:no-underline" target="_blank" rel="noopener">$2</a>')
    // Clean up trailing double backslashes
    .replace(/\\\\/g, '<br/>')
    // Clean up spacing adjustments
    .replace(/\\vspace\*?\{[^}]+\}/g, '')
    // Clean up LaTeX symbol macros
    .replace(/\\textbullet\s?/g, '• ')
    .replace(/\\cdot\s?/g, '· ')
    .replace(/\\vcenter\{\\hbox\{\\tiny\$\\bullet\$\}\}/g, '•')
    // Remove typical dollar math modes
    .replace(/\$([^$]+)\$/g, '$1');
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
