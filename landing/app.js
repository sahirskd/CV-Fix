/* ==========================================================================
   CV-Fix Landing Page — Interactive UI Miniatures, Runtime Card & Navigation
   ========================================================================== */

(() => {
  const RELEASES_URL = 'https://github.com/sahirskd/CV-Fix/releases/latest';

  /* ------------------------------------------------------------------------
     1. Responsive Floating Navbar (single semantic <nav>, native popover)
     ------------------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  const headerInner = header?.querySelector('.header-inner');
  const menuBtn = header?.querySelector('.menu-button');
  const siteMenu = document.getElementById('site-menu');
  const supportsPopover = Object.hasOwn(HTMLElement.prototype, 'popover');

  let lastCollapsedWidth = 0;

  function syncNavLayout() {
    if (!header || !headerInner || !siteMenu || !menuBtn) return;

    const currentlyWide = header.classList.contains('is-wide');
    if (!currentlyWide && header.clientWidth <= lastCollapsedWidth) {
      return;
    }

    const wasOpen = supportsPopover && siteMenu.matches(':popover-open');

    header.classList.add('is-measuring', 'is-wide');
    siteMenu.removeAttribute('popover');
    siteMenu.hidden = false;

    const fitsInline = headerInner.scrollWidth <= Math.min(window.innerWidth - 32, 740);

    if (fitsInline) {
      header.classList.add('is-wide');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      header.classList.remove('is-wide');
      lastCollapsedWidth = header.clientWidth;
      if (supportsPopover) {
        siteMenu.setAttribute('popover', 'auto');
        if (wasOpen) siteMenu.showPopover();
      } else {
        siteMenu.hidden = menuBtn.getAttribute('aria-expanded') !== 'true';
      }
    }

    requestAnimationFrame(() => {
      header.classList.remove('is-measuring');
    });
  }

  if (header && headerInner && siteMenu && menuBtn) {
    if (!supportsPopover) {
      siteMenu.removeAttribute('popover');
      menuBtn.addEventListener('click', () => {
        const nextOpen = menuBtn.getAttribute('aria-expanded') !== 'true';
        menuBtn.setAttribute('aria-expanded', String(nextOpen));
        siteMenu.hidden = !nextOpen;
      });
    } else {
      siteMenu.addEventListener('toggle', (event) => {
        menuBtn.setAttribute('aria-expanded', String(event.newState === 'open'));
      });
    }

    siteMenu.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('a') && !header.classList.contains('is-wide')) {
        if (supportsPopover && siteMenu.matches(':popover-open')) {
          siteMenu.hidePopover();
        } else if (!supportsPopover) {
          siteMenu.hidden = true;
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    const ro = new ResizeObserver(() => syncNavLayout());
    ro.observe(document.documentElement);
    ro.observe(headerInner);
    syncNavLayout();
  }

  /* ------------------------------------------------------------------------
     2. Accessible Tablist Helper (Selection + Arrow/Home/End Navigation)
     ------------------------------------------------------------------------ */
  function bindTablist(tablist, onSelect) {
    if (!tablist) return;
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    if (tabs.length === 0) return;

    function activateTab(nextTab, moveFocus = false) {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.setAttribute('aria-selected', String(selected));
      });
      if (moveFocus) nextTab.focus();
      onSelect(nextTab);
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab, false));
      tab.addEventListener('keydown', (event) => {
        const idx = tabs.indexOf(tab);
        let nextIdx = -1;
        if (event.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIdx = 0;
        else if (event.key === 'End') nextIdx = tabs.length - 1;

        if (nextIdx !== -1) {
          event.preventDefault();
          activateTab(tabs[nextIdx], true);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Hero Workstation Center Tabs
     ------------------------------------------------------------------------ */
  const heroTablist = document.querySelector('[aria-label="Hero workstation center view"]');
  const heroPanels = Array.from(document.querySelectorAll('[data-hero-panel]'));

  bindTablist(heroTablist, (selectedTab) => {
    const target = selectedTab.dataset.heroTab;
    heroPanels.forEach((panel) => {
      const active = panel.dataset.heroPanel === target;
      panel.hidden = !active;
      if (active) panel.setAttribute('tabindex', '0');
      else panel.removeAttribute('tabindex');
    });
  });

  /* ------------------------------------------------------------------------
     4. Feature Card 1: Zero-Breakage LaTeX Mutation Diff Toggle
     ------------------------------------------------------------------------ */
  const diffStage = document.querySelector('[data-mini="latex-diff"]');
  if (diffStage) {
    const diffBtns = Array.from(diffStage.querySelectorAll('[data-diff-mode]'));
    const diffCode = diffStage.querySelector('[data-diff-code]');
    const diffStatus = diffStage.querySelector('[data-diff-status]');

    const DIFF_VIEWS = {
      original: {
        status: 'Master Template · Unmodified',
        lines: [
          { cls: 'code-line code-line--locked', parts: [['tex-cmd', '\\resumeSubheading'], ['', '{CloudOps Technologies}{Remote}{Software Engineer}{2022--Present}']] },
          { cls: 'code-line code-line--locked', parts: [['tex-cmd', '\\resumeItemListStart']] },
          { cls: 'code-line', parts: [['tex-cmd', '\\resumeItem'], ['', '{Built backend pipelines using TypeScript, optimizing query response times by 35\\%.}']] },
          { cls: 'code-line', parts: [['tex-cmd', '\\resumeItem'], ['', '{Worked with DevOps teams to deploy apps on AWS, shortening CI pipelines from 25m to 8m.}']] },
          { cls: 'code-line code-line--locked', parts: [['tex-cmd', '\\resumeItemListEnd']] },
        ],
      },
      tailored: {
        status: 'Macros Locked · 0 Syntax Errors',
        lines: [
          { cls: 'code-line code-line--locked', parts: [['tex-cmd', '\\resumeSubheading'], ['', '{CloudOps Technologies}{Remote}{Software Engineer}{2022--Present}']] },
          { cls: 'code-line code-line--locked', parts: [['tex-cmd', '\\resumeItemListStart']] },
          { cls: 'code-line code-line--mutated', parts: [['tex-cmd', '\\resumeItem'], ['', '{'], ['tex-arg', 'Architected low-latency TypeScript'], ['', ' backend pipelines, cutting p95 query response time by '], ['tex-arg', '35\\%'], ['', '.}']] },
          { cls: 'code-line code-line--mutated', parts: [['tex-cmd', '\\resumeItem'], ['', '{'], ['tex-arg', 'Automated multi-stage AWS CI/CD'], ['', ' delivery, shrinking deploy times from 25m down to '], ['tex-arg', '8m'], ['', '.}']] },
          { cls: 'code-line code-line--locked', parts: [['tex-cmd', '\\resumeItemListEnd']] },
        ],
      },
    };

    diffBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.diffMode;
        const data = DIFF_VIEWS[mode];
        if (!data || !diffCode || !diffStatus) return;

        diffBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        diffStatus.textContent = data.status;

        diffCode.replaceChildren(
          ...data.lines.map((line) => {
            const span = document.createElement('span');
            span.className = line.cls;
            line.parts.forEach(([cls, text]) => {
              if (cls) {
                const token = document.createElement('span');
                token.className = cls;
                token.textContent = text;
                span.appendChild(token);
              } else {
                span.appendChild(document.createTextNode(text));
              }
            });
            return span;
          })
        );
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Feature Card 2: Interactive A4 Facsimile Zoom & Print Actions
     ------------------------------------------------------------------------ */
  const a4Stage = document.querySelector('[data-mini="a4-preview"]');
  if (a4Stage) {
    const zoomInput = document.getElementById('mini-zoom-range');
    const zoomLabel = a4Stage.querySelector('[data-zoom-label]');
    const zoomSheet = a4Stage.querySelector('[data-zoom-sheet]');
    const feedback = a4Stage.querySelector('[data-a4-feedback]');
    const actionBtns = Array.from(a4Stage.querySelectorAll('[data-a4-action]'));

    if (zoomInput && zoomLabel && zoomSheet) {
      zoomInput.addEventListener('input', () => {
        const pct = Number(zoomInput.value);
        zoomLabel.textContent = `${pct}%`;
        zoomSheet.style.transform = `scale(${pct / 100})`;
      });
    }

    actionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!feedback) return;
        feedback.textContent =
          btn.dataset.a4Action === 'pdf'
            ? 'Triggered @media print A4 sheet layout (monochrome print-ready).'
            : 'Prepared tailored_resume.tex bundle for download or Overleaf.';
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Feature Card 3: 10-Dimension Scorecard Before / After Morph
     ------------------------------------------------------------------------ */
  const scoreStage = document.querySelector('[data-mini="scorecard"]');
  if (scoreStage) {
    const scoreBtns = Array.from(scoreStage.querySelectorAll('[data-score-mode]'));
    const gradeEl = scoreStage.querySelector('[data-score-grade]');
    const indexEl = scoreStage.querySelector('[data-score-index]');
    const summaryEl = scoreStage.querySelector('[data-score-summary]');
    const verdictEl = scoreStage.querySelector('[data-score-verdict]');

    const SCORE_STATES = {
      before: {
        grade: 'C',
        overall: 71,
        summary: 'Grade C · 71%',
        verdict: 'Moderate match — missing JD keywords & quantifiable scale',
        gradient: 'linear-gradient(135deg, #a78bfa, #fbbf24)',
        dims: [68, 60, 58, 72, 74, 100],
      },
      after: {
        grade: 'A',
        overall: 93,
        summary: 'Grade A · 93%',
        verdict: 'Excellent match — tailored metrics & keywords aligned',
        gradient: 'linear-gradient(135deg, #00d4ff, #34d399)',
        dims: [95, 92, 94, 90, 88, 100],
      },
    };

    scoreBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const state = SCORE_STATES[btn.dataset.scoreMode];
        if (!state) return;

        scoreBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        if (gradeEl) {
          gradeEl.textContent = state.grade;
          gradeEl.style.background = state.gradient;
        }
        if (indexEl) indexEl.textContent = `${state.overall}% Weighted Match Index`;
        if (summaryEl) summaryEl.textContent = state.summary;
        if (verdictEl) verdictEl.textContent = state.verdict;

        state.dims.forEach((pct, i) => {
          const valEl = scoreStage.querySelector(`[data-dim-val="${i}"]`);
          const barEl = scoreStage.querySelector(`[data-dim-bar="${i}"]`);
          if (valEl) valEl.textContent = `${pct}%`;
          if (barEl) barEl.style.width = `${pct}%`;
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Feature Card 4: 6-Block Recruiter Brief Tabs
     ------------------------------------------------------------------------ */
  const briefStage = document.querySelector('[data-mini="recruiter-brief"]');
  if (briefStage) {
    const briefTablist = briefStage.querySelector('[role="tablist"]');
    const kickerEl = briefStage.querySelector('[data-brief-kicker]');
    const titleEl = briefStage.querySelector('[data-brief-title]');
    const bodyEl = briefStage.querySelector('[data-brief-body]');

    const BRIEF_BLOCKS = [
      {
        kicker: 'Block 1 of 6 · Role Mission Summary',
        title: 'Core Engineering Mandate',
        body: 'Own core TypeScript/Node.js backend pipelines and frontend performance (Core Web Vitals / LCP) on a lean platform squad scaling automated AWS delivery.',
      },
      {
        kicker: 'Block 2 of 6 · Primary Strengths & Gaps',
        title: 'Strong Systems Fit · Minor Observability Gap',
        body: 'Matches React, TypeScript, and CI/CD acceleration (25m to 8m). Add explicit OpenTelemetry or p95 latency monitoring examples in bullet 2.',
      },
      {
        kicker: 'Block 3 of 6 · Seniority Level Strategy',
        title: 'Frame as Senior Individual Contributor',
        body: 'Lead bullets with architecture ownership and cross-team DevOps coordination rather than ticket execution to anchor Senior-band evaluation.',
      },
      {
        kicker: 'Block 4 of 6 · Compensation & Salary Estimates',
        title: 'Leverage High-Value Automation Metrics',
        body: 'Market benchmark indicates $165K–$205K base (US Remote). Highlight 40% LCP boost and CI cycle time cuts to negotiate top-quartile comp.',
      },
      {
        kicker: 'Block 5 of 6 · Personalization Blueprint',
        title: 'Mutation Directives Applied',
        body: 'Emphasize distributed backend latency, React Core Web Vitals optimization, and zero-downtime AWS deployment speed within 1-page constraints.',
      },
      {
        kicker: 'Block 6 of 6 · STAR Interview Outline',
        title: '3 Ready Behavioral & Architecture Prompts',
        body: 'Prepared STAR outlines covering: (1) Monolith-to-modular React LCP migration (+40%), (2) TypeScript query bottleneck triage (-35%), (3) CI pipeline overhaul.',
      },
    ];

    bindTablist(briefTablist, (selectedTab) => {
      const idx = Number(selectedTab.dataset.briefTab);
      const block = BRIEF_BLOCKS[idx];
      if (!block) return;
      if (kickerEl) kickerEl.textContent = block.kicker;
      if (titleEl) titleEl.textContent = block.title;
      if (bodyEl) bodyEl.textContent = block.body;
    });
  }

  /* ------------------------------------------------------------------------
     8. Feature Card 5: ATS Scraping + Standing Tweak Bar Simulator
     ------------------------------------------------------------------------ */
  const atsStage = document.querySelector('[data-mini="ats-tweak"]');
  if (atsStage) {
    const atsBtns = Array.from(atsStage.querySelectorAll('[data-ats]'));
    const tweakBtns = Array.from(atsStage.querySelectorAll('[data-tweak]'));
    const urlEl = atsStage.querySelector('[data-ats-url]');
    const outEl = atsStage.querySelector('[data-ats-output]');

    const ATS_SOURCES = {
      ashby: {
        url: 'https://jobs.ashbyhq.com/linear/staff-frontend-engineer',
        role: 'Staff Frontend Engineer (Ashby)',
      },
      greenhouse: {
        url: 'https://boards.greenhouse.io/vercel/jobs/5912041',
        role: 'Senior DX Platform Engineer (Greenhouse)',
      },
      lever: {
        url: 'https://jobs.lever.co/stripe/9c4a120e-backend-systems',
        role: 'Backend Infrastructure Engineer (Lever)',
      },
      linkedin: {
        url: 'https://www.linkedin.com/jobs/view/3984210754',
        role: 'Full-Stack Architect (LinkedIn)',
      },
    };

    const TWEAKS = {
      leadership: 'Emphasize cross-team architecture & frontend mentorship',
      onepage: 'Condense bullet phrasing cleanly to preserve a strict 1-page fit',
      metrics: 'Prioritize quantifiable latency, throughput & deployment numbers',
    };

    let activeAts = 'ashby';
    let activeTweak = 'leadership';

    function renderAtsOutput() {
      const src = ATS_SOURCES[activeAts];
      if (urlEl) urlEl.textContent = src.url;
      if (outEl) {
        outEl.replaceChildren();
        const strong = document.createElement('strong');
        strong.textContent = 'Active Directive: ';
        const em = document.createElement('em');
        em.textContent = src.role;
        const code = document.createElement('code');
        code.textContent = `"${TWEAKS[activeTweak]}"`;
        outEl.append(strong, 'Parsed ', em, '. Applying tweak: ', code, '.');
      }
    }

    atsBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeAts = btn.dataset.ats;
        atsBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        renderAtsOutput();
      });
    });

    tweakBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTweak = btn.dataset.tweak;
        tweakBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        renderAtsOutput();
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. Feature Card 6: AI Execution Engine Switcher
     ------------------------------------------------------------------------ */
  const engineStage = document.querySelector('[data-mini="engine"]');
  if (engineStage) {
    const engineBtns = Array.from(engineStage.querySelectorAll('[data-engine]'));
    const nameEl = engineStage.querySelector('[data-engine-name]');
    const authEl = engineStage.querySelector('[data-engine-auth]');
    const descEl = engineStage.querySelector('[data-engine-desc]');

    const ENGINES = {
      gemini: {
        name: 'Google Gemini 2.0 Flash (Web API)',
        auth: 'BYOK IN INDEXEDDB',
        desc: 'Fast, CORS-friendly direct browser calls using your locally saved Gemini API key. Ideal for Web PWA mode with zero intermediary server.',
      },
      claude: {
        name: 'Anthropic Claude 3.5 Sonnet (Web API)',
        auth: 'BYOK IN INDEXEDDB',
        desc: 'Deep structural reasoning for nuanced LaTeX rewrites and recruiter evaluation blocks, authenticated directly with your local Anthropic key.',
      },
      cli: {
        name: 'Keyless Local Gemini CLI (Tauri / Dev)',
        auth: 'NO API KEY REQUIRED',
        desc: 'Executes `gemini -p <prompt> --skip-trust --yolo` locally via Tauri Rust (`run_gemini_cli`). Credentials never touch a browser bundle or external backend.',
      },
    };

    engineBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const info = ENGINES[btn.dataset.engine];
        if (!info) return;
        engineBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        if (nameEl) nameEl.textContent = info.name;
        if (authEl) authEl.textContent = info.auth;
        if (descEl) descEl.textContent = info.desc;
      });
    });
  }

  /* ------------------------------------------------------------------------
     10. Centerpiece Runtime Selector (#runtimes)
     ------------------------------------------------------------------------ */
  const runtimeSection = document.getElementById('runtimes');
  if (runtimeSection) {
    const rtBtns = Array.from(runtimeSection.querySelectorAll('[data-runtime]'));
    const titleEl = runtimeSection.querySelector('[data-runtime-title]');
    const calloutTitleEl = runtimeSection.querySelector('[data-runtime-callout-title]');
    const calloutSubEl = runtimeSection.querySelector('[data-runtime-callout-sub]');
    const listEl = runtimeSection.querySelector('[data-runtime-list]');
    const ctaEl = runtimeSection.querySelector('[data-runtime-cta]');
    const footnoteEl = runtimeSection.querySelector('[data-runtime-footnote]');

    const RUNTIMES = {
      pwa: {
        title: 'CV-Fix Local Web PWA',
        calloutTitle: 'Run locally via Vite / Static Bundle · Zero Hosted SaaS',
        calloutSub: 'git clone sahirskd/CV-Fix && npm install && npm run dev',
        items: [
          'Offline-capable Progressive Web App in any modern browser',
          'Bring-your-own Gemini 2.0 Flash or Claude 3.5 Sonnet key',
          'All resumes, keys & match history stored in IndexedDB',
          'Instant @media print A4 PDF export & .tex download',
        ],
        ctaLabel: 'Get Source & Releases on GitHub',
        footnote: 'MIT License · Self-run locally from GitHub Releases or source',
      },
      macos: {
        title: 'CV-Fix macOS Desktop App',
        calloutTitle: 'Native Tauri v2 (.dmg / .app) · v1.0.3',
        calloutSub: 'Apple Silicon & Intel builds via GitHub Releases',
        items: [
          'Native macOS window powered by Rust & Tauri v2',
          'Supports keyless local gemini CLI execution',
          'Local IndexedDB history, Master CV & API key storage',
          'All 10 scorecard dims & 6 recruiter blocks unlocked',
        ],
        ctaLabel: 'Download macOS Release (v1.0.3)',
        footnote: 'MIT License · Download verified builds from GitHub Releases',
      },
      cli: {
        title: 'CV-Fix + Keyless Local Gemini CLI',
        calloutTitle: 'Headless Terminal Execution · Zero Web API Keys',
        calloutSub: 'gemini -p "<prompt>" --skip-trust --yolo (Tauri / Dev)',
        items: [
          'Detects local gemini binary automatically on login PATH',
          'Runs inside Tauri sandbox or Vite dev proxy middleware',
          'Zero API keys stored inside browser storage or bundles',
          'Full 3-phase prompt orchestration & 10-dim JSON parsing',
        ],
        ctaLabel: 'Download Desktop App for CLI Mode',
        footnote: 'MIT License · Requires gemini CLI installed locally on macOS/Dev',
      },
    };

    rtBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const data = RUNTIMES[btn.dataset.runtime];
        if (!data) return;

        rtBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        if (titleEl) titleEl.textContent = data.title;
        if (calloutTitleEl) calloutTitleEl.textContent = data.calloutTitle;
        if (calloutSubEl) calloutSubEl.textContent = data.calloutSub;
        if (ctaEl) {
          ctaEl.textContent = data.ctaLabel;
          ctaEl.setAttribute('href', RELEASES_URL);
        }
        if (footnoteEl) footnoteEl.textContent = data.footnote;

        if (listEl) {
          listEl.replaceChildren(
            ...data.items.map((text) => {
              const li = document.createElement('li');
              const dot = document.createElement('span');
              dot.className = 'check-dot';
              dot.setAttribute('aria-hidden', 'true');
              dot.textContent = '✓';
              const copy = document.createElement('span');
              copy.textContent = text;
              li.append(dot, copy);
              return li;
            })
          );
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     11. Accessible FAQ Accordion (#faq — hidden="until-found" + beforematch)
     ------------------------------------------------------------------------ */
  const faqTriggers = Array.from(document.querySelectorAll('.faq-trigger'));
  faqTriggers.forEach((trigger) => {
    const item = trigger.closest('.faq-item');
    const panel = item?.querySelector('.faq-panel');
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen ? 'until-found' : false;
    });

    panel.addEventListener('beforematch', () => {
      trigger.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    });
  });
})();
