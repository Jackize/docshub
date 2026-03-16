"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  ChevronRight,
  ChevronDown,
  FileText,
  Code2,
  Pencil,
  Trash2,
  FolderInput,
} from "lucide-react";
import { DocFile, Folder } from "@/lib/types";

interface SidebarProps {
  files: DocFile[];
  folders: Folder[];
  selectedFileId: string | null;
  onFileSelect: (file: DocFile) => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFile: (id: string, name: string) => void;
  onMoveFile: (id: string, folderId: string | null) => void;
  onDeleteFile: (id: string) => void;
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

// Move dropdown rendered at fixed position to avoid overflow clipping
function MoveDropdown({
  file,
  folders,
  triggerRect,
  onMove,
  onClose,
}: {
  file: DocFile;
  folders: Folder[];
  triggerRect: DOMRect;
  onMove: (folderId: string | null) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const style: React.CSSProperties = {
    position: "fixed",
    top: triggerRect.bottom + 4,
    left: triggerRect.left,
    zIndex: 9999,
    minWidth: 160,
  };

  return (
    <div
      ref={ref}
      style={style}
      className="bg-white border border-gray-200 rounded-lg shadow-xl py-1 text-sm"
    >
      <button
        className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
          file.folderId === null ? "text-indigo-600 font-medium" : "text-gray-700"
        }`}
        onClick={() => { onMove(null); onClose(); }}
      >
        Root
      </button>
      {folders.map((f) => (
        <button
          key={f.id}
          className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
            file.folderId === f.id ? "text-indigo-600 font-medium" : "text-gray-700"
          }`}
          onClick={() => { onMove(f.id); onClose(); }}
        >
          {f.name}
        </button>
      ))}
    </div>
  );
}

interface FileRowProps {
  file: DocFile;
  selected: boolean;
  depth?: number;
  folders: Folder[];
  onSelect: (f: DocFile) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, folderId: string | null) => void;
  onDelete: (id: string) => void;
}

