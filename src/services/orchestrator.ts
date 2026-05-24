export interface DimensionScore {
  name: string;
  score: number;
  feedback: string;
}

export interface OptimizationResponse {
  evaluation: {
    roleSummary: string;
    cvMatch: string;
    levelStrategy: string;
    compResearch: string;
    personalizationBlueprint: string;
    interviewSTAR: string;
  };
  scorecard: {
    overallGrade: string;
    overallScore: number;
    dimensions: DimensionScore[];
  };
  optimizedTex: string;
}

// System prompts based on the Santifer CV-Fix pipeline
const SYSTEM_PROMPT = `You are CV-Fix, an expert Principal Technical Resume Architect and Senior Recruiter. 
Your core capability is executing a high-precision, 3-phase tailoring operation on a candidate's Master LaTeX Resume against a target Job Description.

Your goal is to optimize the resume so it excels in applicant tracking systems (ATS), matches hiring manager expectations, and maximizes the candidate's chance of landing an interview, while keeping the LaTeX compilation perfectly intact.

You MUST execute the following pipeline and return your response in the exact, strict Markdown structure detailed below:

### 1. The 6-Block Evaluation
- Block 1: Role Summary (What is the target role, core mission, team scope, and primary tech stack?)
- Block 2: CV Match Assessment (What matches, what is missing, and what are the major strengths/gaps?)
- Block 3: Level Strategy (Are they looking for Junior, Mid, Senior, or Staff? How does the candidate's level map, and how do we phrase their scope?)
- Block 4: Compensation & Salary Research (What is the estimated compensation bracket for this role based on location/title? Which high-value skills can they highlight to maximize leverage?)
- Block 5: Personalization Blueprint (Directives on how to rewrite the resume contextually - e.g., 'focus on scale, backend microservices, and metrics')
- Block 6: Interview STAR Prep (3 targeted STAR bullet outlines for behaviorals or technical deep dives based on the job requirements)

### 2. The 10-Dimension Scorecard
Evaluate the candidate's Master Resume against the Job Description across these 10 weighted dimensions:
1. Hard Skills Coverage (15% weight)
2. Soft Skills Alignment (5% weight)
3. Impact Metrics & Numbers (15% weight) - presence of quantifiable results
4. Action Verbs Density (10% weight) - strong tech lead verbs
5. Structural & Margins Readability (10% weight)
6. Keywords Matching Density (15% weight) - target keywords from JD
7. Scope/Scale Fit (10% weight) - budget, team sizes, and high scale users
8. Domain & Industry Experience (10% weight)
9. LaTeX Formatting Hygiene (5% weight)
10. Gaps & Discrepancies Risk (5% weight) - gaps in dates or sudden skill pivots

Calculate a weighted overall score (0 to 100) and map it to an overall letter grade:
- A (90-100): Excellent, highly matching
- B (80-89): Strong match, minor edits
- C (70-79): Moderate match, requires tailoring
- D (60-69): Weak match, substantial rewriting needed
- F (Below 60): Major mismatch

Provide this scorecard strictly as a JSON object inside the designated \`\`\`json block.

### 3. The LaTeX Mutation Engine (Critical Constraints)
You must rewrite specific structural text blocks of the LaTeX resume (Professional Summary, Experience Bullet Points, and Skills arrays) to align with the target JD.
CRITICAL LA-TEX RULES:
- DO NOT break the document compilation hierarchy.
- DO NOT modify the document class, margins, package inclusions, custom macros, colors, or page geometries.
- DO NOT alter layout structures such as \\begin{document}, \\end{document}, \\begin{itemize}, \\end{itemize}, \\item, or custom command labels like \\resumeSubheading, \\resumeProjectHeading, \\resumeItemListStart, or \\resumeItemListEnd.
- Strictly update the **text nodes** inside these environments. Keep the wording organic, clean, and filled with action verbs and quantifiable metrics where applicable.
- Emphasize keywords contextually from the JD.
- Keep the overall length compatible with the original page limit (typically 1 page). Avoid expanding text lines unless necessary.

---
RESPONSE FORMAT LAYOUT (YOU MUST STRICTLY FOLLOW THIS PATTERN):

<<<EVALUATION_START>>>
#### Role Summary
[Write here...]

#### CV Match Assessment
[Write here...]

#### Level Strategy
[Write here...]

#### Compensation & Salary Research
[Write here...]

#### Personalization Blueprint
[Write here...]

#### Interview STAR Prep
[Write here...]
<<<EVALUATION_END>>>

<<<SCORECARD_START>>>
\`\`\`json
{
  "overallGrade": "B",
  "overallScore": 84,
  "dimensions": [
    { "name": "Hard Skills Coverage", "score": 85, "feedback": "..." },
    { "name": "Soft Skills Alignment", "score": 90, "feedback": "..." },
    { "name": "Impact Metrics & Numbers", "score": 75, "feedback": "..." },
    { "name": "Action Verbs Density", "score": 80, "feedback": "..." },
    { "name": "Structural & Margins Readability", "score": 95, "feedback": "..." },
    { "name": "Keywords Matching Density", "score": 78, "feedback": "..." },
    { "name": "Scope/Scale Fit", "score": 82, "feedback": "..." },
    { "name": "Domain & Industry Experience", "score": 88, "feedback": "..." },
    { "name": "LaTeX Formatting Hygiene", "score": 98, "feedback": "..." },
    { "name": "Gaps & Discrepancies Risk", "score": 90, "feedback": "..." }
  ]
}
\`\`\`
<<<SCORECARD_END>>>

<<<MUTATED_LATEX_START>>>
\`\`\`latex
[Paste the complete modified LaTeX code here...]
\`\`\`
<<<MUTATED_LATEX_END>>>
`;

