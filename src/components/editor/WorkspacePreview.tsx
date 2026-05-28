import { useState, useRef, Fragment } from 'react';
import Editor from '@monaco-editor/react';
import { FileText, FileCode, Copy, Check, Download, Sliders, Info, RefreshCw, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { parseLatexToHtml } from '../../services/latexRenderer';

export default function WorkspacePreview() {
  const {
    activeWorkspaceTab, setActiveWorkspaceTab,
    setActiveMobileTab,
    theme,
    masterLatex,
    optimizedLatex, setOptimizedLatex,
    promptTweak, setPromptTweak,
    jobText, isTailoring, tailorStep, handleOptimize
  } = useAppContext();

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(100);
  const printAreaRef = useRef<HTMLDivElement>(null);

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
    window.print();
  };

  const parsedLatex = parseLatexToHtml(optimizedLatex || masterLatex);

  return (
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
                      <Fragment key={i}>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                        {i < parsedLatex.contact.length - 1 && <span className="text-slate-400">|</span>}
                      </Fragment>
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
  );
}
