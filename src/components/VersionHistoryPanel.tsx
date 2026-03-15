"use client";

import { X, RotateCcw, GitCompare } from "lucide-react";
import { DocFile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VersionHistoryPanelProps {
  file: DocFile;
  onClose: () => void;
}

export default function VersionHistoryPanel({ file, onClose }: VersionHistoryPanelProps) {
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
        {file.history.map((entry, i) => (
          <div
            key={entry.version}
            className={`p-3 rounded-lg border transition-colors ${
              i === 0 ? "border-indigo-200 bg-indigo-50" : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                i === 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"
              }`}>
                v{entry.version}
              </span>
              {i === 0 && (
                <span className="text-[10px] text-indigo-500 font-medium">Current</span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-800 mt-1.5 mb-0.5">{entry.summary}</p>
            <p className="text-[11px] text-gray-400">{formatDate(entry.date)} · {entry.author}</p>
            <div className="flex gap-2 mt-2">
              <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-600 transition-colors">
                <RotateCcw className="w-3 h-3" /> Restore
              </button>
              <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-600 transition-colors">
                <GitCompare className="w-3 h-3" /> Compare
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