/**
 * Custom parser to extract blocks from the structured Markdown response
 */
export function parseModelResponse(rawText: string): OptimizationResponse {
  try {
    // Extract Evaluation
    const evalStartIdx = rawText.indexOf('<<<EVALUATION_START>>>');
    const evalEndIdx = rawText.indexOf('<<<EVALUATION_END>>>');
    let evalText = '';

    if (evalStartIdx !== -1 && evalEndIdx !== -1) {
      evalText = rawText.slice(evalStartIdx + '<<<EVALUATION_START>>>'.length, evalEndIdx).trim();
    } else {
      evalText = rawText; // fallback
    }

    const blocks = {
      roleSummary: extractHeadingSection(evalText, 'Role Summary'),
      cvMatch: extractHeadingSection(evalText, 'CV Match Assessment'),
      levelStrategy: extractHeadingSection(evalText, 'Level Strategy'),
      compResearch: extractHeadingSection(evalText, 'Compensation & Salary Research'),
      personalizationBlueprint: extractHeadingSection(evalText, 'Personalization Blueprint'),
      interviewSTAR: extractHeadingSection(evalText, 'Interview STAR Prep'),
    };

    // Extract Scorecard JSON
    const scoreStartIdx = rawText.indexOf('<<<SCORECARD_START>>>');
    const scoreEndIdx = rawText.indexOf('<<<SCORECARD_END>>>');
    let scorecard = {
      overallGrade: 'C',
      overallScore: 70,
      dimensions: [] as DimensionScore[],
    };

    if (scoreStartIdx !== -1 && scoreEndIdx !== -1) {
      const scoreSubStr = rawText.slice(scoreStartIdx + '<<<SCORECARD_START>>>'.length, scoreEndIdx);
      const jsonMatch = scoreSubStr.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        scorecard = JSON.parse(jsonMatch[1].trim());
      }
    }

    // Extract LaTeX Code
    const latexStartIdx = rawText.indexOf('<<<MUTATED_LATEX_START>>>');
    const latexEndIdx = rawText.indexOf('<<<MUTATED_LATEX_END>>>');
    let optimizedTex = '';

    if (latexStartIdx !== -1 && latexEndIdx !== -1) {
      const latexSubStr = rawText.slice(latexStartIdx + '<<<MUTATED_LATEX_START>>>'.length, latexEndIdx);
      const latexMatch = latexSubStr.match(/```latex\s*([\s\S]*?)\s*```/) || latexSubStr.match(/```tex\s*([\s\S]*?)\s*```/);
      if (latexMatch && latexMatch[1]) {
        optimizedTex = latexMatch[1].trim();
      } else {
        // Fallback if no matching standard block, clean up boundary marks
        optimizedTex = latexSubStr.replace(/```latex|```tex|```/g, '').trim();
      }
    }

    if (!optimizedTex) {
      // General regex search if markers failed
      const fallbackMatch = rawText.match(/```latex\s*([\s\S]*?)\s*```/) || rawText.match(/```tex\s*([\s\S]*?)\s*```/);
      if (fallbackMatch && fallbackMatch[1]) {
        optimizedTex = fallbackMatch[1].trim();
      }
    }

    return {
      evaluation: blocks,
      scorecard,
      optimizedTex: optimizedTex || '% Mutate failed, check raw response'
    };
  } catch (error) {
    console.error('Failed to parse AI response: ', error);
    throw new Error('LLM response parsing failed. Ensure you have valid keys and try again.', { cause: error });
  }
}

/**
 * Extracts content following a specific heading in markdown
 */
function extractHeadingSection(source: string, heading: string): string {
  const lines = source.split('\n');
  let capturing = false;
  const resultLines: string[] = [];

  for (const line of lines) {
    if (line.includes(`#### ${heading}`) || line.includes(`### ${heading}`) || line.includes(`**${heading}**`)) {
      capturing = true;
      continue;
    }

    // Stop capturing when hitting the next heading
    if (capturing && (line.startsWith('#### ') || line.startsWith('### ') || line.startsWith('<<<'))) {
      break;
    }

    if (capturing) {
      resultLines.push(line);
    }
  }

  const finalStr = resultLines.join('\n').trim();
  return finalStr || `No specific assessment for ${heading}.`;
}

/**
 * Calls Gemini client-side directly
 */
async function callGemini(apiKey: string, masterTex: string, jobDesc: string, userTweak: string): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `
  MASTER LATEX RESUME:
  ${masterTex}

  TARGET JOB DESCRIPTION:
  ${jobDesc}

  USER OPTIMIZATION TWEAKS / STRATEGIC PREFERENCES:
  ${userTweak || 'None specified. Perform standard high-performance alignment.'}
  `;

  const payload = {
    contents: [
      {
        parts: [
          { text: SYSTEM_PROMPT },
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1, // low temperature to ensure LaTeX hierarchy logic isn't broken by erratic creative additions
      maxOutputTokens: 8192
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API returned error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini API returned empty response.');
  }

  return rawText;
}

/**
 * Calls Anthropic client-side directly
 */
async function callAnthropic(apiKey: string, masterTex: string, jobDesc: string, userTweak: string): Promise<string> {
  const endpoint = 'https://api.anthropic.com/v1/messages';

  const prompt = `
  MASTER LATEX RESUME:
  ${masterTex}

  TARGET JOB DESCRIPTION:
  ${jobDesc}

  USER OPTIMIZATION TWEAKS / STRATEGIC PREFERENCES:
  ${userTweak || 'None specified. Perform standard high-performance alignment.'}
  `;

  // We require client-side headers to bypass standard proxy restrictions
  // Note: To avoid CORS blocks with Anthropic's server from client-side direct scripts,
  // we instruct the user to configure keys. If Anthropic strictly blocks CORS from web origins,
  // we add custom error guidance suggesting Anthropic can be used with local bypass flags or recommending Gemini.
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'dangerously-allow-developer-only-headers-in-prod': 'true' // if using client
    } as Record<string, string>,
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      temperature: 0.1,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid Anthropic API Key or CORS block. For client-only apps, Google Gemini is recommended as it natively supports client requests via Web API.');
    }
    throw new Error(errData?.error?.message || `Anthropic API returned error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text;
  if (!rawText) {
    throw new Error('Anthropic API returned empty response.');
  }

  return rawText;
}

/**
 * Calls the local Gemini CLI proxy middleware
 */
async function callLocalCli(masterTex: string, jobDesc: string, userTweak: string): Promise<string> {
  const fullPrompt = `${SYSTEM_PROMPT}

  MASTER LATEX RESUME:
  ${masterTex}

  TARGET JOB DESCRIPTION:
  ${jobDesc}

  USER OPTIMIZATION TWEAKS / STRATEGIC PREFERENCES:
  ${userTweak || 'None specified. Perform standard high-performance alignment.'}
  `;

  // Detect if running inside Tauri desktop environment
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  if (isTauri) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<string>('run_gemini_cli', { prompt: fullPrompt });
    } catch (err) {
      console.error('Tauri native run_gemini_cli command failed:', err);
      throw new Error(`Tauri native execution failed: ${err}`);
    }
  }

  const response = await fetch('/api/gemini-cli', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: fullPrompt })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || `Local Gemini CLI returned error: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.rawText) {
    throw new Error('Local Gemini CLI returned an empty response.');
  }

  return data.rawText;
}

/**
 * Main Orchestrator Tailoring Action
 */
export async function tailorResume(
  modelProvider: 'gemini' | 'claude' | 'cli',
  apiKey: string,
  masterTex: string,
  jobDesc: string,
  userTweak: string,
  onProgress?: (progressMessage: string) => void
): Promise<OptimizationResponse> {

  if (modelProvider !== 'cli' && !apiKey) {
    throw new Error(`Please configure your API key in settings for ${modelProvider === 'gemini' ? 'Google Gemini' : 'Anthropic Claude'}.`);
  }
  if (!masterTex.trim()) {
    throw new Error('Please provide your Master LaTeX Resume.');
  }
  if (!jobDesc.trim()) {
    throw new Error('Please provide the target Job Description.');
  }

  try {
    if (onProgress) onProgress('[1/3] Parsing inputs & aligning prompts...');

    let rawResult = '';
    if (modelProvider === 'gemini') {
      if (onProgress) onProgress('[2/3] Calling Gemini model & evaluating dimensions...');
      rawResult = await callGemini(apiKey, masterTex, jobDesc, userTweak);
    } else if (modelProvider === 'claude') {
      if (onProgress) onProgress('[2/3] Calling Claude 3.5 Sonnet & evaluating dimensions...');
      rawResult = await callAnthropic(apiKey, masterTex, jobDesc, userTweak);
    } else {
      if (onProgress) onProgress('[2/3] Executing local Gemini CLI in keyless mode...');
      rawResult = await callLocalCli(masterTex, jobDesc, userTweak);
    }

    if (onProgress) onProgress('[3/3] Mutating LaTeX code nodes & structure...');
    const parsedData = parseModelResponse(rawResult);

    return parsedData;
  } catch (error) {
    const err = error as Error;
    console.error('Tailoring service error: ', err);
    throw new Error(err.message || 'Optimization failed due to API connection failure.', { cause: error });
  }
}
