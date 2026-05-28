import { Briefcase, RefreshCw, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function JobIngestionCard() {
  const {
    jobUrl, setJobUrl,
    jobText, setJobText,
    isScraping, scrapeError, handleScrape,
    isTailoring, tailorStep, tailorError,
    optimizedLatex, handleOptimize
  } = useAppContext();

  return (
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
  );
}
