import React from 'react';
import type { AlgorithmStep, LPSStep, MatchingStep } from '../types/kmp';

interface AlgorithmStateProps {
  step: AlgorithmStep;
}

export const AlgorithmState: React.FC<AlgorithmStateProps> = ({ step }) => {
  if (step.phase === 'lps') {
    const lpsStep = step as LPSStep;
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            LPS Construction State
          </h3>
          <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            Phase 1
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              Pointer i
            </span>
            <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
              {lpsStep.i}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              Length len
            </span>
            <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
              {lpsStep.len}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 col-span-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              Comparing
            </span>
            <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
              {lpsStep.comparing ? (
                <>
                  pat[{lpsStep.comparing.patternIdxI}] ('{lpsStep.pattern[lpsStep.comparing.patternIdxI]}') vs pat[{lpsStep.comparing.patternIdxLen}] ('{lpsStep.pattern[lpsStep.comparing.patternIdxLen]}')
                </>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 font-normal">None</span>
              )}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Current LPS Array
          </span>
          <div className="font-mono text-sm text-slate-800 dark:text-slate-100 font-bold bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            [{lpsStep.lps.join(', ')}]
          </div>
        </div>
      </div>
    );
  }

  // Matching phase
  const matchStep = step as MatchingStep;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Pattern Matching State
        </h3>
        <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          Phase 2
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
            Text Pointer (i)
          </span>
          <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {matchStep.i}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
            Pattern Pointer (j)
          </span>
          <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {matchStep.j}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
            Shift Offset
          </span>
          <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {matchStep.alignOffset}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
            Total Matches
          </span>
          <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {matchStep.matchedIndices.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Current Comparison
          </span>
          <div className="font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            {matchStep.comparing ? (
              <>
                text[{matchStep.comparing.textIdx}] ('{matchStep.text[matchStep.comparing.textIdx]}') vs pat[{matchStep.comparing.patternIdx}] ('{matchStep.pattern[matchStep.comparing.patternIdx]}')
              </>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 font-normal">None</span>
            )}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Matches Found
          </span>
          <div className="font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            {matchStep.matchedIndices.length > 0 ? (
              `Indices: [${matchStep.matchedIndices.join(', ')}]`
            ) : (
              <span className="text-slate-400 dark:text-slate-500 font-normal">0 occurrences</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
