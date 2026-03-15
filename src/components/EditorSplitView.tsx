"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocFile } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorSplitViewProps {
  file: DocFile;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

export default function EditorSplitView({ file, onSave, onCancel }: EditorSplitViewProps) {
  const [content, setContent] = useState(file.content);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50">
        <p className="text-sm font-medium text-gray-700">Editing: <span className="text-gray-900">{file.name}</span></p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onCancel}>
            <X className="w-3.5 h-3.5" /> Cancel
          </Button>
          <Button size="sm" className="h-7 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => onSave(content)}>
            <Check className="w-3.5 h-3.5" /> Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-medium text-gray-500">Editor</span>
          </div>
          <textarea
            className="flex-1 resize-none p-4 text-sm font-mono text-gray-800 outline-none bg-white leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-medium text-gray-500">Preview</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {file.type === "html" ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
