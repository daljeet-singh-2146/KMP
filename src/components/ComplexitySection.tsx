import React from 'react';
import { Clock, HardDrive, Zap, ShieldCheck } from 'lucide-react';

interface ComplexitySectionProps {
  textLength: number;
  patternLength: number;
}

export const ComplexitySection: React.FC<ComplexitySectionProps> = ({
  textLength,
  patternLength,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>Complexity Analysis & Theoretical Comparison</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Why Knuth-Morris-Pratt achieves optimal linear time complexity compared to naive string matching.
        </p>
      </div>

      {/* Grid of complexity cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* LPS Construction */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">LPS Phase Time</span>
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
            O(m)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Pattern size m = {patternLength}. Pointer `i` advances m times; `len` decreases at most as much as it increments.
          </p>
        </div>

        {/* Search Matching Time */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Matching Time</span>
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
            O(n)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Text size n = {textLength}. The text pointer `i` never backtracks, guaranteeing strictly linear scan.
          </p>
        </div>

        {/* Overall Time */}
        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">Total Time</span>
          </div>
          <div className="text-xl font-mono font-bold text-indigo-950 dark:text-indigo-100">
            O(n + m)
          </div>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1">
            Total operations strictly bounded by {patternLength} + {textLength} = {patternLength + textLength} iterations.
          </p>
        </div>

        {/* Auxiliary Space */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
            <HardDrive className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Space Complexity</span>
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
            O(m)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Requires storage for the LPS lookup array of size equal to pattern length m.
          </p>
        </div>
      </div>

      {/* Comparison Explanation */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
          KMP vs. Naive String Matching:
        </h4>
        <p>
          In naive string searching, when a mismatch occurs after several matched characters, the search restarts from the next position in the text (causing pointer backtracking), giving a worst-case time complexity of <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-rose-700 dark:text-rose-400 font-semibold">O(n × m)</code>.
        </p>
        <p>
          <strong>KMP eliminates redundant checks</strong>: It leverages the precomputed LPS table to determine the maximum length of prefix characters that already align with the suffix of the current match. As a result, the text index <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">i</code> never moves backward, and the pattern simply slides forward to the longest viable prefix alignment, guaranteeing optimal <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 font-semibold">O(n + m)</code> time.
        </p>
      </div>
    </div>
  );
};
