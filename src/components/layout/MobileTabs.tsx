import { useAppContext } from '../../context/AppContext';

export default function MobileTabs() {
  const { activeMobileTab, setActiveMobileTab } = useAppContext();

  return (
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
  );
}
