import { get, set, del } from 'idb-keyval';

import type { OptimizationRecord } from '../types';

export const StorageKeys = {
  MASTER_LATEX: 'career_ops_master_latex',
  GEMINI_API_KEY: 'career_ops_gemini_key',
  ANTHROPIC_API_KEY: 'career_ops_anthropic_key',
  SELECTED_MODEL: 'career_ops_selected_model',
  CUSTOM_PROMPT_TWEAK: 'career_ops_custom_prompt_tweak',
  OPTIMIZATION_HISTORY: 'career_ops_history',
};

// Default high-fidelity LaTeX template in case the user doesn't have one ready
export const DEFAULT_LATEX_TEMPLATE = `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\cleanlook
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Alex Developer} \\\\ \\vspace{1pt}
    \\small 123-456-7890 $|$ \\href{mailto:alex@example.com}{alex@example.com} $|$ 
    \\href{https://linkedin.com/in/alexdev}{linkedin.com/in/alexdev} $|$
    \\href{https://github.com/alexdev}{github.com/alexdev}
\\end{center}

%-----------SUMMARY-----------
\\section{Professional Summary}
 Dedicated and highly analytical Full-Stack Engineer with 4+ years of experience designing, building, and deploying highly scalable web applications. Expert in React, TypeScript, Node.js, and cloud architectures. Proficient in automated systems and performance tuning.

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {State University of Technology}{City, ST}
      {Bachelor of Science in Computer Science}{Aug. 2018 -- May 2022}
  \\resumeSubHeadingListEnd


%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {CloudOps Technologies}{Remote}
      {Software Engineer}{June 2022 -- Present}
      \\resumeItemListStart
        \\resumeItem{Designed and implemented high-performance backend pipelines using TypeScript and Node.js, optimizing database query response times by 35\\%.}
        \\resumeItem{Spearheaded migration of legacy frontend monolithic portals into modular React components, boosting client-side Largest Contentful Paint (LCP) speeds by 40\\%.}
        \\resumeItem{Collaborated with DevOps teams to deploy scalable infrastructure on AWS, shortening continuous deployment pipelines from 25 minutes down to 8 minutes.}
      \\resumeItemListEnd
      
    \\resumeSubheading
      {AppScale Solutions}{Boston, MA}
      {Junior Software Developer}{May 2021 -- May 2022}
      \\resumeItemListStart
        \\resumeItem{Developed interactive frontend user interfaces using React and Redux, boosting active client onboarding rates by 12\\%.}
        \\resumeItem{Wrote comprehensive Jest integration tests that successfully reduced code production regressions by 18\\%.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd


%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
    \\resumeProjectHeading
      {\\textbf{Auto-Tailor Web App} $|$ \\emph{React, Tailwind CSS, LocalStorage}}{Jan. 2024}
      \\resumeItemListStart
        \\resumeItem{Built a standalone local resume customizer displaying live HTML previews from structured profile data.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd


%-----------PROGRAMMING SKILLS-----------
\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: JavaScript, TypeScript, Python, HTML/CSS, SQL, LaTeX} \\\\
     \\textbf{Frameworks}{: React, Next.js, Node.js, Express, Jest, Tailwind CSS} \\\\
     \\textbf{Developer Tools}{: Git, Docker, Amazon Web Services (AWS), VS Code}
    }}
 \\end{itemize}


%-------------------------------------------
\\end{document}
`;

export async function getMasterLatex(): Promise<string> {
  const code = await get<string>(StorageKeys.MASTER_LATEX);
  return code || DEFAULT_LATEX_TEMPLATE;
}

export async function saveMasterLatex(latex: string): Promise<void> {
  await set(StorageKeys.MASTER_LATEX, latex);
}

export async function getApiKey(provider: 'gemini' | 'anthropic'): Promise<string> {
  const key = await get<string>(
    provider === 'gemini' ? StorageKeys.GEMINI_API_KEY : StorageKeys.ANTHROPIC_API_KEY
  );
  return key || '';
}

export async function saveApiKey(provider: 'gemini' | 'anthropic', key: string): Promise<void> {
  await set(
    provider === 'gemini' ? StorageKeys.GEMINI_API_KEY : StorageKeys.ANTHROPIC_API_KEY,
    key
  );
}

export async function getSelectedModel(): Promise<'gemini' | 'claude' | 'cli'> {
  const model = await get<'gemini' | 'claude' | 'cli'>(StorageKeys.SELECTED_MODEL);
  return model || 'gemini';
}

export async function saveSelectedModel(model: 'gemini' | 'claude' | 'cli'): Promise<void> {
  await set(StorageKeys.SELECTED_MODEL, model);
}

export async function getPromptTweak(): Promise<string> {
  const tweak = await get<string>(StorageKeys.CUSTOM_PROMPT_TWEAK);
  return tweak || '';
}

export async function savePromptTweak(tweak: string): Promise<void> {
  await set(StorageKeys.CUSTOM_PROMPT_TWEAK, tweak);
}

export async function getHistory(): Promise<OptimizationRecord[]> {
  const history = await get<OptimizationRecord[]>(StorageKeys.OPTIMIZATION_HISTORY);
  return history || [];
}

export async function saveHistory(history: OptimizationRecord[]): Promise<void> {
  await set(StorageKeys.OPTIMIZATION_HISTORY, history);
}

export async function addHistoryRecord(record: OptimizationRecord): Promise<void> {
  const history = await getHistory();
  await saveHistory([record, ...history]);
}

export async function clearHistory(): Promise<void> {
  await del(StorageKeys.OPTIMIZATION_HISTORY);
}
