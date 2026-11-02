import React from 'react';
import { Info, HelpCircle, ArrowRight, CornerDownRight } from 'lucide-react';
import type { AlgorithmStep } from '../types/kmp';

interface ExplanationPanelProps {
  step: AlgorithmStep;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ step }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Step-by-Step Explanation</span>
        </h3>

        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          State: {step.status}
        </span>
      </div>

      {/* Primary Action Description */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/60 rounded-xl p-3.5">
        <div className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 uppercase tracking-wide mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Current Operation:</span>
        </div>
        <p className="text-sm text-indigo-950 dark:text-indigo-100 font-medium leading-relaxed font-sans">
          {step.description}
        </p>
      </div>

      {/* Why this operation is performed */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Why this operation is performed:</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3">
          {step.detailedReason}
        </p>
      </div>

      {/* What happens next preview */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Next action:</span>
        </div>
        <div className="text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 flex items-start gap-2">
          <CornerDownRight className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
          <span>{step.nextActionPreview}</span>
        </div>
      </div>
    </div>
  );
};
