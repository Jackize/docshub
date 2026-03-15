"use client";

import { useState } from "react";
import { Plus, ChevronRight, ChevronDown, FileText, Code2 } from "lucide-react";
import { DocFile, Folder } from "@/lib/types";
import { mockFiles, mockFolders } from "@/lib/mock-data";

interface SidebarProps {
  selectedFileId: string | null;
  onFileSelect: (file: DocFile) => void;
}

function FileTypeBadge({ type }: { type: "md" | "html" }) {
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
        type === "html"
          ? "bg-orange-100 text-orange-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {type}
    </span>
  );
}

function FileIcon({ type }: { type: "md" | "html" }) {
  return type === "html" ? (
    <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center shrink-0">
      <Code2 className="w-3.5 h-3.5 text-orange-500" />
    </div>
  ) : (
    <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
      <FileText className="w-3.5 h-3.5 text-gray-500" />
    </div>
  );
}

interface FolderNodeProps {
  folder: Folder;
  allFolders: Folder[];
  allFiles: DocFile[];
  selectedFileId: string | null;
  onFileSelect: (file: DocFile) => void;
  depth?: number;
}

function FolderNode({ folder, allFolders, allFiles, selectedFileId, onFileSelect, depth = 0 }: FolderNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const childFolders = allFolders.filter((f) => f.parentId === folder.id);
  const childFiles = allFiles.filter((f) => f.folderId === folder.id);

  return (
    <div>
      <button
        className="w-full flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        style={{ paddingLeft: `${12 + depth * 12}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        )}
        <span className="font-medium truncate">{folder.name}</span>
      </button>
      {expanded && (
        <div>
          {childFolders.map((cf) => (
            <FolderNode
              key={cf.id}
              folder={cf}
              allFolders={allFolders}
              allFiles={allFiles}
              selectedFileId={selectedFileId}
              onFileSelect={onFileSelect}
              depth={depth + 1}
            />
          ))}
          {childFiles.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              selected={selectedFileId === file.id}
              onSelect={onFileSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileRow({
  file,
  selected,
  onSelect,
  depth = 0,
}: {
  file: DocFile;
  selected: boolean;
  onSelect: (f: DocFile) => void;
  depth?: number;
}) {
  return (
    <button
      className={`w-full flex items-center gap-2 py-1.5 pr-3 text-sm transition-colors rounded-md ${
        selected ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
      }`}
      style={{ paddingLeft: `${12 + depth * 12}px` }}
      onClick={() => onSelect(file)}
    >
      <FileIcon type={file.type} />
      <span className="truncate flex-1 text-left text-xs">{file.name}</span>
      <FileTypeBadge type={file.type} />
    </button>
  );
}

export default function Sidebar({ selectedFileId, onFileSelect }: SidebarProps) {
  const rootFiles = mockFiles.filter((f) => f.folderId === null);
  const rootFolders = mockFolders.filter((f) => f.parentId === null);

  return (
    <aside className="w-[260px] shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <span className="text-sm font-semibold text-gray-800">Documents</span>
        </div>
        <button className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1.5 px-1.5">
        {rootFiles.length === 0 && rootFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <FileText className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400">Upload your first markdown file</p>
          </div>
        ) : (
          <>
            {rootFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                selected={selectedFileId === file.id}
                onSelect={onFileSelect}
              />
            ))}
            {rootFolders.map((folder) => (
              <FolderNode
                key={folder.id}
                folder={folder}
                allFolders={mockFolders}
                allFiles={mockFiles}
                selectedFileId={selectedFileId}
                onFileSelect={onFileSelect}
              />
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
