import React from 'react';
import cvFixLogo from '../../assets/cv-fix-logo-rect.png';
import { Sun, Moon, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Header() {
  const { 
    theme, toggleTheme, 
    selectedModel, saveKeys, geminiKey, anthropicKey, isCliAvailable,
    showSettings, setShowSettings
  } = useAppContext();

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    saveKeys(geminiKey, anthropicKey, e.target.value as 'gemini' | 'claude' | 'cli');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0B0F17] border-b-2 border-black dark:border-[#1E293B] px-4 py-3.5 flex justify-between items-center no-print">
      <div className="flex items-center space-x-3">
        <div className="h-12 w-20 px-2 bg-white dark:bg-[#1E293B] border-2 border-black rounded-lg flex items-center justify-center text-memphis-purple dark:text-memphis-pink shadow-[2px_2px_0_0_#000]">
          <img src={cvFixLogo} alt="logo" className="w-20 dark:invert" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white m-0 leading-none font-poppins">
            CV-<span className="text-memphis-pink">Fix</span>
          </h1>
          <span className="text-[9px] text-slate-750 dark:text-slate-400 font-mono tracking-wider uppercase font-bold mt-1 block">
            your local resume tailoring hub
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Model provider quick-select dropdown */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={handleModelChange}
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
          onClick={toggleTheme}
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
  );
}
