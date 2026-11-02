import { useState, useEffect, useRef, useCallback } from 'react';
import { generateLPSSteps, generateMatchingSteps } from './utils/kmpAlgorithm';
import type { Phase, LPSStep, MatchingStep } from './types/kmp';
import { InputSection } from './components/InputSection';
import { AnimationControls } from './components/AnimationControls';
import { LPSVisualizer } from './components/LPSVisualizer';
import { MatchingVisualizer } from './components/MatchingVisualizer';
import { ExplanationPanel } from './components/ExplanationPanel';
import { AlgorithmState } from './components/AlgorithmState';
import { PseudocodePanel } from './components/PseudocodePanel';
import { ComplexitySection } from './components/ComplexitySection';
import { PhaseSelector } from './components/PhaseSelector';
import { Sun, Moon } from 'lucide-react';

export function App() {
  // Theme state (Day / Night mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Input string states
  const [text, setText] = useState<string>('ABABABABC');
  const [pattern, setPattern] = useState<string>('ABAB');

  // Phase & Steps state
  const [phase, setPhase] = useState<Phase>('lps');
  const [lpsSteps, setLpsSteps] = useState<LPSStep[]>([]);
  const [matchingSteps, setMatchingSteps] = useState<MatchingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Playback control state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.25x to 3x

  // Animation timer ref
  const timerRef = useRef<number | null>(null);

  // Generate steps based on current inputs
  const computeSteps = useCallback((inputText: string, inputPattern: string) => {
    const lps = generateLPSSteps(inputPattern);
    setLpsSteps(lps);

    // Get final LPS array to build matching steps
    const finalLps = lps.length > 0 ? lps[lps.length - 1].lps : [];
    const matching = generateMatchingSteps(inputText, inputPattern, finalLps);
    setMatchingSteps(matching);

    return { lps, matching };
  }, []);

  // Compute initial state on mount so LPS table is immediately shown
  useEffect(() => {
    computeSteps(text, pattern);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle "Visualize KMP" button
  const handleStartVisualize = () => {
    setIsPlaying(false);
    computeSteps(text, pattern);
    setPhase('lps');
    setCurrentStepIndex(0);
  };

  // Reset visualizer
  const handleReset = () => {
    setIsPlaying(false);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    setCurrentStepIndex(0);
    setPhase('lps');
    computeSteps(text, pattern);
  };

  // Active steps based on phase
  const activeSteps = phase === 'lps' ? lpsSteps : matchingSteps;
  const totalSteps = activeSteps.length;
  const currentStep = activeSteps[currentStepIndex] || activeSteps[0];

  const isLPSCompleted = lpsSteps.length > 0 && lpsSteps[lpsSteps.length - 1].status === 'complete';

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [totalSteps]);

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(200, 1000 / speed);
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, totalSteps]);

  // Phase transition handler
  const handleSwitchPhase = (targetPhase: Phase) => {
    setIsPlaying(false);
    setPhase(targetPhase);
    setCurrentStepIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover shadow-xs"
            />
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                KMP Algorithm Visualizer
              </h1>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Knuth-Morris-Pratt Interactive Visualizer & Learning Lab
              </span>
            </div>
          </div>

          {/* Right Header items: Day/Night Mode Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Toggle dark/light mode"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-xs font-semibold shadow-xs"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Day Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Night Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Input Configuration Section */}
        <InputSection
          text={text}
          pattern={pattern}
          onTextChange={(val) => {
            setText(val);
            if (val.trim() && pattern.trim()) {
              computeSteps(val, pattern);
            }
          }}
          onPatternChange={(val) => {
            setPattern(val);
            if (text.trim() && val.trim()) {
              computeSteps(text, val);
            }
          }}
          onVisualize={handleStartVisualize}
          onReset={handleReset}
          disabled={isPlaying}
        />

        {/* Visualizer Content: Always active & showing the LPS table / matching canvas */}
        {currentStep && (
          <div className="space-y-6 animate-fadeIn">
            {/* Phase Switcher & Playback Control Bar */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
              <div className="shrink-0">
                <PhaseSelector
                  currentPhase={phase}
                  onSelectPhase={handleSwitchPhase}
                  isLPSCompleted={isLPSCompleted}
                />
              </div>

              <div className="flex-1">
                <AnimationControls
                  isPlaying={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onRestart={handleRestart}
                  currentStep={currentStepIndex}
                  totalSteps={totalSteps}
                  speed={speed}
                  onSpeedChange={setSpeed}
                />
              </div>
            </div>

            {/* Visualizer Canvas Card */}
            {phase === 'lps' ? (
              <LPSVisualizer
                currentStepData={currentStep as LPSStep}
                onProceedToMatching={() => handleSwitchPhase('matching')}
                canProceedToMatching={isLPSCompleted}
              />
            ) : (
              <MatchingVisualizer
                currentStepData={currentStep as MatchingStep}
              />
            )}

            {/* Deep State & Explanation Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Algorithm State details */}
              <div className="lg:col-span-1">
                <AlgorithmState step={currentStep} />
              </div>

              {/* Dynamic Explanation Panel */}
              <div className="lg:col-span-1">
                <ExplanationPanel step={currentStep} />
              </div>

              {/* Live Pseudocode Line Highlight */}
              <div className="lg:col-span-1">
                <PseudocodePanel
                  phase={phase}
                  highlightLines={currentStep.highlightLines}
                />
              </div>
            </div>

            {/* Complexity Analysis Section */}
            <ComplexitySection
              textLength={text.length}
              patternLength={pattern.length}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
