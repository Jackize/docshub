"use client";

import { useState } from "react";
import { X, RotateCcw, GitCompare } from "lucide-react";
import { DocFile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import DiffViewer from "./DiffViewer";

interface VersionHistoryPanelProps {
  file: DocFile;
  onClose: () => void;
  onRestore?: (version: number) => void;
}

export default function VersionHistoryPanel({ file, onClose, onRestore }: VersionHistoryPanelProps) {
  const [compareVersion, setCompareVersion] = useState<number | null>(null);

  if (compareVersion !== null) {
    const entry = file.history.find((h) => h.version === compareVersion);
    if (entry) {
      return (
        <DiffViewer
          oldContent={entry.content}
          newContent={file.content}
          oldLabel={`v${entry.version}`}
          newLabel={`v${file.version} (current)`}
          onClose={() => setCompareVersion(null)}
        />
      );
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">Version History</h2>
        <button
          className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Current version */}
        <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              v{file.version}
            </span>
            <span className="text-[10px] text-indigo-500 font-medium">Current</span>
          </div>
          <p className="text-xs font-medium text-gray-800 mt-1.5 mb-0.5">Current version</p>
          <p className="text-[11px] text-gray-400">{formatDate(file.updatedAt)} · {file.author}</p>
        </div>

        {/* Past versions — newest first */}
        {file.history.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No previous versions</p>
        )}
        {[...file.history].reverse().map((entry) => (
          <div
            key={entry.version}
            className="p-3 rounded-lg border border-gray-100 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                v{entry.version}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-800 mt-1.5 mb-0.5">{entry.summary}</p>
            <p className="text-[11px] text-gray-400">{formatDate(entry.date)} · {entry.author}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-600 transition-colors"
                onClick={() => onRestore?.(entry.version)}
              >
                <RotateCcw className="w-3 h-3" /> Restore
              </button>
              <button
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-600 transition-colors"
                onClick={() => setCompareVersion(entry.version)}
              >
                <GitCompare className="w-3 h-3" /> Compare
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
