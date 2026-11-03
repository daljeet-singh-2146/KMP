import type { LPSStep, MatchingStep } from '../types/kmp';

/**
 * Generates all discrete steps for LPS (Longest Proper Prefix which is also Suffix) Array Construction.
 * Detailed intermediate operations:
 * 1. Compare pattern[i] and pattern[len]
 * 2. If match: assign lps[i] = len + 1, len++, i++
 * 3. If mismatch and len != 0: len = lps[len - 1] (fallback animated individually)
 * 4. If mismatch and len == 0: lps[i] = 0, i++
 */

function computeLPS(pattern: string): number[] {
    const m = pattern.length;
    const lps: number[] = new Array(m).fill(0);

    let len = 0;
    let i = 1;

    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } 
        else {
            if (len !== 0) {
                len = lps[len - 1];
            } 
            else {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}

function KMP(text: string, pattern: string): number[] {
    const n = text.length;
    const m = pattern.length;

    if (m === 0) return [];

    const lps = computeLPS(pattern);

    let i = 0; // Text pointer
    let j = 0; // Pattern pointer

    const result: number[] = [];

    while (i < n) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        }

        if (j === m) {
            result.push(i - j);
            j = lps[j - 1];
        }
        else if (i < n && text[i] !== pattern[j]) {
            if (j !== 0) {
                j = lps[j - 1];
            }
            else {
                i++;
            }
        }
    }

    return result;
}

export function generateLPSSteps(pattern: string): LPSStep[] {
  const steps: LPSStep[] = [];
  const m = pattern.length;
  let stepCounter = 0;

  if (m === 0) {
    return [];
  }

  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  // Step 0: Initial state
  steps.push({
    phase: 'lps',
    stepIndex: stepCounter++,
    i: 1,
    len: 0,
    lps: [...lps],
    pattern,
    comparing: null,
    status: 'init',
    description: `Initialize LPS array with zeros. lps[0] is always 0 because a proper prefix cannot be the entire string of length 1.`,
    detailedReason: `For a single character "${pattern[0]}", there is no non-empty proper prefix. We start building from index i = 1 with len = 0.`,
    nextActionPreview: m > 1 ? `Compare pattern[1] ('${pattern[1]}') with pattern[0] ('${pattern[0]}').` : `Pattern length is 1; LPS table is already complete.`,
    highlightLines: [1, 2, 3]
  });

  if (m === 1) {
    steps.push({
      phase: 'lps',
      stepIndex: stepCounter++,
      i: 1,
      len: 0,
      lps: [...lps],
      pattern,
      comparing: null,
      status: 'complete',
      description: `LPS array construction complete for single-character pattern.`,
      detailedReason: `The LPS array is [0]. Ready for pattern matching.`,
      nextActionPreview: `Proceed to Phase 2: KMP Pattern Matching.`,
      highlightLines: [15]
    });
    return steps;
  }

  while (i < m) {
    // 1. Comparison step
    const charI = pattern[i];
    const charLen = pattern[len];
    const isMatch = charI === charLen;

    steps.push({
      phase: 'lps',
      stepIndex: stepCounter++,
      i,
      len,
      lps: [...lps],
      pattern,
      comparing: {
        patternIdxI: i,
        patternIdxLen: len,
      },
      status: 'compare',
      comparisonResult: isMatch ? 'match' : 'mismatch',
      description: `Comparing pattern[i=${i}] ('${charI}') with pattern[len=${len}] ('${charLen}').`,
      detailedReason: `We check if the current suffix ending at index ${i} can be extended by comparing it to the character right after the current longest prefix of length ${len}.`,
      nextActionPreview: isMatch
        ? `Characters match! Increment len to ${len + 1}, set lps[${i}] = ${len + 1}, and move i to ${i + 1}.`
        : len !== 0
          ? `Mismatch! Fallback len using lps[len - 1] = lps[${len - 1}] (${lps[len - 1]}).`
          : `Mismatch and len is 0. Set lps[${i}] = 0 and move i to ${i + 1}.`,
      highlightLines: [4, 5]
    });

    if (isMatch) {
      len++;
      lps[i] = len;

      steps.push({
        phase: 'lps',
        stepIndex: stepCounter++,
        i,
        len,
        lps: [...lps],
        pattern,
        comparing: {
          patternIdxI: i,
          patternIdxLen: len - 1,
        },
        status: 'match',
        comparisonResult: 'match',
        description: `Match! '${charI}' == '${charLen}'. Set lps[${i}] = ${len}.`,
        detailedReason: `Prefix "${pattern.substring(0, len)}" matches suffix "${pattern.substring(i - len + 1, i + 1)}". Length is ${len}.`,
        nextActionPreview: i + 1 < m 
          ? `Advance pointer i to ${i + 1}.` 
          : `LPS construction is completed.`,
        highlightLines: [6, 7]
      });

      i++;
    } else {
      if (len !== 0) {
        const prevLen = len;
        const nextLen = lps[len - 1];

        steps.push({
          phase: 'lps',
          stepIndex: stepCounter++,
          i,
          len: nextLen,
          lps: [...lps],
          pattern,
          comparing: {
            patternIdxI: i,
            patternIdxLen: prevLen,
          },
          status: 'mismatch_fallback',
          comparisonResult: 'mismatch',
          description: `Mismatch: '${charI}' != '${charLen}'. Fallback len = lps[${prevLen - 1}] = ${nextLen}.`,
          detailedReason: `Instead of resetting len to 0, we jump back to the previous known longest prefix-suffix length lps[${prevLen - 1}] (${nextLen}). Pointer i stays at ${i}.`,
          nextActionPreview: `Compare pattern[${i}] ('${charI}') with pattern[${nextLen}] ('${pattern[nextLen]}').`,
          highlightLines: [9, 10]
        });

        len = nextLen;
      } else {
        lps[i] = 0;

        steps.push({
          phase: 'lps',
          stepIndex: stepCounter++,
          i,
          len: 0,
          lps: [...lps],
          pattern,
          comparing: {
            patternIdxI: i,
            patternIdxLen: 0,
          },
          status: 'mismatch_zero',
          comparisonResult: 'mismatch',
          description: `Mismatch: '${charI}' != '${charLen}' and len is 0. Set lps[${i}] = 0.`,
          detailedReason: `No matching prefix could be found for the substring ending at index ${i}. Therefore, lps[${i}] is 0.`,
          nextActionPreview: i + 1 < m 
            ? `Advance pointer i to ${i + 1}.` 
            : `LPS construction is completed.`,
          highlightLines: [11, 12, 13]
        });

        i++;
      }
    }
  }

  // Final Complete Step
  steps.push({
    phase: 'lps',
    stepIndex: stepCounter++,
    i: m,
    len,
    lps: [...lps],
    pattern,
    comparing: null,
    status: 'complete',
    description: `LPS array construction complete! All values computed.`,
    detailedReason: `The table [${lps.join(', ')}] will now guide the KMP search to skip redundant character comparisons without ever backtracking the text pointer.`,
    nextActionPreview: `Ready to start Phase 2: KMP Pattern Matching.`,
    highlightLines: [15]
  });

  return steps;
}

