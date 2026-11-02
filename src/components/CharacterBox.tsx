import React from 'react';
import clsx from 'clsx';

interface CharacterBoxProps {
  char: string;
  index?: number;
  label?: string;
  state?: 'idle' | 'comparing' | 'match' | 'mismatch' | 'matched-full' | 'prefix' | 'suffix';
  isPointer?: boolean;
  pointerLabel?: string;
  pointerPosition?: 'top' | 'bottom';
  subText?: string | number;
  highlightSubtext?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CharacterBox: React.FC<CharacterBoxProps> = ({
  char,
  label,
  state = 'idle',
  isPointer = false,
  pointerLabel,
  pointerPosition = 'top',
  subText,
  highlightSubtext = false,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-lg font-bold',
  };

  const stateStyles = {
    idle: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs hover:border-slate-300 dark:hover:border-slate-600',
    comparing: 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-300 dark:ring-amber-600/50 scale-105 z-10',
    match: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-300 dark:ring-emerald-600/50 shadow-sm font-semibold scale-105 z-10',
    mismatch: 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-300 dark:ring-rose-600/50 shadow-sm font-semibold scale-105 z-10',
    'matched-full': 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500 text-white font-bold shadow-md ring-2 ring-emerald-300 dark:ring-emerald-700',
    prefix: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-300',
    suffix: 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 text-purple-900 dark:text-purple-200 ring-1 ring-purple-300',
  };

  return (
    <div className={clsx('flex flex-col items-center select-none relative group', className)}>
      {/* Top pointer slot with constant reserved height to prevent vertical jitter */}
      <div className="h-6 flex flex-col items-center justify-end mb-1">
        {pointerPosition === 'top' && isPointer ? (
          <div className="flex flex-col items-center z-20">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs leading-tight">
              {pointerLabel}
            </span>
            <span className="text-indigo-600 dark:text-indigo-500 text-[9px] -mt-0.5 font-bold leading-none">▼</span>
          </div>
        ) : label !== undefined ? (
          <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
            {label}
          </span>
        ) : null}
      </div>

      {/* Main Character Box */}
      <div
        className={clsx(
          'flex items-center justify-center rounded-lg border-2 font-mono transition-colors duration-200 cursor-default',
          sizeClasses[size],
          stateStyles[state]
        )}
      >
        {char === ' ' ? <span className="text-slate-400 dark:text-slate-500 text-xs font-sans">␣</span> : char}
      </div>

      {/* SubText (e.g. LPS value row) */}
      {subText !== undefined && (
        <div
          className={clsx(
            'mt-1 font-mono text-xs rounded px-2 py-0.5 font-semibold transition-colors duration-200 border',
            highlightSubtext
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-700 dark:border-indigo-400 shadow-xs scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          )}
        >
          {subText}
        </div>
      )}

      {/* Bottom pointer slot with constant reserved height */}
      <div className="h-6 flex flex-col items-center justify-start mt-1">
        {pointerPosition === 'bottom' && isPointer && (
          <div className="flex flex-col items-center z-20">
            <span className="text-emerald-600 dark:text-emerald-500 text-[9px] font-bold leading-none -mb-0.5">▲</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs leading-tight">
              {pointerLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
