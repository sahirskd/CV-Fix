import { Fragment } from 'react';
import Header from './components/layout/Header';
import MobileTabs from './components/layout/MobileTabs';
import SettingsModal from './components/modals/SettingsModal';
import JobIngestionCard from './components/job/JobIngestionCard';
import MasterCVEditor from './components/editor/MasterCVEditor';
import WorkspacePreview from './components/editor/WorkspacePreview';
import MatchDashboard from './components/job/MatchDashboard';
import { AppProvider, useAppContext } from './context/AppContext';
import { useLayoutResize } from './hooks/useLayoutResize';
import { parseLatexToHtml } from './services/latexRenderer';

function AppContent() {
  const {
    activeMobileTab,
    optimizedLatex,
    masterLatex
  } = useAppContext();

  const {
    isDesktop,
    leftWidth,
    rightWidth,
    isResizingLeft,
    isResizingRight,
    setIsResizingLeft,
    setIsResizingRight,
    mainContainerRef
  } = useLayoutResize();

  const parsedLatex = parseLatexToHtml(optimizedLatex || masterLatex);

  return (
    <div className="min-h-screen bg-[#fafaf6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-200 flex flex-col font-sans antialiased overflow-x-hidden memphis-dots">
      
      <Header />
      <SettingsModal />

      {/* 2. Main Workstation Body Layout */}
      {/* On desktop: side-by-side. On mobile: tabbed swipes */}
      <main
        ref={mainContainerRef}
        className="flex-1 w-full max-w-8xl mx-auto flex flex-col xl:flex-row p-4 xl:px-0 xl:gap-1.5 gap-6 no-print animate-fade-in"
      >
        <MobileTabs />

        {/* LEFT COLUMN PANEL: Master LaTeX CV Registry & JD Input */}
        <section
          style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
          className={`w-full flex-shrink-0 flex flex-col gap-6 xl:pl-4 xl:pr-2 ${activeMobileTab === 'inputs' ? 'block' : 'hidden xl:flex'}`}
        >
          <MasterCVEditor />
          <JobIngestionCard />
        </section>

        {/* Left Resize Handle */}
        <div
          onMouseDown={() => setIsResizingLeft(true)}
          className={`hidden xl:flex w-2 cursor-col-resize items-center justify-center self-stretch flex-shrink-0 -mx-1 z-10 transition-all group ${isResizingLeft ? 'bg-memphis-pink/10' : ''}`}
          title="Drag to resize panels"
        >
          <div className={`w-1 transition-all ${isResizingLeft ? 'bg-memphis-pink h-1/2' : 'bg-slate-400 dark:bg-[#1E293B] h-24 group-hover:h-32'}`}></div>
        </div>

        {/* MIDDLE COLUMN PANEL: Dual-Panel Mutated Workspace */}
        <section
          style={{ width: isDesktop ? `${100 - leftWidth - rightWidth}%` : '100%' }}
          className={`flex-shrink-0 flex flex-col gap-6 xl:px-2 xl:sticky xl:top-[88px] self-start ${activeMobileTab === 'code' || activeMobileTab === 'preview' ? 'block' : 'hidden xl:flex'}`}
        >
          <WorkspacePreview />
        </section>

        {/* Right Resize Handle */}
        <div
          onMouseDown={() => setIsResizingRight(true)}
          className={`hidden xl:flex w-2 cursor-col-resize items-center justify-center self-stretch flex-shrink-0 -mx-1 z-10 transition-all group ${isResizingRight ? 'bg-memphis-pink/10' : ''}`}
          title="Drag to resize panels"
        >
          <div className={`w-1 transition-all ${isResizingRight ? 'bg-memphis-pink h-1/2' : 'bg-slate-400 dark:bg-[#1E293B] group-hover:bg-memphis-pink h-24 group-hover:h-32'}`}></div>
        </div>

        {/* RIGHT COLUMN PANEL: A-F Scorecard & 6-Block Analysis */}
        <section
          style={{ width: isDesktop ? `${rightWidth}%` : '100%' }}
          className={`w-full flex flex-col gap-6 xl:pl-2 xl:pr-4 ${activeMobileTab === 'scores' ? 'block' : 'hidden xl:flex'}`}
        >
          <MatchDashboard />
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
                <Fragment key={i}>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                  {i < parsedLatex.contact.length - 1 && <span className="text-slate-400 mx-1">|</span>}
                </Fragment>
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

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
