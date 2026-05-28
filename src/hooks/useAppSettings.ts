import { useState, useEffect } from 'react';
import {
  getMasterLatex,
  saveMasterLatex as dbSaveMasterLatex,
  getApiKey,
  saveApiKey as dbSaveApiKey,
  getSelectedModel,
  saveSelectedModel as dbSaveSelectedModel,
  getPromptTweak,
  savePromptTweak as dbSavePromptTweak,
  getHistory,
  addHistoryRecord as dbAddHistoryRecord,
  DEFAULT_LATEX_TEMPLATE
} from '../services/db';
import type { OptimizationRecord } from '../types';

export function useAppSettings() {
  const [masterLatex, setMasterLatex] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [anthropicKey, setAnthropicKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'claude' | 'cli'>('gemini');
  const [isCliAvailable, setIsCliAvailable] = useState<boolean>(false);
  const [promptTweak, setPromptTweak] = useState<string>('');
  const [history, setHistory] = useState<OptimizationRecord[]>([]);

  // We expose some initial load states if needed for UI components
  const [initialLoadDone, setInitialLoadDone] = useState(false);

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
      
      setInitialLoadDone(true);
    }
    loadData();
  }, []);

  const saveMasterLatex = async (value: string) => {
    setMasterLatex(value);
    await dbSaveMasterLatex(value);
  };

  const saveKeys = async (gKey: string, aKey: string, model: 'gemini' | 'claude' | 'cli') => {
    setGeminiKey(gKey);
    setAnthropicKey(aKey);
    setSelectedModel(model);
    await dbSaveApiKey('gemini', gKey);
    await dbSaveApiKey('anthropic', aKey);
    await dbSaveSelectedModel(model);
  };

  const savePromptTweak = async (tweak: string) => {
    setPromptTweak(tweak);
    await dbSavePromptTweak(tweak);
  };

  const addHistoryRecord = async (record: OptimizationRecord) => {
    await dbAddHistoryRecord(record);
    const updatedHistory = await getHistory();
    setHistory(updatedHistory);
  };

  const resetTemplate = async () => {
    if (window.confirm('Reset Master LaTeX code to standard sample template?')) {
      setMasterLatex(DEFAULT_LATEX_TEMPLATE);
      await dbSaveMasterLatex(DEFAULT_LATEX_TEMPLATE);
    }
  };

  return {
    masterLatex,
    saveMasterLatex,
    resetTemplate,
    geminiKey,
    anthropicKey,
    selectedModel,
    saveKeys,
    isCliAvailable,
    promptTweak,
    savePromptTweak,
    history,
    addHistoryRecord,
    initialLoadDone
  };
}
