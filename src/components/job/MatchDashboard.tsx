import { Award, Layers } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function MatchDashboard() {
  const { scorecard, evaluation } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
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
    </div>
  );
}
