import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Gauge
} from 'lucide-react';
import clsx from 'clsx';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const SPEED_PRESETS = [0.25, 0.5, 1, 1.5, 2, 3];

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onRestart,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  disabled = false,
}) => {
  const isFirstStep = currentStep <= 0;
  const isLastStep = totalSteps === 0 || currentStep >= totalSteps - 1;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
      {/* 1. Playback action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Restart */}
        <button
          onClick={onRestart}
          disabled={disabled || isFirstStep}
          title="Restart phase (Step 0)"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-200 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Previous */}
        <button
          onClick={onPrevious}
          disabled={disabled || isFirstStep}
          title="Previous Step"
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-200 font-medium text-xs transition cursor-pointer"
        >
          <SkipBack className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Play / Pause Primary Button */}
        {isPlaying ? (
          <button
            onClick={onPause}
            disabled={disabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={disabled || isLastStep}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play</span>
          </button>
        )}

        {/* Next */}
        <button
          onClick={onNext}
          disabled={disabled || isLastStep}
          title="Next Step"
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-200 font-medium text-xs transition cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Step Progress & Counter */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
          Step <span className="font-bold text-slate-900 dark:text-white">{totalSteps > 0 ? currentStep + 1 : 0}</span> / {totalSteps}
        </div>

        {/* Progress Bar */}
        <div className="w-20 sm:w-28 md:w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-200"
            style={{
              width: `${totalSteps > 0 ? Math.min(100, ((currentStep + 1) / totalSteps) * 100) : 0}%`,
            }}
          />
        </div>
      </div>

      {/* 3. Speed Slider & Presets */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Speed:</span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-16 sm:w-20 accent-indigo-600 cursor-pointer"
        />

        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200 w-7 text-center">
          {speed}x
        </span>

        {/* Quick speed buttons */}
        <div className="flex items-center gap-1">
          {SPEED_PRESETS.map((val) => (
            <button
              key={val}
              onClick={() => onSpeedChange(val)}
              className={clsx(
                'px-1.5 py-0.5 text-[10px] font-mono rounded border transition cursor-pointer',
                speed === val
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              {val}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
