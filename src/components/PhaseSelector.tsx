import React from 'react';
import { Layers, Search } from 'lucide-react';
import type { Phase } from '../types/kmp';
import clsx from 'clsx';

interface PhaseSelectorProps {
  currentPhase: Phase;
  onSelectPhase: (phase: Phase) => void;
  isLPSCompleted: boolean;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  currentPhase,
  onSelectPhase,
  isLPSCompleted,
}) => {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800 rounded-2xl w-fit">
      <button
        onClick={() => onSelectPhase('lps')}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer',
          currentPhase === 'lps'
            ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        )}
      >
        <Layers className="w-4 h-4" />
        <span>1. LPS Array Construction</span>
      </button>

      <button
        onClick={() => onSelectPhase('matching')}
        disabled={!isLPSCompleted}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer',
          currentPhase === 'matching'
            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
            : isLPSCompleted
            ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            : 'text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed'
        )}
      >
        <Search className="w-4 h-4" />
        <span>2. Pattern Matching</span>
        {!isLPSCompleted && (
          <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            LPS required
          </span>
        )}
      </button>
    </div>
  );
};