function FileRow({ file, selected, depth = 0, folders, onSelect, onRename, onMove, onDelete }: FileRowProps) {
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);
  const [moveOpen, setMoveOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const moveBtnRef = useRef<HTMLButtonElement>(null);

  function commitRename() {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== file.name) {
      onRename(file.id, trimmed);
    }
    setRenaming(false);
  }

  function openMove() {
    if (moveBtnRef.current) {
      setTriggerRect(moveBtnRef.current.getBoundingClientRect());
    }
    setMoveOpen(true);
  }

  return (
    <div
      className="group relative"
      style={{ paddingLeft: `${12 + depth * 12}px` }}
    >
      {renaming ? (
        <input
          autoFocus
          className="w-full text-xs border border-indigo-400 rounded px-2 py-1 outline-none my-0.5"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") { setRenameValue(file.name); setRenaming(false); }
          }}
        />
      ) : (
        <div className="flex items-center">
          <button
            className={`flex-1 flex items-center gap-2 py-1.5 pr-1 text-sm transition-colors rounded-md ${
              selected ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onSelect(file)}
          >
            <FileIcon type={file.type} />
            <span className="truncate flex-1 text-left text-xs">{file.name}</span>
            <FileTypeBadge type={file.type} />
          </button>
          <div className="hidden group-hover:flex items-center gap-0.5 pr-1 shrink-0">
            <button
              className="w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700"
              title="Rename"
              onClick={(e) => { e.stopPropagation(); setRenameValue(file.name); setRenaming(true); }}
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              ref={moveBtnRef}
              className="w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700"
              title="Move to folder"
              onClick={(e) => { e.stopPropagation(); openMove(); }}
            >
              <FolderInput className="w-3 h-3" />
            </button>
            <button
              className="w-5 h-5 rounded hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-600"
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      {moveOpen && triggerRect && (
        <MoveDropdown
          file={file}
          folders={folders}
          triggerRect={triggerRect}
          onMove={(folderId) => onMove(file.id, folderId)}
          onClose={() => setMoveOpen(false)}
        />
      )}
    </div>
  );
}

interface FolderNodeProps {
  folder: Folder;
  allFolders: Folder[];
  allFiles: DocFile[];
  selectedFileId: string | null;
  depth?: number;
  onFileSelect: (file: DocFile) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFile: (id: string, name: string) => void;
  onMoveFile: (id: string, folderId: string | null) => void;
  onDeleteFile: (id: string) => void;
}

function FolderNode({
  folder,
  allFolders,
  allFiles,
  selectedFileId,
  depth = 0,
  onFileSelect,
  onRenameFolder,
  onDeleteFolder,
  onRenameFile,
  onMoveFile,
  onDeleteFile,
}: FolderNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.name);

  const childFolders = allFolders.filter((f) => f.parentId === folder.id);
  const childFiles = allFiles.filter((f) => f.folderId === folder.id);

  function commitRename() {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== folder.name) {
      onRenameFolder(folder.id, trimmed);
    }
    setRenaming(false);
  }

  return (
    <div>
      <div
        className="group flex items-center"
        style={{ paddingLeft: `${12 + depth * 12}px` }}
      >
        {renaming ? (
          <input
            autoFocus
            className="flex-1 text-xs border border-indigo-400 rounded px-2 py-1 outline-none my-0.5"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") { setRenameValue(folder.name); setRenaming(false); }
            }}
          />
        ) : (
          <>
            <button
              className="flex-1 flex items-center gap-1.5 py-1.5 pr-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <span className="font-medium truncate text-sm">{folder.name}</span>
            </button>
            <div className="hidden group-hover:flex items-center gap-0.5 pr-1 shrink-0">
              <button
                className="w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700"
                title="Rename folder"
                onClick={(e) => { e.stopPropagation(); setRenameValue(folder.name); setRenaming(true); }}
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                className="w-5 h-5 rounded hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-600"
                title="Delete folder"
                onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
      {expanded && (
        <div>
          {childFolders.map((cf) => (
            <FolderNode
              key={cf.id}
              folder={cf}
              allFolders={allFolders}
              allFiles={allFiles}
              selectedFileId={selectedFileId}
              depth={depth + 1}
              onFileSelect={onFileSelect}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              onRenameFile={onRenameFile}
              onMoveFile={onMoveFile}
              onDeleteFile={onDeleteFile}
            />
          ))}
          {childFiles.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              selected={selectedFileId === file.id}
              depth={depth + 1}
              folders={allFolders}
              onSelect={onFileSelect}
              onRename={onRenameFile}
              onMove={onMoveFile}
              onDelete={onDeleteFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  files,
  folders,
  selectedFileId,
  onFileSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onRenameFile,
  onMoveFile,
  onDeleteFile,
}: SidebarProps) {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const rootFiles = files.filter((f) => f.folderId === null);
  const rootFolders = folders.filter((f) => f.parentId === null);

  function commitCreate() {
    const trimmed = newFolderName.trim();
    if (trimmed) {
      onCreateFolder(trimmed, null);
    }
    setCreatingFolder(false);
    setNewFolderName("");
  }

  return (
    <aside className="w-[260px] shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <span className="text-sm font-semibold text-gray-800">Documents</span>
        </div>
        <button
          className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
          title="New folder"
          onClick={() => { setCreatingFolder(true); setNewFolderName(""); }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1.5 px-1.5">
        {creatingFolder && (
          <input
            autoFocus
            className="w-full text-xs border border-indigo-400 rounded px-2 py-1 outline-none mb-1"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onBlur={commitCreate}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitCreate();
              if (e.key === "Escape") { setCreatingFolder(false); setNewFolderName(""); }
            }}
          />
        )}
        {rootFiles.length === 0 && rootFolders.length === 0 && !creatingFolder ? (
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
                folders={folders}
                onSelect={onFileSelect}
                onRename={onRenameFile}
                onMove={onMoveFile}
                onDelete={onDeleteFile}
              />
            ))}
            {rootFolders.map((folder) => (
              <FolderNode
                key={folder.id}
                folder={folder}
                allFolders={folders}
                allFiles={files}
                selectedFileId={selectedFileId}
                onFileSelect={onFileSelect}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
                onRenameFile={onRenameFile}
                onMoveFile={onMoveFile}
                onDeleteFile={onDeleteFile}
              />
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
