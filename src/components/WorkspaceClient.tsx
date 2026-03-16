"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { DocFile, Folder } from "@/lib/types";
import type { Session } from "next-auth";

interface WorkspaceClientProps {
  user: Session["user"];
}

function parseDates(file: DocFile): DocFile {
  return {
    ...file,
    updatedAt: new Date(file.updatedAt),
    history: (file.history ?? []).map((h) => ({ ...h, date: new Date(h.date) })),
  };
}

export default function WorkspaceClient({ user }: WorkspaceClientProps) {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocFile | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const refreshFiles = useCallback(async () => {
    const res = await fetch("/api/files");
    if (res.ok) {
      const data: DocFile[] = await res.json();
      const parsed = data.map(parseDates);
      setFiles(parsed);
      setSelectedFile((prev) => {
        if (prev) {
          const updated = parsed.find((f) => f.id === prev.id);
          return updated ?? (parsed.length > 0 ? parsed[0] : null);
        }
        return parsed.length > 0 ? parsed[0] : null;
      });
    }
  }, []);

  const refreshFolders = useCallback(async () => {
    const res = await fetch("/api/folders");
    if (res.ok) {
      const data: Folder[] = await res.json();
      setFolders(data);
    }
  }, []);

  useEffect(() => {
    refreshFiles();
    refreshFolders();
  }, [refreshFiles, refreshFolders]);

  // Cmd+K / Ctrl+K → focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleDeleteFile = useCallback(async (id: string) => {
    await fetch(`/api/files/${id}`, { method: "DELETE" });
    await refreshFiles();
    setSelectedFile((prev) => (prev?.id === id ? null : prev));
  }, [refreshFiles]);

  const handleSaveFile = useCallback(async (id: string, content: string) => {
    const res = await fetch(`/api/files/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const updated = parseDates(await res.json() as DocFile);
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
      setSelectedFile((prev) => (prev?.id === id ? updated : prev));
    }
  }, []);

  const handleRestoreFile = useCallback(async (id: string, version: number) => {
    const res = await fetch(`/api/files/${id}/rollback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version }),
    });
    if (res.ok) {
      const updated = parseDates(await res.json() as DocFile);
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
      setSelectedFile((prev) => (prev?.id === id ? updated : prev));
    }
  }, []);

  const handleCreateFolder = useCallback(async (name: string, parentId: string | null) => {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId }),
    });
    if (res.ok) await refreshFolders();
  }, [refreshFolders]);

  const handleRenameFolder = useCallback(async (id: string, name: string) => {
    const res = await fetch(`/api/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) await refreshFolders();
  }, [refreshFolders]);

  const handleDeleteFolder = useCallback(async (id: string) => {
    const res = await fetch(`/api/folders/${id}`, { method: "DELETE" });
    if (res.ok) {
      await refreshFolders();
      await refreshFiles();
    }
  }, [refreshFolders, refreshFiles]);

  const handleRenameFile = useCallback(async (id: string, name: string) => {
    const res = await fetch(`/api/files/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const updated = parseDates(await res.json() as DocFile);
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
      setSelectedFile((prev) => (prev?.id === id ? updated : prev));
    }
  }, []);

  const handleMoveFile = useCallback(async (id: string, folderId: string | null) => {
    const res = await fetch(`/api/files/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId }),
    });
    if (res.ok) {
      const updated = parseDates(await res.json() as DocFile);
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
      setSelectedFile((prev) => (prev?.id === id ? updated : prev));
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <TopNavbar
        user={user}
        files={files}
        folders={folders}
        onFileSelect={setSelectedFile}
        onUploadComplete={refreshFiles}
        searchInputRef={searchInputRef}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          files={files}
          folders={folders}
          selectedFileId={selectedFile?.id ?? null}
          onFileSelect={setSelectedFile}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          onRenameFile={handleRenameFile}
          onMoveFile={handleMoveFile}
          onDeleteFile={handleDeleteFile}
        />
        <MainContent
          file={selectedFile}
          onDeleteFile={handleDeleteFile}
          onSaveFile={handleSaveFile}
          onRestoreFile={handleRestoreFile}
        />
      </div>
    </div>
  );
}
