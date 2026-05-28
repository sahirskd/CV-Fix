import Editor from '@monaco-editor/react';
import { Code2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function MasterCVEditor() {
  const { masterLatex, saveMasterLatex, resetTemplate, theme } = useAppContext();

  const handleSaveMasterLatex = async (value: string | undefined) => {
    if (value !== undefined) {
      await saveMasterLatex(value);
    }
  };

  return (
    <div className="card-neubrutal overflow-hidden flex flex-col h-[400px] xl:h-[480px]">
      <div className="bg-slate-100 dark:bg-[#0B0F17] px-4 py-2.5 flex justify-between items-center border-b-2 border-black dark:border-[#1E293B]">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
          <Code2 className="h-4 w-4 text-memphis-purple dark:text-memphis-pink" />
          <span className="text-xs font-extrabold font-poppins">Master LaTeX Registry</span>
        </div>
        <button
          onClick={resetTemplate}
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
  );
}
