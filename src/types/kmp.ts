// Types for KMP Visualizer

export type Phase = 'lps' | 'matching';

export type LPSActionType = 
  | 'init'
  | 'compare'
  | 'match'
  | 'mismatch_fallback'
  | 'mismatch_zero'
  | 'complete';

export interface LPSStep {
  phase: 'lps';
  stepIndex: number;
  i: number;
  len: number;
  lps: number[];
  pattern: string;
  comparing: {
    patternIdxI: number;
    patternIdxLen: number;
  } | null;
  status: LPSActionType;
  comparisonResult?: 'match' | 'mismatch';
  description: string;
  detailedReason: string;
  nextActionPreview: string;
  highlightLines: number[]; // Lines in LPS pseudocode
}

export type MatchingActionType =
  | 'init'
  | 'compare'
  | 'match_char'
  | 'pattern_found'
  | 'mismatch_fallback'
  | 'mismatch_zero'
  | 'complete';

export interface MatchingStep {
  phase: 'matching';
  stepIndex: number;
  text: string;
  pattern: string;
  i: number; // Text pointer
  j: number; // Pattern pointer
  lps: number[];
  matchedIndices: number[]; // starting indices of full matches found so far
  alignOffset: number; // pattern aligns at text index (i - j)
  status: MatchingActionType;
  comparing: {
    textIdx: number;
    patternIdx: number;
  } | null;
  comparisonResult?: 'match' | 'mismatch';
  matchedSubstrings: Array<{ start: number; length: number }>; // For rendering green banners
  description: string;
  detailedReason: string;
  nextActionPreview: string;
  highlightLines: number[]; // Lines in Matching pseudocode
  // Highlighted LPS index when retrieving value for shifting/fallback:
  lpsLookupIndex?: number | null;
  lpsLookupValue?: number | null;
}

export type AlgorithmStep = LPSStep | MatchingStep;
