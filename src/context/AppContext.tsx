import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppSettings } from '../hooks/useAppSettings';
import { useTheme } from '../hooks/useTheme';
import { scrapeJobDescription } from '../services/scraper';
import { tailorResume } from '../services/orchestrator';
import type { OptimizationResponse, OptimizationRecord } from '../types';

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Settings
  masterLatex: string;
  saveMasterLatex: (val: string) => Promise<void>;
  resetTemplate: () => Promise<void>;
  geminiKey: string;
  anthropicKey: string;
  selectedModel: 'gemini' | 'claude' | 'cli';
  saveKeys: (gKey: string, aKey: string, model: 'gemini' | 'claude' | 'cli') => Promise<void>;
  isCliAvailable: boolean;
  promptTweak: string;
  setPromptTweak: (val: string) => void;
  savePromptTweak: (tweak: string) => Promise<void>;
  history: OptimizationRecord[];
  addHistoryRecord: (record: OptimizationRecord) => Promise<void>;
  initialLoadDone: boolean;

  // UI Tabs State
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  activeWorkspaceTab: 'code' | 'preview';
  setActiveWorkspaceTab: (val: 'code' | 'preview') => void;
  activeMobileTab: 'inputs' | 'code' | 'preview' | 'scores';
  setActiveMobileTab: (val: 'inputs' | 'code' | 'preview' | 'scores') => void;

  // Scraper State
  jobUrl: string;
  setJobUrl: (val: string) => void;
  jobText: string;
  setJobText: (val: string) => void;
  isScraping: boolean;
  scrapeError: string;
  handleScrape: () => Promise<void>;

  // Tailor State
  isTailoring: boolean;
  tailorStep: string;
  tailorError: string;
  optimizedLatex: string;
  setOptimizedLatex: (val: string) => void;
  scorecard: OptimizationResponse['scorecard'] | null;
  evaluation: OptimizationResponse['evaluation'] | null;
  handleOptimize: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const appSettings = useAppSettings();

  // Settings & Tabs UI
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'code' | 'preview'>('preview');
  const [activeMobileTab, setActiveMobileTab] = useState<'inputs' | 'code' | 'preview' | 'scores'>('inputs');

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
  // Initialize with latest history if available
  const initialHistory = appSettings.history.length > 0 ? appSettings.history[0] : null;
  const [optimizedLatex, setOptimizedLatex] = useState<string>(initialHistory?.optimizedTex || '');
  const [scorecard, setScorecard] = useState<OptimizationResponse['scorecard'] | null>(initialHistory?.scorecard || null);
  const [evaluation, setEvaluation] = useState<OptimizationResponse['evaluation'] | null>(initialHistory?.evaluation || null);

  // Sync historical state if it loads late
  useEffect(() => {
    if (appSettings.history.length > 0 && !optimizedLatex) {
      setOptimizedLatex(appSettings.history[0].optimizedTex);
      setScorecard(appSettings.history[0].scorecard);
      setEvaluation(appSettings.history[0].evaluation);
    }
  }, [appSettings.history, optimizedLatex]);

  const handleScrape = async () => {
    if (!jobUrl.trim()) return;
    setIsScraping(true);
    setScrapeError('');
    try {
      const result = await scrapeJobDescription(jobUrl);
      setJobText(result.description);
      setJobUrl(''); // Clear search bar
    } catch (err) {
      const error = err as Error;
      setScrapeError(error.message || 'Scraping failed.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleOptimize = async () => {
    setTailorError('');
    setIsTailoring(true);

    if (appSettings.selectedModel !== 'cli') {
      const activeKey = appSettings.selectedModel === 'gemini' ? appSettings.geminiKey : appSettings.anthropicKey;
      if (!activeKey) {
        setIsTailoring(false);
        setShowSettings(true);
        setTailorError(`Please enter your ${appSettings.selectedModel === 'gemini' ? 'Gemini' : 'Anthropic'} API key in Settings first!`);
        return;
      }
    }

    try {
      const activeKey = appSettings.selectedModel === 'gemini' ? appSettings.geminiKey : (appSettings.selectedModel === 'claude' ? appSettings.anthropicKey : '');
      const response = await tailorResume(
        appSettings.selectedModel,
        activeKey,
        appSettings.masterLatex,
        jobText,
        appSettings.promptTweak,
        (progressMessage) => {
          setTailorStep(progressMessage);
        }
      );

      // Save results
      setOptimizedLatex(response.optimizedTex);
      setScorecard(response.scorecard);
      setEvaluation(response.evaluation);

      // Cache custom tweaks
      await appSettings.savePromptTweak(appSettings.promptTweak);

      // Add to IndexedDB history
      const newRecord: OptimizationRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        jobTitle: 'Tailored Optimization',
        companyName: appSettings.selectedModel === 'gemini' ? 'Gemini AI Engine' : (appSettings.selectedModel === 'claude' ? 'Claude 3.5 Engine' : 'Local Gemini CLI (Keyless)'),
        jobUrl: jobUrl,
        originalTex: appSettings.masterLatex,
        optimizedTex: response.optimizedTex,
        evaluation: response.evaluation,
        scorecard: response.scorecard
      };

      await appSettings.addHistoryRecord(newRecord);

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

  const setPromptTweakWrapper = (val: string) => {
    // We only expose a setter for the local state inside the hook if needed,
    // but the hook actually exposes savePromptTweak which saves to DB. 
    // Wait, the hook exposes savePromptTweak(tweak), but it doesn't expose a sync setter.
    // Let me update the hook interface usage.
    appSettings.savePromptTweak(val);
  };


  const value: AppContextType = {
    theme, toggleTheme,
    ...appSettings,
    setPromptTweak: setPromptTweakWrapper, // override or add this
    showSettings, setShowSettings,
    activeWorkspaceTab, setActiveWorkspaceTab,
    activeMobileTab, setActiveMobileTab,
    jobUrl, setJobUrl,
    jobText, setJobText,
    isScraping, scrapeError, handleScrape,
    isTailoring, tailorStep, tailorError,
    optimizedLatex, setOptimizedLatex,
    scorecard, evaluation,
    handleOptimize
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
