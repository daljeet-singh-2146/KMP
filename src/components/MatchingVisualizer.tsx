import React from 'react';
import type { MatchingStep } from '../types/kmp';
import { CharacterBox } from './CharacterBox';
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface MatchingVisualizerProps {
  currentStepData: MatchingStep;
}

export const MatchingVisualizer: React.FC<MatchingVisualizerProps> = ({
  currentStepData,
}) => {
  const {
    text,
    pattern,
    i,
    j,
    lps,
    alignOffset,
    matchedIndices,
    comparing,
    comparisonResult,
    status,
    lpsLookupIndex,
    lpsLookupValue,
  } = currentStepData;

  const isComplete = status === 'complete';

  // Helper to determine whether a text character is part of any completed match
  const isCharInCompletedMatch = (textIdx: number) => {
    return matchedIndices.some(
      (startIdx) => textIdx >= startIdx && textIdx < startIdx + pattern.length
    );
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout: Left = Pattern Matching Canvas, Right = Live LPS Table Lookup */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Main Matching Visualizer Area (3 cols on XL) */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Phase 2
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  KMP Search & Alignment
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Scanning text without backtracking pointer <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">i</code>. Pattern shifts right according to precalculated LPS values.
              </p>
            </div>

            {/* Dynamic pointer readouts */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-medium text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                <span>Text i = <strong className="font-bold">{i}</strong></span>
              </div>

              <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Pattern j = <strong className="font-bold">{j}</strong></span>
              </div>

              <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                Shift = <strong className="font-bold">{alignOffset}</strong>
              </div>
            </div>
          </div>

          {/* Main Alignment Board */}
          <div className="overflow-x-auto overflow-y-hidden py-4 px-2 min-h-[220px]">
            <div className="inline-flex flex-col gap-4 min-w-full">
              
              {/* Row 1: Main String */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Main String (Text)
                  </span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    Length: {text.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {text.split('').map((char, idx) => {
                    const isComparingThis = comparing?.textIdx === idx;
                    const isInMatch = isCharInCompletedMatch(idx);

                    let charState: 'idle' | 'comparing' | 'match' | 'mismatch' | 'matched-full' = 'idle';
                    if (isComparingThis) {
                      charState = comparisonResult === 'match' ? 'match' : 'mismatch';
                    } else if (isInMatch) {
                      charState = 'matched-full';
                    }

                    const isCurrentI = idx === i && !isComplete;

                    return (
                      <CharacterBox
                        key={`text-${idx}`}
                        char={char}
                        label={`[${idx}]`}
                        state={charState}
                        isPointer={isCurrentI}
                        pointerLabel="i"
                        pointerPosition="top"
                        size="md"
                      />
                    );
                  })}
                </div>
              </div>

              {/* Alignment spacer / Divider indicator */}
              <div className="relative border-t border-dashed border-slate-200 dark:border-slate-800 my-1">
                <span className="absolute left-0 -top-2.5 bg-white dark:bg-slate-900 px-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Pattern Alignment (Shift: {alignOffset})
                </span>
              </div>

              {/* Row 2: Pattern String Aligned underneath Text */}
              <div>
                <div className="flex items-center gap-2">
                  {/* Pre-padding spacers for alignment */}
                  {Array.from({ length: Math.max(0, alignOffset) }).map((_, emptyIdx) => (
                    <div key={`spacer-${emptyIdx}`} className="flex flex-col items-center">
                      <div className="h-6 mb-1" />
                      <div className="w-11 h-11 shrink-0 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-center">
                        <span className="text-slate-300 dark:text-slate-600 text-xs font-mono">·</span>
                      </div>
                      <div className="h-6 mt-1" />
                    </div>
                  ))}

                  {/* The pattern characters */}
                  {pattern.split('').map((char, pIdx) => {
                    const isComparingThis = comparing?.patternIdx === pIdx;
                    let charState: 'idle' | 'comparing' | 'match' | 'mismatch' = 'idle';

                    if (isComparingThis) {
                      charState = comparisonResult === 'match' ? 'match' : 'mismatch';
                    }

                    // If currently matched partially in active window (idx < j)
                    if (pIdx < j && !isComparingThis) {
                      charState = 'match';
                    }

                    const isCurrentJ = pIdx === j && !isComplete;

                    return (
                      <CharacterBox
                        key={`pat-${pIdx}`}
                        char={char}
                        label={`pat[${pIdx}]`}
                        state={charState}
                        isPointer={isCurrentJ}
                        pointerLabel="j"
                        pointerPosition="bottom"
                        size="md"
                      />
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Matches Found Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Matches Found:</span>
              {matchedIndices.length === 0 ? (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic">None yet</span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {matchedIndices.map((idx, iOrder) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-600 dark:bg-emerald-500 text-white font-mono text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <span>#{iOrder + 1} at idx {idx}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Total occurrences: <strong className="text-slate-800 dark:text-slate-100">{matchedIndices.length}</strong>
            </div>
          </div>

          {/* Completion Banner */}
          {isComplete && (
            <div
              className={clsx(
                'p-4 rounded-xl border flex items-center gap-3 animate-fadeIn',
                matchedIndices.length > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              )}
            >
              {matchedIndices.length > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              )}

              <div>
                <h4 className="text-sm font-bold">
                  {matchedIndices.length > 0
                    ? `Search Finished: Found ${matchedIndices.length} occurrence(s)!`
                    : 'Search Finished: Pattern not found.'}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  {matchedIndices.length > 0
                    ? `Occurrences found at starting positions: [${matchedIndices.join(', ')}].`
                    : 'Checked the entire string without backtracking text pointer i.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Side LPS Table for Shift/Lookup Reference (1 col on XL) */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>LPS Lookup Reference</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Values pulled from this table to shift the pattern without backtracking.
            </p>
          </div>

          {/* Active Lookup indicator callout */}
          {lpsLookupIndex !== null && lpsLookupIndex !== undefined ? (
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 animate-pulse">
              <div className="font-semibold flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Active Shift Lookup:</span>
              </div>
              <p className="font-mono text-xs mt-1">
                lps[{lpsLookupIndex}] = <span className="font-bold underline text-indigo-700 dark:text-indigo-300">{lpsLookupValue}</span>
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Pattern slides so new j = {lpsLookupValue}.
              </p>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Matching currently compares char-by-char. If mismatch occurs with j &gt; 0, LPS will supply shift value.
            </div>
          )}

          {/* Compact Vertical / Grid LPS Table */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            <div className="grid grid-cols-3 text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 px-2 py-1">
              <span>Idx</span>
              <span>Char</span>
              <span className="text-right">LPS[k]</span>
            </div>

            {pattern.split('').map((char, k) => {
              const isTargeted = lpsLookupIndex === k;

              return (
                <div
                  key={k}
                  className={clsx(
                    'grid grid-cols-3 items-center px-2 py-1.5 rounded-lg font-mono text-xs transition-all duration-200',
                    isTargeted
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white font-bold shadow-md ring-2 ring-indigo-300 dark:ring-indigo-700 scale-102'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
                  )}
                >
                  <span className={clsx(isTargeted ? 'text-white' : 'text-slate-400 dark:text-slate-500')}>
                    [{k}]
                  </span>
                  <span className="font-bold text-center">
                    '{char}'
                  </span>
                  <span className="text-right font-bold text-sm">
                    {lps[k]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            Formula: <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">j = lps[j - 1]</code>
          </div>
        </div>

      </div>
    </div>
  );
};