/**
 * Generates all discrete steps for KMP Pattern Matching against the text.
 */
export function generateMatchingSteps(text: string, pattern: string, lps: number[]): MatchingStep[] {
  const steps: MatchingStep[] = [];
  const n = text.length;
  const m = pattern.length;
  let stepCounter = 0;

  if (m === 0 || n === 0) {
    return [];
  }

  let i = 0; // index for text
  let j = 0; // index for pattern
  const matchedIndices: number[] = [];
  const matchedSubstrings: Array<{ start: number; length: number }> = [];

  // Initial step
  steps.push({
    phase: 'matching',
    stepIndex: stepCounter++,
    text,
    pattern,
    i: 0,
    j: 0,
    lps,
    matchedIndices: [...matchedIndices],
    alignOffset: 0,
    status: 'init',
    comparing: null,
    matchedSubstrings: [...matchedSubstrings],
    description: `Start KMP Pattern Matching. Text pointer i = 0, Pattern pointer j = 0.`,
    detailedReason: `Pattern is aligned at text index 0. We begin comparing characters text[i] and pattern[j].`,
    nextActionPreview: `Compare text[0] ('${text[0]}') with pattern[0] ('${pattern[0]}').`,
    highlightLines: [1, 2, 3],
    lpsLookupIndex: null,
    lpsLookupValue: null,
  });

  while (i < n) {
    const alignOffset = i - j;
    const charText = text[i];
    const charPat = pattern[j];
    const isMatch = charText === charPat;

    // 1. Comparison Step
    steps.push({
      phase: 'matching',
      stepIndex: stepCounter++,
      text,
      pattern,
      i,
      j,
      lps,
      matchedIndices: [...matchedIndices],
      alignOffset,
      status: 'compare',
      comparing: {
        textIdx: i,
        patternIdx: j,
      },
      comparisonResult: isMatch ? 'match' : 'mismatch',
      matchedSubstrings: [...matchedSubstrings],
      description: `Comparing text[i=${i}] ('${charText}') with pattern[j=${j}] ('${charPat}').`,
      detailedReason: `Checking if character in text matches the expected character in pattern at alignment index ${alignOffset}.`,
      nextActionPreview: isMatch
        ? (j + 1 === m
            ? `Full pattern match will be detected! Record match at index ${i - m + 1}.`
            : `Match! Advance both i (to ${i + 1}) and j (to ${j + 1}).`)
        : (j !== 0
            ? `Mismatch! Fallback pattern pointer j = lps[${j - 1}] (${lps[j - 1]}). Text pointer i stays at ${i}.`
            : `Mismatch at pattern start! Advance text pointer i to ${i + 1}. Pattern remains at j = 0.`),
      highlightLines: [4, 5],
      lpsLookupIndex: !isMatch && j !== 0 ? j - 1 : null,
      lpsLookupValue: !isMatch && j !== 0 ? lps[j - 1] : null,
    });

    if (isMatch) {
      i++;
      j++;

      if (j === m) {
        const foundStart = i - m;
        matchedIndices.push(foundStart);
        matchedSubstrings.push({ start: foundStart, length: m });
        const nextJ = lps[j - 1];

        steps.push({
          phase: 'matching',
          stepIndex: stepCounter++,
          text,
          pattern,
          i,
          j,
          lps,
          matchedIndices: [...matchedIndices],
          alignOffset: foundStart,
          status: 'pattern_found',
          comparing: null,
          matchedSubstrings: [...matchedSubstrings],
          description: `🎉 Pattern FOUND at index ${foundStart}! Full match confirmed.`,
          detailedReason: `All ${m} characters matched from text[${foundStart}] to text[${i - 1}]. Reading LPS table at index [${j - 1}] -> ${nextJ} to shift pattern and find overlapping matches without backtracking.`,
          nextActionPreview: i < n 
            ? `Retrieved lps[${j - 1}] = ${nextJ}. Shift pattern to j = ${nextJ} for next search.` 
            : `Search complete!`,
          highlightLines: [7, 8, 9],
          lpsLookupIndex: j - 1,
          lpsLookupValue: nextJ,
        });

        j = nextJ;
      } else {
        steps.push({
          phase: 'matching',
          stepIndex: stepCounter++,
          text,
          pattern,
          i,
          j,
          lps,
          matchedIndices: [...matchedIndices],
          alignOffset: i - j,
          status: 'match_char',
          comparing: null,
          matchedSubstrings: [...matchedSubstrings],
          description: `Match! '${charText}' == '${charPat}'. Advanced i to ${i}, j to ${j}.`,
          detailedReason: `Prefix of length ${j} matches. Moving forward to compare next characters.`,
          nextActionPreview: i < n ? `Compare text[${i}] ('${text[i]}') with pattern[${j}] ('${pattern[j]}').` : `Reached end of text.`,
          highlightLines: [6],
          lpsLookupIndex: null,
          lpsLookupValue: null,
        });
      }
    } else {
      // Mismatch
      if (j !== 0) {
        const oldJ = j;
        const newJ = lps[j - 1];
        const newAlignOffset = i - newJ;

        steps.push({
          phase: 'matching',
          stepIndex: stepCounter++,
          text,
          pattern,
          i,
          j: newJ,
          lps,
          matchedIndices: [...matchedIndices],
          alignOffset: newAlignOffset,
          status: 'mismatch_fallback',
          comparing: null,
          matchedSubstrings: [...matchedSubstrings],
          description: `Mismatch: '${charText}' != '${charPat}'. Consulted LPS[${oldJ - 1}] = ${newJ}. Shift pattern so j becomes ${newJ}.`,
          detailedReason: `KMP optimization: Looked up lps[${oldJ - 1}] = ${newJ} directly from the LPS table. This tells us the longest prefix already matched with text suffix is of length ${newJ}. Shifted pattern alignment to ${newAlignOffset} without backtracking text pointer i = ${i}!`,
          nextActionPreview: `Compare text[${i}] ('${charText}') with pattern[${newJ}] ('${pattern[newJ]}').`,
          highlightLines: [10, 11],
          lpsLookupIndex: oldJ - 1,
          lpsLookupValue: newJ,
        });

        j = newJ;
      } else {
        // j == 0
        const oldI = i;
        i++;
        const newAlignOffset = i;

        steps.push({
          phase: 'matching',
          stepIndex: stepCounter++,
          text,
          pattern,
          i,
          j: 0,
          lps,
          matchedIndices: [...matchedIndices],
          alignOffset: newAlignOffset,
          status: 'mismatch_zero',
          comparing: null,
          matchedSubstrings: [...matchedSubstrings],
          description: `Mismatch: '${charText}' != '${charPat}' and j = 0. Advance text pointer i = ${oldI + 1}.`,
          detailedReason: `Since even the first character of the pattern failed to match text[${oldI}], pattern alignment shifts 1 position to the right.`,
          nextActionPreview: i < n ? `Compare text[${i}] ('${text[i]}') with pattern[0] ('${pattern[0]}').` : `End of text reached.`,
          highlightLines: [12, 13],
          lpsLookupIndex: null,
          lpsLookupValue: null,
        });
      }
    }
  }

  // Final Complete step
  steps.push({
    phase: 'matching',
    stepIndex: stepCounter++,
    text,
    pattern,
    i,
    j,
    lps,
    matchedIndices: [...matchedIndices],
    alignOffset: i - j,
    status: 'complete',
    comparing: null,
    matchedSubstrings: [...matchedSubstrings],
    description: `Pattern Matching Complete! Total matches found: ${matchedIndices.length}.`,
    detailedReason: matchedIndices.length > 0
      ? `Found ${matchedIndices.length} occurrence(s) at starting indices: [${matchedIndices.join(', ')}].`
      : `Pattern "${pattern}" was not found in the main text.`,
    nextActionPreview: `Search finished. You can step back through the animation or try another example!`,
    highlightLines: [15],
    lpsLookupIndex: null,
    lpsLookupValue: null,
  });

  return steps;
}
