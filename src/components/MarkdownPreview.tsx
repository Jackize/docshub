"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DocFile } from "@/lib/types";

interface MarkdownPreviewProps {
  file: DocFile;
}

export default function MarkdownPreview({ file }: MarkdownPreviewProps) {
  if (file.type === "html") {
    return (
      <div
        className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600 prose-code:text-indigo-700 prose-code:bg-indigo-50 prose-code:px-1 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: file.content }}
      />
    );
  }

  return (
    <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600 prose-code:text-indigo-700 prose-code:bg-indigo-50 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-table:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{file.content}</ReactMarkdown>
    </div>
  );
}
