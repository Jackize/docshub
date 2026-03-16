"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  History,
  Pencil,
  Trash2,
  Home,
  ChevronRight,
  FileText,
  Share2,
  Copy,
  Check,
  X,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocFile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import MarkdownPreview from "./MarkdownPreview";
import EditorSplitView from "./EditorSplitView";
import VersionHistoryPanel from "./VersionHistoryPanel";

interface MainContentProps {
  file: DocFile | null;
  sharedToken?: string | null;
  sharedOwner?: string | null;
  onDeleteFile?: (id: string) => void;
  onSaveFile?: (id: string, content: string) => void;
  onRestoreFile?: (id: string, version: number) => void;
  onShareChange?: () => void;
  onRemoveShare?: (token: string) => void;
}

export default function MainContent({ file, sharedToken, sharedOwner, onDeleteFile, onSaveFile, onRestoreFile, onShareChange, onRemoveShare }: MainContentProps) {
  const [editing, setEditing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shareOpen) return;
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [shareOpen]);

  const shareUrl = file?.shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/shared/${file.shareToken}`
    : null;

  async function handleGenerate() {
    if (!file) return;
    setShareLoading(true);
    await fetch(`/api/files/${file.id}/share`, { method: "POST" });
    setShareLoading(false);
    onShareChange?.();
  }

  async function handleRevoke() {
    if (!file) return;
    setShareLoading(true);
    await fetch(`/api/files/${file.id}/share`, { method: "DELETE" });
    setShareLoading(false);
    onShareChange?.();
    setShareOpen(false);
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!file) {
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
    onSaveFile?.(file.id, newContent);
    setEditing(false);
  };

  const handleDownload = () => {
    const blob = new Blob([file.content], {
      type: file.type === "html" ? "text/html" : "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name}.${file.type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (editing) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <EditorSplitView
          file={file}
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
          {sharedToken ? (
            <>
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-500 font-medium">Shared with me</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-500">{sharedOwner}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 font-medium">{file.name}</span>
            </>
          ) : (
            <>
              <Home className="w-3.5 h-3.5" />
              {(file.breadcrumb ?? []).map((crumb) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3" />
                  <span>{crumb}</span>
                </span>
              ))}
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 font-medium">{file.name}</span>
            </>
          )}
        </div>

        {/* File header */}
        <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                file.type === "html"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              {file.type === "html" ? "HTML" : "Markdown"}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              v{file.version}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
              Updated {formatDate(file.updatedAt)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
            {sharedToken ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 text-red-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                onClick={() => onRemoveShare?.(sharedToken)}
              >
                <Link2 className="w-3.5 h-3.5" />
                Remove from shared
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => setHistoryOpen(true)}
                >
                  <History className="w-3.5 h-3.5" />
                  History
                </Button>
                {/* Share button + popover */}
                <div ref={shareRef} className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs gap-1.5 ${file.shareToken ? "text-indigo-600 border-indigo-200 bg-indigo-50" : ""}`}
                    onClick={() => setShareOpen((o) => !o)}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </Button>
                  {shareOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">Share link</span>
                        <button onClick={() => setShareOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {shareUrl ? (
                        <>
                          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 mb-2">
                            <span className="text-xs text-gray-600 truncate flex-1">{shareUrl}</span>
                            <button
                              onClick={handleCopy}
                              className="shrink-0 text-gray-400 hover:text-indigo-600 transition-colors"
                              title="Copy"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <button
                            onClick={handleRevoke}
                            disabled={shareLoading}
                            className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                          >
                            {shareLoading ? "Revoking…" : "Revoke link"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleGenerate}
                          disabled={shareLoading}
                          className="w-full text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 disabled:opacity-50 transition-colors"
                        >
                          {shareLoading ? "Generating…" : "Generate link"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
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
                  onClick={() => onDeleteFile?.(file.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Document title */}
        <div className="px-8 pt-6 pb-2 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{file.name}</h1>
        </div>

        {/* Content */}
        <div className="px-8 py-4 max-w-4xl">
          <MarkdownPreview file={file} />
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
            file={file}
            onClose={() => setHistoryOpen(false)}
            onRestore={(version) => {
              onRestoreFile?.(file.id, version);
              setHistoryOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}
