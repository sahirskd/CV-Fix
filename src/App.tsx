import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Briefcase,
  Code2,
  Download,
  FileText,
  KeyRound,
  RefreshCw,
  Settings,
  Sparkles,
  Copy,
  Check,
  Sliders,
  Info,
  Layers,
  Award,
  FileCode,
  Sun,
  Moon
} from 'lucide-react';

import {
  getMasterLatex,
  saveMasterLatex,
  getApiKey,
  saveApiKey,
  getSelectedModel,
  saveSelectedModel,
  getPromptTweak,
  savePromptTweak,
  getHistory,
  addHistoryRecord,
  DEFAULT_LATEX_TEMPLATE
} from './services/db';
import type { OptimizationRecord } from './services/db';

import { scrapeJobDescription } from './services/scraper';
import { tailorResume } from './services/orchestrator';
import type { OptimizationResponse } from './services/orchestrator';
import { parseLatexToHtml } from './services/latexRenderer';

export default function App() {
  // PWA/Storage states
  const [masterLatex, setMasterLatex] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [anthropicKey, setAnthropicKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'claude' | 'cli'>('gemini');
  const [isCliAvailable, setIsCliAvailable] = useState<boolean>(false);
  const [promptTweak, setPromptTweak] = useState<string>('');
  const [, setHistory] = useState<OptimizationRecord[]>([]);

  // Theme Switching state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Job Description Ingestion States
  const [jobUrl, setJobUrl] = useState<string>('');
  const [jobText, setJobText] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeError, setScrapeError] = useState<string>('');

  // Tailoring Workflow States
  const [isTailoring, setIsTailoring] = useState<boolean>(false);
  const [tailorStep, setTailorStep] = useState<string>('');
  const [tailorError, setTailorError] = useState<string>('');

  // Results States
  const [optimizedLatex, setOptimizedLatex] = useState<string>('');
  const [scorecard, setScorecard] = useState<OptimizationResponse['scorecard'] | null>(null);
  const [evaluation, setEvaluation] = useState<OptimizationResponse['evaluation'] | null>(null);

  // Settings & Tabs UI
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'code' | 'preview'>('preview');
  const [activeMobileTab, setActiveMobileTab] = useState<'inputs' | 'code' | 'preview' | 'scores'>('inputs');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(100);

  // References
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Column resizing states for desktop layout
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [leftWidth, setLeftWidth] = useState<number>(33); // 33% initial
  const [rightWidth, setRightWidth] = useState<number>(25); // 25% initial
  const [isResizingLeft, setIsResizingLeft] = useState<boolean>(false);
  const [isResizingRight, setIsResizingRight] = useState<boolean>(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Monitor desktop layout size activation
  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Handle column resizing calculations
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mainContainerRef.current) return;
      const rect = mainContainerRef.current.getBoundingClientRect();
      const totalWidth = rect.width;

      if (isResizingLeft) {
        const newLeftX = e.clientX - rect.left;
        // Limit range between 15% and 50%
        const newLeftWidthPercent = Math.max(15, Math.min(50, (newLeftX / totalWidth) * 100));
        setLeftWidth(newLeftWidthPercent);
      }

      if (isResizingRight) {
        const newRightX = rect.right - e.clientX;
        // Limit range between 15% and 40%
        const newRightWidthPercent = Math.max(15, Math.min(40, (newRightX / totalWidth) * 100));
        setRightWidth(newRightWidthPercent);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isResizingLeft, isResizingRight]);

  // Load initial settings from IndexedDB on startup
  useEffect(() => {
    async function loadData() {
      const latex = await getMasterLatex();
      setMasterLatex(latex);

      const gKey = await getApiKey('gemini');
      setGeminiKey(gKey);

      const aKey = await getApiKey('anthropic');
      setAnthropicKey(aKey);

      const model = await getSelectedModel();
      setSelectedModel(model);

      const tweak = await getPromptTweak();
      setPromptTweak(tweak);

      const hist = await getHistory();
      setHistory(hist);

      // If there is past history, load the most recent optimization result
      if (hist.length > 0) {
        setOptimizedLatex(hist[0].optimizedTex);
        setScorecard(hist[0].scorecard);
        setEvaluation(hist[0].evaluation);
      }

      // Check if local Gemini CLI is available via status API
      try {
        const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
        if (isTauri) {
          const { invoke } = await import('@tauri-apps/api/core');
          const available = await invoke<boolean>('check_gemini_cli_status');
          if (available) {
            setIsCliAvailable(true);
          }
        } else {
          const res = await fetch('/api/gemini-cli/status');
          if (res.ok) {
            const data = await res.json();
            if (data.available) {
              setIsCliAvailable(true);
            }
          }
        }
      } catch (e) {
        console.log('Local keyless Gemini CLI is not active.', e);
      }
    }
    loadData();
  }, []);

  // Save changes to IndexedDB helpers
  const handleSaveMasterLatex = async (value: string | undefined) => {
    if (value !== undefined) {
      setMasterLatex(value);
      await saveMasterLatex(value);
    }
  };

  const handleSaveKeys = async () => {
    await saveApiKey('gemini', geminiKey);
    await saveApiKey('anthropic', anthropicKey);
    await saveSelectedModel(selectedModel);
    setShowSettings(false);
  };

  const handleResetTemplate = async () => {
    if (window.confirm('Reset Master LaTeX code to standard sample template?')) {
      setMasterLatex(DEFAULT_LATEX_TEMPLATE);
      await saveMasterLatex(DEFAULT_LATEX_TEMPLATE);
    }
  };

  // URL Scraping action
  const handleScrape = async () => {
    if (!jobUrl.trim()) return;
    setIsScraping(true);
    setScrapeError('');
    try {
      const result = await scrapeJobDescription(jobUrl);
      setJobText(result.description);
      // set title context if parsed
      setJobUrl(''); // Clear search bar
    } catch (err) {
      const error = err as Error;
      setScrapeError(error.message || 'Scraping failed.');
    } finally {
      setIsScraping(false);
    }
  };

  // Core Agentic Optimization run
  const handleOptimize = async () => {
    setTailorError('');
    setIsTailoring(true);

    if (selectedModel !== 'cli') {
      const activeKey = selectedModel === 'gemini' ? geminiKey : anthropicKey;
      if (!activeKey) {
        setIsTailoring(false);
        setShowSettings(true);
        setTailorError(`Please enter your ${selectedModel === 'gemini' ? 'Gemini' : 'Anthropic'} API key in Settings first!`);
        return;
      }
    }

    try {
      const activeKey = selectedModel === 'gemini' ? geminiKey : (selectedModel === 'claude' ? anthropicKey : '');
      const response = await tailorResume(
        selectedModel,
        activeKey,
        masterLatex,
        jobText,
        promptTweak,
        (progressMessage) => {
          setTailorStep(progressMessage);
        }
      );

      // Save results
      setOptimizedLatex(response.optimizedTex);
      setScorecard(response.scorecard);
      setEvaluation(response.evaluation);

      // Cache custom tweaks
      await savePromptTweak(promptTweak);

      // Add to IndexedDB history
      const newRecord: OptimizationRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        jobTitle: 'Tailored Optimization',
        companyName: selectedModel === 'gemini' ? 'Gemini AI Engine' : (selectedModel === 'claude' ? 'Claude 3.5 Engine' : 'Local Gemini CLI (Keyless)'),
        jobUrl: jobUrl,
        originalTex: masterLatex,
        optimizedTex: response.optimizedTex,
        evaluation: response.evaluation,
        scorecard: response.scorecard
      };

      await addHistoryRecord(newRecord);
      const updatedHistory = await getHistory();
      setHistory(updatedHistory);

      // Move viewports
      setActiveWorkspaceTab('preview');
      setActiveMobileTab('preview');

    } catch (err) {
      const error = err as Error;
      setTailorError(error.message || 'Tailoring failed.');
    } finally {
      setIsTailoring(false);
    }
  };

  // Export & download functions
  const handleCopyCode = () => {
    const code = optimizedLatex || masterLatex;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const code = optimizedLatex || masterLatex;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored_resume.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    // Beautiful, low-latency client-side PDF generation:
    // By invoking window.print on a dedicated high-fidelity window or print media block,
    // we bypass CORS limitations, heavy WASM rendering buffers, and compile instantly!
    window.print();
  };

  // Live render parsing
  const parsedLatex = parseLatexToHtml(optimizedLatex || masterLatex);

  return (
    <div className="min-h-screen bg-[#fafaf6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-200 flex flex-col font-sans antialiased overflow-x-hidden memphis-dots">

      {/* 1. Global Header Command Bar */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0B0F17] border-b-2 border-black dark:border-[#1E293B] px-4 py-3.5 flex justify-between items-center no-print">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-white dark:bg-[#1E293B] border-2 border-black rounded-lg flex items-center justify-center text-memphis-purple dark:text-memphis-pink shadow-[2px_2px_0_0_#000]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white m-0 leading-none font-poppins">
              Career<span className="text-memphis-pink">Ops</span> PWA
            </h1>
            <span className="text-[9px] text-slate-750 dark:text-slate-400 font-mono tracking-wider uppercase font-bold mt-1 block">
              your career operations hub
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Model provider quick-select dropdown */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as 'gemini' | 'claude' | 'cli')}
              className="bg-white dark:bg-[#131A26] text-slate-900 dark:text-slate-200 text-xs font-bold px-3 py-1.5 pr-8 border-2 border-black dark:border-[#1E293B] rounded-lg shadow-[2px_2px_0_0_#000] outline-none appearance-none cursor-pointer hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
            >
              <option className="bg-white dark:bg-[#131A26] text-slate-900 dark:text-slate-200" value="gemini">Gemini 2.0 Flash</option>
              <option className="bg-white dark:bg-[#131A26] text-slate-900 dark:text-slate-200" value="claude">Claude 3.5 Sonnet</option>
              {isCliAvailable && (
                <option className="bg-white dark:bg-[#131A26] text-slate-900 dark:text-slate-200" value="cli">Gemini CLI (Keyless)</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Theme select switch toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 btn-neubrutal-sec rounded-lg text-slate-800 dark:text-slate-300 hover:text-black dark:hover:text-white"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 btn-neubrutal-sec rounded-lg text-slate-800 dark:text-slate-300 hover:text-black dark:hover:text-white"
            title="API Settings"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* Settings Modal overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 no-print animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#131A26] border-2 border-black dark:border-[#1E293B] rounded-xl p-6 shadow-[8px_8px_0px_0px_#000000] relative">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center font-poppins">
              <KeyRound className="h-5 w-5 text-memphis-purple dark:text-memphis-teal mr-2" /> Credentials Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-750 dark:text-slate-400 mb-1.5 font-mono font-bold tracking-wider">GOOGLE GEMINI API KEY</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white dark:bg-[#0B0F17] border-2 border-black dark:border-[#1E293B] focus:border-memphis-teal rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-600 dark:placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-750 dark:text-slate-400 mb-1.5 font-mono font-bold tracking-wider">ANTHROPIC API KEY</label>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-api03..."
                  className="w-full bg-white dark:bg-[#0B0F17] border-2 border-black dark:border-[#1E293B] focus:border-memphis-teal rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-600 dark:placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-750 dark:text-slate-400 mb-1.5 font-mono font-bold tracking-wider">DEFAULT ACTIVE ENGINE</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as 'gemini' | 'claude' | 'cli')}
                  className="w-full bg-white dark:bg-[#0B0F17] border-2 border-black dark:border-[#1E293B] focus:border-memphis-teal rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 outline-none transition-all"
                >
                  <option className="bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-200" value="gemini">Google Gemini 2.0 Flash (Fast / CORS client friendly)</option>
                  <option className="bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-200" value="claude">Anthropic Claude 3.5 Sonnet (Deep optimization)</option>
                  {isCliAvailable && (
                    <option className="bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-200" value="cli">Local Gemini CLI (Keyless, local terminal execution)</option>
                  )}
                </select>
                {selectedModel === 'cli' && (
                  <div className="bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-lg p-3 text-xs leading-relaxed font-mono mt-3">
                    💡 <strong>CLI Mode Active</strong>: Career-Ops is utilizing your local Gemini CLI setup. No web API keys are required.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-xs font-bold btn-neubrutal-sec rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKeys}
                className="px-4 py-2 text-xs font-bold btn-neubrutal bg-memphis-pink text-slate-950 rounded-lg"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Workstation Body Layout */}
      {/* On desktop: side-by-side. On mobile: tabbed swipes */}
      <main
        ref={mainContainerRef}
        className="flex-1 w-full max-w-8xl mx-auto flex flex-col xl:flex-row p-4 xl:px-0 xl:gap-1.5 gap-6 no-print animate-fade-in"
      >

        {/* MOBILE NAVIGATION TABS (visible only on mobile sizes) */}
        <div className="xl:hidden flex bg-white dark:bg-[#131A26] border-2 border-black dark:border-[#1E293B] rounded-xl p-1 mb-4 no-print shadow-[3px_3px_0px_0px_#000]">
          <button
            onClick={() => setActiveMobileTab('inputs')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${activeMobileTab === 'inputs' ? 'bg-memphis-pink text-slate-950 border border-black shadow-[1px_1px_0_0_#000] font-extrabold' : 'text-slate-750 dark:text-slate-400'
              }`}
          >
            1. Inputs
          </button>
          <button
            onClick={() => setActiveMobileTab('code')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${activeMobileTab === 'code' ? 'bg-memphis-pink text-slate-950 border border-black shadow-[1px_1px_0_0_#000] font-extrabold' : 'text-slate-750 dark:text-slate-400'
              }`}
          >
            2. LaTeX
          </button>
          <button
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${activeMobileTab === 'preview' ? 'bg-memphis-pink text-slate-950 border border-black shadow-[1px_1px_0_0_#000] font-extrabold' : 'text-slate-750 dark:text-slate-400'
              }`}
          >
            3. Preview
          </button>
          <button
            onClick={() => setActiveMobileTab('scores')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${activeMobileTab === 'scores' ? 'bg-memphis-pink text-slate-950 border border-black shadow-[1px_1px_0_0_#000] font-extrabold' : 'text-slate-750 dark:text-slate-400'
              }`}
          >
            4. Scores
          </button>
        </div>

        {/* LEFT COLUMN PANEL: Master LaTeX CV Registry & JD Input */}
        <section
          style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
          className={`w-full flex-shrink-0 flex flex-col gap-6 xl:pl-4 xl:pr-2 ${activeMobileTab === 'inputs' ? 'block' : 'hidden xl:flex'}`}
        >

          {/* Master CV Registry Editor wrapper */}
          <div className="card-neubrutal overflow-hidden flex flex-col h-[400px] xl:h-[480px]">
            <div className="bg-slate-100 dark:bg-[#0B0F17] px-4 py-2.5 flex justify-between items-center border-b-2 border-black dark:border-[#1E293B]">
              <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Code2 className="h-4 w-4 text-memphis-purple dark:text-memphis-pink" />
                <span className="text-xs font-extrabold font-poppins">Master LaTeX Registry</span>
              </div>
              <button
                onClick={handleResetTemplate}
                className="text-[9px] font-mono font-bold px-2 py-1 bg-transparent hover:bg-red-500/10 border border-slate-400 dark:border-slate-700 hover:border-red-600 text-slate-800 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded transition-all cursor-pointer"
              >
                Reset Template
              </button>
            </div>

            <div className="flex-1 w-full relative">
              <Editor
                height="100%"
                defaultLanguage="latex"
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                value={masterLatex}
                onChange={handleSaveMasterLatex}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Job Ingestion Engine Card */}
          <div className="card-neubrutal p-5 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center m-0 font-poppins">
              <Briefcase className="h-4 w-4 text-memphis-purple dark:text-memphis-teal mr-2" /> Target Job Ingestion
            </h3>

            {/* Scraper Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="Paste Job URL (Ashby, Greenhouse, Lever, LinkedIn)"
                  className="w-full bg-white dark:bg-[#0B0F17] border-2 border-black dark:border-[#1E293B] focus:border-memphis-teal rounded-lg pl-3 pr-8 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-600 dark:placeholder-slate-400 outline-none transition-all"
                />
                {isScraping && (
                  <div className="absolute right-2.5 top-3 h-3.5 w-3.5 border-2 border-memphis-teal border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <button
                onClick={handleScrape}
                disabled={isScraping || !jobUrl.trim()}
                className="px-4 py-2.5 btn-neubrutal-sec text-xs font-bold rounded-lg disabled:opacity-40 whitespace-nowrap"
              >
                Scrape
              </button>
            </div>
            {scrapeError && (
              <span className="text-[10px] text-red-600 dark:text-red-400 font-mono font-bold">{scrapeError}</span>
            )}

            {/* Large Textarea fallback for JDs */}
            <textarea
              rows={6}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Or paste target unstructured Job Description content directly..."
              className="w-full bg-white dark:bg-[#0B0F17] border-2 border-black dark:border-[#1E293B] focus:border-memphis-teal rounded-lg p-3 text-xs text-slate-900 dark:text-slate-300 placeholder-slate-600 dark:placeholder-slate-400 outline-none resize-y transition-all"
            />

            {/* Run Action trigger */}
            <button
              onClick={handleOptimize}
              disabled={isTailoring || !jobText.trim()}
              className="w-full btn-neubrutal bg-memphis-pink hover:bg-rose-400 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-slate-950 font-extrabold text-xs py-3.5 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-[2px_2px_0_0_#000]"
            >
              {isTailoring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span>{tailorStep}</span>
                </>
              ) : (
                <>
                  {optimizedLatex ? (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  <span>
                    {optimizedLatex
                      ? 'Re-tailor Resume'
                      : 'Optimize & Tailor Resume'
                    }
                  </span>
                </>
              )}
            </button>
            {tailorError && (
              <span className="text-[10px] text-red-600 dark:text-red-400 font-mono text-center font-bold">{tailorError}</span>
            )}
          </div>
        </section>

        {/* Left Resize Handle */}
        <div
          onMouseDown={() => setIsResizingLeft(true)}
          className={`hidden xl:flex w-2 cursor-col-resize items-center justify-center self-stretch flex-shrink-0 -mx-1 z-10 transition-all group ${isResizingLeft ? 'bg-memphis-pink/10' : ''
            }`}
          title="Drag to resize panels"
        >
          <div className={`w-1 transition-all ${isResizingLeft ? 'bg-memphis-pink h-1/2' : 'bg-slate-400 dark:bg-[#1E293B] h-24 group-hover:h-32'
            }`}></div>
        </div>

        {/* MIDDLE COLUMN PANEL: Dual-Panel Mutated Workspace */}
        <section
          style={{ width: isDesktop ? `${100 - leftWidth - rightWidth}%` : '100%' }}
          className={`flex-shrink-0 flex flex-col gap-6 xl:px-2 xl:sticky xl:top-[88px] self-start ${activeMobileTab === 'code' || activeMobileTab === 'preview' ? 'block' : 'hidden xl:flex'
            }`}
        >
          {/* Main Workspace Card */}
          <div className="card-neubrutal flex-grow flex flex-col h-[100vh] md:h-[100vh] overflow-hidden">

            {/* Split Switcher Workspace Header */}
            <div className="bg-slate-100 dark:bg-[#0B0F17] px-4 py-3 flex justify-between items-center border-b-2 border-black dark:border-[#1E293B]">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setActiveWorkspaceTab('preview');
                    setActiveMobileTab('preview');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center space-x-1.5 transition-all cursor-pointer ${activeWorkspaceTab === 'preview'
                    ? 'bg-memphis-teal text-[#0B0F17] font-bold border border-black shadow-[1px_1px_0_0_#000] scale-[0.98]'
                    : 'text-slate-750 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent font-bold'
                    }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>A4 Live Preview</span>
                </button>
                <button
                  onClick={() => {
                    setActiveWorkspaceTab('code');
                    setActiveMobileTab('code');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center space-x-1.5 transition-all cursor-pointer ${activeWorkspaceTab === 'code'
                    ? 'bg-memphis-teal text-[#0B0F17] font-bold border border-black shadow-[1px_1px_0_0_#000] scale-[0.98]'
                    : 'text-slate-750 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent font-bold'
                    }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Tailored Code View</span>
                </button>
              </div>

              {/* Action utilities */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="p-2 btn-neubrutal-sec rounded-md"
                  title="Copy LaTeX Source"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={handleDownloadTex}
                  className="p-2 btn-neubrutal-sec rounded-md"
                  title="Download .tex Source"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handlePrintPDF}
                  className="px-3 py-1.5 btn-neubrutal bg-memphis-teal text-slate-950 text-xs font-bold rounded-md flex items-center space-x-1"
                  title="Save/Download as PDF"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Standing Pinned Re-tailor Tweak Box inside Workspace Card */}
            <div className="bg-[#fafaf6] dark:bg-[#0B0F17] px-4 py-3 flex flex-col sm:flex-row gap-3 items-center border-b-2 border-black dark:border-[#1E293B] no-print">
              <div className="flex-1 w-full flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-memphis-purple dark:text-memphis-pink flex-shrink-0" />
                <input
                  type="text"
                  value={promptTweak}
                  onChange={(e) => setPromptTweak(e.target.value)}
                  placeholder="Type tweak instructions (e.g. 'emphasize leadership', 'shorten to 1 page')..."
                  className="flex-1 min-w-0 bg-white dark:bg-[#131A26] border-2 border-black dark:border-[#1E293B] focus:border-memphis-teal rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-600 dark:placeholder-slate-400 outline-none transition-all"
                />
              </div>
              <button
                onClick={handleOptimize}
                disabled={isTailoring || !jobText.trim()}
                className="w-full sm:w-auto px-5 py-2 btn-neubrutal bg-memphis-pink hover:bg-rose-400 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-slate-950 font-extrabold text-xs rounded-lg flex items-center justify-center transition-all cursor-pointer whitespace-nowrap shadow-[2px_2px_0_0_#000]"
              >
                {isTailoring ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    <span>{tailorStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    <span>Apply Tweak & Re-tailor</span>
                  </>
                )}
              </button>
            </div>

            {/* Split Render Window area */}
            <div className="flex-1 w-full relative bg-slate-100 dark:bg-slate-950 overflow-auto">

              {/* CODE TAB */}
              {activeWorkspaceTab === 'code' && (
                <div className="absolute inset-0">
                  <Editor
                    height="100%"
                    defaultLanguage="latex"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                    value={optimizedLatex || masterLatex}
                    onChange={(val) => setOptimizedLatex(val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 12,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              )}

              {/* RENDER TAB (High-fidelity HTML facsimile) */}
              {activeWorkspaceTab === 'preview' && (
                <div className="p-4 flex flex-col items-center min-h-full">

                  {/* Scale & Details info overlay */}
                  <div className="flex items-center space-x-4 mb-4 bg-white dark:bg-[#131A26] border-2 border-black dark:border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-300 shadow-[2px_2px_0_0_#000]">
                    <span className="flex items-center font-medium">
                      <Info className="h-3.5 w-3.5 mr-1.5 text-memphis-purple dark:text-memphis-teal" />
                      HTML Facsimile rendering standard LaTeX margins.
                    </span>

                    <div className="flex items-center space-x-2 border-l-2 border-slate-300 dark:border-[#1E293B] pl-4">
                      <Sliders className="h-3.5 w-3.5 text-slate-750 dark:text-slate-400" />
                      <input
                        type="range"
                        min="50"
                        max="120"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-20 accent-memphis-teal h-1 bg-slate-200 dark:bg-[#0B0F17] rounded-lg cursor-pointer border border-slate-300 dark:border-[#1E293B]"
                      />
                      <span className="font-mono text-[10px] font-bold text-slate-750 dark:text-slate-400">{scale}%</span>
                    </div>
                  </div>

                  {/* High-fidelity CSS A4 print layout canvas */}
                  <div className="preview-container w-full flex justify-center pb-12">
                    <div
                      ref={printAreaRef}
                      id="printable-cv-area"
                      className="preview-canvas shadow-2xl relative"
                      style={{
                        transform: `scale(${scale / 100})`,
                        transformOrigin: 'top center',
                        marginBottom: `${(scale / 100 - 1) * 1120}px` // keep scroll containers aligned
                      }}
                    >

                      {/* 1. Header Contact block */}
                      <div className="text-center border-b border-black pb-2 mb-3">
                        <h1 className="text-2xl font-bold tracking-tight text-black font-serif uppercase">
                          {parsedLatex.name}
                        </h1>
                        <div className="text-[10px] text-slate-700 flex flex-wrap justify-center gap-x-2 gap-y-1 mt-1 leading-none font-serif">
                          {parsedLatex.contact.map((item, i) => (
                            <React.Fragment key={i}>
                              <span dangerouslySetInnerHTML={{ __html: item }} />
                              {i < parsedLatex.contact.length - 1 && <span className="text-slate-400">|</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* 2. Map parsed categories */}
                      <div className="space-y-3.5 font-serif text-black text-left">
                        {parsedLatex.sections.map((section, idx) => (
                          <div key={idx} className="section-block">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5 text-slate-900 font-serif">
                              {section.title}
                            </h2>
                            <div
                              className="text-slate-800 leading-normal"
                              dangerouslySetInnerHTML={{ __html: section.contentHtml }}
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </section>

        {/* Right Resize Handle */}
        <div
          onMouseDown={() => setIsResizingRight(true)}
          className={`hidden xl:flex w-2 cursor-col-resize items-center justify-center self-stretch flex-shrink-0 -mx-1 z-10 transition-all group ${isResizingRight ? 'bg-memphis-pink/10' : ''
            }`}
          title="Drag to resize panels"
        >
          <div className={`w-1 transition-all ${isResizingRight ? 'bg-memphis-pink h-1/2' : 'bg-slate-400 dark:bg-[#1E293B] group-hover:bg-memphis-pink h-24 group-hover:h-32'
            }`}></div>
        </div>

        {/* RIGHT COLUMN PANEL: A-F Scorecard & 6-Block Analysis */}
        <section
          style={{ width: isDesktop ? `${rightWidth}%` : '100%' }}
          className={`w-full flex flex-col gap-6 xl:pl-2 xl:pr-4 ${activeMobileTab === 'scores' ? 'block' : 'hidden xl:flex'}`}
        >

          {/* Collapsible main Scorecard dashboard */}
          <div className="card-neubrutal p-5 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center border-b-2 border-black dark:border-[#1E293B] pb-2.5 m-0 font-poppins">
              <Award className="h-4.5 w-4.5 text-memphis-purple dark:text-memphis-teal mr-2" /> Match Dashboard
            </h3>

            {scorecard ? (
              <div className="flex flex-col gap-4">

                {/* Visual aggregated score grade badge */}
                <div className="flex items-center space-x-4 bg-[#fafaf6] dark:bg-[#0B0F17] border-2 border-black dark:border-[#1E293B] p-3.5 rounded-xl shadow-[3px_3px_0_0_#000]">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl font-black font-mono tracking-tight 
                  ${scorecard.overallGrade === 'A' || scorecard.overallGrade === 'A-' || scorecard.overallGrade === 'A+' ? 'bg-emerald-500 text-slate-950 border-2 border-black shadow-[2px_2px_0_0_#000]' :
                      scorecard.overallGrade === 'B' || scorecard.overallGrade === 'B-' || scorecard.overallGrade === 'B+' ? 'bg-memphis-teal text-slate-950 border-2 border-black shadow-[2px_2px_0_0_#000]' :
                        scorecard.overallGrade === 'C' || scorecard.overallGrade === 'C-' || scorecard.overallGrade === 'C+' ? 'bg-memphis-purple text-white border-2 border-black shadow-[2px_2px_0_0_#000]' :
                          scorecard.overallGrade === 'D' || scorecard.overallGrade === 'D-' || scorecard.overallGrade === 'D+' ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[2px_2px_0_0_#000]' :
                            'bg-rose-500 text-white border-2 border-black shadow-[2px_2px_0_0_#000]'
                    }`}>
                    {scorecard.overallGrade}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-750 dark:text-slate-400 font-mono font-bold block mb-0.5">Weighted Match Index</span>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-mono leading-tight">{scorecard.overallScore}%</h4>
                  </div>
                </div>

                {/* 10 Dimension listings */}
                <div className="space-y-3.5 mt-2">
                  <span className="text-[9px] text-slate-750 dark:text-slate-400 font-mono tracking-wider uppercase font-bold block">10 Match Dimensions</span>

                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {scorecard.dimensions.map((dim, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-slate-800 dark:text-slate-200 font-bold">{dim.name}</span>
                          <span className="font-mono text-memphis-purple dark:text-memphis-teal text-[10px] font-bold">{dim.score}%</span>
                        </div>
                        {/* Custom progress gauge */}
                        <div className="h-2 w-full bg-slate-200 dark:bg-[#0B0F17] border-2 border-black dark:border-[#1E293B] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${dim.score >= 90 ? 'bg-emerald-400 border-r border-black' :
                              dim.score >= 80 ? 'bg-memphis-teal border-r border-black' :
                                dim.score >= 70 ? 'bg-memphis-purple border-r border-black' :
                                  dim.score >= 60 ? 'bg-amber-400 border-r border-black' : 'bg-rose-500 border-r border-black'
                              }`}
                            style={{ width: `${dim.score}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-slate-750 dark:text-slate-400 mt-1 leading-relaxed font-sans">{dim.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-750 dark:text-slate-400 flex flex-col items-center">
                <Award className="h-10 w-10 text-memphis-purple dark:text-memphis-teal/70 mb-3 animate-pulse" />
                <p className="text-xs font-bold font-sans">Run optimization to populate CV scorecard statistics.</p>
              </div>
            )}
          </div>

          {/* 6-Block Agentic Analysis Panel */}
          <div className="card-neubrutal p-5 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center border-b-2 border-black dark:border-[#1E293B] pb-2.5 m-0 font-poppins">
              <Layers className="h-4.5 w-4.5 text-memphis-purple dark:text-memphis-teal mr-2" /> Recruiter Assessments
            </h3>

            {evaluation ? (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">

                {/* 6 Blocks */}
                <div className="space-y-4">

                  {/* Block 1 */}
                  <div className="border-2 border-black dark:border-[#1E293B] p-3.5 rounded-xl bg-[#fafaf6] dark:bg-[#0B0F17] shadow-[3px_3px_0_0_#000]">
                    <span className="text-[9px] text-memphis-purple dark:text-memphis-pink font-mono tracking-wider uppercase block mb-1.5 font-bold">
                      1. Role Mission Summary
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: evaluation.roleSummary.replace(/\n/g, '<br/>') }} />
                  </div>

                  {/* Block 2 */}
                  <div className="border-2 border-black dark:border-[#1E293B] p-3.5 rounded-xl bg-[#fafaf6] dark:bg-[#0B0F17] shadow-[3px_3px_0_0_#000]">
                    <span className="text-[9px] text-memphis-purple dark:text-memphis-teal font-mono tracking-wider uppercase block mb-1.5 font-bold">
                      2. Primary Strengths & Gaps
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: evaluation.cvMatch.replace(/\n/g, '<br/>') }} />
                  </div>

                  {/* Block 3 */}
                  <div className="border-2 border-black dark:border-[#1E293B] p-3.5 rounded-xl bg-[#fafaf6] dark:bg-[#0B0F17] shadow-[3px_3px_0_0_#000]">
                    <span className="text-[9px] text-memphis-purple dark:text-memphis-pink font-mono tracking-wider uppercase block mb-1.5 font-bold">
                      3. Seniority Level Strategy
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: evaluation.levelStrategy.replace(/\n/g, '<br/>') }} />
                  </div>

                  {/* Block 4 */}
                  <div className="border-2 border-black dark:border-[#1E293B] p-3.5 rounded-xl bg-[#fafaf6] dark:bg-[#0B0F17] shadow-[3px_3px_0_0_#000]">
                    <span className="text-[9px] text-memphis-purple dark:text-memphis-teal font-mono tracking-wider uppercase block mb-1.5 font-bold">
                      4. Compensation & Salary Estimates
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: evaluation.compResearch.replace(/\n/g, '<br/>') }} />
                  </div>

                  {/* Block 5 */}
                  <div className="border-2 border-black dark:border-[#1E293B] p-3.5 rounded-xl bg-[#fafaf6] dark:bg-[#0B0F17] shadow-[3px_3px_0_0_#000]">
                    <span className="text-[9px] text-memphis-purple dark:text-memphis-pink font-mono tracking-wider uppercase block mb-1.5 font-bold">
                      5. Personalization Blueprint
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: evaluation.personalizationBlueprint.replace(/\n/g, '<br/>') }} />
                  </div>

                  {/* Block 6 */}
                  <div className="border-2 border-black dark:border-[#1E293B] p-3.5 rounded-xl bg-[#fafaf6] dark:bg-[#0B0F17] shadow-[3px_3px_0_0_#000]">
                    <span className="text-[9px] text-memphis-purple dark:text-memphis-teal font-mono tracking-wider uppercase block mb-1.5 font-bold">
                      6. STAR Interview Outline
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: evaluation.interviewSTAR.replace(/\n/g, '<br/>') }} />
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-750 dark:text-slate-400 flex flex-col items-center">
                <Layers className="h-10 w-10 text-memphis-purple dark:text-memphis-pink/70 mb-3 animate-pulse" />
                <p className="text-xs font-bold font-sans">Run optimization to populate the 6 evaluation pipeline blocks.</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* 3. Global Printable Area (Rendered outside normal UI bounds only during window print mode) */}
      <div className="hidden print:block print:w-full print:bg-white print:text-black">
        <div className="print-page bg-white text-black mx-auto">
          {/* Header */}
          <div className="text-center border-b border-black pb-2 mb-3">
            <h1 className="text-2xl font-bold tracking-tight text-black font-serif uppercase">
              {parsedLatex.name}
            </h1>
            <div className="text-[10px] text-slate-700 flex flex-wrap justify-center gap-x-2 mt-1 font-serif">
              {parsedLatex.contact.map((item, i) => (
                <React.Fragment key={i}>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                  {i < parsedLatex.contact.length - 1 && <span className="text-slate-400 mx-1">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-3.5 font-serif text-black text-left">
            {parsedLatex.sections.map((section, idx) => (
              <div key={idx} className="section-block">
                <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 text-slate-900 font-serif">
                  {section.title}
                </h2>
                <div
                  className="text-slate-800 leading-normal"
                  dangerouslySetInnerHTML={{ __html: section.contentHtml }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
