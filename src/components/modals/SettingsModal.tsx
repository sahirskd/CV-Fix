import { useState, useEffect } from 'react';
import { KeyRound } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function SettingsModal() {
  const {
    showSettings, setShowSettings,
    geminiKey: savedGKey, anthropicKey: savedAKey, selectedModel: savedModel,
    saveKeys, isCliAvailable
  } = useAppContext();

  const [geminiKey, setGeminiKey] = useState(savedGKey);
  const [anthropicKey, setAnthropicKey] = useState(savedAKey);
  const [selectedModel, setSelectedModel] = useState(savedModel);

  useEffect(() => {
    setGeminiKey(savedGKey);
    setAnthropicKey(savedAKey);
    setSelectedModel(savedModel);
  }, [savedGKey, savedAKey, savedModel]);

  if (!showSettings) return null;

  const handleSaveKeys = async () => {
    await saveKeys(geminiKey, anthropicKey, selectedModel);
    setShowSettings(false);
  };

  return (
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
                💡 <strong>CLI Mode Active</strong>: CV-Fix is utilizing your local Gemini CLI setup. No web API keys are required.
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
  );
}
