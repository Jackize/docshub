"use client";

import { useState } from "react";
import {
  Download,
  History,
  Pencil,
  Trash2,
  Home,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocFile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import MarkdownPreview from "./MarkdownPreview";
import EditorSplitView from "./EditorSplitView";
import VersionHistoryPanel from "./VersionHistoryPanel";

interface MainContentProps {
  file: DocFile | null;
}

export default function MainContent({ file }: MainContentProps) {
  const [editing, setEditing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<DocFile | null>(null);

  const activeFile = currentFile ?? file;

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-700 mb-1">No document selected</h2>
        <p className="text-sm text-gray-400 max-w-xs">
          Choose a document from the sidebar or upload a new file to get started.
        </p>
      </div>
    );
  }

  const handleSave = (newContent: string) => {
    setCurrentFile({
      ...activeFile,
      content: newContent,
      version: activeFile.version + 1,
      updatedAt: new Date(),
    });
    setEditing(false);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], {
      type: activeFile.type === "html" ? "text/html" : "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeFile.name}.${activeFile.type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (editing) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <EditorSplitView
          file={activeFile}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="px-8 pt-5 pb-1 flex items-center gap-1.5 text-xs text-gray-400">
          <Home className="w-3.5 h-3.5" />
          {(activeFile.breadcrumb ?? []).map((crumb) => (
            <span key={crumb} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3" />
              <span>{crumb}</span>
            </span>
          ))}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">{activeFile.name}</span>
        </div>

        {/* File header */}
        <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                activeFile.type === "html"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              {activeFile.type === "html" ? "HTML" : "Markdown"}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              v{activeFile.version}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
              Updated {formatDate(activeFile.updatedAt)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setHistoryOpen(true)}
            >
              <History className="w-3.5 h-3.5" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 text-red-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        </div>

        {/* Document title */}
        <div className="px-8 pt-6 pb-2 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{activeFile.name}</h1>
        </div>

        {/* Content */}
        <div className="px-8 py-4 max-w-4xl">
          <MarkdownPreview file={activeFile} />
        </div>
      </div>

      {/* Version history drawer */}
      {historyOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setHistoryOpen(false)}
          />
          <VersionHistoryPanel
            file={activeFile}
            onClose={() => setHistoryOpen(false)}
          />
        </>
      )}
    </div>
  );
}
