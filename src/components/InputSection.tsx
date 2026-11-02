import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface InputSectionProps {
  text: string;
  pattern: string;
  onTextChange: (val: string) => void;
  onPatternChange: (val: string) => void;
  onVisualize: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  text,
  pattern,
  onTextChange,
  onPatternChange,
  onVisualize,
  onReset,
}) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleVisualizeClick = () => {
    if (!text.trim() || !pattern.trim()) {
      setError('Please provide both Main String (Text) and Pattern String.');
      return;
    }
    setError(null);
    onVisualize();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span>Input Strings & Configuration</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter any text and pattern strings to visually step through the KMP algorithm.
          </p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Main Text <span className="text-slate-400 font-normal">({text.length} chars)</span>
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              onTextChange(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. ABABABABC"
            className="w-full font-mono text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Pattern to Match <span className="text-slate-400 font-normal">({pattern.length} chars)</span>
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => {
              onPatternChange(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. ABAB"
            className="w-full font-mono text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleVisualizeClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-xs transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Visualize KMP</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
          Deterministic non-backtracking simulation
        </div>
      </div>
    </div>
  );
};
