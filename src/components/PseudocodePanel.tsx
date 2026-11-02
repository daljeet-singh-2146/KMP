import React from 'react';
import { Code2 } from 'lucide-react';
import type { Phase } from '../types/kmp';
import clsx from 'clsx';

interface PseudocodePanelProps {
  phase: Phase;
  highlightLines: number[];
}

const LPS_PSEUDOCODE = [
  { line: 1, text: 'function buildLPS(pattern):' },
  { line: 2, text: '    len = 0, lps[0] = 0, i = 1' },
  { line: 3, text: '    while i < pattern.length:' },
  { line: 4, text: '        if pattern[i] == pattern[len]:' },
  { line: 5, text: '            len++' },
  { line: 6, text: '            lps[i] = len' },
  { line: 7, text: '            i++' },
  { line: 8, text: '        else:' },
  { line: 9, text: '            if len != 0:' },
  { line: 10, text: '                len = lps[len - 1] // Fallback' },
  { line: 11, text: '            else:' },
  { line: 12, text: '                lps[i] = 0' },
  { line: 13, text: '                i++' },
  { line: 14, text: '    return lps' },
  { line: 15, text: '// LPS complete' },
];

const MATCHING_PSEUDOCODE = [
  { line: 1, text: 'function KMPSearch(text, pattern, lps):' },
  { line: 2, text: '    i = 0, j = 0' },
  { line: 3, text: '    while i < text.length:' },
  { line: 4, text: '        if text[i] == pattern[j]:' },
  { line: 5, text: '            i++; j++' },
  { line: 6, text: '            if j == pattern.length:' },
  { line: 7, text: '                report match at (i - j)' },
  { line: 8, text: '                j = lps[j - 1] // Overlap search' },
  { line: 9, text: '        else if j != 0:' },
  { line: 10, text: '            j = lps[j - 1] // Shift pattern' },
  { line: 11, text: '        else:' },
  { line: 12, text: '            i++ // Start match from next char' },
  { line: 13, text: '// Search complete' },
];

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  phase,
  highlightLines,
}) => {
  const codeLines = phase === 'lps' ? LPS_PSEUDOCODE : MATCHING_PSEUDOCODE;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 text-slate-100 shadow-sm border border-slate-800 dark:border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span>{phase === 'lps' ? 'LPS Construction Algorithm' : 'KMP Search Algorithm'}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Pseudocode
        </span>
      </div>

      <div className="font-mono text-xs overflow-x-auto space-y-0.5 leading-5 flex-1">
        {codeLines.map(({ line, text }) => {
          const isHighlighted = highlightLines.includes(line);

          return (
            <div
              key={line}
              className={clsx(
                'flex items-center px-2 py-0.5 rounded transition-colors duration-150',
                isHighlighted
                  ? 'bg-indigo-600/30 text-indigo-200 border-l-2 border-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-300'
              )}
            >
              <span className="w-6 text-slate-600 select-none text-[11px] text-right mr-3">
                {line}
              </span>
              <span className="whitespace-pre">{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
