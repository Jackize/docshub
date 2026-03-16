"use client";

import { X } from "lucide-react";

type DiffLineType = "equal" | "remove" | "add";

interface DiffLine {
  type: DiffLineType;
  line: string;
  oldLineNo: number | null;
  newLineNo: number | null;
}

interface Hunk {
  lines: DiffLine[];
}

// LCS-based line diff
function computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const m = oldLines.length;
  const n = newLines.length;

  // dp[i][j] = LCS length for oldLines[0..i-1], newLines[0..j-1]
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const result: DiffLine[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.push({ type: "equal", line: oldLines[i - 1], oldLineNo: i, newLineNo: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "add", line: newLines[j - 1], oldLineNo: null, newLineNo: j });
      j--;
    } else {
      result.push({ type: "remove", line: oldLines[i - 1], oldLineNo: i, newLineNo: null });
      i--;
    }
  }

  return result.reverse();
}

function buildHunks(diff: DiffLine[], context = 3): Hunk[] {
  // Find indices of changed lines
  const changedIdx = new Set<number>();
  diff.forEach((line, idx) => {
    if (line.type !== "equal") {
      for (let k = Math.max(0, idx - context); k <= Math.min(diff.length - 1, idx + context); k++) {
        changedIdx.add(k);
      }
    }
  });

  if (changedIdx.size === 0) return [];

  // Group into contiguous ranges
  const sorted = [...changedIdx].sort((a, b) => a - b);
  const hunks: Hunk[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let k = 1; k < sorted.length; k++) {
    if (sorted[k] === end + 1) {
      end = sorted[k];
    } else {
      hunks.push({ lines: diff.slice(start, end + 1) });
      start = sorted[k];
      end = sorted[k];
    }
  }
  hunks.push({ lines: diff.slice(start, end + 1) });

  return hunks;
}

function LineNo({ n }: { n: number | null }) {
  return (
    <span className="inline-block w-10 text-right pr-3 select-none text-gray-400 shrink-0 text-[11px]">
      {n ?? ""}
    </span>
  );
}

interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  oldLabel: string;
  newLabel: string;
  onClose: () => void;
}

export default function DiffViewer({ oldContent, newContent, oldLabel, newLabel, onClose }: DiffViewerProps) {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");
  const diff = computeDiff(oldLines, newLines);
  const hunks = buildHunks(diff, 3);

  const added = diff.filter((l) => l.type === "add").length;
  const removed = diff.filter((l) => l.type === "remove").length;
  const unchanged = diff.length === 0 || (added === 0 && removed === 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-800">Comparing versions</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-mono font-semibold">
              {oldLabel}
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 font-mono font-semibold">
              {newLabel}
            </span>
          </div>
          {!unchanged && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-green-600 font-medium">+{added}</span>
              <span className="text-red-500 font-medium">−{removed}</span>
            </div>
          )}
        </div>
        <button
          className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Diff body */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {unchanged ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <p className="text-sm font-medium">No differences</p>
            <p className="text-xs mt-1">These two versions have identical content.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Column headers */}
            <div className="flex text-[10px] font-mono text-gray-400 px-2 gap-2">
              <span className="w-10 text-right pr-3">old</span>
              <span className="w-10 text-right pr-3">new</span>
            </div>

            {hunks.map((hunk, hi) => (
              <div key={hi} className="rounded-lg border border-gray-200 overflow-hidden font-mono text-xs">
                {/* Hunk separator */}
                <div className="bg-gray-100 border-b border-gray-200 px-3 py-0.5 text-[10px] text-gray-400 select-none">
                  @@ {hunk.lines[0].oldLineNo !== null ? `old line ${hunk.lines[0].oldLineNo}` : ""}{" "}
                  {hunk.lines[0].newLineNo !== null ? `new line ${hunk.lines[0].newLineNo}` : ""}
                </div>

                {hunk.lines.map((dl, li) => (
                  <div
                    key={li}
                    className={`flex items-start leading-5 ${
                      dl.type === "add"
                        ? "bg-green-50"
                        : dl.type === "remove"
                        ? "bg-red-50"
                        : "bg-white"
                    }`}
                  >
                    {/* Old line number */}
                    <LineNo n={dl.oldLineNo} />
                    {/* New line number */}
                    <LineNo n={dl.newLineNo} />
                    {/* Diff marker */}
                    <span
                      className={`w-4 shrink-0 select-none text-center ${
                        dl.type === "add"
                          ? "text-green-600"
                          : dl.type === "remove"
                          ? "text-red-500"
                          : "text-gray-300"
                      }`}
                    >
                      {dl.type === "add" ? "+" : dl.type === "remove" ? "−" : " "}
                    </span>
                    {/* Line content */}
                    <span
                      className={`flex-1 pl-1 pr-3 whitespace-pre-wrap break-all ${
                        dl.type === "add"
                          ? "text-green-900"
                          : dl.type === "remove"
                          ? "text-red-800"
                          : "text-gray-700"
                      }`}
                    >
                      {dl.line || " "}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
