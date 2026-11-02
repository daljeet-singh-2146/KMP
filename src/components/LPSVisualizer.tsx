import React from 'react';
import type { LPSStep } from '../types/kmp';
import { CharacterBox } from './CharacterBox';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface LPSVisualizerProps {
  currentStepData: LPSStep;
  onProceedToMatching?: () => void;
  canProceedToMatching?: boolean;
}

export const LPSVisualizer: React.FC<LPSVisualizerProps> = ({
  currentStepData,
  onProceedToMatching,
  canProceedToMatching = false,
}) => {
  const { pattern, lps, i, len, comparing, status, comparisonResult } = currentStepData;
  const isComplete = status === 'complete';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-6">
      {/* Top Header & Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Phase 1
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              LPS (Longest Proper Prefix which is also Suffix) Array Construction
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Builds preprocessing lookup table: for each prefix, what is the length of the longest proper prefix that matches a suffix?
          </p>
        </div>

        {/* Pointers readout pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-medium text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span>Pointer i = <strong className="font-bold">{i}</strong></span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>Length len = <strong className="font-bold">{len}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Interactive Array Display */}
      <div className="overflow-x-auto pb-6 pt-7 px-2">
        <div className="inline-flex flex-col gap-6 min-w-full items-center">
          
          {/* Pattern String with Pointer Badges */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Pattern Characters & Pointers
            </div>
            <div className="flex items-center gap-2">
              {pattern.split('').map((char, idx) => {
                const isComparingI = comparing?.patternIdxI === idx;
                const isComparingLen = comparing?.patternIdxLen === idx;

                let charState: 'idle' | 'comparing' | 'match' | 'mismatch' = 'idle';
                if (isComparingI || isComparingLen) {
                  if (comparisonResult === 'match') {
                    charState = 'match';
                  } else if (comparisonResult === 'mismatch') {
                    charState = 'mismatch';
                  } else {
                    charState = 'comparing';
                  }
                }

                // Pointer badges
                const isI = idx === i && !isComplete;
                const isLen = idx === len && !isComplete;

                let pointerLabel = '';
                let isPointer = false;
                if (isI && isLen) {
                  pointerLabel = 'i & len';
                  isPointer = true;
                } else if (isI) {
                  pointerLabel = 'i';
                  isPointer = true;
                } else if (isLen) {
                  pointerLabel = 'len';
                  isPointer = true;
                }

                return (
                  <div key={idx} className="relative">
                    <CharacterBox
                      char={char}
                      label={`idx ${idx}`}
                      state={charState}
                      isPointer={isPointer}
                      pointerLabel={pointerLabel}
                      pointerPosition="top"
                      size="lg"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* LPS Value Array Row */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              LPS Array Table <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">lps[0..{pattern.length - 1}]</span>
            </div>

            <div className="flex items-center gap-2">
              {lps.map((val, idx) => {
                const isFilled = idx < i || isComplete;
                const isCurrentlyUpdated = (status === 'match' || status === 'mismatch_zero') && idx === i;

                return (
                  <div
                    key={idx}
                    className={clsx(
                      'w-14 h-12 flex flex-col items-center justify-center rounded-lg border-2 font-mono text-base font-bold transition-all duration-200',
                      isComplete
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 shadow-xs'
                        : isCurrentlyUpdated
                        ? 'bg-indigo-100 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-300 dark:ring-indigo-600/50 scale-105'
                        : isFilled
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 border-dashed text-slate-300 dark:text-slate-600'
                    )}
                  >
                    <span>{val}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal -mt-1">
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                LPS Array Construction Complete!
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Precomputed lookup table is ready: <span className="font-mono font-bold">[{lps.join(', ')}]</span>.
              </p>
            </div>
          </div>

          {canProceedToMatching && onProceedToMatching && (
            <button
              onClick={onProceedToMatching}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <span>Start Pattern Matching</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
